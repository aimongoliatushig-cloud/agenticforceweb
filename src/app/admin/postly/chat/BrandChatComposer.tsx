"use client";

import { useState } from "react";
import { LoaderCircle, Send, Sparkles } from "lucide-react";

type Template = { id: string; name: string };

type BrandChatComposerProps = {
  brandId: string;
  templates: Template[];
  lang?: "en" | "mn";
};

const quickPrompts = {
  en: [
    "Create 5 Facebook post ideas for this brand.",
    "Generate one premium poster concept.",
    "Create a 4-slide carousel outline.",
    "Write a short promotional caption with a strong CTA.",
  ],
  mn: [
    "Энэ брэндэд зориулж 5 Facebook пост санаа гарга.",
    "Нэг premium poster concept гарга.",
    "4 slide carousel outline Монгол caption-тай гарга.",
    "Strong CTA-тай богино promotional caption бич.",
  ],
};

export default function BrandChatComposer({ brandId, templates, lang = "en" }: BrandChatComposerProps) {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("POSTER");
  const [templateId, setTemplateId] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  const copy = lang === "mn"
    ? {
        placeholder: "Hermes-д бичих...",
        send: "Илгээх",
        sending: "Илгээж байна...",
        queued: "Prompt Hermes queue рүү илгээгдлээ. Хуудсаа refresh хийвэл шинэ чат харагдана.",
        failed: "Prompt илгээхэд алдаа гарлаа.",
        noTemplate: "Темплейт сонгоогүй",
      }
    : {
        placeholder: "Message Hermes...",
        send: "Send",
        sending: "Sending...",
        queued: "Prompt sent to Hermes queue. Refresh to see the new chat.",
        failed: "Prompt send failed.",
        noTemplate: "No template",
      };

  async function submit(text = prompt) {
    if (!text.trim()) return;
    setSending(true);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/postly/brands/${brandId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, contentType, templateId }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || copy.failed);
      setPrompt("");
      setNotice(copy.queued);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : copy.failed);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="border-t border-white/10 bg-black/25 p-4">
      {notice ? (
        <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/65">
          {notice}
        </div>
      ) : null}

      <div className="mb-3 grid gap-2 sm:grid-cols-[150px_1fr]">
        <select
          value={contentType}
          onChange={(event) => setContentType(event.target.value)}
          className="h-11 rounded-2xl border border-white/10 bg-black/35 px-3 text-sm text-white outline-none focus:border-violet-300/60"
        >
          <option>POSTER</option>
          <option>CAROUSEL</option>
          <option>REEL</option>
          <option>STORY</option>
        </select>
        <select
          value={templateId}
          onChange={(event) => setTemplateId(event.target.value)}
          className="h-11 rounded-2xl border border-white/10 bg-black/35 px-3 text-sm text-white outline-none focus:border-violet-300/60"
        >
          <option value="">{copy.noTemplate}</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder={copy.placeholder}
          rows={2}
          className="min-h-14 rounded-2xl border border-white/10 bg-black/35 p-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-violet-300/60"
        />
        <button
          type="button"
          onClick={() => submit()}
          disabled={sending || !prompt.trim()}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {sending ? copy.sending : copy.send}
        </button>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {quickPrompts[lang].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPrompt(item)}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white/60 transition hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
