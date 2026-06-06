import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  MousePointerClick,
  PlugZap,
  Sparkles,
  Users,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PostlyContentStatus, PostlyPlanStatus } from "@prisma/client";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import PostlyAdminShell from "./postly/PostlyAdminShell";

export const dynamic = "force-dynamic";

function adminLang(value: unknown): "en" | "mn" {
  return value === "mn" ? "mn" : "en";
}

const dashboardCopy = {
  en: {
    eyebrow: "AgenticForce AI Agent OS",
    title: "Command Center",
    subtitle: "Control brand chats, Hermes generation, approval queues, publishing status, and agent activity from one workspace.",
    primaryAction: "Open brand chat",
    secondaryAction: "Review approvals",
    dbMissing: "DATABASE_URL is not configured, so the command center is showing empty fallback data.",
    cards: {
      brands: "Brand workspaces",
      planned: "Planned content",
      approval: "Waiting approval",
      failed: "Failed jobs",
      posted: "Posted content",
      leads: "Leads captured",
    },
    agents: "AI employees",
    agentsText: "Each brand gets its own chat, knowledge, templates, content queue, and publishing workflow.",
    approvalQueue: "Approval queue",
    noContent: "No content items yet. Open a brand chat and ask Hermes to generate the first draft.",
    recentActivity: "Recent agent activity",
    noLogs: "No agent logs yet.",
    quickActions: "Fast actions",
    leadOps: "Lead operations",
    leadOpsText: "Quote requests, newsletter subscribers, and academy leads captured from the public site.",
    contentOps: "Content operations",
    contentOpsText: "Create monthly plans, generate drafts, approve outputs, and publish through Make.com.",
    open: "Open",
    health: "Health",
    working: "Working",
    idle: "Idle",
    needsInput: "Needs input",
    latestQuotes: "Latest quote requests",
    noQuotes: "No quote requests yet.",
    viewAll: "View all",
  },
  mn: {
    eyebrow: "AgenticForce AI Agent OS",
    title: "Комманд төв",
    subtitle: "Брэнд чат, Hermes generation, approval queue, publishing status, agent activity-г нэг workspace дээрээс удирдана.",
    primaryAction: "Брэнд чат нээх",
    secondaryAction: "Зөвшөөрөл шалгах",
    dbMissing: "DATABASE_URL тохируулагдаагүй тул command center хоосон fallback data харуулж байна.",
    cards: {
      brands: "Брэнд workspace",
      planned: "Төлөвлөсөн контент",
      approval: "Зөвшөөрөл хүлээж буй",
      failed: "Алдаатай ажил",
      posted: "Нийтэлсэн контент",
      leads: "Lead бүртгэл",
    },
    agents: "AI ажилчид",
    agentsText: "Брэнд бүр өөрийн чат, knowledge, template, content queue, publishing workflow-тэй байна.",
    approvalQueue: "Зөвшөөрлийн queue",
    noContent: "Контент item одоогоор алга. Брэнд чат нээгээд Hermes-ээр эхний draft үүсгэ.",
    recentActivity: "Сүүлийн agent activity",
    noLogs: "Agent log одоогоор алга.",
    quickActions: "Хурдан үйлдэл",
    leadOps: "Lead operation",
    leadOpsText: "Public site-оос ирсэн quote request, newsletter subscriber, academy lead-үүд.",
    contentOps: "Content operation",
    contentOpsText: "Сарын plan үүсгэх, draft generate хийх, approve хийх, Make.com-оор publish хийх.",
    open: "Нээх",
    health: "Health",
    working: "Ажиллаж байна",
    idle: "Хүлээлттэй",
    needsInput: "Оролт хэрэгтэй",
    latestQuotes: "Сүүлийн үнийн саналын хүсэлт",
    noQuotes: "Үнийн саналын хүсэлт одоогоор алга.",
    viewAll: "Бүгдийг харах",
  },
};

type AdminData = {
  users: number;
  subscribers: number;
  quotes: number;
  articleDrafts: number;
  pageViews: number;
  newsletterClicks: number;
  brands: number;
  plannedContent: number;
  waitingApproval: number;
  failedContent: number;
  postedContent: number;
  activePlans: number;
  agentLogs: number;
  latestQuotes: {
    id: string;
    name: string;
    email: string;
    serviceInterest: string;
    status: string;
    createdAt: Date;
  }[];
  latestContent: {
    id: string;
    title: string | null;
    contentType: string;
    status: string;
    updatedAt: Date;
    company: { companyName: string | null };
    template: { name: string } | null;
  }[];
  latestLogs: {
    id: string;
    agentName: string;
    action: string;
    status: string;
    message: string | null;
    createdAt: Date;
  }[];
};

const emptyAdminData: AdminData = {
  users: 0,
  subscribers: 0,
  quotes: 0,
  articleDrafts: 0,
  pageViews: 0,
  newsletterClicks: 0,
  brands: 0,
  plannedContent: 0,
  waitingApproval: 0,
  failedContent: 0,
  postedContent: 0,
  activePlans: 0,
  agentLogs: 0,
  latestQuotes: [],
  latestContent: [],
  latestLogs: [],
};

async function getAdminData(): Promise<AdminData> {
  if (!hasDatabaseUrl()) return emptyAdminData;

  try {
    const [
      users,
      subscribers,
      quotes,
      articleDrafts,
      pageViews,
      newsletterClicks,
      brands,
      plannedContent,
      waitingApproval,
      failedContent,
      postedContent,
      activePlans,
      agentLogs,
      latestQuotes,
      latestContent,
      latestLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.newsletterSubscriber.count(),
      prisma.quoteRequest.count(),
      prisma.article.count({ where: { status: "draft" } }),
      prisma.pageEvent.count({ where: { eventType: "page_view" } }),
      prisma.newsletterClick.count({ where: { clickedAt: { not: null } } }),
      prisma.companyProfile.count(),
      prisma.contentItem.count({ where: { status: PostlyContentStatus.PLANNED } }),
      prisma.contentItem.count({
        where: {
          status: {
            in: [
              PostlyContentStatus.DRAFT_GENERATED,
              PostlyContentStatus.WAITING_APPROVAL,
              PostlyContentStatus.NEEDS_REVISION,
              PostlyContentStatus.APPROVED,
            ],
          },
        },
      }),
      prisma.contentItem.count({ where: { status: PostlyContentStatus.FAILED } }),
      prisma.contentItem.count({ where: { status: PostlyContentStatus.POSTED } }),
      prisma.contentPlan.count({ where: { status: PostlyPlanStatus.ACTIVE } }),
      prisma.agentLog.count(),
      prisma.quoteRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          serviceInterest: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.contentItem.findMany({
        orderBy: [{ updatedAt: "desc" }],
        take: 6,
        select: {
          id: true,
          title: true,
          contentType: true,
          status: true,
          updatedAt: true,
          company: { select: { companyName: true } },
          template: { select: { name: true } },
        },
      }),
      prisma.agentLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          agentName: true,
          action: true,
          status: true,
          message: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      users,
      subscribers,
      quotes,
      articleDrafts,
      pageViews,
      newsletterClicks,
      brands,
      plannedContent,
      waitingApproval,
      failedContent,
      postedContent,
      activePlans,
      agentLogs,
      latestQuotes,
      latestContent,
      latestLogs,
    };
  } catch {
    return emptyAdminData;
  }
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatTime(date: Date, lang: "en" | "mn") {
  return new Intl.DateTimeFormat(lang === "mn" ? "mn-MN" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function statusTone(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("failed") || normalized.includes("rejected")) return "border-red-400/25 bg-red-400/10 text-red-200";
  if (normalized.includes("approval") || normalized.includes("draft") || normalized.includes("revision")) return "border-amber-300/25 bg-amber-300/10 text-amber-100";
  if (normalized.includes("posted") || normalized.includes("success") || normalized.includes("approved")) return "border-emerald-300/25 bg-emerald-300/10 text-emerald-100";
  return "border-white/10 bg-white/[0.06] text-white/60";
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const allowed = await isAdminUser();
  if (!allowed) {
    redirect("/en");
  }

  const { lang } = await searchParams;
  const currentLang = adminLang(lang);
  const copy = dashboardCopy[currentLang];
  const data = await getAdminData();
  const withLang = (href: string) => `${href}?lang=${currentLang}`;

  const cards = [
    {
      label: copy.cards.brands,
      value: data.brands,
      detail: currentLang === "mn" ? "брэнд тус бүр чаттай" : "each brand has chat",
      icon: Building2,
      href: withLang("/admin/postly/brands"),
      tone: "violet",
    },
    {
      label: copy.cards.planned,
      value: data.plannedContent,
      detail: currentLang === "mn" ? `${data.activePlans} active plan` : `${data.activePlans} active plans`,
      icon: CalendarDays,
      href: withLang("/admin/postly/calendar"),
      tone: "blue",
    },
    {
      label: copy.cards.approval,
      value: data.waitingApproval,
      detail: currentLang === "mn" ? "шалгах шаардлагатай" : "needs review",
      icon: CheckCircle2,
      href: withLang("/admin/postly/approval"),
      tone: "amber",
    },
    {
      label: copy.cards.failed,
      value: data.failedContent,
      detail: currentLang === "mn" ? "retry хийх" : "retry required",
      icon: AlertTriangle,
      href: withLang("/admin/postly/logs"),
      tone: "red",
    },
    {
      label: copy.cards.posted,
      value: data.postedContent,
      detail: currentLang === "mn" ? "published output" : "published output",
      icon: Zap,
      href: withLang("/admin/postly/logs"),
      tone: "emerald",
    },
    {
      label: copy.cards.leads,
      value: data.quotes + data.subscribers,
      detail: `${formatNumber(data.quotes)} quotes · ${formatNumber(data.subscribers)} newsletter`,
      icon: Users,
      href: withLang("/admin"),
      tone: "cyan",
    },
  ];

  const agents = [
    {
      name: "Social Media Manager",
      status: copy.working,
      detail: currentLang === "mn" ? "Caption, post, carousel draft үүсгэнэ" : "Creates captions, posts, and carousel drafts",
      tasks: data.plannedContent + data.waitingApproval,
      health: data.failedContent > 0 ? 84 : 96,
      icon: Bot,
    },
    {
      name: "Content Strategist",
      status: data.activePlans > 0 ? copy.working : copy.idle,
      detail: currentLang === "mn" ? "Сарын plan болон campaign angle санал болгоно" : "Plans monthly themes and campaign angles",
      tasks: data.activePlans,
      health: 91,
      icon: Sparkles,
    },
    {
      name: "Publishing Agent",
      status: data.failedContent > 0 ? copy.needsInput : copy.working,
      detail: currentLang === "mn" ? "Make.com, social status, retry workflow" : "Make.com, social status, and retry workflow",
      tasks: data.postedContent + data.failedContent,
      health: data.failedContent > 0 ? 72 : 93,
      icon: PlugZap,
    },
    {
      name: "Lead Capture Agent",
      status: data.quotes + data.subscribers > 0 ? copy.working : copy.idle,
      detail: currentLang === "mn" ? "Quote, newsletter, academy lead tracking" : "Tracks quotes, newsletter, and academy leads",
      tasks: data.quotes + data.subscribers,
      health: 88,
      icon: Workflow,
    },
  ];

  return (
    <PostlyAdminShell active="dashboard" lang={currentLang} currentPath="/admin">
      <section className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30">
          <div className="relative p-6 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(139,92,246,.25),transparent_35%),radial-gradient(circle_at_82%_12%,rgba(245,158,11,.16),transparent_28%)]" />
            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/25 bg-violet-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-violet-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  {copy.eyebrow}
                </div>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{copy.title}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/58 sm:text-base">
                  {copy.subtitle}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href={withLang("/admin/postly/brands")}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 text-sm font-black text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.01]"
                >
                  <Bot className="h-4 w-4" />
                  {copy.primaryAction}
                </Link>
                <Link
                  href={withLang("/admin/postly/approval")}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white px-5 text-sm font-black text-black transition hover:bg-violet-100"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {copy.secondaryAction}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {!hasDatabaseUrl() ? (
          <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
            {copy.dbMissing}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {cards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black">{copy.agents}</h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-white/50">{copy.agentsText}</p>
              </div>
              <Link href={withLang("/admin/postly/brands")} className="inline-flex items-center gap-2 text-sm font-bold text-violet-200 hover:text-white">
                {copy.viewAll}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {agents.map((agent) => (
                <AgentCard key={agent.name} agent={agent} copy={copy} href={withLang("/admin/postly/brands")} />
              ))}
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black">{copy.approvalQueue}</h2>
              <Link href={withLang("/admin/postly/approval")} className="text-sm font-bold text-violet-200 hover:text-white">
                {copy.viewAll}
              </Link>
            </div>
            <div className="mt-5 grid gap-3">
              {data.latestContent.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/15 bg-black/25 p-5 text-sm leading-6 text-white/48">{copy.noContent}</p>
              ) : (
                data.latestContent.map((item) => (
                  <Link
                    key={item.id}
                    href={withLang("/admin/postly/approval")}
                    className="group rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:border-violet-300/35 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-bold">{item.title || (currentLang === "mn" ? "Гарчиггүй контент" : "Untitled content")}</p>
                        <p className="mt-1 text-xs text-white/45">
                          {item.company.companyName || "Brand"} · {item.contentType}{item.template?.name ? ` · ${item.template.name}` : ""}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${statusTone(item.status)}`}>
                        {item.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-xs text-white/38">
                      <Clock3 className="h-3.5 w-3.5" />
                      {formatTime(item.updatedAt, currentLang)}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-2xl font-black">{copy.quickActions}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <QuickAction
                href={withLang("/admin/postly/brands")}
                icon={Bot}
                title={copy.contentOps}
                text={copy.contentOpsText}
              />
              <QuickAction
                href={withLang("/admin/postly/integrations")}
                icon={PlugZap}
                title="Hermes / Make"
                text={currentLang === "mn" ? "Webhook, publishing channel, storage status шалгана." : "Check webhook, publishing channel, and storage status."}
              />
              <QuickAction
                href={withLang("/admin/postly/calendar")}
                icon={CalendarDays}
                title="Calendar"
                text={currentLang === "mn" ? "Контент төлөвлөлт, schedule, agenda-г удирдана." : "Manage planning, scheduling, and agenda."}
              />
              <QuickAction
                href={withLang("/admin")}
                icon={Users}
                title={copy.leadOps}
                text={copy.leadOpsText}
              />
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black">{copy.recentActivity}</h2>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/45">
                {formatNumber(data.agentLogs)} logs
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              {data.latestLogs.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/15 bg-black/25 p-5 text-sm text-white/48">{copy.noLogs}</p>
              ) : (
                data.latestLogs.map((log) => (
                  <div key={log.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold">{log.agentName}</p>
                        <p className="mt-1 text-sm text-white/48">{log.message || log.action}</p>
                      </div>
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${statusTone(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-white/35">{formatTime(log.createdAt, currentLang)} · {log.action}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-2xl font-black">{copy.latestQuotes}</h2>
            <div className="mt-5 grid gap-3">
              {data.latestQuotes.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/15 bg-black/25 p-5 text-sm text-white/48">{copy.noQuotes}</p>
              ) : (
                data.latestQuotes.map((quote) => (
                  <div key={quote.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold">{quote.name}</p>
                        <p className="mt-1 text-sm text-white/45">{quote.email}</p>
                        <p className="mt-2 text-sm text-violet-100">{quote.serviceInterest}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 text-xs text-white/60">
                        {quote.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-2xl font-black">CRM / Site signals</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <MiniSignal icon={Users} label="Users" value={data.users} />
              <MiniSignal icon={Mail} label="Subscribers" value={data.subscribers} />
              <MiniSignal icon={FileText} label="Article drafts" value={data.articleDrafts} />
              <MiniSignal icon={Activity} label="Page views" value={data.pageViews} />
              <MiniSignal icon={MousePointerClick} label="Newsletter clicks" value={data.newsletterClicks} />
              <MiniSignal icon={Workflow} label="Quote requests" value={data.quotes} />
            </div>
          </section>
        </div>
      </section>
    </PostlyAdminShell>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  href,
  tone,
}: {
  label: string;
  value: number;
  detail: string;
  icon: LucideIcon;
  href: string;
  tone: string;
}) {
  const toneClass: Record<string, string> = {
    violet: "from-violet-500/25 to-fuchsia-500/10 text-violet-100",
    blue: "from-blue-500/25 to-cyan-500/10 text-blue-100",
    amber: "from-amber-500/25 to-orange-500/10 text-amber-100",
    red: "from-red-500/25 to-rose-500/10 text-red-100",
    emerald: "from-emerald-500/25 to-teal-500/10 text-emerald-100",
    cyan: "from-cyan-500/25 to-sky-500/10 text-cyan-100",
  };

  return (
    <Link href={href} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-white/[0.07]">
      <div className="flex items-start justify-between gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${toneClass[tone] || toneClass.violet}`}>
          <Icon className="h-5 w-5" />
        </span>
        <ArrowRight className="h-4 w-4 text-white/18 transition group-hover:text-violet-200" />
      </div>
      <p className="mt-4 text-sm text-white/52">{label}</p>
      <p className="mt-1 text-3xl font-black">{formatNumber(value)}</p>
      <p className="mt-2 truncate text-xs text-white/35">{detail}</p>
    </Link>
  );
}

function AgentCard({
  agent,
  copy,
  href,
}: {
  agent: { name: string; status: string; detail: string; tasks: number; health: number; icon: LucideIcon };
  copy: typeof dashboardCopy.en;
  href: string;
}) {
  const Icon = agent.icon;
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-amber-300/20 text-violet-100">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate font-black">{agent.name}</p>
            <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-200">{agent.status}</span>
          </div>
          <p className="mt-1 text-xs leading-5 text-white/45">{agent.detail}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-xl bg-white/[0.04] p-3">
          <p className="text-white/35">Tasks</p>
          <p className="mt-1 text-lg font-black">{formatNumber(agent.tasks)}</p>
        </div>
        <div className="rounded-xl bg-white/[0.04] p-3">
          <p className="text-white/35">{copy.health}</p>
          <p className="mt-1 text-lg font-black">{agent.health}%</p>
        </div>
        <Link href={href} className="grid place-items-center rounded-xl bg-white text-xs font-black text-black transition hover:bg-violet-100">
          {copy.open}
        </Link>
      </div>
    </div>
  );
}

function QuickAction({ href, icon: Icon, title, text }: { href: string; icon: LucideIcon; title: string; text: string }) {
  return (
    <Link href={href} className="group rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:border-violet-300/35 hover:bg-white/[0.05]">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-400/15 text-violet-100">
          <Icon className="h-4 w-4" />
        </span>
        <p className="font-black">{title}</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-white/45">{text}</p>
    </Link>
  );
}

function MiniSignal({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-white/50">{label}</p>
        <Icon className="h-4 w-4 text-violet-200" />
      </div>
      <p className="mt-3 text-2xl font-black">{formatNumber(value)}</p>
    </div>
  );
}
