"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Cloud,
  Code2,
  Cpu,
  GraduationCap,
  Handshake,
  HeartPulse,
  Landmark,
  Leaf,
  Lightbulb,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Network,
  Phone,
  Play,
  Presentation,
  QrCode,
  Rocket,
  School,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ModalType = "details" | "register" | null;

type RegistrationForm = {
  fullName: string;
  email: string;
  phone: string;
  schoolName: string;
  participantTypes: string[];
  teamSize: string;
  challengeTrack: string;
  hasMentor: boolean;
  mentorName: string;
  mentorPhone: string;
  mentorEmail: string;
  mentorOrganization: string;
};

const navItems = [
  { label: "Нүүр", href: "#home" },
  { label: "Тухай", href: "#about" },
  { label: "Challenge", href: "#challenge" },
  { label: "Хөтөлбөр", href: "#schedule" },
  { label: "Шагнал", href: "#prizes" },
  { label: "FAQ", href: "#faq" },
];

const tracks = [
  {
    icon: Car,
    title: "Smart Traffic",
    description: "Түгжрэл, нийтийн тээвэр, parking, замын хөдөлгөөнийг AI-аар сайжруулах шийдэл.",
    color: "text-orange-200",
  },
  {
    icon: Leaf,
    title: "Smart Environment",
    description: "Агаарын бохирдол, хог ангилалт, ногоон хотын дата шийдлүүд.",
    color: "text-emerald-300",
  },
  {
    icon: GraduationCap,
    title: "Smart Education",
    description: "AI багш, сурагчийн туслах, карьер төлөвлөгөө, сургалтын хүртээмж.",
    color: "text-fuchsia-300",
  },
  {
    icon: Landmark,
    title: "Smart Government",
    description: "Иргэдийн үйлчилгээ, өргөдөл гомдол, chatbot, хотын мэдээлэл.",
    color: "text-violet-300",
  },
  {
    icon: HeartPulse,
    title: "Smart Health & Safety",
    description: "Эрүүл мэнд, осол, аюулгүй байдал, эрсдэлийн сэрэмжлүүлэг.",
    color: "text-cyan-300",
  },
  {
    icon: Lightbulb,
    title: "Open Innovation",
    description: "Өөрийн smart city санаагаа дэвшүүлж, prototype болгон хөгжүүлэх.",
    color: "text-yellow-300",
  },
];

const floatingIcons = [
  { icon: Car, label: "traffic", className: "left-[55%] top-[22%]" },
  { icon: GraduationCap, label: "education", className: "right-[13%] top-[17%]" },
  { icon: Leaf, label: "environment", className: "right-[6%] top-[34%]" },
  { icon: HeartPulse, label: "health", className: "right-[10%] top-[54%]" },
  { icon: Landmark, label: "government", className: "left-[48%] top-[48%]" },
  { icon: BrainCircuit, label: "AI", className: "left-[67%] top-[39%]" },
];

const processSteps = [
  { icon: Search, label: "Асуудал сонгоно" },
  { icon: BrainCircuit, label: "AI шийдэл боловсруулна" },
  { icon: Code2, label: "Prototype хийнэ" },
  { icon: Presentation, label: "Demo танилцуулна" },
  { icon: Trophy, label: "Шагналын төлөө тэмцэнэ" },
];

const audience = [
  { icon: School, text: "Ахлах ангийн сурагчид" },
  { icon: GraduationCap, text: "Их, дээд сургуулийн оюутнууд" },
  { icon: Sparkles, text: "AI, design, business, presentation сонирхдог залуус" },
];

const schedule = [
  {
    day: "06/22",
    title: "Build Day",
    items: [
      ["09:00", "Бүртгэл, нээлт"],
      ["10:00", "Challenge танилцуулга"],
      ["11:00", "AI tool workshop"],
      ["13:00", "Багийн ажил эхлэх"],
      ["14:00", "Mentor session"],
      ["18:00", "Prototype development"],
    ],
  },
  {
    day: "06/23",
    title: "Demo Day",
    items: [
      ["09:00", "Final build"],
      ["11:00", "Submission"],
      ["13:00", "Pitch presentation"],
      ["16:00", "Live demo & Q&A"],
      ["18:00", "Шагнал гардуулах"],
    ],
  },
];

const judging = [
  ["Асуудал шийдэл", "25%"],
  ["AI ашиглалт", "25%"],
  ["Шинэлэг байдал", "20%"],
  ["Prototype / Demo", "15%"],
  ["Pitch presentation", "15%"],
];

const prizes = [
  { title: "1-р байр", subtitle: "Grand Prize", tone: "from-[#ffb300] to-[#ff6a00]" },
  { title: "2-р байр", subtitle: "Runner Up", tone: "from-zinc-200 to-zinc-500" },
  { title: "3-р байр", subtitle: "3rd Place", tone: "from-[#ff8a3d] to-[#7a2a00]" },
  { title: "Special Awards", subtitle: "Best AI, Design, Social Impact", tone: "from-[#ffd166] to-[#ff9800]" },
];

const benefits = [
  { icon: BrainCircuit, text: "AI ашиглаж бодит project хийх туршлага" },
  { icon: Trophy, text: "Startup санаагаа эхлүүлэх боломж" },
  { icon: Handshake, text: "Mentor-уудаас суралцах боломж" },
  { icon: ClipboardCheck, text: "Шагнал, certificate" },
  { icon: Rocket, text: "Portfolio-д орох бүтээлтэй болно" },
  { icon: UsersRound, text: "Шинэ найз, шинэ баг, шинэ боломж" },
];

const faqs = [
  {
    question: "Coding мэдэхгүй бол болох уу?",
    answer:
      "Болно. No-code, design, presentation, судалгаа, business model зэрэг олон үүрэгтэй багууд оролцоно.",
  },
  {
    question: "Ганцаараа оролцож болох уу?",
    answer:
      "Болно, гэхдээ 2-3 хүний баг илүү үр дүнтэй. Ганцаараа бүртгүүлсэн оролцогчдод баг бүрдүүлэхэд тусална.",
  },
  {
    question: "Ямар AI tool ашиглаж болох вэ?",
    answer:
      "ChatGPT, Claude, Gemini, Cursor, Replit, Figma, Canva болон бусад хууль ёсны AI, no-code, code tool ашиглаж болно.",
  },
  {
    question: "Ахлах ангийн сурагчид оролцож болох уу?",
    answer:
      "Тийм. Ахлах ангийн сурагчид, их дээд сургуулийн оюутнууд, бүтээлч залуус бүгд оролцох боломжтой.",
  },
  {
    question: "Өмнө бэлдсэн системээр оролцож болох уу?",
    answer: "Болно. Гэхдээ тэмцээний үеэр тухайн системээ сайжруулж, challenge-д нийцүүлэн demo хэлбэрээр танилцуулна.",
  },
  {
    question: "Тэмцээний үеэр хоол, цайгаар үйлчлэх үү?",
    answer:
      "Тийм. AITHON 2026 тэмцээний хоёр өдрийн турш оролцогчдыг өдрийн хоол, цай, усаар хангана. Та зөвхөн өөрийн notebook болон бүтээлч санаагаа авч ирэхэд хангалттай.",
  },
  {
    question: "Оролцох төлбөртэй юу?",
    answer: "Үгүй. Оролцоо үнэ төлбөргүй.",
  },
  {
    question: "Төсөл заавал бүрэн ажилладаг байх ёстой юу?",
    answer: "Үгүй. Prototype буюу ажиллах боломжтой загвар, demo хувилбар байхад хангалттай.",
  },
  {
    question: "Интернэтээр хангах уу?",
    answer: "Тийм. Тэмцээний үеэр интернет холболт болон ажиллах орчин бэлэн байна.",
  },
];

const organizers = [
  {
    name: "Нийслэлийн Бизнес Инновац Хөгжлийн Газар",
    logo: "/aithon-organizer-bida.png",
    href: "https://bida.ub.gov.mn/",
  },
  {
    name: "Postly",
    logo: "/aithon-organizer-postly.png",
    href: "https://postly.mn",
  },
  {
    name: "UNIT",
    logo: "/aithon-organizer-unit.png",
    href: "https://sumbee.mn",
  },
  {
    name: "Монголын Хиймэл Оюуны Инновацийн Холбоо",
    logo: "/aithon-organizer-mongol-ai-innovation.png",
  },
];

const initialForm: RegistrationForm = {
  fullName: "",
  email: "",
  phone: "",
  schoolName: "",
  participantTypes: [],
  teamSize: "3 хүн",
  challengeTrack: "Smart Traffic",
  hasMentor: false,
  mentorName: "",
  mentorPhone: "",
  mentorEmail: "",
  mentorOrganization: "",
};

export function Aithon2026Client() {
  const [modal, setModal] = useState<ModalType>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState<RegistrationForm>(initialForm);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = modal || mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal, mobileOpen]);

  const openRegistration = () => {
    alert("Бүртгэл хаагдсан 🚫 AITHON 2026 бүртгэл дууслаа.");
  };

  const updateField = <K extends keyof RegistrationForm>(key: K, value: RegistrationForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleParticipant = (value: string) => {
    setForm((current) => {
      const exists = current.participantTypes.includes(value);
      return {
        ...current,
        participantTypes: exists
          ? current.participantTypes.filter((item) => item !== value)
          : [...current.participantTypes, value],
      };
    });
  };

  const submitRegistration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("submitting");
    setError("");

    try {
      const response = await fetch("/api/aithon2026/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Registration failed");
      }

      setSubmitState("success");
      setForm(initialForm);
    } catch (submitError) {
      setSubmitState("error");
      setError(submitError instanceof Error ? submitError.message : "Бүртгэл илгээхэд алдаа гарлаа.");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <NoiseLayer />
      <AithonNavbar
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
        onDetails={() => setModal("details")}
        onRegister={openRegistration}
      />

      <main>
        <HeroSection onDetails={() => setModal("details")} onRegister={openRegistration} />
        <OrganizersSection />
        <AboutSection />
        <AudienceSection />
        <ChallengeTracksSection />
        <ScheduleAndJudgingSection />
        <PrizeSection />
        <BenefitsSection />
        <SponsorsSection />
        <FaqSection />
        <FinalCtaSection onRegister={openRegistration} />
      </main>

      <AnimatePresence>
        {modal === "details" && <DetailsModal onClose={() => setModal(null)} onRegister={openRegistration} />}
        {modal === "register" && (
          <RegistrationModal
            form={form}
            submitState={submitState}
            error={error}
            onClose={() => setModal(null)}
            onSubmit={submitRegistration}
            onFieldChange={updateField}
            onParticipantToggle={toggleParticipant}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function OrganizersSection() {
  return (
    <section className="relative px-5 pb-8 pt-0 sm:px-6 lg:pb-10">
      <div className="mx-auto max-w-7xl">
        <GlassCard className="px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.26em] text-[#ff9800]">Зохион байгуулагчид</p>
              <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">Хамтран хэрэгжүүлэгч байгууллагууд</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[650px]">
              {organizers.map((organizer) => (
                <motion.a
                  key={organizer.name}
                  href={organizer.href || undefined}
                  target={organizer.href ? "_blank" : undefined}
                  rel={organizer.href ? "noreferrer" : undefined}
                  whileHover={{ y: -5, scale: 1.025 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="group flex h-24 items-center justify-center rounded-2xl border border-[#ffaa0026] bg-white/[0.035] p-4 transition hover:border-[#ffb300]/55 hover:bg-[#ff9800]/[0.075] hover:shadow-[0_0_28px_rgba(255,152,0,0.16)]"
                  aria-label={organizer.href ? `${organizer.name} website` : `${organizer.name} logo`}
                >
                  <img
                    src={organizer.logo}
                    alt={organizer.name}
                    className="max-h-16 max-w-[160px] object-contain transition duration-200 group-hover:brightness-110"
                    loading="lazy"
                  />
                </motion.a>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function AithonNavbar({
  mobileOpen,
  onMobileOpenChange,
  onDetails,
  onRegister,
}: {
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  onDetails: () => void;
  onRegister: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between rounded-[18px] border border-[#ffaa0026] bg-black/65 px-4 shadow-[0_0_42px_rgba(255,152,0,0.13)] backdrop-blur-xl sm:px-6">
        <div className="pointer-events-none absolute inset-x-[18%] -bottom-8 h-10 bg-[#ff9800]/15 blur-3xl" />
        <a href="#home" className="relative z-10 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-[#ffb300]/40 bg-[#ff9800]/10 shadow-[0_0_22px_rgba(255,152,0,0.25)]">
            <Network className="h-5 w-5 text-[#ffb300]" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-extrabold tracking-wide text-white">SMART CITY</span>
            <span className="block text-xs font-bold text-[#ffb300]">AI HACKATHON 2026</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/75 transition hover:bg-white/[0.04] hover:text-[#ffb300]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            type="button"
            onClick={onDetails}
            className="h-10 rounded-xl border border-[#ffaa0026] bg-white/[0.03] px-4 text-sm text-white hover:border-[#ffb300]/60 hover:bg-[#ff9800]/10"
          >
            Дэлгэрэнгүй үзэх
          </Button>
          <GlowButton onClick={onRegister} className="h-10 px-5">
            Бүртгүүлэх
          </GlowButton>
        </div>

        <Button
          type="button"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          onClick={() => onMobileOpenChange(!mobileOpen)}
          className="relative z-10 h-10 w-10 rounded-xl border border-[#ffaa0026] bg-white/[0.04] p-0 text-white hover:bg-[#ff9800]/10 lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-2 max-w-7xl rounded-2xl border border-[#ffaa0026] bg-black/90 p-3 shadow-[0_0_34px_rgba(255,152,0,0.14)] backdrop-blur-xl lg:hidden"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => onMobileOpenChange(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-white/80 hover:bg-[#ff9800]/10 hover:text-[#ffb300]"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                onClick={() => {
                  onMobileOpenChange(false);
                  onDetails();
                }}
                className="rounded-xl border border-[#ffaa0026] bg-white/[0.03] text-white hover:bg-[#ff9800]/10"
              >
                Дэлгэрэнгүй үзэх
              </Button>
              <GlowButton
                onClick={() => {
                  onMobileOpenChange(false);
                  onRegister();
                }}
              >
                Бүртгүүлэх
              </GlowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeroSection({ onDetails, onRegister }: { onDetails: () => void; onRegister: () => void }) {
  return (
    <section id="home" className="relative min-h-[610px] overflow-hidden pt-20 sm:pt-24">
      <div
        className="absolute inset-y-0 right-0 w-full bg-cover bg-[center_bottom] opacity-95 lg:w-[74%] lg:bg-[right_bottom]"
        style={{ backgroundImage: "url('/aithon2026-hero.png')" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(255,152,0,0.20),transparent_24%),linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.95)_31%,rgba(5,5,5,0.36)_66%,rgba(5,5,5,0.72)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,179,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,179,0,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />
      <HeroAnimations />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 pb-9 pt-6 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:pb-11 lg:pt-7">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-[610px]"
        >
          <h1 className="text-[clamp(2.75rem,5vw,4.9rem)] font-black uppercase leading-[0.93] tracking-normal text-white">
            SMART CITY
            <span className="mt-1 flex flex-wrap items-baseline gap-x-3">
              <span className="bg-gradient-to-r from-[#ffb300] via-[#ff9800] to-[#ff6a00] bg-clip-text text-transparent">
                AI HACKATHON
              </span>
              <span>2026</span>
            </span>
          </h1>
          <p className="mt-4 text-[clamp(1rem,2vw,1.38rem)] font-extrabold text-[#ffb300]">
            AI ашиглан ирээдүйн хотоо бүтээе.
          </p>
          <p className="mt-4 max-w-[520px] text-sm leading-7 text-zinc-200 sm:text-base">
            Ахлах анги болон оюутан залуус AI ашиглан хотын бодит асуудлыг 2 өдрийн дотор шийдэх бүтээлч тэмцээн.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-white">
            <InfoPill icon={CalendarDays}>2026.06.22 - 06.23 · 9:00-18:00</InfoPill>
            <InfoPill icon={MapPin} href="https://maps.app.goo.gl/w8AAKfN28csefZfo9">
              Техник технологийн их сургууль, 10-р хороолол
            </InfoPill>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <GlowButton onClick={onRegister} className="h-12 min-w-[190px] rounded-lg px-6 text-sm">
              Багаа бүртгүүлэх <ArrowRight className="h-5 w-5" />
            </GlowButton>
            <Button
              type="button"
              onClick={onDetails}
              className="h-12 min-w-[190px] rounded-lg border border-[#ffaa0033] bg-black/40 px-6 text-sm font-bold text-white backdrop-blur hover:border-[#ffb300]/70 hover:bg-[#ff9800]/10"
            >
              Дэлгэрэнгүй үзэх <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        <div className="relative hidden min-h-[430px] lg:block">
          {floatingIcons.map((item, index) => (
            <FloatingIcon key={item.label} {...item} delay={index * 0.22} />
          ))}
          <motion.div
            animate={{ opacity: [0.45, 0.8, 0.45], scale: [1, 1.04, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-[34%] h-32 w-32 rounded-full border border-[#ffb300]/30 bg-[#ff9800]/10 blur-sm"
          />
        </div>
      </div>
    </section>
  );
}

function HeroAnimations() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        left: `${18 + ((index * 23) % 76)}%`,
        top: `${12 + ((index * 31) % 70)}%`,
        delay: index * 0.19,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={`road-${index}`}
          animate={{ x: ["-18%", "28%", "-18%"], opacity: [0.12, 0.8, 0.12] }}
          transition={{ duration: 4.8 + index * 0.7, repeat: Infinity, delay: index * 0.45, ease: "easeInOut" }}
          className="absolute left-[43%] h-[2px] w-[34rem] origin-left bg-gradient-to-r from-transparent via-[#ffb300] to-transparent shadow-[0_0_18px_rgba(255,179,0,0.65)]"
          style={{ bottom: `calc(16% + ${index * 16}px)`, rotate: `${-10 + index * 3}deg` }}
        />
      ))}
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={{ x: ["38vw", "96vw"], opacity: [0, 0.75, 0] }}
          transition={{ duration: 9 + index * 2, repeat: Infinity, delay: index * 1.7, ease: "linear" }}
          className="absolute h-px w-64 bg-gradient-to-r from-transparent via-[#ffb300] to-transparent"
          style={{ top: `${24 + index * 17}%` }}
        />
      ))}
      {particles.map((particle, index) => (
        <motion.span
          key={index}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#ffb300] shadow-[0_0_14px_rgba(255,179,0,0.9)]"
          style={{ left: particle.left, top: particle.top }}
          animate={{ y: [0, -22, 0], opacity: [0.25, 0.95, 0.25] }}
          transition={{ duration: 5.5, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function AboutSection() {
  return (
    <Section id="about" eyebrow="Энэ юу вэ?" title="2 өдрийн AI innovation sprint">
      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <GlassCard className="p-6 sm:p-8">
          <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
            Smart City AI Hackathon бол залуус нийгэмд ойр асуудлыг AI, no-code, design, data, prototype ашиглан
            хурдан туршиж, ажиллах demo болгож танилцуулах бүтээлч тэмцээн.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-5">
            {processSteps.map((step, index) => (
              <div key={step.label} className="relative text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#ffaa0033] bg-[#ff9800]/10 text-[#ffb300] shadow-[0_0_24px_rgba(255,152,0,0.16)]">
                  <step.icon className="h-7 w-7" />
                </div>
                <p className="mt-3 text-xs font-extrabold uppercase text-white">{step.label}</p>
                {index < processSteps.length - 1 && (
                  <ChevronRight className="absolute right-[-18px] top-6 hidden h-5 w-5 text-[#ffb300]/70 sm:block" />
                )}
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Cpu className="h-7 w-7 text-[#ffb300]" />
            <h3 className="text-2xl font-black text-[#ff9800]">AI + City Data</h3>
          </div>
          <p className="mt-5 text-sm leading-7 text-zinc-300">
            Оролцогчид асуудлаа тодорхойлж, AI workflow, хэрэглэгчийн туршлага, бизнес үнэ цэнэ, demo-г нэг багц болгон
            харуулна.
          </p>
        </GlassCard>
      </div>
    </Section>
  );
}

function AudienceSection() {
  return (
    <Section id="audience" eyebrow="Хэн оролцох вэ?" title="Бүтээгч, дизайнер, судлаач, pitch хийдэг залуус">
      <div className="grid gap-4 lg:grid-cols-3">
        {audience.map((item) => (
          <GlassCard key={item.text} className="p-6">
            <item.icon className="h-7 w-7 text-[#ffb300]" />
            <p className="mt-4 text-sm font-semibold leading-7 text-zinc-200">{item.text}</p>
          </GlassCard>
        ))}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <GlassCard className="p-6">
          <UsersRound className="h-8 w-8 text-[#ffb300]" />
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#ffb300]">Багийн хэмжээ</p>
          <p className="mt-1 text-3xl font-black text-[#ff9800]">2-3 хүн</p>
        </GlassCard>
        <GlassCard className="p-6">
          <Code2 className="h-8 w-8 text-[#ffb300]" />
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            Coding мэдэхгүй байсан ч болно. AI tools, no-code, Replit, Figma, Canva, ChatGPT ашиглаж болно.
          </p>
        </GlassCard>
      </div>
    </Section>
  );
}

function ChallengeTracksSection() {
  return (
    <Section id="challenge" eyebrow="Challenge Tracks" title="Хотын бодит асуудалд чиглэсэн 6 track">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tracks.map((track) => (
          <motion.div key={track.title} whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
            <GlassCard className="group h-full p-6 transition hover:border-[#ffb300]/50 hover:shadow-[0_0_42px_rgba(255,152,0,0.16)]">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[#ffaa0033] bg-white/[0.03]">
                <track.icon className={cn("h-8 w-8", track.color)} />
              </div>
              <h3 className="mt-6 text-xl font-black text-white group-hover:text-[#ffb300]">{track.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{track.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function ScheduleAndJudgingSection() {
  return (
    <Section id="schedule" eyebrow="2 өдрийн хөтөлбөр" title="Build Day-аас Demo Day хүртэл">
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <GlassCard className="p-6 sm:p-8">
          <div className="grid gap-8 md:grid-cols-2">
            {schedule.map((day) => (
              <div key={day.day}>
                <h3 className="flex items-center gap-3 text-lg font-black text-[#ffb300]">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-[#ffaa0033] bg-[#ff9800]/10 text-xs">
                    {day.day.slice(3)}
                  </span>
                  {day.day} - {day.title}
                </h3>
                <div className="mt-6 space-y-4 border-l border-[#ffaa0033] pl-5">
                  {day.items.map(([time, label]) => (
                    <div key={`${day.day}-${time}`} className="relative">
                      <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#ff9800] shadow-[0_0_14px_rgba(255,152,0,0.9)]" />
                      <p className="text-sm font-bold text-[#ffb300]">{time}</p>
                      <p className="text-sm text-zinc-300">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-6 sm:p-8">
          <h3 className="text-2xl font-black text-[#ff9800]">Шалгаруулах шалгуур</h3>
          <div className="mt-7 grid gap-7 sm:grid-cols-[170px_1fr] sm:items-center">
            <div className="relative mx-auto grid h-36 w-36 place-items-center rounded-full bg-[conic-gradient(from_0deg,#ff6a00_0_25%,#ffb300_25%_50%,rgba(255,179,0,0.35)_50%_70%,rgba(255,106,0,0.25)_70%_100%)]">
              <div className="grid h-24 w-24 place-items-center rounded-full bg-[#050505] text-2xl font-black text-[#ffdf8a]">
                100%
              </div>
            </div>
            <div className="space-y-3">
              {judging.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-sm text-zinc-200">{label}</span>
                  <span className="font-black text-[#ffb300]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </Section>
  );
}

function PrizeSection() {
  return (
    <Section id="prizes" eyebrow="Шагнал" title="Prototype, pitch, impact бүгд үнэлэгдэнэ">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {prizes.map((prize) => (
          <GlassCard key={prize.title} className="p-6 text-center">
            <p className="text-lg font-black text-[#ffb300]">{prize.title}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-300">{prize.subtitle}</p>
            <div className={cn("mx-auto mt-6 grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br", prize.tone)}>
              <Trophy className="h-14 w-14 text-black drop-shadow" />
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}

function BenefitsSection() {
  return (
    <Section id="why" eyebrow="Яагаад оролцох ёстой вэ?" title="Ирээдүйн хотын шийдлийг өөрөө туршиж үз">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {benefits.map((benefit) => (
          <GlassCard key={benefit.text} className="flex items-start gap-4 p-6">
            <benefit.icon className="mt-1 h-6 w-6 shrink-0 text-[#ffb300]" />
            <p className="text-sm font-semibold leading-7 text-zinc-200">{benefit.text}</p>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}

function SponsorsSection() {
  const sponsors = [
    ["Tech Partner", Cpu],
    ["Cloud Partner", Cloud],
    ["University", School],
    ["Startup", Rocket],
    ["City Hall", Landmark],
    ["Media Partner", Presentation],
  ];

  return (
    <Section id="sponsors" eyebrow="Sponsors" title="Хамтран ажиллагч байгууллагууд">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {sponsors.map(([label, Icon]) => (
          <GlassCard key={label as string} className="flex items-center justify-center gap-3 p-5 text-zinc-400">
            <Icon className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">{label as string}</span>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}

function FaqSection() {
  return (
    <Section id="faq" eyebrow="FAQ" title="Түгээмэл асуултууд">
      <GlassCard className="p-2 sm:p-4">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`} className="border-[#ffaa001f] px-4">
              <AccordionTrigger className="text-left text-base font-black text-white hover:text-[#ffb300] hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-7 text-zinc-300">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </GlassCard>
    </Section>
  );
}

function FinalCtaSection({ onRegister }: { onRegister: () => void }) {
  return (
    <section className="relative px-5 pb-16 pt-6 sm:px-6 lg:pb-24">
      <GlassCard className="mx-auto grid max-w-7xl gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_auto_auto] lg:items-center">
        <div>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-black leading-tight tracking-normal text-white">
            Ирээдүйн хотыг хүлээх биш - <span className="text-[#ff9800]">БҮТЭЭ.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
            2026.06.22-06.23-нд 9:00-18:00 цагт Техник технологийн их сургууль, 10-р хороололд болох Smart City AI
            Hackathon-д багаараа бүртгүүлээрэй. Байр хязгаартай.
          </p>
        </div>
        <GlowButton onClick={onRegister} className="h-14 px-7">
          Одоо бүртгүүлэх <ArrowRight className="h-5 w-5" />
        </GlowButton>
        <div className="grid h-28 w-28 place-items-center rounded-2xl border border-[#ffaa0033] bg-white/[0.04]">
          <QrCode className="h-20 w-20 text-white" />
        </div>
      </GlassCard>
    </section>
  );
}

function DetailsModal({ onClose, onRegister }: { onClose: () => void; onRegister: () => void }) {
  return (
    <ModalShell onClose={onClose}>
      <div className="grid max-h-[86vh] gap-6 overflow-y-auto p-5 sm:p-7">
        <div className="overflow-hidden rounded-2xl border border-[#ffaa0026] bg-black">
          <div className="relative aspect-video bg-[radial-gradient(circle_at_center,rgba(255,152,0,0.22),transparent_42%),linear-gradient(135deg,#111,#050505)]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,179,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,179,0,0.04)_1px,transparent_1px)] bg-[size:42px_42px]" />
            <button className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#ffb300]/40 bg-[#ff9800]/20 text-[#ffb300] shadow-[0_0_45px_rgba(255,152,0,0.28)]">
              <Play className="ml-1 h-8 w-8 fill-current" />
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#ffb300]">Event overview</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Smart City AI Hackathon 2026</h2>
          <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
            2 өдрийн турш оролцогчид хотын бодит challenge сонгож, AI tool ашиглан prototype бүтээж, mentor-уудаас
            зөвлөгөө авч, demo pitch хийж өрсөлдөнө.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Event highlights", "AI workshop, mentor session, live demo, Q&A, final pitch."],
            ["Challenge tracks", tracks.map((track) => track.title).join(", ")],
            ["Mentors", "AI, product, UX, city innovation чиглэлийн mentor-ууд."],
            ["Prize info", "1-р байр, 2-р байр, 3-р байр болон Special Awards."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-[#ffaa001f] bg-white/[0.03] p-5">
              <h3 className="font-black text-[#ffb300]">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-zinc-300">{text}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <GlowButton onClick={onRegister}>Багаа бүртгүүлэх</GlowButton>
          <Button onClick={onClose} className="rounded-xl border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]">
            Хаах
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

function RegistrationModal({
  form,
  submitState,
  error,
  onClose,
  onSubmit,
  onFieldChange,
  onParticipantToggle,
}: {
  form: RegistrationForm;
  submitState: "idle" | "submitting" | "success" | "error";
  error: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: <K extends keyof RegistrationForm>(key: K, value: RegistrationForm[K]) => void;
  onParticipantToggle: (value: string) => void;
}) {
  const isSuccess = submitState === "success";

  return (
    <ModalShell onClose={onClose}>
      <div className="max-h-[86vh] overflow-y-auto p-5 sm:p-7">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="grid min-h-[420px] place-items-center text-center"
            >
              <div>
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 16 }}
                  className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-[#ffb300]/50 bg-[#ff9800]/15 text-[#ffb300] shadow-[0_0_55px_rgba(255,152,0,0.32)]"
                >
                  <CheckCircle2 className="h-14 w-14" />
                </motion.div>
                <h2 className="mt-7 text-3xl font-black text-white">Амжилттай бүртгэгдлээ!</h2>
                <p className="mt-3 text-zinc-300">Манай баг тантай удахгүй холбогдох болно.</p>
                <Button onClick={onClose} className="mt-8 rounded-xl bg-white text-black hover:bg-[#ffb300]">
                  Болсон
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={onSubmit}>
              <div className="mb-6">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#ffb300]">Registration</p>
                <h2 className="mt-3 text-3xl font-black text-white">Багаа бүртгүүлэх</h2>
                <p className="mt-2 text-sm text-zinc-400">Мэдээллээ үнэн зөв бөглөнө үү.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <TextField icon={UserRound} label="Овог нэр" value={form.fullName} onChange={(value) => onFieldChange("fullName", value)} required />
                <TextField icon={Mail} label="Имэйл" type="email" value={form.email} onChange={(value) => onFieldChange("email", value)} required />
                <TextField icon={Phone} label="Утас" value={form.phone} onChange={(value) => onFieldChange("phone", value)} required />
                <TextField icon={School} label="Сургуулийн нэр" value={form.schoolName} onChange={(value) => onFieldChange("schoolName", value)} required />
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <FieldGroup label="Оролцогчийн төрөл">
                  <div className="grid grid-cols-2 gap-3">
                    {["Оюутан", "Ахлах анги"].map((value) => (
                      <label key={value} className={checkClass(form.participantTypes.includes(value))}>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={form.participantTypes.includes(value)}
                          onChange={() => onParticipantToggle(value)}
                        />
                        {value}
                      </label>
                    ))}
                  </div>
                </FieldGroup>
                <FieldGroup label="Team size">
                  <select className={selectClass} value={form.teamSize} onChange={(event) => onFieldChange("teamSize", event.target.value)}>
                    {["2 хүн", "3 хүн"].map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </FieldGroup>
              </div>

              <div className="mt-5">
                <FieldGroup label="Challenge Track">
                  <select
                    className={selectClass}
                    value={form.challengeTrack}
                    onChange={(event) => onFieldChange("challengeTrack", event.target.value)}
                  >
                    {tracks.map((track) => (
                      <option key={track.title}>{track.title}</option>
                    ))}
                  </select>
                </FieldGroup>
              </div>

              <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl border border-[#ffaa0026] bg-white/[0.03] p-4 text-sm font-bold text-white">
                <input
                  type="checkbox"
                  checked={form.hasMentor}
                  onChange={(event) => onFieldChange("hasMentor", event.target.checked)}
                  className="h-4 w-4 accent-[#ff9800]"
                />
                Mentor байгаа
              </label>

              <AnimatePresence>
                {form.hasMentor && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <TextField icon={UserRound} label="Mentor нэр" value={form.mentorName} onChange={(value) => onFieldChange("mentorName", value)} />
                      <TextField icon={Phone} label="Mentor утас" value={form.mentorPhone} onChange={(value) => onFieldChange("mentorPhone", value)} />
                      <TextField icon={Mail} label="Mentor имэйл" type="email" value={form.mentorEmail} onChange={(value) => onFieldChange("mentorEmail", value)} />
                      <TextField
                        icon={BriefcaseBusiness}
                        label="Mentor ажил / organization"
                        value={form.mentorOrganization}
                        onChange={(value) => onFieldChange("mentorOrganization", value)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {submitState === "error" && (
                <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <GlowButton type="submit" disabled={submitState === "submitting"}>
                  {submitState === "submitting" ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                  Илгээх
                </GlowButton>
                <Button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
                >
                  Болих
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </ModalShell>
  );
}

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-3 backdrop-blur-md"
      onMouseDown={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.24 }}
        onMouseDown={(event) => event.stopPropagation()}
        className="relative w-full max-w-3xl overflow-hidden rounded-[28px] border border-[#ffaa0033] bg-[#070707]/92 shadow-[0_0_70px_rgba(255,152,0,0.22)] backdrop-blur-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:bg-[#ff9800]/15"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

function TextField({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">{label}</span>
      <span className="flex items-center gap-3 rounded-2xl border border-[#ffaa0026] bg-white/[0.035] px-4 py-3 transition focus-within:border-[#ffb300]/70">
        <Icon className="h-4 w-4 text-[#ffb300]" />
        <input
          type={type}
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
        />
      </span>
    </label>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">{label}</span>
      {children}
    </div>
  );
}

function FloatingIcon({
  icon: Icon,
  label,
  className,
  delay,
}: {
  icon: typeof Car;
  label: string;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      aria-label={label}
      animate={{ y: [0, -16, 0], opacity: [0.72, 1, 0.72] }}
      transition={{ duration: 5.5, repeat: Infinity, delay, ease: "easeInOut" }}
      className={cn(
        "absolute grid h-16 w-16 place-items-center rounded-full border border-[#ffb300]/45 bg-black/35 text-[#ffb300] shadow-[0_0_34px_rgba(255,152,0,0.2)] backdrop-blur-md",
        className
      )}
    >
      <Icon className="h-7 w-7" />
      <span className="absolute inset-[-14px] rounded-full border border-[#ffb300]/10" />
    </motion.div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative px-5 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ff9800]">{eyebrow}</p>
          <h2 className="mt-3 max-w-4xl text-[clamp(2rem,4vw,3.65rem)] font-black leading-tight tracking-normal text-white">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[#ffaa0026] bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#ffb300]/60 before:to-transparent",
        className
      )}
    >
      {children}
    </div>
  );
}

function GlowButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <Button
      {...props}
      className={cn(
        "rounded-xl bg-gradient-to-r from-[#ffb300] via-[#ff9800] to-[#ff6a00] font-black text-black shadow-[0_0_30px_rgba(255,152,0,0.28)] transition hover:scale-[1.02] hover:shadow-[0_0_48px_rgba(255,152,0,0.42)] disabled:opacity-70",
        className
      )}
    >
      {children}
    </Button>
  );
}

function InfoPill({
  icon: Icon,
  children,
  href,
}: {
  icon: typeof CalendarDays;
  children: React.ReactNode;
  href?: string;
}) {
  const className =
    "inline-flex items-center gap-3 rounded-full border border-[#ffaa0026] bg-black/35 px-4 py-3 backdrop-blur transition hover:border-[#ffb300]/60 hover:bg-[#ff9800]/10";
  const content = (
    <>
      <Icon className="h-5 w-5 shrink-0 text-[#ffb300]" />
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return <span className={className}>{content}</span>;
}

function NoiseLayer() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

const selectClass =
  "h-[50px] w-full rounded-2xl border border-[#ffaa0026] bg-[#111] px-4 text-sm font-semibold text-white outline-none transition focus:border-[#ffb300]/70";

function checkClass(active: boolean) {
  return cn(
    "grid h-[50px] cursor-pointer place-items-center rounded-2xl border px-3 text-sm font-bold transition",
    active
      ? "border-[#ffb300]/70 bg-[#ff9800]/15 text-[#ffb300] shadow-[0_0_22px_rgba(255,152,0,0.16)]"
      : "border-[#ffaa0026] bg-white/[0.03] text-zinc-300 hover:border-[#ffb300]/40"
  );
}
