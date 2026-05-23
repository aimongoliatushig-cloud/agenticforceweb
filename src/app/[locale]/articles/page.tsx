import Image from "next/image";
import Link from "next/link";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { articleExcerpt, articleTitle } from "@/lib/content";
import { getPublishedArticles } from "@/lib/articles";
import { dictionary, normalizeLocale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ArticlesPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const articles = await getPublishedArticles();
  const copy = dictionary[locale].articles;

  return (
    <div className="min-h-screen bg-black pt-24 text-white">
      <AnalyticsTracker locale={locale} />
      <section className="container mx-auto px-4 py-12">
        <h1 className="max-w-4xl text-4xl font-black sm:text-6xl">{copy.title}</h1>
        <p className="mt-5 max-w-3xl text-white/65">{copy.subtitle}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/${locale}/articles/${article.slug}`}
              className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] transition-colors hover:border-amber-400/45"
            >
              <div className="relative h-48">
                <Image
                  src={article.coverImage || "/placeholder.jpg"}
                  alt={articleTitle(article, locale)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
                  {article.category} · {article.readTime} min
                </p>
                <h2 className="mt-3 text-xl font-semibold">{articleTitle(article, locale)}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/62">
                  {articleExcerpt(article, locale)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
