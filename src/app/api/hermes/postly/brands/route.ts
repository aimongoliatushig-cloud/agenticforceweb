import { NextResponse } from "next/server";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { asString, requireSecret, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = requireSecret(request, "HERMES_AGENT_SECRET", "x-hermes-secret");
  if (denied) return denied;
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });

  const { searchParams } = new URL(request.url);
  const query = asString(searchParams.get("q") || searchParams.get("name"));
  const where = query
    ? {
        OR: [
          { companyName: { contains: query, mode: "insensitive" as const } },
          { businessType: { contains: query, mode: "insensitive" as const } },
          { activityDirection: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};

  const companies = await prisma.companyProfile.findMany({
    where,
    orderBy: [{ companyName: "asc" }, { createdAt: "desc" }],
    take: 25,
    include: {
      brandGuideline: true,
      productsServicesPostly: { orderBy: { createdAt: "desc" } },
      brandTemplates: { orderBy: { createdAt: "desc" } },
      contentPlans: {
        orderBy: { createdAt: "desc" },
        include: {
          contentItems: {
            orderBy: [{ scheduledAt: "asc" }, { createdAt: "asc" }],
            include: { assets: true, approvalRequests: true, postingJobs: true },
          },
        },
      },
      makeIntegration: true,
      socialAccounts: true,
    },
  });

  const summaries = companies.map((company) => {
    const contentItems = company.contentPlans.flatMap((plan) => plan.contentItems);
    return {
      company_id: company.id,
      brand_name: company.companyName,
      business_type: company.businessType,
      activity_direction: company.activityDirection,
      email: company.email,
      brand_guideline: company.brandGuideline,
      products: company.productsServicesPostly,
      templates: company.brandTemplates,
      content_plans: company.contentPlans.map((plan) => ({
        id: plan.id,
        month: plan.month,
        status: plan.status,
        total_carousels: plan.totalCarousels,
        total_reels: plan.totalReels,
        total_posts: plan.totalPosts,
        strategy_note: plan.strategyNote,
        content_items: plan.contentItems,
      })),
      content_counts: {
        total: contentItems.length,
        planned: contentItems.filter((item) => item.status === "PLANNED").length,
        approved: contentItems.filter((item) => item.status === "APPROVED").length,
        posted: contentItems.filter((item) => item.status === "POSTED").length,
      },
      make_integration: company.makeIntegration,
      social_accounts: company.socialAccounts,
    };
  });

  await writeAgentLog({
    agentName: "Hermes",
    action: "postly.brands.fetch",
    status: "success",
    message: `Fetched ${summaries.length} Postly brands${query ? ` for query ${query}` : ""}`,
    rawPayload: { query, count: summaries.length },
  });

  return NextResponse.json({ brands: summaries });
}
