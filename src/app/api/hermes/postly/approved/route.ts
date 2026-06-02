import { NextRequest, NextResponse } from "next/server";
import { hasDatabaseUrl, prisma } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const expected = process.env.HERMES_AGENT_SECRET;
  const provided = request.headers.get("x-hermes-secret");
  if (!expected || provided !== expected) return unauthorized();
  if (!hasDatabaseUrl()) return NextResponse.json({ ok: true, approved: [] });

  // Fetch items in APPROVED status (ready for Make.com)
  const approved = await prisma.postlyContentItem.findMany({
    where: { status: "APPROVED" },
    include: {
      brand: {
        select: {
          id: true,
          brandName: true,
          makeIntegration: true,
        },
      },
      contentPlan: {
        select: { id: true, monthYear: true },
      },
    },
    orderBy: { updatedAt: "asc" },
  });

  return NextResponse.json({ approved });
}
