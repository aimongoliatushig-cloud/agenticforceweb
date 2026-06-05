import { NextResponse } from "next/server";

const buckets = new Map<string, { count: number; resetAt: number }>();

function requestIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function allowedHosts(request: Request) {
  const hosts = new Set<string>();
  hosts.add(new URL(request.url).host);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  if (appUrl) {
    try {
      hosts.add(new URL(appUrl).host);
    } catch {
      // Ignore malformed optional app URLs.
    }
  }

  hosts.add("localhost:3000");
  hosts.add("localhost:3001");
  return hosts;
}

function hasAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const source = origin || referer;
  if (!source) return true;

  try {
    return allowedHosts(request).has(new URL(source).host);
  } catch {
    return false;
  }
}

function rateLimit(request: Request, limit = 12, windowMs = 60_000) {
  const key = `${requestIp(request)}:${new URL(request.url).pathname}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

export function publicFormGuard(request: Request, body: Record<string, unknown>) {
  const honeypot = body.website || body.url || body.companyWebsite;
  if (typeof honeypot === "string" && honeypot.trim()) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!hasAllowedOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  if (rateLimit(request)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  return null;
}
