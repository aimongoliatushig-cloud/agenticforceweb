import { NextResponse } from "next/server";
import { PostlyContentType, PostlyTemplateStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { asString, readJson, requirePostlyCompany, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

function contentType(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return Object.values(PostlyContentType).includes(normalized as PostlyContentType)
    ? (normalized as PostlyContentType)
    : PostlyContentType.POSTER;
}

function templateStatus(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return Object.values(PostlyTemplateStatus).includes(normalized as PostlyTemplateStatus)
    ? (normalized as PostlyTemplateStatus)
    : PostlyTemplateStatus.ACTIVE;
}

export async function GET() {
  const context = await requirePostlyCompany();
  if ("response" in context) return context.response;

  const templates = await prisma.brandTemplate.findMany({
    where: { companyId: context.company.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ templates });
}

export async function POST(request: Request) {
  const context = await requirePostlyCompany();
  if ("response" in context) return context.response;

  const body = await readJson(request);
  const name = asString(body.name);
  if (!name) {
    return NextResponse.json({ error: "Template name is required" }, { status: 400 });
  }

  const template = await prisma.brandTemplate.create({
    data: {
      companyId: context.company.id,
      name,
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
    companyId: context.company.id,
    agentName: "Postly API",
    action: "brand_template.create",
    status: "success",
    message: `Template created: ${template.name}`,
    rawPayload: body,
  });

  return NextResponse.json({ ok: true, template }, { status: 201 });
}
