import { NextResponse } from "next/server";

const adminBypassCookie = "postly_admin_bypass";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = process.env.POSTLY_ADMIN_BYPASS_TOKEN?.trim();
  const url = new URL(request.url);
  const provided = url.searchParams.get("token") || url.searchParams.get("postly_admin_token");

  if (!token || provided !== token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redirectUrl = new URL("/admin", url.origin);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(adminBypassCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 60 * 12,
    path: "/",
  });

  return response;
}
