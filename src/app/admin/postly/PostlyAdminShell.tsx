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

const navItems = [
  { key: "dashboard", label: "Dashboard", href: "/admin", icon: Gauge },
  { key: "brands", label: "Brands", href: "/admin/postly/brands", icon: Store },
  { key: "templates", label: "Templates", href: "/admin/postly/brands", icon: Layers3 },
  { key: "chat", label: "Hermes Chat", href: "/admin/postly/brands", icon: MessageSquareText },
  { key: "calendar", label: "Content Calendar", href: "/admin/postly/brands", icon: CalendarDays },
  { key: "approval", label: "Approval", href: "/admin/postly/brands", icon: CheckSquare },
  { key: "logs", label: "Published Logs", href: "/admin/postly/brands", icon: FileCheck2 },
  { key: "settings", label: "Settings", href: "/admin/postly/integrations", icon: Settings },
];

export default function PostlyAdminShell({
  active,
  children,
}: {
  active: "dashboard" | "brands" | "templates" | "chat" | "calendar" | "approval" | "logs" | "settings";
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-white/10 bg-zinc-950/95 px-4 py-5 shadow-2xl shadow-black/40 lg:block">
        <Link href="/admin" className="flex items-center gap-3 px-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-300 text-sm font-black text-black">P</span>
          <span className="text-lg font-black tracking-tight">Postly.mn</span>
        </Link>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const selected = item.key === active;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
                  selected ? "bg-amber-300 text-black" : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

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
            <Link href="/admin" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-300 text-xs font-black text-black">P</span>
              <span className="font-black">Postly.mn</span>
            </Link>
            <Link href="/admin/postly/brands" className="rounded-md border border-white/10 px-3 py-2 text-xs text-white/70">
              Brands
            </Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
