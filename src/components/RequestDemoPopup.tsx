"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Building2, Mail, Phone, UserRound, X, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeLocale, type Locale } from "@/lib/i18n";

const POPUP_DELAY_MS = 120_000;

const industryOptions: Record<Locale, string[]> = {
  en: [
    "Healthcare",
    "Finance & Banking",
    "Retail & E-commerce",
    "Education",
    "Real Estate",
    "Manufacturing",
    "Logistics & Transportation",
    "Hospitality & Tourism",
    "Legal & Professional Services",
    "Government & Public Sector",
  ],
  mn: [
    "Эрүүл мэнд",
    "Санхүү ба банк",
    "Жижиглэн худалдаа ба e-commerce",
    "Боловсрол",
    "Үл хөдлөх хөрөнгө",
    "Үйлдвэрлэл",
    "Логистик ба тээвэр",
    "Зочлох үйлчилгээ ба аялал жуулчлал",
    "Хууль ба мэргэжлийн үйлчилгээ",
    "Төр ба нийтийн сектор",
  ],
};

const labels = {
  en: {
    eyebrow: "Request a demo",
    title: "See how AI agents fit your industry",
    body: "Share your details and we will map the right workflow for your company.",
    industry: "Industry",
    companyName: "Company name",
    contactName: "Contact name",
    phone: "Phone",
    email: "Email",
    submit: "Send demo request",
    success: "Request received. We will contact you soon.",
    error: "Could not send request. Please try again.",
  },
  mn: {
    eyebrow: "Демо захиалах",
    title: "AI агентууд танай салбарт хэрхэн тохирохыг үзье",
    body: "Мэдээллээ үлдээгээрэй. Бид танай компанид тохирох workflow-г зураглана.",
    industry: "Салбар",
    companyName: "Компанийн нэр",
    contactName: "Холбоо барих хүний нэр",
    phone: "Утас",
    email: "Имэйл",
    submit: "Демо хүсэлт илгээх",
    success: "Хүсэлт хүлээн авлаа. Бид удахгүй холбогдоно.",
    error: "Хүсэлт илгээж чадсангүй. Дахин оролдоно уу.",
  },
};

export function RequestDemoPopup() {
  const pathname = usePathname() || "/";
  const locale = normalizeLocale(pathname.split("/")[1]);
  const copy = labels[locale];
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const storageKey = useMemo(() => `agenticforce:demo-popup:dismissed:${pathname}`, [pathname]);

  useEffect(() => {
    setIsOpen(false);
    setStatus("idle");

    if (typeof window === "undefined") return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/aithon2026") || pathname.includes("/thank-you")) return;
    if (window.localStorage.getItem("agenticforce:demo-popup:submitted") === "true") return;
    if (window.sessionStorage.getItem(storageKey) === "true") return;

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, POPUP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [pathname, storageKey]);

  function close() {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(storageKey, "true");
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/demo-leads", {
      method: "POST",
      body: JSON.stringify({
        industry: formData.get("industry"),
        companyName: formData.get("companyName"),
        contactName: formData.get("contactName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        locale,
        path: pathname,
        referrer: typeof document !== "undefined" ? document.referrer : null,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setStatus("success");
      form.reset();
      if (typeof window !== "undefined") {
        window.localStorage.setItem("agenticforce:demo-popup:submitted", "true");
        window.sessionStorage.setItem(storageKey, "true");
      }
      window.setTimeout(() => setIsOpen(false), 1600);
      return;
    }

    setStatus("error");
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-xl overflow-hidden rounded-lg border border-white/12 bg-[#080A0F] p-5 text-white shadow-[0_30px_110px_rgba(0,0,0,0.65),0_0_70px_rgba(255,194,71,0.12)] sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,107,61,0.18),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(255,194,71,0.12),transparent_30%)]" />
        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
          aria-label="Close demo request"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative z-10 pr-10">
          <p className="text-xs font-black uppercase text-amber-200">{copy.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">{copy.title}</h2>
          <p className="mt-3 text-sm leading-6 text-white/62">{copy.body}</p>
        </div>

        <form onSubmit={onSubmit} className="relative z-10 mt-6 grid gap-3">
          <select
            name="industry"
            required
            defaultValue=""
            className="h-11 rounded-md border border-white/10 bg-black/45 px-3 text-sm text-white outline-none focus:border-amber-400"
          >
            <option value="" disabled>
              {copy.industry}
            </option>
            {industryOptions[locale].map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>

          <InputField name="companyName" placeholder={copy.companyName} icon={Building2} />
          <InputField name="contactName" placeholder={copy.contactName} icon={UserRound} />
          <div className="grid gap-3 sm:grid-cols-2">
            <InputField name="phone" placeholder={copy.phone} icon={Phone} type="tel" />
            <InputField name="email" placeholder={copy.email} icon={Mail} type="email" />
          </div>

          <Button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="mt-2 h-11 w-fit rounded-lg bg-gradient-to-r from-[#FF6B3D] to-[#FFC247] px-5 font-bold text-[#120B04]"
          >
            {copy.submit}
            <ArrowRight className="h-4 w-4" />
          </Button>

          {status === "success" ? <p className="text-sm text-emerald-300">{copy.success}</p> : null}
          {status === "error" ? <p className="text-sm text-red-300">{copy.error}</p> : null}
        </form>
      </div>
    </div>
  );
}

function InputField({
  name,
  placeholder,
  icon: Icon,
  type = "text",
}: {
  name: string;
  placeholder: string;
  icon: LucideIcon;
  type?: string;
}) {
  return (
    <label className="relative block">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/34" />
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-white/10 bg-black/45 pl-10 pr-3 text-sm text-white outline-none placeholder:text-white/36 focus:border-amber-400"
      />
    </label>
  );
}
