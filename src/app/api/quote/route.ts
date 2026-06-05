import { NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { normalizeLocale } from "@/lib/i18n";
import { publicFormGuard } from "@/lib/public-form-guard";

const schema = z.object({
  name: z.string().min(2).max(120),
  company: z.string().max(160).optional().nullable(),
  email: z.string().email(),
  serviceInterest: z.string().min(2).max(160),
  message: z.string().min(10).max(4000),
  locale: z.string().optional(),
  website: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const input = schema.safeParse(body);
  if (!input.success) {
    return NextResponse.json({ error: "Invalid quote request" }, { status: 400 });
  }
  const denied = publicFormGuard(request, body || {});
  if (denied) return denied;

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const quote = await prisma.quoteRequest.create({
      data: {
        name: input.data.name,
        company: input.data.company || null,
        email: input.data.email.toLowerCase(),
        serviceInterest: input.data.serviceInterest,
        message: input.data.message,
        locale: normalizeLocale(input.data.locale),
      },
    });

    return NextResponse.json({ ok: true, id: quote.id });
  } catch {
    return NextResponse.json({ error: "Quote storage failed" }, { status: 500 });
  }
}
