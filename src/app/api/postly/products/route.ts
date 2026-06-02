import { NextResponse } from "next/server";
import { PostlyProductStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { asString, asStringArray, readJson, requirePostlyCompany, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

function productStatus(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return Object.values(PostlyProductStatus).includes(normalized as PostlyProductStatus)
    ? (normalized as PostlyProductStatus)
    : PostlyProductStatus.ACTIVE;
}

export async function GET() {
  const context = await requirePostlyCompany();
  if ("response" in context) return context.response;

  const products = await prisma.productService.findMany({
    where: { companyId: context.company.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const context = await requirePostlyCompany();
  if ("response" in context) return context.response;

  const body = await readJson(request);
  const name = asString(body.name);
  if (!name) {
    return NextResponse.json({ error: "Product/service name is required" }, { status: 400 });
  }

  const product = await prisma.productService.create({
    data: {
      companyId: context.company.id,
      name,
      description: asString(body.description),
      price: asString(body.price),
      benefits: asStringArray(body.benefits),
      targetCustomer: asString(body.targetCustomer),
      painPoints: asStringArray(body.painPoints),
      status: productStatus(body.status),
    },
  });

  await writeAgentLog({
    companyId: context.company.id,
    agentName: "Postly API",
    action: "product_service.create",
    status: "success",
    message: `Product/service created: ${product.name}`,
    rawPayload: body,
  });

  return NextResponse.json({ ok: true, product }, { status: 201 });
}
