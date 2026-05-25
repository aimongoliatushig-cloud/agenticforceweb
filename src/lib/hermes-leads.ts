import { hasDatabaseUrl, prisma } from "./db";
import { signHermesBody } from "./hermes-signup";

export type HermesLeadPayload = {
  event: "website.lead.created";
  source: "request_demo_popup";
  occurred_at: string;
  idempotency_key: string;
  lead: {
    id: string;
    industry: string;
    company_name: string;
    contact_name: string;
    phone: string;
    email: string;
    locale: string;
    message: string;
  };
  marketing: {
    referrer?: string | null;
    landing_page?: string | null;
  };
  metadata: {
    user_agent?: string | null;
    environment: string;
  };
};

export function normalizeDemoLeadToHermes(input: {
  lead: {
    id: string;
    industry: string;
    companyName: string;
    contactName: string;
    phone: string;
    email: string;
    locale: string;
    path?: string | null;
    referrer?: string | null;
    userAgent?: string | null;
    createdAt?: Date | string;
  };
}): HermesLeadPayload {
  const { lead } = input;

  return {
    event: "website.lead.created",
    source: "request_demo_popup",
    occurred_at: lead.createdAt ? new Date(lead.createdAt).toISOString() : new Date().toISOString(),
    idempotency_key: `demo_lead:${lead.id}`,
    lead: {
      id: lead.id,
      industry: lead.industry,
      company_name: lead.companyName,
      contact_name: lead.contactName,
      phone: lead.phone,
      email: lead.email,
      locale: lead.locale,
      message: `New lead came from ${lead.companyName} in ${lead.industry}. Contact: ${lead.contactName}, ${lead.phone}, ${lead.email}.`,
    },
    marketing: {
      referrer: lead.referrer ?? null,
      landing_page: lead.path ?? null,
    },
    metadata: {
      user_agent: lead.userAgent ?? null,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    },
  };
}

export async function sendLeadToHermes(payload: HermesLeadPayload) {
  const webhookUrl = process.env.HERMES_WEBHOOK_URL;
  const secret = process.env.HERMES_WEBHOOK_SECRET;

  if (!webhookUrl || !secret) {
    console.warn("Hermes lead webhook skipped: HERMES_WEBHOOK_URL or HERMES_WEBHOOK_SECRET is not configured.");
    return { ok: false, skipped: true, reason: "missing_config" };
  }

  if (hasDatabaseUrl()) {
    try {
      const existing = await prisma.hermesWebhookDelivery.findUnique({
        where: { idempotencyKey: payload.idempotency_key },
      });

      if (existing?.status === "success") {
        return { ok: true, skipped: true, reason: "success" };
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
      console.error("Hermes lead delivery idempotency check failed", error);
    }
  }

  const rawBody = JSON.stringify(payload);
  const signature = signHermesBody(rawBody, secret);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      body: rawBody,
      headers: {
        "Content-Type": "application/json",
        "X-Hermes-Event": payload.event,
        "X-Idempotency-Key": payload.idempotency_key,
        "X-Hub-Signature-256": signature,
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Hermes lead webhook failed with ${response.status}`);
    }

    if (hasDatabaseUrl()) {
      await prisma.hermesWebhookDelivery.update({
        where: { idempotencyKey: payload.idempotency_key },
        data: { status: "success", lastStatusCode: response.status, lastError: null },
      });
    }

    return { ok: true, status: response.status };
  } catch (error) {
    console.error("Hermes lead webhook delivery failed", error);

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
        console.error("Hermes lead delivery failure update failed", updateError);
      }
    }

    return { ok: false, error };
  }
}
