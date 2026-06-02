import { NextRequest, NextResponse } from "next/server";
import { hasDatabaseUrl, prisma } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const expected = process.env.HERMES_AGENT_SECRET;
  const provided = request.headers.get("x-hermes-secret");
  if (!expected || provided !== expected) return unauthorized();
  if (!hasDatabaseUrl()) return NextResponse.json({ ok: true, planned: [] });

  // Fetch items in PLANNED status, grouped by brand
  const planned = await prisma.postlyContentItem.findMany({
    where: { status: "PLANNED" },
    include: {
      brand: {
        select: {
          id: true,
          brandName: true,
          brandGuideline: true,
          products: true,
          templates: true,
          socialAccounts: true,
        },
      },
      contentPlan: {
        select: { id: true, monthYear: true, strategyNote: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ planned });
}
