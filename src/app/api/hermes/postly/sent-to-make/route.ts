import { NextResponse } from "next/server";
import { PostlyContentStatus, PostlyPlatform, PostlyPostingStatus } from "@prisma/client";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { asString, readJson, requireSecret, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

function platforms(value: unknown) {
  if (!Array.isArray(value)) return [PostlyPlatform.FACEBOOK, PostlyPlatform.INSTAGRAM];

  const selected = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.toUpperCase())
    .filter((item): item is PostlyPlatform => Object.values(PostlyPlatform).includes(item as PostlyPlatform));

  return selected.length ? selected : [PostlyPlatform.FACEBOOK, PostlyPlatform.INSTAGRAM];
}

export async function POST(request: Request) {
  const denied = requireSecret(request, "HERMES_AGENT_SECRET", "x-hermes-secret");
  if (denied) return denied;
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });

  const body = await readJson(request);
  const contentItemId = asString(body.contentItemId) || asString(body.content_item_id);
  if (!contentItemId) {
    return NextResponse.json({ error: "contentItemId is required" }, { status: 400 });
  }

  const item = await prisma.contentItem.findUnique({ where: { id: contentItemId } });
  if (!item) return NextResponse.json({ error: "Content item not found" }, { status: 404 });

  const selectedPlatforms = platforms(body.platforms);
  const rawResponse = body.makeWebhookResponse ?? body.make_webhook_response ?? body;

  const result = await prisma.$transaction(async (tx) => {
    const updatedItem = await tx.contentItem.update({
      where: { id: item.id },
      data: {
        status: PostlyContentStatus.SENT_TO_MAKE,
        makeStatus: asString(body.makeStatus) || "sent_to_make",
        errorMessage: null,
      },
    });

    const jobs = await Promise.all(
      selectedPlatforms.map(async (platform) => {
        const existing = await tx.postingJob.findFirst({
          where: { contentItemId: item.id, platform },
        });

        if (existing) {
          return tx.postingJob.update({
            where: { id: existing.id },
            data: {
              companyId: item.companyId,
              scheduledAt: item.scheduledAt,
              status: PostlyPostingStatus.SENT_TO_MAKE,
              makeWebhookResponse: rawResponse as object,
            },
          });
        }

        return tx.postingJob.create({
          data: {
            companyId: item.companyId,
            contentItemId: item.id,
            platform,
            scheduledAt: item.scheduledAt,
            status: PostlyPostingStatus.SENT_TO_MAKE,
            makeWebhookResponse: rawResponse as object,
          },
        });
      }),
    );

    await tx.postingLog.create({
      data: {
        companyId: item.companyId,
        contentItemId: item.id,
        status: PostlyContentStatus.SENT_TO_MAKE,
        rawResponse: rawResponse as object,
      },
    });

    return { item: updatedItem, jobs };
  });

  await writeAgentLog({
    companyId: item.companyId,
    contentItemId: item.id,
    agentName: asString(body.agentName) || "Hermes",
    action: "postly.sent_to_make.record",
    status: PostlyContentStatus.SENT_TO_MAKE,
    message: `Hermes sent item to Make.com for ${selectedPlatforms.join(", ")}`,
    rawPayload: body,
  });

  return NextResponse.json({ ok: true, ...result });
}
