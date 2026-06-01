import { NextResponse } from "next/server";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { requireSecret } from "@/lib/postly";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = requireSecret(request, "HERMES_AGENT_SECRET", "x-hermes-secret");
  if (denied) return denied;
  if (!hasDatabaseUrl()) return NextResponse.json({ ok: false, error: "DATABASE_URL is not configured" }, { status: 503 });

  try {
    const database = await prisma.$queryRawUnsafe<Array<{ current_database: string; current_schema: string }>>(
      "select current_database(), current_schema()",
    );
    const tables = await prisma.$queryRawUnsafe<Array<{ table_name: string }>>(
      "select table_name from information_schema.tables where table_schema = 'public' order by table_name",
    );

    return NextResponse.json({
      ok: true,
      database: database[0] ?? null,
      tableCount: tables.length,
      tables: tables.map((table) => table.table_name),
      hasCompanyProfile: tables.some((table) => table.table_name === "CompanyProfile"),
      hasContentItem: tables.some((table) => table.table_name === "ContentItem"),
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Database health check failed",
    }, { status: 500 });
  }
}
