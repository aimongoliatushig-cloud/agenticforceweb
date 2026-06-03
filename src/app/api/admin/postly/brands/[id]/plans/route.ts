import { NextResponse } from "next/server";
import { PostlyPlanStatus } from "@prisma/client";
import { getCurrentUserId, isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { asString, readJson, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  const allowed = await isAdminUser();
  if (!allowed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function asCount(value: unknown) {
  const text = asString(value);
  if (!text) return 0;
  const count = Number.parseInt(text, 10);
  return Number.isFinite(count) && count > 0 ? count : 0;
}

function planStatus(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return Object.values(PostlyPlanStatus).includes(normalized as PostlyPlanStatus)
    ? (normalized as PostlyPlanStatus)
    : PostlyPlanStatus.ACTIVE;
}

function inferCounts(note: string) {
  const postMatch = note.match(/(\d+)\s*(?:post|poster|пост|постер)/i);
  const reelMatch = note.match(/(\d+)\s*(?:reel|reels|рийл)/i);
  const carouselMatch = note.match(/(\d+)\s*(?:carousel|carousels|карусел)/i);

  return {
    totalPosts: postMatch ? Number.parseInt(postMatch[1], 10) : 0,
    totalReels: reelMatch ? Number.parseInt(reelMatch[1], 10) : 0,
    totalCarousels: carouselMatch ? Number.parseInt(carouselMatch[1], 10) : 0,
  };
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await readJson(request);
  const company = await prisma.companyProfile.findUnique({ where: { id }, select: { id: true, companyName: true } });
  if (!company) return NextResponse.json({ error: "Brand not found" }, { status: 404 });

  const strategyNote = asString(body.strategyNote) || asString(body.prompt);
  if (!strategyNote) return NextResponse.json({ error: "Plan text is required" }, { status: 400 });

  const month = asString(body.month) || currentMonth();
  const inferred = inferCounts(strategyNote);
  const source = asString(body.source) || "manual";
  const clerkUserId = await getCurrentUserId();
  const createdBy = clerkUserId ? await prisma.user.findUnique({ where: { clerkUserId }, select: { id: true } }) : null;
  const existing = await prisma.contentPlan.findFirst({
    where: { companyId: id, month },
    select: { id: true },
    orderBy: { createdAt: "desc" },
  });

  const data = {
    month,
    totalPosts: asCount(body.totalPosts) || inferred.totalPosts,
    totalReels: asCount(body.totalReels) || inferred.totalReels,
    totalCarousels: asCount(body.totalCarousels) || inferred.totalCarousels,
    strategyNote,
    status: planStatus(body.status),
  };

  const plan = existing
    ? await prisma.contentPlan.update({
        where: { id: existing.id },
        data,
        include: { _count: { select: { contentItems: true } } },
      })
    : await prisma.contentPlan.create({
        data: {
          companyId: id,
          createdById: createdBy?.id,
          ...data,
        },
        include: { _count: { select: { contentItems: true } } },
      });

  const log = await prisma.agentLog.create({
    data: {
      companyId: id,
      agentName: source === "hermes" ? "Hermes" : "Postly Admin",
      action: source === "hermes" ? "content_plan.hermes_save" : "content_plan.manual_save",
      status: "success",
      message: `${company.companyName || "Brand"} ${month} plan saved`,
      rawPayload: { ...body, companyId: id, planId: plan.id, source },
    },
  });

  let chatMessages = null;
  if (source === "hermes") {
    await prisma.hermesChatMessage.createMany({
      data: [
        {
          companyId: id,
          sender: "admin",
          message: strategyNote,
          status: "plan_prompt",
          metadata: { month, planId: plan.id },
        },
        {
          companyId: id,
          sender: "hermes",
          message: `${company.companyName || "Brand"}-ийн ${month} сарын төлөвлөгөөг хадгаллаа. Нийт: ${plan.totalPosts} пост, ${plan.totalReels} reel, ${plan.totalCarousels} carousel.`,
          status: "plan_saved",
          metadata: { month, planId: plan.id },
        },
      ],
    });
    chatMessages = await prisma.hermesChatMessage.findMany({
      where: { companyId: id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  await writeAgentLog({
    companyId: id,
    agentName: source === "hermes" ? "Hermes" : "Postly Admin",
    action: "content_plan.save",
    status: "success",
    message: `${month} plan saved`,
    rawPayload: { planId: plan.id, source },
  });

  return NextResponse.json({ ok: true, plan, log, chatMessages }, { status: existing ? 200 : 201 });
}
