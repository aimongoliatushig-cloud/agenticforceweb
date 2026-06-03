import { PostlyContentType, PostlyPlatform, PostlyTemplateStatus } from "@prisma/client";
import { asString } from "@/lib/postly";

export const allowedTemplateMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

export const allowedLogoMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
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

export function getTemplateStorageConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "postly-templates";

  return {
    bucket,
    hasSupabaseUrl: Boolean(supabaseUrl),
    hasServiceRoleKey: Boolean(supabaseKey),
    ready: Boolean(supabaseUrl && supabaseKey),
  };
}

function safeFileName(value: string, fallback = "template-file") {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || fallback;
}

function publicStorageUrl(input: { supabaseUrl: string; bucket: string; path: string }) {
  return `${input.supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${input.bucket}/${input.path}`;
}

async function uploadStorageFile(input: {
  path: string;
  file: File;
  allowedMimeTypes: Set<string>;
  maxBytes: number;
  unsupportedMessage: string;
  tooLargeMessage: string;
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucket = getTemplateStorageConfig().bucket;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase Storage service key is not configured");
  }

  if (!input.allowedMimeTypes.has(input.file.type)) {
    throw new Error(input.unsupportedMessage);
  }

  if (input.file.size > input.maxBytes) {
    throw new Error(input.tooLargeMessage);
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${input.path}`, {
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
    path: input.path,
    url: publicStorageUrl({ supabaseUrl, bucket, path: input.path }),
  };
}

export async function uploadTemplateFile(input: { companyId: string; file: File }) {
  return uploadStorageFile({
    path: `${input.companyId}/${Date.now()}-${safeFileName(input.file.name)}`,
    file: input.file,
    allowedMimeTypes: allowedTemplateMimeTypes,
    maxBytes: 20 * 1024 * 1024,
    unsupportedMessage: "Unsupported template file type",
    tooLargeMessage: "Template file must be 20MB or smaller",
  });
}

export async function uploadBrandLogo(input: { companyId?: string; file: File }) {
  return uploadStorageFile({
    path: `logos/${input.companyId || "new"}/${Date.now()}-${safeFileName(input.file.name, "brand-logo")}`,
    file: input.file,
    allowedMimeTypes: allowedLogoMimeTypes,
    maxBytes: 5 * 1024 * 1024,
    unsupportedMessage: "Unsupported logo file type",
    tooLargeMessage: "Logo file must be 5MB or smaller",
  });
}
