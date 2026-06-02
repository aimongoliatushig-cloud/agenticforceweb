import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabaseUrl, prisma } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const sentSchema = z.object({
  contentItemId: z.string().min(1),
  makeWebhookResponse: z.any().optional(),
  status: z.string().optional().default("SENT_TO_MAKE"),
});

export async function POST(request: NextRequest) {
  const expected = process.env.HERMES_AGENT_SECRET;
  const provided = request.headers.get("x-hermes-secret");
  if (!expected || provided !== expected) return unauthorized();

  const body = await request.json().catch(() => null);
  const input = sentSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: input.error.flatten() },
      { status: 400 }
    );
  }

  const { contentItemId, makeWebhookResponse, status } = input.data;

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

  // Build posting job entry
  const postingJob = {
    platform: "MAKE",
    status: "SENT_TO_MAKE",
    timestamp: new Date().toISOString(),
    response: makeWebhookResponse || null,
  };

  const existingJobs = (item.postingJobs as any[]) || [];
  existingJobs.push(postingJob);

  const updated = await prisma.postlyContentItem.update({
    where: { id: contentItemId },
    data: {
      status: status as any,
      makeStatus: "sent_to_make",
      postingJobs: existingJobs,
    },
  });

  return NextResponse.json({ ok: true, item: updated });
}
