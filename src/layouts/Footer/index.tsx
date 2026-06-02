"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FooterLogo, SocialLinks } from "./components";
import { normalizeLocale } from "@/lib/i18n";

export function Footer() {
  const pathname = usePathname();
  const locale = normalizeLocale(pathname?.split("/")[1]);

  const isDashboard = /^\/(en|mn)\/dashboard(\/|$)/.test(pathname ?? "");

  if (pathname?.startsWith("/aithon2026") || pathname?.startsWith("/admin") || isDashboard) {
    return null;
  }

  const groups = [
    {
      title: locale === "mn" ? "Шийдэл" : "Solutions",
      links: [
        { label: locale === "mn" ? "Үйлчилгээ" : "Services", href: `/${locale}#services` },
        { label: "Agentic ERP", href: `/${locale}#services` },
        { label: locale === "mn" ? "Академи" : "Academy", href: `/${locale}#academy` },
      ],
    },
    {
      title: locale === "mn" ? "Нөөц" : "Resources",
      links: [
        { label: locale === "mn" ? "Нийтлэл" : "Articles", href: `/${locale}/articles` },
        { label: "Hermes", href: `/${locale}/articles` },
        { label: "CRM", href: "/admin" },
      ],
    },
    {
      title: locale === "mn" ? "Холбоо" : "Contact",
      links: [
        { label: locale === "mn" ? "Үнийн санал" : "Request quote", href: `/${locale}#request-quote` },
        { label: "Newsletter", href: `/${locale}#newsletter` },
        { label: "LinkedIn", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-black border-t border-white/10 py-8 sm:py-16 px-3 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12">
          <div>
            <FooterLogo locale={locale} />
            <p className="text-white/70 mb-6">
              {locale === "mn"
                ? "Agentic AI, ERP автоматжуулалт, академи, AI мэдээний систем."
                : "Agentic AI solutions, ERP automation, academy training, and AI intelligence."}
            </p>
            <SocialLinks />
          </div>

          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-white font-semibold mb-4">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} AgenticForce. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
              { label: "Cookie policy", href: "#" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white/50 hover:text-white text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
