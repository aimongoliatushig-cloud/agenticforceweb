import { NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { normalizeDemoLeadToHermes, sendLeadToHermes } from "@/lib/hermes-leads";
import { normalizeLocale } from "@/lib/i18n";

export const runtime = "nodejs";

const schema = z.object({
  industry: z.string().min(2).max(160),
  companyName: z.string().min(2).max(180),
  contactName: z.string().min(2).max(140),
  phone: z.string().min(6).max(40),
  email: z.string().email().max(180),
  locale: z.string().optional(),
  path: z.string().max(1000).optional().nullable(),
  referrer: z.string().max(1000).optional().nullable(),
});

export async function POST(request: Request) {
  const input = schema.safeParse(await request.json().catch(() => null));

  if (!input.success) {
    return NextResponse.json({ error: "Invalid demo lead" }, { status: 400 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  }

  try {
    const lead = await prisma.demoLead.create({
      data: {
        industry: input.data.industry,
        companyName: input.data.companyName,
        contactName: input.data.contactName,
        phone: input.data.phone,
        email: input.data.email.toLowerCase(),
        locale: normalizeLocale(input.data.locale),
        path: input.data.path || null,
        referrer: input.data.referrer || request.headers.get("referer"),
        userAgent: request.headers.get("user-agent"),
      },
    });

    const payload = normalizeDemoLeadToHermes({ lead });
    await sendLeadToHermes(payload);

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (error) {
    console.error("Demo lead capture failed", error);
    return NextResponse.json({ error: "Demo lead capture failed" }, { status: 500 });
  }
}
