"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { dictionary } from "@/lib/i18n";

export function NewsletterForm({ locale }: { locale: Locale }) {
  const labels = dictionary[locale].newsletter;
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/newsletter", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        consent: formData.get("consent") === "on",
        locale,
      }),
      headers: { "Content-Type": "application/json" },
    });

    setStatus(response.ok ? "success" : "error");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
      <label className="sr-only" htmlFor="newsletter-email">
        {labels.email}
      </label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder={labels.email}
          className="h-11 w-full rounded-md border border-white/10 bg-black/40 pl-10 pr-3 text-sm text-white outline-none focus:border-amber-400"
        />
      </div>
      <Button
        type="submit"
        disabled={status === "loading"}
        className="h-11 bg-gradient-to-r from-red-500 to-amber-500 text-white"
      >
        {labels.submit}
      </Button>
      <label className="flex items-start gap-2 text-xs text-white/60 sm:col-span-2">
        <input name="consent" required type="checkbox" className="mt-0.5 accent-amber-500" />
        <span>{labels.consent}</span>
      </label>
      {status === "success" && (
        <p className="text-sm text-emerald-300 sm:col-span-2">
          {locale === "mn" ? "Амжилттай бүртгэгдлээ." : "Subscription saved."}
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-300 sm:col-span-2">
          {locale === "mn" ? "Алдаа гарлаа. Дахин оролдоно уу." : "Something went wrong. Try again."}
        </p>
      )}
    </form>
  );
}
