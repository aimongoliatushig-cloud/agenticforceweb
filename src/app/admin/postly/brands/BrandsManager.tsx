"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  FileText,
  Layers3,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

type Brand = {
  id: string;
  companyName: string | null;
  businessType: string | null;
  activityDirection: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  logoUrl: string | null;
  brandGuideline: {
    toneOfVoice: string | null;
    brandColors: string[];
    visualStyle: string | null;
    language: string;
  } | null;
  _count: {
    brandTemplates: number;
    contentItems: number;
    contentPlans: number;
    productsServicesPostly: number;
  };
};

type FormState = {
  companyName: string;
  businessType: string;
  activityDirection: string;
  description: string;
  toneOfVoice: string;
  brandColors: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  logoUrl: string;
};

const copy = {
  en: {
    title: "Brands",
    subtitle: "Each brand is an AI workspace with its own chat, templates, products, plans, approvals, and publishing queue.",
    addBrand: "Add Brand",
    addNewBrand: "Add New Brand",
    addNewBrandText: "Create a Supabase-backed brand workspace.",
    search: "Search brand...",
    empty: "No matching brand workspace found.",
    unnamed: "Unnamed brand",
    brandFallback: "Brand workspace",
    hermesReady: "Hermes-ready brand workspace.",
    target: "Target",
    targetMissing: "brand audience not set",
    hermes: "Hermes",
    active: "Active",
    templates: "Templates",
    content: "Content",
    plans: "Plans",
    products: "Products",
    openWorkspace: "Workspace",
    openChat: "AI Chat",
    readiness: "Ready",
    deleteConfirm: (name: string) => `Delete ${name}? This also removes its templates, content, logs, and integrations.`,
    savedCreate: "Brand created",
    savedUpdate: "Brand updated",
    deleted: "Brand deleted",
    saveFailed: "Brand save failed",
    deleteFailed: "Brand delete failed",
    modalCreate: "Add brand",
    modalEdit: "Edit brand",
    modalText: "Brand data is saved to Supabase and used by Hermes as context.",
    cancel: "Cancel",
    saving: "Saving...",
    saveChanges: "Save changes",
    createBrand: "Create brand",
    summary: {
      brands: "Brands",
      ready: "Hermes-ready",
      templates: "Templates",
      content: "Content items",
    },
    fields: {
      companyName: "Brand name",
      businessType: "Industry",
      activityDirection: "Audience",
      toneOfVoice: "Tone",
      phone: "Phone",
      email: "Email",
      website: "Website",
      logoUrl: "Logo file",
      facebookUrl: "Facebook",
      instagramUrl: "Instagram",
      tiktokUrl: "TikTok",
      brandColors: "Brand colors",
      address: "Address",
      description: "Description",
    },
  },
  mn: {
    title: "Брэндүүд",
    subtitle: "Брэнд бүр өөрийн AI чат, template, бүтээгдэхүүн, plan, approval, publishing queue-тэй workspace байна.",
    addBrand: "Брэнд нэмэх",
    addNewBrand: "Шинэ брэнд нэмэх",
    addNewBrandText: "Supabase-д хадгалагдах брэнд workspace үүсгэнэ.",
    search: "Брэнд хайх...",
    empty: "Тохирох брэнд workspace олдсонгүй.",
    unnamed: "Нэргүй брэнд",
    brandFallback: "Брэнд workspace",
    hermesReady: "Hermes-д бэлэн брэнд workspace.",
    target: "Зорилтот",
    targetMissing: "брэндийн audience тохируулаагүй",
    hermes: "Hermes",
    active: "Идэвхтэй",
    templates: "Темплейт",
    content: "Контент",
    plans: "Plan",
    products: "Бүтээгдэхүүн",
    openWorkspace: "Workspace",
    openChat: "AI чат",
    readiness: "Бэлэн",
    deleteConfirm: (name: string) => `${name}-г устгах уу? Template, content, logs, integration бүгд хамт устна.`,
    savedCreate: "Брэнд үүслээ",
    savedUpdate: "Брэнд шинэчлэгдлээ",
    deleted: "Брэнд устлаа",
    saveFailed: "Брэнд хадгалахад алдаа гарлаа",
    deleteFailed: "Брэнд устгахад алдаа гарлаа",
    modalCreate: "Брэнд нэмэх",
    modalEdit: "Брэнд засах",
    modalText: "Брэндийн мэдээлэл Supabase-д хадгалагдаж Hermes-ийн context болно.",
    cancel: "Болих",
    saving: "Хадгалж байна...",
    saveChanges: "Өөрчлөлт хадгалах",
    createBrand: "Брэнд үүсгэх",
    summary: {
      brands: "Брэнд",
      ready: "Hermes-ready",
      templates: "Темплейт",
      content: "Контент item",
    },
    fields: {
      companyName: "Брэндийн нэр",
      businessType: "Салбар",
      activityDirection: "Audience",
      toneOfVoice: "Tone",
      phone: "Утас",
      email: "Имэйл",
      website: "Website",
      logoUrl: "Logo file",
      facebookUrl: "Facebook",
      instagramUrl: "Instagram",
      tiktokUrl: "TikTok",
      brandColors: "Брэнд өнгө",
      address: "Хаяг",
      description: "Тайлбар",
    },
  },
};

const emptyForm: FormState = {
  companyName: "",
  businessType: "",
  activityDirection: "",
  description: "",
  toneOfVoice: "",
  brandColors: "",
  phone: "",
  email: "",
  website: "",
  address: "",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  logoUrl: "",
};

function formFromBrand(brand: Brand): FormState {
  return {
    companyName: brand.companyName ?? "",
    businessType: brand.businessType ?? "",
    activityDirection: brand.activityDirection ?? "",
    description: brand.description ?? "",
    toneOfVoice: brand.brandGuideline?.toneOfVoice ?? "",
    brandColors: brand.brandGuideline?.brandColors.join("\n") ?? "",
    phone: brand.phone ?? "",
    email: brand.email ?? "",
    website: brand.website ?? "",
    address: brand.address ?? "",
    facebookUrl: brand.facebookUrl ?? "",
    instagramUrl: brand.instagramUrl ?? "",
    tiktokUrl: brand.tiktokUrl ?? "",
    logoUrl: brand.logoUrl ?? "",
  };
}

function readinessScore(brand: Brand) {
  let score = 0;
  if (brand.companyName) score += 18;
  if (brand.businessType || brand.activityDirection) score += 16;
  if (brand.description) score += 16;
  if (brand.brandGuideline?.toneOfVoice || brand.brandGuideline?.visualStyle) score += 16;
  if (brand._count.productsServicesPostly > 0) score += 16;
  if (brand._count.brandTemplates > 0) score += 18;
  return Math.min(score, 100);
}

function brandInitial(name?: string | null) {
  return (name || "B").slice(0, 1).toUpperCase();
}

export default function BrandsManager({ initialBrands, lang = "en" }: { initialBrands: Brand[]; lang?: "en" | "mn" }) {
  const [brands, setBrands] = useState(initialBrands);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const c = copy[lang];
  const withLang = (href: string) => `${href}?lang=${lang}`;

  async function refreshBrands() {
    try {
      const response = await fetch("/api/admin/postly/brands", { cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (response.ok && Array.isArray(data.brands)) {
        setBrands(data.brands);
      }
    } catch {
      // Keep the server-rendered list if a background refresh fails.
    }
  }

  useEffect(() => {
    refreshBrands();
    function handleFocus() {
      refreshBrands();
    }
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, []);

  const filteredBrands = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return brands;
    return brands.filter((brand) =>
      [brand.companyName, brand.businessType, brand.activityDirection, brand.description, brand.email]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(needle))
    );
  }, [brands, query]);

  const totals = useMemo(() => {
    return brands.reduce(
      (acc, brand) => {
        acc.templates += brand._count.brandTemplates;
        acc.content += brand._count.contentItems;
        if (readinessScore(brand) >= 70) acc.ready += 1;
        return acc;
      },
      { templates: 0, content: 0, ready: 0 }
    );
  }, [brands]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreate() {
    setEditingBrand(null);
    setForm(emptyForm);
    setLogoFile(null);
    setFormOpen(true);
    setMessage("");
  }

  function openEdit(brand: Brand) {
    setEditingBrand(brand);
    setForm(formFromBrand(brand));
    setLogoFile(null);
    setFormOpen(true);
    setMessage("");
  }

  async function saveBrand() {
    setSaving(true);
    setMessage("");
    try {
      const url = editingBrand ? `/api/admin/postly/brands/${editingBrand.id}` : "/api/admin/postly/brands";
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        body.append(key, value);
      });
      if (logoFile) body.append("logoFile", logoFile);

      const response = await fetch(url, {
        method: editingBrand ? "PUT" : "POST",
        body,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || c.saveFailed);

      setBrands((current) =>
        editingBrand ? current.map((brand) => (brand.id === data.brand.id ? data.brand : brand)) : [data.brand, ...current]
      );
      setFormOpen(false);
      setForm(emptyForm);
      setLogoFile(null);
      setEditingBrand(null);
      setMessage(editingBrand ? c.savedUpdate : c.savedCreate);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : c.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  async function deleteBrand(brand: Brand) {
    const name = brand.companyName || c.unnamed;
    if (!window.confirm(c.deleteConfirm(name))) return;
    setMessage("");
    try {
      const response = await fetch(`/api/admin/postly/brands/${brand.id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || c.deleteFailed);
      setBrands((current) => current.filter((item) => item.id !== brand.id));
      setMessage(c.deleted);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : c.deleteFailed);
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-violet-100">
              <Sparkles className="h-3.5 w-3.5" /> Brand Workspaces
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{c.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">{c.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 text-sm font-black text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.01]"
          >
            <Plus className="h-4 w-4" />
            {c.addBrand}
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label={c.summary.brands} value={brands.length} icon={<Bot className="h-4 w-4" />} />
          <SummaryCard label={c.summary.ready} value={totals.ready} icon={<CheckCircle2 className="h-4 w-4" />} />
          <SummaryCard label={c.summary.templates} value={totals.templates} icon={<Layers3 className="h-4 w-4" />} />
          <SummaryCard label={c.summary.content} value={totals.content} icon={<FileText className="h-4 w-4" />} />
        </div>
      </div>

      {message ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white/70">{message}</div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="relative block w-full md:max-w-lg">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={c.search}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-violet-300/60"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        {filteredBrands.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-white/55">{c.empty}</div>
        ) : (
          filteredBrands.map((brand) => {
            const ready = readinessScore(brand);
            return (
              <article
                key={brand.id}
                className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-white/[0.06]"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    <Link href={withLang(`/admin/postly/brands/${brand.id}`)} className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-black text-lg font-black text-amber-200 shadow-inner shadow-white/5">
                      {brand.logoUrl ? (
                        <img src={brand.logoUrl} alt={`${brand.companyName || c.unnamed} logo`} className="h-full w-full object-cover" />
                      ) : (
                        brandInitial(brand.companyName)
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link href={withLang(`/admin/postly/brands/${brand.id}`)} className="truncate text-lg font-black text-white hover:text-violet-100">
                            {brand.companyName || c.unnamed}
                          </Link>
                          <p className="mt-1 truncate text-sm text-white/45">{brand.businessType || c.brandFallback}</p>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[11px] font-bold text-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                          {c.active}
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-white/45">
                        {brand.activityDirection || brand.description || c.hermesReady}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-3">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-bold text-white/55">{c.readiness}</span>
                      <span className="font-black text-violet-100">{ready}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400" style={{ width: `${ready}%` }} />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
                    <MiniMetric icon={<Layers3 className="h-3.5 w-3.5" />} label={c.templates} value={brand._count.brandTemplates} />
                    <MiniMetric icon={<FileText className="h-3.5 w-3.5" />} label={c.content} value={brand._count.contentItems} />
                    <MiniMetric icon={<CalendarDays className="h-3.5 w-3.5" />} label={c.plans} value={brand._count.contentPlans} />
                    <MiniMetric icon={<Bot className="h-3.5 w-3.5" />} label={c.products} value={brand._count.productsServicesPostly} />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 border-t border-white/10 bg-black/20 p-3">
                  <Link href={withLang(`/admin/postly/brands/${brand.id}`)} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-3 text-xs font-black text-black transition hover:bg-violet-100">
                    {c.openWorkspace}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link href={withLang(`/admin/postly/chat?brandId=${brand.id}`)} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-violet-300/30 bg-violet-500/15 px-3 text-xs font-black text-violet-100 transition hover:bg-violet-500/25">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {c.openChat}
                  </Link>
                  <button onClick={() => openEdit(brand)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/60 transition hover:bg-white/10 hover:text-violet-100" title={c.modalEdit}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteBrand(brand)} className="grid h-10 w-10 place-items-center rounded-xl border border-red-400/20 text-red-200 transition hover:bg-red-400/10" title={c.deleteConfirm(brand.companyName || c.unnamed)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })
        )}

        <button
          type="button"
          onClick={openCreate}
          className="grid min-h-[286px] place-items-center rounded-[1.5rem] border border-dashed border-white/15 bg-white/[0.02] p-6 text-center transition hover:border-violet-300/45 hover:bg-violet-300/5"
        >
          <div>
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white">
              <Plus className="h-5 w-5" />
            </span>
            <p className="mt-4 font-black">{c.addNewBrand}</p>
            <p className="mt-2 text-sm text-white/45">{c.addNewBrandText}</p>
          </div>
        </button>
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[1.5rem] border border-white/10 bg-zinc-950 p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">{editingBrand ? c.modalEdit : c.modalCreate}</h2>
                <p className="mt-1 text-sm text-white/50">{c.modalText}</p>
              </div>
              <button onClick={() => setFormOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/65 hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label={c.fields.companyName} value={form.companyName} onChange={(value) => update("companyName", value)} placeholder="Luna Brew" />
              <Field label={c.fields.businessType} value={form.businessType} onChange={(value) => update("businessType", value)} placeholder="Coffee shop" />
              <Field label={c.fields.activityDirection} value={form.activityDirection} onChange={(value) => update("activityDirection", value)} placeholder="20-35 specialty coffee fans" />
              <Field label={c.fields.toneOfVoice} value={form.toneOfVoice} onChange={(value) => update("toneOfVoice", value)} placeholder="Warm, premium, concise" />
              <Field label={c.fields.phone} value={form.phone} onChange={(value) => update("phone", value)} placeholder="+976..." />
              <Field label={c.fields.email} value={form.email} onChange={(value) => update("email", value)} placeholder="hello@brand.mn" />
              <Field label={c.fields.website} value={form.website} onChange={(value) => update("website", value)} placeholder="https://..." />
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">{c.fields.logoUrl}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-violet-400 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
                />
                <span className="mt-2 block text-xs text-white/35">{logoFile ? logoFile.name : "PNG, JPG, WEBP, SVG"}</span>
                {form.logoUrl && !logoFile ? (
                  <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/45">
                    <span className="h-4 w-4 rounded-full border border-white/10 bg-cover bg-center" style={{ backgroundImage: `url(${form.logoUrl})` }} />
                    Current logo
                  </span>
                ) : null}
              </label>
              <Field label={c.fields.facebookUrl} value={form.facebookUrl} onChange={(value) => update("facebookUrl", value)} placeholder="https://facebook.com/..." />
              <Field label={c.fields.instagramUrl} value={form.instagramUrl} onChange={(value) => update("instagramUrl", value)} placeholder="https://instagram.com/..." />
              <Field label={c.fields.tiktokUrl} value={form.tiktokUrl} onChange={(value) => update("tiktokUrl", value)} placeholder="https://tiktok.com/..." />
              <Field label={c.fields.brandColors} value={form.brandColors} onChange={(value) => update("brandColors", value)} placeholder="#101820&#10;#F2AA4C" multiline />
              <Field label={c.fields.address} value={form.address} onChange={(value) => update("address", value)} placeholder="Ulaanbaatar..." multiline />
              <Field label={c.fields.description} value={form.description} onChange={(value) => update("description", value)} placeholder="Short brand summary" multiline />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setFormOpen(false)} className="h-10 rounded-xl border border-white/10 px-4 text-sm text-white/70 hover:bg-white/10">
                {c.cancel}
              </button>
              <button
                onClick={saveBrand}
                disabled={saving || !form.companyName.trim()}
                className="h-10 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 text-sm font-black text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? c.saving : editingBrand ? c.saveChanges : c.createBrand}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
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

function MiniMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white/[0.04] p-2">
      <div className="flex items-center gap-1.5 text-white/35">
        <span className="text-violet-200">{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  return (
    <label className={multiline ? "block md:col-span-2" : "block"}>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={3}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/45 px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-violet-300/70"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/45 px-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-violet-300/70"
        />
      )}
    </label>
  );
}
