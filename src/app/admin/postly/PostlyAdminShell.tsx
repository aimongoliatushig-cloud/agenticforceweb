import Link from "next/link";
import {
  CalendarDays,
  CheckSquare,
  FileCheck2,
  Gauge,
  Layers3,
  MessageSquareText,
  Settings,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { UserSync } from "@/components/UserSync";

const navItems = [
  {
    key: "dashboard",
    labelEn: "Command Center",
    labelMn: "Комманд төв",
    eyebrowEn: "Daily control",
    eyebrowMn: "Өдрийн удирдлага",
    href: "/admin",
    icon: Gauge,
  },
  {
    key: "brands",
    labelEn: "Brands",
    labelMn: "Брэндүүд",
    eyebrowEn: "Brand setup",
    eyebrowMn: "Брэнд тохиргоо",
    href: "/admin/postly/brands",
    icon: Store,
  },
  {
    key: "chat",
    labelEn: "AI Chat",
    labelMn: "AI чат",
    eyebrowEn: "Messenger workspace",
    eyebrowMn: "Messenger workspace",
    href: "/admin/postly/chat",
    icon: MessageSquareText,
    badge: "AI",
  },
  {
    key: "templates",
    labelEn: "Templates",
    labelMn: "Темплейтүүд",
    eyebrowEn: "Creative system",
    eyebrowMn: "Креатив систем",
    href: "/admin/postly/templates",
    icon: Layers3,
  },
  {
    key: "calendar",
    labelEn: "Calendar",
    labelMn: "Календарь",
    eyebrowEn: "Plan & schedule",
    eyebrowMn: "Төлөвлөлт",
    href: "/admin/postly/calendar",
    icon: CalendarDays,
  },
  {
    key: "approval",
    labelEn: "Approvals",
    labelMn: "Зөвшөөрөл",
    eyebrowEn: "Review queue",
    eyebrowMn: "Шалгах queue",
    href: "/admin/postly/approval",
    icon: CheckSquare,
  },
  {
    key: "logs",
    labelEn: "Published Logs",
    labelMn: "Нийтэлсэн лог",
    eyebrowEn: "Output history",
    eyebrowMn: "Гаралтын түүх",
    href: "/admin/postly/logs",
    icon: FileCheck2,
  },
  {
    key: "settings",
    labelEn: "Integrations",
    labelMn: "Интеграци",
    eyebrowEn: "Make & channels",
    eyebrowMn: "Make ба сувгууд",
    href: "/admin/postly/integrations",
    icon: Settings,
  },
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
  const eyebrowKey = lang === "mn" ? "eyebrowMn" : "eyebrowEn";
  const withLang = (href: string, nextLang = lang) => `${href}?lang=${nextLang}`;
  const switchPath = currentPath || navItems.find((item) => item.key === active)?.href || "/admin";
  const shellCopy = lang === "mn"
    ? {
        status: "Hermes online",
        admin: "AgenticForce Admin",
        role: "AI operator",
      }
    : {
        status: "Hermes online",
        admin: "AgenticForce Admin",
        role: "AI operator",
      };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.10),transparent_26%),#050505] text-white">
      {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? <UserSync locale={lang} /> : null}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r border-white/10 bg-zinc-950/92 px-4 py-5 shadow-2xl shadow-black/50 backdrop-blur-xl lg:block">
        <Link href={withLang("/admin")} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-violet-400/40 hover:bg-white/[0.07]">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-300 text-sm font-black text-white shadow-lg shadow-violet-500/25">
            AF
          </span>
          <span>
            <span className="block text-lg font-black tracking-tight">AgenticForce</span>
            <span className="block text-xs font-medium text-white/45">AI Agent OS</span>
          </span>
        </Link>

        <nav className="mt-5 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const selected = item.key === active;
            return (
              <Link
                key={item.key}
                href={withLang(item.href)}
                className={`group flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition ${
                  selected
                    ? "border-violet-300/45 bg-gradient-to-r from-violet-500/95 to-fuchsia-500/85 text-white shadow-lg shadow-violet-500/20"
                    : "border-transparent text-white/62 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${selected ? "bg-white/18" : "bg-white/[0.06] text-white/55 group-hover:text-violet-200"}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm font-bold">
                    {item[labelKey]}
                    {item.badge ? <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-white/80">{item.badge}</span> : null}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-white/42">{item[eyebrowKey]}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
          {(["mn", "en"] as const).map((item) => (
            <Link
              key={item}
              href={withLang(switchPath, item)}
              className={`rounded-xl px-3 py-2 text-center text-xs font-black transition ${
                lang === item ? "bg-white text-black" : "text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.toUpperCase()}
            </Link>
          ))}
        </div>

        <div className="absolute bottom-5 left-4 right-4 space-y-3">
          <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-semibold text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
                {shellCopy.status}
              </span>
              <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-violet-400/20 text-violet-100">
                <UserRound className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">{shellCopy.admin}</p>
                <p className="text-xs text-white/45">{shellCopy.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-20 border-b border-white/10 bg-black/82 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={withLang("/admin")} className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-amber-300 text-xs font-black text-white">AF</span>
              <span>
                <span className="block font-black leading-4">AgenticForce</span>
                <span className="block text-[10px] text-white/45">AI Agent OS</span>
              </span>
            </Link>
            <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1">
              {(["mn", "en"] as const).map((item) => (
                <Link
                  key={item}
                  href={withLang(switchPath, item)}
                  className={`rounded-lg px-2 py-1 text-center text-[11px] font-black transition ${
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
                  className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition ${
                    selected ? "border-violet-300/45 bg-violet-500 text-white" : "border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/10 hover:text-white"
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
