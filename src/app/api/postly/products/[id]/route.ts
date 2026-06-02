import { NextResponse } from "next/server";
import { PostlyProductStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { asString, asStringArray, readJson, requirePostlyCompany, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

function productStatus(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return normalized && Object.values(PostlyProductStatus).includes(normalized as PostlyProductStatus)
    ? (normalized as PostlyProductStatus)
    : undefined;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const authContext = await requirePostlyCompany();
  if ("response" in authContext) return authContext.response;

  const { id } = await context.params;
  const product = await prisma.productService.findFirst({
    where: { id, companyId: authContext.company.id },
  });

  if (!product) return NextResponse.json({ error: "Product/service not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const authContext = await requirePostlyCompany();
  if ("response" in authContext) return authContext.response;

  const { id } = await context.params;
  const existing = await prisma.productService.findFirst({ where: { id, companyId: authContext.company.id } });
  if (!existing) return NextResponse.json({ error: "Product/service not found" }, { status: 404 });

  const body = await readJson(request);
  const product = await prisma.productService.update({
    where: { id },
    data: {
      name: asString(body.name),
      description: asString(body.description),
      price: asString(body.price),
      benefits: body.benefits === undefined ? undefined : asStringArray(body.benefits),
      targetCustomer: asString(body.targetCustomer),
      painPoints: body.painPoints === undefined ? undefined : asStringArray(body.painPoints),
      status: productStatus(body.status),
    },
  });

  await writeAgentLog({
    companyId: authContext.company.id,
    agentName: "Postly API",
    action: "product_service.update",
    status: "success",
    message: `Product/service updated: ${product.name}`,
    rawPayload: body,
  });

  return NextResponse.json({ ok: true, product });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const authContext = await requirePostlyCompany();
  if ("response" in authContext) return authContext.response;

  const { id } = await context.params;
  const existing = await prisma.productService.findFirst({ where: { id, companyId: authContext.company.id } });
  if (!existing) return NextResponse.json({ error: "Product/service not found" }, { status: 404 });

  const product = await prisma.productService.update({
    where: { id },
    data: { status: PostlyProductStatus.INACTIVE },
  });

  await writeAgentLog({
    companyId: authContext.company.id,
    agentName: "Postly API",
    action: "product_service.deactivate",
    status: "success",
    message: `Product/service deactivated: ${product.name}`,
  });

  return NextResponse.json({ ok: true, product });
}
