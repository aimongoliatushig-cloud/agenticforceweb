import { NextResponse } from "next/server";
import { PostlyContentStatus, PostlyContentType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { asDate, asString, readJson, requirePostlyCompany, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

function contentType(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return normalized && Object.values(PostlyContentType).includes(normalized as PostlyContentType)
    ? (normalized as PostlyContentType)
    : undefined;
}

function contentStatus(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return normalized && Object.values(PostlyContentStatus).includes(normalized as PostlyContentStatus)
    ? (normalized as PostlyContentStatus)
    : undefined;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const authContext = await requirePostlyCompany();
  if ("response" in authContext) return authContext.response;

  const { id } = await context.params;
  const item = await prisma.contentItem.findFirst({
    where: { id, companyId: authContext.company.id },
    include: { assets: true, approvalRequests: true, postingJobs: true, postingLogs: true, agentLogs: true },
  });

  if (!item) return NextResponse.json({ error: "Content item not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const authContext = await requirePostlyCompany();
  if ("response" in authContext) return authContext.response;

  const { id } = await context.params;
  const existing = await prisma.contentItem.findFirst({ where: { id, companyId: authContext.company.id } });
  if (!existing) return NextResponse.json({ error: "Content item not found" }, { status: 404 });

  const body = await readJson(request);
  const item = await prisma.contentItem.update({
    where: { id },
    data: {
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
      status: contentStatus(body.status),
      telegramMessageId: asString(body.telegramMessageId),
      makeStatus: asString(body.makeStatus),
      facebookPostUrl: asString(body.facebookPostUrl),
      instagramPostUrl: asString(body.instagramPostUrl),
      errorMessage: asString(body.errorMessage),
    },
  });

  await writeAgentLog({
    companyId: authContext.company.id,
    contentItemId: item.id,
    agentName: "Postly API",
    action: "content_item.update",
    status: "success",
    message: `Content item updated: ${item.title ?? item.id}`,
    rawPayload: body,
  });

  return NextResponse.json({ ok: true, item });
}
