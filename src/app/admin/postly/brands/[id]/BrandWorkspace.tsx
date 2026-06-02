"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Image,
  Layers3,
  LoaderCircle,
  MessageSquareText,
  Pencil,
  Plus,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type { BrandTemplate, CompanyProfile, ContentItem, ContentPlan, ProductService, AgentLog, SocialAccount, MakeIntegration } from "@prisma/client";
import type { ReactNode } from "react";
import PostlyAdminShell from "../../PostlyAdminShell";

type Template = BrandTemplate;
type Item = ContentItem & { template?: BrandTemplate | null };
type Plan = ContentPlan & { _count: { contentItems: number } };
type Brand = CompanyProfile & {
  brandGuideline: {
    toneOfVoice?: string | null;
    brandColors: string[];
    fonts: string[];
    logoUrl?: string | null;
    forbiddenWords: string[];
    preferredWords: string[];
    ctaStyle?: string | null;
    visualStyle?: string | null;
    language: string;
  } | null;
  productsServicesPostly: ProductService[];
  brandTemplates: Template[];
  contentPlans: Plan[];
  contentItems: Item[];
  agentLogs: AgentLog[];
  socialAccounts: SocialAccount[];
  makeIntegration: MakeIntegration | null;
};

type TemplateForm = {
  name: string;
  type: string;
  category: string;
  size: string;
  previewImageUrl: string;
  templateFileUrl: string;
};

const emptyTemplate: TemplateForm = {
  name: "",
  type: "POSTER",
  category: "",
  size: "1080x1080",
  previewImageUrl: "",
  templateFileUrl: "",
};

export default function BrandWorkspace({ brand, lang = "en" }: { brand: Brand; lang?: "en" | "mn" }) {
  const [templates, setTemplates] = useState<Template[]>(brand.brandTemplates);
  const [items, setItems] = useState<Item[]>(brand.contentItems);
  const [logs, setLogs] = useState<AgentLog[]>(brand.agentLogs);
  const [templateForm, setTemplateForm] = useState<TemplateForm>(emptyTemplate);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [editingTemplateId, setEditingTemplateId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("POSTER");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [submittingTemplate, setSubmittingTemplate] = useState(false);
  const [sendingPrompt, setSendingPrompt] = useState(false);
  const [message, setMessage] = useState("");

  const plannedCount = useMemo(() => items.filter((item) => item.status === "PLANNED").length, [items]);
  const draftCount = useMemo(() => items.filter((item) => item.status === "DRAFT_GENERATED" || item.status === "WAITING_APPROVAL").length, [items]);

  function updateTemplate<K extends keyof TemplateForm>(key: K, value: TemplateForm[K]) {
    setTemplateForm((current) => ({ ...current, [key]: value }));
  }

  async function addTemplate() {
    setSubmittingTemplate(true);
    setMessage("");
    try {
      const body = new FormData();
      body.append("name", templateForm.name);
      body.append("type", templateForm.type);
      body.append("category", templateForm.category);
      body.append("size", templateForm.size);
      body.append("previewImageUrl", templateForm.previewImageUrl);
      body.append("templateFileUrl", templateForm.templateFileUrl);
      if (templateFile) body.append("file", templateFile);

      const response = await fetch(`/api/admin/postly/brands/${brand.id}/templates`, {
        method: "POST",
        body,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Template save failed");
      setTemplates((current) => [data.template, ...current]);
      setTemplateForm(emptyTemplate);
      setTemplateFile(null);
      setEditingTemplateId("");
      setMessage("Template added");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Template save failed");
    } finally {
      setSubmittingTemplate(false);
    }
  }

  function startEditTemplate(template: Template) {
    setEditingTemplateId(template.id);
    setTemplateFile(null);
    setTemplateForm({
      name: template.name,
      type: template.type,
      category: template.category || "",
      size: template.size || "1080x1080",
      previewImageUrl: template.previewImageUrl || "",
      templateFileUrl: template.templateFileUrl || "",
    });
    setMessage("");
  }

  function cancelEditTemplate() {
    setEditingTemplateId("");
    setTemplateForm(emptyTemplate);
    setTemplateFile(null);
    setMessage("");
  }

  async function updateCurrentTemplate() {
    if (!editingTemplateId) return;
    setSubmittingTemplate(true);
    setMessage("");
    try {
      const body = new FormData();
      body.append("name", templateForm.name);
      body.append("type", templateForm.type);
      body.append("category", templateForm.category);
      body.append("size", templateForm.size);
      body.append("previewImageUrl", templateForm.previewImageUrl);
      body.append("templateFileUrl", templateForm.templateFileUrl);
      if (templateFile) body.append("file", templateFile);

      const response = await fetch(`/api/admin/postly/brands/${brand.id}/templates/${editingTemplateId}`, {
        method: "PATCH",
        body,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Template update failed");
      setTemplates((current) => current.map((template) => (template.id === data.template.id ? data.template : template)));
      setTemplateForm(emptyTemplate);
      setTemplateFile(null);
      setEditingTemplateId("");
      setMessage("Template updated");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Template update failed");
    } finally {
      setSubmittingTemplate(false);
    }
  }

  async function deleteTemplate(template: Template) {
    if (!confirm(`Delete ${template.name}?`)) return;
    setMessage("");
    try {
      const response = await fetch(`/api/admin/postly/brands/${brand.id}/templates/${template.id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Template delete failed");
      setTemplates((current) => current.filter((item) => item.id !== template.id));
      if (selectedTemplateId === template.id) setSelectedTemplateId("");
      if (editingTemplateId === template.id) cancelEditTemplate();
      setMessage("Template deleted");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Template delete failed");
    }
  }

  async function sendPrompt() {
    setSendingPrompt(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/postly/brands/${brand.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          contentType,
          templateId: selectedTemplateId,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Prompt send failed");
      setItems((current) => [data.item, ...current]);
      if (data.log) setLogs((current) => [data.log, ...current].slice(0, 10));
      setPrompt("");
      setMessage(data.hermesTriggered ? "Prompt sent to Hermes" : "Prompt queued for Hermes cron");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Prompt send failed");
    } finally {
      setSendingPrompt(false);
    }
  }

  return (
    <PostlyAdminShell active="chat" lang={lang} currentPath={`/admin/postly/brands/${brand.id}`}>
      <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/admin/postly/brands" className="text-sm text-amber-300 hover:text-amber-200">
              Back to brands
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black sm:text-4xl">{brand.companyName || "Unnamed brand"}</h1>
              <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-xs font-semibold text-emerald-300">Active</span>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">{brand.businessType || brand.description || "Manage profile, templates, content, and Hermes chat for this brand."}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center md:min-w-[330px]">
            <Stat label="Templates" value={templates.length} />
            <Stat label="Queued" value={plannedCount} />
            <Stat label="Drafts" value={draftCount} />
          </div>
        </div>

        {message ? (
          <div className="mt-6 flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm text-white/70">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            {message}
          </div>
        ) : null}

        <div className="mt-6 overflow-x-auto border-b border-white/10">
          <div className="flex min-w-max gap-6 text-sm">
            {["Brand Profile", "Brand Voice", "Products / Services", "Templates", "Hermes Knowledge", "Content Plan"].map((tab, index) => (
              <button
                key={tab}
                className={`border-b-2 px-1 pb-3 font-medium transition ${
                  index === 0 ? "border-amber-300 text-amber-200" : "border-transparent text-white/45 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)_430px]">
          <aside className="grid content-start gap-6">
            <Panel title="Brand information" icon={<Sparkles className="h-5 w-5" />}>
              <div className="flex items-center gap-4">
                <div className="grid h-20 w-20 place-items-center rounded-full border border-white/10 bg-black text-2xl font-black text-amber-200">
                  {(brand.companyName || "P").slice(0, 1)}
                </div>
                <div>
                  <p className="font-semibold">{brand.companyName || "Unnamed brand"}</p>
                  <p className="mt-1 text-sm text-white/45">{brand.email || brand.id}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 text-sm">
                <InfoRow label="Phone" value={brand.phone || "-"} />
                <InfoRow label="Website" value={brand.website || "-"} />
                <InfoRow label="Address" value={brand.address || "-"} />
                <InfoRow label="Tone" value={brand.brandGuideline?.toneOfVoice || "-"} />
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-white/35">Brand colors</p>
                  <ColorRow colors={brand.brandGuideline?.brandColors || []} />
                </div>
              </div>
            </Panel>

            <Panel title={editingTemplateId ? "Edit template" : "Add template"} icon={editingTemplateId ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}>
              <div className="grid gap-3">
                <Field label="Name" value={templateForm.name} onChange={(value) => updateTemplate("name", value)} placeholder="June promo poster" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <LabeledSelect label="Type" value={templateForm.type} onChange={(value) => updateTemplate("type", value)} options={["POSTER", "CAROUSEL", "REEL", "STORY"]} />
                  <Field label="Size" value={templateForm.size} onChange={(value) => updateTemplate("size", value)} placeholder="1080x1080" />
                </div>
                <Field label="Category" value={templateForm.category} onChange={(value) => updateTemplate("category", value)} placeholder="promo, education" />
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">Upload file</span>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg,.pdf,.pptx,image/png,image/jpeg,image/svg+xml,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    onChange={(event) => setTemplateFile(event.target.files?.[0] ?? null)}
                    className="mt-2 w-full rounded-md border border-white/10 bg-black/45 px-3 py-2 text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-amber-300 file:px-3 file:py-2 file:text-sm file:font-bold file:text-black"
                  />
                  <span className="mt-2 block text-xs text-white/35">{templateFile ? templateFile.name : "PNG, JPG, SVG, PDF, PPTX"}</span>
                </label>
                <Field label="Preview image URL" value={templateForm.previewImageUrl} onChange={(value) => updateTemplate("previewImageUrl", value)} placeholder="https://..." />
                <Field label="Template file URL" value={templateForm.templateFileUrl} onChange={(value) => updateTemplate("templateFileUrl", value)} placeholder="Canva/Figma/file URL" />
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <button
                    onClick={editingTemplateId ? updateCurrentTemplate : addTemplate}
                    disabled={submittingTemplate || !templateForm.name.trim()}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-bold text-black transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submittingTemplate ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Layers3 className="h-4 w-4" />}
                    {editingTemplateId ? "Save changes" : "Add template"}
                  </button>
                  {editingTemplateId ? (
                    <button
                      onClick={cancelEditTemplate}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-bold text-white/70 transition hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  ) : null}
                </div>
              </div>
            </Panel>
          </aside>

          <section className="grid content-start gap-6">
            <Panel title="Templates" icon={<Image className="h-5 w-5" />}>
              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {templates.length === 0 ? (
                  <p className="text-sm text-white/50">No templates added.</p>
                ) : (
                  templates.map((template) => (
                    <article key={template.id} className="overflow-hidden rounded-lg border border-white/10 bg-black/25">
                      <div className="grid aspect-[1.18] place-items-center bg-white/[0.04]">
                        {template.previewImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={template.previewImageUrl} alt={template.name} className="h-full w-full object-cover" />
                        ) : (
                          <Image className="h-8 w-8 text-white/25" />
                        )}
                      </div>
                      <div className="p-4">
                        <p className="font-semibold">{template.name}</p>
                        <p className="mt-1 text-xs text-white/45">{template.type} · {template.size || "size not set"}</p>
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          <TemplateActionLink href={template.previewImageUrl || template.templateFileUrl} label="Preview" icon={<ExternalLink className="h-4 w-4" />} />
                          <button
                            onClick={() => startEditTemplate(template)}
                            className="inline-flex h-9 items-center justify-center rounded-md border border-white/10 text-white/65 transition hover:bg-white/10 hover:text-white"
                            title="Edit template"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteTemplate(template)}
                            className="inline-flex h-9 items-center justify-center rounded-md border border-red-400/20 text-red-200 transition hover:bg-red-400/10"
                            title="Delete template"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </Panel>

            <Panel title="Content queue" icon={<FileText className="h-5 w-5" />}>
              <div className="grid gap-3">
                {items.length === 0 ? (
                  <p className="text-sm text-white/50">No content items yet.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="rounded-md border border-white/10 bg-black/25 p-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="font-semibold">{item.title || item.headline || "Untitled content"}</p>
                          <p className="mt-1 text-xs text-white/45">
                            {item.contentType} · {item.status} {item.template?.name ? `· ${item.template.name}` : ""}
                          </p>
                        </div>
                        <span className="w-fit rounded-full bg-white/10 px-2 py-1 text-xs text-white/65">{item.category || "content"}</span>
                      </div>
                      {item.creativeDirection ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55">{item.creativeDirection}</p> : null}
                    </div>
                  ))
                )}
              </div>
            </Panel>
          </section>

          <aside className="grid content-start gap-6">
            <Panel title="Hermes chat" icon={<MessageSquareText className="h-5 w-5" />}>
              <div className="grid gap-4">
                <div className="rounded-md border border-amber-300/20 bg-amber-300/10 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-100">
                    <Sparkles className="h-4 w-4" />
                    Hermes will use this brand context
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {brand.companyName || "This brand"} · {brand.businessType || "business"} · {brand.brandGuideline?.toneOfVoice || "brand tone not set"}
                  </p>
                  <ColorRow colors={brand.brandGuideline?.brandColors || []} />
                </div>

                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  rows={7}
                  placeholder="Жишээ: Luna Brew-д зориулж 5 Facebook постын санаа, caption, image prompt-уудыг Монгол хэлээр гарга. Premium coffee subscription-ийн CTA оруул."
                  className="w-full rounded-md border border-white/10 bg-black/45 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-amber-300/70"
                />

                <div className="grid gap-3">
                  <Select value={contentType} onChange={setContentType} options={["POSTER", "CAROUSEL", "REEL", "STORY"]} />
                  <select
                    value={selectedTemplateId}
                    onChange={(event) => setSelectedTemplateId(event.target.value)}
                    className="h-11 rounded-md border border-white/10 bg-black/45 px-3 text-sm text-white outline-none transition focus:border-amber-300/70"
                  >
                    <option value="">No specific template</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={sendPrompt}
                    disabled={sendingPrompt || !prompt.trim()}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-amber-300 px-4 text-sm font-bold text-black transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sendingPrompt ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Send
                  </button>
                </div>
              </div>
            </Panel>

            <Panel title="Recent activity" icon={<Clock3 className="h-5 w-5" />}>
              <div className="grid gap-3">
                {logs.length === 0 ? (
                  <p className="text-sm text-white/50">No agent logs yet.</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="rounded-md border border-white/10 bg-black/25 p-3">
                      <p className="text-sm font-semibold">{log.action}</p>
                      <p className="mt-1 text-xs text-white/45">{log.message || log.status}</p>
                    </div>
                  ))
                )}
              </div>
            </Panel>
          </aside>
        </div>
      </main>
    </PostlyAdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3">
      <p className="text-xs uppercase tracking-[0.12em] text-white/45">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex items-center gap-2 text-amber-200">
        {icon}
        <h2 className="text-sm font-bold uppercase tracking-[0.14em]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <p className="text-xs uppercase tracking-[0.12em] text-white/35">{label}</p>
      <p className="text-white/70">{value}</p>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-md border border-white/10 bg-black/45 px-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-amber-300/70"
      />
    </label>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 rounded-md border border-white/10 bg-black/45 px-3 text-sm text-white outline-none transition focus:border-amber-300/70"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function LabeledSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">{label}</span>
      <div className="mt-2">
        <Select value={value} onChange={onChange} options={options} />
      </div>
    </label>
  );
}

function TemplateActionLink({ href, label, icon }: { href?: string | null; label: string; icon: ReactNode }) {
  if (!href) {
    return (
      <span className="inline-flex h-9 items-center justify-center rounded-md border border-white/10 text-white/25" title={`${label} unavailable`}>
        {icon}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 items-center justify-center rounded-md border border-white/10 text-white/65 transition hover:bg-white/10 hover:text-white"
      title={label}
    >
      {icon}
    </a>
  );
}

function ColorRow({ colors }: { colors: string[] }) {
  if (colors.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {colors.map((color) => (
        <span key={color} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-2 py-1 text-xs text-white/60">
          <span className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: color }} />
          {color}
        </span>
      ))}
    </div>
  );
}
