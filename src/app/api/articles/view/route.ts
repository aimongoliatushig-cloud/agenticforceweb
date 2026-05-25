import { NextResponse } from "next/server";
import { z } from "zod";
import { getAppUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { normalizeLocale } from "@/lib/i18n";

const schema = z.object({
  slug: z.string().min(3).max(180),
  sessionId: z.string().max(120).optional().nullable(),
  locale: z.string().optional().nullable(),
  percentRead: z.number().int().min(0).max(100).optional().default(0),
  timeOnPage: z.number().int().min(0).max(24 * 60 * 60).optional().default(0),
});

export async function POST(request: Request) {
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success) {
    return NextResponse.json({ error: "Invalid article view" }, { status: 400 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const article = await prisma.article.findUnique({
      where: { slug: input.data.slug },
      select: { id: true },
    });

    if (!article) {
      return NextResponse.json({ ok: true, stored: false });
    }

    const appUser = await getAppUser();

    await prisma.articleView.create({
      data: {
        articleId: article.id,
        userId: appUser?.id,
        sessionId: input.data.sessionId,
        locale: input.data.locale ? normalizeLocale(input.data.locale) : "en",
        percentRead: input.data.percentRead,
        timeOnPage: input.data.timeOnPage,
      },
    });
  } catch {
    return NextResponse.json({ error: "Article view storage failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
