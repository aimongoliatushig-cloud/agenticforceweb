import { NextResponse } from "next/server";
import { z } from "zod";
import { getAppUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { normalizeLocale } from "@/lib/i18n";

const schema = z.object({
  eventType: z.string().min(1).max(80),
  path: z.string().min(1).max(500),
  sessionId: z.string().max(120).optional().nullable(),
  locale: z.string().optional().nullable(),
  referrer: z.string().max(1000).optional().nullable(),
  utmSource: z.string().max(160).optional().nullable(),
  utmMedium: z.string().max(160).optional().nullable(),
  utmCampaign: z.string().max(160).optional().nullable(),
  newsletterClickId: z.string().max(160).optional().nullable(),
  durationSeconds: z.number().int().nonnegative().optional().nullable(),
  isFirstVisit: z.boolean().optional().nullable(),
});

export async function POST(request: Request) {
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: true, stored: false });
  }

  const appUser = await getAppUser();

  try {
    await prisma.pageEvent.create({
      data: {
        eventType: input.data.eventType,
        path: input.data.path,
        sessionId: input.data.sessionId,
        locale: input.data.locale ? normalizeLocale(input.data.locale) : null,
        referrer: input.data.referrer,
        utmSource: input.data.utmSource,
        utmMedium: input.data.utmMedium,
        utmCampaign: input.data.utmCampaign,
        newsletterClickId: input.data.newsletterClickId,
        durationSeconds: input.data.durationSeconds,
        metadata:
          input.data.isFirstVisit === undefined
            ? undefined
            : { isFirstVisit: Boolean(input.data.isFirstVisit) },
        userId: appUser?.id,
      },
    });
  } catch {
    return NextResponse.json({ error: "Analytics storage failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
