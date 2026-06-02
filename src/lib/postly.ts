import crypto from "crypto";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { syncUserRecord } from "@/lib/user-sync";

type JsonRecord = Record<string, unknown>;

export function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function asStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split("\n").map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

export function asDate(value: unknown) {
  const text = asString(value);
  if (!text) return undefined;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function readJson(request: Request) {
  return (await request.json().catch(() => ({}))) as JsonRecord;
}

export async function readRawJson(request: Request) {
  const raw = await request.text();
  try {
    return { raw, body: raw ? (JSON.parse(raw) as JsonRecord) : {} };
  } catch {
    return { raw, body: {} };
  }
}

function secureEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function requireSecret(request: Request, envName: "HERMES_AGENT_SECRET" | "MAKE_WEBHOOK_SECRET", headerName: string) {
  const expected = process.env[envName];
  if (!expected) {
    return NextResponse.json({ error: `${envName} is not configured` }, { status: 500 });
  }

  const headerSecret = request.headers.get(headerName);
  const bearerSecret = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const provided = headerSecret || bearerSecret || "";

  if (!provided || !secureEquals(provided, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

function getClerkPrimaryEmail(clerkUser: Awaited<ReturnType<Awaited<ReturnType<typeof clerkClient>>["users"]["getUser"]>>) {
  const primary = clerkUser.emailAddresses.find((item) => item.id === clerkUser.primaryEmailAddressId);
  return (primary || clerkUser.emailAddresses[0])?.emailAddress?.toLowerCase();
}

export async function requirePostlyCompany(locale?: string) {
  if (!hasDatabaseUrl()) {
    return { response: NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 }) };
  }

  const session = await auth().catch(() => null);
  if (!session?.userId) {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(session.userId);
  const email = getClerkPrimaryEmail(clerkUser);
  if (!email) {
    return { response: NextResponse.json({ error: "User email is required" }, { status: 401 }) };
  }

  const user = await syncUserRecord({
    clerkUserId: clerkUser.id,
    email,
    name: clerkUser.fullName || clerkUser.firstName || email,
    avatarUrl: clerkUser.imageUrl || null,
    locale,
  });

  const company = await prisma.companyProfile.upsert({
    where: { clerkUserId: clerkUser.id },
    update: { userId: user.id, email },
    create: { clerkUserId: clerkUser.id, userId: user.id, email },
  });

  return { user, company };
}

export async function writeAgentLog(input: {
  companyId?: string | null;
  contentItemId?: string | null;
  agentName: string;
  action: string;
  status: string;
  message?: string;
  rawPayload?: unknown;
}) {
  if (!hasDatabaseUrl()) return;

  await prisma.agentLog.create({
    data: {
      companyId: input.companyId ?? undefined,
      contentItemId: input.contentItemId ?? undefined,
      agentName: input.agentName,
      action: input.action,
      status: input.status,
      message: input.message,
      rawPayload: input.rawPayload === undefined ? undefined : (input.rawPayload as object),
    },
  }).catch((error) => {
    console.error("Postly agent log write failed", error);
  });
}

export function makeIdempotencyKey(request: Request, body: JsonRecord, fallbackPrefix: string) {
  const headerKey = request.headers.get("x-idempotency-key") || request.headers.get("idempotency-key");
  const bodyKey = asString(body.idempotencyKey) || asString(body.idempotency_key) || asString(body.eventId) || asString(body.event_id);
  if (headerKey) return headerKey;
  if (bodyKey) return bodyKey;

  const stablePayload = JSON.stringify(body);
  return `${fallbackPrefix}:${crypto.createHash("sha256").update(stablePayload).digest("hex")}`;
}
