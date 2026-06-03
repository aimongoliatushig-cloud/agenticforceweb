import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
function isAdminPath(request: NextRequest) {
  return request.nextUrl.pathname === "/admin" || request.nextUrl.pathname.startsWith("/admin/");
}
const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);
const adminBypassCookie = "postly_admin_bypass";

function adminBypassToken() {
  return process.env.POSTLY_ADMIN_BYPASS_TOKEN?.trim();
}

function hasAdminBypass(request: NextRequest) {
  const token = adminBypassToken();
  return Boolean(token && request.cookies.get(adminBypassCookie)?.value === token);
}

function handleAdminBypass(request: NextRequest) {
  if (!isAdminPath(request)) return null;

  const token = adminBypassToken();
  if (!token) return null;

  const provided = request.nextUrl.searchParams.get("postly_admin_token");
  if (provided === token) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("postly_admin_token");
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set(adminBypassCookie, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 12,
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

  if (isAdminRoute(request)) {
    await auth.protect();
  }
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  const bypassResponse = handleAdminBypass(request);
  if (bypassResponse) return bypassResponse;

  if (!clerkConfigured && isAdminPath(request)) {
    return NextResponse.redirect(new URL("/en", request.url));
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
