import { NextResponse } from "next/server";
import { PostlyContentStatus } from "@prisma/client";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { asString, readJson, requireSecret, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

function nextStatus(body: Record<string, unknown>) {
  const requested = asString(body.status)?.toUpperCase();
  if (requested === PostlyContentStatus.WAITING_APPROVAL) return PostlyContentStatus.WAITING_APPROVAL;
  if (requested === PostlyContentStatus.DRAFT_GENERATED) return PostlyContentStatus.DRAFT_GENERATED;
  return asString(body.telegramMessageId) ? PostlyContentStatus.WAITING_APPROVAL : PostlyContentStatus.DRAFT_GENERATED;
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

  const status = nextStatus(body);
  const item = await prisma.contentItem.update({
    where: { id: contentItemId },
    data: {
      title: asString(body.title),
      caption: asString(body.caption),
      headline: asString(body.headline),
      imagePrompt: asString(body.imagePrompt),
      creativeDirection: asString(body.creativeDirection),
      templateId: asString(body.templateId),
      telegramMessageId: asString(body.telegramMessageId),
      status,
    },
  });

  await writeAgentLog({
    companyId: item.companyId,
    contentItemId: item.id,
    agentName: asString(body.agentName) || "Hermes",
    action: "postly.draft.upsert",
    status,
    message: `Hermes draft saved for ${item.title ?? item.id}`,
    rawPayload: body,
  });

  return NextResponse.json({ ok: true, item });
}
