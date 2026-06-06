"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Archive,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  HelpCircle,
  Image,
  Layers3,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { ReactNode } from "react";

type Template = {
  id: string;
  companyId: string;
  name: string;
  type: string;
  platform: string | null;
  category: string | null;
  templateFileUrl: string | null;
  previewImageUrl: string | null;
  size: string | null;
  status: string;
  createdAt: string;
  company: {
    id: string;
    companyName: string | null;
    businessType: string | null;
  };
  _count: {
    contentItems: number;
  };
};

const copy = {
  en: {
    title: "Templates",
    subtitle: "Create, manage, preview, and reuse brand templates for faster AI content generation.",
    addTemplate: "New template",
    createTemplate: "Create new template",
    createTemplateText: "Open a brand workspace and upload a reusable creative template.",
    search: "Search templates...",
    allTypes: "All types",
    allPlatforms: "All platforms",
    allStatuses: "All statuses",
    empty: "No templates found.",
    brand: "Brand",
    type: "Type",
    platform: "Platform",
    usedBy: "Used",
    contentItems: "times",
    preview: "Preview",
    clone: "Clone",
    edit: "Edit",
    delete: "Delete",
    unavailable: "unavailable",
    deleted: "Template deleted",
    deleteFailed: "Template delete failed",
    deleteConfirm: (name: string) => `Delete ${name}?`,
    summary: {
      total: "Total templates",
      active: "Active",
      draft: "Draft",
      archived: "Archived",
    },
    helpTitle: "What is a template?",
    helpText: "Templates help Hermes generate consistent posts by reusing layout, brand colors, text zones, and visual style.",
    helpItems: ["Layout / design structure", "Text blocks and placement", "Brand colors and fonts", "Dynamic variables"],
    guideTitle: "Help",
    guideItems: ["How to create a template", "How to reuse variables", "How to preview outputs", "Platform sizes"],
    tipTitle: "Tip",
    tipText: "For similar campaigns, duplicate a proven template and change only the editable fields.",
  },
  mn: {
    title: "Темплейтүүд",
    subtitle: "Брэндийн контент үүсгэхэд ашиглах темплейтүүдийг үүсгэж, удирдаж, preview хийж, дахин ашиглана.",
    addTemplate: "Шинэ темплейт нэмэх",
    createTemplate: "Шинэ темплейт үүсгэх",
    createTemplateText: "Брэнд workspace нээгээд дахин ашиглах creative template upload хийнэ.",
    search: "Темплейт хайх...",
    allTypes: "Бүх төрөл",
    allPlatforms: "Бүх платформ",
    allStatuses: "Бүх статус",
    empty: "Темплейт олдсонгүй.",
    brand: "Брэнд",
    type: "Төрөл",
    platform: "Платформ",
    usedBy: "Ашигласан",
    contentItems: "удаа",
    preview: "Preview",
    clone: "Хуулах",
    edit: "Засах",
    delete: "Устгах",
    unavailable: "боломжгүй",
    deleted: "Темплейт устлаа",
    deleteFailed: "Темплейт устгахад алдаа гарлаа",
    deleteConfirm: (name: string) => `${name} темплейтийг устгах уу?`,
    summary: {
      total: "Нийт темплейт",
      active: "Идэвхтэй",
      draft: "Черновик",
      archived: "Архивласан",
    },
    helpTitle: "Темплейт гэж юу вэ?",
    helpText: "Темплейт нь давтагддаг контент бүтээх загвар бөгөөд Hermes-д brand style, layout, text zone-оо тогтвортой ашиглуулахад тусална.",
    helpItems: ["Загвар дизайн / layout", "Контент бүтэц / text blocks", "Брэнд өнгө, фонт", "Динамик хувьсагч"],
    guideTitle: "Тусламж",
    guideItems: ["Шинэ темплейт үүсгэх заавар", "Хувьсагч ашиглах заавар", "Preview хэрхэн хийх вэ?", "Платформын хэмжээ"],
    tipTitle: "Tip",
    tipText: "Ижил төстэй campaign-д сайн ажилласан темплейтийг хуулж аваад editable field-үүдийг л өөрчил.",
  },
};

function statusTone(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("active")) return "border-emerald-300/20 bg-emerald-300/10 text-emerald-100";
  if (normalized.includes("draft")) return "border-amber-300/20 bg-amber-300/10 text-amber-100";
  if (normalized.includes("archiv")) return "border-white/10 bg-white/[0.06] text-white/50";
  return "border-violet-300/20 bg-violet-300/10 text-violet-100";
}

export default function TemplatesManager({ initialTemplates, lang = "en" }: { initialTemplates: Template[]; lang?: "en" | "mn" }) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const c = copy[lang];
  const withLang = (href: string) => `${href}?lang=${lang}`;

  const types = useMemo(() => Array.from(new Set(templates.map((template) => template.type).filter(Boolean))).sort(), [templates]);
  const platforms = useMemo(() => Array.from(new Set(templates.map((template) => template.platform).filter(Boolean))) as string[], [templates]);
  const statuses = useMemo(() => Array.from(new Set(templates.map((template) => template.status).filter(Boolean))).sort(), [templates]);

  const stats = useMemo(() => {
    return templates.reduce(
      (acc, template) => {
        acc.total += 1;
        const status = template.status.toLowerCase();
        if (status.includes("active")) acc.active += 1;
        else if (status.includes("draft")) acc.draft += 1;
        else if (status.includes("archiv")) acc.archived += 1;
        return acc;
      },
      { total: 0, active: 0, draft: 0, archived: 0 }
    );
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return templates.filter((template) => {
      const matchesQuery = !needle || [
        template.name,
        template.category,
        template.type,
        template.platform,
        template.status,
        template.company.companyName,
        template.company.businessType,
      ].filter(Boolean).some((value) => value!.toLowerCase().includes(needle));
      const matchesType = !typeFilter || template.type === typeFilter;
      const matchesPlatform = !platformFilter || template.platform === platformFilter;
      const matchesStatus = !statusFilter || template.status === statusFilter;
      return matchesQuery && matchesType && matchesPlatform && matchesStatus;
    });
  }, [platformFilter, query, statusFilter, templates, typeFilter]);

  async function deleteTemplate(template: Template) {
    if (!window.confirm(c.deleteConfirm(template.name))) return;
    setDeletingId(template.id);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/postly/brands/${template.companyId}/templates/${template.id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || c.deleteFailed);
      setTemplates((current) => current.filter((item) => item.id !== template.id));
      setMessage(c.deleted);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : c.deleteFailed);
    } finally {
      setDeletingId("");
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-violet-100">
              <Layers3 className="h-3.5 w-3.5" /> Creative System
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{c.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">{c.subtitle}</p>
          </div>
          <Link
            href={withLang("/admin/postly/brands")}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 text-sm font-black text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.01]"
          >
            <Plus className="h-4 w-4" />
            {c.addTemplate}
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label={c.summary.total} value={stats.total} icon={<Sparkles className="h-4 w-4" />} />
          <SummaryCard label={c.summary.active} value={stats.active} icon={<CheckCircle2 className="h-4 w-4" />} />
          <SummaryCard label={c.summary.draft} value={stats.draft} icon={<Copy className="h-4 w-4" />} />
          <SummaryCard label={c.summary.archived} value={stats.archived} icon={<Archive className="h-4 w-4" />} />
        </div>
      </div>

      {message ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white/70">{message}</div>
      ) : null}

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="grid gap-3 lg:grid-cols-[1fr_170px_170px_170px_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={c.search}
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-violet-300/60"
              />
            </label>
            <FilterSelect value={typeFilter} onChange={setTypeFilter} options={types} placeholder={c.allTypes} />
            <FilterSelect value={platformFilter} onChange={setPlatformFilter} options={platforms} placeholder={c.allPlatforms} />
            <FilterSelect value={statusFilter} onChange={setStatusFilter} options={statuses} placeholder={c.allStatuses} />
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-black text-white/65 hover:border-violet-300/35 hover:bg-violet-500/10 hover:text-white">
              <Search className="h-4 w-4" />
              {lang === "mn" ? "Шүүх" : "Filter"}
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            <button type="button" className="grid min-h-[310px] place-items-center rounded-[1.5rem] border border-dashed border-violet-300/25 bg-white/[0.02] p-6 text-center transition hover:border-violet-300/55 hover:bg-violet-300/5">
              <div>
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25">
                  <Plus className="h-8 w-8" />
                </span>
                <p className="mt-5 text-lg font-black">{c.createTemplate}</p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-white/45">{c.createTemplateText}</p>
              </div>
            </button>

            {filteredTemplates.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-white/[0.03] p-8 text-center text-sm text-white/50 md:col-span-2">
                {c.empty}
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <article key={template.id} className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-white/[0.06]">
                  <div className="relative grid aspect-[1.35] place-items-center overflow-hidden bg-white/[0.04]">
                    {template.previewImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={template.previewImageUrl} alt={template.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <Image className="h-10 w-10 text-white/25" />
                    )}
                    <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-white">{template.type}</div>
                    <div className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${statusTone(template.status)}`}>{template.status}</div>
                  </div>
                  <div className="p-4">
                    <h2 className="truncate text-lg font-black">{template.name}</h2>
                    <p className="mt-2 inline-flex rounded-full bg-violet-400/15 px-2.5 py-1 text-xs font-bold text-violet-100">{template.company.companyName || c.brand}</p>
                    <div className="mt-4 grid gap-2 text-xs text-white/55">
                      <p>{c.platform}: {template.platform || "-"}</p>
                      <p>{c.usedBy}: {template._count.contentItems} {c.contentItems}</p>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      <TemplateLink href={template.previewImageUrl || template.templateFileUrl} label={c.preview} unavailable={c.unavailable} icon={<Eye className="h-4 w-4" />} />
                      <Link href={withLang(`/admin/postly/brands/${template.companyId}`)} title={c.clone} className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 text-white/65 transition hover:bg-white/10 hover:text-white"><Copy className="h-4 w-4" /></Link>
                      <Link href={withLang(`/admin/postly/brands/${template.companyId}`)} title={c.edit} className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 text-white/65 transition hover:bg-white/10 hover:text-white"><Pencil className="h-4 w-4" /></Link>
                      <button type="button" onClick={() => deleteTemplate(template)} disabled={deletingId === template.id} title={c.delete} className="inline-flex h-10 items-center justify-center rounded-xl border border-red-400/20 text-red-200 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50">
                        {deletingId === template.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <InfoPanel title={c.helpTitle} icon={<HelpCircle className="h-4 w-4" />}>
            <p className="text-sm leading-6 text-white/55">{c.helpText}</p>
            <div className="mt-4 grid gap-2">
              {c.helpItems.map((item) => <CheckRow key={item}>{item}</CheckRow>)}
            </div>
          </InfoPanel>

          <InfoPanel title={c.guideTitle} icon={<HelpCircle className="h-4 w-4" />} highlight>
            <div className="grid gap-2">
              {c.guideItems.map((item) => <GuideRow key={item}>{item}</GuideRow>)}
            </div>
          </InfoPanel>

          <InfoPanel title={c.tipTitle} icon={<Sparkles className="h-4 w-4" />}>
            <p className="text-sm leading-6 text-white/55">{c.tipText}</p>
            <div className="mt-5 grid place-items-center rounded-2xl bg-violet-500/10 p-8 text-violet-100">
              <Layers3 className="h-16 w-16 opacity-70" />
            </div>
          </InfoPanel>
        </aside>
      </div>
    </>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-white/50">{label}</p>
        <span className="text-violet-200">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-black">{value}</p>
    </div>
  );
}

function FilterSelect({ value, onChange, options, placeholder }: { value: string; onChange: (value: string) => void; options: string[]; placeholder: string }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-2xl border border-white/10 bg-black/45 px-3 text-sm text-white outline-none transition focus:border-violet-300/70">
      <option value="">{placeholder}</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}

function TemplateLink({ href, label, unavailable, icon }: { href?: string | null; label: string; unavailable: string; icon: ReactNode }) {
  if (!href) return <span className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 text-white/25" title={`${label} ${unavailable}`}>{icon}</span>;
  return <a href={href} target="_blank" rel="noreferrer" title={label} className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 text-white/65 transition hover:bg-white/10 hover:text-white">{icon}<span className="sr-only"><ExternalLink className="h-3 w-3" /></span></a>;
}

function InfoPanel({ title, icon, highlight = false, children }: { title: string; icon: ReactNode; highlight?: boolean; children: ReactNode }) {
  return (
    <section className={`rounded-[1.5rem] border p-5 ${highlight ? "border-violet-300/25 bg-violet-500/10" : "border-white/10 bg-white/[0.04]"}`}>
      <h3 className="mb-4 flex items-center gap-2 font-black"><span className="text-violet-200">{icon}</span>{title}</h3>
      {children}
    </section>
  );
}

function CheckRow({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-2 text-sm text-white/65"><CheckCircle2 className="h-4 w-4 text-emerald-300" />{children}</div>;
}

function GuideRow({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/65">{children}</div>;
}
