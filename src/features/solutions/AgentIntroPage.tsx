"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  DatabaseZap,
  Gauge,
  GitBranch,
  Handshake,
  Network,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type AgentIntroData,
  type AgentVisualType,
  getChannelIcon,
} from "./data";
import { getLocalizedAgentBySlug, introCopy, solutionPath } from "./localization";
import { type Locale } from "@/lib/i18n";

type AgentIntroPageProps = AgentIntroData & {
  locale?: Locale;
  includeLocale?: boolean;
};

type DiagramMode =
  | "radar"
  | "profile"
  | "intel"
  | "article"
  | "hub"
  | "signals"
  | "router"
  | "gauge"
  | "crm"
  | "calendar"
  | "ideas"
  | "brand"
  | "media"
  | "qa"
  | "publish"
  | "report"
  | "social";

const diagramModes: Record<AgentVisualType, DiagramMode> = {
  "prospector-radar": "radar",
  "enrichment-profile": "profile",
  "research-intel": "intel",
  "blog-seo": "article",
  "newsletter-hub": "hub",
  "email-signals": "signals",
  "sms-router": "router",
  "scoring-gauge": "gauge",
  "crm-sync": "crm",
  "social-radar": "social",
  "calendar-grid": "calendar",
  "ideation-engine": "ideas",
  "brand-system": "brand",
  "media-generator": "media",
  "visual-qa": "qa",
  "publishing-orbit": "publish",
  "reporting-room": "report",
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function AgentIntroPage(props: AgentIntroPageProps) {
  const locale = props.locale ?? "en";
  const copy = introCopy[locale];
  const withLocale = props.includeLocale ?? false;
  const {
    agentName,
    eyebrow,
    headline,
    subheadline,
    primaryBenefit,
    hoursSaved,
    qualifiedLeadImpact,
    channels,
    processSteps,
    benefits,
    humanInLoop,
    integrations,
    visualType,
    icon: AgentIcon,
  } = props;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070B] text-white">
      <CommandBackground />
      <section className="relative mx-auto grid min-h-[92svh] w-full max-w-[1440px] items-center gap-10 px-4 pb-14 pt-32 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/55">
            <Link
              href={solutionPath("/solutions/sales-marketing-agents", locale, withLocale)}
              className="hover:text-white"
            >
              {copy.solutions}
            </Link>
            <span className="text-amber-300/70">/</span>
            <span className="text-white/78">{agentName}</span>
          </div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/8 px-4 py-2 text-xs font-bold uppercase text-amber-200 shadow-[0_0_28px_rgba(255,194,71,0.10)]">
            <AgentIcon className="h-4 w-4" />
            {eyebrow}
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            {headline}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
            {subheadline}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="premium-cta h-12 rounded-lg bg-gradient-to-r from-[#FF6B3D] to-[#FFC247] px-6 font-bold text-[#120B04] shadow-[0_14px_42px_rgba(255,107,61,0.22)] hover:from-[#ff7b4f] hover:to-[#ffd06b]"
            >
              <Link href={`/${locale}#request-quote`}>
                {copy.bookDemo}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-lg border-white/10 bg-white/[0.04] px-6 font-bold text-white hover:border-amber-300/35 hover:bg-white/[0.08]"
            >
              <Link href={solutionPath("/solutions/sales-marketing-agents", locale, withLocale)}>
                {copy.exploreSystem}
              </Link>
            </Button>
          </div>

          <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
            <KpiCard label={copy.hoursSaved} value={hoursSaved} icon={Zap} />
            <KpiCard label={copy.pipelineImpact} value={qualifiedLeadImpact} icon={Gauge} />
            <KpiCard label={copy.primaryBenefit} value={primaryBenefit} icon={Sparkles} compact />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative z-10"
        >
          <AgentWorkflowDiagram
            agentName={agentName}
            channels={channels}
            processSteps={processSteps}
            integrations={integrations}
            visualType={visualType}
            copy={copy}
            locale={locale}
          />
        </motion.div>
      </section>

      <section className="relative mx-auto grid max-w-[1440px] gap-5 px-4 pb-24 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-10">
        <GlassPanel className="p-5 sm:p-7">
          <SectionLabel>{copy.howItWorks}</SectionLabel>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{copy.operatingSequence}</h2>
          <div className="mt-7 space-y-4">
            {processSteps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ delay: index * 0.05 }}
                className="group grid grid-cols-[42px_1fr] gap-4"
              >
                <div className="relative flex justify-center">
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-lg border border-amber-300/35 bg-gradient-to-br from-[#FF6B3D] to-[#FFC247] text-sm font-black text-[#130C04] shadow-[0_0_28px_rgba(255,194,71,0.22)]">
                    {index + 1}
                  </div>
                  {index < processSteps.length - 1 ? (
                    <div className="absolute top-10 h-[calc(100%+16px)] w-px bg-gradient-to-b from-amber-300/55 to-white/8" />
                  ) : null}
                </div>
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-4 transition group-hover:border-amber-300/30 group-hover:bg-white/[0.055]">
                  <p className="font-semibold text-white">{step}</p>
                  <p className="mt-1 text-sm leading-6 text-white/55">
                    {copy.stepBody}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassPanel>

        <div className="grid gap-5">
          <GlassPanel className="p-5 sm:p-7">
            <SectionLabel>{copy.businessOutcomes}</SectionLabel>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{copy.whyItMatters}</h2>
            <div className="mt-6 grid gap-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: index * 0.04 }}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.04] p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200 shadow-[0_0_22px_rgba(255,194,71,0.12)]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-white/88">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="overflow-hidden p-5 sm:p-7">
            <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <SectionLabel>{copy.humanLabel}</SectionLabel>
                <h2 className="mt-3 text-2xl font-bold">{copy.humanTitle}</h2>
                <p className="mt-4 leading-7 text-white/65">{humanInLoop}</p>
              </div>
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-amber-300/25 bg-amber-300/8 shadow-[0_0_60px_rgba(255,194,71,0.22)]">
                <div className="absolute inset-4 rounded-full border border-amber-200/20" />
                <ShieldCheck className="h-11 w-11 text-amber-200" />
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-[1440px] gap-5 px-4 pb-24 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <GlassPanel className="p-5 sm:p-7">
          <SectionLabel>{copy.channelsLabel}</SectionLabel>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{copy.channelsTitle}</h2>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[...new Set([...channels, ...integrations])].slice(0, 9).map((item) => {
              const Icon = getChannelIcon(item);
              return (
                <div key={item} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
                  <Icon className="h-5 w-5 text-amber-200" />
                  <p className="mt-3 text-sm font-semibold text-white/82">{item}</p>
                </div>
              );
            })}
          </div>
        </GlassPanel>

        <GlassPanel className="relative overflow-hidden p-5 sm:p-7">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-amber-300/10 blur-3xl" />
          <SectionLabel>{copy.kpiLabel}</SectionLabel>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{copy.kpiTitle}</h2>
          <div className="relative mt-7 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-amber-300/20 bg-gradient-to-br from-amber-300/12 to-orange-500/8 p-5">
              <p className="text-sm text-white/58">{copy.manualWork}</p>
              <p className="mt-2 text-4xl font-black text-white">{hoursSaved}</p>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-5">
              <p className="text-sm text-white/58">{copy.revenueEffect}</p>
              <p className="mt-2 text-2xl font-black text-amber-200">{qualifiedLeadImpact}</p>
            </div>
          </div>
          <div className="relative mt-5 rounded-lg border border-white/[0.08] bg-[#080A0F]/80 p-4">
            <div className="flex items-center gap-3">
              <DatabaseZap className="h-5 w-5 text-amber-200" />
              <p className="font-semibold text-white">{copy.mockTitle}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/55">
              {copy.mockBody}
            </p>
          </div>
        </GlassPanel>
      </section>

      <section className="relative px-4 pb-24 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1180px] overflow-hidden rounded-lg border border-amber-300/20 bg-[linear-gradient(135deg,rgba(255,107,61,0.16),rgba(255,194,71,0.08)_42%,rgba(255,255,255,0.035))] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.45)] sm:p-9">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <SectionLabel>{copy.deployLabel}</SectionLabel>
              <h2 className="mt-3 max-w-3xl text-3xl font-black sm:text-4xl">
                {copy.deployTitle(agentName)}
              </h2>
              <p className="mt-4 max-w-2xl text-white/68">
                {copy.deployBody}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild className="h-12 rounded-lg bg-gradient-to-r from-[#FF6B3D] to-[#FFC247] px-6 font-bold text-[#120B04]">
                <Link href={`/${locale}#request-quote`}>{copy.bookDemo}</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-lg border-white/12 bg-white/[0.04] px-6 font-bold text-white hover:bg-white/[0.08]">
                <Link href={solutionPath("/solutions/sales-marketing-agents", locale, withLocale)}>
                  {copy.exploreSystem}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function AgentIntroPageBySlug({
  slug,
  locale = "en",
  includeLocale = false,
}: {
  slug: string;
  locale?: Locale;
  includeLocale?: boolean;
}) {
  const agent = getLocalizedAgentBySlug(slug, locale);

  if (!agent) {
    return null;
  }

  return <AgentIntroPage {...agent} locale={locale} includeLocale={includeLocale} />;
}

function CommandBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#05070B]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,107,61,0.16),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(255,194,71,0.11),transparent_26%),radial-gradient(circle_at_50%_88%,rgba(255,107,61,0.10),transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/45 to-transparent" />
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

function KpiCard({
  label,
  value,
  icon: Icon,
  compact,
}: {
  label: string;
  value: string;
  icon: typeof Zap;
  compact?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.045] p-4 backdrop-blur-xl">
      <Icon className="h-5 w-5 text-amber-200" />
      <p className={cn("mt-3 font-black text-white", compact ? "text-base leading-6" : "text-xl")}>{value}</p>
      <p className="mt-1 text-xs text-white/52">{label}</p>
    </div>
  );
}

function AgentWorkflowDiagram({
  agentName,
  channels,
  processSteps,
  integrations,
  visualType,
  copy,
  locale,
}: {
  agentName: string;
  channels: string[];
  processSteps: string[];
  integrations: string[];
  visualType: AgentVisualType;
  copy: (typeof introCopy)["en"];
  locale: Locale;
}) {
  const mode = diagramModes[visualType];
  const visibleChannels = channels.slice(0, 5);

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-[#080A0F]/86 p-4 shadow-[0_30px_110px_rgba(0,0,0,0.55),0_0_60px_rgba(255,107,61,0.08)] backdrop-blur-xl sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,194,71,0.13),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(255,107,61,0.10),transparent_26%)]" />
      <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-amber-200">{copy.workflowLabel}</p>
          <h2 className="mt-2 text-xl font-bold text-white">{agentName}</h2>
        </div>
        <div className="rounded-lg border border-amber-300/20 bg-amber-300/8 px-3 py-2 text-xs font-bold text-amber-100">
          {copy.mockData}
        </div>
      </div>

      <div className="relative z-10 mt-6 min-h-[430px] overflow-hidden rounded-lg border border-white/[0.08] bg-black/24 p-4 sm:min-h-[470px]">
        {mode === "radar" ? <RadarDiagram steps={processSteps} channels={visibleChannels} /> : null}
        {mode === "profile" ? <ProfileDiagram steps={processSteps} locale={locale} /> : null}
        {mode === "intel" ? <IntelDiagram steps={processSteps} locale={locale} /> : null}
        {mode === "article" ? <ArticleDiagram steps={processSteps} locale={locale} /> : null}
        {mode === "hub" ? <HubDiagram steps={processSteps} channels={visibleChannels} /> : null}
        {mode === "signals" ? <SignalsDiagram steps={processSteps} /> : null}
        {mode === "router" ? <RouterDiagram steps={processSteps} locale={locale} /> : null}
        {mode === "gauge" ? <GaugeDiagram steps={processSteps} locale={locale} /> : null}
        {mode === "crm" ? <CrmDiagram steps={processSteps} locale={locale} /> : null}
        {mode === "calendar" ? <CalendarDiagram steps={processSteps} /> : null}
        {mode === "social" ? <SocialRadarDiagram steps={processSteps} channels={visibleChannels} locale={locale} /> : null}
        {mode === "ideas" ? <IdeasDiagram steps={processSteps} locale={locale} /> : null}
        {mode === "brand" ? <BrandDiagram steps={processSteps} /> : null}
        {mode === "media" ? <MediaDiagram steps={processSteps} locale={locale} /> : null}
        {mode === "qa" ? <QaDiagram steps={processSteps} locale={locale} /> : null}
        {mode === "publish" ? <PublishDiagram steps={processSteps} channels={visibleChannels} /> : null}
        {mode === "report" ? <ReportDiagram steps={processSteps} locale={locale} /> : null}
      </div>

      <div className="relative z-10 mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {integrations.slice(0, 4).map((integration) => {
          const Icon = getChannelIcon(integration);
          return (
            <div key={integration} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-3">
              <Icon className="h-4 w-4 text-amber-200" />
              <p className="mt-2 truncate text-xs font-semibold text-white/70">{integration}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AnimatedLine({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-full bg-white/10", className)}>
      <motion.div
        className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-amber-200 to-transparent"
        animate={{ x: ["-100%", "330%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

function GlowNode({ label, icon: Icon = CircleDot, active }: { label: string; icon?: typeof CircleDot; active?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "rounded-lg border bg-white/[0.055] p-3 text-center shadow-[0_18px_42px_rgba(0,0,0,0.25)]",
        active ? "border-amber-300/40 shadow-[0_0_34px_rgba(255,194,71,0.18)]" : "border-white/[0.08]"
      )}
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06] text-amber-200">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-xs font-bold text-white/82">{label}</p>
    </motion.div>
  );
}

function RadarDiagram({ steps, channels }: { steps: string[]; channels: string[] }) {
  return (
    <div className="relative h-[430px]">
      {[0, 1, 2].map((ring) => (
        <motion.div
          key={ring}
          className="absolute left-1/2 top-1/2 rounded-full border border-amber-300/15"
          style={{
            width: 150 + ring * 86,
            height: 150 + ring * 86,
            marginLeft: -(75 + ring * 43),
            marginTop: -(75 + ring * 43),
          }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.45, 0.8, 0.45] }}
          transition={{ duration: 3.5 + ring, repeat: Infinity }}
        />
      ))}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[2px] w-[190px] origin-left bg-gradient-to-r from-amber-200 to-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-300/35 bg-amber-300/10 shadow-[0_0_50px_rgba(255,194,71,0.24)]">
        <Network className="h-9 w-9 text-amber-200" />
      </div>
      {channels.map((channel, index) => {
        const positions = ["left-6 top-8", "right-8 top-14", "left-10 bottom-16", "right-10 bottom-14", "left-1/2 top-3 -translate-x-1/2"];
        const Icon = getChannelIcon(channel);
        return <div key={channel} className={cn("absolute w-28", positions[index])}><GlowNode label={channel} icon={Icon} /></div>;
      })}
      <div className="absolute inset-x-4 bottom-3 grid grid-cols-5 gap-2">
        {steps.map((step, index) => (
          <div key={step} className="rounded-lg border border-white/[0.08] bg-black/45 p-2 text-center text-[11px] font-semibold text-white/72">
            {index + 1}. {step}
          </div>
        ))}
      </div>
    </div>
  );
}

function localText(locale: Locale, en: string, mn: string) {
  return locale === "mn" ? mn : en;
}

function ProfileDiagram({ steps, locale }: { steps: string[]; locale: Locale }) {
  return (
    <div className="grid h-[430px] items-center gap-5 md:grid-cols-[0.85fr_1fr]">
      <div className="space-y-3">
        {[
          localText(locale, "Raw contact", "Түүхий contact"),
          localText(locale, "Unknown industry", "Тодорхойгүй салбар"),
          localText(locale, "Missing buyer", "Buyer дутуу"),
          localText(locale, "No signal", "Signal байхгүй"),
        ].map((item) => (
          <div key={item} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-3 text-sm text-white/62">{item}</div>
        ))}
      </div>
      <div className="relative rounded-lg border border-amber-300/25 bg-amber-300/8 p-5 shadow-[0_0_48px_rgba(255,194,71,0.16)]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF6B3D] to-[#FFC247] text-[#130C04]">
            <DatabaseZap className="h-6 w-6" />
          </div>
          <div>
            <p className="font-black text-white">{localText(locale, "Sales-ready profile", "Sales-ready profile")}</p>
            <p className="text-sm text-white/55">
              {localText(locale, "Industry, size, contacts, signals", "Салбар, хэмжээ, contact, signal")}
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-amber-200 shadow-[0_0_16px_rgba(255,194,71,0.8)]" />
              <AnimatedLine className="h-1 flex-1" />
              <span className="w-28 text-xs text-white/70">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IntelDiagram({ steps, locale }: { steps: string[]; locale: Locale }) {
  return <StackedFlow steps={steps} title={localText(locale, "Market Intelligence Core", "Зах зээлийн intelligence core")} icon={BrainLikeIcon} />;
}

function ArticleDiagram({ steps, locale }: { steps: string[]; locale: Locale }) {
  return (
    <div className="grid h-[430px] gap-5 md:grid-cols-[0.85fr_1fr]">
      <StackColumn steps={steps} />
      <div className="rounded-lg border border-amber-300/20 bg-white/[0.045] p-5">
        <div className="mb-4 h-3 w-24 rounded-full bg-amber-200/80" />
        <div className="space-y-3">
          <div className="h-7 rounded bg-white/18" />
          <div className="h-7 w-10/12 rounded bg-white/14" />
          <div className="mt-5 h-2 rounded bg-white/10" />
          <div className="h-2 rounded bg-white/10" />
          <div className="h-2 w-8/12 rounded bg-white/10" />
        </div>
        <div className="mt-8 rounded-lg border border-amber-300/20 bg-amber-300/8 p-4">
          <p className="text-xs font-bold uppercase text-amber-200">
            {localText(locale, "SEO Metadata", "SEO metadata")}
          </p>
          <AnimatedLine className="mt-3 h-1" />
        </div>
      </div>
    </div>
  );
}

function HubDiagram({ steps, channels }: { steps: string[]; channels: string[] }) {
  return (
    <div className="relative h-[430px]">
      <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-amber-300/35 bg-amber-300/10 shadow-[0_0_50px_rgba(255,194,71,0.2)]">
        <Mail className="h-10 w-10 text-amber-200" />
      </div>
      {channels.map((channel, index) => {
        const positions = ["left-4 top-8", "right-4 top-8", "left-4 bottom-12", "right-4 bottom-12", "left-1/2 bottom-4 -translate-x-1/2"];
        const Icon = getChannelIcon(channel);
        return <div key={channel} className={cn("absolute w-28", positions[index])}><GlowNode label={channel} icon={Icon} /></div>;
      })}
      <div className="absolute left-1/2 top-8 h-[330px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-amber-300/40 to-transparent" />
      <div className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
      <div className="absolute left-6 right-6 top-4 flex justify-between gap-2">
        {steps.slice(0, 4).map((step) => (
          <span key={step} className="rounded-full border border-white/[0.08] bg-black/50 px-3 py-1 text-[11px] text-white/64">{step}</span>
        ))}
      </div>
    </div>
  );
}

function SignalsDiagram({ steps }: { steps: string[] }) {
  return (
    <div className="h-[430px] space-y-4 pt-5">
      {steps.map((step, index) => (
        <div key={step} className="grid grid-cols-[112px_1fr_74px] items-center gap-3">
          <GlowNode label={step} icon={index === 0 ? UsersRoundIcon : Mail} active={index === 1} />
          <AnimatedLine className="h-1" />
          <div className="rounded-lg border border-amber-300/20 bg-amber-300/8 p-3 text-center text-xs font-black text-amber-100">
            {["SEG", "SEND", "OPEN", "CLICK", "CRM"][index] ?? "LOG"}
          </div>
        </div>
      ))}
    </div>
  );
}

function RouterDiagram({ steps, locale }: { steps: string[]; locale: Locale }) {
  return (
    <div className="grid h-[430px] items-center gap-5 md:grid-cols-[0.9fr_1.1fr]">
      <StackColumn steps={steps} />
      <div className="grid gap-3">
        {[
          localText(locale, "yes", "тийм"),
          localText(locale, "interested", "сонирхож байна"),
          localText(locale, "meeting request", "meeting request"),
          localText(locale, "stop", "stop"),
        ].map((intent, index) => (
          <motion.div
            key={intent}
            animate={{ x: [0, index % 2 ? -4 : 4, 0] }}
            transition={{ duration: 2.8 + index * 0.3, repeat: Infinity }}
            className={cn(
              "rounded-lg border p-4",
              intent === "stop" ? "border-red-400/25 bg-red-500/8" : "border-amber-300/20 bg-amber-300/8"
            )}
          >
            <p className="text-sm font-black uppercase text-white">{intent}</p>
            <p className="mt-1 text-xs text-white/55">
              {index === 3
                ? localText(locale, "Opt-out recorded immediately", "Opt-out шууд бүртгэгдэнэ")
                : localText(locale, "Intent routed to CRM", "Сонирхол CRM рүү чиглүүлэгдэнэ")}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GaugeDiagram({ steps, locale }: { steps: string[]; locale: Locale }) {
  return (
    <div className="flex h-[430px] flex-col items-center justify-center">
      <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-amber-300/25 bg-amber-300/8 shadow-[0_0_70px_rgba(255,194,71,0.18)]">
        <motion.div className="absolute h-56 w-56 rounded-full border-t-4 border-amber-200" animate={{ rotate: [0, 270, 230] }} transition={{ duration: 4, repeat: Infinity }} />
        <div className="text-center">
          <p className="text-sm text-white/55">{localText(locale, "Lead temperature", "Lead temperature")}</p>
          <p className="mt-1 text-5xl font-black text-white">{localText(locale, "Hot", "Халуун")}</p>
          <p className="mt-1 text-amber-200">87/100</p>
        </div>
      </div>
      <div className="mt-7 grid w-full grid-cols-5 gap-2">
        {steps.map((step) => <div key={step} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-2 text-center text-[11px] text-white/65">{step}</div>)}
      </div>
    </div>
  );
}

function CrmDiagram({ steps, locale }: { steps: string[]; locale: Locale }) {
  return (
    <div className="grid h-[430px] gap-5 md:grid-cols-[1fr_0.8fr]">
      <div className="rounded-lg border border-amber-300/20 bg-white/[0.045] p-5">
        <p className="text-xs font-black uppercase text-amber-200">
          {localText(locale, "Self-updating CRM Record", "Өөрөө шинэчлэгдэх CRM record")}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            localText(locale, "Score 82", "Score 82"),
            localText(locale, "Status Hot", "Status: халуун"),
            localText(locale, "Owner Sales", "Owner: sales"),
            localText(locale, "Next action", "Дараагийн action"),
          ].map((field) => (
            <div key={field} className="rounded-lg border border-white/[0.08] bg-black/28 p-4 text-sm font-bold text-white/78">{field}</div>
          ))}
        </div>
        <div className="mt-5 space-y-2">
          {["event", "task", "history"].map((item) => <AnimatedLine key={item} className="h-2" />)}
        </div>
      </div>
      <StackColumn steps={steps} />
    </div>
  );
}

function CalendarDiagram({ steps }: { steps: string[] }) {
  return (
    <div className="h-[430px]">
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 20 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.35 }}
            animate={{ opacity: [0.35, index % 3 === 0 ? 0.95 : 0.62, 0.35] }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.06 }}
            className="min-h-16 rounded-lg border border-white/[0.08] bg-white/[0.04] p-2"
          >
            {index % 3 === 0 ? <div className="h-2 w-8 rounded bg-amber-200/70" /> : null}
          </motion.div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {steps.map((step) => <div key={step} className="rounded-lg border border-amber-300/16 bg-amber-300/8 p-2 text-center text-[11px] text-white/70">{step}</div>)}
      </div>
    </div>
  );
}

function IdeasDiagram({ steps, locale }: { steps: string[]; locale: Locale }) {
  return (
    <div className="relative h-[430px]">
      <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-300/35 bg-amber-300/10 shadow-[0_0_54px_rgba(255,194,71,0.22)]">
        <Sparkles className="h-10 w-10 text-amber-200" />
      </div>
      {[
        localText(locale, "Hook", "Hook"),
        localText(locale, "Story", "Story"),
        localText(locale, "Carousel", "Carousel"),
        localText(locale, "Short video", "Богино video"),
        localText(locale, "Education", "Education"),
        "CTA",
      ].map((idea, index) => {
        const positions = [
          "left-5 top-8",
          "right-5 top-8",
          "left-5 top-[44%]",
          "right-5 top-[44%]",
          "left-8 bottom-8",
          "right-8 bottom-8",
        ];

        return (
          <motion.div
            key={idea}
            animate={{ y: [0, index % 2 ? -5 : 5, 0] }}
            transition={{ duration: 3 + index * 0.16, repeat: Infinity }}
            className={cn("absolute w-28 rounded-lg border border-white/[0.08] bg-white/[0.045] p-3 text-center", positions[index])}
          >
            <LightbulbIcon className="mx-auto h-5 w-5 text-amber-200" />
            <p className="mt-2 text-xs font-bold text-white/78">{idea}</p>
          </motion.div>
        );
      })}
      <div className="absolute inset-x-4 bottom-2 grid grid-cols-5 gap-2">
        {steps.map((step) => (
          <div key={step} className="rounded-lg border border-white/[0.08] bg-black/42 p-2 text-center text-[11px] text-white/65">
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialRadarDiagram({ steps, channels, locale }: { steps: string[]; channels: string[]; locale: Locale }) {
  return (
    <div className="grid h-[430px] gap-5 md:grid-cols-[0.82fr_1.18fr]">
      <div className="relative rounded-lg border border-amber-300/18 bg-amber-300/8 p-4">
        <p className="text-xs font-black uppercase text-amber-200">
          {localText(locale, "Social Listening Board", "Social listening самбар")}
        </p>
        <div className="mt-5 space-y-3">
          {channels.map((channel, index) => {
            const Icon = getChannelIcon(channel);
            return (
              <motion.div
                key={channel}
                animate={{ x: [0, index % 2 ? -4 : 4, 0] }}
                transition={{ duration: 3 + index * 0.18, repeat: Infinity }}
                className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-black/30 p-3"
              >
                <Icon className="h-5 w-5 text-amber-200" />
                <div>
                  <p className="text-sm font-bold text-white/82">{channel}</p>
                  <p className="text-xs text-white/45">
                    {localText(locale, "Trend and question scan", "Trend ба асуулт scan")}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="relative rounded-lg border border-white/[0.08] bg-white/[0.04] p-5">
        <div className="absolute right-5 top-5 flex h-16 w-16 items-center justify-center rounded-full border border-amber-300/25 bg-amber-300/10 shadow-[0_0_40px_rgba(255,194,71,0.18)]">
          <RadarIcon className="h-7 w-7 text-amber-200" />
        </div>
        <p className="text-xs font-black uppercase text-amber-200">
          {localText(locale, "Audience signal clusters", "Audience signal cluster")}
        </p>
        <div className="mt-16 grid gap-3">
          {steps.map((step, index) => (
            <div key={step} className="rounded-lg border border-white/[0.08] bg-black/30 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-300/10 text-xs font-black text-amber-200">
                  {index + 1}
                </div>
                <p className="text-sm font-semibold text-white/76">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BrandDiagram({ steps }: { steps: string[] }) {
  return (
    <div className="grid h-[430px] gap-5 md:grid-cols-[0.85fr_1fr]">
      <div className="grid content-center gap-3">
        {["#FF6B3D", "#FFC247", "#FFFFFF", "#080A0F"].map((color) => (
          <div key={color} className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.04] p-3">
            <div className="h-8 w-8 rounded-lg border border-white/12" style={{ backgroundColor: color }} />
            <span className="text-sm font-semibold text-white/75">{color}</span>
          </div>
        ))}
      </div>
      <StackColumn steps={steps} />
    </div>
  );
}

function MediaDiagram({ steps, locale }: { steps: string[]; locale: Locale }) {
  return (
    <div className="h-[430px]">
      <div className="grid grid-cols-3 gap-3">
        {[
          localText(locale, "Image", "Зураг"),
          "Carousel",
          "Video",
          "Story",
          "Ad",
          "Cover",
        ].map((item, index) => (
          <motion.div
            key={item}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3 + index * 0.2, repeat: Infinity }}
            className="min-h-28 rounded-lg border border-white/[0.08] bg-gradient-to-br from-white/[0.08] to-amber-300/8 p-3"
          >
            <div className="h-12 rounded bg-amber-200/15" />
            <p className="mt-3 text-sm font-bold text-white/75">{item}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-5 gap-2">
        {steps.map((step) => <div key={step} className="rounded-lg border border-white/[0.08] bg-black/35 p-2 text-center text-[11px] text-white/65">{step}</div>)}
      </div>
    </div>
  );
}

function QaDiagram({ steps, locale }: { steps: string[]; locale: Locale }) {
  return (
    <div className="grid h-[430px] gap-5 md:grid-cols-[1fr_0.9fr]">
      <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-5">
        <div className="h-44 rounded-lg border border-amber-300/18 bg-gradient-to-br from-amber-300/12 to-white/[0.03]" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            localText(locale, "Brand fit", "Brand fit"),
            localText(locale, "Typo risk", "Үг үсгийн эрсдэл"),
            localText(locale, "CTA clarity", "CTA тодорхой"),
            localText(locale, "Goal match", "Зорилгод нийцсэн"),
          ].map((check) => (
            <div key={check} className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/30 p-3 text-sm text-white/72">
              <CheckCircle2 className="h-4 w-4 text-amber-200" />
              {check}
            </div>
          ))}
        </div>
      </div>
      <StackColumn steps={steps} />
    </div>
  );
}

function PublishDiagram({ steps, channels }: { steps: string[]; channels: string[] }) {
  return (
    <div className="relative h-[430px]">
      <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-300/35 bg-amber-300/10 shadow-[0_0_54px_rgba(255,194,71,0.22)]">
        <Send className="h-10 w-10 text-amber-200" />
      </div>
      {channels.map((channel, index) => {
        const positions = ["left-5 top-8", "right-5 top-8", "left-8 bottom-12", "right-8 bottom-12", "left-1/2 top-4 -translate-x-1/2"];
        const Icon = getChannelIcon(channel);
        return <div key={channel} className={cn("absolute w-28", positions[index])}><GlowNode label={channel} icon={Icon} /></div>;
      })}
      <div className="absolute inset-x-4 bottom-2 grid grid-cols-5 gap-2">
        {steps.map((step) => <div key={step} className="rounded-lg border border-white/[0.08] bg-black/40 p-2 text-center text-[11px] text-white/65">{step}</div>)}
      </div>
    </div>
  );
}

function ReportDiagram({ steps, locale }: { steps: string[]; locale: Locale }) {
  return (
    <div className="grid h-[430px] gap-5 md:grid-cols-[1fr_0.85fr]">
      <div className="rounded-lg border border-amber-300/20 bg-white/[0.045] p-5">
        <p className="text-xs font-black uppercase text-amber-200">
          {localText(locale, "Monday Command Report", "Даваа гарагийн command report")}
        </p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[72, 48, 91].map((height, index) => (
            <div key={height} className="flex h-44 items-end rounded-lg border border-white/[0.08] bg-black/30 p-3">
              <motion.div
                className="w-full rounded bg-gradient-to-t from-[#FF6B3D] to-[#FFC247]"
                animate={{ height: [`${height - 20}%`, `${height}%`, `${height - 12}%`] }}
                transition={{ duration: 3 + index * 0.4, repeat: Infinity }}
              />
            </div>
          ))}
        </div>
      </div>
      <StackColumn steps={steps} />
    </div>
  );
}

function StackedFlow({ steps, title, icon: Icon }: { steps: string[]; title: string; icon: typeof Sparkles }) {
  return (
    <div className="flex h-[430px] flex-col justify-center">
      <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 shadow-[0_0_56px_rgba(255,194,71,0.22)]">
        <Icon className="h-10 w-10 text-amber-200" />
      </div>
      <p className="mb-6 text-center text-xl font-black text-white">{title}</p>
      <StackColumn steps={steps} horizontal />
    </div>
  );
}

function StackColumn({ steps, horizontal }: { steps: string[]; horizontal?: boolean }) {
  if (horizontal) {
    return (
      <div className="grid grid-cols-5 gap-2">
        {steps.map((step, index) => (
          <div key={step} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-3 text-center text-[11px] font-semibold text-white/68">
            {index + 1}. {step}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={step} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-300/10 text-xs font-black text-amber-200">
              {index + 1}
            </div>
            <p className="text-sm font-semibold text-white/78">{step}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const BrainLikeIcon = GitBranch;
const Mail = Sparkles;
const Send = ArrowRight;
const UsersRoundIcon = Handshake;
const LightbulbIcon = Sparkles;
const RadarIcon = Network;
