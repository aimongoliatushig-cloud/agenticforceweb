import { createHmac, createHash } from "crypto";
import { headers } from "next/headers";
import { hasDatabaseUrl, prisma } from "./db";

export type HermesSignupPayload = {
  event: "website.signup";
  source: "clerk" | "academy_enrollment";
  occurred_at: string;
  idempotency_key: string;
  user: {
    id: string;
    email: string;
    phone?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    full_name?: string | null;
    username?: string | null;
    image_url?: string | null;
  };
  academy?: {
    enrollment_id?: string | null;
    course_id?: string | null;
    course_name?: string | null;
    plan?: string | null;
    price?: string | null;
    currency?: string | null;
  };
  marketing?: {
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    utm_content?: string | null;
    utm_term?: string | null;
    referrer?: string | null;
    landing_page?: string | null;
  };
  metadata?: {
    ip_hash?: string | null;
    user_agent?: string | null;
    environment: string;
  };
};

export type ClerkUserCreatedData = {
  id: string;
  email_addresses?: Array<{ id?: string; email_address?: string }>;
  primary_email_address_id?: string | null;
  phone_numbers?: Array<{ phone_number?: string }>;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  image_url?: string | null;
  created_at?: number;
};

export function signHermesBody(rawBody: string, secret: string) {
  return `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;
}

export function hashIp(ip: string | null | undefined) {
  if (!ip) return null;
  return createHash("sha256").update(ip).digest("hex");
}

export function getPrimaryEmail(user: ClerkUserCreatedData) {
  const primary = user.email_addresses?.find(
    (email) => email.id && email.id === user.primary_email_address_id
  );
  return primary?.email_address ?? user.email_addresses?.[0]?.email_address ?? "";
}

export function normalizeClerkUserCreatedToHermes(input: {
  user: ClerkUserCreatedData;
  ipHash?: string | null;
  userAgent?: string | null;
}): HermesSignupPayload {
  const { user, ipHash, userAgent } = input;
  const email = getPrimaryEmail(user);
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || null;
  const occurredAt = user.created_at
    ? new Date(user.created_at).toISOString()
    : new Date().toISOString();
  const idempotencyKey = `clerk_user_created:${user.id}`;

  return {
    event: "website.signup",
    source: "clerk",
    occurred_at: occurredAt,
    idempotency_key: idempotencyKey,
    user: {
      id: user.id,
      email,
      phone: user.phone_numbers?.[0]?.phone_number ?? null,
      first_name: user.first_name ?? null,
      last_name: user.last_name ?? null,
      full_name: fullName,
      username: user.username ?? null,
      image_url: user.image_url ?? null,
    },
    marketing: {},
    metadata: {
      ip_hash: ipHash ?? null,
      user_agent: userAgent ?? null,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    },
  };
}

export function normalizeAcademyEnrollmentToHermes(input: {
  enrollment: {
    id: string;
    userId?: string | null;
    clerkUserId?: string | null;
    email: string;
    phone?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    fullName?: string | null;
    courseId: string;
    courseName: string;
    plan?: string | null;
    price?: string | null;
    currency?: string | null;
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
    utmContent?: string | null;
    utmTerm?: string | null;
    referrer?: string | null;
    landingPage?: string | null;
    userAgent?: string | null;
    createdAt?: Date | string;
  };
  ipHash?: string | null;
}): HermesSignupPayload {
  const { enrollment, ipHash } = input;
  const idempotencyKey = `academy_enrollment:${enrollment.id}`;

  return {
    event: "website.signup",
    source: "academy_enrollment",
    occurred_at: enrollment.createdAt
      ? new Date(enrollment.createdAt).toISOString()
      : new Date().toISOString(),
    idempotency_key: idempotencyKey,
    user: {
      id: enrollment.clerkUserId ?? enrollment.userId ?? enrollment.id,
      email: enrollment.email,
      phone: enrollment.phone ?? null,
      first_name: enrollment.firstName ?? null,
      last_name: enrollment.lastName ?? null,
      full_name: enrollment.fullName ?? null,
    },
    academy: {
      enrollment_id: enrollment.id,
      course_id: enrollment.courseId,
      course_name: enrollment.courseName,
      plan: enrollment.plan ?? null,
      price: enrollment.price ?? null,
      currency: enrollment.currency ?? null,
    },
    marketing: {
      utm_source: enrollment.utmSource ?? null,
      utm_medium: enrollment.utmMedium ?? null,
      utm_campaign: enrollment.utmCampaign ?? null,
      utm_content: enrollment.utmContent ?? null,
      utm_term: enrollment.utmTerm ?? null,
      referrer: enrollment.referrer ?? null,
      landing_page: enrollment.landingPage ?? null,
    },
    metadata: {
      ip_hash: ipHash ?? null,
      user_agent: enrollment.userAgent ?? null,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    },
  };
}

export async function getRequestMetadata() {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headerList.get("x-real-ip");

  return {
    ipHash: hashIp(forwardedFor ?? realIp),
    userAgent: headerList.get("user-agent"),
  };
}

export async function sendSignupToHermes(payload: HermesSignupPayload) {
  const webhookUrl = process.env.HERMES_WEBHOOK_URL;
  const secret = process.env.HERMES_WEBHOOK_SECRET;

  if (!webhookUrl || !secret) {
    console.warn("Hermes signup webhook skipped: HERMES_WEBHOOK_URL or HERMES_WEBHOOK_SECRET is not configured.");
    return { ok: false, skipped: true, reason: "missing_config" };
  }

  if (hasDatabaseUrl()) {
    try {
      const existing = await prisma.hermesWebhookDelivery.findUnique({
        where: { idempotencyKey: payload.idempotency_key },
      });

      const recentPending =
        existing?.status === "pending" &&
        Date.now() - existing.updatedAt.getTime() < 2 * 60 * 1000;

      if (existing?.status === "success" || recentPending) {
        return { ok: true, skipped: true, reason: existing.status };
      }

      await prisma.hermesWebhookDelivery.upsert({
        where: { idempotencyKey: payload.idempotency_key },
        update: {
          status: "pending",
          attempts: { increment: 1 },
          lastError: null,
          lastStatusCode: null,
        },
        create: {
          event: payload.event,
          idempotencyKey: payload.idempotency_key,
          source: payload.source,
          status: "pending",
          attempts: 1,
        },
      });
    } catch (error) {
      console.error("Hermes delivery idempotency check failed", error);
    }
  }

  const rawBody = JSON.stringify(payload);
  const signature = signHermesBody(rawBody, secret);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      body: rawBody,
      headers: {
        "Content-Type": "application/json",
        "X-Hermes-Event": "website.signup",
        "X-Idempotency-Key": payload.idempotency_key,
        "X-Hub-Signature-256": signature,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Hermes webhook failed with ${response.status}`);
    }

    if (hasDatabaseUrl()) {
      await prisma.hermesWebhookDelivery.update({
        where: { idempotencyKey: payload.idempotency_key },
        data: { status: "success", lastStatusCode: response.status, lastError: null },
      });
    }

    return { ok: true, status: response.status };
  } catch (error) {
    console.error("Hermes signup webhook delivery failed", error);

    if (hasDatabaseUrl()) {
      try {
        await prisma.hermesWebhookDelivery.update({
          where: { idempotencyKey: payload.idempotency_key },
          data: {
            status: "failed",
            lastError: error instanceof Error ? error.message : String(error),
          },
        });
      } catch (updateError) {
        console.error("Hermes delivery failure update failed", updateError);
      }
    }

    return { ok: false, error };
  } finally {
    clearTimeout(timeout);
  }
}
