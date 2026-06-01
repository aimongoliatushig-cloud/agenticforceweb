import { NextResponse } from "next/server";
import { PostlyPlanStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { asString, readJson, requirePostlyCompany, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

function numberValue(value: unknown) {
  if (value === undefined) return undefined;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.floor(number) : undefined;
}

function planStatus(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return normalized && Object.values(PostlyPlanStatus).includes(normalized as PostlyPlanStatus)
    ? (normalized as PostlyPlanStatus)
    : undefined;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const authContext = await requirePostlyCompany();
  if ("response" in authContext) return authContext.response;

  const { id } = await context.params;
  const plan = await prisma.contentPlan.findFirst({
    where: { id, companyId: authContext.company.id },
    include: { contentItems: { orderBy: { createdAt: "asc" } } },
  });

  if (!plan) return NextResponse.json({ error: "Content plan not found" }, { status: 404 });
  return NextResponse.json({ plan });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const authContext = await requirePostlyCompany();
  if ("response" in authContext) return authContext.response;

  const { id } = await context.params;
  const existing = await prisma.contentPlan.findFirst({ where: { id, companyId: authContext.company.id } });
  if (!existing) return NextResponse.json({ error: "Content plan not found" }, { status: 404 });

  const body = await readJson(request);
  const plan = await prisma.contentPlan.update({
    where: { id },
    data: {
      month: asString(body.month),
      totalCarousels: numberValue(body.totalCarousels),
      totalReels: numberValue(body.totalReels),
      totalPosts: numberValue(body.totalPosts),
      strategyNote: asString(body.strategyNote),
      status: planStatus(body.status),
    },
  });

  await writeAgentLog({
    companyId: authContext.company.id,
    agentName: "Postly API",
    action: "content_plan.update",
    status: "success",
    message: `Content plan updated: ${plan.month}`,
    rawPayload: body,
  });

  return NextResponse.json({ ok: true, plan });
}
