import { NextResponse } from "next/server";
import {
  Prisma,
  PostlyAssetSource,
  PostlyAssetType,
  PostlyContentStatus,
  PostlyPlatform,
  PostlyPostingStatus,
} from "@prisma/client";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { asString, makeIdempotencyKey, readRawJson, requireSecret, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

function contentStatus(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  if (normalized === "MEDIA_GENERATED") return PostlyContentStatus.MEDIA_GENERATED;
  if (normalized === "SCHEDULED") return PostlyContentStatus.SCHEDULED;
  if (normalized === "POSTED") return PostlyContentStatus.POSTED;
  if (normalized === "FAILED" || normalized === "MAKE_FAILED" || normalized === "MEDIA_FAILED" || normalized === "POSTING_FAILED") {
    return PostlyContentStatus.FAILED;
  }
  return PostlyContentStatus.MEDIA_GENERATED;
}

function postingStatus(value: unknown) {
  const status = contentStatus(value);
  if (status === PostlyContentStatus.POSTED) return PostlyPostingStatus.POSTED;
  if (status === PostlyContentStatus.SCHEDULED) return PostlyPostingStatus.SCHEDULED;
  if (status === PostlyContentStatus.FAILED) return PostlyPostingStatus.FAILED;
  return PostlyPostingStatus.SENT_TO_MAKE;
}

function platform(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return normalized && Object.values(PostlyPlatform).includes(normalized as PostlyPlatform)
    ? (normalized as PostlyPlatform)
    : undefined;
}

function assetType(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return normalized && Object.values(PostlyAssetType).includes(normalized as PostlyAssetType)
    ? (normalized as PostlyAssetType)
    : PostlyAssetType.IMAGE;
}

function assetInputs(body: Record<string, unknown>) {
  const assets = Array.isArray(body.assets) ? body.assets : [];
  const normalized = assets
    .filter((asset): asset is Record<string, unknown> => typeof asset === "object" && asset !== null)
    .map((asset) => ({
      fileUrl: asString(asset.fileUrl) || asString(asset.file_url) || asString(asset.url),
      assetType: assetType(asset.assetType ?? asset.asset_type),
      slideOrder: typeof asset.slideOrder === "number" ? asset.slideOrder : typeof asset.slide_order === "number" ? asset.slide_order : undefined,
    }))
    .filter((asset) => asset.fileUrl);

  const directUrl = asString(body.fileUrl) || asString(body.file_url) || asString(body.mediaUrl) || asString(body.media_url);
  if (directUrl) {
    normalized.push({ fileUrl: directUrl, assetType: assetType(body.assetType ?? body.asset_type), slideOrder: undefined });
  }

  return normalized;
}

export async function POST(request: Request) {
  const denied = requireSecret(request, "MAKE_WEBHOOK_SECRET", "x-make-secret");
  if (denied) return denied;
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });

  const { raw, body } = await readRawJson(request);
  const idempotencyKey = makeIdempotencyKey(request, body, "make-postly");
  const existingDelivery = await prisma.hermesWebhookDelivery.findUnique({ where: { idempotencyKey } });

  if (existingDelivery?.status === "processed") {
    return NextResponse.json({ ok: true, duplicate: true, idempotencyKey });
  }

  await prisma.hermesWebhookDelivery.upsert({
    where: { idempotencyKey },
    update: { attempts: { increment: 1 }, status: "processing", lastError: null },
    create: {
      event: "make.postly.status",
      idempotencyKey,
      source: "make-postly",
      status: "processing",
      attempts: 1,
    },
  });

  const contentItemId = asString(body.contentItemId) || asString(body.content_item_id);
  if (!contentItemId) {
    await prisma.hermesWebhookDelivery.update({
      where: { idempotencyKey },
      data: { status: "failed", lastError: "contentItemId is required", lastStatusCode: 400 },
    });
    return NextResponse.json({ error: "contentItemId is required" }, { status: 400 });
  }

  const item = await prisma.contentItem.findUnique({ where: { id: contentItemId } });
  if (!item) {
    await prisma.hermesWebhookDelivery.update({
      where: { idempotencyKey },
      data: { status: "failed", lastError: "Content item not found", lastStatusCode: 404 },
    });
    return NextResponse.json({ error: "Content item not found" }, { status: 404 });
  }

  const nextContentStatus = contentStatus(body.status ?? body.makeStatus ?? body.make_status);
  const nextPostingStatus = postingStatus(body.status ?? body.makeStatus ?? body.make_status);
  const currentPlatform = platform(body.platform);
  const rawPayload = {
    idempotencyKey,
    raw,
    body: JSON.parse(JSON.stringify(body)),
  } satisfies Prisma.InputJsonObject;

  try {
    const updatedItem = await prisma.$transaction(async (tx) => {
      const savedItem = await tx.contentItem.update({
        where: { id: item.id },
        data: {
          status: nextContentStatus,
          makeStatus: asString(body.makeStatus) || asString(body.make_status) || asString(body.status),
          facebookPostUrl: asString(body.facebookPostUrl) || asString(body.facebook_post_url),
          instagramPostUrl: asString(body.instagramPostUrl) || asString(body.instagram_post_url),
          errorMessage: nextContentStatus === PostlyContentStatus.FAILED ? asString(body.errorMessage) || asString(body.error_message) : undefined,
        },
      });

      const assets = assetInputs(body);
      if (assets.length > 0) {
        await Promise.all(
          assets.map((asset) =>
            tx.contentAsset.create({
              data: {
                companyId: item.companyId,
                contentItemId: item.id,
                assetType: asset.assetType,
                fileUrl: asset.fileUrl!,
                source: PostlyAssetSource.MAKE,
                slideOrder: asset.slideOrder,
                status: nextContentStatus === PostlyContentStatus.FAILED ? "failed" : "ready",
              },
            }),
          ),
        );
      }

      await tx.postingLog.create({
        data: {
          companyId: item.companyId,
          contentItemId: item.id,
          platform: currentPlatform,
          status: nextContentStatus,
          postedUrl: asString(body.postedUrl) || asString(body.posted_url) || asString(body.facebook_post_url) || asString(body.instagram_post_url),
          errorMessage: asString(body.errorMessage) || asString(body.error_message),
          rawResponse: rawPayload,
        },
      });

      if (currentPlatform) {
        const updated = await tx.postingJob.updateMany({
          where: { contentItemId: item.id, platform: currentPlatform },
          data: { status: nextPostingStatus, makeWebhookResponse: rawPayload },
        });

        if (updated.count === 0) {
          await tx.postingJob.create({
            data: {
              companyId: item.companyId,
              contentItemId: item.id,
              platform: currentPlatform,
              scheduledAt: savedItem.scheduledAt,
              status: nextPostingStatus,
              makeWebhookResponse: rawPayload,
            },
          });
        }
      }

      await tx.hermesWebhookDelivery.update({
        where: { idempotencyKey },
        data: { status: "processed", lastStatusCode: 200, lastError: null },
      });

      return savedItem;
    });

    await writeAgentLog({
      companyId: item.companyId,
      contentItemId: item.id,
      agentName: "Make.com",
      action: "postly.make_webhook.process",
      status: nextContentStatus,
      message: `Make webhook processed: ${nextContentStatus}`,
      rawPayload,
    });

    return NextResponse.json({ ok: true, idempotencyKey, item: updatedItem });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Make webhook processing failed";
    await prisma.hermesWebhookDelivery.update({
      where: { idempotencyKey },
      data: { status: "failed", lastError: message, lastStatusCode: 500 },
    });
    await writeAgentLog({
      companyId: item.companyId,
      contentItemId: item.id,
      agentName: "Make.com",
      action: "postly.make_webhook.process",
      status: "failed",
      message,
      rawPayload,
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
