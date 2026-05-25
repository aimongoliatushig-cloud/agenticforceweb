import { ArticleCard } from "./ArticleCard";
import type { LocalizedArticle } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

type ArticleSliderProps = {
  title: string;
  articles: LocalizedArticle[];
  locale: Locale;
};

export function ArticleSlider({ title, articles, locale }: ArticleSliderProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm text-white/45">{articles.length} items</p>
      </div>
      <div className="-mx-4 mt-5 overflow-x-auto px-4 pb-4 [scrollbar-color:rgba(245,158,11,0.55)_rgba(255,255,255,0.08)]">
        <div className="flex snap-x gap-4">
          {articles.map((article) => (
            <div key={article.slug} className="w-[82vw] shrink-0 snap-start sm:w-[360px]">
              <ArticleCard article={article} locale={locale} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
