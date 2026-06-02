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
  return Object.values(PostlyProductStatus).includes(normalized as PostlyProductStatus)
    ? (normalized as PostlyProductStatus)
    : PostlyProductStatus.ACTIVE;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const products = await prisma.productService.findMany({
    where: { companyId: id },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ products });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const company = await prisma.companyProfile.findUnique({ where: { id }, select: { id: true, companyName: true } });
  if (!company) return NextResponse.json({ error: "Brand not found" }, { status: 404 });

  const body = await readJson(request);
  const name = asString(body.name);
  if (!name) return NextResponse.json({ error: "Product/service name is required" }, { status: 400 });

  const product = await prisma.productService.create({
    data: {
      companyId: id,
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
    companyId: id,
    agentName: "Postly Admin",
    action: "product_service.create",
    status: "success",
    message: `Admin created product/service ${product.name}`,
    rawPayload: body,
  });

  return NextResponse.json({ ok: true, product }, { status: 201 });
}
