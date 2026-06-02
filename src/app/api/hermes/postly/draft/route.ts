import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabaseUrl, prisma } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const draftSchema = z.object({
  contentItemId: z.string().min(1),
  title: z.string().optional().default(""),
  headline: z.string().optional().default(""),
  caption: z.string().optional().default(""),
  imagePrompt: z.string().optional().default(""),
  creativeDirection: z.string().optional().default(""),
  templateId: z.string().optional(),
  telegramMessageId: z.string().optional(),
  agentName: z.string().optional().default("Hermes"),
  status: z.enum(["DRAFT", "WAITING_APPROVAL"]).default("WAITING_APPROVAL"),
});

export async function POST(request: NextRequest) {
  const expected = process.env.HERMES_AGENT_SECRET;
  const provided = request.headers.get("x-hermes-secret");
  if (!expected || provided !== expected) return unauthorized();

  const body = await request.json().catch(() => null);
  const input = draftSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: input.error.flatten() },
      { status: 400 }
    );
  }

  const { contentItemId, title, headline, caption, imagePrompt, creativeDirection, templateId, telegramMessageId, agentName, status } = input.data;

  if (!hasDatabaseUrl()) {
    // Return success even without DB for dev testing
    return NextResponse.json({
      ok: true,
      stored: false,
      item: {
        id: contentItemId,
        title,
        status,
        agentName,
        note: "DB not configured — draft accepted in-memory",
      },
    });
  }

  // Find the content item
  const item = await prisma.postlyContentItem.findUnique({
    where: { id: contentItemId },
  });

  if (!item) {
    return NextResponse.json(
      { error: "Content item not found", contentItemId },
      { status: 404 }
    );
  }

  // Update the item with generated content
  const updated = await prisma.postlyContentItem.update({
    where: { id: contentItemId },
    data: {
      title: title || item.title,
      headline: headline || undefined,
      caption: caption || undefined,
      imagePrompt: imagePrompt || undefined,
      creativeDirection: creativeDirection || undefined,
      templateId: templateId || undefined,
      telegramMessageId: telegramMessageId || undefined,
      agentName: agentName || undefined,
      status: status as any,
    },
  });

  return NextResponse.json({ ok: true, item: updated });
}
