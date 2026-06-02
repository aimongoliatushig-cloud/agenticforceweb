import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabaseUrl, prisma } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const approvalSchema = z.object({
  contentItemId: z.string().min(1),
  telegramChatId: z.string().optional(),
  telegramMessageId: z.string().optional(),
  status: z.enum(["APPROVED", "REJECTED", "REVISION"]),
  revisionNote: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const expected = process.env.HERMES_AGENT_SECRET;
  const provided = request.headers.get("x-hermes-secret");
  if (!expected || provided !== expected) return unauthorized();

  const body = await request.json().catch(() => null);
  const input = approvalSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: input.error.flatten() },
      { status: 400 }
    );
  }

  const { contentItemId, telegramChatId, telegramMessageId, status, revisionNote } = input.data;

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      stored: false,
      item: { id: contentItemId, status, note: "DB not configured" },
    });
  }

  const item = await prisma.postlyContentItem.findUnique({
    where: { id: contentItemId },
  });

  if (!item) {
    return NextResponse.json(
      { error: "Content item not found", contentItemId },
      { status: 404 }
    );
  }

  // Build approval entry
  const approvalEntry = {
    status,
    timestamp: new Date().toISOString(),
    telegramMessageId: telegramMessageId || null,
    revisionNote: revisionNote || null,
  };

  const existingHistory = (item.approvalHistory as any[]) || [];
  existingHistory.push(approvalEntry);

  const updateData: any = {
    status: status as any,
    approvalHistory: existingHistory,
    revisionNote: revisionNote || undefined,
  };
  if (telegramChatId) updateData.telegramChatId = telegramChatId;
  if (telegramMessageId) updateData.telegramMessageId = telegramMessageId;

  const updated = await prisma.postlyContentItem.update({
    where: { id: contentItemId },
    data: updateData,
  });

  return NextResponse.json({ ok: true, item: updated });
}
