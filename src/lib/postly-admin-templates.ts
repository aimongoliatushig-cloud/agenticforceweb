import { PostlyContentType, PostlyPlatform, PostlyTemplateStatus } from "@prisma/client";
import { asString } from "@/lib/postly";

export const allowedTemplateMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

export function contentType(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return Object.values(PostlyContentType).includes(normalized as PostlyContentType)
    ? (normalized as PostlyContentType)
    : PostlyContentType.POSTER;
}

export function templateStatus(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return Object.values(PostlyTemplateStatus).includes(normalized as PostlyTemplateStatus)
    ? (normalized as PostlyTemplateStatus)
    : PostlyTemplateStatus.ACTIVE;
}

export function templatePlatform(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return normalized && Object.values(PostlyPlatform).includes(normalized as PostlyPlatform)
    ? (normalized as PostlyPlatform)
    : undefined;
}

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

export async function uploadTemplateFile(input: { companyId: string; file: File }) {
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
