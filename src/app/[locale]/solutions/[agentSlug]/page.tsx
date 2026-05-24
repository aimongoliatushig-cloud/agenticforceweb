import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgentIntroPageBySlug, agents, getLocalizedAgentBySlug } from "@/features/solutions";
import { normalizeLocale } from "@/lib/i18n";

type AgentPageProps = {
  params: Promise<{ locale: string; agentSlug: string }>;
};

export function generateStaticParams() {
  return ["en", "mn"].flatMap((locale) =>
    agents.map((agent) => ({
      locale,
      agentSlug: agent.slug,
    }))
  );
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { locale: rawLocale, agentSlug } = await params;
  const locale = normalizeLocale(rawLocale);
  const agent = getLocalizedAgentBySlug(agentSlug, locale);

  if (!agent) {
    return {
      title: "Solution Not Found | AgenticForce",
    };
  }

  return {
    title: `${agent.agentName} | AgenticForce`,
    description: agent.subheadline,
  };
}

export default async function LocalizedAgentPage({ params }: AgentPageProps) {
  const { locale: rawLocale, agentSlug } = await params;
  const locale = normalizeLocale(rawLocale);
  const agent = getLocalizedAgentBySlug(agentSlug, locale);

  if (!agent) {
    notFound();
  }

  return <AgentIntroPageBySlug slug={agentSlug} locale={locale} includeLocale />;
}
