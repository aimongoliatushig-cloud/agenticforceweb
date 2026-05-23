"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { dictionary } from "@/lib/i18n";

export function QuoteForm({ locale }: { locale: Locale }) {
  const labels = dictionary[locale].quote;
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/quote", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        company: formData.get("company"),
        email: formData.get("email"),
        serviceInterest: formData.get("serviceInterest"),
        message: formData.get("message"),
        locale,
      }),
      headers: { "Content-Type": "application/json" },
    });

    setStatus(response.ok ? "success" : "error");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder={labels.name} className="h-11 rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-amber-400" />
        <input name="company" placeholder={labels.company} className="h-11 rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-amber-400" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="email" type="email" required placeholder={labels.email} className="h-11 rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-amber-400" />
        <select name="serviceInterest" required className="h-11 rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-amber-400">
          <option value="Agentic AI consulting">Agentic AI consulting</option>
          <option value="Agentic ERP">Agentic ERP</option>
          <option value="Workflow automation">Workflow automation</option>
          <option value="AgenticForce Academy">AgenticForce Academy</option>
        </select>
      </div>
      <textarea
        name="message"
        required
        rows={5}
        placeholder={labels.message}
        className="rounded-md border border-white/10 bg-black/40 px-3 py-3 text-sm text-white outline-none focus:border-amber-400"
      />
      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-fit bg-gradient-to-r from-red-500 to-amber-500 text-white"
      >
        <Send className="h-4 w-4" />
        {labels.submit}
      </Button>
      {status === "success" && (
        <p className="text-sm text-emerald-300">
          {locale === "mn" ? "Хүсэлт амжилттай илгээгдлээ." : "Request received."}
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-300">
          {locale === "mn" ? "Алдаа гарлаа. Дахин оролдоно уу." : "Something went wrong. Try again."}
        </p>
      )}
    </form>
  );
}
