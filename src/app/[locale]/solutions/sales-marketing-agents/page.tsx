import type { Metadata } from "next";
import { SalesMarketingOverviewPage } from "@/features/solutions";
import { normalizeLocale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return {
    title:
      locale === "mn"
        ? "Борлуулалт ба маркетингийн агентууд | AgenticForce"
        : "Sales & Marketing Agents | AgenticForce",
    description:
      locale === "mn"
        ? "Лийд үүсгэлт, контент, nurturing, scoring, reporting болон хүний handoff-д зориулсан enterprise AI command center."
        : "An enterprise AI command center for lead generation, content, nurturing, scoring, reporting, and human sales handoff.",
  };
}

export default async function LocalizedSalesMarketingAgentsPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return <SalesMarketingOverviewPage locale={locale} includeLocale />;
}
