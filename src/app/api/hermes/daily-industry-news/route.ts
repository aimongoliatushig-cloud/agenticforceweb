import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { getArticleIndustry, isArticleIndustrySlug } from "@/lib/article-industries";
import { hasDatabaseUrl, prisma } from "@/lib/db";

export const runtime = "nodejs";

const localizedText = z.object({
  en: z.string().min(1),
  mn: z.string().min(1),
});

const hermesArticle = z.object({
  id: z.string().min(3).max(180),
  rank: z.number().int().min(1).max(3),
  title: localizedText,
  summary: localizedText,
  body: localizedText,
  imageUrl: z.string().url(),
  imageAlt: localizedText.optional(),
  sourceName: z.string().min(1).max(160),
  sourceUrl: z.string().url(),
  publishedAt: z.string().datetime().optional().nullable(),
  tags: z.array(z.string().min(1).max(40)).max(12).default([]),
  importanceScore: z.number().int().min(0).max(100).optional().nullable(),
});

const hermesIndustry = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120).refine((slug) => isArticleIndustrySlug(slug), {
    message: "Unknown industry slug",
  }),
  articles: z.array(hermesArticle).max(3).default([]),
});

const payloadSchema = z.object({
  source: z.literal("hermes-daily-industry-news"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timezone: z.literal("Asia/Ulaanbaatar"),
  industries: z.array(hermesIndustry).max(10),
});

function verifySignature({
  rawBody,
  timestamp,
  signature,
  secret,
}: {
  rawBody: string;
  timestamp: string | null;
  signature: string | null;
  secret: string;
}) {
  if (!timestamp || !signature) return false;

  const now = Math.floor(Date.now() / 1000);
  const requestTime = Number(timestamp);

  if (!Number.isFinite(requestTime)) return false;
  if (Math.abs(now - requestTime) > 300) return false;

  const expected =
    "sha256=" +
    crypto
      .createHmac("sha256", secret)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex");

  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== actualBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

function articleSlug(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 150);

  return slug || `hermes-${Date.now()}`;
}

function estimateReadTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(60, Math.max(1, Math.ceil(words / 220)));
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.HERMES_NEWS_WEBHOOK_SECRET;
    const allowedSource = process.env.HERMES_NEWS_ALLOWED_SOURCE ?? "hermes-daily-industry-news";

    if (!secret) {
      return NextResponse.json({ ok: false, error: "Missing webhook secret" }, { status: 500 });
    }

    const source = req.headers.get("x-hermes-source");
    const timestamp = req.headers.get("x-hermes-timestamp");
    const signature = req.headers.get("x-hermes-signature");

    const rawBody = await req.text();
    const valid = verifySignature({ rawBody, timestamp, signature, secret });

    if (!valid) {
      return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
    }

    if (source !== allowedSource) {
      return NextResponse.json({ ok: false, error: "Invalid source" }, { status: 403 });
    }

    const parsed = payloadSchema.safeParse(JSON.parse(rawBody));

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid payload shape", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const receivedArticles = parsed.data.industries.reduce(
      (sum, industry) => sum + industry.articles.length,
      0
    );

    if (!hasDatabaseUrl()) {
      return NextResponse.json({
        ok: true,
        stored: false,
        receivedIndustries: parsed.data.industries.length,
        receivedArticles,
        imported: 0,
        updated: 0,
      });
    }

    const defaultStatus: "draft" | "published" =
      process.env.HERMES_NEWS_DEFAULT_STATUS === "draft" ? "draft" : "published";
    let imported = 0;
    let updated = 0;

    for (const industry of parsed.data.industries) {
      const industryCopy = getArticleIndustry(industry.slug);

      for (const article of industry.articles) {
        const existing =
          (await prisma.article.findFirst({
            where: { canonicalSourceUrl: article.sourceUrl },
            select: { id: true },
          })) ??
          (await prisma.article.findUnique({
            where: { slug: articleSlug(article.id) },
            select: { id: true },
          }));

        const data = {
          slug: articleSlug(article.id),
          status: defaultStatus,
          sourceType: "hermes" as const,
          canonicalSourceUrl: article.sourceUrl,
          sourceName: article.sourceName,
          coverImage: article.imageUrl,
          imageAltEn: article.imageAlt?.en,
          imageAltMn: article.imageAlt?.mn,
          category: industryCopy?.en.label ?? industry.name,
          industrySlug: industry.slug,
          dailyRank: article.rank,
          readTime: estimateReadTime(article.body.en),
          titleEn: article.title.en,
          titleMn: article.title.mn,
          excerptEn: article.summary.en,
          excerptMn: article.summary.mn,
          bodyEn: article.body.en,
          bodyMn: article.body.mn,
          tags: article.tags,
          importanceScore: article.importanceScore,
          publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
        };

        if (existing) {
          await prisma.article.update({
            where: { id: existing.id },
            data,
          });
          updated += 1;
        } else {
          await prisma.article.create({ data });
          imported += 1;
        }
      }
    }

    return NextResponse.json({
      ok: true,
      stored: true,
      receivedIndustries: parsed.data.industries.length,
      receivedArticles,
      imported,
      updated,
    });
  } catch (error) {
    console.error("Hermes daily news webhook error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
