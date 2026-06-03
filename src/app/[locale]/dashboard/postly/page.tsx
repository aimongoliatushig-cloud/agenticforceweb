import Link from "next/link";
import { redirect } from "next/navigation";
import type React from "react";
import { auth } from "@clerk/nextjs/server";
import { PostlyContentStatus, PostlyTemplateStatus } from "@prisma/client";
import { CalendarDays, CheckCircle2, Clock3, ExternalLink, FileText, Image, Layers3, Sparkles } from "lucide-react";
import { getCurrentUserEmails } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { normalizeLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const activeStatuses = [
  PostlyContentStatus.PLANNED,
  PostlyContentStatus.DRAFT_GENERATED,
  PostlyContentStatus.WAITING_APPROVAL,
  PostlyContentStatus.APPROVED,
  PostlyContentStatus.SCHEDULED,
];

function statusLabel(status: string, lang: "en" | "mn") {
  const labels: Record<string, { en: string; mn: string }> = {
    PLANNED: { en: "Planned", mn: "Төлөвлөсөн" },
    DRAFT_GENERATED: { en: "Draft", mn: "Draft" },
    WAITING_APPROVAL: { en: "Waiting approval", mn: "Зөвшөөрөл хүлээж буй" },
    APPROVED: { en: "Approved", mn: "Зөвшөөрсөн" },
    NEEDS_REVISION: { en: "Needs revision", mn: "Засвар хэрэгтэй" },
    SCHEDULED: { en: "Scheduled", mn: "Товлосон" },
    SENT_TO_MAKE: { en: "Sent to publishing", mn: "Нийтлэхээр илгээсэн" },
    POSTED: { en: "Published", mn: "Нийтэлсэн" },
    FAILED: { en: "Failed", mn: "Алдаа гарсан" },
  };
  return labels[status]?.[lang] || status;
}

function formatDate(value: Date | string | null | undefined, lang: "en" | "mn") {
  if (!value) return "-";
  return new Intl.DateTimeFormat(lang === "mn" ? "mn-MN" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statTone(status: string) {
  if (status === "POSTED") return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";
  if (status === "WAITING_APPROVAL" || status === "NEEDS_REVISION") return "border-amber-300/25 bg-amber-300/10 text-amber-100";
  if (status === "FAILED") return "border-red-400/25 bg-red-400/10 text-red-100";
  return "border-white/10 bg-white/[0.04] text-white/70";
}

function safeEmails(emails: string[]) {
  return emails.map((email) => email.trim().toLowerCase()).filter(Boolean);
}

async function findClientBrand(emails: string[]) {
  const normalized = safeEmails(emails);
  if (!normalized.length || !hasDatabaseUrl()) return null;

  const brands = await prisma.companyProfile.findMany({
    where: {
      email: { not: null },
    },
    include: {
      brandGuideline: true,
      brandTemplates: {
        where: { status: PostlyTemplateStatus.ACTIVE },
        orderBy: { createdAt: "desc" },
        take: 8,
      },
      contentPlans: {
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { _count: { select: { contentItems: true } } },
      },
      contentItems: {
        orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
        take: 80,
        include: {
          template: true,
          assets: { orderBy: { createdAt: "desc" }, take: 3 },
          postingLogs: { orderBy: { createdAt: "desc" }, take: 3 },
        },
      },
      postingLogs: {
        orderBy: { createdAt: "desc" },
        take: 12,
      },
    },
  });

  return brands.find((brand) => brand.email && normalized.includes(brand.email.trim().toLowerCase())) || null;
}

export default async function PostlyClientDashboardPage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  const lang = normalizeLocale(locale);
  const session = await auth().catch(() => null);
  if (!session?.userId) redirect(`/${lang}`);

  const brand = await findClientBrand(await getCurrentUserEmails());
  if (!brand) redirect(`/${lang}/dashboard`);

  const publishedItems = brand.contentItems.filter((item) => item.status === PostlyContentStatus.POSTED || item.postingLogs.length > 0);
  const waitingItems = brand.contentItems.filter((item) => item.status === PostlyContentStatus.WAITING_APPROVAL || item.status === PostlyContentStatus.NEEDS_REVISION);
  const latestItems = brand.contentItems.slice(0, 12);
  const copy = lang === "mn"
    ? {
        badge: "Postly client dashboard",
        titleSuffix: "контент самбар",
        subtitle: "Танай брэндийн контент төлөвлөгөө, draft, approval болон нийтлэгдсэн постуудыг эндээс харна.",
        readOnly: "Read-only харагдац. Засвар, approval, publish үйлдлийг admin/Hermes workflow дээр хийнэ.",
        backHome: "Нүүр рүү",
        plan: "Контент төлөвлөгөө",
        content: "Контентууд",
        published: "Нийтэлсэн",
        templates: "Темплейт",
        waiting: "Хүлээгдэж буй",
        noItems: "Одоогоор контент алга.",
        noPlans: "Одоогоор төлөвлөгөө алга.",
        latestContent: "Сүүлийн контентууд",
        contentPlan: "Төлөвлөгөө",
        scheduled: "Товлосон",
        template: "Темплейт",
        caption: "Caption",
        publishedUrl: "Нийтлэгдсэн линк",
        view: "Үзэх",
      }
    : {
        badge: "Postly client dashboard",
        titleSuffix: "content dashboard",
        subtitle: "View your brand's content plan, drafts, approvals, and published posts in one place.",
        readOnly: "Read-only view. Edits, approvals, and publishing stay in the admin/Hermes workflow.",
        backHome: "Back home",
        plan: "Content plans",
        content: "Content",
        published: "Published",
        templates: "Templates",
        waiting: "Waiting",
        noItems: "No content yet.",
        noPlans: "No plans yet.",
        latestContent: "Latest content",
        contentPlan: "Plan",
        scheduled: "Scheduled",
        template: "Template",
        caption: "Caption",
        publishedUrl: "Published URL",
        view: "Open",
      };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-200">
              <Sparkles className="h-3.5 w-3.5" />
              {copy.badge}
            </div>
            <h1 className="mt-5 text-3xl font-black sm:text-5xl">
              {brand.companyName || "Postly"} <span className="text-amber-200">{copy.titleSuffix}</span>
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/60 sm:text-base">{copy.subtitle}</p>
          </div>
          <Link href={`/${lang}`} className="inline-flex h-11 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-bold text-white/70 transition hover:bg-white/10">
            {copy.backHome}
          </Link>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat icon={<CalendarDays className="h-5 w-5" />} label={copy.plan} value={brand.contentPlans.length} />
          <Stat icon={<FileText className="h-5 w-5" />} label={copy.content} value={brand.contentItems.length} />
          <Stat icon={<CheckCircle2 className="h-5 w-5" />} label={copy.published} value={publishedItems.length} />
          <Stat icon={<Clock3 className="h-5 w-5" />} label={copy.waiting} value={waitingItems.length} />
        </section>

        <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">{copy.readOnly}</div>

        <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="grid content-start gap-6">
            <Panel title={brand.companyName || "Brand"} icon={<Image className="h-5 w-5" />}>
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-black text-xl font-black text-amber-200">
                  {(brand.companyName || "P").slice(0, 1)}
                </div>
                <div>
                  <p className="font-semibold">{brand.businessType || "-"}</p>
                  <p className="mt-1 text-sm text-white/45">{brand.email || "-"}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-white/55">{brand.description || brand.activityDirection || "-"}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(brand.brandGuideline?.brandColors || []).slice(0, 6).map((color) => (
                  <span key={color} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/55">
                    <span className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: color }} />
                    {color}
                  </span>
                ))}
              </div>
            </Panel>

            <Panel title={copy.templates} icon={<Layers3 className="h-5 w-5" />}>
              <div className="grid gap-3">
                {brand.brandTemplates.length ? brand.brandTemplates.map((template) => (
                  <div key={template.id} className="rounded-md border border-white/10 bg-black/25 p-3">
                    <p className="font-semibold">{template.name}</p>
                    <p className="mt-1 text-xs text-white/45">{[template.type, template.platform, template.size].filter(Boolean).join(" · ")}</p>
                  </div>
                )) : <p className="text-sm text-white/50">{copy.noItems}</p>}
              </div>
            </Panel>
          </aside>

          <section className="grid content-start gap-6">
            <Panel title={copy.plan} icon={<CalendarDays className="h-5 w-5" />}>
              <div className="grid gap-3">
                {brand.contentPlans.length ? brand.contentPlans.map((plan) => (
                  <div key={plan.id} className="rounded-md border border-white/10 bg-black/25 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-bold">{plan.month}</p>
                        <p className="mt-1 text-sm text-white/45">{plan.strategyNote || copy.contentPlan}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">{plan._count.contentItems} items</span>
                    </div>
                  </div>
                )) : <p className="text-sm text-white/50">{copy.noPlans}</p>}
              </div>
            </Panel>

            <Panel title={copy.latestContent} icon={<FileText className="h-5 w-5" />}>
              <div className="grid gap-3">
                {latestItems.length ? latestItems.map((item) => {
                  const postedUrl = item.facebookPostUrl || item.instagramPostUrl || item.postingLogs.find((log) => log.postedUrl)?.postedUrl;
                  return (
                    <article key={item.id} className="rounded-md border border-white/10 bg-black/25 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-bold">{item.title || item.headline || item.contentType}</p>
                          <p className="mt-1 text-xs text-white/45">
                            {[item.contentType, item.category, item.template?.name].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        <span className={`rounded-full border px-2.5 py-1 text-xs ${statTone(item.status)}`}>{statusLabel(item.status, lang)}</span>
                      </div>
                      {item.caption ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/60">{item.caption}</p> : null}
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/45">
                        <span>{copy.scheduled}: {formatDate(item.scheduledAt, lang)}</span>
                        {postedUrl ? (
                          <a href={postedUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-amber-200 hover:text-amber-100">
                            <ExternalLink className="h-3.5 w-3.5" />
                            {copy.publishedUrl}
                          </a>
                        ) : null}
                      </div>
                    </article>
                  );
                }) : <p className="text-sm text-white/50">{copy.noItems}</p>}
              </div>
            </Panel>
          </section>
        </section>
      </div>
    </main>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/20">
      <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-amber-200">
        {icon}
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-white/50">{label}</span>
        <span className="grid h-10 w-10 place-items-center rounded-md bg-amber-300/10 text-amber-200">{icon}</span>
      </div>
      <p className="mt-4 text-3xl font-black">{value}</p>
    </div>
  );
}
