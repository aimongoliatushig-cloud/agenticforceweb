import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SignUpButton } from "@clerk/nextjs";
import { LockKeyhole } from "lucide-react";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ArticleReadTracker } from "@/components/ArticleReadTracker";
import { Button } from "@/components/ui/button";
import { articleBody, articleExcerpt, articleTitle } from "@/lib/content";
import { articleCategoryLabel, getArticleBySlug } from "@/lib/articles";
import { articleIndustryPath, getArticleIndustry } from "@/lib/article-industries";
import { getCurrentUserId } from "@/lib/auth";
import { dictionary, normalizeLocale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ArticlePage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = normalizeLocale(rawLocale);
  const article = await getArticleBySlug(slug);
  const userId = await getCurrentUserId();
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!article) notFound();

  const body = articleBody(article, locale).split("\n\n");
  const visibleCount = userId ? body.length : Math.max(1, Math.ceil(body.length / 2));
  const hidden = body.slice(visibleCount);
  const visible = body.slice(0, visibleCount);
  const copy = dictionary[locale].articles;
  const industry = getArticleIndustry(article.industrySlug);
  const imageAlt =
    locale === "mn"
      ? article.imageAltMn || articleTitle(article, locale)
      : article.imageAltEn || articleTitle(article, locale);

  return (
    <article className="min-h-screen bg-black pt-24 text-white">
      <AnalyticsTracker locale={locale} />
      <ArticleReadTracker slug={slug} locale={locale} />
      <section className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Link href={`/${locale}/articles`} className="text-sm text-amber-300 hover:text-amber-200">
            ← {locale === "mn" ? "Нийтлэлүүд" : "Articles"}
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
            {industry ? (
              <Link href={articleIndustryPath(industry.slug, locale)} className="hover:text-amber-100">
                {articleCategoryLabel(article, locale)}
              </Link>
            ) : (
              articleCategoryLabel(article, locale)
            )}{" "}
            · {article.readTime} min
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
            {articleTitle(article, locale)}
          </h1>
          <p className="mt-5 text-lg leading-8 text-white/65">{articleExcerpt(article, locale)}</p>
          {article.sourceName ? (
            <p className="mt-4 text-sm text-white/45">
              {locale === "mn" ? "Эх сурвалж" : "Source"}:{" "}
              {article.canonicalSourceUrl ? (
                <a href={article.canonicalSourceUrl} target="_blank" rel="noreferrer" className="text-amber-300">
                  {article.sourceName}
                </a>
              ) : (
                article.sourceName
              )}
            </p>
          ) : null}
        </div>
        <div className="relative mx-auto mt-8 h-[340px] max-w-5xl overflow-hidden rounded-lg border border-white/10">
          <Image
            src={article.coverImage || "/placeholder.jpg"}
            alt={imageAlt}
            fill
            className="object-cover"
          />
        </div>
        <div className="prose prose-invert prose-lg mx-auto mt-10 max-w-3xl prose-p:text-white/72">
          {visible.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {!userId && hidden.length > 0 ? (
          <div className="relative mx-auto max-w-3xl">
            <div className="pointer-events-none max-h-56 overflow-hidden opacity-45 blur-[2px]">
              <div className="prose prose-invert prose-lg prose-p:text-white/72">
                {hidden.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-amber-400/25 bg-black/85 p-6 shadow-2xl shadow-black backdrop-blur">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-300">
                    <LockKeyhole className="h-5 w-5" />
                    <h2 className="text-xl font-bold">{copy.gatedTitle}</h2>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/62">{copy.gatedBody}</p>
                </div>
                {clerkEnabled ? (
                  <SignUpButton mode="modal" forceRedirectUrl={`/${locale}/articles/${slug}`}>
                    <Button className="bg-gradient-to-r from-red-500 to-amber-500 text-white">
                      {dictionary[locale].nav.signUp}
                    </Button>
                  </SignUpButton>
                ) : (
                  <Button asChild className="bg-gradient-to-r from-red-500 to-amber-500 text-white">
                    <Link href={`/${locale}#newsletter`}>{dictionary[locale].nav.signUp}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </article>
  );
}
