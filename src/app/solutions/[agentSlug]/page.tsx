import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgentIntroPageBySlug, agents, getAgentBySlug } from "@/features/solutions";

type AgentPageProps = {
  params: Promise<{ agentSlug: string }>;
};

export function generateStaticParams() {
  return agents.map((agent) => ({ agentSlug: agent.slug }));
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { agentSlug } = await params;
  const agent = getAgentBySlug(agentSlug);

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

export default async function AgentPage({ params }: AgentPageProps) {
  const { agentSlug } = await params;
  const agent = getAgentBySlug(agentSlug);

  if (!agent) {
    notFound();
  }

  return <AgentIntroPageBySlug slug={agentSlug} />;
}
