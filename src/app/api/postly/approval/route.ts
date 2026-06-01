import { NextResponse } from "next/server";
import { PostlyApprovalStatus, PostlyContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { asString, readJson, requirePostlyCompany, writeAgentLog } from "@/lib/postly";

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
  const context = await requirePostlyCompany();
  if ("response" in context) return context.response;

  const body = await readJson(request);
  const contentItemId = asString(body.contentItemId);
  if (!contentItemId) {
    return NextResponse.json({ error: "contentItemId is required" }, { status: 400 });
  }

  const item = await prisma.contentItem.findFirst({ where: { id: contentItemId, companyId: context.company.id } });
  if (!item) return NextResponse.json({ error: "Content item not found" }, { status: 404 });

  const status = approvalStatus(body.status);
  const approval = await prisma.approvalRequest.create({
    data: {
      contentItemId: item.id,
      telegramChatId: asString(body.telegramChatId),
      telegramMessageId: asString(body.telegramMessageId),
      status,
      approvedAt: status === PostlyApprovalStatus.APPROVED ? new Date() : undefined,
      revisionNote: asString(body.revisionNote),
    },
  });

  const updatedItem = await prisma.contentItem.update({
    where: { id: item.id },
    data: {
      status: itemStatus(status),
      telegramMessageId: asString(body.telegramMessageId) ?? item.telegramMessageId,
      errorMessage: status === PostlyApprovalStatus.REJECTED ? asString(body.revisionNote) : undefined,
    },
  });

  await writeAgentLog({
    companyId: context.company.id,
    contentItemId: item.id,
    agentName: "Postly API",
    action: "approval.record",
    status,
    message: `Approval status recorded: ${status}`,
    rawPayload: body,
  });

  return NextResponse.json({ ok: true, approval, item: updatedItem });
}
