import { NextResponse } from "next/server";
import { PostlyContentStatus, PostlyContentType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { readJson, requirePostlyCompany, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

type ItemSeed = {
  contentType: PostlyContentType;
  category: string;
  title: string;
};

function buildSeeds(plan: { totalCarousels: number; totalReels: number; totalPosts: number }) {
  const seeds: ItemSeed[] = [];

  for (let index = 1; index <= plan.totalCarousels; index += 1) {
    seeds.push({
      contentType: PostlyContentType.CAROUSEL,
      category: index % 3 === 1 ? "education" : index % 3 === 2 ? "product_solution" : "success_story",
      title: `Carousel ${index}`,
    });
  }

  for (let index = 1; index <= plan.totalReels; index += 1) {
    seeds.push({
      contentType: PostlyContentType.REEL,
      category: index % 2 === 1 ? "brand_awareness" : "promo",
      title: `Reel ${index}`,
    });
  }

  const posterCount = Math.max(0, plan.totalPosts - plan.totalCarousels - plan.totalReels);
  for (let index = 1; index <= posterCount; index += 1) {
    seeds.push({
      contentType: PostlyContentType.POSTER,
      category: index % 2 === 1 ? "promo" : "news",
      title: `Poster ${index}`,
    });
  }

  return seeds;
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const authContext = await requirePostlyCompany();
  if ("response" in authContext) return authContext.response;

  const { id } = await context.params;
  const body = await readJson(request);
  const plan = await prisma.contentPlan.findFirst({
    where: { id, companyId: authContext.company.id },
    include: { contentItems: true },
  });

  if (!plan) return NextResponse.json({ error: "Content plan not found" }, { status: 404 });

  const existingKeys = new Set(plan.contentItems.map((item) => `${item.contentType}:${item.title ?? ""}`));
  const seeds = buildSeeds(plan).filter((seed) => !existingKeys.has(`${seed.contentType}:${seed.title}`));

  const created = await prisma.$transaction(
    seeds.map((seed) =>
      prisma.contentItem.create({
        data: {
          companyId: authContext.company.id,
          contentPlanId: plan.id,
          contentType: seed.contentType,
          category: seed.category,
          title: seed.title,
          creativeDirection: plan.strategyNote,
          status: PostlyContentStatus.PLANNED,
        },
      }),
    ),
  );

  await writeAgentLog({
    companyId: authContext.company.id,
    agentName: "Postly API",
    action: "content_plan.generate_items",
    status: "success",
    message: `Generated ${created.length} content items for ${plan.month}`,
    rawPayload: { request: body, createdCount: created.length },
  });

  return NextResponse.json({ ok: true, createdCount: created.length, items: created });
}
