import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Layers3,
  MessageSquareText,
  Package,
  Sparkles,
  Zap,
} from "lucide-react";
import PostlyAdminShell from "../../PostlyAdminShell";

type BrandCommandWorkspaceProps = {
  brand: any;
  lang?: "en" | "mn";
};

function readinessScore(brand: any) {
  let score = 0;
  if (brand.companyName) score += 18;
  if (brand.businessType || brand.activityDirection) score += 16;
  if (brand.description) score += 16;
  if (brand.brandGuideline?.toneOfVoice || brand.brandGuideline?.visualStyle) score += 16;
  if ((brand.productsServicesPostly?.length || 0) > 0) score += 16;
  if ((brand.brandTemplates?.length || 0) > 0) score += 18;
  return Math.min(score, 100);
}

function firstLetter(value?: string | null) {
  return (value || "B").slice(0, 1).toUpperCase();
}

function statusTone(status?: string | null) {
  const value = (status || "").toLowerCase();
  if (value.includes("failed") || value.includes("rejected")) return "border-red-400/25 bg-red-400/10 text-red-200";
  if (value.includes("approval") || value.includes("draft") || value.includes("planned") || value.includes("revision")) return "border-amber-300/25 bg-amber-300/10 text-amber-100";
  if (value.includes("posted") || value.includes("approved") || value.includes("generated")) return "border-emerald-300/25 bg-emerald-300/10 text-emerald-100";
  return "border-white/10 bg-white/[0.06] text-white/55";
}

function dateLabel(value?: string | Date | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

export default function BrandCommandWorkspace({ brand, lang = "en" }: BrandCommandWorkspaceProps) {
  const c = lang === "mn"
    ? {
        back: "Брэндүүд рүү буцах",
        active: "Идэвхтэй",
        aiChat: "AI чат нээх",
        subtitle: "Энэ брэндийн profile, voice, products, templates, plans, content queue-г нэг command workspace дээрээс удирдана.",
        readiness: "Брэнд бэлэн байдал",
        profile: "Брэнд profile",
        voice: "Брэнд voice",
        products: "Бүтээгдэхүүн / Үйлчилгээ",
        templates: "Темплейтүүд",
        plans: "Төлөвлөгөө",
        queue: "Контент queue",
        activity: "Agent activity",
        noProducts: "Бүтээгдэхүүн үйлчилгээ одоогоор алга.",
        noTemplates: "Темплейт одоогоор алга.",
        noPlans: "Төлөвлөгөө одоогоор алга.",
        noContent: "Контент item одоогоор алга.",
        noLogs: "Agent log одоогоор алга.",
        phone: "Утас",
        website: "Website",
        address: "Хаяг",
        tone: "Tone",
        visual: "Visual style",
        language: "Хэл",
        templatesCount: "Темплейт",
        queueCount: "Queue",
        draftsCount: "Draft",
        quickActions: "Хурдан үйлдэл",
        generate: "Hermes-ээр контент үүсгэх",
      }
    : {
        back: "Back to brands",
        active: "Active",
        aiChat: "Open AI chat",
        subtitle: "Control this brand's profile, voice, products, templates, plans, and content queue from one command workspace.",
        readiness: "Brand readiness",
        profile: "Brand profile",
        voice: "Brand voice",
        products: "Products / Services",
        templates: "Templates",
        plans: "Plans",
        queue: "Content queue",
        activity: "Agent activity",
        noProducts: "No products or services yet.",
        noTemplates: "No templates yet.",
        noPlans: "No plans yet.",
        noContent: "No content items yet.",
        noLogs: "No agent logs yet.",
        phone: "Phone",
        website: "Website",
        address: "Address",
        tone: "Tone",
        visual: "Visual style",
        language: "Language",
        templatesCount: "Templates",
        queueCount: "Queue",
        draftsCount: "Drafts",
        quickActions: "Quick actions",
        generate: "Generate content with Hermes",
      };

  const ready = readinessScore(brand);
  const planned = (brand.contentItems || []).filter((item: any) => item.status === "PLANNED").length;
  const drafts = (brand.contentItems || []).filter((item: any) => ["DRAFT_GENERATED", "WAITING_APPROVAL", "NEEDS_REVISION"].includes(item.status)).length;

  return (
    <PostlyAdminShell active="brands" lang={lang} currentPath={`/admin/postly/brands/${brand.id}`}>
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <Link href={`/admin/postly/brands?lang=${lang}`} className="inline-flex items-center gap-2 text-sm font-black text-amber-200 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          {c.back}
        </Link>

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30">
          <div className="relative p-6 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(139,92,246,.24),transparent_32%),radial-gradient(circle_at_90%_5%,rgba(245,158,11,.13),transparent_26%)]" />
            <div className="relative grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-black text-3xl font-black text-amber-200 shadow-inner shadow-white/5">
                  {brand.logoUrl ? <img src={brand.logoUrl} alt="" className="h-full w-full object-cover" /> : firstLetter(brand.companyName)}
                </div>
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      {c.active}
                    </span>
                    <span className="rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1 text-xs font-bold text-violet-100">AI workspace</span>
                  </div>
                  <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{brand.companyName || "Unnamed brand"}</h1>
                  <p className="mt-2 text-base text-white/52">{brand.businessType || brand.description || c.subtitle}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px]">
                <Link href={`/admin/postly/chat?lang=${lang}&brandId=${brand.id}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 text-sm font-black text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.01]">
                  <MessageSquareText className="h-4 w-4" />
                  {c.aiChat}
                </Link>
                <Link href={`/admin/postly/chat?lang=${lang}&brandId=${brand.id}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white px-5 text-sm font-black text-black transition hover:bg-violet-100">
                  <Bot className="h-4 w-4" />
                  {c.generate}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label={c.templatesCount} value={brand.brandTemplates?.length || 0} icon={<Layers3 className="h-4 w-4" />} />
          <Metric label={c.queueCount} value={planned} icon={<CalendarDays className="h-4 w-4" />} />
          <Metric label={c.draftsCount} value={drafts} icon={<FileText className="h-4 w-4" />} />
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-white/52">{c.readiness}</span>
              <span className="font-black text-violet-100">{ready}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400" style={{ width: `${ready}%` }} />
            </div>
          </div>
        </section>

        <nav className="mt-5 flex gap-2 overflow-x-auto rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-2">
          {[
            c.profile,
            c.voice,
            c.products,
            c.templates,
            c.plans,
            c.queue,
            c.activity,
          ].map((tab, index) => (
            <a key={tab} href={`#section-${index}`} className="shrink-0 rounded-2xl border border-white/10 bg-black/25 px-4 py-2 text-sm font-bold text-white/62 transition hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white">
              {tab}
            </a>
          ))}
        </nav>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_420px]">
          <div className="space-y-5">
            <Panel id="section-0" title={c.profile} icon={<Sparkles className="h-5 w-5" />}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Info label="Email" value={brand.email} />
                <Info label={c.phone} value={brand.phone} />
                <Info label={c.website} value={brand.website} />
                <Info label={c.address} value={brand.address} />
              </div>
            </Panel>

            <Panel id="section-1" title={c.voice} icon={<Bot className="h-5 w-5" />}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Info label={c.tone} value={brand.brandGuideline?.toneOfVoice} />
                <Info label={c.visual} value={brand.brandGuideline?.visualStyle} />
                <Info label={c.language} value={brand.brandGuideline?.language} />
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">Colors</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(brand.brandGuideline?.brandColors || []).length === 0 ? <span className="text-sm text-white/45">-</span> : brand.brandGuideline.brandColors.map((color: string) => <span key={color} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">{color}</span>)}
                  </div>
                </div>
              </div>
            </Panel>

            <Panel id="section-2" title={c.products} icon={<Package className="h-5 w-5" />}>
              <ListEmpty items={brand.productsServicesPostly} empty={c.noProducts} render={(item: any) => (
                <ItemCard key={item.id} title={item.name} meta={[item.price, item.targetCustomer].filter(Boolean).join(" · ")} text={item.description} />
              )} />
            </Panel>

            <Panel id="section-3" title={c.templates} icon={<Layers3 className="h-5 w-5" />}>
              <ListEmpty items={brand.brandTemplates} empty={c.noTemplates} render={(item: any) => (
                <ItemCard key={item.id} title={item.name} meta={[item.type, item.platform, item.size].filter(Boolean).join(" · ")} text={item.category} />
              )} />
            </Panel>

            <Panel id="section-4" title={c.plans} icon={<CalendarDays className="h-5 w-5" />}>
              <ListEmpty items={brand.contentPlans} empty={c.noPlans} render={(item: any) => (
                <ItemCard key={item.id} title={item.month} meta={`${item.totalPosts} posts · ${item.totalReels} reels · ${item.totalCarousels} carousels`} text={item.strategyNote} badge={item.status} />
              )} />
            </Panel>
          </div>

          <aside className="space-y-5">
            <Panel id="section-5" title={c.queue} icon={<Zap className="h-5 w-5" />}>
              <ListEmpty items={brand.contentItems} empty={c.noContent} render={(item: any) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-black">{item.title || item.contentType}</p>
                      <p className="mt-1 text-xs text-white/38">{item.template?.name || item.contentType} · {dateLabel(item.updatedAt)}</p>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${statusTone(item.status)}`}>{String(item.status).replace(/_/g, " ")}</span>
                  </div>
                </div>
              )} />
            </Panel>

            <Panel id="section-6" title={c.activity} icon={<Clock3 className="h-5 w-5" />}>
              <ListEmpty items={brand.agentLogs} empty={c.noLogs} render={(item: any) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black">{item.agentName}</p>
                      <p className="mt-1 text-sm leading-5 text-white/45">{item.message || item.action}</p>
                      <p className="mt-2 text-xs text-white/30">{dateLabel(item.createdAt)}</p>
                    </div>
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${statusTone(item.status)}`}>{item.status}</span>
                  </div>
                </div>
              )} />
            </Panel>
          </aside>
        </div>
      </main>
    </PostlyAdminShell>
  );
}

function Metric({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-white/52">{label}</p>
        <span className="text-violet-200">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-black">{value}</p>
    </div>
  );
}

function Panel({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-white">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-400/15 text-violet-100">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white/72">{value || "-"}</p>
    </div>
  );
}

function ItemCard({ title, meta, text, badge }: { title: string; meta?: string; text?: string | null; badge?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-black">{title}</p>
          {meta ? <p className="mt-1 text-xs text-white/38">{meta}</p> : null}
        </div>
        {badge ? <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${statusTone(badge)}`}>{badge}</span> : null}
      </div>
      {text ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/45">{text}</p> : null}
    </div>
  );
}

function ListEmpty({ items, empty, render }: { items: any[]; empty: string; render: (item: any) => React.ReactNode }) {
  if (!items || items.length === 0) {
    return <p className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-5 text-sm text-white/45">{empty}</p>;
  }
  return <div className="grid gap-3">{items.map(render)}</div>;
}
