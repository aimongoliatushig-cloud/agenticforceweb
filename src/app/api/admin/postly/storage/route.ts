import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl } from "@/lib/db";
import { getTemplateStorageConfig } from "@/lib/postly-admin-templates";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  const allowed = await isAdminUser();
  if (!allowed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const config = getTemplateStorageConfig();

  return NextResponse.json({
    storage: {
      bucket: config.bucket,
      ready: config.ready,
      hasSupabaseUrl: config.hasSupabaseUrl,
      hasServiceRoleKey: config.hasServiceRoleKey,
      missing: {
        NEXT_PUBLIC_SUPABASE_URL: !config.hasSupabaseUrl,
        SUPABASE_SERVICE_ROLE_KEY: !config.hasServiceRoleKey,
      },
    },
  });
}
