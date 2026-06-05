import { NextResponse } from "next/server";

const adminBypassCookie = "postly_admin_bypass";

export const dynamic = "force-dynamic";

function safeAdminRedirect(origin: string, value?: string | null) {
  if (
    value &&
    (value === "/admin" || (value.startsWith("/admin/") && !value.startsWith("/admin/login")))
  ) {
    return new URL(value, origin);
  }

  return new URL("/admin", origin);
}

function setBypassCookie(response: NextResponse, token: string) {
  response.cookies.set(adminBypassCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 30,
    path: "/",
  });
  return response;
}

export async function GET(request: Request) {
  if (process.env.POSTLY_ADMIN_BYPASS_ENABLED !== "true") {
    return NextResponse.json({ error: "Admin bypass is disabled" }, { status: 404 });
  }

  const token = process.env.POSTLY_ADMIN_BYPASS_TOKEN?.trim();
  const url = new URL(request.url);
  const provided = url.searchParams.get("token") || url.searchParams.get("postly_admin_token");
  const headerToken = request.headers.get("x-postly-admin-token");
  const queryBypassAllowed = process.env.NODE_ENV !== "production";

  if (!token || !((queryBypassAllowed && provided === token) || headerToken === token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.redirect(safeAdminRedirect(url.origin, url.searchParams.get("redirect_url")));

  return setBypassCookie(response, token);
}

export async function POST(request: Request) {
  if (process.env.POSTLY_ADMIN_BYPASS_ENABLED !== "true") {
    return NextResponse.json({ error: "Admin bypass is disabled" }, { status: 404 });
  }

  const token = process.env.POSTLY_ADMIN_BYPASS_TOKEN?.trim();
  const url = new URL(request.url);
  const queryBypassAllowed = process.env.NODE_ENV !== "production";

  let provided: string | null = null;
  let redirectTarget: string | null = null;

  try {
    const formData = await request.formData();
    provided = String(formData.get("token") ?? "");
    redirectTarget = String(formData.get("redirect_url") ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  if (!token || !queryBypassAllowed || provided !== token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.redirect(safeAdminRedirect(url.origin, redirectTarget), { status: 303 });

  return setBypassCookie(response, token);
}
