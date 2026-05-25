import { industries } from "@/features/industries";
import type { Locale } from "./i18n";

export const articleIndustries = industries.map((industry) => ({
  slug: industry.slug,
  en: {
    label: industry.en.navLabel,
    description: `AI news and briefings for ${industry.en.navLabel.toLowerCase()}.`,
    title: `${industry.en.navLabel} AI news`,
    subtitle: `Daily Hermes briefings about how AI is changing ${industry.en.navLabel.toLowerCase()}.`,
  },
  mn: {
    label: industry.mn.navLabel,
    description: `${industry.mn.navLabel} AI news`,
    title: `${industry.mn.navLabel} AI news`,
    subtitle: `Hermes ${industry.mn.navLabel} category.`,
  },
}));

export type ArticleIndustry = (typeof articleIndustries)[number];

export function getArticleIndustry(slug: string | null | undefined) {
  if (!slug) return undefined;
  return articleIndustries.find((industry) => industry.slug === slug);
}

export function isArticleIndustrySlug(slug: string | null | undefined): slug is string {
  return Boolean(getArticleIndustry(slug));
}

export function articleIndustryPath(slug: string, locale: Locale = "en") {
  return `/${locale}/articles/industry/${slug}`;
}

export function getArticleIndustryNavItems(locale: Locale = "en") {
  return [
    {
      label: locale === "mn" ? "Бүх нийтлэл" : "All articles",
      description: locale === "mn" ? "Нийт мэдээ, нийтлэл" : "Latest AI articles and briefings",
      href: `/${locale}/articles`,
    },
    ...articleIndustries.map((industry) => ({
      label: industry[locale].label,
      description: industry[locale].description,
      href: articleIndustryPath(industry.slug, locale),
    })),
  ];
}
