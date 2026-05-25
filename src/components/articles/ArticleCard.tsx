import Image from "next/image";
import Link from "next/link";
import { Clock, ExternalLink } from "lucide-react";
import { articleCategoryLabel } from "@/lib/articles";
import { articleExcerpt, articleTitle, type LocalizedArticle } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

type ArticleCardProps = {
  article: LocalizedArticle;
  locale: Locale;
  compact?: boolean;
};

export function ArticleCard({ article, locale, compact = false }: ArticleCardProps) {
  const publishedAt = article.publishedAt ? new Date(article.publishedAt) : null;
  const imageAlt =
    locale === "mn"
      ? article.imageAltMn || articleTitle(article, locale)
      : article.imageAltEn || articleTitle(article, locale);

  return (
    <Link
      href={`/${locale}/articles/${article.slug}`}
      className="group block h-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] transition-colors hover:border-amber-400/45"
    >
      <div className={compact ? "relative h-36" : "relative h-48"}>
        <Image
          src={article.coverImage || "/placeholder.jpg"}
          alt={imageAlt}
          fill
          sizes={compact ? "320px" : "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      </div>
      <div className={compact ? "p-4" : "p-5"}>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
          {articleCategoryLabel(article, locale)}
        </p>
        <h2 className={compact ? "mt-2 line-clamp-2 text-base font-semibold" : "mt-3 text-xl font-semibold"}>
          {articleTitle(article, locale)}
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/62">
          {articleExcerpt(article, locale)}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/45">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {article.readTime} min
          </span>
          {article.sourceName ? (
            <span className="inline-flex items-center gap-1">
              <ExternalLink className="h-3.5 w-3.5" />
              {article.sourceName}
            </span>
          ) : null}
          {publishedAt ? (
            <span>
              {publishedAt.toLocaleDateString(locale === "mn" ? "mn-MN" : "en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
