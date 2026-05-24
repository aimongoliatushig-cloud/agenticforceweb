"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  DatabaseZap,
  Gauge,
  Handshake,
  Layers3,
  Mail,
  MessageSquareText,
  PhoneCall,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Locale } from "@/lib/i18n";
import {
  getChannelIcon,
} from "./data";
import {
  getLocalizedAgentsBySlugs,
  getLocalizedCategories,
  getLocalizedOverview,
  overviewCopy,
  solutionPath,
} from "./localization";

const flowIcons = [Target, DatabaseZap, Sparkles, Layers3, Rocket, Mail, Gauge, PhoneCall, CheckCircle2];

export function SalesMarketingOverviewPage({
  locale = "en",
  includeLocale = false,
}: {
  locale?: Locale;
  includeLocale?: boolean;
}) {
  const copy = overviewCopy[locale];
  const localized = getLocalizedOverview(locale);
  const categories = getLocalizedCategories(locale);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070B] text-white">
      <OverviewBackground />

      <section className="relative mx-auto grid min-h-[92svh] max-w-[1440px] items-center gap-10 px-4 pb-14 pt-32 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-10">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/55">
            <Link href={`/${locale}`} className="hover:text-white">{copy.home}</Link>
            <span className="text-amber-300/70">/</span>
            <span className="text-white/78">{copy.solutions}</span>
          </div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/8 px-4 py-2 text-xs font-black uppercase text-amber-200">
            <Sparkles className="h-4 w-4" />
            {copy.label}
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.02] sm:text-6xl lg:text-7xl">
            {copy.titleLead}{" "}
            <span className="bg-gradient-to-r from-[#FFC247] to-[#FF6B3D] bg-clip-text text-transparent">
              {copy.titleAccent}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
            {copy.subheadline}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="premium-cta h-12 rounded-lg bg-gradient-to-r from-[#FF6B3D] to-[#FFC247] px-6 font-bold text-[#120B04]">
              <Link href="/en#request-quote">
                {copy.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-lg border-white/10 bg-white/[0.04] px-6 font-bold text-white hover:bg-white/[0.08]">
              <Link href="#agent-ecosystem">{copy.secondaryCta}</Link>
            </Button>
          </div>

          <div className="mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {copy.stats.map(([value, label]) => (
              <div key={label} className="rounded-lg border border-white/[0.08] bg-white/[0.045] p-4 backdrop-blur-xl">
                <p className="text-xl font-black text-white">{value}</p>
                <p className="mt-1 text-xs text-white/52">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
          <CommandFunnel process={localized.process} copy={copy} />
        </motion.div>
      </section>

      <section id="agent-ecosystem" className="relative mx-auto max-w-[1440px] px-4 pb-24 sm:px-6 lg:px-10">
        <GlassPanel className="p-5 sm:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel>{copy.ecosystemLabel}</SectionLabel>
              <h2 className="mt-3 max-w-4xl text-3xl font-black sm:text-4xl">
                {copy.ecosystemTitle}
              </h2>
            </div>
            <div className="rounded-lg border border-amber-300/20 bg-amber-300/8 px-4 py-3 text-sm font-bold text-amber-100">
              {copy.ecosystemCount}
            </div>
          </div>

          <div className="mt-8 grid gap-5">
            {categories.map((category) => (
              <div key={category.name} className="rounded-lg border border-white/[0.08] bg-black/24 p-4 sm:p-5">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white">{category.name}</h3>
                    <p className="mt-1 text-sm text-white/55">{category.description}</p>
                  </div>
                  <span className="text-xs font-bold uppercase text-amber-200">
                    {category.agents.length} {copy.agentsCount}
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {getLocalizedAgentsBySlugs(category.agents, locale).map((agent) => {
                    const Icon = agent.icon;
                    return (
                      <Link
                        key={agent.slug}
                        href={solutionPath(`/solutions/${agent.slug}`, locale, includeLocale)}
                        className="group rounded-lg border border-white/[0.08] bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:border-amber-300/35 hover:bg-white/[0.065]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200 shadow-[0_0_24px_rgba(255,194,71,0.12)]">
                            <Icon className="h-5 w-5" />
                          </div>
                          <ArrowRight className="h-4 w-4 text-white/28 transition group-hover:translate-x-1 group-hover:text-amber-200" />
                        </div>
                        <h4 className="mt-4 font-black text-white">{agent.agentName.replace(" Agent", "")}</h4>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/56">{agent.primaryBenefit}</p>
                        <p className="mt-4 text-xs font-black text-amber-200">
                          {agent.hoursSaved} {copy.savedSuffix}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </section>

      <section className="relative mx-auto grid max-w-[1440px] gap-5 px-4 pb-24 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <GlassPanel className="p-5 sm:p-7">
          <SectionLabel>{copy.funnelLabel}</SectionLabel>
          <h2 className="mt-3 text-3xl font-black">{copy.funnelTitle}</h2>
          <VerticalSalesFunnel funnel={localized.funnel} />
        </GlassPanel>

        <GlassPanel className="p-5 sm:p-7">
          <SectionLabel>{copy.benefitsLabel}</SectionLabel>
          <h2 className="mt-3 text-3xl font-black">{copy.benefitsTitle}</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {localized.benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.label} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
                  <Icon className="h-5 w-5 text-amber-200" />
                  <p className="mt-4 text-xl font-black text-white">{benefit.label}</p>
                  <p className="mt-1 text-sm text-white/56">{benefit.body}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-lg border border-amber-300/20 bg-amber-300/8 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 shrink-0 text-amber-200" />
              <div>
                <p className="font-black text-white">{copy.approvalTitle}</p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {copy.approvalBody}
                </p>
              </div>
            </div>
          </div>
        </GlassPanel>
      </section>

      <section className="relative mx-auto max-w-[1440px] px-4 pb-24 sm:px-6 lg:px-10">
        <GlassPanel className="overflow-hidden p-5 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <SectionLabel>{copy.channelsLabel}</SectionLabel>
              <h2 className="mt-3 text-3xl font-black">{copy.channelsTitle}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {localized.channels.map((channel) => {
                const Icon = getChannelIcon(channel);
                return (
                  <div key={channel} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4 text-center">
                    <Icon className="mx-auto h-5 w-5 text-amber-200" />
                    <p className="mt-3 text-xs font-bold text-white/72">{channel}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassPanel>
      </section>

      <section className="relative px-4 pb-24 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1180px] overflow-hidden rounded-lg border border-amber-300/20 bg-[linear-gradient(135deg,rgba(255,107,61,0.16),rgba(255,194,71,0.08)_42%,rgba(255,255,255,0.035))] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.45)] sm:p-9">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <SectionLabel>{copy.ctaLabel}</SectionLabel>
              <h2 className="mt-3 max-w-3xl text-3xl font-black sm:text-4xl">
                {copy.ctaTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-white/68">
                {copy.ctaBody}
              </p>
            </div>
            <Button asChild className="h-12 rounded-lg bg-gradient-to-r from-[#FF6B3D] to-[#FFC247] px-6 font-bold text-[#120B04]">
              <Link href="/en#request-quote">
                {locale === "mn" ? "Демо захиалах" : "Book a Demo"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function OverviewBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#05070B]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,107,61,0.15),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(255,194,71,0.12),transparent_26%),radial-gradient(circle_at_52%_88%,rgba(255,107,61,0.10),transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] [background-size:72px_72px]" />
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

function CommandFunnel({ process, copy }: { process: string[]; copy: (typeof overviewCopy)["en"] }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-[#080A0F]/86 p-4 shadow-[0_30px_110px_rgba(0,0,0,0.55),0_0_60px_rgba(255,107,61,0.08)] backdrop-blur-xl sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,194,71,0.13),transparent_30%)]" />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase text-amber-200">{copy.commandFunnelLabel}</p>
          <h2 className="mt-2 text-xl font-black">{copy.commandFunnelTitle}</h2>
        </div>
        <div className="rounded-lg border border-amber-300/20 bg-amber-300/8 px-3 py-2 text-xs font-bold text-amber-100">
          {copy.commandFunnelBadge}
        </div>
      </div>

      <div className="relative z-10 mt-7 grid gap-3">
        {process.map((step, index) => {
          const Icon = flowIcons[index] ?? Sparkles;
          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: index % 2 ? 18 : -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className={cn(
                "grid items-center gap-3 rounded-lg border p-3 sm:grid-cols-[44px_1fr_90px]",
                index === 4 || index === 6
                  ? "border-amber-300/28 bg-amber-300/8 shadow-[0_0_34px_rgba(255,194,71,0.12)]"
                  : "border-white/[0.08] bg-white/[0.04]"
              )}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/[0.06] text-amber-200">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-black text-white">{step}</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#FF6B3D] to-[#FFC247]"
                    animate={{ x: ["-100%", "120%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.12 }}
                  />
                </div>
              </div>
              <p className="text-xs font-bold text-white/45">
                {copy.stage} {index + 1}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function VerticalSalesFunnel({ funnel }: { funnel: string[] }) {
  return (
    <div className="mt-8 grid gap-3">
      {funnel.map((stage, index) => {
        const width = 100 - index * 8;
        return (
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: index * 0.04 }}
            className="mx-auto rounded-lg border border-white/[0.08] bg-white/[0.04] p-3 text-center"
            style={{ width: `${width}%` }}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF6B3D] to-[#FFC247] text-sm font-black text-[#130C04]">
                {index + 1}
              </div>
              <p className="font-black text-white">{stage}</p>
            </div>
          </motion.div>
        );
      })}
      <div className="mx-auto mt-2 flex h-16 w-16 items-center justify-center rounded-full border border-amber-300/35 bg-amber-300/10 shadow-[0_0_48px_rgba(255,194,71,0.22)]">
        <Handshake className="h-7 w-7 text-amber-200" />
      </div>
    </div>
  );
}
