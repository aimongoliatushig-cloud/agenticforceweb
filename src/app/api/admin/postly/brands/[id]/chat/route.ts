import { NextResponse } from "next/server";
import { PostlyContentStatus, PostlyContentType, PostlyPlanStatus } from "@prisma/client";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { asString, readJson, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  const allowed = await isAdminUser();
  if (!allowed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

function contentType(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return Object.values(PostlyContentType).includes(normalized as PostlyContentType)
    ? (normalized as PostlyContentType)
    : PostlyContentType.POSTER;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

async function triggerHermes(input: { companyId: string; contentItemId: string; prompt: string }) {
  const baseUrl = process.env.HERMES_POSTLY_PROMPT_URL || (process.env.HERMES_BASE_URL ? `${process.env.HERMES_BASE_URL.replace(/\/$/, "")}/webhooks/postly-prompt` : "");
  const secret = process.env.HERMES_AGENT_SECRET;
  if (!baseUrl || !secret) return false;

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hermes-secret": secret,
      },
      body: JSON.stringify(input),
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await readJson(request);
  const prompt = asString(body.prompt);
  if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

  const company = await prisma.companyProfile.findUnique({
    where: { id },
    include: {
      brandGuideline: true,
      productsServicesPostly: true,
      brandTemplates: true,
      socialAccounts: true,
    },
  });
  if (!company) return NextResponse.json({ error: "Brand not found" }, { status: 404 });

  const now = new Date();
  const month = monthKey(now);
  const plan = await prisma.contentPlan.upsert({
    where: {
      id:
        (
          await prisma.contentPlan.findFirst({
            where: { companyId: id, month, status: { in: [PostlyPlanStatus.DRAFT, PostlyPlanStatus.ACTIVE] } },
            select: { id: true },
          })
        )?.id || "__missing__",
    },
    update: {},
    create: {
      companyId: id,
      month,
      totalPosts: 1,
      strategyNote: `Admin Hermes chat prompts for ${company.companyName ?? id}`,
      status: PostlyPlanStatus.ACTIVE,
    },
  }).catch(async () => {
    return prisma.contentPlan.create({
      data: {
        companyId: id,
        month,
        totalPosts: 1,
        strategyNote: `Admin Hermes chat prompts for ${company.companyName ?? id}`,
        status: PostlyPlanStatus.ACTIVE,
      },
    });
  });

  const item = await prisma.contentItem.create({
    data: {
      companyId: id,
      contentPlanId: plan.id,
      templateId: asString(body.templateId),
      contentType: contentType(body.contentType),
      category: "admin_chat",
      title: `Hermes prompt: ${prompt.slice(0, 64)}${prompt.length > 64 ? "..." : ""}`,
      creativeDirection: `Admin prompt for Hermes:\n${prompt}`,
      status: PostlyContentStatus.PLANNED,
    },
    include: { template: true },
  });

  const hermesTriggered = await triggerHermes({ companyId: id, contentItemId: item.id, prompt });

  const log = await prisma.agentLog.create({
    data: {
      companyId: id,
      contentItemId: item.id,
      agentName: "Postly Admin",
      action: "admin_chat.prompt",
      status: hermesTriggered ? "sent" : "queued",
      message: hermesTriggered ? "Admin prompt sent to Hermes" : "Admin prompt queued for Hermes cron",
      rawPayload: {
        prompt,
        contentType: item.contentType,
        templateId: item.templateId,
        brand: {
          companyName: company.companyName,
          businessType: company.businessType,
          guideline: company.brandGuideline,
          products: company.productsServicesPostly,
          templates: company.brandTemplates,
          socialAccounts: company.socialAccounts.map((account) => ({ platform: account.platform, pageName: account.pageName, status: account.status })),
        },
      },
    },
  });

  await writeAgentLog({
    companyId: id,
    contentItemId: item.id,
    agentName: "Hermes",
    action: "postly.prompt.request",
    status: hermesTriggered ? "sent" : "queued",
    message: `Hermes prompt ${hermesTriggered ? "sent" : "queued"} for ${company.companyName ?? id}`,
    rawPayload: { contentItemId: item.id },
  });

  return NextResponse.json({ ok: true, item, log, hermesTriggered }, { status: 201 });
}
