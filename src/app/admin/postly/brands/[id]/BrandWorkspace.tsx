"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
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
  Store,
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
  platform: string;
  category: string;
  size: string;
  previewImageUrl: string;
  templateFileUrl: string;
};

type ProductForm = {
  name: string;
  description: string;
  price: string;
  targetCustomer: string;
  benefits: string;
  painPoints: string;
};

type StorageStatus = {
  bucket: string;
  ready: boolean;
  hasSupabaseUrl: boolean;
  hasServiceRoleKey: boolean;
};

const emptyTemplate: TemplateForm = {
  name: "",
  type: "POSTER",
  platform: "",
  category: "",
  size: "1080x1080",
  previewImageUrl: "",
  templateFileUrl: "",
};

const emptyProduct: ProductForm = {
  name: "",
  description: "",
  price: "",
  targetCustomer: "",
  benefits: "",
  painPoints: "",
};

const copy = {
  en: {
    back: "Back to brands",
    unnamed: "Unnamed brand",
    active: "Active",
    fallbackDescription: "Manage profile, templates, content, and Hermes chat for this brand.",
    stats: { templates: "Templates", queued: "Queued", drafts: "Drafts" },
    tabs: ["Brand Profile", "Brand Voice", "Products / Services", "Templates", "Hermes Knowledge", "Content Plan"],
    brandInformation: "Brand information",
    productsServices: "Products / Services",
    addProduct: "Add product/service",
    editProduct: "Edit product/service",
    productName: "Product/service name",
    productDescription: "Description",
    price: "Price",
    targetCustomer: "Target customer",
    benefits: "Benefits",
    painPoints: "Pain points",
    noProducts: "No products or services added.",
    productAdded: "Product/service added",
    productUpdated: "Product/service updated",
    productDeleted: "Product/service deleted",
    productSaveFailed: "Product/service save failed",
    productDeleteFailed: "Product/service delete failed",
    deleteProductConfirm: (name: string) => `Delete ${name}?`,
    phone: "Phone",
    website: "Website",
    address: "Address",
    tone: "Tone",
    brandColors: "Brand colors",
    editTemplate: "Edit template",
    addTemplate: "Add template",
    name: "Name",
    type: "Type",
    platform: "Platform",
    size: "Size",
    category: "Category",
    uploadFile: "Upload file",
    storageReady: (bucket: string) => `Supabase Storage ready: ${bucket}`,
    storageMissing: "File upload is waiting for SUPABASE_SERVICE_ROLE_KEY. Save a template URL for now.",
    storageCheckFailed: "Storage status check failed",
    previewUrl: "Preview image URL",
    fileUrl: "Template file URL",
    saveChanges: "Save changes",
    cancel: "Cancel",
    noTemplates: "No templates added.",
    contentQueue: "Content queue",
    noContent: "No content items yet.",
    untitled: "Untitled content",
    content: "content",
    hermesChat: "Hermes chat",
    hermesContext: "Hermes will use this brand context",
    business: "business",
    toneMissing: "brand tone not set",
    promptPlaceholder: "Example: Create 5 Facebook post ideas for Luna Brew in Mongolian with captions and image prompts. Include a premium coffee subscription CTA.",
    noSpecificTemplate: "No specific template",
    send: "Send",
    recentActivity: "Recent activity",
    noLogs: "No agent logs yet.",
    templateAdded: "Template added",
    templateUpdated: "Template updated",
    templateDeleted: "Template deleted",
    templateSaveFailed: "Template save failed",
    templateUpdateFailed: "Template update failed",
    templateDeleteFailed: "Template delete failed",
    deleteTemplateConfirm: (name: string) => `Delete ${name}?`,
    promptRequiredFailed: "Prompt send failed",
    promptSent: "Prompt sent to Hermes",
    promptQueued: "Prompt queued for Hermes cron",
    preview: "Preview",
    edit: "Edit template",
    delete: "Delete template",
    unavailable: "unavailable",
  },
  mn: {
    back: "Брэндүүд рүү буцах",
    unnamed: "Нэргүй брэнд",
    active: "Идэвхтэй",
    fallbackDescription: "Энэ брэндийн profile, template, content, Hermes chat-ийг удирдана.",
    stats: { templates: "Темплейт", queued: "Queue", drafts: "Draft" },
    tabs: ["Брэнд profile", "Брэнд voice", "Бүтээгдэхүүн / Үйлчилгээ", "Темплейт", "Hermes knowledge", "Контент plan"],
    brandInformation: "Брэнд мэдээлэл",
    productsServices: "Бүтээгдэхүүн / Үйлчилгээ",
    addProduct: "Бүтээгдэхүүн нэмэх",
    editProduct: "Бүтээгдэхүүн засах",
    productName: "Бүтээгдэхүүн/үйлчилгээний нэр",
    productDescription: "Тайлбар",
    price: "Үнэ",
    targetCustomer: "Зорилтот хэрэглэгч",
    benefits: "Давуу талууд",
    painPoints: "Асуудлууд",
    noProducts: "Бүтээгдэхүүн, үйлчилгээ одоогоор алга.",
    productAdded: "Бүтээгдэхүүн нэмэгдлээ",
    productUpdated: "Бүтээгдэхүүн шинэчлэгдлээ",
    productDeleted: "Бүтээгдэхүүн устлаа",
    productSaveFailed: "Бүтээгдэхүүн хадгалахад алдаа гарлаа",
    productDeleteFailed: "Бүтээгдэхүүн устгахад алдаа гарлаа",
    deleteProductConfirm: (name: string) => `${name}-г устгах уу?`,
    phone: "Утас",
    website: "Website",
    address: "Хаяг",
    tone: "Tone",
    brandColors: "Брэнд өнгө",
    editTemplate: "Темплейт засах",
    addTemplate: "Темплейт нэмэх",
    name: "Нэр",
    type: "Төрөл",
    platform: "Платформ",
    size: "Хэмжээ",
    category: "Ангилал",
    uploadFile: "Файл upload хийх",
    previewUrl: "Preview image URL",
    fileUrl: "Template file URL",
    saveChanges: "Өөрчлөлт хадгалах",
    cancel: "Болих",
    noTemplates: "Темплейт одоогоор алга.",
    contentQueue: "Контент queue",
    noContent: "Контент item одоогоор алга.",
    untitled: "Гарчиггүй контент",
    content: "контент",
    hermesChat: "Hermes чат",
    hermesContext: "Hermes энэ брэндийн context-ийг ашиглана",
    business: "бизнес",
    toneMissing: "брэндийн tone тохируулаагүй",
    promptPlaceholder: "Жишээ: Luna Brew-д зориулж Facebook-ийн 5 постын санаа, caption, image prompt-уудыг Монгол хэлээр гарга. Premium coffee subscription CTA оруул.",
    noSpecificTemplate: "Тодорхой template сонгоогүй",
    send: "Илгээх",
    recentActivity: "Сүүлийн activity",
    noLogs: "Agent log одоогоор алга.",
    templateAdded: "Темплейт нэмэгдлээ",
    templateUpdated: "Темплейт шинэчлэгдлээ",
    templateDeleted: "Темплейт устлаа",
    templateSaveFailed: "Темплейт хадгалахад алдаа гарлаа",
    templateUpdateFailed: "Темплейт шинэчлэхэд алдаа гарлаа",
    templateDeleteFailed: "Темплейт устгахад алдаа гарлаа",
    deleteTemplateConfirm: (name: string) => `${name} темплейтийг устгах уу?`,
    promptRequiredFailed: "Prompt илгээхэд алдаа гарлаа",
    promptSent: "Prompt Hermes рүү илгээгдлээ",
    promptQueued: "Prompt Hermes cron queue-д орлоо",
    preview: "Preview",
    edit: "Темплейт засах",
    delete: "Темплейт устгах",
    unavailable: "боломжгүй",
  },
};

export default function BrandWorkspace({ brand, lang = "en" }: { brand: Brand; lang?: "en" | "mn" }) {
  const [templates, setTemplates] = useState<Template[]>(brand.brandTemplates);
  const [products, setProducts] = useState<ProductService[]>(brand.productsServicesPostly);
  const [items, setItems] = useState<Item[]>(brand.contentItems);
  const [logs, setLogs] = useState<AgentLog[]>(brand.agentLogs);
  const [templateForm, setTemplateForm] = useState<TemplateForm>(emptyTemplate);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [editingTemplateId, setEditingTemplateId] = useState("");
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);
  const [editingProductId, setEditingProductId] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("POSTER");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [submittingTemplate, setSubmittingTemplate] = useState(false);
  const [sendingPrompt, setSendingPrompt] = useState(false);
  const [storageStatus, setStorageStatus] = useState<StorageStatus | null>(null);
  const [message, setMessage] = useState("");
  const c = copy[lang];
  const storageText = lang === "mn"
    ? {
        ready: (bucket: string) => `Supabase Storage бэлэн: ${bucket}`,
        missing: "File upload-д SUPABASE_SERVICE_ROLE_KEY дутуу байна. Одоогоор template URL хадгалж болно.",
      }
    : {
        ready: (bucket: string) => `Supabase Storage ready: ${bucket}`,
        missing: "File upload is waiting for SUPABASE_SERVICE_ROLE_KEY. Save a template URL for now.",
      };

  const plannedCount = useMemo(() => items.filter((item) => item.status === "PLANNED").length, [items]);
  const draftCount = useMemo(() => items.filter((item) => item.status === "DRAFT_GENERATED" || item.status === "WAITING_APPROVAL").length, [items]);

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/postly/storage")
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Storage status check failed");
        return data.storage as StorageStatus;
      })
      .then((status) => {
        if (!mounted) return;
        setStorageStatus(status);
        if (!status.ready) setTemplateFile(null);
      })
      .catch(() => {
        if (mounted) setStorageStatus(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  function updateTemplate<K extends keyof TemplateForm>(key: K, value: TemplateForm[K]) {
    setTemplateForm((current) => ({ ...current, [key]: value }));
  }

  function updateProduct<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setProductForm((current) => ({ ...current, [key]: value }));
  }

  function productPayload() {
    return {
      name: productForm.name,
      description: productForm.description,
      price: productForm.price,
      targetCustomer: productForm.targetCustomer,
      benefits: productForm.benefits,
      painPoints: productForm.painPoints,
    };
  }

  function startEditProduct(product: ProductService) {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price || "",
      targetCustomer: product.targetCustomer || "",
      benefits: product.benefits.join("\n"),
      painPoints: product.painPoints.join("\n"),
    });
    setMessage("");
  }

  function cancelEditProduct() {
    setEditingProductId("");
    setProductForm(emptyProduct);
    setMessage("");
  }

  async function saveProduct() {
    setSavingProduct(true);
    setMessage("");
    try {
      const response = await fetch(
        editingProductId ? `/api/admin/postly/brands/${brand.id}/products/${editingProductId}` : `/api/admin/postly/brands/${brand.id}/products`,
        {
          method: editingProductId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayload()),
        }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || c.productSaveFailed);
      setProducts((current) => editingProductId
        ? current.map((product) => (product.id === data.product.id ? data.product : product))
        : [data.product, ...current]);
      setProductForm(emptyProduct);
      setEditingProductId("");
      setMessage(editingProductId ? c.productUpdated : c.productAdded);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : c.productSaveFailed);
    } finally {
      setSavingProduct(false);
    }
  }

  async function deleteProduct(product: ProductService) {
    if (!confirm(c.deleteProductConfirm(product.name))) return;
    setMessage("");
    try {
      const response = await fetch(`/api/admin/postly/brands/${brand.id}/products/${product.id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || c.productDeleteFailed);
      setProducts((current) => current.filter((item) => item.id !== product.id));
      if (editingProductId === product.id) cancelEditProduct();
      setMessage(c.productDeleted);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : c.productDeleteFailed);
    }
  }

  async function addTemplate() {
    setSubmittingTemplate(true);
    setMessage("");
    try {
      if (templateFile && storageStatus?.ready === false) {
        throw new Error(storageText.missing);
      }

      const body = new FormData();
      body.append("name", templateForm.name);
      body.append("type", templateForm.type);
      body.append("platform", templateForm.platform);
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
      if (!response.ok) throw new Error(data.error || c.templateSaveFailed);
      setTemplates((current) => [data.template, ...current]);
      setTemplateForm(emptyTemplate);
      setTemplateFile(null);
      setEditingTemplateId("");
      setMessage(c.templateAdded);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : c.templateSaveFailed);
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
      platform: template.platform || "",
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
      if (templateFile && storageStatus?.ready === false) {
        throw new Error(storageText.missing);
      }

      const body = new FormData();
      body.append("name", templateForm.name);
      body.append("type", templateForm.type);
      body.append("platform", templateForm.platform);
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
      if (!response.ok) throw new Error(data.error || c.templateUpdateFailed);
      setTemplates((current) => current.map((template) => (template.id === data.template.id ? data.template : template)));
      setTemplateForm(emptyTemplate);
      setTemplateFile(null);
      setEditingTemplateId("");
      setMessage(c.templateUpdated);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : c.templateUpdateFailed);
    } finally {
      setSubmittingTemplate(false);
    }
  }

  async function deleteTemplate(template: Template) {
    if (!confirm(c.deleteTemplateConfirm(template.name))) return;
    setMessage("");
    try {
      const response = await fetch(`/api/admin/postly/brands/${brand.id}/templates/${template.id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || c.templateDeleteFailed);
      setTemplates((current) => current.filter((item) => item.id !== template.id));
      if (selectedTemplateId === template.id) setSelectedTemplateId("");
      if (editingTemplateId === template.id) cancelEditTemplate();
      setMessage(c.templateDeleted);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : c.templateDeleteFailed);
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
      if (!response.ok) throw new Error(data.error || c.promptRequiredFailed);
      setItems((current) => [data.item, ...current]);
      if (data.log) setLogs((current) => [data.log, ...current].slice(0, 10));
      setPrompt("");
      setMessage(data.hermesTriggered ? c.promptSent : c.promptQueued);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : c.promptRequiredFailed);
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
              {c.back}
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black sm:text-4xl">{brand.companyName || c.unnamed}</h1>
              <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-xs font-semibold text-emerald-300">{c.active}</span>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">{brand.businessType || brand.description || c.fallbackDescription}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center md:min-w-[330px]">
            <Stat label={c.stats.templates} value={templates.length} />
            <Stat label={c.stats.queued} value={plannedCount} />
            <Stat label={c.stats.drafts} value={draftCount} />
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
            {c.tabs.map((tab, index) => (
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
            <Panel title={c.brandInformation} icon={<Sparkles className="h-5 w-5" />}>
              <div className="flex items-center gap-4">
                <div className="grid h-20 w-20 place-items-center rounded-full border border-white/10 bg-black text-2xl font-black text-amber-200">
                  {(brand.companyName || "P").slice(0, 1)}
                </div>
                <div>
                  <p className="font-semibold">{brand.companyName || c.unnamed}</p>
                  <p className="mt-1 text-sm text-white/45">{brand.email || brand.id}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 text-sm">
                <InfoRow label={c.phone} value={brand.phone || "-"} />
                <InfoRow label={c.website} value={brand.website || "-"} />
                <InfoRow label={c.address} value={brand.address || "-"} />
                <InfoRow label={c.tone} value={brand.brandGuideline?.toneOfVoice || "-"} />
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-white/35">{c.brandColors}</p>
                  <ColorRow colors={brand.brandGuideline?.brandColors || []} />
                </div>
              </div>
            </Panel>

            <Panel title={c.productsServices} icon={<Store className="h-5 w-5" />}>
              <div className="grid gap-3">
                <Field label={c.productName} value={productForm.name} onChange={(value) => updateProduct("name", value)} placeholder="Coffee subscription" />
                <Field label={c.productDescription} value={productForm.description} onChange={(value) => updateProduct("description", value)} placeholder="Short product summary" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label={c.price} value={productForm.price} onChange={(value) => updateProduct("price", value)} placeholder="49,000 MNT" />
                  <Field label={c.targetCustomer} value={productForm.targetCustomer} onChange={(value) => updateProduct("targetCustomer", value)} placeholder="Busy coffee lovers" />
                </div>
                <Field label={c.benefits} value={productForm.benefits} onChange={(value) => updateProduct("benefits", value)} placeholder="One benefit per line" multiline />
                <Field label={c.painPoints} value={productForm.painPoints} onChange={(value) => updateProduct("painPoints", value)} placeholder="One pain point per line" multiline />
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <button
                    onClick={saveProduct}
                    disabled={savingProduct || !productForm.name.trim()}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-bold text-black transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingProduct ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    {editingProductId ? c.saveChanges : c.addProduct}
                  </button>
                  {editingProductId ? (
                    <button onClick={cancelEditProduct} className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-bold text-white/70 transition hover:bg-white/10">
                      <X className="h-4 w-4" />
                      {c.cancel}
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {products.length === 0 ? (
                  <p className="text-sm text-white/50">{c.noProducts}</p>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="rounded-md border border-white/10 bg-black/25 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="mt-1 text-xs text-white/45">{[product.price, product.targetCustomer].filter(Boolean).join(" · ") || product.status}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => startEditProduct(product)} className="grid h-8 w-8 place-items-center rounded-md border border-white/10 text-white/60 hover:bg-white/10" title={c.editProduct}>
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteProduct(product)} className="grid h-8 w-8 place-items-center rounded-md border border-red-400/20 text-red-200 hover:bg-red-400/10" title={c.deleteProductConfirm(product.name)}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {product.description ? <p className="mt-2 text-sm leading-5 text-white/55">{product.description}</p> : null}
                    </div>
                  ))
                )}
              </div>
            </Panel>

            <Panel title={editingTemplateId ? c.editTemplate : c.addTemplate} icon={editingTemplateId ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}>
              <div className="grid gap-3">
                <Field label={c.name} value={templateForm.name} onChange={(value) => updateTemplate("name", value)} placeholder="June promo poster" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <LabeledSelect label={c.type} value={templateForm.type} onChange={(value) => updateTemplate("type", value)} options={["POSTER", "CAROUSEL", "REEL", "STORY"]} />
                  <LabeledSelect label={c.platform} value={templateForm.platform} onChange={(value) => updateTemplate("platform", value)} options={["", "FACEBOOK", "INSTAGRAM"]} />
                </div>
                <Field label={c.size} value={templateForm.size} onChange={(value) => updateTemplate("size", value)} placeholder="1080x1080" />
                <Field label={c.category} value={templateForm.category} onChange={(value) => updateTemplate("category", value)} placeholder="promo, education" />
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">{c.uploadFile}</span>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg,.pdf,.pptx,image/png,image/jpeg,image/svg+xml,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    disabled={storageStatus?.ready === false}
                    onChange={(event) => setTemplateFile(event.target.files?.[0] ?? null)}
                    className="mt-2 w-full rounded-md border border-white/10 bg-black/45 px-3 py-2 text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-amber-300 file:px-3 file:py-2 file:text-sm file:font-bold file:text-black disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <span className="mt-2 block text-xs text-white/35">{templateFile ? templateFile.name : "PNG, JPG, SVG, PDF, PPTX"}</span>
                  {storageStatus ? (
                    <span className={`mt-2 flex items-center gap-2 text-xs ${storageStatus.ready ? "text-emerald-300" : "text-amber-200"}`}>
                      {storageStatus.ready ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                      {storageStatus.ready ? storageText.ready(storageStatus.bucket) : storageText.missing}
                    </span>
                  ) : null}
                </label>
                <Field label={c.previewUrl} value={templateForm.previewImageUrl} onChange={(value) => updateTemplate("previewImageUrl", value)} placeholder="https://..." />
                <Field label={c.fileUrl} value={templateForm.templateFileUrl} onChange={(value) => updateTemplate("templateFileUrl", value)} placeholder="Canva/Figma/file URL" />
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <button
                    onClick={editingTemplateId ? updateCurrentTemplate : addTemplate}
                    disabled={submittingTemplate || !templateForm.name.trim()}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-bold text-black transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submittingTemplate ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Layers3 className="h-4 w-4" />}
                    {editingTemplateId ? c.saveChanges : c.addTemplate}
                  </button>
                  {editingTemplateId ? (
                    <button
                      onClick={cancelEditTemplate}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-bold text-white/70 transition hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                      {c.cancel}
                    </button>
                  ) : null}
                </div>
              </div>
            </Panel>
          </aside>

          <section className="grid content-start gap-6">
            <Panel title={c.stats.templates} icon={<Image className="h-5 w-5" />}>
              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {templates.length === 0 ? (
                  <p className="text-sm text-white/50">{c.noTemplates}</p>
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
                        <p className="mt-1 text-xs text-white/45">
                          {[template.type, template.platform, template.size || "size not set"].filter(Boolean).join(" · ")}
                        </p>
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          <TemplateActionLink href={template.previewImageUrl || template.templateFileUrl} label={c.preview} unavailable={c.unavailable} icon={<ExternalLink className="h-4 w-4" />} />
                          <button
                            onClick={() => startEditTemplate(template)}
                            className="inline-flex h-9 items-center justify-center rounded-md border border-white/10 text-white/65 transition hover:bg-white/10 hover:text-white"
                            title={c.edit}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteTemplate(template)}
                            className="inline-flex h-9 items-center justify-center rounded-md border border-red-400/20 text-red-200 transition hover:bg-red-400/10"
                            title={c.delete}
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

            <Panel title={c.contentQueue} icon={<FileText className="h-5 w-5" />}>
              <div className="grid gap-3">
                {items.length === 0 ? (
                  <p className="text-sm text-white/50">{c.noContent}</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="rounded-md border border-white/10 bg-black/25 p-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="font-semibold">{item.title || item.headline || c.untitled}</p>
                          <p className="mt-1 text-xs text-white/45">
                            {item.contentType} · {item.status} {item.template?.name ? `· ${item.template.name}` : ""}
                          </p>
                        </div>
                        <span className="w-fit rounded-full bg-white/10 px-2 py-1 text-xs text-white/65">{item.category || c.content}</span>
                      </div>
                      {item.creativeDirection ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55">{item.creativeDirection}</p> : null}
                    </div>
                  ))
                )}
              </div>
            </Panel>
          </section>

          <aside className="grid content-start gap-6">
            <Panel title={c.hermesChat} icon={<MessageSquareText className="h-5 w-5" />}>
              <div className="grid gap-4">
                <div className="rounded-md border border-amber-300/20 bg-amber-300/10 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-100">
                    <Sparkles className="h-4 w-4" />
                    {c.hermesContext}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {brand.companyName || c.unnamed} · {brand.businessType || c.business} · {brand.brandGuideline?.toneOfVoice || c.toneMissing}
                  </p>
                  <ColorRow colors={brand.brandGuideline?.brandColors || []} />
                </div>

                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  rows={7}
                  placeholder={c.promptPlaceholder}
                  className="w-full rounded-md border border-white/10 bg-black/45 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-amber-300/70"
                />

                <div className="grid gap-3">
                  <Select value={contentType} onChange={setContentType} options={["POSTER", "CAROUSEL", "REEL", "STORY"]} />
                  <select
                    value={selectedTemplateId}
                    onChange={(event) => setSelectedTemplateId(event.target.value)}
                    className="h-11 rounded-md border border-white/10 bg-black/45 px-3 text-sm text-white outline-none transition focus:border-amber-300/70"
                  >
                    <option value="">{c.noSpecificTemplate}</option>
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
                    {c.send}
                  </button>
                </div>
              </div>
            </Panel>

            <Panel title={c.recentActivity} icon={<Clock3 className="h-5 w-5" />}>
              <div className="grid gap-3">
                {logs.length === 0 ? (
                  <p className="text-sm text-white/50">{c.noLogs}</p>
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
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={3}
          className="mt-2 w-full rounded-md border border-white/10 bg-black/45 px-3 py-3 text-sm leading-5 text-white outline-none transition placeholder:text-white/25 focus:border-amber-300/70"
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

function TemplateActionLink({ href, label, unavailable, icon }: { href?: string | null; label: string; unavailable: string; icon: ReactNode }) {
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
