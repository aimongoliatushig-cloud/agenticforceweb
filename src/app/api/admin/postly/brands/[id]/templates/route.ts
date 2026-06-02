import { NextResponse } from "next/server";
import { PostlyContentType, PostlyTemplateStatus } from "@prisma/client";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { asString, readJson, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  const allowed = await isAdminUser();
  if (!allowed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

function contentType(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return Object.values(PostlyContentType).includes(normalized as PostlyContentType)
    ? (normalized as PostlyContentType)
    : PostlyContentType.POSTER;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await readJson(request);
  const name = asString(body.name);
  if (!name) return NextResponse.json({ error: "Template name is required" }, { status: 400 });

  const company = await prisma.companyProfile.findUnique({ where: { id } });
  if (!company) return NextResponse.json({ error: "Brand not found" }, { status: 404 });

  const template = await prisma.brandTemplate.create({
    data: {
      companyId: id,
      name,
      type: contentType(body.type),
      category: asString(body.category),
      templateFileUrl: asString(body.templateFileUrl),
      previewImageUrl: asString(body.previewImageUrl),
      size: asString(body.size),
      status: PostlyTemplateStatus.ACTIVE,
    },
  });

  await writeAgentLog({
    companyId: id,
    agentName: "Postly Admin",
    action: "brand_template.create",
    status: "success",
    message: `Admin added template ${template.name}`,
    rawPayload: { ...body, companyId: id },
  });

  return NextResponse.json({ ok: true, template }, { status: 201 });
}
