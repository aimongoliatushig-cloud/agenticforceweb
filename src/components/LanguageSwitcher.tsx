"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { isLocale, type Locale } from "@/lib/i18n";

function switchLocale(pathname: string, locale: Locale) {
  const segments = pathname.split("/");
  if (isLocale(segments[1])) {
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }
  return `/${locale}`;
}

type LanguageSwitcherProps = {
  compact?: boolean;
};

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const pathname = usePathname() || "/en";
  const current = isLocale(pathname.split("/")[1]) ? pathname.split("/")[1] : "en";

  return (
    <div
      className={cn(
        "premium-control flex items-center gap-1 rounded-xl border border-white/[0.05] bg-white/[0.035] p-1 text-xs text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-px hover:border-white/10 hover:bg-white/[0.055]",
        compact ? "h-10" : "h-[42px] px-1.5"
      )}
    >
      <Globe2 className={cn("h-3.5 w-3.5 text-white/85", compact ? "ml-0.5" : "ml-1")} />
      {(["en", "mn"] as Locale[]).map((locale) => (
        <Link
          key={locale}
          href={switchLocale(pathname, locale)}
          className={cn(
            "rounded-lg px-2 py-1 uppercase transition-all duration-300",
            current === locale
              ? "bg-transparent text-amber-500"
              : "text-white/78 hover:bg-white/[0.06] hover:text-white"
          )}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}
