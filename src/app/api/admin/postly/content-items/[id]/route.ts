import { NextResponse } from "next/server";
import { PostlyApprovalStatus, PostlyContentStatus, PostlyPlatform } from "@prisma/client";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { asDate, asString, readJson, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  const allowed = await isAdminUser();
  if (!allowed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

function contentStatus(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return normalized && Object.values(PostlyContentStatus).includes(normalized as PostlyContentStatus)
    ? (normalized as PostlyContentStatus)
    : undefined;
}

function approvalStatusFor(status?: PostlyContentStatus) {
  if (status === PostlyContentStatus.APPROVED) return PostlyApprovalStatus.APPROVED;
  if (status === PostlyContentStatus.REJECTED) return PostlyApprovalStatus.REJECTED;
  if (status === PostlyContentStatus.NEEDS_REVISION) return PostlyApprovalStatus.NEEDS_REVISION;
  if (status === PostlyContentStatus.WAITING_APPROVAL) return PostlyApprovalStatus.WAITING;
  return undefined;
}

function platform(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return normalized && Object.values(PostlyPlatform).includes(normalized as PostlyPlatform)
    ? (normalized as PostlyPlatform)
    : undefined;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await readJson(request);
  const existing = await prisma.contentItem.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Content item not found" }, { status: 404 });

  const nextStatus = contentStatus(body.status);
  const revisionNote = asString(body.revisionNote);
  const item = await prisma.contentItem.update({
    where: { id },
    data: {
      title: asString(body.title),
      caption: asString(body.caption),
      headline: asString(body.headline),
      imagePrompt: asString(body.imagePrompt),
      creativeDirection: asString(body.creativeDirection),
      category: asString(body.category),
      scheduledAt: asDate(body.scheduledAt),
      status: nextStatus,
      errorMessage: nextStatus === PostlyContentStatus.REJECTED ? revisionNote : undefined,
      facebookPostUrl: asString(body.facebookPostUrl),
      instagramPostUrl: asString(body.instagramPostUrl),
    },
    include: {
      company: true,
      template: true,
      approvalRequests: { orderBy: { createdAt: "desc" }, take: 3 },
      postingJobs: { orderBy: { createdAt: "desc" }, take: 3 },
      postingLogs: { orderBy: { createdAt: "desc" }, take: 3 },
    },
  });

  const approvalStatus = approvalStatusFor(nextStatus);
  if (approvalStatus) {
    await prisma.approvalRequest.create({
      data: {
        contentItemId: item.id,
        status: approvalStatus,
        approvedAt: approvalStatus === PostlyApprovalStatus.APPROVED ? new Date() : undefined,
        revisionNote,
      },
    });
  }

  if (nextStatus === PostlyContentStatus.POSTED) {
    await prisma.postingLog.create({
      data: {
        companyId: item.companyId,
        contentItemId: item.id,
        platform: platform(body.platform),
        status: "posted",
        postedUrl: asString(body.postedUrl) || asString(body.facebookPostUrl) || asString(body.instagramPostUrl),
        rawResponse: { source: "postly_admin", note: asString(body.publishNote) },
      },
    });
  }

  await writeAgentLog({
    companyId: item.companyId,
    contentItemId: item.id,
    agentName: "Postly Admin",
    action: "content_item.update",
    status: nextStatus || "edited",
    message: `Admin updated content item ${item.title ?? item.id}`,
    rawPayload: body,
  });

  return NextResponse.json({ ok: true, item });
}
