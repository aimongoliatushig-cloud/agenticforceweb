import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ArticleCard, ArticleIndustryGroups, ArticleIndustryTabs, ArticleSlider } from "@/components/articles";
import { getArticleGroupsByIndustry, getPublishedArticles, getTopReadArticles } from "@/lib/articles";
import { dictionary, normalizeLocale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ArticlesPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const [latestArticles, topReadArticles, articles, industryGroups] = await Promise.all([
    getPublishedArticles({ take: 10 }),
    getTopReadArticles({ take: 10 }),
    getPublishedArticles({ take: 24 }),
    getArticleGroupsByIndustry(3),
  ]);
  const copy = dictionary[locale].articles;

  return (
    <div className="min-h-screen bg-black pt-24 text-white">
      <AnalyticsTracker locale={locale} />
      <section className="container mx-auto px-4 py-12">
        <h1 className="max-w-4xl text-4xl font-black sm:text-6xl">{copy.title}</h1>
        <p className="mt-5 max-w-3xl text-white/65">{copy.subtitle}</p>
        <ArticleIndustryTabs locale={locale} />
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
        <ArticleIndustryGroups groups={industryGroups} locale={locale} />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
