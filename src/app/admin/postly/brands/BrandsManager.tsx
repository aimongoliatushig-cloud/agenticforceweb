"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Grid2X2, ListFilter, MessageCircle, MoreHorizontal, Pencil, Plus, Search, Store, Trash2, X } from "lucide-react";

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
    subtitle: "Manage every brand, attach templates, and connect Hermes to brand-specific content work.",
    addBrand: "Add Brand",
    addNewBrand: "Add New Brand",
    addNewBrandText: "Create a real Supabase-backed brand.",
    search: "Search brand...",
    empty: "No matching Postly brands found.",
    unnamed: "Unnamed brand",
    brandFallback: "Brand",
    hermesReady: "Hermes-ready Postly brand.",
    target: "Target",
    targetMissing: "brand audience not set",
    hermes: "Hermes",
    active: "Active",
    templates: "Templates",
    deleteConfirm: (name: string) => `Delete ${name}? This also removes its templates, content, logs, and integrations.`,
    savedCreate: "Brand created",
    savedUpdate: "Brand updated",
    deleted: "Brand deleted",
    saveFailed: "Brand save failed",
    deleteFailed: "Brand delete failed",
    modalCreate: "Add brand",
    modalEdit: "Edit brand",
    modalText: "Brand data is saved to Supabase.",
    cancel: "Cancel",
    saving: "Saving...",
    saveChanges: "Save changes",
    createBrand: "Create brand",
    fields: {
      companyName: "Brand name",
      businessType: "Industry",
      activityDirection: "Audience",
      toneOfVoice: "Tone",
      phone: "Phone",
      email: "Email",
      website: "Website",
      logoUrl: "Logo URL",
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
    subtitle: "Брэнд бүрийг удирдаж, template холбож, Hermes-ийг тухайн брэндийн контент ажилд холбоно.",
    addBrand: "Брэнд нэмэх",
    addNewBrand: "Шинэ брэнд нэмэх",
    addNewBrandText: "Supabase-д хадгалагдах бодит брэнд үүсгэнэ.",
    search: "Брэнд хайх...",
    empty: "Тохирох Postly брэнд олдсонгүй.",
    unnamed: "Нэргүй брэнд",
    brandFallback: "Брэнд",
    hermesReady: "Hermes-д бэлэн Postly брэнд.",
    target: "Зорилтот",
    targetMissing: "брэндийн audience тохируулаагүй",
    hermes: "Hermes",
    active: "Идэвхтэй",
    templates: "Темплейт",
    deleteConfirm: (name: string) => `${name}-г устгах уу? Template, content, logs, integration бүгд хамт устна.`,
    savedCreate: "Брэнд үүслээ",
    savedUpdate: "Брэнд шинэчлэгдлээ",
    deleted: "Брэнд устлаа",
    saveFailed: "Брэнд хадгалахад алдаа гарлаа",
    deleteFailed: "Брэнд устгахад алдаа гарлаа",
    modalCreate: "Брэнд нэмэх",
    modalEdit: "Брэнд засах",
    modalText: "Брэндийн мэдээлэл Supabase-д хадгалагдана.",
    cancel: "Болих",
    saving: "Хадгалж байна...",
    saveChanges: "Өөрчлөлт хадгалах",
    createBrand: "Брэнд үүсгэх",
    fields: {
      companyName: "Брэндийн нэр",
      businessType: "Салбар",
      activityDirection: "Audience",
      toneOfVoice: "Tone",
      phone: "Утас",
      email: "Имэйл",
      website: "Website",
      logoUrl: "Logo URL",
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

export default function BrandsManager({ initialBrands, lang = "en" }: { initialBrands: Brand[]; lang?: "en" | "mn" }) {
  const [brands, setBrands] = useState(initialBrands);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const c = copy[lang];
  const withLang = (href: string) => `${href}?lang=${lang}`;
  const viewLabels = lang === "mn"
    ? { grid: "Grid харагдац", list: "List харагдац" }
    : { grid: "Grid view", list: "List view" };

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

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreate() {
    setEditingBrand(null);
    setForm(emptyForm);
    setFormOpen(true);
    setMessage("");
  }

  function openEdit(brand: Brand) {
    setEditingBrand(brand);
    setForm(formFromBrand(brand));
    setFormOpen(true);
    setMessage("");
  }

  async function saveBrand() {
    setSaving(true);
    setMessage("");

    try {
      const url = editingBrand ? `/api/admin/postly/brands/${editingBrand.id}` : "/api/admin/postly/brands";
      const response = await fetch(url, {
        method: editingBrand ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || c.saveFailed);

      setBrands((current) =>
        editingBrand ? current.map((brand) => (brand.id === data.brand.id ? data.brand : brand)) : [data.brand, ...current]
      );
      setFormOpen(false);
      setForm(emptyForm);
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
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-black sm:text-4xl">{c.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
            {c.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-amber-300 px-4 text-sm font-bold text-black transition hover:bg-amber-200"
        >
          <Plus className="h-4 w-4" />
          {c.addBrand}
        </button>
      </div>

      {message ? (
        <div className="mt-6 rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm text-white/70">{message}</div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="relative block w-full md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={c.search}
            className="h-11 w-full rounded-md border border-white/10 bg-white/[0.04] pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-amber-300/60"
          />
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            title={viewLabels.grid}
            aria-pressed={viewMode === "grid"}
            className={`grid h-10 w-10 place-items-center rounded-md border transition ${
              viewMode === "grid" ? "border-amber-300/40 bg-amber-300/10 text-amber-200" : "border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/10"
            }`}
          >
            <Grid2X2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            title={viewLabels.list}
            aria-pressed={viewMode === "list"}
            className={`grid h-10 w-10 place-items-center rounded-md border transition ${
              viewMode === "list" ? "border-amber-300/40 bg-amber-300/10 text-amber-200" : "border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/10"
            }`}
          >
            <ListFilter className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={viewMode === "grid" ? "mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" : "mt-6 grid gap-3"}>
        {filteredBrands.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-sm text-white/55">
            {c.empty}
          </div>
        ) : (
          filteredBrands.map((brand) => (
            <article
              key={brand.id}
              className={`overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20 transition hover:border-amber-300/40 hover:bg-white/[0.06] ${
                viewMode === "list" ? "lg:grid lg:grid-cols-[1fr_260px]" : ""
              }`}
            >
              <Link href={withLang(`/admin/postly/brands/${brand.id}`)} className="block p-5">
                <div>
                  <div className="grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-black text-xl font-black text-amber-200">
                    {(brand.companyName || "P").slice(0, 1)}
                  </div>
                  <h2 className="mt-4 text-lg font-bold">{brand.companyName || c.unnamed}</h2>
                  <p className="mt-1 text-sm text-white/50">{brand.businessType || c.brandFallback}</p>
                  <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-white/45">
                    {brand.activityDirection || brand.description || c.hermesReady}
                  </p>
                </div>
                <div className="mt-4 space-y-2 text-xs text-white/55">
                  <p>{c.target}: {brand.description?.slice(0, 58) || c.targetMissing}</p>
                  <p>
                    {c.hermes}: <span className="font-semibold text-emerald-300">{c.active}</span>
                  </p>
                  <p>{c.templates}: {brand._count.brandTemplates}</p>
                </div>
              </Link>
              <div className={`grid grid-cols-5 border-t border-white/10 ${viewMode === "list" ? "lg:border-l lg:border-t-0" : ""}`}>
                <IconLink href={withLang(`/admin/postly/brands/${brand.id}`)} label="Chat" icon={<MessageCircle className="h-4 w-4" />} />
                <IconLink href={withLang(`/admin/postly/brands/${brand.id}`)} label="Templates" icon={<Store className="h-4 w-4" />} />
                <button onClick={() => openEdit(brand)} className="flex h-11 items-center justify-center border-r border-white/10 text-amber-200 hover:bg-white/5">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => deleteBrand(brand)} className="flex h-11 items-center justify-center border-r border-white/10 text-red-300 hover:bg-red-400/10">
                  <Trash2 className="h-4 w-4" />
                </button>
                <IconLink href={withLang(`/admin/postly/brands/${brand.id}`)} label="More" icon={<MoreHorizontal className="h-4 w-4" />} />
              </div>
            </article>
          ))
        )}
        <button
          type="button"
          onClick={openCreate}
          className="grid min-h-[286px] place-items-center rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-6 text-center transition hover:border-amber-300/45 hover:bg-amber-300/5"
        >
          <div>
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-amber-300 text-black">
              <Plus className="h-5 w-5" />
            </span>
            <p className="mt-4 font-semibold">{c.addNewBrand}</p>
            <p className="mt-2 text-sm text-white/45">{c.addNewBrandText}</p>
          </div>
        </button>
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-white/10 bg-zinc-950 p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">{editingBrand ? c.modalEdit : c.modalCreate}</h2>
                <p className="mt-1 text-sm text-white/50">{c.modalText}</p>
              </div>
              <button onClick={() => setFormOpen(false)} className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-white/65 hover:bg-white/10">
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
              <Field label={c.fields.logoUrl} value={form.logoUrl} onChange={(value) => update("logoUrl", value)} placeholder="https://..." />
              <Field label={c.fields.facebookUrl} value={form.facebookUrl} onChange={(value) => update("facebookUrl", value)} placeholder="https://facebook.com/..." />
              <Field label={c.fields.instagramUrl} value={form.instagramUrl} onChange={(value) => update("instagramUrl", value)} placeholder="https://instagram.com/..." />
              <Field label={c.fields.tiktokUrl} value={form.tiktokUrl} onChange={(value) => update("tiktokUrl", value)} placeholder="https://tiktok.com/..." />
              <Field label={c.fields.brandColors} value={form.brandColors} onChange={(value) => update("brandColors", value)} placeholder="#101820&#10;#F2AA4C" multiline />
              <Field label={c.fields.address} value={form.address} onChange={(value) => update("address", value)} placeholder="Ulaanbaatar..." multiline />
              <Field label={c.fields.description} value={form.description} onChange={(value) => update("description", value)} placeholder="Short brand summary" multiline />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setFormOpen(false)} className="h-10 rounded-md border border-white/10 px-4 text-sm text-white/70 hover:bg-white/10">
                {c.cancel}
              </button>
              <button
                onClick={saveBrand}
                disabled={saving || !form.companyName.trim()}
                className="h-10 rounded-md bg-amber-300 px-4 text-sm font-bold text-black hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
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

function IconLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="flex h-11 items-center justify-center gap-2 border-r border-white/10 text-xs text-white/55 last:border-r-0 hover:bg-white/5 hover:text-amber-200">
      <span className="sr-only">{label}</span>
      <span className="text-amber-200">{icon}</span>
    </Link>
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
          className="mt-2 w-full rounded-md border border-white/10 bg-black/45 px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-amber-300/70"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="mt-2 h-11 w-full rounded-md border border-white/10 bg-black/45 px-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-amber-300/70"
        />
      )}
    </label>
  );
}
