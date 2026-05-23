"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavDropdown from "./NavDropdown";
import { AuthActions } from "@/components/AuthActions";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { dictionary, normalizeLocale } from "@/lib/i18n";

export default function DesktopNav() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const locale = normalizeLocale(pathname?.split("/")[1]);
  const labels = dictionary[locale].nav;
  const navLabels =
    locale === "mn"
      ? {
          services: "Үйлчилгээ",
          academy: "Академи",
          articles: "Нийтлэл",
          quote: "Санал авах",
        }
      : labels;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveDropdown(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const serviceItems =
    locale === "mn"
      ? ["Agentic AI зөвлөх", "Agentic ERP", "Ажлын урсгал", "Enterprise integration"]
      : ["Agentic AI consulting", "Agentic ERP", "Workflow automation", "Enterprise integration"];

  return (
    <>
      <nav
        className={`absolute left-1/2 hidden -translate-x-1/2 items-center 2xl:flex ${
          locale === "mn" ? "gap-6" : "gap-[42px]"
        }`}
      >
        <NavDropdown
          id="services"
          label={navLabels.services}
          items={serviceItems}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
        />

        {[
          { label: navLabels.academy, href: `/${locale}#academy` },
          { label: navLabels.articles, href: `/${locale}/articles` },
          { label: navLabels.quote, href: `/${locale}#request-quote` },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="premium-nav-link relative rounded-xl px-1 py-2 text-[15px] font-medium text-[#d1d1d1] transition-all duration-200 hover:-translate-y-px hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
            onMouseEnter={() => setActiveDropdown(null)}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div
        className="relative z-10 ml-auto hidden items-center gap-3 2xl:flex"
        onMouseEnter={() => setActiveDropdown(null)}
      >
        <LanguageSwitcher />
        <AuthActions locale={locale} />
      </div>
    </>
  );
}
