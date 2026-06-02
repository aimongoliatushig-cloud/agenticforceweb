"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Image, LoaderCircle, Pencil, Plus, Search, Trash2 } from "lucide-react";
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
    subtitle: "Review every brand template saved in Supabase, then preview, edit, or delete it.",
    addTemplate: "Add template",
    search: "Search templates...",
    allTypes: "All types",
    allPlatforms: "All platforms",
    empty: "No templates found.",
    brand: "Brand",
    type: "Type",
    platform: "Platform",
    usedBy: "Used by",
    contentItems: "content items",
    preview: "Preview",
    edit: "Edit in brand",
    delete: "Delete template",
    unavailable: "unavailable",
    deleted: "Template deleted",
    deleteFailed: "Template delete failed",
    deleteConfirm: (name: string) => `Delete ${name}?`,
  },
  mn: {
    title: "Темплейтүүд",
    subtitle: "Supabase-д хадгалагдсан бүх брэндийн темплейтийг харах, preview хийх, засах эсвэл устгах хэсэг.",
    addTemplate: "Темплейт нэмэх",
    search: "Темплейт хайх...",
    allTypes: "Бүх төрөл",
    allPlatforms: "Бүх платформ",
    empty: "Темплейт олдсонгүй.",
    brand: "Брэнд",
    type: "Төрөл",
    platform: "Платформ",
    usedBy: "Ашигласан",
    contentItems: "контент",
    preview: "Preview",
    edit: "Брэнд дээр засах",
    delete: "Темплейт устгах",
    unavailable: "боломжгүй",
    deleted: "Темплейт устлаа",
    deleteFailed: "Темплейт устгахад алдаа гарлаа",
    deleteConfirm: (name: string) => `${name} темплейтийг устгах уу?`,
  },
};

export default function TemplatesManager({ initialTemplates, lang = "en" }: { initialTemplates: Template[]; lang?: "en" | "mn" }) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const c = copy[lang];
  const withLang = (href: string) => `${href}?lang=${lang}`;

  const types = useMemo(() => Array.from(new Set(templates.map((template) => template.type).filter(Boolean))).sort(), [templates]);
  const platforms = useMemo(() => Array.from(new Set(templates.map((template) => template.platform).filter(Boolean))) as string[], [templates]);

  const filteredTemplates = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return templates.filter((template) => {
      const matchesQuery = !needle || [
        template.name,
        template.category,
        template.type,
        template.platform,
        template.company.companyName,
        template.company.businessType,
      ].filter(Boolean).some((value) => value!.toLowerCase().includes(needle));
      const matchesType = !typeFilter || template.type === typeFilter;
      const matchesPlatform = !platformFilter || template.platform === platformFilter;
      return matchesQuery && matchesType && matchesPlatform;
    });
  }, [platformFilter, query, templates, typeFilter]);

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
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-black sm:text-4xl">{c.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">{c.subtitle}</p>
        </div>
        <Link
          href={withLang("/admin/postly/brands")}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-amber-300 px-4 text-sm font-bold text-black transition hover:bg-amber-200"
        >
          <Plus className="h-4 w-4" />
          {c.addTemplate}
        </Link>
      </div>

      {message ? (
        <div className="mt-6 rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm text-white/70">{message}</div>
      ) : null}

      <div className="mt-8 grid gap-3 lg:grid-cols-[1fr_180px_180px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={c.search}
            className="h-11 w-full rounded-md border border-white/10 bg-white/[0.04] pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-amber-300/60"
          />
        </label>
        <FilterSelect value={typeFilter} onChange={setTypeFilter} options={types} placeholder={c.allTypes} />
        <FilterSelect value={platformFilter} onChange={setPlatformFilter} options={platforms} placeholder={c.allPlatforms} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTemplates.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-8 text-center text-sm text-white/50 md:col-span-2 xl:col-span-3">
            {c.empty}
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <article key={template.id} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20">
              <div className="grid aspect-[1.18] place-items-center bg-white/[0.04]">
                {template.previewImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={template.previewImageUrl} alt={template.name} className="h-full w-full object-cover" />
                ) : (
                  <Image className="h-9 w-9 text-white/25" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-bold">{template.name}</h2>
                    <p className="mt-1 text-sm text-white/50">{template.company.companyName || c.brand}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/60">{template.status}</span>
                </div>
                <div className="mt-4 grid gap-2 text-xs text-white/55">
                  <p>{c.type}: {template.type}</p>
                  <p>{c.platform}: {template.platform || "-"}</p>
                  <p>{c.usedBy}: {template._count.contentItems} {c.contentItems}</p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <TemplateLink href={template.previewImageUrl || template.templateFileUrl} label={c.preview} unavailable={c.unavailable} icon={<ExternalLink className="h-4 w-4" />} />
                  <Link
                    href={withLang(`/admin/postly/brands/${template.companyId}`)}
                    title={c.edit}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-white/10 text-white/65 transition hover:bg-white/10 hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteTemplate(template)}
                    disabled={deletingId === template.id}
                    title={c.delete}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-red-400/20 text-red-200 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === template.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </>
  );
}

function FilterSelect({ value, onChange, options, placeholder }: { value: string; onChange: (value: string) => void; options: string[]; placeholder: string }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 rounded-md border border-white/10 bg-black/45 px-3 text-sm text-white outline-none transition focus:border-amber-300/70"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function TemplateLink({ href, label, unavailable, icon }: { href?: string | null; label: string; unavailable: string; icon: ReactNode }) {
  if (!href) {
    return (
      <span className="inline-flex h-9 items-center justify-center rounded-md border border-white/10 text-white/25" title={`${label} ${unavailable}`}>
        {icon}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={label}
      className="inline-flex h-9 items-center justify-center rounded-md border border-white/10 text-white/65 transition hover:bg-white/10 hover:text-white"
    >
      {icon}
    </a>
  );
}
