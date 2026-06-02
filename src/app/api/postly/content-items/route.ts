import { NextResponse } from "next/server";
import { PostlyContentStatus, PostlyContentType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { asDate, asString, readJson, requirePostlyCompany, writeAgentLog } from "@/lib/postly";
import { parsePostlyContentStatus } from "@/lib/postly-status";

export const dynamic = "force-dynamic";

function contentType(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return Object.values(PostlyContentType).includes(normalized as PostlyContentType)
    ? (normalized as PostlyContentType)
    : PostlyContentType.POSTER;
}

export async function GET(request: Request) {
  const context = await requirePostlyCompany();
  if ("response" in context) return context.response;

  const { searchParams } = new URL(request.url);
  const status = parsePostlyContentStatus(searchParams.get("status"), PostlyContentStatus.PLANNED);
  const hasStatusFilter = searchParams.has("status");

  const items = await prisma.contentItem.findMany({
    where: {
      companyId: context.company.id,
      status: hasStatusFilter ? status : undefined,
    },
    orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
    include: { assets: true, approvalRequests: true, postingJobs: true },
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const context = await requirePostlyCompany();
  if ("response" in context) return context.response;

  const body = await readJson(request);
  const item = await prisma.contentItem.create({
    data: {
      companyId: context.company.id,
      contentPlanId: asString(body.contentPlanId),
      templateId: asString(body.templateId),
      contentType: contentType(body.contentType),
      category: asString(body.category),
      title: asString(body.title),
      caption: asString(body.caption),
      headline: asString(body.headline),
      imagePrompt: asString(body.imagePrompt),
      creativeDirection: asString(body.creativeDirection),
      scheduledAt: asDate(body.scheduledAt),
      status: parsePostlyContentStatus(body.status, PostlyContentStatus.PLANNED),
    },
  });

  await writeAgentLog({
    companyId: context.company.id,
    contentItemId: item.id,
    agentName: "Postly API",
    action: "content_item.create",
    status: "success",
    message: `Content item created: ${item.title ?? item.id}`,
    rawPayload: body,
  });

  return NextResponse.json({ ok: true, item }, { status: 201 });
}
