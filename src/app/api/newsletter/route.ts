import { NextResponse } from "next/server";
import { z } from "zod";
import { getAppUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { normalizeLocale } from "@/lib/i18n";
import { publicFormGuard } from "@/lib/public-form-guard";

const schema = z.object({
  email: z.string().email(),
  consent: z.boolean(),
  locale: z.string().optional(),
  website: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const input = schema.safeParse(body);
  if (!input.success || !input.data.consent) {
    return NextResponse.json({ error: "Invalid newsletter request" }, { status: 400 });
  }
  const denied = publicFormGuard(request, body || {});
  if (denied) return denied;

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: true, stored: false });
  }

  const appUser = await getAppUser();

  try {
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email: input.data.email.toLowerCase() },
      update: {
        consent: true,
        locale: normalizeLocale(input.data.locale),
        userId: appUser?.id,
      },
      create: {
        email: input.data.email.toLowerCase(),
        consent: true,
        locale: normalizeLocale(input.data.locale),
        userId: appUser?.id,
        unsubscribeToken: crypto.randomUUID(),
      },
    });

    return NextResponse.json({ ok: true, id: subscriber.id });
  } catch {
    return NextResponse.json({ error: "Newsletter storage failed" }, { status: 500 });
  }
}
