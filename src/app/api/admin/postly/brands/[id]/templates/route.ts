import { NextResponse } from "next/server";
import { getCurrentUserId, isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { contentType, templatePlatform, uploadTemplateFile } from "@/lib/postly-admin-templates";
import { asString, readJson, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  const allowed = await isAdminUser();
  if (!allowed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const isMultipart = request.headers.get("content-type")?.includes("multipart/form-data");
  const form = isMultipart ? await request.formData() : null;
  const body = form
    ? Object.fromEntries(Array.from(form.entries()).filter(([, value]) => typeof value === "string"))
    : await readJson(request);
  const name = asString(body.name);
  if (!name) return NextResponse.json({ error: "Template name is required" }, { status: 400 });

  const company = await prisma.companyProfile.findUnique({ where: { id } });
  if (!company) return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  const clerkUserId = await getCurrentUserId();
  const createdBy = clerkUserId ? await prisma.user.findUnique({ where: { clerkUserId }, select: { id: true } }) : null;

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
  const template = await prisma.brandTemplate.create({
    data: {
      companyId: id,
      createdById: createdBy?.id,
      name,
      type: contentType(body.type),
      platform: templatePlatform(body.platform),
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
    },
  });

  await writeAgentLog({
    companyId: id,
    agentName: "Postly Admin",
    action: "brand_template.create",
    status: "success",
    message: `Admin added template ${template.name}`,
    rawPayload: { ...body, companyId: id, uploadedFile },
  });

  return NextResponse.json({ ok: true, template }, { status: 201 });
}
