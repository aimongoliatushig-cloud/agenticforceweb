import { NextResponse } from "next/server";
import { PostlyContentType, PostlyTemplateStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { asString, readJson, requirePostlyCompany, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

function contentType(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return normalized && Object.values(PostlyContentType).includes(normalized as PostlyContentType)
    ? (normalized as PostlyContentType)
    : undefined;
}

function templateStatus(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return normalized && Object.values(PostlyTemplateStatus).includes(normalized as PostlyTemplateStatus)
    ? (normalized as PostlyTemplateStatus)
    : undefined;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const authContext = await requirePostlyCompany();
  if ("response" in authContext) return authContext.response;

  const { id } = await context.params;
  const template = await prisma.brandTemplate.findFirst({
    where: { id, companyId: authContext.company.id },
  });

  if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });
  return NextResponse.json({ template });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const authContext = await requirePostlyCompany();
  if ("response" in authContext) return authContext.response;

  const { id } = await context.params;
  const existing = await prisma.brandTemplate.findFirst({ where: { id, companyId: authContext.company.id } });
  if (!existing) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  const body = await readJson(request);
  const template = await prisma.brandTemplate.update({
    where: { id },
    data: {
      name: asString(body.name),
      type: contentType(body.type),
      category: asString(body.category),
      templateFileUrl: asString(body.templateFileUrl),
      previewImageUrl: asString(body.previewImageUrl),
      editableFields: body.editableFields === undefined ? undefined : (body.editableFields as object),
      size: asString(body.size),
      status: templateStatus(body.status),
    },
  });

  await writeAgentLog({
    companyId: authContext.company.id,
    agentName: "Postly API",
    action: "brand_template.update",
    status: "success",
    message: `Template updated: ${template.name}`,
    rawPayload: body,
  });

  return NextResponse.json({ ok: true, template });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const authContext = await requirePostlyCompany();
  if ("response" in authContext) return authContext.response;

  const { id } = await context.params;
  const existing = await prisma.brandTemplate.findFirst({ where: { id, companyId: authContext.company.id } });
  if (!existing) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  const template = await prisma.brandTemplate.update({
    where: { id },
    data: { status: PostlyTemplateStatus.INACTIVE },
  });

  await writeAgentLog({
    companyId: authContext.company.id,
    agentName: "Postly API",
    action: "brand_template.deactivate",
    status: "success",
    message: `Template deactivated: ${template.name}`,
  });

  return NextResponse.json({ ok: true, template });
}
