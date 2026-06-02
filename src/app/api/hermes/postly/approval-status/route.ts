import { NextResponse } from "next/server";
import { PostlyApprovalStatus, PostlyContentStatus } from "@prisma/client";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { asString, readJson, requireSecret, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

function approvalStatus(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return Object.values(PostlyApprovalStatus).includes(normalized as PostlyApprovalStatus)
    ? (normalized as PostlyApprovalStatus)
    : PostlyApprovalStatus.WAITING;
}

function itemStatus(status: PostlyApprovalStatus) {
  if (status === PostlyApprovalStatus.APPROVED) return PostlyContentStatus.APPROVED;
  if (status === PostlyApprovalStatus.REJECTED) return PostlyContentStatus.REJECTED;
  if (status === PostlyApprovalStatus.NEEDS_REVISION) return PostlyContentStatus.NEEDS_REVISION;
  return PostlyContentStatus.WAITING_APPROVAL;
}

export async function POST(request: Request) {
  const denied = requireSecret(request, "HERMES_AGENT_SECRET", "x-hermes-secret");
  if (denied) return denied;
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });

  const body = await readJson(request);
  const contentItemId = asString(body.contentItemId);
  if (!contentItemId) {
    return NextResponse.json({ error: "contentItemId is required" }, { status: 400 });
  }

  const existing = await prisma.contentItem.findUnique({ where: { id: contentItemId } });
  if (!existing) return NextResponse.json({ error: "Content item not found" }, { status: 404 });

  const status = approvalStatus(body.status);
  const approval = await prisma.approvalRequest.create({
    data: {
      contentItemId,
      telegramChatId: asString(body.telegramChatId),
      telegramMessageId: asString(body.telegramMessageId),
      status,
      approvedAt: status === PostlyApprovalStatus.APPROVED ? new Date() : undefined,
      revisionNote: asString(body.revisionNote),
    },
  });

  const item = await prisma.contentItem.update({
    where: { id: contentItemId },
    data: {
      status: itemStatus(status),
      telegramMessageId: asString(body.telegramMessageId) ?? existing.telegramMessageId,
      errorMessage: status === PostlyApprovalStatus.REJECTED ? asString(body.revisionNote) : undefined,
    },
  });

  await writeAgentLog({
    companyId: item.companyId,
    contentItemId: item.id,
    agentName: asString(body.agentName) || "Hermes",
    action: "postly.approval_status.record",
    status,
    message: `Telegram approval result: ${status}`,
    rawPayload: body,
  });

  return NextResponse.json({ ok: true, approval, item });
}
