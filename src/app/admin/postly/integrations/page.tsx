"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, LoaderCircle, PlugZap, Save, ShieldAlert } from "lucide-react";

type SocialAccount = {
  platform: "FACEBOOK" | "INSTAGRAM";
  pageName?: string | null;
  pageId?: string | null;
  instagramAccountId?: string | null;
  accessTokenEncrypted?: string | null;
  status?: string | null;
};

type Company = {
  id: string;
  companyName?: string | null;
  email?: string | null;
  makeIntegration?: {
    webhookUrl?: string | null;
    webhookSecretHint?: string | null;
    scenarioName?: string | null;
    status?: string | null;
  } | null;
  socialAccounts: SocialAccount[];
};

type FormState = {
  companyId: string;
  makeWebhookUrl: string;
  makeWebhookSecretHint: string;
  makeScenarioName: string;
  makeStatus: string;
  facebookPageName: string;
  facebookPageId: string;
  facebookStatus: string;
  instagramPageName: string;
  instagramPageId: string;
  instagramAccountId: string;
  instagramStatus: string;
};

const emptyForm: FormState = {
  companyId: "",
  makeWebhookUrl: "",
  makeWebhookSecretHint: "",
  makeScenarioName: "",
  makeStatus: "active",
  facebookPageName: "",
  facebookPageId: "",
  facebookStatus: "CONNECTED",
  instagramPageName: "",
  instagramPageId: "",
  instagramAccountId: "",
  instagramStatus: "CONNECTED",
};

function account(accounts: SocialAccount[], platform: SocialAccount["platform"]) {
  return accounts.find((item) => item.platform === platform);
}

function formFromCompany(company: Company): FormState {
  const facebook = account(company.socialAccounts, "FACEBOOK");
  const instagram = account(company.socialAccounts, "INSTAGRAM");

  return {
    companyId: company.id,
    makeWebhookUrl: company.makeIntegration?.webhookUrl ?? "",
    makeWebhookSecretHint: company.makeIntegration?.webhookSecretHint ?? "",
    makeScenarioName: company.makeIntegration?.scenarioName ?? "",
    makeStatus: company.makeIntegration?.status ?? "active",
    facebookPageName: facebook?.pageName ?? "",
    facebookPageId: facebook?.pageId ?? "",
    facebookStatus: facebook?.status ?? "CONNECTED",
    instagramPageName: instagram?.pageName ?? "",
    instagramPageId: instagram?.pageId ?? "",
    instagramAccountId: instagram?.instagramAccountId ?? "",
    instagramStatus: instagram?.status ?? "CONNECTED",
  };
}

export default function PostlyIntegrationsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const selectedCompany = useMemo(() => companies.find((company) => company.id === form.companyId), [companies, form.companyId]);

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/postly/integrations")
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to load integrations");
        return response.json();
      })
      .then((data) => {
        if (!mounted) return;
        const loaded = Array.isArray(data.companies) ? data.companies : [];
        setCompanies(loaded);
        if (loaded[0]) setForm(formFromCompany(loaded[0]));
      })
      .catch((error) => {
        if (mounted) setMessage(error instanceof Error ? error.message : "Failed to load integrations");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/postly/integrations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: form.companyId,
          make: {
            webhookUrl: form.makeWebhookUrl,
            webhookSecretHint: form.makeWebhookSecretHint,
            scenarioName: form.makeScenarioName,
            status: form.makeStatus,
          },
          facebook: {
            pageName: form.facebookPageName,
            pageId: form.facebookPageId,
            status: form.facebookStatus,
          },
          instagram: {
            pageName: form.instagramPageName,
            pageId: form.instagramPageId,
            instagramAccountId: form.instagramAccountId,
            status: form.instagramStatus,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }

      setMessage("Saved");
      const refreshed = await fetch("/api/admin/postly/integrations").then((response) => response.json());
      const loaded = Array.isArray(refreshed.companies) ? refreshed.companies : [];
      setCompanies(loaded);
      const nextCompany = loaded.find((company: Company) => company.id === form.companyId);
      if (nextCompany) setForm(formFromCompany(nextCompany));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 text-white">
      <main className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">Postly Admin</p>
            <h1 className="text-4xl font-black sm:text-5xl">Integrations</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">
              Configure Make.com handoff and social publishing IDs per company.
            </p>
          </div>
          <Link href="/admin" className="text-sm text-amber-300 hover:text-amber-200">
            Back to admin
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 flex items-center gap-3 text-white/60">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Loading integrations
          </div>
        ) : companies.length === 0 ? (
          <div className="mt-10 rounded-lg border border-amber-400/30 bg-amber-400/10 p-5 text-sm text-amber-100">
            No companies found. Seed or create a company profile first.
          </div>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <section className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/70">
                <PlugZap className="h-4 w-4 text-amber-300" />
                Company
              </div>
              <div className="space-y-2">
                {companies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => setForm(formFromCompany(company))}
                    className={`w-full rounded-md border px-3 py-3 text-left transition ${
                      company.id === form.companyId ? "border-amber-300 bg-amber-300/10" : "border-white/10 bg-black/25 hover:border-white/25"
                    }`}
                  >
                    <p className="font-semibold">{company.companyName || "Unnamed company"}</p>
                    <p className="mt-1 text-xs text-white/45">{company.email || company.id}</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{selectedCompany?.companyName || "Selected company"}</h2>
                  <p className="mt-1 text-sm text-white/50">{selectedCompany?.email || form.companyId}</p>
                </div>
                <button
                  onClick={save}
                  disabled={saving || !form.companyId}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-amber-300 px-4 text-sm font-bold text-black transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save
                </button>
              </div>

              {message ? (
                <div className="mt-5 flex items-center gap-2 rounded-md border border-white/10 bg-black/25 p-3 text-sm text-white/70">
                  {message === "Saved" ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <ShieldAlert className="h-4 w-4 text-red-300" />}
                  {message}
                </div>
              ) : null}

              <div className="mt-6 grid gap-5">
                <Panel title="Make.com">
                  <Field label="Webhook URL" value={form.makeWebhookUrl} onChange={(value) => update("makeWebhookUrl", value)} placeholder="https://hook.eu2.make.com/..." />
                  <Field label="Scenario name" value={form.makeScenarioName} onChange={(value) => update("makeScenarioName", value)} placeholder="Postly media generation + posting" />
                  <Field label="Secret hint" value={form.makeWebhookSecretHint} onChange={(value) => update("makeWebhookSecretHint", value)} placeholder="Do not paste full secret here" />
                  <Select label="Status" value={form.makeStatus} onChange={(value) => update("makeStatus", value)} options={["active", "inactive"]} />
                </Panel>

                <Panel title="Facebook">
                  <Field label="Page name" value={form.facebookPageName} onChange={(value) => update("facebookPageName", value)} placeholder="Facebook page" />
                  <Field label="Page ID" value={form.facebookPageId} onChange={(value) => update("facebookPageId", value)} placeholder="1234567890" />
                  <Select label="Status" value={form.facebookStatus} onChange={(value) => update("facebookStatus", value)} options={["CONNECTED", "EXPIRED", "DISCONNECTED"]} />
                </Panel>

                <Panel title="Instagram">
                  <Field label="Page name" value={form.instagramPageName} onChange={(value) => update("instagramPageName", value)} placeholder="Instagram account" />
                  <Field label="Page ID" value={form.instagramPageId} onChange={(value) => update("instagramPageId", value)} placeholder="Connected Facebook page ID" />
                  <Field label="Instagram account ID" value={form.instagramAccountId} onChange={(value) => update("instagramAccountId", value)} placeholder="1784..." />
                  <Select label="Status" value={form.instagramStatus} onChange={(value) => update("instagramStatus", value)} options={["CONNECTED", "EXPIRED", "DISCONNECTED"]} />
                </Panel>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/25 p-4">
      <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-amber-200">{title}</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
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

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-md border border-white/10 bg-black/45 px-3 text-sm text-white outline-none transition focus:border-amber-300/70"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
