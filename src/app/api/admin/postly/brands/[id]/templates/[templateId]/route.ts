import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { contentType, templateStatus, uploadTemplateFile } from "@/lib/postly-admin-templates";
import { asString, readJson, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  const allowed = await isAdminUser();
  if (!allowed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

async function findTemplate(companyId: string, templateId: string) {
  return prisma.brandTemplate.findFirst({
    where: { id: templateId, companyId },
  });
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string; templateId: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id, templateId } = await params;
  const template = await findTemplate(id, templateId);
  if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  return NextResponse.json({ template });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; templateId: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id, templateId } = await params;
  const existing = await findTemplate(id, templateId);
  if (!existing) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  const isMultipart = request.headers.get("content-type")?.includes("multipart/form-data");
  const form = isMultipart ? await request.formData() : null;
  const body = form
    ? Object.fromEntries(Array.from(form.entries()).filter(([, value]) => typeof value === "string"))
    : await readJson(request);
  const name = asString(body.name);
  if (!name) return NextResponse.json({ error: "Template name is required" }, { status: 400 });

  let uploadedFile: Awaited<ReturnType<typeof uploadTemplateFile>> | null = null;
  const file = form?.get("file");
  if (file instanceof File && file.size > 0) {
    try {
      uploadedFile = await uploadTemplateFile({ companyId: id, file });
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Template upload failed" }, { status: 400 });
    }
  }

  const uploadedFileUrl = uploadedFile?.url;
  const previewImageUrl = asString(body.previewImageUrl) || (file instanceof File && file.type.startsWith("image/") ? uploadedFileUrl : undefined);
  const template = await prisma.brandTemplate.update({
    where: { id: templateId },
    data: {
      name,
      type: contentType(body.type),
      category: asString(body.category),
      templateFileUrl: uploadedFileUrl || asString(body.templateFileUrl),
      previewImageUrl,
      editableFields: uploadedFile
        ? {
            storageBucket: uploadedFile.bucket,
            storagePath: uploadedFile.path,
            originalFileName: file instanceof File ? file.name : undefined,
          }
        : undefined,
      size: asString(body.size),
      status: templateStatus(body.status),
    },
  });

  await writeAgentLog({
    companyId: id,
    agentName: "Postly Admin",
    action: "brand_template.update",
    status: "success",
    message: `Admin updated template ${template.name}`,
    rawPayload: { ...body, companyId: id, templateId, uploadedFile },
  });

  return NextResponse.json({ ok: true, template });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string; templateId: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id, templateId } = await params;
  const existing = await findTemplate(id, templateId);
  if (!existing) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  await prisma.brandTemplate.delete({ where: { id: templateId } });
  await writeAgentLog({
    companyId: id,
    agentName: "Postly Admin",
    action: "brand_template.delete",
    status: "success",
    message: `Admin deleted template ${existing.name}`,
    rawPayload: { companyId: id, templateId },
  });

  return NextResponse.json({ ok: true });
}
