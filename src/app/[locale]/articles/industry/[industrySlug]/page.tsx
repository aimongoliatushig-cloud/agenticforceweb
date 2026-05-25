import { notFound } from "next/navigation";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ArticleCard, ArticleIndustryTabs, ArticleSlider } from "@/components/articles";
import { getPublishedArticles, getTopReadArticles } from "@/lib/articles";
import { getArticleIndustry } from "@/lib/article-industries";
import { normalizeLocale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string; industrySlug: string }>;
};

export default async function ArticleIndustryPage({ params }: PageProps) {
  const { locale: rawLocale, industrySlug } = await params;
  const locale = normalizeLocale(rawLocale);
  const industry = getArticleIndustry(industrySlug);

  if (!industry) notFound();

  const [latestArticles, topReadArticles, articles] = await Promise.all([
    getPublishedArticles({ industrySlug, take: 10 }),
    getTopReadArticles({ industrySlug, take: 10 }),
    getPublishedArticles({ industrySlug, take: 24 }),
  ]);

  return (
    <div className="min-h-screen bg-black pt-24 text-white">
      <AnalyticsTracker locale={locale} />
      <section className="container mx-auto px-4 py-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
          {locale === "mn" ? "Салбарын AI мэдээ" : "Industry AI news"}
        </p>
        <h1 className="max-w-4xl text-4xl font-black sm:text-6xl">{industry[locale].title}</h1>
        <p className="mt-5 max-w-3xl text-white/65">{industry[locale].subtitle}</p>
        <ArticleIndustryTabs locale={locale} activeSlug={industrySlug} />
        <ArticleSlider
          title={locale === "mn" ? "Сүүлийн 10 мэдээ" : "Latest 10 news"}
          articles={latestArticles}
          locale={locale}
        />
        <ArticleSlider
          title={locale === "mn" ? "Хамгийн их уншсан 10" : "Top read 10 news"}
          articles={topReadArticles}
          locale={locale}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
