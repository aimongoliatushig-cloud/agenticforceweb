import { NextResponse } from "next/server";
import { z } from "zod";
import { getAppUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { normalizeLocale } from "@/lib/i18n";

const schema = z.object({
  email: z.string().email(),
  consent: z.boolean(),
  locale: z.string().optional(),
});

export async function POST(request: Request) {
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success || !input.data.consent) {
    return NextResponse.json({ error: "Invalid newsletter request" }, { status: 400 });
  }

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
