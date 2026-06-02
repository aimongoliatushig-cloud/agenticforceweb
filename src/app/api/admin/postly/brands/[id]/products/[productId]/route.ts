import { NextResponse } from "next/server";
import { PostlyProductStatus } from "@prisma/client";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { asString, asStringArray, readJson, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  const allowed = await isAdminUser();
  if (!allowed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

function productStatus(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return normalized && Object.values(PostlyProductStatus).includes(normalized as PostlyProductStatus)
    ? (normalized as PostlyProductStatus)
    : undefined;
}

async function findProduct(companyId: string, productId: string) {
  return prisma.productService.findFirst({ where: { id: productId, companyId } });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; productId: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id, productId } = await params;
  const existing = await findProduct(id, productId);
  if (!existing) return NextResponse.json({ error: "Product/service not found" }, { status: 404 });

  const body = await readJson(request);
  const name = asString(body.name);
  if (!name) return NextResponse.json({ error: "Product/service name is required" }, { status: 400 });

  const product = await prisma.productService.update({
    where: { id: productId },
    data: {
      name,
      description: asString(body.description),
      price: asString(body.price),
      benefits: body.benefits === undefined ? undefined : asStringArray(body.benefits),
      targetCustomer: asString(body.targetCustomer),
      painPoints: body.painPoints === undefined ? undefined : asStringArray(body.painPoints),
      status: productStatus(body.status),
    },
  });

  await writeAgentLog({
    companyId: id,
    agentName: "Postly Admin",
    action: "product_service.update",
    status: "success",
    message: `Admin updated product/service ${product.name}`,
    rawPayload: body,
  });

  return NextResponse.json({ ok: true, product });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string; productId: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id, productId } = await params;
  const existing = await findProduct(id, productId);
  if (!existing) return NextResponse.json({ error: "Product/service not found" }, { status: 404 });

  await prisma.productService.delete({ where: { id: productId } });
  await writeAgentLog({
    companyId: id,
    agentName: "Postly Admin",
    action: "product_service.delete",
    status: "success",
    message: `Admin deleted product/service ${existing.name}`,
    rawPayload: { companyId: id, productId },
  });

  return NextResponse.json({ ok: true });
}
