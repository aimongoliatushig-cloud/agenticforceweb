import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  Bot,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  Rocket,
  Sparkles,
} from "lucide-react";
import { PostlyContentStatus } from "@prisma/client";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import PostlyAdminShell from "./postly/PostlyAdminShell";

export const dynamic = "force-dynamic";

function adminLang(value: unknown): "en" | "mn" {
  return value === "mn" ? "mn" : "en";
}

const copy = {
  en: {
    title: "AI Agent Command Center",
    subtitle: "Run brand-by-brand Postly and Hermes work from one operational dashboard.",
    addBrand: "Add Brand",
    openStudio: "Open Content Studio",
    dbMissing: "DATABASE_URL is not configured, so operational data is unavailable.",
    cards: {
      brands: "Active brands",
      agents: "Hermes-ready brands",
      queued: "Queued content",
      approval: "Waiting approval",
      failed: "Failed jobs",
      posted: "Posted content",
      leads: "Leads captured",
    },
    brandHealth: "Brand readiness",
    approvals: "Approval queue preview",
    activity: "Recent agent activity",
    distribution: "Content status distribution",
    noBrands: "No brands yet.",
    noApprovals: "No items are waiting for approval.",
    noLogs: "No agent activity yet.",
    open: "Open",
  },
  mn: {
    title: "AI агентын удирдлагын төв",
    subtitle: "Брэнд бүрийн Postly ба Hermes ажлыг нэг operational dashboard-оос удирдана.",
    addBrand: "Брэнд нэмэх",
    openStudio: "Контент студи нээх",
    dbMissing: "DATABASE_URL тохируулаагүй тул operational data харагдахгүй байна.",
    cards: {
      brands: "Идэвхтэй брэнд",
      agents: "Hermes-д бэлэн",
      queued: "Queue-д байгаа контент",
      approval: "Зөвшөөрөл хүлээж буй",
      failed: "Алдаатай ажил",
      posted: "Нийтэлсэн контент",
      leads: "Ирсэн lead",
    },
    brandHealth: "Брэндийн бэлэн байдал",
    approvals: "Зөвшөөрлийн queue",
    activity: "Сүүлийн agent activity",
    distribution: "Контент төлөвийн тархалт",
    noBrands: "Брэнд одоогоор алга.",
    noApprovals: "Зөвшөөрөл хүлээж буй контент алга.",
    noLogs: "Agent activity одоогоор алга.",
    open: "Нээх",
  },
};

function readinessScore(brand: {
  companyName: string | null;
  businessType: string | null;
  activityDirection: string | null;
  brandGuideline: { toneOfVoice: string | null; brandColors: string[] } | null;
  makeIntegration: { status: string } | null;
  socialAccounts: { status: string }[];
  _count: { productsServicesPostly: number; brandTemplates: number };
}) {
  const checks = [
    Boolean(brand.companyName),
    Boolean(brand.businessType || brand.activityDirection),
    Boolean(brand.brandGuideline?.toneOfVoice),
    Boolean(brand.brandGuideline?.brandColors.length),
    brand._count.productsServicesPostly > 0,
    brand._count.brandTemplates > 0,
    brand.socialAccounts.some((account) => account.status === "CONNECTED"),
    brand.makeIntegration?.status === "active",
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

async function getDashboardData() {
  const empty = {
    counts: {
      brands: 0,
      agents: 0,
      queued: 0,
      approval: 0,
      failed: 0,
      posted: 0,
      leads: 0,
    },
    statusCounts: [] as { status: string; count: number }[],
    brands: [] as {
      id: string;
      companyName: string | null;
      businessType: string | null;
      activityDirection: string | null;
      score: number;
      contentItems: number;
    }[],
    approvals: [] as {
      id: string;
      title: string | null;
      status: string;
      company: { companyName: string | null };
      updatedAt: Date;
    }[],
    logs: [] as {
      id: string;
      agentName: string;
      action: string;
      status: string;
      message: string | null;
      createdAt: Date;
    }[],
  };

  if (!hasDatabaseUrl()) return empty;

  try {
    const [
      brands,
      approval,
      failed,
      posted,
      leads,
      statusCounts,
      approvals,
      logs,
    ] = await Promise.all([
      prisma.companyProfile.findMany({
        orderBy: [{ createdAt: "desc" }],
        take: 8,
        select: {
          id: true,
          companyName: true,
          businessType: true,
          activityDirection: true,
          brandGuideline: { select: { toneOfVoice: true, brandColors: true } },
          makeIntegration: { select: { status: true } },
          socialAccounts: { select: { status: true } },
          _count: { select: { productsServicesPostly: true, brandTemplates: true, contentItems: true } },
        },
      }),
      prisma.contentItem.count({ where: { status: PostlyContentStatus.WAITING_APPROVAL } }),
      prisma.contentItem.count({ where: { status: PostlyContentStatus.FAILED } }),
      prisma.contentItem.count({ where: { status: PostlyContentStatus.POSTED } }),
      prisma.demoLead.count(),
      prisma.contentItem.groupBy({ by: ["status"], _count: { status: true } }),
      prisma.contentItem.findMany({
        where: { status: { in: [PostlyContentStatus.WAITING_APPROVAL, PostlyContentStatus.DRAFT_GENERATED, PostlyContentStatus.NEEDS_REVISION] } },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
          company: { select: { companyName: true } },
        },
      }),
      prisma.agentLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        select: { id: true, agentName: true, action: true, status: true, message: true, createdAt: true },
      }),
    ]);

    const brandRows = brands.map((brand) => ({
      id: brand.id,
      companyName: brand.companyName,
      businessType: brand.businessType,
      activityDirection: brand.activityDirection,
      score: readinessScore(brand),
      contentItems: brand._count.contentItems,
    }));
    const agents = brandRows.filter((brand) => brand.score >= 70).length;
    const queuedStatuses = new Set(["PLANNED", "DRAFT_GENERATED", "SENT_TO_MAKE", "MEDIA_GENERATED", "SCHEDULED"]);
    const queued = statusCounts
      .filter((row) => queuedStatuses.has(row.status))
      .reduce((total, row) => total + row._count.status, 0);

    return {
      counts: {
        brands: brands.length,
        agents,
        queued,
        approval,
        failed,
        posted,
        leads,
      },
      statusCounts: statusCounts.map((row) => ({ status: row.status, count: row._count.status })),
      brands: brandRows,
      approvals,
      logs,
    };
  } catch {
    return empty;
  }
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const allowed = await isAdminUser();
  if (!allowed) redirect("/en");

  const { lang } = await searchParams;
  const currentLang = adminLang(lang);
  const c = copy[currentLang];
  const data = await getDashboardData();
  const withLang = (href: string) => `${href}?lang=${currentLang}`;

  const cards = [
    { label: c.cards.brands, value: data.counts.brands, icon: Building2, tone: "text-violet-200" },
    { label: c.cards.agents, value: data.counts.agents, icon: Bot, tone: "text-cyan-200" },
    { label: c.cards.queued, value: data.counts.queued, icon: Clock3, tone: "text-amber-200" },
    { label: c.cards.approval, value: data.counts.approval, icon: CheckCircle2, tone: "text-emerald-200" },
    { label: c.cards.failed, value: data.counts.failed, icon: AlertTriangle, tone: "text-red-200" },
    { label: c.cards.posted, value: data.counts.posted, icon: Rocket, tone: "text-blue-200" },
    { label: c.cards.leads, value: data.counts.leads, icon: Mail, tone: "text-pink-200" },
  ];

  return (
    <PostlyAdminShell active="dashboard" lang={currentLang} currentPath="/admin">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Postly OS</p>
            <h1 className="text-3xl font-black sm:text-4xl">{c.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">{c.subtitle}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href={withLang("/admin/postly/brands")} className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-bold text-white/75 transition hover:bg-white/10">
              {c.addBrand}
            </Link>
            <Link href={withLang("/admin/postly/content-studio")} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-violet-500 px-4 text-sm font-bold text-white transition hover:bg-violet-400">
              <Sparkles className="h-4 w-4" />
              {c.openStudio}
            </Link>
          </div>
        </div>

        {!hasDatabaseUrl() ? (
          <div className="mt-8 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
            {c.dbMissing}
          </div>
        ) : null}

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/58">{card.label}</p>
                  <Icon className={`h-5 w-5 ${card.tone}`} />
                </div>
                <p className="mt-4 text-3xl font-black">{card.value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-lg font-bold">{c.brandHealth}</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {data.brands.length === 0 ? (
                <p className="text-sm text-white/50">{c.noBrands}</p>
              ) : (
                data.brands.map((brand) => (
                  <Link key={brand.id} href={withLang(`/admin/postly/brands/${brand.id}`)} className="rounded-md border border-white/10 bg-black/25 p-4 transition hover:border-violet-300/45">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{brand.companyName || "Unnamed brand"}</p>
                        <p className="mt-1 text-xs text-white/45">{brand.businessType || brand.activityDirection || "Brand context missing"}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/70">{brand.score}%</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-violet-400" style={{ width: `${brand.score}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-white/40">{brand.contentItems} content items</p>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-lg font-bold">{c.distribution}</h2>
            <div className="mt-5 grid gap-3">
              {data.statusCounts.length === 0 ? (
                <p className="text-sm text-white/50">No content status data.</p>
              ) : (
                data.statusCounts.map((row) => (
                  <div key={row.status} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-md border border-white/10 bg-black/25 p-3">
                    <span className="text-sm text-white/65">{row.status}</span>
                    <span className="text-sm font-bold">{row.count}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-lg font-bold">{c.approvals}</h2>
            <div className="mt-5 grid gap-3">
              {data.approvals.length === 0 ? (
                <p className="text-sm text-white/50">{c.noApprovals}</p>
              ) : (
                data.approvals.map((item) => (
                  <Link key={item.id} href={withLang("/admin/postly/approval")} className="rounded-md border border-white/10 bg-black/25 p-4 transition hover:border-emerald-300/35">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{item.title || "Untitled content"}</p>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/65">{item.status}</span>
                    </div>
                    <p className="mt-1 text-xs text-white/45">{item.company.companyName || "Brand"} · {item.updatedAt.toLocaleDateString()}</p>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-lg font-bold">{c.activity}</h2>
            <div className="mt-5 grid gap-3">
              {data.logs.length === 0 ? (
                <p className="text-sm text-white/50">{c.noLogs}</p>
              ) : (
                data.logs.map((log) => (
                  <div key={log.id} className="rounded-md border border-white/10 bg-black/25 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{log.agentName}</p>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/65">{log.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-white/55">{log.message || log.action}</p>
                    <p className="mt-2 text-xs text-white/35">{log.createdAt.toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </PostlyAdminShell>
  );
}
