import { NextRequest, NextResponse } from "next/server";
import { hasDatabaseUrl, prisma } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function noDb() {
  return NextResponse.json({ ok: true, brands: [] });
}

export async function GET(request: NextRequest) {
  const expected = process.env.HERMES_AGENT_SECRET;
  const provided = request.headers.get("x-hermes-secret");
  if (!expected || provided !== expected) return unauthorized();
  if (!hasDatabaseUrl()) return noDb();

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const where = q
    ? { brandName: { contains: q, mode: "insensitive" as const } }
    : {};

  const brands = await prisma.postlyBrand.findMany({
    where,
    include: {
      contentPlans: {
        where: { status: "active" },
        include: {
          _count: { select: { contentItems: true } },
        },
      },
      _count: { select: { contentItems: true } },
    },
    orderBy: { brandName: "asc" },
  });

  const brandsWithCounts = brands.map((b) => {
    const planned = b.contentItems.filter((i) => i.status === "PLANNED").length;
    const approved = b.contentItems.filter((i) => i.status === "APPROVED").length;
    const posted = b.contentItems.filter((i) => i.status === "POSTED").length;

    return {
      id: b.id,
      brandName: b.brandName,
      businessType: b.businessType,
      brandGuideline: b.brandGuideline,
      products: b.products,
      templates: b.templates,
      socialAccounts: b.socialAccounts,
      contentPlans: b.contentPlans,
      contentCounts: {
        total: b._count.contentItems,
        planned,
        approved,
        posted,
      },
      makeIntegration: b.makeIntegration,
      createdAt: b.createdAt,
    };
  });

  return NextResponse.json({ brands: brandsWithCounts });
}
