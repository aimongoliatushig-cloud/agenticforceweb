"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Phone,
  Mail,
  UserRound,
  CalendarDays,
  Tag,
  Link as LinkIcon,
  Clock,
} from "lucide-react";

type Lead = {
  id: number;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  stage: string;
  user: string;
  createdDate: string;
  revenue: number;
  tags: string[];
  description: string;
};

export function BurtgelClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/aithon2026/leads");
      const data = await res.json();
      if (data.ok) {
        setLeads(data.leads);
      } else {
        setError(data.error || "Алдаа гарлаа");
      }
    } catch {
      setError("Lead-үүдийг татахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filtered = leads.filter((l) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.contactName.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      l.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return dateStr.slice(0, 10);
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    return dateStr.slice(11, 16);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-[#ffaa0026] bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <a href="/aithon2026" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-[#ffb300]/40 bg-[#ff9800]/10 shadow-[0_0_22px_rgba(255,152,0,0.25)]">
              <Users className="h-5 w-5 text-[#ffb300]" />
            </span>
            <div className="leading-tight">
              <span className="block text-sm font-extrabold tracking-wide text-white">AITHON 2026</span>
              <span className="block text-xs font-bold text-[#ffb300]">БҮРТГЭЛ</span>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Хайх..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 rounded-xl border border-[#ffaa0026] bg-white/[0.04] pl-9 pr-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#ffb300]/60"
              />
            </div>
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="flex h-9 items-center gap-2 rounded-xl border border-[#ffaa0026] bg-white/[0.04] px-3 text-sm text-zinc-300 transition hover:border-[#ffb300]/60 hover:text-[#ffb300] disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Шинэчлэх
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6 sm:px-6">
        {/* Stats bar */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 rounded-xl border border-[#ffaa0026] bg-white/[0.04] px-4 py-2.5">
            <Users className="h-5 w-5 text-[#ffb300]" />
            <span className="text-sm font-bold text-white">{leads.length}</span>
            <span className="text-xs text-zinc-400">нийт бүртгэл</span>
          </div>
          {searchQuery && (
            <div className="flex items-center gap-2 rounded-xl border border-[#ffaa0026] bg-white/[0.04] px-4 py-2.5">
              <Search className="h-4 w-4 text-[#ffb300]" />
              <span className="text-sm text-zinc-300">
                {filtered.length} тохирсон
              </span>
            </div>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
            <button onClick={fetchLeads} className="ml-4 underline">
              Дахин оролдох
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="h-8 w-8 animate-spin text-[#ffb300]" />
            <span className="ml-3 text-zinc-400">Татсаар...</span>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Users className="mb-4 h-12 w-12" />
            <p className="text-lg font-bold">Бүртгэл олдсонгүй</p>
            <p className="mt-1 text-sm">Хайлтаа өөрчлөөд үзнэ үү</p>
          </div>
        )}

        {/* Leads grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((lead) => (
              <LeadCard key={lead.id} lead={lead} formatDate={formatDate} formatTime={formatTime} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-[#ffaa0015] px-5 py-4 text-center text-xs text-zinc-600 sm:px-6">
        Smart City AI Hackathon 2026 · Бүртгэлийн жагсаалт · Автомат шинэчлэгдэнэ
      </footer>
    </div>
  );
}

function LeadCard({
  lead,
  formatDate,
  formatTime,
}: {
  lead: Lead;
  formatDate: (s: string) => string;
  formatTime: (s: string) => string;
}) {
  return (
    <div className="group rounded-2xl border border-[#ffaa0026] bg-white/[0.03] p-5 transition hover:border-[#ffb300]/50 hover:shadow-[0_0_30px_rgba(255,152,0,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#ffaa0033] bg-[#ff9800]/10 text-[#ffb300]">
              <UserRound className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{lead.contactName}</p>
              <p className="truncate text-xs text-zinc-400">#{lead.id}</p>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#ffaa001f] bg-white/[0.03] px-2.5 py-1">
          <CalendarDays className="h-3 w-3 text-[#ffb300]" />
          <span className="text-[11px] font-semibold text-zinc-300">{formatDate(lead.createdDate)}</span>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            className="flex items-center gap-2 text-zinc-400 transition hover:text-[#ffb300]"
          >
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{lead.email}</span>
          </a>
        )}
        {lead.phone && (
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center gap-2 text-zinc-400 transition hover:text-[#ffb300]"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>{lead.phone}</span>
          </a>
        )}
        {lead.createdDate && (
          <div className="flex items-center gap-2 text-zinc-400">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span className="text-xs">{formatDate(lead.createdDate)} {formatTime(lead.createdDate)}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {lead.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Tag className="h-3 w-3 self-center text-zinc-500" />
          {lead.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#ffaa0026] bg-[#ff9800]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#ffb300]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Description preview */}
      {lead.description && (
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-zinc-500">
          {lead.description.replace(/Smart City AI Hackathon.*?\n/, "").slice(0, 200)}
        </p>
      )}

      {/* Stage + user footer */}
      <div className="mt-4 flex items-center justify-between border-t border-[#ffaa0015] pt-3 text-[11px] text-zinc-500">
        <span>{lead.stage || "Lead"}</span>
        <span>{lead.user || "—"}</span>
      </div>
    </div>
  );
}
