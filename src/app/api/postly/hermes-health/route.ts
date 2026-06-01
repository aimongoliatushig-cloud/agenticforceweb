import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const allowed = await isAdminUser();
  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = process.env.HERMES_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json({ ok: false, error: "HERMES_BASE_URL is not configured" }, { status: 503 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/health`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    const body = await response.json().catch(() => null);

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      hermes: body,
    }, { status: response.ok ? 200 : 502 });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Hermes health check failed",
    }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
