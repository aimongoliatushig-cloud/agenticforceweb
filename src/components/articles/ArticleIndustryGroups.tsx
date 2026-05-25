import Link from "next/link";
import { ArticleCard } from "./ArticleCard";
import { articleIndustryPath } from "@/lib/article-industries";
import type { ArticleIndustryGroup } from "@/lib/articles";
import type { Locale } from "@/lib/i18n";

type ArticleIndustryGroupsProps = {
  groups: ArticleIndustryGroup[];
  locale: Locale;
};

export function ArticleIndustryGroups({ groups, locale }: ArticleIndustryGroupsProps) {
  if (groups.length === 0) return null;

  return (
    <section className="mt-12 space-y-10">
      <h2 className="text-2xl font-bold">
        {locale === "mn" ? "Салбар бүрийн шилдэг 3 мэдээ" : "Top 3 by industry"}
      </h2>
      {groups.map((group) => (
        <div key={group.slug}>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold">{locale === "mn" ? group.labelMn : group.labelEn}</h3>
            <Link
              href={articleIndustryPath(group.slug, locale)}
              className="text-sm font-medium text-amber-300 hover:text-amber-200"
            >
              {locale === "mn" ? "Бүгдийг харах" : "View all"}
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {group.articles.map((article) => (
              <ArticleCard key={article.slug} article={article} locale={locale} compact />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
