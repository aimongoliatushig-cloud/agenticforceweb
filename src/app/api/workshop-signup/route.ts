import crypto from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type FormPayload = {
  event: "workshop.signup";
  source: "agenticforce_website";
  occurred_at: string;
  idempotency_key: string;
  workshop: {
    date: string;
    name: string;
    price: string;
  };
  user: {
    full_name: string;
    email: string;
    phone: string;
  };
  organization: {
    company: string;
    job_title: string;
    industry: string;
    company_size: string;
  };
  marketing: {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    referrer: string;
    landing_page: string;
  };
  metadata: {
    locale: string;
    interest: string;
    environment: string;
  };
};

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function hmac(body: string, secret: string): string {
  return "sha256=" + crypto.createHmac("sha256", secret).update(body).digest("hex");
}

export async function POST(request: Request) {
  const webhookUrl = process.env.HERMES_WEBHOOK_URL;
  const webhookSecret = process.env.HERMES_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    console.error("Workshop signup webhook env vars are missing");
    return NextResponse.json({ ok: false, error: "Signup is not configured yet" }, { status: 503 });
  }

  const form = await request.formData();
  const locale = asString(form.get("locale")) || "mn";
  const workshopDate = asString(form.get("workshopDate")) || process.env.NEXT_PUBLIC_WORKSHOP_DATE || "2026-05-30";
  const email = asString(form.get("email")).toLowerCase();
  const phone = asString(form.get("phone"));
  const fullName = asString(form.get("fullName"));
  const company = asString(form.get("company"));
  const occurredAt = new Date().toISOString();

  if (!fullName || !email || !phone || !company) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  const payload: FormPayload = {
    event: "workshop.signup",
    source: "agenticforce_website",
    occurred_at: occurredAt,
    idempotency_key: `workshop_signup:${workshopDate}:${email || phone}`,
    workshop: {
      date: workshopDate,
      name: locale === "mn" ? "AI company болох эхний алхам" : "The first step to becoming an AI company",
      price: "free",
    },
    user: {
      full_name: fullName,
      email,
      phone,
    },
    organization: {
      company,
      job_title: asString(form.get("jobTitle")),
      industry: asString(form.get("industry")),
      company_size: asString(form.get("companySize")),
    },
    marketing: {
      utm_source: asString(form.get("utm_source")),
      utm_medium: asString(form.get("utm_medium")),
      utm_campaign: asString(form.get("utm_campaign")),
      referrer: request.headers.get("referer") || "",
      landing_page: asString(form.get("landingPage")) || `/${locale}/workshop`,
    },
    metadata: {
      locale,
      interest: asString(form.get("interest")),
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "production",
    },
  };

  const body = JSON.stringify(payload);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Hermes-Event": "website.signup",
        "X-Idempotency-Key": payload.idempotency_key,
        "X-Hub-Signature-256": hmac(body, webhookSecret),
      },
      body,
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error("Hermes webhook failed", response.status, await response.text().catch(() => ""));
      // Do not expose internal webhook details to users.
      return NextResponse.json({ ok: false, error: "Could not save registration" }, { status: 502 });
    }

    const redirectUrl = new URL(`/${locale}/workshop/thank-you`, request.url);
    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error) {
    console.error("Workshop signup submit failed", error);
    return NextResponse.json({ ok: false, error: "Could not save registration" }, { status: 502 });
  }
}
