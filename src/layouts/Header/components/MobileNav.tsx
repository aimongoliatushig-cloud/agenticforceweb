"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavDropdown from "./NavDropdown";
import { cn } from "@/lib/utils";
import { AuthActions } from "@/components/AuthActions";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { dictionary, normalizeLocale } from "@/lib/i18n";
import { getArticleIndustryNavItems } from "@/lib/article-industries";
import { getSolutionsNavItems } from "@/features/solutions";
import { getIndustriesNavItems } from "@/features/industries";

type MobileNavProps = {
  isOpen: boolean;
};

export default function MobileNav({ isOpen }: MobileNavProps) {
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
  const serviceItems =
    locale === "mn"
      ? ["Agentic AI зөвлөх", "Agentic ERP", "Ажлын урсгал", "Enterprise integration"]
      : ["Agentic AI consulting", "Agentic ERP", "Workflow automation", "Enterprise integration"];

  return (
    <div
      className={cn(
        "fixed inset-x-3 top-[88px] overflow-hidden rounded-3xl border border-white/12 bg-black/86 shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_42px_rgba(245,158,11,0.08)] backdrop-blur-2xl transition-all duration-300 xl:hidden",
        isOpen ? "max-h-[calc(100vh-104px)] opacity-100" : "max-h-0 border-transparent opacity-0"
      )}
    >
      <div
        className={cn(
          "mx-auto flex flex-col gap-2 overflow-y-auto px-4 py-4 transition-all duration-300",
          isOpen ? "translate-y-0" : "-translate-y-4"
        )}
      >
        <NavDropdown
          id="mobileSolutions"
          label={locale === "mn" ? "Шийдлүүд" : "Solutions"}
          items={solutionItems}
          isMobile
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
        />

        <NavDropdown
          id="mobileIndustries"
          label={locale === "mn" ? "Салбарууд" : "Industries"}
          items={industryItems}
          isMobile
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
        />

        <NavDropdown
          id="mobileServices"
          label={navLabels.services}
          items={serviceItems}
          isMobile
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
        />

        <NavDropdown
          id="mobileArticles"
          label={navLabels.articles}
          items={articleItems}
          isMobile
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
        />

        {[
          { label: navLabels.academy, href: `/${locale}#academy` },
          { label: navLabels.quote, href: `/${locale}#request-quote` },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border-b border-white/10 px-3 py-2.5 text-white/82 transition-all duration-300 hover:bg-amber-400/8 hover:text-amber-100 active:bg-white/10"
          >
            {link.label}
          </Link>
        ))}

        <div className="flex flex-col gap-3 pt-3">
          <LanguageSwitcher />
          <AuthActions locale={locale} compact />
        </div>
      </div>
    </div>
  );
}
