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

function promptTopic(prompt: string) {
  return prompt
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/g, "")
    .slice(0, 80);
}

function extractLaunchLine(prompt: string) {
  const match = prompt.match(/(\d{1,2})\s*(?:sariin|saryn|sar|сарын|сар)\s*(\d{1,2})/i);
  if (!match) return null;

  const dateLine = `${match[1]}-р сарын ${match[2]}-наас`;
  const mentionsLaunch = /uil ajilgaa|үйл ажиллагаа|ehl|эхл/i.test(prompt);
  return mentionsLaunch ? `${dateLine} үйл ажиллагаа эхэлнэ` : dateLine;
}

function buildHermesDraft(input: {
  prompt: string;
  company: {
    companyName: string | null;
    businessType: string | null;
    description: string | null;
    brandGuideline: { toneOfVoice?: string | null; visualStyle?: string | null; brandColors: string[] } | null;
    productsServicesPostly: { name: string; benefits: string[]; targetCustomer: string | null }[];
  };
  type: PostlyContentType;
  templateName?: string | null;
}) {
  const brandName = input.company.companyName || "энэ брэнд";
  const product = input.company.productsServicesPostly[0];
  const topic = promptTopic(input.prompt);
  const launchLine = extractLaunchLine(input.prompt);
  const tone = input.company.brandGuideline?.toneOfVoice || "ойлгомжтой, итгэл төрүүлэх";
  const colors = input.company.brandGuideline?.brandColors?.slice(0, 3).join(", ") || "brand өнгөнүүд";
  const offer = product?.name || input.company.businessType || "шинэ санал";
  const benefit = product?.benefits?.[0] || "брэндийн үнэ цэнийг товч, тод харуулах";
  const audience = product?.targetCustomer || "зорилтот хэрэглэгч";
  const title = `${brandName} - ${launchLine || topic}`;
  const headline = launchLine || `${offer}-ийг ${audience}-д хүргэх санаа`;
  const caption = [
    `${brandName}-ийн ${offer}-ийг онцлох постын draft:`,
    "",
    `${benefit}. ${tone} өнгө аястайгаар хэрэглэгчид шууд ойлгогдох мессеж өгнө.`,
    "",
    "CTA: Дэлгэрэнгүй мэдээлэл авах эсвэл захиалга өгөхөөр холбогдоорой.",
  ].join("\n");
  const imagePrompt = [
    `${brandName} brand ${input.type.toLowerCase()} visual.`,
    `Use ${colors}.`,
    input.company.brandGuideline?.visualStyle || "Premium, clean, product-focused composition.",
    input.templateName ? `Follow template style: ${input.templateName}.` : "Keep layout simple with strong headline space.",
    launchLine ? `Main poster message: ${launchLine}.` : "",
    `Subject: ${offer}.`,
  ].filter(Boolean).join(" ");
  const creativeDirection = [
    `Admin prompt: ${input.prompt}`,
    `Tone: ${tone}`,
    `Audience: ${audience}`,
    `Goal: ${benefit}`,
  ].join("\n");
  const chatReply = [
    `За, ойлголоо. ${brandName}-ийн context-ийг Hermes рүү илгээлээ.`,
    "",
    `Гарчиг: ${title}`,
    "",
    `Caption:`,
    caption,
    "",
    `Hermes image prompt draft: ${imagePrompt}`,
    "",
    "Дараагийн алхам: Hermes Kie.ai skill ашиглаад poster зураг generate хийнэ. Зураг бэлэн болмогц Content queue болон chat дээр автоматаар гарна.",
  ].join("\n");

  return { title, headline, caption, imagePrompt, creativeDirection, chatReply };
}

async function triggerHermes(input: Record<string, unknown>) {
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

  const origin = new URL(request.url).origin;
  const { id } = await params;
  const body = await readJson(request);
  const prompt = asString(body.prompt);
  if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  const selectedContentType = contentType(body.contentType);

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
  const selectedTemplateId = asString(body.templateId);
  const selectedTemplate = selectedTemplateId ? company.brandTemplates.find((template) => template.id === selectedTemplateId) : null;
  const draft = buildHermesDraft({
    prompt,
    company,
    type: selectedContentType,
    templateName: selectedTemplate?.name,
  });

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
      templateId: selectedTemplateId,
      contentType: selectedContentType,
      category: "admin_chat",
      title: draft.title,
      caption: draft.caption,
      headline: draft.headline,
      imagePrompt: draft.imagePrompt,
      creativeDirection: draft.creativeDirection,
      status: PostlyContentStatus.PLANNED,
    },
    include: { template: true },
  });

  const hermesTriggered = await triggerHermes({
    companyId: id,
    contentItemId: item.id,
    prompt,
    contentType: item.contentType,
    templateId: item.templateId,
    title: draft.title,
    caption: draft.caption,
    headline: draft.headline,
    imagePrompt: draft.imagePrompt,
    creativeDirection: draft.creativeDirection,
    callbackUrl: `${origin}/api/hermes/postly/draft`,
    instruction: "Generate the final image with Kie.ai using the Hermes kie-content-maker skill, then POST the generated image URL back to callbackUrl with imageUrl or assets[].fileUrl.",
    brand: {
      companyName: company.companyName,
      businessType: company.businessType,
      description: company.description,
      guideline: company.brandGuideline,
      products: company.productsServicesPostly,
      socialAccounts: company.socialAccounts.map((account) => ({ platform: account.platform, pageName: account.pageName, status: account.status })),
    },
    template: selectedTemplate
      ? {
          id: selectedTemplate.id,
          name: selectedTemplate.name,
          type: selectedTemplate.type,
          platform: selectedTemplate.platform,
          category: selectedTemplate.category,
          size: selectedTemplate.size,
          previewImageUrl: selectedTemplate.previewImageUrl,
          templateFileUrl: selectedTemplate.templateFileUrl,
        }
      : null,
  });

  await prisma.hermesChatMessage.createMany({
    data: [
      {
        companyId: id,
        contentItemId: item.id,
        sender: "admin",
        message: prompt,
        status: "sent",
        metadata: {
          contentType: item.contentType,
          templateId: item.templateId,
        },
      },
      {
        companyId: id,
        contentItemId: item.id,
        sender: "hermes",
        message: draft.chatReply,
        status: hermesTriggered ? "sent_to_hermes" : "queued",
        metadata: {
          contentType: item.contentType,
          templateId: item.templateId,
          templatePreviewUrl: selectedTemplate?.previewImageUrl || selectedTemplate?.templateFileUrl,
          hermesTriggered,
        },
      },
    ],
  });

  const chatMessages = await prisma.hermesChatMessage.findMany({
    where: { companyId: id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const log = await prisma.agentLog.create({
    data: {
      companyId: id,
      contentItemId: item.id,
      agentName: "Postly Admin",
      action: "admin_chat.prompt",
      status: hermesTriggered ? "sent_to_hermes" : "queued",
      message: hermesTriggered ? "Hermes prompt sent for Kie.ai image generation" : "Hermes prompt queued for Kie.ai image generation",
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
    status: hermesTriggered ? "sent_to_hermes" : "queued",
    message: `Hermes Kie.ai generation request ${hermesTriggered ? "sent" : "queued"} for ${company.companyName ?? id}`,
    rawPayload: { contentItemId: item.id },
  });

  return NextResponse.json({ ok: true, item, log, chatMessages, hermesTriggered }, { status: 201 });
}
