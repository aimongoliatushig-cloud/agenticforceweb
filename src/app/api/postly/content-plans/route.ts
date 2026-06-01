import { NextResponse } from "next/server";
import { PostlyPlanStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { asString, readJson, requirePostlyCompany, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

function numberValue(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.floor(number) : 0;
}

function planStatus(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return Object.values(PostlyPlanStatus).includes(normalized as PostlyPlanStatus)
    ? (normalized as PostlyPlanStatus)
    : PostlyPlanStatus.DRAFT;
}

export async function GET() {
  const context = await requirePostlyCompany();
  if ("response" in context) return context.response;

  const plans = await prisma.contentPlan.findMany({
    where: { companyId: context.company.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { contentItems: true } } },
  });

  return NextResponse.json({ plans });
}

export async function POST(request: Request) {
  const context = await requirePostlyCompany();
  if ("response" in context) return context.response;

  const body = await readJson(request);
  const month = asString(body.month);
  if (!month) {
    return NextResponse.json({ error: "Plan month is required" }, { status: 400 });
  }

  const totalCarousels = numberValue(body.totalCarousels);
  const totalReels = numberValue(body.totalReels);
  const totalPosts = numberValue(body.totalPosts) || totalCarousels + totalReels;

  const plan = await prisma.contentPlan.create({
    data: {
      companyId: context.company.id,
      month,
      totalCarousels,
      totalReels,
      totalPosts,
      strategyNote: asString(body.strategyNote),
      status: planStatus(body.status),
      createdById: context.user.id,
    },
  });

  await writeAgentLog({
    companyId: context.company.id,
    agentName: "Postly API",
    action: "content_plan.create",
    status: "success",
    message: `Content plan created: ${plan.month}`,
    rawPayload: body,
  });

  return NextResponse.json({ ok: true, plan }, { status: 201 });
}
