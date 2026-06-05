import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminLoginRoute = createRouteMatcher(["/admin/login(.*)"]);
function isAdminPath(request: NextRequest) {
  return request.nextUrl.pathname === "/admin" || request.nextUrl.pathname.startsWith("/admin/");
}

function isAdminLoginPath(request: NextRequest) {
  return request.nextUrl.pathname === "/admin/login" || request.nextUrl.pathname.startsWith("/admin/login/");
}

function isAdminBypassPath(request: NextRequest) {
  return isAdminPath(request) || request.nextUrl.pathname.startsWith("/api/admin/");
}
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim());
const adminBypassCookie = "postly_admin_bypass";

function adminBypassToken() {
  return process.env.POSTLY_ADMIN_BYPASS_TOKEN?.trim();
}

function isAdminBypassEnabled() {
  return process.env.POSTLY_ADMIN_BYPASS_ENABLED === "true";
}

function hasAdminBypass(request: NextRequest) {
  const token = adminBypassToken();
  return Boolean(isAdminBypassEnabled() && token && request.cookies.get(adminBypassCookie)?.value === token);
}

function handleAdminBypass(request: NextRequest) {
  if (!isAdminBypassPath(request)) return null;
  if (!isAdminBypassEnabled()) return null;

  const token = adminBypassToken();
  if (!token) return null;

  const provided = request.nextUrl.searchParams.get("postly_admin_token");
  const headerToken = request.headers.get("x-postly-admin-token");
  const queryBypassAllowed = process.env.NODE_ENV !== "production";
  if ((queryBypassAllowed && provided === token) || headerToken === token) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("postly_admin_token");
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set(adminBypassCookie, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 30,
      path: "/",
    });
    return response;
  }

  return hasAdminBypass(request) ? NextResponse.next() : null;
}

const clerkProxy = clerkMiddleware(async (auth, request) => {
  const localeHomeMatch = request.nextUrl.pathname.match(/^\/(en|mn)\/?$/);
  const { userId } = await auth();

  if (userId && localeHomeMatch) {
    return NextResponse.redirect(new URL(`/${localeHomeMatch[1]}/dashboard/postly`, request.url));
  }

  if (isAdminRoute(request) && !isAdminLoginRoute(request)) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect_url", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    await auth.protect({ unauthenticatedUrl: loginUrl.toString() });
  }
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  const bypassResponse = handleAdminBypass(request);
  if (bypassResponse) return bypassResponse;

  if (!clerkConfigured && isAdminPath(request) && !isAdminLoginPath(request)) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect_url", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (!clerkConfigured && isAdminLoginPath(request)) {
    return NextResponse.next();
  }

  if (!clerkConfigured) {
    return NextResponse.next();
  }

  return clerkProxy(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/(.*)",
    "/(api|trpc)(.*)",
  ],
};
