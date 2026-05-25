import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryPage, getLocalizedIndustry, industries } from "@/features/industries";
import { normalizeLocale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string; industrySlug: string }>;
};

export function generateStaticParams() {
  return ["en", "mn"].flatMap((locale) =>
    industries.map((industry) => ({
      locale,
      industrySlug: industry.slug,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, industrySlug } = await params;
  const locale = normalizeLocale(rawLocale);
  const industry = getLocalizedIndustry(industrySlug, locale);

  if (!industry) {
    return {
      title: "Industry Not Found | AgenticForce",
    };
  }

  return {
    title: `${industry.navLabel} AI Agents | AgenticForce`,
    description: industry.description,
  };
}

export default async function LocalizedIndustryPage({ params }: PageProps) {
  const { locale: rawLocale, industrySlug } = await params;
  const locale = normalizeLocale(rawLocale);
  const industry = getLocalizedIndustry(industrySlug, locale);

  if (!industry) {
    notFound();
  }

  return <IndustryPage slug={industrySlug} locale={locale} />;
}
