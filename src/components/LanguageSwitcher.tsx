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

export function LanguageSwitcher() {
  const pathname = usePathname() || "/en";
  const current = isLocale(pathname.split("/")[1]) ? pathname.split("/")[1] : "en";

  return (
    <div className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 p-1 text-xs text-white/80">
      <Globe2 className="h-3.5 w-3.5 ml-1" />
      {(["en", "mn"] as Locale[]).map((locale) => (
        <Link
          key={locale}
          href={switchLocale(pathname, locale)}
          className={cn(
            "rounded px-2 py-1 uppercase transition-colors",
            current === locale ? "bg-white text-black" : "hover:bg-white/10"
          )}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}
