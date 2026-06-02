import Link from "next/link";
import {
  CalendarDays,
  CheckSquare,
  FileCheck2,
  Gauge,
  Layers3,
  MessageSquareText,
  Settings,
  Store,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { UserSync } from "@/components/UserSync";

const navItems = [
  { key: "dashboard", labelEn: "Dashboard", labelMn: "Хянах самбар", href: "/admin", icon: Gauge },
  { key: "brands", labelEn: "Brands", labelMn: "Брэндүүд", href: "/admin/postly/brands", icon: Store },
  { key: "templates", labelEn: "Templates", labelMn: "Темплейтүүд", href: "/admin/postly/brands", icon: Layers3 },
  { key: "chat", labelEn: "Hermes Chat", labelMn: "Hermes чат", href: "/admin/postly/brands", icon: MessageSquareText },
  { key: "calendar", labelEn: "Content Calendar", labelMn: "Контент календарь", href: "/admin/postly/calendar", icon: CalendarDays },
  { key: "approval", labelEn: "Approval", labelMn: "Зөвшөөрөл", href: "/admin/postly/approval", icon: CheckSquare },
  { key: "logs", labelEn: "Published Logs", labelMn: "Нийтэлсэн лог", href: "/admin/postly/logs", icon: FileCheck2 },
  { key: "settings", labelEn: "Settings", labelMn: "Тохиргоо", href: "/admin/postly/integrations", icon: Settings },
];

export default function PostlyAdminShell({
  active,
  lang = "en",
  currentPath,
  children,
}: {
  active: "dashboard" | "brands" | "templates" | "chat" | "calendar" | "approval" | "logs" | "settings";
  lang?: "en" | "mn";
  currentPath?: string;
  children: ReactNode;
}) {
  const labelKey = lang === "mn" ? "labelMn" : "labelEn";
  const withLang = (href: string, nextLang = lang) => `${href}?lang=${nextLang}`;
  const switchPath = currentPath || navItems.find((item) => item.key === active)?.href || "/admin";

  return (
    <div className="min-h-screen bg-black text-white">
      {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? <UserSync locale={lang} /> : null}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-white/10 bg-zinc-950/95 px-4 py-5 shadow-2xl shadow-black/40 lg:block">
        <Link href={withLang("/admin")} className="flex items-center gap-3 px-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-300 text-sm font-black text-black">P</span>
          <span className="text-lg font-black tracking-tight">Postly.mn</span>
        </Link>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const selected = item.key === active;
            return (
              <Link
                key={item.key}
                href={withLang(item.href)}
                className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
                  selected ? "bg-amber-300 text-black" : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item[labelKey]}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-2">
          {(["mn", "en"] as const).map((item) => (
            <Link
              key={item}
              href={withLang(switchPath, item)}
              className={`rounded-md px-3 py-2 text-center text-xs font-bold transition ${
                lang === item ? "bg-white text-black" : "text-white/55 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.toUpperCase()}
            </Link>
          ))}
        </div>

        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-300/20 text-amber-200">
              <UserRound className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Postly Admin</p>
              <p className="text-xs text-white/45">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <div className="sticky top-0 z-20 border-b border-white/10 bg-black/85 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={withLang("/admin")} className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-300 text-xs font-black text-black">P</span>
              <span className="font-black">Postly.mn</span>
            </Link>
            <Link href={withLang("/admin/postly/brands")} className="rounded-md border border-white/10 px-3 py-2 text-xs text-white/70">
              {lang === "mn" ? "Брэндүүд" : "Brands"}
            </Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
