import { NextResponse } from "next/server";
import { PostlyAssetSource, PostlyAssetType, PostlyContentStatus } from "@prisma/client";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { asString, readJson, requireSecret, writeAgentLog } from "@/lib/postly";
import { parsePostlyContentStatus } from "@/lib/postly-status";

export const dynamic = "force-dynamic";

function nextStatus(body: Record<string, unknown>) {
  const requested = parsePostlyContentStatus(body.status);
  if (requested === PostlyContentStatus.WAITING_APPROVAL) return PostlyContentStatus.WAITING_APPROVAL;
  if (requested === PostlyContentStatus.DRAFT_GENERATED) return PostlyContentStatus.DRAFT_GENERATED;
  return asString(body.telegramMessageId) ? PostlyContentStatus.WAITING_APPROVAL : PostlyContentStatus.DRAFT_GENERATED;
}

function imageUrls(body: Record<string, unknown>) {
  const urls = new Set<string>();
  const directFields = [
    "imageUrl",
    "image_url",
    "generatedImageUrl",
    "generated_image_url",
    "assetUrl",
    "asset_url",
    "fileUrl",
    "file_url",
    "outputUrl",
    "output_url",
  ];

  for (const field of directFields) {
    const url = asString(body[field]);
    if (url) urls.add(url);
  }

  for (const field of ["imageUrls", "image_urls", "outputUrls", "output_urls"]) {
    const value = body[field];
    if (Array.isArray(value)) {
      for (const item of value) {
        const url = asString(item);
        if (url) urls.add(url);
      }
    }
  }

  for (const field of ["assets", "source_assets"]) {
    const value = body[field];
    if (Array.isArray(value)) {
      for (const asset of value) {
        if (!asset || typeof asset !== "object" || Array.isArray(asset)) continue;
        const record = asset as Record<string, unknown>;
        const url = asString(record.fileUrl) || asString(record.file_url) || asString(record.url);
        if (url) urls.add(url);
      }
    }
  }

  return Array.from(urls);
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
  const urls = imageUrls(body);
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
    include: { template: true, assets: true },
  });

  for (const [index, fileUrl] of urls.entries()) {
    const existingAsset = await prisma.contentAsset.findFirst({
      where: { contentItemId: item.id, fileUrl },
      select: { id: true },
    });
    if (existingAsset) continue;

    await prisma.contentAsset.create({
      data: {
        companyId: item.companyId,
        contentItemId: item.id,
        assetType: index === 0 ? PostlyAssetType.IMAGE : PostlyAssetType.CAROUSEL_SLIDE,
        fileUrl,
        source: PostlyAssetSource.HERMES,
        slideOrder: urls.length > 1 ? index + 1 : undefined,
      },
    });
  }

  const itemWithAssets = await prisma.contentItem.findUnique({
    where: { id: item.id },
    include: { template: true, assets: true },
  });

  if (urls.length > 0) {
    await prisma.hermesChatMessage.create({
      data: {
        companyId: item.companyId,
        contentItemId: item.id,
        sender: "hermes",
        message: asString(body.message) || "Kie.ai-аар poster зураг generate хийгдлээ.",
        status: "image_generated",
        metadata: {
          posterAssetUrl: urls[0],
          imageUrls: urls,
          kieTaskId: asString(body.kieTaskId) || asString(body.kie_task_id) || asString(body.taskId) || asString(body.task_id),
        },
      },
    });
  }

  await writeAgentLog({
    companyId: item.companyId,
    contentItemId: item.id,
    agentName: asString(body.agentName) || "Hermes",
    action: "postly.draft.upsert",
    status,
    message: `Hermes draft saved for ${item.title ?? item.id}`,
    rawPayload: { ...body, imageUrls: urls },
  });

  return NextResponse.json({ ok: true, item: itemWithAssets || item });
}
