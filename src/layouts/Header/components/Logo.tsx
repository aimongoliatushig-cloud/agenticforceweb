"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { normalizeLocale } from "@/lib/i18n";

export default function Logo() {
  const pathname = usePathname();
  const locale = normalizeLocale(pathname?.split("/")[1]);

  return (
    <Link
      href={`/${locale}`}
      className="group relative z-10 flex items-center gap-2 sm:gap-2.5"
    >
      <div className="relative h-9 w-9 sm:h-10 sm:w-10">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-red-500 to-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.14)] transition-all duration-200 group-hover:-translate-y-px group-hover:rotate-45"></div>
        <div className="absolute inset-[3px] flex items-center justify-center rounded-lg bg-black text-lg font-bold text-white sm:text-xl">
          A
        </div>
      </div>
      <span className="hidden text-xl font-bold tracking-tight text-white/90 min-[430px]:inline sm:text-2xl">
        Agentic<span className="text-amber-500">Force</span>
      </span>
    </Link>
  );
}
