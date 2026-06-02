import { NextResponse } from "next/server";
import { PostlyContentStatus, PostlySocialStatus } from "@prisma/client";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { requireSecret, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = requireSecret(request, "HERMES_AGENT_SECRET", "x-hermes-secret");
  if (denied) return denied;
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });

  const items = await prisma.contentItem.findMany({
    where: { status: PostlyContentStatus.APPROVED },
    orderBy: [{ scheduledAt: "asc" }, { createdAt: "asc" }],
    take: 25,
    include: {
      company: {
        include: {
          brandGuideline: true,
          makeIntegration: true,
          socialAccounts: { where: { status: PostlySocialStatus.CONNECTED } },
        },
      },
      template: true,
      assets: true,
      contentPlan: true,
    },
  });

  const payloads = items.map((item) => {
    const facebook = item.company.socialAccounts.find((account) => account.platform === "FACEBOOK");
    const instagram = item.company.socialAccounts.find((account) => account.platform === "INSTAGRAM");

    return {
      content_item_id: item.id,
      company_id: item.companyId,
      brand_name: item.company.companyName,
      content_type: item.contentType.toLowerCase(),
      category: item.category,
      caption: item.caption,
      headline: item.headline,
      image_prompt: item.imagePrompt,
      creative_direction: item.creativeDirection,
      template_url: item.template?.templateFileUrl,
      template_preview_url: item.template?.previewImageUrl,
      logo_url: item.company.brandGuideline?.logoUrl || item.company.logoUrl,
      brand_colors: item.company.brandGuideline?.brandColors ?? [],
      scheduled_at: item.scheduledAt?.toISOString() ?? null,
      make_webhook_url: item.company.makeIntegration?.status === "active" ? item.company.makeIntegration.webhookUrl : null,
      make_scenario_name: item.company.makeIntegration?.scenarioName ?? null,
      facebook_page_id: facebook?.pageId ?? null,
      instagram_account_id: instagram?.instagramAccountId ?? instagram?.pageId ?? null,
      source_assets: item.assets.map((asset) => ({
        asset_type: asset.assetType.toLowerCase(),
        file_url: asset.fileUrl,
        source: asset.source.toLowerCase(),
        slide_order: asset.slideOrder,
      })),
    };
  });

  await writeAgentLog({
    agentName: "Hermes",
    action: "postly.approved.fetch",
    status: "success",
    message: `Fetched ${items.length} approved Postly items`,
    rawPayload: { count: items.length },
  });

  return NextResponse.json({ items, makePayloads: payloads });
}
