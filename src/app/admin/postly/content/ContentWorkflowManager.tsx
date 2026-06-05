"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, LoaderCircle, Send, XCircle } from "lucide-react";

type Locale = "en" | "mn";
type Mode = "approval" | "calendar" | "logs";

type WorkflowItem = {
  id: string;
  companyId: string;
  contentType: string;
  category: string | null;
  title: string | null;
  caption: string | null;
  headline: string | null;
  imagePrompt: string | null;
  creativeDirection: string | null;
  scheduledAt: string | null;
  status: string;
  facebookPostUrl: string | null;
  instagramPostUrl: string | null;
  createdAt: string;
  updatedAt: string;
  company: { companyName: string | null; businessType: string | null };
  template: { name: string } | null;
  approvalRequests: { id: string; status: string; revisionNote: string | null; createdAt: string }[];
  postingLogs: { id: string; platform: string | null; status: string; postedUrl: string | null; createdAt: string }[];
};

type Copy = {
  title: string;
  subtitle: string;
  empty: string;
  save: string;
  approve: string;
  reject: string;
  publish: string;
  scheduled: string;
  status: string;
  brand: string;
  success: string;
};

const copy: Record<Locale, Record<Mode, Copy>> = {
  en: {
    approval: {
      title: "Approval",
      subtitle: "Review Hermes drafts, approve ready content, or send items back with revision notes.",
      empty: "No content is waiting for approval.",
      save: "Save edit",
      approve: "Approve",
      reject: "Reject",
      publish: "Mark published",
      scheduled: "Schedule",
      status: "Status",
      brand: "Brand",
      success: "Content updated",
    },
    calendar: {
      title: "Content Calendar",
      subtitle: "Plan and reschedule brand content from one real Supabase queue.",
      empty: "No planned or scheduled content yet.",
      save: "Save schedule",
      approve: "Approve",
      reject: "Reject",
      publish: "Mark published",
      scheduled: "Schedule",
      status: "Status",
      brand: "Brand",
      success: "Calendar updated",
    },
    logs: {
      title: "Published Logs",
      subtitle: "Inspect published content and posting records saved from Postly and Make.com callbacks.",
      empty: "No published logs yet.",
      save: "Save",
      approve: "Approve",
      reject: "Reject",
      publish: "Mark published",
      scheduled: "Schedule",
      status: "Status",
      brand: "Brand",
      success: "Log updated",
    },
  },
  mn: {
    approval: {
      title: "Зөвшөөрөл",
      subtitle: "Hermes-ийн draft контентыг шалгаад батлах, эсвэл засварт буцаах хэсэг.",
      empty: "Зөвшөөрөл хүлээж буй контент алга.",
      save: "Засварыг хадгалах",
      approve: "Батлах",
      reject: "Татгалзах",
      publish: "Нийтэлсэн болгох",
      scheduled: "Хуваарь",
      status: "Төлөв",
      brand: "Брэнд",
      success: "Контент шинэчлэгдлээ",
    },
    calendar: {
      title: "Контент календарь",
      subtitle: "Брэндүүдийн төлөвлөгөө, батлагдсан контентыг Supabase queue-ээс удирдана.",
      empty: "Төлөвлөгдсөн контент одоогоор алга.",
      save: "Хуваарь хадгалах",
      approve: "Батлах",
      reject: "Татгалзах",
      publish: "Нийтэлсэн болгох",
      scheduled: "Хуваарь",
      status: "Төлөв",
      brand: "Брэнд",
      success: "Календарь шинэчлэгдлээ",
    },
    logs: {
      title: "Нийтэлсэн лог",
      subtitle: "Postly болон Make.com callback-оос хадгалагдсан нийтлэлүүдийн түүх.",
      empty: "Нийтэлсэн лог одоогоор алга.",
      save: "Хадгалах",
      approve: "Батлах",
      reject: "Татгалзах",
      publish: "Нийтэлсэн болгох",
      scheduled: "Хуваарь",
      status: "Төлөв",
      brand: "Брэнд",
      success: "Лог шинэчлэгдлээ",
    },
  },
};

const statuses = ["PLANNED", "DRAFT_GENERATED", "WAITING_APPROVAL", "APPROVED", "REJECTED", "NEEDS_REVISION", "SCHEDULED", "POSTED", "FAILED"];

const statusLabels: Record<Locale, Record<string, string>> = {
  en: {
    PLANNED: "Planned",
    DRAFT_GENERATED: "Draft",
    WAITING_APPROVAL: "Pending approval",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    NEEDS_REVISION: "Needs revision",
    SCHEDULED: "Scheduled",
    POSTED: "Published",
    FAILED: "Failed",
  },
  mn: {
    PLANNED: "Төлөвлөсөн",
    DRAFT_GENERATED: "Draft",
    WAITING_APPROVAL: "Зөвшөөрөл хүлээж буй",
    APPROVED: "Батлагдсан",
    REJECTED: "Татгалзсан",
    NEEDS_REVISION: "Засвар шаардсан",
    SCHEDULED: "Хуваарьт",
    POSTED: "Нийтэлсэн",
    FAILED: "Алдаатай",
  },
};

function statusLabel(locale: Locale, status: string) {
  return statusLabels[locale][status] || status;
}

function dateInput(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

export default function ContentWorkflowManager({ initialItems, mode, lang }: { initialItems: WorkflowItem[]; mode: Mode; lang: Locale }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<Record<string, Partial<WorkflowItem> & { revisionNote?: string; postedUrl?: string }>>({});
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");
  const c = copy[lang][mode];
  const counts = useMemo(() => {
    return items.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
  }, [items]);

  function draftFor(item: WorkflowItem) {
    return editing[item.id] || {};
  }

  function updateDraft(id: string, patch: Partial<WorkflowItem> & { revisionNote?: string; postedUrl?: string }) {
    setEditing((current) => ({ ...current, [id]: { ...current[id], ...patch } }));
  }

  async function updateItem(item: WorkflowItem, patch: Record<string, unknown>) {
    setBusyId(item.id);
    setMessage("");
    try {
      const draft = draftFor(item);
      const response = await fetch(`/api/admin/postly/content-items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title ?? item.title,
          caption: draft.caption ?? item.caption,
          headline: draft.headline ?? item.headline,
          creativeDirection: draft.creativeDirection ?? item.creativeDirection,
          imagePrompt: draft.imagePrompt ?? item.imagePrompt,
          scheduledAt: draft.scheduledAt ?? item.scheduledAt,
          status: draft.status ?? item.status,
          ...patch,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Update failed");
      setItems((current) => current.map((currentItem) => (currentItem.id === item.id ? data.item : currentItem)));
      setEditing((current) => {
        const next = { ...current };
        delete next[item.id];
        return next;
      });
      setMessage(c.success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed");
    } finally {
      setBusyId("");
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black sm:text-4xl">{c.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">{c.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.filter((status) => counts[status]).map((status) => (
            <span key={status} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/65">
              {statusLabel(lang, status)}: {counts[status]}
            </span>
          ))}
        </div>
      </div>

      {message ? (
        <div className="mt-6 rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm text-white/70">{message}</div>
      ) : null}

      <div className="mt-8 grid gap-4">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-8 text-center text-sm text-white/50">{c.empty}</div>
        ) : (
          items.map((item) => {
            const draft = draftFor(item);
            const busy = busyId === item.id;
            return (
              <article key={item.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-white/45">
                      <span>{c.brand}: {item.company.companyName || item.companyId}</span>
                      <span>{item.contentType}</span>
                      {item.template?.name ? <span>{item.template.name}</span> : null}
                    </div>
                    <input
                      value={(draft.title as string | undefined) ?? item.title ?? ""}
                      onChange={(event) => updateDraft(item.id, { title: event.target.value })}
                      placeholder="Untitled content"
                      className="mt-3 w-full rounded-md border border-white/10 bg-black/35 px-3 py-2 text-lg font-bold text-white outline-none transition placeholder:text-white/25 focus:border-amber-300/70"
                    />
                    <textarea
                      value={(draft.caption as string | undefined) ?? item.caption ?? item.creativeDirection ?? ""}
                      onChange={(event) => updateDraft(item.id, { caption: event.target.value, creativeDirection: event.target.value })}
                      rows={4}
                      placeholder="Caption or creative direction"
                      className="mt-3 w-full rounded-md border border-white/10 bg-black/35 p-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-amber-300/70"
                    />
                    {mode === "logs" && item.postingLogs.length > 0 ? (
                      <div className="mt-3 grid gap-2">
                        {item.postingLogs.map((log) => (
                          <div key={log.id} className="rounded-md border border-white/10 bg-black/25 p-3 text-xs text-white/55">
                            {log.platform || "POSTLY"} · {log.status} · {new Date(log.createdAt).toLocaleString()}
                            {log.postedUrl ? <a href={log.postedUrl} target="_blank" rel="noreferrer" className="ml-2 text-amber-200">Open</a> : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="grid w-full gap-3 lg:w-72">
                    <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
                      {c.status}
                      <select
                        value={(draft.status as string | undefined) ?? item.status}
                        onChange={(event) => updateDraft(item.id, { status: event.target.value })}
                        className="h-10 rounded-md border border-white/10 bg-black/45 px-3 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-amber-300/70"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>{statusLabel(lang, status)}</option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
                      {c.scheduled}
                      <input
                        type="datetime-local"
                        value={dateInput((draft.scheduledAt as string | null | undefined) ?? item.scheduledAt)}
                        onChange={(event) => updateDraft(item.id, { scheduledAt: event.target.value ? new Date(event.target.value).toISOString() : null })}
                        className="h-10 rounded-md border border-white/10 bg-black/45 px-3 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-amber-300/70"
                      />
                    </label>
                    <input
                      value={(draft.revisionNote as string | undefined) ?? ""}
                      onChange={(event) => updateDraft(item.id, { revisionNote: event.target.value })}
                      placeholder="Revision or publish note"
                      className="h-10 rounded-md border border-white/10 bg-black/45 px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-amber-300/70"
                    />
                    <input
                      value={(draft.postedUrl as string | undefined) ?? item.facebookPostUrl ?? item.instagramPostUrl ?? ""}
                      onChange={(event) => updateDraft(item.id, { postedUrl: event.target.value })}
                      placeholder="Published URL"
                      className="h-10 rounded-md border border-white/10 bg-black/45 px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-amber-300/70"
                    />
                    <button onClick={() => updateItem(item, {})} disabled={busy} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-3 text-sm font-bold text-black transition hover:bg-amber-100 disabled:opacity-50">
                      {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Clock3 className="h-4 w-4" />}
                      {c.save}
                    </button>
                    <div className="grid grid-cols-3 gap-2">
                      <button title={c.approve} onClick={() => updateItem(item, { status: "APPROVED" })} disabled={busy} className="inline-flex h-10 items-center justify-center rounded-md border border-emerald-300/25 text-emerald-200 hover:bg-emerald-300/10">
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button title={c.reject} onClick={() => updateItem(item, { status: "REJECTED", revisionNote: draft.revisionNote })} disabled={busy} className="inline-flex h-10 items-center justify-center rounded-md border border-red-300/25 text-red-200 hover:bg-red-300/10">
                        <XCircle className="h-4 w-4" />
                      </button>
                      <button title={c.publish} onClick={() => updateItem(item, { status: "POSTED", postedUrl: draft.postedUrl })} disabled={busy} className="inline-flex h-10 items-center justify-center rounded-md border border-amber-300/30 text-amber-200 hover:bg-amber-300/10">
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
