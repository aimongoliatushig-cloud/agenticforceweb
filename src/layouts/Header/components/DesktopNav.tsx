"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavDropdown from "./NavDropdown";
import { AuthActions } from "@/components/AuthActions";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { dictionary, normalizeLocale } from "@/lib/i18n";
import { getArticleIndustryNavItems } from "@/lib/article-industries";
import { getSolutionsNavItems } from "@/features/solutions";
import { getIndustriesNavItems } from "@/features/industries";

export default function DesktopNav() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const locale = normalizeLocale(pathname?.split("/")[1]);
  const labels = dictionary[locale].nav;
  const hasLocalePrefix = pathname?.split("/")[1] === locale;
  const solutionItems = getSolutionsNavItems(locale, hasLocalePrefix);
  const industryItems = getIndustriesNavItems(locale, hasLocalePrefix);
  const articleItems = getArticleIndustryNavItems(locale);
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
    <div className="relative z-10 ml-6 hidden min-w-0 flex-1 items-center justify-end gap-3 xl:flex 2xl:ml-10 2xl:gap-4">
      <nav
        className={`flex min-w-0 flex-1 items-center justify-center ${
          locale === "mn" ? "gap-2 2xl:gap-4" : "gap-3 2xl:gap-6"
        }`}
      >
        <NavDropdown
          id="solutions"
          label={locale === "mn" ? "Шийдлүүд" : "Solutions"}
          items={solutionItems}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
        />

        <NavDropdown
          id="industries"
          label={locale === "mn" ? "Салбарууд" : "Industries"}
          items={industryItems}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
        />

        <NavDropdown
          id="services"
          label={navLabels.services}
          items={serviceItems}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
        />

        {[
          { label: navLabels.academy, href: `/${locale}#academy` },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="premium-nav-link relative whitespace-nowrap rounded-xl px-1 py-2 text-sm font-medium text-[#d1d1d1] transition-all duration-200 hover:-translate-y-px hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 2xl:text-[15px]"
            onMouseEnter={() => setActiveDropdown(null)}
          >
            {link.label}
          </Link>
        ))}

        <NavDropdown
          id="articles"
          label={navLabels.articles}
          items={articleItems}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
        />

        <Link
          href={`/${locale}#request-quote`}
          className="premium-nav-link relative whitespace-nowrap rounded-xl px-1 py-2 text-sm font-medium text-[#d1d1d1] transition-all duration-200 hover:-translate-y-px hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 2xl:text-[15px]"
          onMouseEnter={() => setActiveDropdown(null)}
        >
          {navLabels.quote}
        </Link>
      </nav>

      <div
        className="flex shrink-0 items-center gap-2 2xl:gap-3"
        onMouseEnter={() => setActiveDropdown(null)}
      >
        <LanguageSwitcher />
        <AuthActions locale={locale} />
      </div>
    </div>
  );
}
