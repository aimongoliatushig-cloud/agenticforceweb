import Link from "next/link";
import { AlertCircle, CalendarDays, CheckCircle2, Clock3, ExternalLink, Eye, FileText, RefreshCw } from "lucide-react";

type PublishedLogsDashboardProps = {
  items: any[];
  lang?: "en" | "mn";
};

function brandInitial(name?: string | null) {
  return (name || "B").slice(0, 1).toUpperCase();
}

function statusTone(status?: string | null) {
  const value = String(status || "").toLowerCase();
  if (value.includes("fail") || value.includes("reject")) return "border-red-400/25 bg-red-400/10 text-red-200";
  if (value.includes("schedule")) return "border-blue-400/25 bg-blue-400/10 text-blue-200";
  if (value.includes("post") || value.includes("success") || value.includes("media")) return "border-emerald-300/25 bg-emerald-300/10 text-emerald-100";
  return "border-white/10 bg-white/[0.06] text-white/55";
}

function formatDate(value?: string | Date | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date);
}

function postedUrl(item: any) {
  return item.facebookPostUrl || item.instagramPostUrl || item.postingLogs?.[0]?.postedUrl || "";
}

function platformLabel(item: any) {
  return item.postingLogs?.[0]?.platform || (item.instagramPostUrl ? "Instagram" : item.facebookPostUrl ? "Facebook" : "Postly");
}

function assetUrl(item: any) {
  return item.assets?.[0]?.fileUrl || item.template?.previewImageUrl || "";
}

export default function PublishedLogsDashboard({ items, lang = "en" }: PublishedLogsDashboardProps) {
  const isMn = lang === "mn";
  const c = {
    title: isMn ? "Нийтлэлийн лог" : "Published Logs",
    subtitle: isMn ? "Postly / Hermes-ээс илгээгдсэн контентын нийтлэлийн түүх, төлөв болон гүйцэтгэлийн мэдээлэл." : "Publishing history, status, and execution details for content sent by Postly and Hermes.",
    total: isMn ? "Нийт бичлэг" : "Total records",
    success: isMn ? "Амжилттай" : "Successful",
    scheduled: isMn ? "Төлөвлөсөн" : "Scheduled",
    failed: isMn ? "Алдаатай" : "Failed",
    search: isMn ? "Нэр, тайлбар, брэндээр хайх..." : "Search by title, caption, or brand...",
    brandContent: isMn ? "Брэнд / Контент" : "Brand / Content",
    platform: isMn ? "Платформ" : "Platform",
    status: isMn ? "Төлөв" : "Status",
    published: isMn ? "Нийтэлсэн" : "Published",
    action: isMn ? "Үйлдэл" : "Action",
    detail: isMn ? "Нийтлэлийн дэлгэрэнгүй" : "Publication detail",
    noItems: isMn ? "Нийтлэлийн лог одоогоор алга." : "No published logs yet.",
    openPost: isMn ? "Постыг нээх" : "Open post",
    retry: isMn ? "Дахин илгээх" : "Retry",
    meta: isMn ? "Мета мэдээлэл" : "Metadata",
    timeline: isMn ? "Үйл явдлын түүх" : "Timeline",
    export: isMn ? "Экспорт" : "Export",
  };

  const successCount = items.filter((item) => String(item.status).toLowerCase().includes("post") || item.postingLogs?.some((log: any) => String(log.status).toLowerCase().includes("post"))).length;
  const failedCount = items.filter((item) => String(item.status).toLowerCase().includes("fail") || item.postingLogs?.some((log: any) => String(log.status).toLowerCase().includes("fail"))).length;
  const scheduledCount = items.filter((item) => String(item.status).toLowerCase().includes("schedule") || item.postingLogs?.some((log: any) => String(log.status).toLowerCase().includes("schedule"))).length;
  const selected = items[0];
  const selectedUrl = selected ? postedUrl(selected) : "";
  const selectedAsset = selected ? assetUrl(selected) : "";

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{c.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">{c.subtitle}</p>
        </div>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-black text-white/70 transition hover:border-violet-300/35 hover:bg-violet-500/10 hover:text-white">
          {c.export}
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label={c.total} value={items.length} icon={<FileText className="h-5 w-5" />} />
        <Metric label={c.success} value={successCount} icon={<CheckCircle2 className="h-5 w-5" />} />
        <Metric label={c.scheduled} value={scheduledCount} icon={<Clock3 className="h-5 w-5" />} />
        <Metric label={c.failed} value={failedCount} icon={<AlertCircle className="h-5 w-5" />} danger />
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_160px_160px_160px]">
            <input placeholder={c.search} className="h-11 rounded-2xl border border-white/10 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-violet-300/60" />
            <select className="h-11 rounded-2xl border border-white/10 bg-black/35 px-3 text-sm text-white outline-none"><option>{isMn ? "Брэнд бүгд" : "All brands"}</option></select>
            <select className="h-11 rounded-2xl border border-white/10 bg-black/35 px-3 text-sm text-white outline-none"><option>{isMn ? "Платформ бүгд" : "All platforms"}</option></select>
            <select className="h-11 rounded-2xl border border-white/10 bg-black/35 px-3 text-sm text-white outline-none"><option>{isMn ? "Төлөв бүгд" : "All statuses"}</option></select>
          </div>

          <div className="hidden grid-cols-[minmax(0,1.6fr)_130px_130px_150px_110px] gap-3 border-b border-white/10 px-3 pb-3 text-xs font-black uppercase tracking-[0.12em] text-white/35 lg:grid">
            <span>{c.brandContent}</span><span>{c.platform}</span><span>{c.status}</span><span>{c.published}</span><span>{c.action}</span>
          </div>

          <div className="divide-y divide-white/10">
            {items.length === 0 ? <p className="p-8 text-center text-sm text-white/45">{c.noItems}</p> : items.map((item, index) => {
              const url = postedUrl(item);
              const asset = assetUrl(item);
              return (
                <article key={item.id} className={`grid gap-3 px-3 py-4 transition hover:bg-white/[0.03] lg:grid-cols-[minmax(0,1.6fr)_130px_130px_150px_110px] ${index === 0 ? "rounded-2xl border border-violet-300/35 bg-violet-500/10" : ""}`}>
                  <div className="flex min-w-0 gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-black text-sm font-black text-amber-200">{brandInitial(item.company?.companyName)}</div>
                    {asset ? <img src={asset} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" /> : null}
                    <div className="min-w-0">
                      <p className="truncate font-black">{item.company?.companyName || "Brand"}</p>
                      <p className="truncate text-sm font-semibold text-white/75">{item.title || item.headline || item.contentType}</p>
                      <p className="line-clamp-1 text-xs text-white/42">{item.caption || item.creativeDirection || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-white/65">{platformLabel(item)}</div>
                  <div className="flex items-center"><span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${statusTone(item.status)}`}>{String(item.status).replace(/_/g, " ")}</span></div>
                  <div className="flex items-center text-sm text-white/55">{formatDate(item.postingLogs?.[0]?.createdAt || item.updatedAt)}</div>
                  <div className="flex items-center gap-2">
                    {url ? <a href={url} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/65 hover:bg-white/10 hover:text-white"><ExternalLink className="h-4 w-4" /></a> : null}
                    <Link href={`/admin/postly/approval?lang=${lang}`} className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/65 hover:bg-white/10 hover:text-white"><Eye className="h-4 w-4" /></Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
          {selected ? (
            <>
              <h2 className="text-xl font-black">{c.detail}</h2>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black text-sm font-black text-amber-200">{brandInitial(selected.company?.companyName)}</div>
                <div><p className="font-black">{selected.company?.companyName || "Brand"}</p><p className="text-xs text-white/42">{platformLabel(selected)}</p></div>
              </div>
              {selectedAsset ? <img src={selectedAsset} alt="" className="mt-5 aspect-square w-full rounded-2xl border border-white/10 object-cover" /> : null}
              <div className="mt-4"><span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${statusTone(selected.status)}`}>{String(selected.status).replace(/_/g, " ")}</span></div>
              <h3 className="mt-4 text-lg font-black">{selected.title || selected.headline || selected.contentType}</h3>
              <p className="mt-3 text-sm leading-6 text-white/55">{selected.caption || selected.creativeDirection || "-"}</p>
              {selectedUrl ? <a href={selectedUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-sm font-black text-white">{c.openPost}<ExternalLink className="h-4 w-4" /></a> : null}
              <button className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-black text-white/70 hover:bg-white/[0.07]"><RefreshCw className="h-4 w-4" />{c.retry}</button>
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4"><p className="text-xs font-black uppercase tracking-[0.14em] text-white/35">{c.meta}</p><p className="mt-3 text-sm text-white/55">{selected.contentType} · {selected.template?.name || "No template"}</p></div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4"><p className="text-xs font-black uppercase tracking-[0.14em] text-white/35">{c.timeline}</p><Timeline label="Created" value={formatDate(selected.createdAt)} /><Timeline label="Updated" value={formatDate(selected.updatedAt)} /><Timeline label="Published" value={formatDate(selected.postingLogs?.[0]?.createdAt)} /></div>
            </>
          ) : <p className="text-sm text-white/45">{c.noItems}</p>}
        </aside>
      </div>
    </main>
  );
}

function Metric({ label, value, icon, danger = false }: { label: string; value: number; icon: React.ReactNode; danger?: boolean }) {
  return <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5"><div className="flex items-center justify-between"><p className="text-sm text-white/50">{label}</p><span className={danger ? "text-red-200" : "text-violet-200"}>{icon}</span></div><p className="mt-3 text-4xl font-black">{value}</p></div>;
}

function Timeline({ label, value }: { label: string; value: string }) {
  return <div className="mt-3 flex items-center justify-between gap-3 text-sm"><span className="flex items-center gap-2 text-white/55"><CheckCircle2 className="h-4 w-4 text-emerald-300" />{label}</span><span className="text-white/40">{value}</span></div>;
}
