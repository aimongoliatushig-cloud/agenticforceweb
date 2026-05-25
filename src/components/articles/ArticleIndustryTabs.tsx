import Link from "next/link";
import { articleIndustries, articleIndustryPath } from "@/lib/article-industries";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

type ArticleIndustryTabsProps = {
  locale: Locale;
  activeSlug?: string;
};

export function ArticleIndustryTabs({ locale, activeSlug }: ArticleIndustryTabsProps) {
  return (
    <div className="-mx-4 mt-10 overflow-x-auto px-4 pb-2">
      <div className="flex min-w-max gap-2">
        <Link
          href={`/${locale}/articles`}
          className={cn(
            "rounded-lg border px-4 py-2 text-sm transition-colors",
            !activeSlug
              ? "border-amber-400/70 bg-amber-400/10 text-amber-100"
              : "border-white/10 bg-white/[0.04] text-white/65 hover:border-white/25 hover:text-white"
          )}
        >
          {locale === "mn" ? "Бүх нийтлэл" : "All"}
        </Link>
        {articleIndustries.map((industry) => (
          <Link
            key={industry.slug}
            href={articleIndustryPath(industry.slug, locale)}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm transition-colors",
              activeSlug === industry.slug
                ? "border-amber-400/70 bg-amber-400/10 text-amber-100"
                : "border-white/10 bg-white/[0.04] text-white/65 hover:border-white/25 hover:text-white"
            )}
          >
            {industry[locale].label}
          </Link>
        ))}
      </div>
    </div>
  );
}
