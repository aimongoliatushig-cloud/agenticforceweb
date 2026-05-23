import { NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabaseUrl, prisma } from "@/lib/db";

const articleInput = z.object({
  slug: z.string().min(3).max(180),
  canonicalSourceUrl: z.string().url().optional(),
  sourceName: z.string().max(160).optional(),
  coverImage: z.string().optional(),
  category: z.string().min(2).max(80).default("AI News"),
  readTime: z.number().int().min(1).max(60).default(4),
  titleEn: z.string().min(5),
  titleMn: z.string().min(5),
  excerptEn: z.string().min(10),
  excerptMn: z.string().min(10),
  bodyEn: z.string().min(50),
  bodyMn: z.string().min(50),
});

const schema = z.object({
  articles: z.array(articleInput).min(1).max(20),
});

export async function POST(request: Request) {
  const expected = process.env.HERMES_AGENT_SECRET;
  const provided = request.headers.get("x-hermes-secret");

  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "Unauthorized Hermes request" }, { status: 401 });
  }

  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success) {
    return NextResponse.json({ error: "Invalid Hermes payload" }, { status: 400 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: true, stored: false, imported: 0 });
  }

  let imported = 0;

  for (const article of input.data.articles) {
    const existing = article.canonicalSourceUrl
      ? await prisma.article.findFirst({
          where: { canonicalSourceUrl: article.canonicalSourceUrl },
          select: { id: true },
        })
      : await prisma.article.findUnique({
          where: { slug: article.slug },
          select: { id: true },
        });

    if (existing) continue;

    await prisma.article.create({
      data: {
        ...article,
        status: "draft",
        sourceType: "hermes",
      },
    });
    imported += 1;
  }

  return NextResponse.json({ ok: true, imported });
}
