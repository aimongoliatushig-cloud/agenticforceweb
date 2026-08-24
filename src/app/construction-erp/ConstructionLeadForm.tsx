"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

export function ConstructionLeadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const response = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        company: formData.get("company"),
        email: formData.get("email"),
        serviceInterest: "Construction ERP",
        message: `Утас: ${phone || "өгөөгүй"}\n\n${message}`,
        locale: "mn",
      }),
    }).catch(() => null);

    if (response?.ok) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div>
        <p className="text-sm font-semibold text-amber-300">Construction ERP demo</p>
        <h3 className="mt-2 text-2xl font-bold">Танай процессыг ярилцъя</h3>
        <p className="mt-2 text-sm leading-6 text-white/52">
          Богино мэдээлэл үлдээгээрэй. Бид барилгын workflow, integration, эхний Agentic use case-ийг зураглаж холбогдоно.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-xs text-white/52">
          Нэр
          <input name="name" required minLength={2} placeholder="Таны нэр" className="h-11 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-amber-400/45" />
        </label>
        <label className="grid gap-2 text-xs text-white/52">
          Компани
          <input name="company" placeholder="Компанийн нэр" className="h-11 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-amber-400/45" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-xs text-white/52">
          Имэйл
          <input name="email" type="email" required placeholder="name@company.mn" className="h-11 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-amber-400/45" />
        </label>
        <label className="grid gap-2 text-xs text-white/52">
          Утас
          <input name="phone" placeholder="99xxxxxx" className="h-11 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-amber-400/45" />
        </label>
      </div>

      <label className="grid gap-2 text-xs text-white/52">
        Одоогийн хамгийн том асуудал
        <textarea name="message" required minLength={10} rows={5} placeholder="Жишээ: Талбайн явц, борлуулалт, cash flow тусдаа системд байдаг..." className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-amber-400/45" />
      </label>

      <button type="submit" disabled={status === "loading"} className="premium-cta inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
        <Send className="h-4 w-4" />
        {status === "loading" ? "Илгээж байна..." : "Демо хүсэлт илгээх"}
      </button>

      {status === "success" ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-3 text-sm text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          Хүсэлт хүлээн авлаа. Бид удахгүй холбогдоно.
        </div>
      ) : null}

      {status === "error" ? (
        <p className="rounded-xl border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-sm text-red-300">
          Хүсэлт илгээж чадсангүй. Дахин оролдоно уу.
        </p>
      ) : null}
    </form>
  );
}
