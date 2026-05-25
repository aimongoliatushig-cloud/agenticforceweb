"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  DatabaseZap,
  Globe2,
  Mail,
  MessageSquareText,
  Phone,
  Sparkles,
  UsersRound,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import { getLocalizedIndustry } from "./data";

type IndustryPageProps = {
  slug: string;
  locale?: Locale;
};

const channelIcons = [Globe2, Mail, MessageSquareText, Phone, UsersRound, CalendarClock];
const agentIcons = [UsersRound, MessageSquareText, BarChart3, Phone, DatabaseZap, Sparkles];

export function IndustryPage({ slug, locale = "en" }: IndustryPageProps) {
  const industry = getLocalizedIndustry(slug, locale);

  if (!industry) return null;

  const IndustryIcon = industry.icon;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070B] text-white">
      <IndustryBackground />

      <section className="relative mx-auto grid min-h-[92svh] w-full max-w-[1440px] items-center gap-10 px-4 pb-14 pt-32 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/55">
            <Link href={`/${locale}`} className="hover:text-white">
              {locale === "mn" ? "Нүүр" : "Home"}
            </Link>
            <span className="text-amber-300/70">/</span>
            <span>{locale === "mn" ? "Салбарууд" : "Industries"}</span>
            <span className="text-amber-300/70">/</span>
            <span className="text-white/78">{industry.breadcrumb}</span>
          </div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/8 px-4 py-2 text-xs font-black uppercase text-amber-200 shadow-[0_0_28px_rgba(255,194,71,0.10)]">
            <IndustryIcon className="h-4 w-4" />
            {industry.eyebrow}
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            {industry.title}{" "}
            <span className="bg-gradient-to-r from-[#FFC247] to-[#FF6B3D] bg-clip-text text-transparent">
              {industry.accent}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
            {industry.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="premium-cta h-12 rounded-lg bg-gradient-to-r from-[#FF6B3D] to-[#FFC247] px-6 font-bold text-[#120B04] shadow-[0_14px_42px_rgba(255,107,61,0.22)]"
            >
              <Link href={`/${locale}#request-quote`}>
                {industry.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-lg border-white/10 bg-white/[0.04] px-6 font-bold text-white hover:border-amber-300/35 hover:bg-white/[0.08]"
            >
              <Link href="#industry-agents">{industry.secondaryCta}</Link>
            </Button>
          </div>

          <div className="mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {industry.stats.map((stat) => (
              <KpiCard key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative z-10"
        >
          <IndustryCommandDiagram industryName={industry.navLabel} steps={industry.processSteps} locale={locale} />
        </motion.div>
      </section>

      <section id="industry-agents" className="relative mx-auto max-w-[1440px] px-4 pb-20 sm:px-6 lg:px-10">
        <GlassPanel className="p-5 sm:p-7">
          <SectionLabel>{industry.ecosystemLabel}</SectionLabel>
          <h2 className="mt-3 max-w-4xl text-3xl font-black sm:text-4xl">{industry.ecosystemTitle}</h2>

          <div className="mt-7 flex gap-3 overflow-x-auto border-b border-white/10 pb-3">
            {industry.tabs.map((tab, index) => (
              <span
                key={tab}
                className={cn(
                  "whitespace-nowrap px-1 pb-3 text-sm font-semibold",
                  index === 0 ? "border-b-2 border-amber-300 text-white" : "text-white/52"
                )}
              >
                {tab}
              </span>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industry.agents.map((agent, index) => {
              const Icon = agentIcons[index % agentIcons.length];
              return (
                <article key={agent.title} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-amber-300/35 hover:bg-white/[0.065]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200 shadow-[0_0_24px_rgba(255,194,71,0.12)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-black text-white">{agent.title}</h3>
                  <p className="mt-3 min-h-20 text-sm leading-6 text-white/58">{agent.body}</p>
                  <p className="mt-4 flex items-center gap-2 text-xs font-black text-amber-200">
                    <ClockDot />
                    {agent.metric}
                  </p>
                </article>
              );
            })}
          </div>
        </GlassPanel>
      </section>

      <section className="relative mx-auto grid max-w-[1440px] gap-5 px-4 pb-20 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-10">
        <GlassPanel className="p-5 sm:p-7">
          <SectionLabel>{industry.processLabel}</SectionLabel>
          <h2 className="mt-3 text-3xl font-black">{industry.processTitle}</h2>
          <div className="mt-7 space-y-4">
            {industry.processSteps.map((step, index) => (
              <div key={step.title} className="grid grid-cols-[42px_1fr] gap-4">
                <div className="relative flex justify-center">
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-lg border border-amber-300/35 bg-gradient-to-br from-[#FF6B3D] to-[#FFC247] text-sm font-black text-[#130C04]">
                    {index + 1}
                  </div>
                  {index < industry.processSteps.length - 1 ? (
                    <div className="absolute top-10 h-[calc(100%+16px)] w-px bg-gradient-to-b from-amber-300/55 to-white/8" />
                  ) : null}
                </div>
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-4">
                  <p className="font-semibold text-white">{step.title}</p>
                  <p className="mt-1 text-sm leading-6 text-white/55">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-5 sm:p-7">
          <SectionLabel>{industry.whyLabel}</SectionLabel>
          <h2 className="mt-3 text-3xl font-black">{industry.whyTitle}</h2>
          <div className="mt-7 grid gap-3">
            {industry.benefits.map((benefit, index) => (
              <div key={benefit.title} className="flex items-start gap-3 rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200">
                  {index === 0 ? <UsersRound className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-black text-white">{benefit.title}</p>
                  <p className="mt-1 text-sm leading-6 text-white/58">{benefit.body}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </section>

      <section className="relative mx-auto max-w-[1440px] px-4 pb-20 sm:px-6 lg:px-10">
        <SectionLabel>{industry.casesLabel}</SectionLabel>
        <h2 className="mt-3 text-3xl font-black">{industry.casesTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {industry.useCases.map((useCase) => (
            <GlassPanel key={useCase.title} className="p-5">
              <h3 className="text-lg font-black">{useCase.title}</h3>
              <div className="mt-5 space-y-3">
                {useCase.flow.map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-300/10 text-xs font-black text-amber-200">
                      {index + 1}
                    </span>
                    <span className="text-sm text-white/70">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-lg border border-amber-300/20 bg-amber-300/8 p-3 text-sm font-black text-amber-100">
                {useCase.outcome}
              </div>
            </GlassPanel>
          ))}
        </div>
      </section>

      <section className="relative mx-auto grid max-w-[1440px] gap-5 px-4 pb-24 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <GlassPanel className="p-5 sm:p-7">
          <SectionLabel>{industry.integrationsLabel}</SectionLabel>
          <h2 className="mt-3 text-3xl font-black">{industry.integrationsTitle}</h2>
          <div className="mt-7 flex flex-wrap gap-3">
            {industry.integrations.map((integration, index) => {
              const Icon = channelIcons[index % channelIcons.length];
              return (
                <div key={integration} className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/78">
                  <Icon className="h-4 w-4 text-amber-200" />
                  {integration}
                </div>
              );
            })}
          </div>
        </GlassPanel>

        <div className="relative overflow-hidden rounded-lg border border-amber-300/20 bg-[linear-gradient(135deg,rgba(255,107,61,0.16),rgba(255,194,71,0.08)_42%,rgba(255,255,255,0.035))] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.45)] sm:p-8">
          <div className="absolute right-8 top-8 h-20 w-20 rounded-full bg-amber-200/12 blur-2xl" />
          <SectionLabel>{industry.ctaLabel}</SectionLabel>
          <h2 className="mt-3 text-3xl font-black">{industry.ctaTitle}</h2>
          <p className="mt-4 text-white/68">{industry.ctaBody}</p>
          <Button asChild className="mt-7 h-12 rounded-lg bg-gradient-to-r from-[#FF6B3D] to-[#FFC247] px-6 font-bold text-[#120B04]">
            <Link href={`/${locale}#request-quote`}>
              {industry.primaryCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function IndustryBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#05070B]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,107,61,0.15),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(255,194,71,0.11),transparent_26%),radial-gradient(circle_at_50%_88%,rgba(255,107,61,0.10),transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] [background-size:72px_72px]" />
    </div>
  );
}

function IndustryCommandDiagram({ industryName, steps, locale }: { industryName: string; steps: Array<{ title: string }>; locale: Locale }) {
  const topChannels = locale === "mn" ? ["Вэб сайт", "Имэйл", "SMS", "Сошиал", "Дуудлага"] : ["Website", "Email", "SMS", "Social", "Calls"];
  const bottomFlow = steps.slice(0, 4);

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-[#080A0F]/86 p-4 shadow-[0_30px_110px_rgba(0,0,0,0.55),0_0_60px_rgba(255,107,61,0.08)] backdrop-blur-xl sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,194,71,0.13),transparent_30%)]" />
      <div className="relative z-10 grid gap-4">
        <div className="grid grid-cols-5 gap-3">
          {topChannels.map((channel, index) => {
            const Icon = channelIcons[index % channelIcons.length];
            return (
              <div key={channel} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-3 text-center">
                <Icon className="mx-auto h-5 w-5 text-amber-200" />
                <p className="mt-2 truncate text-xs font-bold text-white/68">{channel}</p>
              </div>
            );
          })}
        </div>

        <div className="relative min-h-[360px] rounded-lg border border-white/[0.08] bg-black/24 p-4">
          <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-44 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-lg border border-amber-300/35 bg-[#0E1016] text-center shadow-[0_0_54px_rgba(255,194,71,0.22)]">
            <Sparkles className="h-6 w-6 text-amber-200" />
            <p className="mt-2 text-lg font-black">{locale === "mn" ? "AI агент" : "AI Agent"}</p>
            <p className="mt-1 text-xs text-white/48">{industryName}</p>
          </div>

          <div className="absolute left-5 top-[42%] w-32 rounded-lg border border-white/[0.08] bg-white/[0.045] p-4 text-center">
            <UsersRound className="mx-auto h-6 w-6 text-amber-200" />
            <p className="mt-2 text-sm font-black">{locale === "mn" ? "Хэрэглэгч" : "Customer"}</p>
          </div>
          <div className="absolute right-5 top-[42%] w-32 rounded-lg border border-white/[0.08] bg-white/[0.045] p-4 text-center">
            <BarChart3 className="mx-auto h-6 w-6 text-amber-200" />
            <p className="mt-2 text-sm font-black">{locale === "mn" ? "Үр дүн" : "Outcome"}</p>
          </div>

          <div className="absolute inset-x-24 top-1/2 h-px bg-gradient-to-r from-transparent via-amber-300/55 to-transparent" />
          <div className="absolute left-1/2 top-24 h-40 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-amber-300/45 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 grid gap-2 sm:grid-cols-4">
            {bottomFlow.map((step, index) => (
              <div key={step.title} className="rounded-lg border border-white/[0.08] bg-black/42 p-3 text-center">
                <p className="text-xs font-black text-amber-200">{index + 1}</p>
                <p className="mt-1 text-xs font-semibold text-white/70">{step.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-amber-300/20 bg-amber-300/8 p-4 text-center text-sm font-black text-amber-100">
          {locale === "mn" ? "AI хөтөлнө. Хүн хянана. Үр дүн хэмжигдэнэ." : "AI drives the work. Humans approve. Results are measured."}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.045] p-4 backdrop-blur-xl">
      <Zap className="h-5 w-5 text-amber-200" />
      <p className="mt-3 text-xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-white/52">{label}</p>
    </div>
  );
}

function GlassPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-white/[0.08] bg-white/[0.045] shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl", className)}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-black uppercase text-amber-200">{children}</p>;
}

function ClockDot() {
  return <span className="h-3 w-3 rounded-full border border-amber-200/70 bg-amber-300/15" />;
}
