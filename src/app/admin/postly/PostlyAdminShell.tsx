import Link from "next/link";
import {
  CalendarDays,
  CheckSquare,
  ClipboardList,
  FileCheck2,
  Gauge,
  Layers3,
  LayoutDashboard,
  MessageSquareText,
  PlugZap,
  Rocket,
  Settings,
  Store,
  UserRound,
  WandSparkles,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { UserSync } from "@/components/UserSync";

type NavKey =
  | "dashboard"
  | "brands"
  | "chat"
  | "studio"
  | "calendar"
  | "approval"
  | "templates"
  | "plans"
  | "queue"
  | "publishing"
  | "integrations"
  | "logs"
  | "settings";

const navItems = [
  { key: "dashboard", labelEn: "Dashboard", labelMn: "Хянах самбар", href: "/admin", icon: Gauge },
  { key: "brands", labelEn: "Brands", labelMn: "Брэндүүд", href: "/admin/postly/brands", icon: Store },
  { key: "chat", labelEn: "Brand Chat", labelMn: "Брэнд чат", href: "/admin/postly/brands", icon: MessageSquareText },
  { key: "studio", labelEn: "Content Studio", labelMn: "Контент студи", href: "/admin/postly/content-studio", icon: WandSparkles },
  { key: "calendar", labelEn: "Calendar", labelMn: "Календарь", href: "/admin/postly/calendar", icon: CalendarDays },
  { key: "approval", labelEn: "Approvals", labelMn: "Зөвшөөрөл", href: "/admin/postly/approval", icon: CheckSquare },
  { key: "templates", labelEn: "Templates", labelMn: "Темплейт", href: "/admin/postly/templates", icon: Layers3 },
  { key: "plans", labelEn: "Plans", labelMn: "Төлөвлөгөө", href: "/admin/postly/brands", icon: LayoutDashboard },
  { key: "queue", labelEn: "Content Queue", labelMn: "Контент queue", href: "/admin/postly/approval", icon: ClipboardList },
  { key: "publishing", labelEn: "Publishing", labelMn: "Нийтлэлт", href: "/admin/postly/logs", icon: Rocket },
  { key: "integrations", labelEn: "Integrations", labelMn: "Холболтууд", href: "/admin/postly/integrations", icon: PlugZap },
  { key: "logs", labelEn: "System Logs", labelMn: "Систем лог", href: "/admin/postly/logs", icon: FileCheck2 },
  { key: "settings", labelEn: "Settings", labelMn: "Тохиргоо", href: "/admin/postly/integrations", icon: Settings },
] satisfies {
  key: NavKey;
  labelEn: string;
  labelMn: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}[];

export default function PostlyAdminShell({
  active,
  lang = "en",
  currentPath,
  children,
}: {
  active: NavKey;
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
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-500 text-sm font-black text-white">A</span>
          <span>
            <span className="block text-lg font-black tracking-tight">AgenticForce</span>
            <span className="block text-[11px] text-white/40">AI agent orchestration</span>
          </span>
        </Link>

        <nav className="mt-8 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const selected = item.key === active;
            return (
              <Link
                key={item.key}
                href={withLang(item.href)}
                className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
                  selected ? "bg-violet-500 text-white" : "text-white/65 hover:bg-white/10 hover:text-white"
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
            <div className="grid h-9 w-9 place-items-center rounded-full bg-violet-500/20 text-violet-200">
              <UserRound className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Postly Admin</p>
              <p className="text-xs text-white/45">Workflow operator</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <div className="sticky top-0 z-20 border-b border-white/10 bg-black/85 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={withLang("/admin")} className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-500 text-xs font-black text-white">A</span>
              <span className="font-black">AgenticForce</span>
            </Link>
            <div className="grid grid-cols-2 gap-1 rounded-md border border-white/10 bg-white/[0.04] p-1">
              {(["mn", "en"] as const).map((item) => (
                <Link
                  key={item}
                  href={withLang(switchPath, item)}
                  className={`rounded px-2 py-1 text-center text-[11px] font-bold transition ${
                    lang === item ? "bg-white text-black" : "text-white/55 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const selected = item.key === active;
              return (
                <Link
                  key={item.key}
                  href={withLang(item.href)}
                  className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-xs font-semibold transition ${
                    selected ? "border-violet-400 bg-violet-500 text-white" : "border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item[labelKey]}
                </Link>
              );
            })}
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}
