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

const allowedTemplateMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

function safeFileName(value: string) {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || "template-file";
}

function publicStorageUrl(input: { supabaseUrl: string; bucket: string; path: string }) {
  return `${input.supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${input.bucket}/${input.path}`;
}

async function uploadTemplateFile(input: { companyId: string; file: File }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "postly-templates";

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase Storage service key is not configured");
  }

  if (!allowedTemplateMimeTypes.has(input.file.type)) {
    throw new Error("Unsupported template file type");
  }

  if (input.file.size > 20 * 1024 * 1024) {
    throw new Error("Template file must be 20MB or smaller");
  }

  const path = `${input.companyId}/${Date.now()}-${safeFileName(input.file.name)}`;
  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": input.file.type,
      "Cache-Control": "3600",
      "x-upsert": "false",
    },
    body: Buffer.from(await input.file.arrayBuffer()),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(body || `Supabase Storage upload failed with ${response.status}`);
  }

  return {
    bucket,
    path,
    url: publicStorageUrl({ supabaseUrl, bucket, path }),
  };
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
      status: PostlyTemplateStatus.ACTIVE,
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
