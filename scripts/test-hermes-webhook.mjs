import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

function signHermesBody(rawBody, secret) {
  return `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;
}

function normalizeClerkUserCreated(user) {
  const email =
    user.email_addresses.find((item) => item.id === user.primary_email_address_id)?.email_address ??
    user.email_addresses[0]?.email_address ??
    "";

  return {
    event: "website.signup",
    source: "clerk",
    occurred_at: new Date(user.created_at).toISOString(),
    idempotency_key: `clerk_user_created:${user.id}`,
    user: {
      id: user.id,
      email,
      phone: user.phone_numbers[0]?.phone_number ?? null,
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: [user.first_name, user.last_name].filter(Boolean).join(" "),
      username: user.username,
      image_url: user.image_url,
    },
    marketing: {},
    metadata: {
      ip_hash: "hashed-ip",
      user_agent: "local-test",
      environment: "test",
    },
  };
}

function normalizeAcademyEnrollment(enrollment) {
  return {
    event: "website.signup",
    source: "academy_enrollment",
    occurred_at: new Date(enrollment.createdAt).toISOString(),
    idempotency_key: `academy_enrollment:${enrollment.id}`,
    user: {
      id: enrollment.clerkUserId,
      email: enrollment.email,
      phone: enrollment.phone,
      first_name: enrollment.firstName,
      last_name: enrollment.lastName,
      full_name: enrollment.fullName,
    },
    academy: {
      enrollment_id: enrollment.id,
      course_id: enrollment.courseId,
      course_name: enrollment.courseName,
      plan: enrollment.plan,
      price: enrollment.price,
      currency: enrollment.currency,
    },
    marketing: {
      utm_source: enrollment.utmSource,
      utm_medium: enrollment.utmMedium,
      utm_campaign: enrollment.utmCampaign,
      utm_content: enrollment.utmContent,
      utm_term: enrollment.utmTerm,
      referrer: enrollment.referrer,
      landing_page: enrollment.landingPage,
    },
    metadata: {
      ip_hash: "hashed-ip",
      user_agent: enrollment.userAgent,
      environment: "test",
    },
  };
}

async function sendWithFailureSwallowed(payload, fetchImpl) {
  try {
    const rawBody = JSON.stringify(payload);
    const response = await fetchImpl("https://hermes.invalid/webhook", {
      method: "POST",
      body: rawBody,
      headers: {
        "Content-Type": "application/json",
        "X-Hermes-Event": "website.signup",
        "X-Idempotency-Key": payload.idempotency_key,
        "X-Hub-Signature-256": signHermesBody(rawBody, "test-secret"),
      },
    });

    if (!response.ok) {
      throw new Error(`Hermes failed with ${response.status}`);
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

const clerkPayload = normalizeClerkUserCreated({
  id: "user_123",
  email_addresses: [{ id: "email_1", email_address: "lead@example.com" }],
  primary_email_address_id: "email_1",
  phone_numbers: [{ phone_number: "+97699112233" }],
  first_name: "Lead",
  last_name: "Tester",
  username: "leadtester",
  image_url: "https://img.example/avatar.png",
  created_at: Date.parse("2026-05-23T00:00:00.000Z"),
});

assert.equal(clerkPayload.source, "clerk");
assert.equal(clerkPayload.idempotency_key, "clerk_user_created:user_123");
assert.equal(clerkPayload.user.email, "lead@example.com");
assert.equal(clerkPayload.user.phone, "+97699112233");

const academyPayload = normalizeAcademyEnrollment({
  id: "enroll_123",
  clerkUserId: "user_123",
  email: "lead@example.com",
  phone: "+97699112233",
  firstName: "Lead",
  lastName: "Tester",
  fullName: "Lead Tester",
  courseId: "ai-agent-builder",
  courseName: "AI Agent Builder",
  plan: "Builder cohort",
  price: "0",
  currency: "MNT",
  utmSource: "linkedin",
  utmMedium: "social",
  utmCampaign: "academy",
  utmContent: "hero",
  utmTerm: "ai-agent",
  referrer: "https://example.com",
  landingPage: "https://agenticforce.com/en?utm_source=linkedin",
  userAgent: "local-test",
  createdAt: "2026-05-23T00:00:00.000Z",
});

assert.equal(academyPayload.source, "academy_enrollment");
assert.equal(academyPayload.idempotency_key, "academy_enrollment:enroll_123");
assert.equal(academyPayload.academy.course_id, "ai-agent-builder");
assert.equal(academyPayload.marketing.utm_source, "linkedin");

const rawBody = JSON.stringify(academyPayload);
const signature = signHermesBody(rawBody, "test-secret");
const expectedSignature = `sha256=${createHmac("sha256", "test-secret").update(rawBody).digest("hex")}`;
assert.equal(signature, expectedSignature);

const failed = await sendWithFailureSwallowed(academyPayload, async () => ({
  ok: false,
  status: 503,
}));
assert.equal(failed.ok, false);
assert.ok(failed.error instanceof Error);

console.log("Hermes webhook local checks passed.");
