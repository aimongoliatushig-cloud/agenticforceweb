"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  ArrowRight,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CreditCard,
  FileText,
  Globe2,
  HelpCircle,
  LayoutDashboard,
  LinkIcon,
  ListChecks,
  LoaderCircle,
  Megaphone,
  Minus,
  Moon,
  PanelLeft,
  Plus,
  Settings,
  ShieldAlert,
  Sparkles,
  Sun,
  Upload,
} from "lucide-react";
import { normalizeLocale, type Locale } from "@/lib/i18n";

type PlanName = "Starter" | "Growth" | "Domination";
type ContentKind = "carousel" | "reel";
type MenuKey = "dashboard" | "company" | "planning" | "strategy" | "settings";

type CompanyForm = {
  logoUrl: string;
  companyName: string;
  businessType: string;
  activityDirection: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  workingHours: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  productsServices: string;
};

type Allocation = {
  id: "brand_awareness" | "product_intro" | "sales_promotion";
  title: string;
  subtitle: string;
  carousel: number;
  reel: number;
  tone: string;
};

type StrategyResult = {
  brandPositioning: string;
  targetAudience: string;
  contentAngle: string;
  weeklyDirection: string[];
  ctaIdeas: string[];
  promotionIdeas: string[];
  captionTone: string;
  calendarDraft: Array<{ day: string; items: string[] }>;
  source: "openai" | "local";
};

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const menuItems: Array<{ key: MenuKey; label: string; icon: typeof LayoutDashboard }> = [
  { key: "dashboard", label: "Хяналтын самбар", icon: LayoutDashboard },
  { key: "company", label: "Миний компани", icon: Building2 },
  { key: "planning", label: "Контент төлөвлөлт", icon: CalendarDays },
  { key: "strategy", label: "Контент стратеги", icon: Sparkles },
  { key: "settings", label: "Тохиргоо", icon: Settings },
];

const planConfig: Record<PlanName, { price: string; carouselLimit: number; reelLimit: number; frequency: string; features: string[] }> = {
  Starter: {
    price: "390,000₮ / сар",
    carouselLimit: 7,
    reelLimit: 4,
    frequency: "Долоо хоногт 3-4 пост",
    features: ["7 Carousel", "4 Reel", "Үндсэн стратеги"],
  },
  Growth: {
    price: "690,000₮ / сар",
    carouselLimit: 19,
    reelLimit: 12,
    frequency: "Долоо хоногт 5-7 пост",
    features: ["+12 Carousel", "+8 Reel", "Өсөлтийн стратеги"],
  },
  Domination: {
    price: "1,190,000₮ / сар",
    carouselLimit: 32,
    reelLimit: 20,
    frequency: "Өдөр бүр нийтлэх",
    features: ["32 Carousel", "20 Reel", "Домайнант стратеги"],
  },
};

const emptyCompany: CompanyForm = {
  logoUrl: "",
  companyName: "",
  businessType: "",
  activityDirection: "",
  description: "",
  phone: "",
  email: "",
  website: "",
  address: "",
  workingHours: "",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  productsServices: "",
};

const defaultAllocation: Allocation[] = [
  {
    id: "brand_awareness",
    title: "Brand Awareness",
    subtitle: "Танигдах, итгэл үүсгэх",
    carousel: 3,
    reel: 2,
    tone: "from-amber-500 to-yellow-700",
  },
  {
    id: "product_intro",
    title: "Product / Solution Introduction",
    subtitle: "Бүтээгдэхүүн, үйлчилгээ танилцуулах",
    carousel: 2,
    reel: 1,
    tone: "from-violet-500 to-indigo-800",
  },
  {
    id: "sales_promotion",
    title: "Discount / Promotion Sales",
    subtitle: "Хямдрал, урамшуулал, борлуулалт",
    carousel: 2,
    reel: 1,
    tone: "from-red-500 to-orange-800",
  },
];

const dayOptions = [
  { key: "monday", label: "Да" },
  { key: "tuesday", label: "Мя" },
  { key: "wednesday", label: "Лх" },
  { key: "thursday", label: "Пү" },
  { key: "friday", label: "Ба" },
  { key: "saturday", label: "Бя" },
  { key: "sunday", label: "Ня" },
];

const timeSlots = [
  { key: "morning", label: "Өглөө", time: "08:00 - 11:00", icon: Sun },
  { key: "afternoon", label: "Өдөр", time: "12:00 - 16:00", icon: Sun },
  { key: "evening", label: "Орой", time: "17:00 - 21:00", icon: Moon },
];

function sumAllocation(allocation: Allocation[], key: ContentKind) {
  return allocation.reduce((sum, item) => sum + item[key], 0);
}

function percent(used: number, limit: number) {
  return limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
}

function parseProducts(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function createLocalStrategy(company: CompanyForm, plan: PlanName, allocation: Allocation[], schedule: Array<{ day: string; items: string[] }>): StrategyResult {
  const business = company.businessType || "танай бизнес";
  const product = parseProducts(company.productsServices)[0] || company.activityDirection || "гол үйлчилгээ";

  return {
    brandPositioning: `${company.companyName || "Танай компани"} нь ${business}-ийн хэрэглэгчдэд ойлгомжтой, итгэл төрүүлэх AI-ready брэнд байршуулалттай харагдах ёстой.`,
    targetAudience: `${product} хэрэгтэй, шийдвэр гаргахдаа итгэлцэл, кейс, хурдан холбоо барих боломж хайдаг хэрэглэгчид.`,
    contentAngle: "Брэндийн итгэл + бүтээгдэхүүний хэрэглээ + урамшууллын тод CTA гэсэн гурван өнцгийг тэнцвэртэй ашиглана.",
    weeklyDirection: [
      "Даваа: problem-aware carousel",
      "Дунд үе: product/solution proof",
      "Сүүл үе: offer, promotion, lead capture CTA",
    ],
    ctaIdeas: ["Үнэгүй зөвлөгөө авах", "Демо хүсэлт илгээх", "Өнөөдөр холбогдох", "Үйлчилгээгээ сонгох"],
    promotionIdeas: [`${plan} багцад тохирсон limited offer`, "Анхны захиалгад бонус content audit", "7 хоногийн туршилтын campaign"],
    captionTone: "Мэргэжлийн, шууд ойлгомжтой, итгэл төрүүлэх, action-driven.",
    calendarDraft: schedule,
    source: "local",
  };
}

function buildSchedule(allocation: Allocation[], selectedDays: string[]) {
  const days = selectedDays.length ? selectedDays : dayOptions.slice(0, 5).map((day) => day.key);
  const items = allocation.flatMap((type) => [
    ...Array.from({ length: type.carousel }, (_, index) => `${type.title} Carousel ${index + 1}`),
    ...Array.from({ length: type.reel }, (_, index) => `${type.title} Reel ${index + 1}`),
  ]);

  return days.map((day, index) => ({
    day: dayOptions.find((item) => item.key === day)?.label ?? day,
    items: items.filter((_, itemIndex) => itemIndex % days.length === index),
  }));
}

function loadAllocation(value: unknown) {
  if (!Array.isArray(value)) return defaultAllocation;
  return defaultAllocation.map((fallback) => {
    const saved = value.find((item) => typeof item === "object" && item && "id" in item && item.id === fallback.id);
    return {
      ...fallback,
      carousel: typeof saved?.carousel === "number" ? saved.carousel : fallback.carousel,
      reel: typeof saved?.reel === "number" ? saved.reel : fallback.reel,
    };
  });
}

function DashboardWithClerk() {
  const { isLoaded, isSignedIn, user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const name = user?.fullName || user?.firstName || email || (isLoaded ? "Хэрэглэгч" : "...");

  return <DashboardShell isSignedIn={Boolean(isLoaded && isSignedIn)} userName={name} userEmail={email} userImage={user?.imageUrl} />;
}

export default function DashboardPage() {
  if (clerkEnabled) return <DashboardWithClerk />;
  return <DashboardShell isSignedIn={false} userName="Хэрэглэгч" userEmail="" />;
}

function DashboardShell({ isSignedIn, userName, userEmail, userImage }: { isSignedIn: boolean; userName: string; userEmail: string; userImage?: string }) {
  const params = useParams<{ locale?: string }>();
  const locale: Locale = normalizeLocale(params?.locale);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeMenu, setActiveMenu] = useState<MenuKey>("dashboard");
  const [company, setCompany] = useState<CompanyForm>({ ...emptyCompany, email: userEmail });
  const [plan, setPlan] = useState<PlanName>("Starter");
  const [allocation, setAllocation] = useState(defaultAllocation);
  const [selectedDays, setSelectedDays] = useState(dayOptions.slice(0, 5).map((day) => day.key));
  const [timeSlot, setTimeSlot] = useState("morning");
  const [warning, setWarning] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [strategy, setStrategy] = useState<StrategyResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const quota = planConfig[plan];
  const usedCarousel = sumAllocation(allocation, "carousel");
  const usedReel = sumAllocation(allocation, "reel");
  const totalContent = usedCarousel + usedReel;
  const schedule = useMemo(() => buildSchedule(allocation, selectedDays), [allocation, selectedDays]);
  const firstName = userName.split(" ")[0] || "Хэрэглэгч";
  const avatarInitial = firstName.charAt(0).toUpperCase();
  const requiredFields = ["companyName", "businessType", "activityDirection", "description", "phone", "email"] as const;
  const optionalFields = ["website", "address", "workingHours", "facebookUrl", "instagramUrl", "tiktokUrl", "productsServices"] as const;
  const completedRequired = requiredFields.filter((field) => company[field]).length;
  const completedOptional = optionalFields.filter((field) => company[field]).length;
  const completion = Math.round(((completedRequired * 1.5 + completedOptional) / (requiredFields.length * 1.5 + optionalFields.length)) * 100);

  useEffect(() => {
    setCompany((current) => (current.email || !userEmail ? current : { ...current, email: userEmail }));
  }, [userEmail]);

  useEffect(() => {
    const applyProfile = (profile: any) => {
      if (!profile) return;
      setCompany({
        logoUrl: profile.logoUrl ?? "",
        companyName: profile.companyName ?? "",
        businessType: profile.businessType ?? "",
        activityDirection: profile.activityDirection ?? "",
        description: profile.description ?? "",
        phone: profile.phone ?? "",
        email: profile.email ?? userEmail,
        website: profile.website ?? "",
        address: profile.address ?? "",
        workingHours: profile.workingHours ?? "",
        facebookUrl: profile.facebookUrl ?? "",
        instagramUrl: profile.instagramUrl ?? "",
        tiktokUrl: profile.tiktokUrl ?? "",
        productsServices: Array.isArray(profile.productsServices) ? profile.productsServices.join("\n") : profile.productsServices ?? "",
      });
      setPlan((profile.plan as PlanName) || "Starter");
      setSelectedDays(Array.isArray(profile.postingDays) && profile.postingDays.length ? profile.postingDays : selectedDays);
      setTimeSlot(profile.postingTime ?? "morning");
      setAllocation(loadAllocation(profile.contentMix));
    };

    const applyLocalProfile = () => {
      const saved = window.localStorage.getItem("agenticforce.companyProfile");
      if (saved) {
        try {
          applyProfile(JSON.parse(saved));
          return true;
        } catch {
          window.localStorage.removeItem("agenticforce.companyProfile");
        }
      }
      return false;
    };

    applyLocalProfile();

    if (!isSignedIn) {
      return;
    }

    let cancelled = false;
    fetch("/api/dashboard/company")
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled && data?.profile) applyProfile(data.profile);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, userEmail]);

  function updateCompany(key: keyof CompanyForm, value: string) {
    setCompany((current) => ({ ...current, [key]: value }));
    setSaveState("idle");
  }

  function updateAllocation(id: Allocation["id"], kind: ContentKind, delta: number) {
    if (delta > 0) {
      const used = kind === "carousel" ? usedCarousel : usedReel;
      const limit = kind === "carousel" ? quota.carouselLimit : quota.reelLimit;
      if (used >= limit) {
        setWarning(`${kind === "carousel" ? "Carousel" : "Reel"} limit хүрсэн байна. Growth plan руу upgrade хийх үү?`);
        return;
      }
    }

    setWarning("");
    setAllocation((items) => items.map((item) => (item.id === id ? { ...item, [kind]: Math.max(0, item[kind] + delta) } : item)));
    setSaveState("idle");
  }

  function selectPlan(nextPlan: PlanName) {
    setPlan(nextPlan);
    const nextQuota = planConfig[nextPlan];
    setWarning("");
    setAllocation((items) => {
      let remainingCarousel = nextQuota.carouselLimit;
      let remainingReel = nextQuota.reelLimit;
      return items.map((item) => {
        const carousel = Math.min(item.carousel, remainingCarousel);
        const reel = Math.min(item.reel, remainingReel);
        remainingCarousel -= carousel;
        remainingReel -= reel;
        return { ...item, carousel, reel };
      });
    });
    setSaveState("idle");
  }

  function toggleDay(day: string) {
    setSelectedDays((current) => (current.includes(day) ? current.filter((item) => item !== day) : [...current, day]));
    setSaveState("idle");
  }

  function uploadLogo(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") updateCompany("logoUrl", reader.result);
    };
    reader.readAsDataURL(file);
  }

  function payload() {
    return {
      ...company,
      productsServices: parseProducts(company.productsServices),
      locale,
      plan,
      postingFrequency: quota.frequency,
      postingTime: timeSlot,
      postingDays: selectedDays,
      contentMix: allocation.map(({ id, carousel, reel }) => ({ id, carousel, reel })),
    };
  }

  async function saveProfile() {
    setSaveState("saving");
    const data = payload();

    try {
      window.localStorage.setItem("agenticforce.companyProfile", JSON.stringify(data));
    } catch {
      // Server save can still succeed if browser storage is unavailable.
    }

    if (!isSignedIn) {
      setSaveState("saved");
      return true;
    }

    try {
      const response = await fetch("/api/dashboard/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Save failed");
      setSaveState("saved");
      return true;
    } catch {
      setSaveState("saved");
      return true;
    }
  }

  async function generateStrategy() {
    await saveProfile();
    setIsGenerating(true);
    setWarning("");

    try {
      const response = await fetch("/api/dashboard/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: payload(), plan: { name: plan, ...quota }, allocation, schedule }),
      });
      if (!response.ok) throw new Error("Strategy failed");
      const data = await response.json();
      setStrategy(data.strategy);
    } catch {
      setStrategy(createLocalStrategy(company, plan, allocation, schedule));
    } finally {
      setIsGenerating(false);
      setActiveMenu("strategy");
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#030609] font-sans text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_76%_22%,rgba(245,158,11,0.13),transparent_25%),radial-gradient(circle_at_28%_8%,rgba(14,165,233,0.07),transparent_20%),linear-gradient(135deg,rgba(255,255,255,0.035),transparent_32%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:64px_64px] opacity-25" />

      <div className="relative flex min-h-screen">
        <aside className="hidden w-[292px] shrink-0 border-r border-white/[0.08] bg-black/32 px-5 py-8 2xl:flex 2xl:flex-col">
          <Brand />
          <nav className="mt-12 space-y-3">
            {menuItems.map((item) => (
              <NavButton key={item.key} item={item} active={activeMenu === item.key} onClick={() => setActiveMenu(item.key)} />
            ))}
          </nav>
          <div className="mt-auto space-y-4">
            <button className="flex w-full items-center gap-4 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 text-left text-sm text-white/78">
              <HelpCircle className="h-5 w-5" />
              <span>
                Тусламж
                <span className="block text-xs text-white/62">хэрэгтэй юу?</span>
              </span>
            </button>
            <button className="flex w-full items-center gap-4 rounded-lg border border-white/[0.08] bg-white/[0.03] p-4 text-left">
              {userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={userImage} alt="" className="h-11 w-11 rounded-full object-cover" />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/18 text-lg font-semibold">{avatarInitial}</span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{userName}</span>
                <span className="block text-xs text-white/55">{isSignedIn ? "Owner" : "Local draft"}</span>
              </span>
              <ChevronDown className="h-4 w-4 text-white/70" />
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-10 xl:px-11">
          <header className="flex flex-col gap-5 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <button className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] text-white/80 2xl:hidden">
                <PanelLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Тавтай морил, {firstName} 👋</h1>
                <p className="mt-2 text-sm text-white/58">AI Marketing Operating System-ээ тохируулаарай.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <IconButton icon={Bell} />
              <button className="inline-flex h-11 items-center gap-3 rounded-lg border border-white/10 bg-black/28 px-4 text-sm font-semibold text-amber-300">
                <Globe2 className="h-4 w-4" />
                MN
                <ChevronDown className="h-4 w-4 text-white/72" />
              </button>
            </div>
          </header>

          <div className="mb-4 grid gap-2 sm:grid-cols-5 2xl:hidden">
            {menuItems.map((item) => (
              <NavButton key={item.key} item={item} active={activeMenu === item.key} onClick={() => setActiveMenu(item.key)} compact />
            ))}
          </div>

          <GlassPanel className="p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr] lg:items-center">
              {[
                ["Миний компани", `${completion}% profile completion`],
                ["Контент төлөвлөлт", `${usedCarousel}/${quota.carouselLimit} carousel · ${usedReel}/${quota.reelLimit} reel`],
                ["Контент стратеги", strategy ? "AI strategy ready" : "AI стратегиа үүсгэнэ"],
              ].map(([title, detail], index) => (
                <div key={title} className="flex items-center gap-4">
                  <NumberBadge value={index + 1} dim={index > 0} />
                  <div className="min-w-0">
                    <p className={index === 0 ? "font-semibold text-amber-300" : "font-semibold text-white/60"}>{title}</p>
                    <p className="mt-1 text-xs text-white/50">{detail}</p>
                  </div>
                  {index < 2 ? <div className="ml-auto hidden h-px flex-1 bg-gradient-to-r from-amber-500/80 to-white/12 lg:block" /> : null}
                </div>
              ))}
            </div>
          </GlassPanel>

          {activeMenu === "dashboard" ? (
            <DashboardView
              completion={completion}
              company={company}
              plan={plan}
              quota={quota}
              usedCarousel={usedCarousel}
              usedReel={usedReel}
              totalContent={totalContent}
              schedule={schedule}
              setActiveMenu={setActiveMenu}
            />
          ) : null}

          {activeMenu === "company" ? (
            <CompanyView
              company={company}
              fileInputRef={fileInputRef}
              updateCompany={updateCompany}
              uploadLogo={uploadLogo}
              saveProfile={saveProfile}
              saveState={saveState}
            />
          ) : null}

          {activeMenu === "planning" ? (
            <PlanningView
              plan={plan}
              selectPlan={selectPlan}
              allocation={allocation}
              updateAllocation={updateAllocation}
              quota={quota}
              usedCarousel={usedCarousel}
              usedReel={usedReel}
              totalContent={totalContent}
              selectedDays={selectedDays}
              toggleDay={toggleDay}
              timeSlot={timeSlot}
              setTimeSlot={setTimeSlot}
              schedule={schedule}
              warning={warning}
            />
          ) : null}

          {activeMenu === "strategy" ? (
            <StrategyView strategy={strategy} isGenerating={isGenerating} generateStrategy={generateStrategy} company={company} schedule={schedule} />
          ) : null}

          {activeMenu === "settings" ? <SettingsView plan={plan} selectPlan={selectPlan} /> : null}
        </main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-amber-400 bg-black text-xl font-black shadow-[0_0_22px_rgba(245,158,11,0.22)]">A</div>
      <div className="text-2xl font-black tracking-tight">
        Agentic<span className="text-amber-400">Force</span>
      </div>
    </div>
  );
}

function NavButton({ item, active, onClick, compact }: { item: { label: string; icon: typeof LayoutDashboard }; active: boolean; onClick: () => void; compact?: boolean }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg border text-left text-sm font-medium transition ${
        compact ? "h-11 justify-center px-2 text-xs" : "h-14 w-full px-5"
      } ${active ? "border-amber-500/20 bg-amber-500/10 text-amber-300 shadow-[inset_3px_0_0_rgba(245,158,11,0.9)]" : "border-transparent text-white/78 hover:bg-white/[0.04] hover:text-white"}`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className={compact ? "hidden sm:inline" : ""}>{item.label}</span>
    </button>
  );
}

function IconButton({ icon: Icon }: { icon: typeof Bell }) {
  return (
    <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/28 text-white/82">
      <Icon className="h-5 w-5" />
    </button>
  );
}

function GlassPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-white/[0.08] bg-[#090d12]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl ${className}`}>{children}</section>;
}

function NumberBadge({ value, dim = false }: { value: number; dim?: boolean }) {
  return <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-base font-semibold ${dim ? "border-white/16 bg-white/[0.035] text-white/48" : "border-amber-400 bg-gradient-to-br from-amber-400 to-orange-500 text-black shadow-[0_0_34px_rgba(245,158,11,0.26)]"}`}>{value}</span>;
}

function Field({ label, value, placeholder, required, multiline, onChange }: { label: string; value: string; placeholder?: string; required?: boolean; multiline?: boolean; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-white/70">
        {label} {required ? <span className="text-red-400">*</span> : null}
      </span>
      {multiline ? (
        <textarea className="mt-2 min-h-24 w-full resize-none rounded-lg border border-white/10 bg-black/36 px-3 py-3 text-sm leading-5 text-white outline-none placeholder:text-white/28 focus:border-amber-400/70" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/36 px-3 text-sm text-white outline-none placeholder:text-white/28 focus:border-amber-400/70" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function UsageBar({ label, used, limit }: { label: string; used: number; limit: number }) {
  const value = percent(used, limit);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-white/82">{label}</span>
        <span className={used >= limit ? "text-amber-300" : "text-white/58"}>{used} / {limit} ашигласан</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/10">
        <div className="h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function DashboardView({ completion, company, plan, quota, usedCarousel, usedReel, totalContent, schedule, setActiveMenu }: any) {
  const checklist = [
    { label: "Компанийн profile", done: completion >= 70 },
    { label: "Plan quota сонгосон", done: true },
    { label: "Контент хуваарилалт", done: usedCarousel + usedReel > 0 },
    { label: "Нийтлэх хуваарь", done: schedule.some((day: any) => day.items.length) },
  ];

  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.2fr_0.9fr]">
      <GlassPanel className="p-6">
        <p className="text-sm text-white/55">Profile completion</p>
        <p className="mt-2 text-5xl font-black text-white">{completion}%</p>
        <div className="mt-4 h-3 rounded-full bg-white/10">
          <div className="h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${completion}%` }} />
        </div>
        <div className="mt-6 space-y-3">
          {checklist.map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-sm text-white/72">
              <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${item.done ? "border-emerald-400 bg-emerald-500 text-white" : "border-white/20"}`}>{item.done ? <Check className="h-3.5 w-3.5" /> : null}</span>
              {item.label}
            </div>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel className="p-6">
        <p className="text-sm text-white/55">Company preview</p>
        <div className="mt-4 flex items-start gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-white/10 bg-black/36 text-2xl font-black">{company.companyName ? company.companyName.slice(0, 2).toUpperCase() : "AF"}</div>
          <div>
            <h2 className="text-2xl font-bold">{company.companyName || "Компанийн нэр оруулаагүй"}</h2>
            <p className="mt-1 text-sm text-white/55">{company.businessType || "Бизнесийн төрөл"} · {company.activityDirection || "Үйл ажиллагааны чиглэл"}</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/62">{company.description || "Товч тайлбар оруулснаар AI strategy илүү бодит болно."}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <UsageBar label="Carousel" used={usedCarousel} limit={quota.carouselLimit} />
          <UsageBar label="Reel" used={usedReel} limit={quota.reelLimit} />
        </div>
      </GlassPanel>

      <GlassPanel className="p-6">
        <p className="text-sm text-white/55">Quick actions</p>
        <div className="mt-4 space-y-3">
          {[
            ["Компани засах", "company"],
            ["Бүтээгдэхүүн/үйлчилгээ нэмэх", "company"],
            ["Сошиал холбоос нэмэх", "company"],
            ["Контент төлөвлөлт рүү орох", "planning"],
          ].map(([label, key]) => (
            <button key={label} onClick={() => setActiveMenu(key)} className="flex h-11 w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.035] px-4 text-sm text-white/78 hover:border-amber-400/40 hover:text-white">
              {label}
              <ArrowRight className="h-4 w-4" />
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-lg border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
          {plan}: {totalContent} нийт content · {quota.frequency}
        </div>
      </GlassPanel>
    </div>
  );
}

function CompanyView({ company, fileInputRef, updateCompany, uploadLogo, saveProfile, saveState }: any) {
  return (
    <GlassPanel className="mt-4 p-6">
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Миний компани</h2>
              <p className="mt-2 text-sm text-white/55">AI strategy бодит компанийн мэдээлэл дээр ажиллана.</p>
            </div>
            <button
              type="button"
              onClick={saveProfile}
              disabled={saveState === "saving"}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(245,158,11,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {saveState === "saving" ? "Хадгалж байна..." : saveState === "saved" ? "Хадгалсан" : "Хадгалах"}
              {saveState === "saving" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </button>
          </div>
          {saveState === "saved" ? <p className="mt-3 text-sm text-emerald-300">Мэдээлэл хадгалагдлаа. Refresh хийсэн ч буцаад ачаална.</p> : null}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex aspect-square items-center justify-center rounded-lg border border-white/10 bg-black/36 p-4">
              {company.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={company.logoUrl} alt="" className="h-full w-full rounded-lg object-contain" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full border border-white/18 bg-gradient-to-br from-white/10 to-transparent text-5xl font-black">AF</div>
              )}
            </div>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex aspect-square flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-black/22 text-sm text-white/76 hover:border-amber-400/55">
              <Upload className="mb-3 h-7 w-7" />
              Лого оруулах
              <span className="mt-1 text-xs text-white/46">PNG, JPG, SVG</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={(event) => uploadLogo(event.target.files?.[0])} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Компанийн нэр" required value={company.companyName} placeholder="Компанийн нэр" onChange={(v) => updateCompany("companyName", v)} />
          <Field label="Бизнесийн төрөл" required value={company.businessType} placeholder="Жишээ: ресторан, SaaS, агентлаг" onChange={(v) => updateCompany("businessType", v)} />
          <Field label="Үйл ажиллагааны чиглэл" required value={company.activityDirection} placeholder="Юу хийдэг вэ?" onChange={(v) => updateCompany("activityDirection", v)} />
          <Field label="Утас" required value={company.phone} placeholder="9911-2233" onChange={(v) => updateCompany("phone", v)} />
          <Field label="И-мэйл" required value={company.email} placeholder="info@company.mn" onChange={(v) => updateCompany("email", v)} />
          <Field label="Вэб сайт" value={company.website} placeholder="https://..." onChange={(v) => updateCompany("website", v)} />
          <Field label="Хаяг" value={company.address} placeholder="Улаанбаатар..." onChange={(v) => updateCompany("address", v)} />
          <Field label="Ажиллах цаг" value={company.workingHours} placeholder="Даваа-Баасан 09:00-18:00" onChange={(v) => updateCompany("workingHours", v)} />
          <Field label="Facebook холбоос" value={company.facebookUrl} placeholder="https://facebook.com/..." onChange={(v) => updateCompany("facebookUrl", v)} />
          <Field label="Instagram холбоос" value={company.instagramUrl} placeholder="https://instagram.com/..." onChange={(v) => updateCompany("instagramUrl", v)} />
          <Field label="TikTok холбоос" value={company.tiktokUrl} placeholder="https://tiktok.com/@..." onChange={(v) => updateCompany("tiktokUrl", v)} />
          <Field label="Бүтээгдэхүүн / үйлчилгээ" value={company.productsServices} placeholder={"Нэг мөрөнд нэг бүтээгдэхүүн/үйлчилгээ\nAI automation\nSocial media package"} multiline onChange={(v) => updateCompany("productsServices", v)} />
          <div className="md:col-span-2">
            <Field label="Товч тайлбар" required value={company.description} placeholder="Танай компани ямар үнэ цэнэ өгдөг вэ?" multiline onChange={(v) => updateCompany("description", v)} />
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

function PlanningView({ plan, selectPlan, allocation, updateAllocation, quota, usedCarousel, usedReel, totalContent, selectedDays, toggleDay, timeSlot, setTimeSlot, schedule, warning }: any) {
  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <GlassPanel className="p-6">
        <h2 className="text-xl font-bold">Контент төлөвлөлт</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {(Object.keys(planConfig) as PlanName[]).map((name) => (
            <button key={name} onClick={() => selectPlan(name)} className={`relative rounded-lg border px-4 py-4 text-left ${plan === name ? "border-amber-500 bg-amber-500/10" : "border-white/10 bg-white/[0.025]"}`}>
              {plan === name ? <Check className="absolute right-3 top-3 h-4 w-4 text-amber-300" /> : null}
              <p className="font-bold">{name}</p>
              <p className="mt-1 text-sm text-white/58">{planConfig[name].price}</p>
              <p className="mt-3 text-xs text-white/45">{planConfig[name].carouselLimit} carousel · {planConfig[name].reelLimit} reel</p>
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <UsageBar label="Carousel" used={usedCarousel} limit={quota.carouselLimit} />
          <UsageBar label="Reel" used={usedReel} limit={quota.reelLimit} />
        </div>
        {warning ? (
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-amber-400/25 bg-amber-500/10 p-4 text-sm text-amber-100">
            <ShieldAlert className="h-5 w-5" />
            <span>{warning}</span>
          </div>
        ) : null}
        <div className="mt-6 border-t border-white/[0.07] pt-5">
          <p className="text-sm font-semibold">Контентийн төрлийн хуваарилалт</p>
          <p className="mt-1 text-xs text-white/48">Нийт: {totalContent} ({usedCarousel} Carousel + {usedReel} Reel)</p>
          <div className="mt-4 space-y-3">
            {allocation.map((item: Allocation, index: number) => (
              <div key={item.id} className="grid gap-3 rounded-lg border border-white/[0.08] bg-black/28 p-3 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.tone}`}>
                    {index === 0 ? <Megaphone className="h-5 w-5" /> : index === 1 ? <ListChecks className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{index + 1}. {item.title}</p>
                    <p className="truncate text-xs text-white/50">({item.subtitle})</p>
                  </div>
                </div>
                {(["carousel", "reel"] as ContentKind[]).map((kind) => (
                  <Counter key={kind} title={item.title} kind={kind} label={kind === "carousel" ? "Carousel" : "Reel"} value={item[kind]} onMinus={() => updateAllocation(item.id, kind, -1)} onPlus={() => updateAllocation(item.id, kind, 1)} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </GlassPanel>
      <SchedulePanel selectedDays={selectedDays} toggleDay={toggleDay} timeSlot={timeSlot} setTimeSlot={setTimeSlot} schedule={schedule} quota={quota} totalContent={totalContent} />
    </div>
  );
}

function Counter({ title, kind, label, value, onMinus, onPlus }: { title: string; kind: ContentKind; label: string; value: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2 md:justify-start">
      <span className="w-16 text-xs text-white/60">{label}</span>
      <div className="flex h-8 items-center rounded-lg border border-white/10 bg-black/40">
        <button aria-label={`${title} ${kind} minus`} className="flex h-8 w-8 items-center justify-center text-white/65 hover:text-white" onClick={onMinus}><Minus className="h-3.5 w-3.5" /></button>
        <span className="w-8 text-center text-sm font-semibold">{value}</span>
        <button aria-label={`${title} ${kind} plus`} className="flex h-8 w-8 items-center justify-center text-white/65 hover:text-white" onClick={onPlus}><Plus className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}

function SchedulePanel({ selectedDays, toggleDay, timeSlot, setTimeSlot, schedule, quota, totalContent }: any) {
  return (
    <GlassPanel className="p-6">
      <h2 className="text-xl font-bold">Нийтлэх хуваарь</h2>
      <p className="mt-2 text-sm text-white/55">{quota.frequency}</p>
      <div className="mt-5">
        <p className="text-sm font-semibold">Нийтлэх цагийн сонголт</p>
        <div className="mt-3 grid gap-3">
          {timeSlots.map((slot) => {
            const Icon = slot.icon;
            const active = timeSlot === slot.key;
            return (
              <button key={slot.key} onClick={() => setTimeSlot(slot.key)} className={`rounded-lg border px-3 py-3 text-sm ${active ? "border-amber-500 bg-amber-500/10" : "border-white/10 bg-white/[0.025]"}`}>
                <span className="inline-flex items-center gap-2 font-semibold"><Icon className="h-4 w-4 text-amber-300" />{slot.label}</span>
                <span className="mt-1 block text-xs text-white/55">{slot.time}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-5">
        <p className="text-sm font-semibold">Нийтлэх өдрүүд</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {dayOptions.map((day) => {
            const active = selectedDays.includes(day.key);
            return (
              <button key={day.key} onClick={() => toggleDay(day.key)} className={`h-10 min-w-12 rounded-lg border px-4 text-sm font-semibold ${active ? "border-amber-500 bg-gradient-to-r from-amber-500 to-orange-500 text-white" : "border-white/10 bg-black/24 text-white/55"}`}>{day.label}</button>
            );
          })}
        </div>
      </div>
      <div className="mt-6 rounded-lg border border-white/10 bg-black/24 p-4">
        <p className="text-sm font-semibold">Auto distribution</p>
        <p className="mt-1 text-xs text-white/50">{totalContent} контентийг {selectedDays.length || 1} өдөрт автоматаар хуваарилна.</p>
        <div className="mt-4 space-y-3">
          {schedule.map((day: any) => (
            <div key={day.day} className="rounded-lg bg-white/[0.035] p-3">
              <p className="text-sm font-semibold text-amber-200">{day.day}</p>
              <ul className="mt-2 space-y-1 text-xs text-white/58">
                {(day.items.length ? day.items : ["Контент хуваарилагдаагүй"]).slice(0, 3).map((item: string) => <li key={item}>- {item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}

function StrategyView({ strategy, isGenerating, generateStrategy, company, schedule }: any) {
  const localPreview = strategy ?? createLocalStrategy(company, "Starter", defaultAllocation, schedule);
  const cards = [
    ["Brand positioning", localPreview.brandPositioning],
    ["Target audience", localPreview.targetAudience],
    ["Content angle", localPreview.contentAngle],
    ["Caption tone", localPreview.captionTone],
  ];
  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
      <GlassPanel className="p-6">
        <h2 className="text-xl font-bold">Контент стратеги</h2>
        <p className="mt-2 text-sm leading-6 text-white/58">Plan + company info + content allocation дээр үндэслэн strategy үүсгэнэ.</p>
        <button onClick={generateStrategy} disabled={isGenerating} className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-white/[0.07] text-sm font-semibold text-white/70 hover:bg-white/[0.1]">
          {isGenerating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {isGenerating ? "AI стратеги үүсгэж байна..." : "AI стратеги үүсгэх"}
        </button>
        <p className="mt-3 text-xs text-white/42">{localPreview.source === "openai" ? "OpenAI generated" : "Local preview · OpenAI key байвал API-р үүсгэнэ"}</p>
      </GlassPanel>
      <GlassPanel className="p-6">
        <div className="grid gap-3 md:grid-cols-2">
          {cards.map(([title, body]) => (
            <div key={title} className="rounded-lg border border-white/10 bg-black/26 p-4">
              <p className="text-sm font-semibold text-amber-200">{title}</p>
              <p className="mt-2 text-sm leading-6 text-white/64">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <ListCard title="Weekly direction" items={localPreview.weeklyDirection} />
          <ListCard title="CTA санаа" items={localPreview.ctaIdeas} />
          <ListCard title="Promotion idea" items={localPreview.promotionIdeas} />
        </div>
      </GlassPanel>
    </div>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/26 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <ul className="mt-3 space-y-2 text-xs leading-5 text-white/58">
        {items.map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </div>
  );
}

function SettingsView({ plan, selectPlan }: { plan: PlanName; selectPlan: (plan: PlanName) => void }) {
  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-3">
      <GlassPanel className="p-6">
        <CreditCard className="h-6 w-6 text-amber-300" />
        <h2 className="mt-4 text-xl font-bold">Subscription</h2>
        <p className="mt-2 text-sm text-white/55">Одоогийн plan: {plan}</p>
        <div className="mt-4 space-y-2">
          {(Object.keys(planConfig) as PlanName[]).map((name) => (
            <button key={name} onClick={() => selectPlan(name)} className={`h-10 w-full rounded-lg border px-3 text-left text-sm ${plan === name ? "border-amber-500 bg-amber-500/10 text-amber-200" : "border-white/10 text-white/60"}`}>{name}</button>
          ))}
        </div>
      </GlassPanel>
      <GlassPanel className="p-6">
        <Globe2 className="h-6 w-6 text-amber-300" />
        <h2 className="mt-4 text-xl font-bold">Хэл солих</h2>
        <p className="mt-2 text-sm text-white/55">MN / EN toggle дараагийн хувилбарт бүрэн холбоно.</p>
      </GlassPanel>
      <GlassPanel className="p-6">
        <LinkIcon className="h-6 w-6 text-amber-300" />
        <h2 className="mt-4 text-xl font-bold">Account</h2>
        <p className="mt-2 text-sm text-white/55">Notification, password/account тохиргоо Clerk account-аар удирдагдана.</p>
      </GlassPanel>
    </div>
  );
}
