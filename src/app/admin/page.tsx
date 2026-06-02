import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, Building2, FileText, Mail, MousePointerClick, PlugZap, Users, Workflow } from "lucide-react";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import PostlyAdminShell from "./postly/PostlyAdminShell";

export const dynamic = "force-dynamic";

async function getAdminData() {
  const empty = {
    users: 0,
    subscribers: 0,
    quotes: 0,
    drafts: 0,
    pageViews: 0,
    newsletterClicks: 0,
    latestQuotes: [] as {
      id: string;
      name: string;
      email: string;
      serviceInterest: string;
      status: string;
      createdAt: Date;
    }[],
    latestDrafts: [] as {
      id: string;
      slug: string;
      titleEn: string;
      sourceName: string | null;
      createdAt: Date;
    }[],
  };

  if (!hasDatabaseUrl()) return empty;

  try {
    const [users, subscribers, quotes, drafts, pageViews, newsletterClicks, latestQuotes, latestDrafts] =
      await Promise.all([
        prisma.user.count(),
        prisma.newsletterSubscriber.count(),
        prisma.quoteRequest.count(),
        prisma.article.count({ where: { status: "draft" } }),
        prisma.pageEvent.count({ where: { eventType: "page_view" } }),
        prisma.newsletterClick.count({ where: { clickedAt: { not: null } } }),
        prisma.quoteRequest.findMany({
          orderBy: { createdAt: "desc" },
          take: 6,
          select: {
            id: true,
            name: true,
            email: true,
            serviceInterest: true,
            status: true,
            createdAt: true,
          },
        }),
        prisma.article.findMany({
          where: { status: "draft" },
          orderBy: { createdAt: "desc" },
          take: 6,
          select: {
            id: true,
            slug: true,
            titleEn: true,
            sourceName: true,
            createdAt: true,
          },
        }),
      ]);

    return { users, subscribers, quotes, drafts, pageViews, newsletterClicks, latestQuotes, latestDrafts };
  } catch {
    return empty;
  }
}

export default async function AdminPage() {
  const allowed = await isAdminUser();
  if (!allowed) {
    redirect("/en");
  }

  const data = await getAdminData();
  const cards = [
    { label: "Registered users", value: data.users, icon: Users },
    { label: "Newsletter receivers", value: data.subscribers, icon: Mail },
    { label: "Quote requests", value: data.quotes, icon: Workflow },
    { label: "Hermes drafts", value: data.drafts, icon: FileText },
    { label: "Page views", value: data.pageViews, icon: Activity },
    { label: "Newsletter clicks", value: data.newsletterClicks, icon: MousePointerClick },
  ];

  return (
    <PostlyAdminShell active="dashboard">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">Dashboard</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">
              Registered users, Postly brand operations, Hermes drafts, and behavior analytics.
            </p>
          </div>
          <Link
            href="/admin/postly/brands"
            className="inline-flex h-10 items-center justify-center rounded-md bg-amber-300 px-4 text-sm font-bold text-black transition hover:bg-amber-200"
          >
            Create Content
          </Link>
        </div>

        {!hasDatabaseUrl() ? (
          <div className="mt-8 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
            DATABASE_URL is not configured, so the CRM is showing empty fallback data.
          </div>
        ) : null}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/60">{card.label}</p>
                  <Icon className="h-5 w-5 text-amber-300" />
                </div>
                <p className="mt-4 text-4xl font-black">{card.value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link
            href="/admin/postly/brands"
            className="rounded-lg border border-amber-300/25 bg-amber-300/10 p-5 transition hover:border-amber-200/60 hover:bg-amber-300/15"
          >
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-amber-300" />
              <div>
                <p className="font-semibold">Postly brand workspace</p>
                <p className="mt-1 text-sm text-white/55">Open brands, add templates, and prompt Hermes per brand.</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/postly/integrations"
            className="rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/25 hover:bg-white/[0.06]"
          >
            <div className="flex items-center gap-3">
              <PlugZap className="h-5 w-5 text-amber-300" />
              <div>
                <p className="font-semibold">Postly integrations</p>
                <p className="mt-1 text-sm text-white/55">Configure Make.com and social publishing IDs.</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-xl font-semibold">Latest quote requests</h2>
            <div className="mt-5 space-y-4">
              {data.latestQuotes.length === 0 ? (
                <p className="text-sm text-white/55">No quote requests yet.</p>
              ) : (
                data.latestQuotes.map((quote) => (
                  <div key={quote.id} className="rounded-md border border-white/10 bg-black/30 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{quote.name}</p>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/70">
                        {quote.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-white/55">{quote.email}</p>
                    <p className="mt-2 text-sm text-amber-200">{quote.serviceInterest}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-xl font-semibold">Hermes draft queue</h2>
            <div className="mt-5 space-y-4">
              {data.latestDrafts.length === 0 ? (
                <p className="text-sm text-white/55">No draft articles yet.</p>
              ) : (
                data.latestDrafts.map((draft) => (
                  <div key={draft.id} className="rounded-md border border-white/10 bg-black/30 p-4">
                    <p className="font-semibold">{draft.titleEn}</p>
                    <p className="mt-1 text-sm text-white/55">{draft.sourceName || "Hermes"} · {draft.slug}</p>
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
