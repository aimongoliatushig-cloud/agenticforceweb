import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  HardHat,
  LayoutDashboard,
  Link2,
  MessageSquare,
  Smartphone,
  Sparkles,
  Users,
  WalletCards,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";
import { AgenticWorkflowBackground } from "@/components/AgenticWorkflowBackground";
import { ConstructionLeadForm } from "./ConstructionLeadForm";

export const metadata: Metadata = {
  title: "Барилгын Agentic ERP | AgenticForce",
  description:
    "Барилгын төсөл, талбай, худалдан авалт, санхүү, борлуулалт, cash flow-ийг нэгтгэж AI агентуудаар ажиллуулдаг Agentic ERP. Тухайн компанийн процессод тохируулсан хурдан, үе шаттай нэвтрүүлэлт.",
  alternates: { canonical: "/construction-erp" },
  openGraph: {
    title: "Барилгын Agentic ERP | AgenticForce",
    description:
      "Талбайгаас cash flow хүртэлх барилгын процессыг нэг мэдээллийн урсгал, role-based mobile app, AI агентуудаар холбоно.",
    type: "website",
  },
};

const differentiators = [
  {
    icon: Bot,
    label: "01",
    title: "Agentic Family",
    body: "Нэг chatbot биш. CEO, төслийн менежер, инженер, санхүү, худалдан авалт, борлуулалтын агентууд нэг контекст дээр хамт ажиллана.",
    detail: "Асуух → шинжлэх → санал болгох → зөвшөөрлөөр action хийх",
  },
  {
    icon: Wrench,
    label: "02",
    title: "Танай процесст таарсан custom implementation",
    body: "Бэлэн модулийн жагсаалтад танай ажлыг хүчээр тааруулахгүй. Workflow, mobile UI, dashboard, approval, report-ийг танай бодит процессоор загварчилна.",
    detail: "Систем процесст таарна — процесс системд биш",
  },
  {
    icon: Clock3,
    label: "03",
    title: "Big-bang биш, хурдан үе шаттай нэвтрүүлэлт",
    body: "Бүх ERP-ийг нэг өдөр солихын оронд хамгийн өндөр үнэ цэнтэй workflow-оос эхэлж production-д оруулан, дараагийн модулиудыг шат дараатай нэмнэ.",
    detail: "Эхний үнэ цэнийг эрт гаргаж, эрсдэлийг багасгана",
  },
  {
    icon: Link2,
    label: "04",
    title: "Одоогийн системүүдийг холбодог",
    body: "ERPNext, Odoo, accounting, CRM, Excel, database, API болон бусад legacy системийг шаардлагатай хэмжээнд нь нэг agentic layer-д холбоно.",
    detail: "Rip-and-replace биш — connect, automate, expand",
  },
];

const agents = [
  { title: "CEO Agent", body: "Төсөл, cash, борлуулалт, эрсдэлийг нэг дор тайлбарлаж, анхаарах зүйлсийг эрэмбэлнэ.", icon: LayoutDashboard },
  { title: "Project Agent", body: "Явц, хоцрогдол, issue, гүйцэтгэлийн мэдээллийг нэгтгэж дараагийн action-ийг санал болгоно.", icon: HardHat },
  { title: "Finance Agent", body: "Төсөв, зарлага, авлага, burn rate, cash runway болон санхүүжилтийн эрсдэлийг хянана.", icon: CircleDollarSign },
  { title: "Sales Agent", body: "Lead, уулзалт, unit inventory, booking, гэрээ, төлбөрийн явцыг борлуулалтын багтай холбоно.", icon: Users },
  { title: "Procurement Agent", body: "Материалын хэрэгцээ, захиалга, approval, нийлүүлэлт, хоцрогдлыг төслийн төлөвлөгөөтэй уялдуулна.", icon: Workflow },
];

const roles = [
  { title: "Инженер", icon: HardHat, points: ["Өдрийн ажлын явц", "Фото ба issue", "Материалын хүсэлт", "Voice note → тайлан"] },
  { title: "Борлуулалт", icon: Users, points: ["Lead ба follow-up", "Unit availability", "Уулзалт ба booking", "Төлбөрийн төлөв"] },
  { title: "Санхүү", icon: WalletCards, points: ["Зардлын approval", "Cash position", "Авлага ба төлбөр", "Budget variance"] },
  { title: "CEO", icon: BarChart3, points: ["Portfolio overview", "Funding risk", "Sales vs progress", "AI priority brief"] },
];

const implementationSteps = [
  { no: "01", title: "Процессоо зураглана", body: "Талбайгаас удирдлага хүртэлх одоогийн workflow, data source, bottleneck, approval-ийг тодорхойлно." },
  { no: "02", title: "Хамгийн өндөр үнэ цэнтэй урсгалаас эхэлнэ", body: "CEO visibility, field reporting, procurement эсвэл presales зэрэг ROI хамгийн хурдан гарах хэсгийг эхэлж сонгоно." },
  { no: "03", title: "Интеграци + custom UI + agent", body: "Одоогийн системүүдтэй холбож, тухайн role-д хэрэгтэй web/mobile experience болон AI agent action-ийг production-д оруулна." },
  { no: "04", title: "Хэмжиж, дараагийн модулийг өргөжүүлнэ", body: "Adoption, cycle time, data quality, cost, sales болон cash-flow outcome дээр хэмжиж дараагийн workflow-ийг нэмнэ." },
];

const comparisonRows = [
  ["Нэвтрүүлэлт", "Бүх модулийг нэг дор", "Үнэ цэнтэй workflow-оос үе шаттай"],
  ["Customization", "Module configuration төвтэй", "Process + UI + agent + integration custom"],
  ["Mobile", "ERP-ийн жижиг хувилбар", "Role-specific field workflow"],
  ["AI", "Тусдаа chatbot / report", "Систем дотор permission-based action"],
  ["Integration", "ERP дотор төвлөрөх", "Одоогийн олон систем дээр agentic layer"],
  ["CEO view", "Тайлан ба dashboard", "Risk, prediction, recommendation, action"],
];

const faqs = [
  {
    q: "Одоогийн ERP-ээ заавал солих уу?",
    a: "Үгүй. Шаардлагагүй үед rip-and-replace хийхгүй. Одоогийн ERP, accounting, CRM, Excel эсвэл database-тай интеграц хийж хамгийн өндөр үнэ цэнтэй workflow-оос эхэлж болно.",
  },
  {
    q: "Яагаад generic ERP-ээс өөр вэ?",
    a: "Бид модулийн тоогоор өрсөлдөхөөс илүү талбайгаас cash flow хүртэлх business outcome-ийг холбодог. Custom workflow, role-based mobile experience, integration болон agentic action нь нэг шийдэлд ажиллана.",
  },
  {
    q: "AI агент яг юу хийж чадах вэ?",
    a: "Эрхийн хүрээнд мэдээлэл унших, нэгтгэх, тайлбарлах, эрсдэлийг илрүүлэх, report/task бэлтгэх, approval route хийх, шаардлагатай action-ийг хүний зөвшөөрлөөр гүйцэтгэх боломжтой.",
  },
  {
    q: "Барилгын компанид юунаас эхлэх нь зөв бэ?",
    a: "Ихэнх тохиолдолд CEO visibility, field progress, procurement, sales/presales, customer receivables болон cash runway-ийн аль нэг өндөр pain-тай урсгалаас эхэлнэ. Discovery үеэр үүнийг хэмжиж сонгоно.",
  },
];

export default function ConstructionErpPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AgenticForce Construction ERP",
    serviceType: "Construction Agentic ERP implementation",
    provider: { "@type": "Organization", name: "AgenticForce" },
    areaServed: "Mongolia",
    description: "Барилгын төсөл, талбай, санхүү, худалдан авалт, борлуулалт, cash flow-ийг AI агент болон custom ERP workflow-оор нэгтгэх үйлчилгээ.",
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden border-b border-white/10 pt-28 sm:pt-32">
        <AgenticWorkflowBackground />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,.94),rgba(0,0,0,.54)_48%,rgba(0,0,0,.82)),linear-gradient(to_bottom,rgba(0,0,0,.2),#000_96%)]" />
        <div className="absolute left-[6%] top-[12%] h-72 w-72 rounded-full bg-red-500/10 blur-[110px]" />
        <div className="absolute right-[8%] top-[18%] h-80 w-80 rounded-full bg-amber-500/12 blur-[120px]" />

        <div className="container relative z-10 mx-auto grid items-center gap-12 px-4 pb-20 pt-12 lg:grid-cols-[1.03fr_.97fr] lg:pb-28 lg:pt-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.07] px-4 py-2 text-sm text-amber-100 backdrop-blur">
              <Building2 className="h-4 w-4 text-amber-400" />
              Монголын барилгын компанид зориулсан Agentic ERP
            </div>

            <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[.96] tracking-[-0.045em] sm:text-6xl lg:text-[76px]">
              Барилгын төслөө ERP-д бүртгэх биш.
              <span className="mt-2 block bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                AI-тай ажиллуул.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">
              Талбай, төсөв, материал, борлуулалт, авлага, cash flow болон удирдлагын шийдвэрийг нэг мэдээллийн урсгалд холбоно. Дээр нь танай компанийн процессод зориулсан AI агентууд ажиллана.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#demo" className="premium-cta inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 px-6 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(245,158,11,.16)]">
                Construction ERP демо авах <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#difference" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.045] px-6 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-amber-400/30 hover:bg-white/[0.07]">
                Яагаад өөр вэ?
              </Link>
            </div>

            <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
              {["Field → Finance → Sales", "Custom implementation", "Монгол хэл + Voice + AI action"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white/72 backdrop-blur">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <HeroCockpit />
        </div>
      </section>

      <section className="border-b border-white/10 bg-zinc-950/70 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/38">Одоо ашиглаж байгаа системээ хаях шаардлагагүй</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 text-sm text-white/65">
            {["ERPNext", "Odoo", "Accounting", "CRM", "Excel", "Databases", "REST / GraphQL API", "Custom systems"].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2">{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="difference" className="bg-black py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <SectionHeading eyebrow="ЯЛГАРАЛ" title="Feature parity биш. Business outcome дээр ялна." body="Өрсөлдөгчийн модулийг нэг нэгээр нь хуулж адилхан болохыг зорихгүй. Барилгын компанийн мэдээлэл хэр хурдан урсаж, шийдвэр хэр хурдан гарч, cash risk хэр эрт харагдаж байгаагаар ялгарна." />

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {differentiators.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-400/30 sm:p-8">
                  <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-amber-500/[0.05] blur-3xl transition group-hover:bg-amber-500/[0.1]" />
                  <div className="relative flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-gradient-to-br from-red-500/15 to-amber-500/15">
                      <Icon className="h-6 w-6 text-amber-300" />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-[0.18em] text-amber-400">{item.label}</p>
                      <h3 className="mt-2 text-2xl font-bold tracking-tight">{item.title}</h3>
                      <p className="mt-4 leading-7 text-white/62">{item.body}</p>
                      <p className="mt-5 inline-flex rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs font-medium text-white/70">{item.detail}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="agents" className="relative overflow-hidden border-y border-white/10 bg-zinc-950 py-20 sm:py-28">
        <div className="absolute left-1/2 top-0 h-64 w-[60%] -translate-x-1/2 rounded-full bg-amber-500/[0.06] blur-[120px]" />
        <div className="container relative mx-auto px-4">
          <SectionHeading eyebrow="AGENTIC FAMILY" title="Нэг assistant биш. Нэг компанид ажилладаг AI баг." body="Агент бүр өөрийн role, permission, tool болон зорилготой. Гэхдээ төсөл, санхүү, борлуулалт, худалдан авалтын нэг shared context дээр ажиллана." centered />

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <article key={agent.title} className="rounded-2xl border border-white/10 bg-black/50 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-amber-500 shadow-[0_10px_30px_rgba(245,158,11,.12)]"><Icon className="h-5 w-5" /></div>
                  <h3 className="mt-5 text-lg font-bold">{agent.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/58">{agent.body}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-amber-400/15 bg-gradient-to-r from-red-500/[0.06] via-white/[0.025] to-amber-500/[0.08] p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold text-amber-300">Нэг асуулт → олон системийн контекст</p>
                <h3 className="mt-2 text-2xl font-bold sm:text-3xl">“Энэ хурдаар явбал 60 хоногийн дараа мөнгө хүрэх үү?”</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Finance Agent cash runway тооцно", "Sales Agent expected collection шалгана", "Project Agent remaining cost шинэчилнэ"].map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm leading-6 text-white/68">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="field-to-cash" className="bg-black py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
            <div>
              <SectionHeading eyebrow="FIELD-TO-CASH" title="Талбай дээрх нэг update CEO-ийн cash risk-д хүрнэ." body="Тусдаа spreadsheet, чат, report, CRM байвал CEO оройтож мэднэ. Agentic ERP мэдээллийг нэг урсгал болгож, өөрчлөлт бүрийн бизнесийн нөлөөг холбоно." />
              <div className="mt-8 space-y-4">
                {[
                  ["1", "Инженер", "Ажлын явц, фото, issue, материалын хэрэгцээ"],
                  ["2", "Худалдан авалт", "Материал, supplier, үнэ, хугацаа, approval"],
                  ["3", "Санхүү", "Actual cost, payable, cash position, budget variance"],
                  ["4", "Борлуулалт", "Unit, lead, booking, contract, collection"],
                  ["5", "CEO", "Progress + sales + cash + risk + next action"],
                ].map(([no, title, body]) => (
                  <div key={no} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 text-xs font-bold text-amber-300">{no}</div>
                    <div><p className="font-semibold">{title}</p><p className="mt-1 text-sm leading-6 text-white/55">{body}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <FieldToCashVisual />
          </div>
        </div>
      </section>

      <section id="mobile" className="border-y border-white/10 bg-zinc-950 py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <MobileMock />
            <div>
              <SectionHeading eyebrow="ROLE-BASED MOBILE" title="ERP-ийн desktop-ийг жижигрүүлж утсанд хийхгүй." body="Талбайн инженер, борлуулалтын ажилтан, санхүү, CEO дөрөвт нэг ижил mobile menu хэрэггүй. Role бүр өөрийн хамгийн чухал action-аа 2–3 touch дотор хийдэг байна." />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <div key={role.title} className="rounded-xl border border-white/10 bg-black/45 p-4">
                      <div className="flex items-center gap-3"><Icon className="h-5 w-5 text-amber-300" /><p className="font-semibold">{role.title}</p></div>
                      <ul className="mt-3 space-y-2 text-sm text-white/58">
                        {role.points.map((point) => <li key={point} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" />{point}</li>)}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="implementation" className="bg-black py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <SectionHeading eyebrow="IMPLEMENTATION" title="“ERP project” биш. Хэмжигдэхүйц rollout." body="Урт хугацааны requirement document бичээд саруудаар хүлээхээс илүү бодит workflow-ийг эрт production-д оруулж, хэрэглээн дээр нь сайжруулна." />
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {implementationSteps.map((step) => (
              <article key={step.no} className="relative rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                <p className="text-4xl font-black text-white/[0.09]">{step.no}</p>
                <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/58">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950 py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <SectionHeading eyebrow="POSITIONING" title="Generic ERP vs AgenticForce Construction ERP" body="Модуль байгаа эсэхээс илүү мэдээллийн хурд, шийдвэр, integration болон field-to-cash outcome дээр харьцуулна." />
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-black/45">
            <div className="grid grid-cols-[.8fr_1fr_1fr] border-b border-white/10 bg-white/[0.04] text-sm font-semibold">
              <div className="p-4 sm:p-5">Хэмжүүр</div><div className="border-l border-white/10 p-4 text-white/55 sm:p-5">Generic ERP</div><div className="border-l border-amber-400/15 bg-amber-400/[0.045] p-4 text-amber-200 sm:p-5">AgenticForce</div>
            </div>
            {comparisonRows.map(([label, generic, agentic]) => (
              <div key={label} className="grid grid-cols-[.8fr_1fr_1fr] border-b border-white/[0.07] text-sm last:border-b-0">
                <div className="p-4 font-medium sm:p-5">{label}</div><div className="border-l border-white/[0.07] p-4 leading-6 text-white/50 sm:p-5">{generic}</div><div className="border-l border-amber-400/10 bg-amber-400/[0.025] p-4 leading-6 text-white/82 sm:p-5">{agentic}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,.1),transparent_34%),rgba(255,255,255,.025)] p-6 sm:p-10 lg:grid-cols-[.9fr_1.1fr] lg:p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white/66"><Sparkles className="h-3.5 w-3.5 text-amber-300" />CEO-ийн асуултад report биш, хариулт</div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Танай удирдлага өдөр бүр эдгээрийг шууд асууж чадна.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Аль төсөл cash shortage-ийн хамгийн өндөр эрсдэлтэй вэ?", "Энэ борлуулалтын хурдаар барилгаа дуусгах мөнгө хүрэх үү?", "Ямар материалын хоцрогдол schedule-д хамгийн их нөлөөлөх вэ?", "Хэдэн unit зарагдсан, хэд үлдсэн, collection хэд вэ?", "Төсвөөс хамгийн их хэтэрсэн 5 зардал юу вэ?", "Өнөөдөр миний approve хийх хамгийн чухал 3 зүйл юу вэ?"].map((question) => (
                <div key={question} className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm leading-6 text-white/72">“{question}”</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="relative overflow-hidden border-y border-white/10 bg-zinc-950 py-20 sm:py-28">
        <div className="absolute -right-24 top-12 h-80 w-80 rounded-full bg-amber-500/10 blur-[120px]" /><div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-red-500/10 blur-[110px]" />
        <div className="container relative mx-auto grid gap-10 px-4 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-400">DEMO / DISCOVERY</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Танай барилгын компанид хаанаас эхлэхийг 30 минутад зураглая.</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/62">Одоогийн систем, Excel, талбайн тайлан, борлуулалт, cash-flow процессоо товч танилцуул. Бид эхний Agentic ERP workflow ямар байхыг санал болгоно.</p>
            <div className="mt-8 space-y-3 text-sm text-white/68">
              {["Одоогийн процессын bottleneck", "Интеграц хийх системүүд", "Эхний high-value workflow", "Rollout-ийн дараалал"].map((item) => <div key={item} className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-amber-400" />{item}</div>)}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-5 shadow-[0_24px_80px_rgba(0,0,0,.35)] backdrop-blur sm:p-7"><ConstructionLeadForm /></div>
        </div>
      </section>

      <section className="bg-black py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <SectionHeading eyebrow="FAQ" title="Түгээмэл асуултууд" />
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {faqs.map((faq) => <article key={faq.q} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><h3 className="text-lg font-bold">{faq.q}</h3><p className="mt-3 text-sm leading-7 text-white/58">{faq.a}</p></article>)}
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroCockpit() {
  return (
    <div className="relative mx-auto w-full max-w-[650px] lg:ml-auto">
      <div className="absolute inset-8 rounded-full bg-amber-500/10 blur-[90px]" />
      <div className="relative overflow-hidden rounded-[26px] border border-white/12 bg-[#08090b]/90 p-4 shadow-[0_35px_100px_rgba(0,0,0,.62)] backdrop-blur-xl sm:p-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">CEO COMMAND CENTER</p><p className="mt-1 text-lg font-bold">Талх Нарны Хотхон</p></div>
          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">Live</div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[["Физик явц", "72%", "+3%"], ["Борлуулалт", "54%", "312 unit"], ["Cash runway", "23 өдөр", "Анхаарах"], ["Funding risk", "Өндөр", "58%"]].map(([label, value, note], index) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/[0.035] p-3"><p className="text-[11px] text-white/45">{label}</p><p className={`mt-2 text-lg font-bold ${index === 3 ? "text-red-400" : "text-white"}`}>{value}</p><p className={`mt-1 text-[11px] ${index === 2 || index === 3 ? "text-amber-400" : "text-emerald-400"}`}>{note}</p></div>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <div className="flex items-center justify-between"><p className="text-sm font-semibold">Cash flow forecast</p><span className="text-[11px] text-white/40">30 хоног</span></div>
            <div className="mt-5 flex h-28 items-end gap-1.5">{[42,57,34,62,48,71,54,66,44,78,58,37,30,22,18,13].map((h,i) => <div key={i} className="flex h-full flex-1 items-end"><div className={`w-full rounded-t-sm ${i > 11 ? "bg-red-400/70" : "bg-gradient-to-t from-red-500/70 to-amber-400/80"}`} style={{ height: `${h}%` }} /></div>)}</div>
            <div className="mt-3 flex justify-between text-[10px] text-white/35"><span>Өнөөдөр</span><span>+15 өдөр</span><span>+30 өдөр</span></div>
          </div>
          <div className="rounded-xl border border-amber-400/15 bg-gradient-to-b from-amber-400/[0.07] to-red-500/[0.04] p-4">
            <div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-amber-500"><Bot className="h-4 w-4" /></div><div><p className="text-xs font-semibold">CEO Agent</p><p className="text-[10px] text-emerald-400">online</p></div></div>
            <p className="mt-4 text-xs leading-5 text-white/70">Борлуулалтын collection одоогийн хурдаар үргэлжилбэл 25 хоногийн дараа cash gap үүсэх эрсдэлтэй.</p>
            <div className="mt-4 rounded-lg border border-white/10 bg-black/35 p-3 text-[11px] leading-5 text-white/58">Санал: 18 overdue авлагыг priority follow-up болгож, B блокийн 24 unit дээр campaign эхлүүлэх.</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs text-white/55"><MessageSquare className="h-4 w-4 text-amber-300" />“Өнөөдөр миний анхаарах хамгийн чухал 3 зүйл юу вэ?”</div>
      </div>
    </div>
  );
}

function FieldToCashVisual() {
  const stages = [
    { icon: HardHat, title: "Талбай", body: "Явц / issue" },
    { icon: Workflow, title: "Procurement", body: "Материал / PO" },
    { icon: CircleDollarSign, title: "Finance", body: "Cost / cash" },
    { icon: Users, title: "Sales", body: "Unit / collection" },
    { icon: LayoutDashboard, title: "CEO", body: "Risk / action" },
  ];
  return (
    <div className="relative rounded-3xl border border-white/10 bg-zinc-950/80 p-5 sm:p-8">
      <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(245,158,11,.08),transparent_55%)]" />
      <div className="relative">
        <div className="mb-8 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-400">ONE LIVE CONTEXT</p><p className="mt-2 text-xl font-bold">Agentic operating layer</p></div><div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10"><Zap className="h-5 w-5 text-amber-300" /></div></div>
        <div className="space-y-3">
          {stages.map((stage, index) => { const Icon = stage.icon; return <div key={stage.title} className="relative flex items-center gap-4 rounded-xl border border-white/10 bg-black/45 p-4"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.055]"><Icon className="h-5 w-5 text-amber-300" /></div><div className="flex-1"><p className="font-semibold">{stage.title}</p><p className="mt-0.5 text-xs text-white/45">{stage.body}</p></div><span className="text-xs text-white/35">0{index + 1}</span>{index < stages.length - 1 ? <div className="absolute -bottom-3 left-9 h-3 w-px bg-amber-400/30" /> : null}</div>; })}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">{["Нэг data model", "Нэг permission layer", "Нэг audit trail"].map((item) => <div key={item} className="rounded-lg border border-white/10 bg-white/[0.025] px-3 py-2.5 text-center text-xs text-white/55">{item}</div>)}</div>
      </div>
    </div>
  );
}

function MobileMock() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="absolute inset-12 rounded-full bg-red-500/[0.07] blur-[100px]" />
      <div className="relative mx-auto max-w-[330px] rounded-[38px] border border-white/15 bg-black p-2.5 shadow-[0_35px_90px_rgba(0,0,0,.55)]">
        <div className="overflow-hidden rounded-[30px] border border-white/[0.06] bg-[#0b0c0f]">
          <div className="flex items-center justify-between px-5 py-4 text-[11px] text-white/55"><span>9:41</span><span>Agentic ERP</span></div>
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between"><div><p className="text-xs text-white/45">Өглөөний тойм</p><p className="mt-1 text-lg font-bold">Сайн байна уу, захирал.</p></div><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-amber-500"><Bot className="h-4 w-4" /></div></div>
            <div className="mt-5 grid grid-cols-2 gap-2">{[["Төслийн явц", "72%"], ["Борлуулалт", "54%"], ["Cash", "23 өдөр"], ["Эрсдэл", "Өндөр"]].map(([label,value],index) => <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><p className="text-[10px] text-white/42">{label}</p><p className={`mt-1.5 text-base font-bold ${index === 3 ? "text-red-400" : "text-white"}`}>{value}</p></div>)}</div>
            <div className="mt-3 rounded-xl border border-amber-400/15 bg-amber-400/[0.055] p-3"><div className="flex items-center gap-2 text-xs font-semibold text-amber-200"><Sparkles className="h-3.5 w-3.5" />AI priority</div><p className="mt-2 text-[11px] leading-5 text-white/62">3 approval өнөөдрийн cash flow-д шууд нөлөөлнө.</p></div>
            <div className="mt-3 space-y-2">{["Cash flow-ийн эрсдэлийг харуул", "Борлуулалтын plan гарга", "Approval-уудаа шалга"].map((item) => <div key={item} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-[11px] text-white/58">{item}<ArrowRight className="h-3.5 w-3.5 text-amber-300" /></div>)}</div>
          </div>
        </div>
      </div>
      <div className="absolute left-0 top-24 hidden rounded-2xl border border-white/10 bg-black/80 p-4 shadow-2xl backdrop-blur sm:block"><Smartphone className="h-5 w-5 text-amber-300" /><p className="mt-3 text-xs font-semibold">Role-based</p><p className="mt-1 text-[11px] text-white/45">Engineer ≠ CEO UI</p></div>
      <div className="absolute bottom-24 right-0 hidden rounded-2xl border border-white/10 bg-black/80 p-4 shadow-2xl backdrop-blur sm:block"><MessageSquare className="h-5 w-5 text-amber-300" /><p className="mt-3 text-xs font-semibold">Voice + chat</p><p className="mt-1 text-[11px] text-white/45">Монгол хэлээр action</p></div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, body, centered = false }: { eyebrow: string; title: string; body?: string; centered?: boolean }) {
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-400">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
      {body ? <p className="mt-5 text-base leading-8 text-white/60 sm:text-lg">{body}</p> : null}
    </div>
  );
}
