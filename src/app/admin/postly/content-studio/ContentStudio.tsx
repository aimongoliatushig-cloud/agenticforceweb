"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, LoaderCircle, Send, Sparkles } from "lucide-react";

type Locale = "en" | "mn";
type Brand = {
  id: string;
  companyName: string | null;
  businessType: string | null;
  activityDirection: string | null;
  brandGuideline: { toneOfVoice: string | null; brandColors: string[]; language: string } | null;
  brandTemplates: { id: string; name: string; type: string; platform: string | null; previewImageUrl: string | null }[];
  productsServicesPostly: { id: string; name: string; description: string | null }[];
};

type CreatedItem = {
  id: string;
  title: string | null;
  headline: string | null;
  caption: string | null;
  imagePrompt: string | null;
  creativeDirection: string | null;
  status: string;
  contentType: string;
};

const controlClass = "h-11 rounded-md border border-white/10 bg-black/45 px-3 text-sm text-white outline-none focus:border-violet-300/70";

const quickPrompts = [
  "Create 5 Facebook post ideas with captions and image prompts.",
  "Create a launch campaign announcement with a strong CTA.",
  "Create an educational carousel outline for this brand.",
  "Create a premium promo poster caption and image prompt.",
  "Create a short reel script with hook, scenes, and CTA.",
  "Create a customer testimonial style post.",
];

const copy = {
  en: {
    title: "Content Studio",
    subtitle: "Generate brand-specific content through the existing Hermes/Postly chat workflow.",
    brand: "Brand",
    agent: "Agent / tool",
    type: "Content type",
    template: "Template",
    language: "Language",
    prompt: "Prompt",
    generate: "Generate draft",
    empty: "Add a brand first to use Content Studio.",
    noTemplate: "No specific template",
    preview: "Generated output",
    openQueue: "Open in brand workspace",
    sendApproval: "Review in approvals",
    success: "Draft generated and saved into the content queue.",
    error: "Content generation failed.",
  },
  mn: {
    title: "Контент студи",
    subtitle: "Одоо байгаа Hermes/Postly chat workflow ашиглан брэндийн контент draft үүсгэнэ.",
    brand: "Брэнд",
    agent: "Agent / tool",
    type: "Контент төрөл",
    template: "Темплейт",
    language: "Хэл",
    prompt: "Prompt",
    generate: "Draft үүсгэх",
    empty: "Content Studio ашиглахын тулд эхлээд брэнд нэмнэ үү.",
    noTemplate: "Тодорхой template сонгохгүй",
    preview: "Үүссэн output",
    openQueue: "Брэнд workspace нээх",
    sendApproval: "Approvals дээр шалгах",
    success: "Draft үүсэж content queue-д хадгалагдлаа.",
    error: "Контент үүсгэхэд алдаа гарлаа.",
  },
};

export default function ContentStudio({
  brands,
  initialBrandId,
  lang,
  databaseReady,
}: {
  brands: Brand[];
  initialBrandId?: string;
  lang: Locale;
  databaseReady: boolean;
}) {
  const c = copy[lang];
  const [brandId, setBrandId] = useState(initialBrandId && brands.some((brand) => brand.id === initialBrandId) ? initialBrandId : brands[0]?.id || "");
  const [contentType, setContentType] = useState("POSTER");
  const [templateId, setTemplateId] = useState("");
  const [language, setLanguage] = useState(lang === "mn" ? "Mongolian" : "English");
  const [prompt, setPrompt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [createdItem, setCreatedItem] = useState<CreatedItem | null>(null);
  const selectedBrand = useMemo(() => brands.find((brand) => brand.id === brandId) || null, [brandId, brands]);
  const templates = selectedBrand?.brandTemplates.filter((template) => template.type === contentType || !template.type) || [];

  async function generate() {
    if (!selectedBrand || !prompt.trim()) return;
    setSubmitting(true);
    setMessage("");
    setCreatedItem(null);

    try {
      const response = await fetch(`/api/admin/postly/brands/${selectedBrand.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${prompt.trim()}\n\nLanguage: ${language}`,
          contentType,
          templateId: templateId || undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || c.error);
      setCreatedItem(data.item);
      setMessage(c.success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : c.error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Postly OS</p>
          <h1 className="text-3xl font-black sm:text-4xl">{c.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">{c.subtitle}</p>
        </div>
        <Link href={`/admin/postly/approval?lang=${lang}`} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-bold text-white/70 transition hover:bg-white/10">
          <FileText className="h-4 w-4" />
          {c.sendApproval}
        </Link>
      </div>

      {!databaseReady ? (
        <div className="mt-8 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
          DATABASE_URL is not configured.
        </div>
      ) : null}

      {brands.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-8 text-center text-sm text-white/50">
          {c.empty}
        </div>
      ) : (
        <div className="mt-8 grid gap-5 xl:grid-cols-[360px_1fr_360px]">
          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="grid gap-4">
              <FieldLabel label={c.brand}>
                <select value={brandId} onChange={(event) => setBrandId(event.target.value)} className={controlClass}>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.companyName || "Unnamed brand"}</option>
                  ))}
                </select>
              </FieldLabel>
              <FieldLabel label={c.agent}>
                <select className={controlClass} defaultValue="Hermes">
                  <option>Hermes</option>
                  <option>Local Draft</option>
                  <option>Make-ready</option>
                </select>
              </FieldLabel>
              <FieldLabel label={c.type}>
                <select value={contentType} onChange={(event) => { setContentType(event.target.value); setTemplateId(""); }} className={controlClass}>
                  {["POSTER", "CAROUSEL", "REEL", "STORY"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </FieldLabel>
              <FieldLabel label={c.template}>
                <select value={templateId} onChange={(event) => setTemplateId(event.target.value)} className={controlClass}>
                  <option value="">{c.noTemplate}</option>
                  {templates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}
                </select>
              </FieldLabel>
              <FieldLabel label={c.language}>
                <select value={language} onChange={(event) => setLanguage(event.target.value)} className={controlClass}>
                  <option>Mongolian</option>
                  <option>English</option>
                  <option>Mongolian + English</option>
                </select>
              </FieldLabel>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <FieldLabel label={c.prompt}>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={10}
                placeholder="Describe the campaign, audience, offer, tone, and CTA..."
                className="w-full rounded-md border border-white/10 bg-black/45 p-4 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-violet-300/70"
              />
            </FieldLabel>
            <div className="mt-4 flex flex-wrap gap-2">
              {quickPrompts.map((item) => (
                <button key={item} onClick={() => setPrompt(item)} className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-white/60 transition hover:border-violet-300/40 hover:text-white">
                  {item}
                </button>
              ))}
            </div>
            <button
              onClick={generate}
              disabled={submitting || !selectedBrand || !prompt.trim()}
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-violet-500 px-5 text-sm font-bold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {c.generate}
            </button>
            {message ? <p className="mt-3 text-sm text-white/60">{message}</p> : null}
          </section>

          <aside className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center gap-2 text-violet-200">
              <Sparkles className="h-5 w-5" />
              <h2 className="text-sm font-bold uppercase tracking-[0.14em]">{c.preview}</h2>
            </div>
            {selectedBrand ? (
              <div className="mt-4 rounded-md border border-white/10 bg-black/25 p-4">
                <p className="font-semibold">{selectedBrand.companyName || "Unnamed brand"}</p>
                <p className="mt-1 text-sm text-white/45">{selectedBrand.businessType || selectedBrand.activityDirection || "Brand context missing"}</p>
                <p className="mt-3 text-xs text-white/40">Tone: {selectedBrand.brandGuideline?.toneOfVoice || "not set"}</p>
                <p className="mt-1 text-xs text-white/40">Products: {selectedBrand.productsServicesPostly.map((item) => item.name).join(", ") || "not set"}</p>
              </div>
            ) : null}

            {createdItem ? (
              <div className="mt-4 rounded-md border border-violet-300/20 bg-violet-300/10 p-4">
                <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/70">{createdItem.status}</span>
                <h3 className="mt-3 font-bold">{createdItem.title || createdItem.headline || "Untitled content"}</h3>
                {createdItem.caption ? <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/70">{createdItem.caption}</p> : null}
                {createdItem.imagePrompt ? <p className="mt-3 text-xs leading-5 text-white/45">Image prompt: {createdItem.imagePrompt}</p> : null}
                <div className="mt-4 grid gap-2">
                  <Link href={`/admin/postly/brands/${selectedBrand?.id}?lang=${lang}`} className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-white px-3 text-sm font-bold text-black">
                    {c.openQueue}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href={`/admin/postly/approval?lang=${lang}`} className="inline-flex h-9 items-center justify-center rounded-md border border-white/10 text-sm font-bold text-white/70 hover:bg-white/10">
                    {c.sendApproval}
                  </Link>
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      )}
    </main>
  );
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/45">{label}</span>
      {children}
    </label>
  );
}
