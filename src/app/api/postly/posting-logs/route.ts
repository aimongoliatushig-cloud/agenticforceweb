import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePostlyCompany } from "@/lib/postly";

export const dynamic = "force-dynamic";

export async function GET() {
  const context = await requirePostlyCompany();
  if ("response" in context) return context.response;

  const logs = await prisma.postingLog.findMany({
    where: { companyId: context.company.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { contentItem: true },
  });

  return NextResponse.json({ logs });
}
