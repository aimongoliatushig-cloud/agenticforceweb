import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock3,
  Mail,
  MessageSquareText,
  MousePointerClick,
  PhoneCall,
  Radar,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
} from "lucide-react";
import { normalizeLocale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const overview = [
  { label: "Нийт lead", value: "12,486", change: "+18.4%", icon: Users, tone: "text-cyan-300" },
  { label: "Шинэ lead цуглуулсан", value: "1,248", change: "+22.1%", icon: Target, tone: "text-emerald-300" },
  { label: "Nurturing-д явж буй", value: "4,376", change: "+9.8%", icon: Workflow, tone: "text-amber-300" },
  { label: "Хөрвөх магадлал", value: "31.7%", change: "+4.2%", icon: TrendingUp, tone: "text-rose-300" },
];

const channelMetrics = [
  { label: "SMS илгээсэн", value: "18,920", rate: "96.4%", detail: "Амжилттай хүргэлт", icon: MessageSquareText },
  { label: "Имэйл илгээсэн", value: "26,410", rate: "42.8%", detail: "Нээлтийн хувь", icon: Mail },
  { label: "Дуудлага үүсгэсэн", value: "3,284", rate: "28.6%", detail: "Хариу авсан", icon: PhoneCall },
  { label: "Линк дарсан", value: "5,792", rate: "21.9%", detail: "Click rate", icon: MousePointerClick },
];

const agents = [
  {
    name: "Lead Collector агент",
    role: "Вэб, Facebook, LinkedIn, формоос lead цуглуулна",
    status: "Ажиллаж байна",
    uptime: "99.98%",
    processed: "8,430",
    success: 97,
    latency: "1.8 сек",
  },
  {
    name: "Lead Enrichment агент",
    role: "Компанийн мэдээлэл, салбар, хэмжээ, сонирхлыг баяжуулна",
    status: "Ажиллаж байна",
    uptime: "99.91%",
    processed: "6,204",
    success: 93,
    latency: "4.2 сек",
  },
  {
    name: "Nurturing агент",
    role: "Lead оноо, сегмент, дараагийн алхмыг удирдана",
    status: "Ажиллаж байна",
    uptime: "99.95%",
    processed: "4,376",
    success: 91,
    latency: "2.6 сек",
  },
  {
    name: "SMS илгээгч агент",
    role: "Сануулга, follow-up, demo баталгаажуулалт илгээнэ",
    status: "Ажиллаж байна",
    uptime: "99.99%",
    processed: "18,920",
    success: 96,
    latency: "0.9 сек",
  },
  {
    name: "Имэйл campaign агент",
    role: "Имэйл дараалал, A/B хувилбар, open rate хянана",
    status: "Ажиллаж байна",
    uptime: "99.94%",
    processed: "26,410",
    success: 89,
    latency: "1.1 сек",
  },
  {
    name: "Demo товлолтын агент",
    role: "Сонирхсон lead-ийг календарь, sales багтай холбодог",
    status: "Ажиллаж байна",
    uptime: "99.87%",
    processed: "842",
    success: 84,
    latency: "3.4 сек",
  },
  {
    name: "Hermes news агент",
    role: "Салбарын AI мэдээ цуглуулж, нийтлэлд илгээнэ",
    status: "Ажиллаж байна",
    uptime: "99.90%",
    processed: "300",
    success: 95,
    latency: "7.8 сек",
  },
  {
    name: "Analytics агент",
    role: "Open rate, click rate, funnel, ROI-г нэгтгэнэ",
    status: "Ажиллаж байна",
    uptime: "99.96%",
    processed: "42,118",
    success: 98,
    latency: "1.5 сек",
  },
];

const funnel = [
  { label: "Цуглуулсан", value: 12486, width: "100%" },
  { label: "Баяжуулсан", value: 9704, width: "78%" },
  { label: "Nurturing", value: 4376, width: "35%" },
  { label: "Demo хүссэн", value: 842, width: "7%" },
  { label: "Sales qualified", value: 386, width: "3%" },
];

const leadSegments = [
  { segment: "Эрүүл мэнд", leads: "2,184", open: "48.2%", sms: "3,420", score: 86 },
  { segment: "Санхүү ба банк", leads: "1,936", open: "44.7%", sms: "2,816", score: 82 },
  { segment: "Retail & E-commerce", leads: "1,702", open: "39.5%", sms: "2,204", score: 76 },
  { segment: "Боловсрол", leads: "1,188", open: "46.1%", sms: "1,672", score: 79 },
  { segment: "Үйлдвэрлэл", leads: "1,064", open: "35.8%", sms: "1,392", score: 71 },
];

const recentActivity = [
  { time: "09:42", title: "Lead Collector 184 шинэ lead бүртгэлээ", detail: "Facebook + вэб формоос орж ирсэн" },
  { time: "09:18", title: "Nurturing агент 312 lead-д дараагийн алхам оноов", detail: "Demo, case study, reminder сегментүүд шинэчлэгдсэн" },
  { time: "08:55", title: "SMS агент 1,420 сануулга илгээв", detail: "Амжилттай хүргэлт 96.7%" },
  { time: "08:30", title: "Имэйл агент өглөөний campaign илгээв", detail: "Нээлтийн хувь 42.8%, click rate 21.9%" },
  { time: "07:04", title: "Hermes news агент салбарын мэдээ илгээв", detail: "10 салбар, 30 нийтлэл webhook-р хүлээн авсан" },
];

export default async function DashboardPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return (
    <div className="min-h-screen bg-black pt-24 text-white">
      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
              AgenticForce CRM
            </p>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">AI агентын удирдлагын самбар</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/62 sm:text-base">
              Lead цуглуулалт, nurturing, SMS, имэйл, open rate болон бүх агентын ажиллагааны mock үзүүлэлт.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-300" />
              Бүх агент ажиллаж байна
            </div>
            <Link
              href={`/${locale}`}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70 hover:border-amber-400/45 hover:text-white"
            >
              Нүүр рүү буцах
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overview.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-white/55">{item.label}</p>
                    <p className="mt-3 text-3xl font-black">{item.value}</p>
                  </div>
                  <Icon className={`h-5 w-5 ${item.tone}`} />
                </div>
                <div className="mt-4 inline-flex items-center gap-1 rounded-md bg-emerald-400/10 px-2 py-1 text-xs text-emerald-200">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {item.change}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {channelMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-amber-300" />
                  <span className="rounded-md bg-white/10 px-2 py-1 text-xs text-white/62">{metric.rate}</span>
                </div>
                <p className="mt-4 text-sm text-white/55">{metric.label}</p>
                <p className="mt-2 text-3xl font-black">{metric.value}</p>
                <p className="mt-2 text-xs text-white/45">{metric.detail}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold">Ажиллаж буй агентууд</h2>
                <p className="mt-1 text-sm text-white/50">Үйл ажиллагаа, амжилтын хувь, боловсруулсан тоо</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-200">
                <ShieldCheck className="h-4 w-4" />
                8/8 идэвхтэй
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[860px] border-separate border-spacing-y-2 text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.12em] text-white/40">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Агент</th>
                    <th className="px-3 py-2 font-semibold">Төлөв</th>
                    <th className="px-3 py-2 font-semibold">Uptime</th>
                    <th className="px-3 py-2 font-semibold">Боловсруулсан</th>
                    <th className="px-3 py-2 font-semibold">Амжилт</th>
                    <th className="px-3 py-2 font-semibold">Хариу</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr key={agent.name} className="bg-black/35">
                      <td className="rounded-l-lg border-y border-l border-white/10 px-3 py-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 rounded-md border border-amber-400/20 bg-amber-400/10 p-2">
                            <Bot className="h-4 w-4 text-amber-300" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{agent.name}</p>
                            <p className="mt-1 text-xs leading-5 text-white/45">{agent.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="border-y border-white/10 px-3 py-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-400/10 px-2 py-1 text-xs text-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {agent.status}
                        </span>
                      </td>
                      <td className="border-y border-white/10 px-3 py-3 text-white/70">{agent.uptime}</td>
                      <td className="border-y border-white/10 px-3 py-3 text-white/70">{agent.processed}</td>
                      <td className="border-y border-white/10 px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-28 rounded-full bg-white/10">
                            <div className="h-2 rounded-full bg-emerald-300" style={{ width: `${agent.success}%` }} />
                          </div>
                          <span className="text-white/70">{agent.success}%</span>
                        </div>
                      </td>
                      <td className="rounded-r-lg border-y border-r border-white/10 px-3 py-3 text-white/70">
                        {agent.latency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Lead funnel</h2>
              <Radar className="h-5 w-5 text-cyan-300" />
            </div>
            <div className="mt-6 space-y-5">
              {funnel.map((step) => (
                <div key={step.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-white/70">{step.label}</span>
                    <span className="font-semibold">{step.value.toLocaleString("mn-MN")}</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10">
                    <div className="h-3 rounded-full bg-gradient-to-r from-cyan-300 to-amber-300" style={{ width: step.width }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-lg border border-amber-400/20 bg-amber-400/10 p-4">
              <div className="flex items-center gap-2 text-amber-100">
                <Sparkles className="h-4 w-4" />
                <p className="text-sm font-semibold">Өнөөдрийн AI санал</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/62">
                Open rate өндөртэй сегментүүдэд demo reminder SMS-г 14:00 цагт дахин илгээхэд тохиромжтой.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Lead сегментүүдийн performance</h2>
              <Activity className="h-5 w-5 text-emerald-300" />
            </div>
            <div className="mt-5 space-y-3">
              {leadSegments.map((segment) => (
                <div key={segment.segment} className="rounded-lg border border-white/10 bg-black/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{segment.segment}</p>
                      <p className="mt-1 text-xs text-white/45">{segment.leads} lead</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-right text-sm">
                      <div>
                        <p className="text-white/45">Open</p>
                        <p className="font-semibold text-cyan-200">{segment.open}</p>
                      </div>
                      <div>
                        <p className="text-white/45">SMS</p>
                        <p className="font-semibold text-amber-200">{segment.sms}</p>
                      </div>
                      <div>
                        <p className="text-white/45">Score</p>
                        <p className="font-semibold text-emerald-200">{segment.score}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Сүүлийн ажиллагаа</h2>
              <Clock3 className="h-5 w-5 text-amber-300" />
            </div>
            <div className="mt-5 space-y-4">
              {recentActivity.map((activity) => (
                <div key={`${activity.time}-${activity.title}`} className="flex gap-4">
                  <div className="w-14 shrink-0 rounded-md border border-white/10 bg-black/35 py-2 text-center text-sm font-semibold text-white/70">
                    {activity.time}
                  </div>
                  <div className="min-w-0 border-b border-white/10 pb-4">
                    <p className="font-semibold">{activity.title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/50">{activity.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">Бүх lead-ийн харилцааны нэгтгэл</h2>
              <p className="mt-2 text-sm text-white/50">SMS, имэйл, nurturing, demo хүсэлт нэг дор харагдана.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg bg-black/35 px-4 py-3">
                <Send className="mb-2 h-4 w-4 text-amber-300" />
                <p className="text-lg font-black">45,330</p>
                <p className="text-xs text-white/45">Нийт илгээсэн</p>
              </div>
              <div className="rounded-lg bg-black/35 px-4 py-3">
                <Mail className="mb-2 h-4 w-4 text-cyan-300" />
                <p className="text-lg font-black">42.8%</p>
                <p className="text-xs text-white/45">Open rate</p>
              </div>
              <div className="rounded-lg bg-black/35 px-4 py-3">
                <MessageSquareText className="mb-2 h-4 w-4 text-emerald-300" />
                <p className="text-lg font-black">96.4%</p>
                <p className="text-xs text-white/45">SMS хүргэлт</p>
              </div>
              <div className="rounded-lg bg-black/35 px-4 py-3">
                <Target className="mb-2 h-4 w-4 text-rose-300" />
                <p className="text-lg font-black">386</p>
                <p className="text-xs text-white/45">Qualified lead</p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
