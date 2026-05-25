import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgenticForce Agents Dashboard",
  description: "Real Hermes operational dashboard for AgenticForce AI agents.",
};

type Agent = {
  name: string;
  runs: number;
  success: number;
  attention: number;
  success_rate: number;
  tool_calls: number;
  messages: number;
  duration_min: number;
  avg_duration_s: number;
  last_active: string | null;
  sample?: string;
};

type RecentSession = {
  file: string;
  id: string;
  platform: string;
  is_cron: boolean;
  start: string;
  end: string;
  duration_s: number;
  messages: number;
  tool_calls: number;
  agent: string;
  status: string;
  final: string;
};

type SeriesPoint = { day: string; sessions: number; tools: number; messages: number };

type DashboardData = {
  metrics: {
    generated_at: string;
    data_sources: string[];
    total_sessions: number;
    telegram_sessions: number;
    cli_sessions: number;
    cron_sessions: number;
    total_messages: number;
    total_tool_calls: number;
    session_success_rate: number;
    gateway_inbound_messages: number;
    gateway_api_calls: number;
    gateway_errors: number;
    avg_response_s: number;
    median_response_s: number;
    max_response_s: number;
    active_cron_jobs: number;
    note: string;
  };
  agents: Agent[];
  series: SeriesPoint[];
  recent_sessions: RecentSession[];
  gateway_recent: string[];
};

const dashboardData = {
  "metrics": {
    "generated_at": "2026-05-25T16:02:58+08:00",
    "data_sources": [
      "/opt/data/sessions/session_*.json",
      "/opt/data/logs/gateway.log",
      "Hermes cron/status CLI"
    ],
    "total_sessions": 59,
    "telegram_sessions": 43,
    "cli_sessions": 10,
    "cron_sessions": 6,
    "total_messages": 5283,
    "total_tool_calls": 2137,
    "session_success_rate": 91.5,
    "gateway_inbound_messages": 119,
    "gateway_api_calls": 470,
    "gateway_errors": 9,
    "avg_response_s": 108.8,
    "median_response_s": 35.0,
    "max_response_s": 1104.0,
    "active_cron_jobs": 3,
    "note": "Agent rows are derived from real Hermes session transcripts and gateway logs. They are not yet separate production worker processes except scheduled cron jobs."
  },
  "agents": [
    {
      "name": "Research Intelligence Agent",
      "runs": 24,
      "success": 22,
      "attention": 2,
      "success_rate": 91.7,
      "tool_calls": 1110,
      "messages": 2551,
      "duration_min": 1382.4,
      "avg_duration_s": 3456.0,
      "last_active": "2026-05-25T08:02:50.271721",
      "sample": "Updated the skill library. Changes made: - Patched **`odoo19-query`** - Added a Mongolian “өнөөдөр шинэ ажил орсон уу?” workflow. - Captured the correct Odoo day-window handling fo"
    },
    {
      "name": "Email Marketing Agent",
      "runs": 13,
      "success": 11,
      "attention": 2,
      "success_rate": 84.6,
      "tool_calls": 379,
      "messages": 1166,
      "duration_min": 398.3,
      "avg_duration_s": 1838.3,
      "last_active": "2026-05-25T01:00:44.716967",
      "sample": "Good morning! Today is Monday, May 25, 2026. You have 0 events on your Google Calendar today. Your calendar is clear."
    },
    {
      "name": "Lead Enrichment Agent",
      "runs": 5,
      "success": 5,
      "attention": 0,
      "success_rate": 100.0,
      "tool_calls": 234,
      "messages": 553,
      "duration_min": 208.5,
      "avg_duration_s": 2501.9,
      "last_active": "2026-05-24T09:39:08.286616",
      "sample": "Updated the skill library. Changes made: - **Patched `webhook-subscriptions`** - Added a new reference file: - `references/agenticforce-workshop-signups.md` - Captures the reusable"
    },
    {
      "name": "Post Generator Agent",
      "runs": 5,
      "success": 4,
      "attention": 1,
      "success_rate": 80.0,
      "tool_calls": 169,
      "messages": 418,
      "duration_min": 92.4,
      "avg_duration_s": 1108.3,
      "last_active": "2026-05-23T16:01:13.062501",
      "sample": "Updated the skill library with the durable lessons from this session: - **Patched `kie-content-maker`** - Added the KIE/Nano Banana 2 polling/output quirk: marketplace jobs can sho"
    },
    {
      "name": "Lead Prospector Agent",
      "runs": 4,
      "success": 4,
      "attention": 0,
      "success_rate": 100.0,
      "tool_calls": 68,
      "messages": 170,
      "duration_min": 85.1,
      "avg_duration_s": 1276.0,
      "last_active": "2026-05-25T01:00:50.118106",
      "sample": "*AgenticForce — Өнөөдрийн борлуулалтын action plan* *1) Өнөөдрийн гол зорилго* Enterprise түвшний 2–3 боломжит харилцагчтай бодит яриа эхлүүлж, *lead follow-up agent + CRM/Odoo/Goo"
    },
    {
      "name": "Visual QA Agent",
      "runs": 3,
      "success": 3,
      "attention": 0,
      "success_rate": 100.0,
      "tool_calls": 90,
      "messages": 217,
      "duration_min": 248.6,
      "avg_duration_s": 4972.4,
      "last_active": "2026-05-25T07:57:28.691152",
      "sample": "Updated the skill library. Changes made: - Patched **`odoo19-query`** - Added a new reusable section for Odoo fuel information queries. - Captured the correct custom model: - `muni"
    },
    {
      "name": "Agentic CRM Agent",
      "runs": 3,
      "success": 3,
      "attention": 0,
      "success_rate": 100.0,
      "tool_calls": 85,
      "messages": 200,
      "duration_min": 95.3,
      "avg_duration_s": 1906.9,
      "last_active": "2026-05-23T07:02:26.252255",
      "sample": "Updated. **Memory** - Consolidated the Mongolian/voice preference to save space. - Added that you want approval-first social media automation: scripts/captions/images/videos, local"
    },
    {
      "name": "Performance Reporting Agent",
      "runs": 2,
      "success": 2,
      "attention": 0,
      "success_rate": 100.0,
      "tool_calls": 2,
      "messages": 8,
      "duration_min": 0.3,
      "avg_duration_s": 10.2,
      "last_active": "2026-05-25T00:00:13.194662",
      "sample": "Өглөөний мэнд 🌿 Шинэ долоо хоногоо тайван, зоригтой, гэрэлтэй эхлүүлээрэй. 1. “The journey of a thousand miles begins with a single step.” — Lao Tzu 2. “What lies behind us and wha"
    }
  ],
  "series": [
    {
      "day": "05/23",
      "sessions": 33,
      "tools": 1041,
      "messages": 2797
    },
    {
      "day": "05/24",
      "sessions": 18,
      "tools": 875,
      "messages": 1955
    },
    {
      "day": "05/25",
      "sessions": 8,
      "tools": 221,
      "messages": 531
    }
  ],
  "recent_sessions": [
    {
      "file": "session_20260525_053133_6db3e98b.json",
      "id": "20260525_053133_6db3e98b",
      "platform": "telegram",
      "is_cron": false,
      "start": "2026-05-25T06:04:42.906016",
      "end": "2026-05-25T08:02:50.271721",
      "duration_s": 7087.4,
      "messages": 79,
      "tool_calls": 33,
      "agent": "Research Intelligence Agent",
      "status": "ok",
      "final": "Yes — I created a dashboard mockup like the image for your **AgenticForce agents**. File created here: ```txt /opt/data/agenticforce_agents_dashboard.html ``` MEDIA:/opt/data/agenticforce_agents_dashboard.html ## What I built The dashboard includes your agents: - Lead Prospector Agent - Lead Enrichm"
    },
    {
      "file": "session_20260525_075123_6ae4aa.json",
      "id": "20260525_053133_6db3e98b",
      "platform": "telegram",
      "is_cron": false,
      "start": "2026-05-25T06:04:42.906016",
      "end": "2026-05-25T07:57:28.691152",
      "duration_s": 6765.8,
      "messages": 71,
      "tool_calls": 27,
      "agent": "Visual QA Agent",
      "status": "ok",
      "final": "Updated the skill library. Changes made: - Patched **`odoo19-query`** - Added a new reusable section for Odoo fuel information queries. - Captured the correct custom model: - `municipal.garbage.fuel.report` - Added known useful fields: - `report_date` - `vehicle_id` - `vehicle_license_plate` - `fuel"
    },
    {
      "file": "session_20260525_070549_c340c0.json",
      "id": "20260525_053133_6db3e98b",
      "platform": "telegram",
      "is_cron": false,
      "start": "2026-05-25T06:04:42.906016",
      "end": "2026-05-25T07:13:34.434855",
      "duration_s": 4131.5,
      "messages": 44,
      "tool_calls": 16,
      "agent": "Research Intelligence Agent",
      "status": "ok",
      "final": "Updated the skill library. Changes made: - Patched **`odoo19-query`** - Added a Mongolian “өнөөдөр шинэ ажил орсон уу?” workflow. - Captured the correct Odoo day-window handling for Asia/Ulaanbaatar → UTC. - Added the broader models to check for “ажил”: - `project.task` - `shared.work.department.tas"
    },
    {
      "file": "session_20260525_035909_db42b1.json",
      "id": "20260524_150612_43e455",
      "platform": "telegram",
      "is_cron": false,
      "start": "2026-05-25T03:17:24.344741",
      "end": "2026-05-25T04:00:21.574368",
      "duration_s": 2577.2,
      "messages": 161,
      "tool_calls": 69,
      "agent": "Research Intelligence Agent",
      "status": "ok",
      "final": "Updated the skill library. What I changed: - Patched existing umbrella skill: `business-sales-coaching` - Added a new support reference file: - `references/agenticforce-sales-assets.md` Captured reusable learnings from this session: - AgenticForce website offer positioning - Weekly AI Automation Sho"
    },
    {
      "file": "session_20260524_150612_43e455.json",
      "id": "20260524_150612_43e455",
      "platform": "telegram",
      "is_cron": false,
      "start": "2026-05-25T03:17:24.344741",
      "end": "2026-05-25T03:59:08.704724",
      "duration_s": 2504.4,
      "messages": 151,
      "tool_calls": 65,
      "agent": "Research Intelligence Agent",
      "status": "ok",
      "final": "Yes — I checked your website: https://agenticforceweb.vercel.app/ ## What your website currently offers Your website currently positions AgenticForce as: > **Agentic AI solutions for modern teams** > AI agents, agentic ERP workflows, training programs, and automation systems. ## Main offers shown on"
    },
    {
      "file": "session_cron_13a317af16ea_20260525_010014.json",
      "id": "cron_13a317af16ea_20260525_010014",
      "platform": "cron",
      "is_cron": true,
      "start": "2026-05-25T01:00:14.223533",
      "end": "2026-05-25T01:00:50.118106",
      "duration_s": 35.9,
      "messages": 9,
      "tool_calls": 5,
      "agent": "Lead Prospector Agent",
      "status": "ok",
      "final": "*AgenticForce — Өнөөдрийн борлуулалтын action plan* *1) Өнөөдрийн гол зорилго* Enterprise түвшний 2–3 боломжит харилцагчтай бодит яриа эхлүүлж, *lead follow-up agent + CRM/Odoo/Google Sheets update + Telegram notification + daily report* шийдлээр дор хаяж *2 discovery call* товлох. *Фокус:* Mongolia"
    },
    {
      "file": "session_cron_784276b8382c_20260525_010014.json",
      "id": "cron_784276b8382c_20260525_010014",
      "platform": "cron",
      "is_cron": true,
      "start": "2026-05-25T01:00:14.298387",
      "end": "2026-05-25T01:00:44.716967",
      "duration_s": 30.4,
      "messages": 12,
      "tool_calls": 5,
      "agent": "Email Marketing Agent",
      "status": "ok",
      "final": "Good morning! Today is Monday, May 25, 2026. You have 0 events on your Google Calendar today. Your calendar is clear."
    },
    {
      "file": "session_cron_a66854f6afb9_20260525_000003.json",
      "id": "cron_a66854f6afb9_20260525_000003",
      "platform": "cron",
      "is_cron": true,
      "start": "2026-05-25T00:00:03.408763",
      "end": "2026-05-25T00:00:13.194662",
      "duration_s": 9.8,
      "messages": 4,
      "tool_calls": 1,
      "agent": "Performance Reporting Agent",
      "status": "ok",
      "final": "Өглөөний мэнд 🌿 Шинэ долоо хоногоо тайван, зоригтой, гэрэлтэй эхлүүлээрэй. 1. “The journey of a thousand miles begins with a single step.” — Lao Tzu 2. “What lies behind us and what lies before us are tiny matters compared to what lies within us.” — Ralph Waldo Emerson 3. “Do not wait to strike till"
    },
    {
      "file": "session_20260524_153101_326615.json",
      "id": "20260524_150612_43e455",
      "platform": "telegram",
      "is_cron": false,
      "start": "2026-05-24T12:56:43.774401",
      "end": "2026-05-24T15:32:23.584615",
      "duration_s": 9339.8,
      "messages": 134,
      "tool_calls": 59,
      "agent": "Research Intelligence Agent",
      "status": "ok",
      "final": "Updated the skill library. Created a new class-level umbrella skill: - `business-playbook-coaching` Added a session-specific reference file: - `references/team-pinnacle-agenticforce.md` What it captures: - How to convert business/sales PDFs into reusable coaching knowledge bases - The Team Pinnacle "
    },
    {
      "file": "session_20260524_145625_eab28d.json",
      "id": "20260524_143555_fba64e",
      "platform": "telegram",
      "is_cron": false,
      "start": "2026-05-24T12:56:43.774401",
      "end": "2026-05-24T15:08:39.959271",
      "duration_s": 7916.2,
      "messages": 173,
      "tool_calls": 77,
      "agent": "Research Intelligence Agent",
      "status": "ok",
      "final": "Updated the skill library ✅ Changes made: - **Updated existing skill:** `zangia-lead-generation` - Broadened it from only Zangia leads to **Mongolia B2B lead generation**. - Added support for **MNCCI/iKon TOP-100 company lists** when the user asks for top taxpayers / top companies / enterprise targe"
    },
    {
      "file": "session_20260524_143555_fba64e.json",
      "id": "20260524_143555_fba64e",
      "platform": "telegram",
      "is_cron": false,
      "start": "2026-05-24T12:56:43.774401",
      "end": "2026-05-24T15:02:50.403459",
      "duration_s": 7566.6,
      "messages": 161,
      "tool_calls": 70,
      "agent": "Research Intelligence Agent",
      "status": "ok",
      "final": "Тийм — энэ бол **маш зөв стратеги**. Playbook-ийн хэлээр бол энэ нь таны **BPM / Business Presentation Meeting**-ийн AgenticForce хувилбар болно. Өөрөөр хэлбэл: > Долоо хоног бүр үнэгүй AI automation showcase хийж, компаниудыг урьж, problem → demo → discovery call → pilot гэсэн pipeline үүсгэнэ. Энэ"
    },
    {
      "file": "session_20260524_143614_2e8e8a.json",
      "id": "20260524_143555_fba64e",
      "platform": "telegram",
      "is_cron": false,
      "start": "2026-05-24T12:56:43.774401",
      "end": "2026-05-24T14:36:55.005324",
      "duration_s": 6011.2,
      "messages": 115,
      "tool_calls": 49,
      "agent": "Research Intelligence Agent",
      "status": "ok",
      "final": "Updated the skill library ✅ Patched existing umbrella skill: - `ocr-and-documents` Added a new section: - **PDF → Coaching / Knowledge Base Workflow** It now captures the reusable workflow from this session: - extract full PDF text and metadata - save raw extracted text for later lookup - inspect TO"
    }
  ],
  "gateway_recent": [
    "2026-05-25 06:34:05,798 INFO gateway.platforms.base: [Telegram] Sending response (947 chars) to 2036690188",
    "2026-05-25 07:01:21,287 INFO gateway.platforms.telegram: [Telegram] Flushing text batch agent:main:telegram:dm:2036690188 (39 chars)",
    "2026-05-25 07:01:21,288 INFO gateway.run: inbound message: platform=telegram user=admin tradearena Battushig T chat=2036690188 msg='Odoo deer onoodor shine ajil Orson bnuu'",
    "2026-05-25 07:05:49,799 INFO gateway.run: response ready: platform=telegram chat=2036690188 time=268.5s api_calls=9 response=585 chars",
    "2026-05-25 07:05:49,807 INFO gateway.platforms.base: [Telegram] Sending response (585 chars) to 2036690188",
    "2026-05-25 07:12:17,653 INFO gateway.platforms.telegram: [Telegram] Flushing text batch agent:main:telegram:dm:2036690188 (78 chars)",
    "2026-05-25 07:12:17,654 INFO gateway.run: inbound message: platform=telegram user=admin tradearena Battushig T chat=2036690188 msg='tegwel tulshnii medeelel hamgiin suuld hezee shinechlegdsen bna we? shalgaarai'",
    "2026-05-25 07:13:18,556 INFO gateway.run: response ready: platform=telegram chat=2036690188 time=60.9s api_calls=5 response=502 chars",
    "2026-05-25 07:13:18,562 INFO gateway.platforms.base: [Telegram] Sending response (502 chars) to 2036690188",
    "2026-05-25 07:32:58,334 INFO gateway.platforms.telegram: [Telegram] Cached user photo at /opt/data/image_cache/img_cd9d055c3cfe.jpg",
    "2026-05-25 07:32:59,136 INFO gateway.platforms.telegram: [Telegram] Flushing photo batch agent:main:telegram:dm:2036690188:photo-burst with 1 image(s)",
    "2026-05-25 07:32:59,137 INFO gateway.run: inbound message: platform=telegram user=admin tradearena Battushig T chat=2036690188 msg=''",
    "2026-05-25 07:32:59,634 INFO gateway.run: Image routing: native (model supports vision). 1 image(s) will be attached inline.",
    "2026-05-25 07:33:11,472 INFO gateway.platforms.telegram: [Telegram] Flushing text batch agent:main:telegram:dm:2036690188 (51 chars)",
    "2026-05-25 07:51:23,114 INFO gateway.run: response ready: platform=telegram chat=2036690188 time=1104.0s api_calls=8 response=1632 chars",
    "2026-05-25 07:51:23,157 INFO gateway.platforms.base: [Telegram] Sending response (1580 chars) to 2036690188",
    "2026-05-25 07:56:48,110 INFO gateway.platforms.telegram: [Telegram] Flushing text batch agent:main:telegram:dm:2036690188 (101 chars)",
    "2026-05-25 07:56:48,111 INFO gateway.run: inbound message: platform=telegram user=admin tradearena Battushig T chat=2036690188 msg='create a real data from your logs and performance datas of our agents. you host '"
  ]
} as DashboardData;

const plannedAgents = [
  "Lead Prospector Agent",
  "Lead Enrichment Agent",
  "Research Intelligence Agent",
  "Blog Writer Agent",
  "Newsletter Agent",
  "Email Marketing Agent",
  "SMS Outreach Agent",
  "Lead Scoring Agent",
  "Agentic CRM Agent",
  "Social Media Research Agent",
  "Content Planner Agent",
  "Content Ideation Agent",
  "Visual Designer Agent",
  "Post Generator Agent",
  "Visual QA Agent",
  "Social Publishing Agent",
  "Performance Reporting Agent",
];

const nf = new Intl.NumberFormat("en-US");

function formatDate(value: string | null) {
  if (!value) return "Not observed";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ulaanbaatar",
  });
}

function metric(label: string, value: string | number, detail: string) {
  return (
    <div className="rounded-3xl border border-amber-400/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30">
      <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-zinc-400">{detail}</p>
    </div>
  );
}

function Bar({ value, max, tone = "amber" }: { value: number; max: number; tone?: "amber" | "emerald" | "sky" }) {
  const width = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 0;
  const color = tone === "emerald" ? "from-emerald-400 to-lime-300" : tone === "sky" ? "from-sky-400 to-cyan-300" : "from-amber-300 to-yellow-500";
  return (
    <div className="h-2 rounded-full bg-zinc-800">
      <div className={`h-2 rounded-full bg-gradient-to-r ${color}`} style={{ width: `${width}%` }} />
    </div>
  );
}

export default function AgentsDashboardPage() {
  const { metrics, agents, series, recent_sessions } = dashboardData;
  const maxRuns = Math.max(...agents.map((agent) => agent.runs), 1);
  const maxTools = Math.max(...agents.map((agent) => agent.tool_calls), 1);
  const maxDailySessions = Math.max(...series.map((point) => point.sessions), 1);
  const observed = new Map(agents.map((agent) => [agent.name, agent]));
  const allAgents = plannedAgents.map((name) =>
    observed.get(name) ?? {
      name,
      runs: 0,
      success: 0,
      attention: 0,
      success_rate: 0,
      tool_calls: 0,
      messages: 0,
      duration_min: 0,
      avg_duration_s: 0,
      last_active: null,
      sample: "No dedicated telemetry yet. This agent is planned or conceptual until a separate workflow emits events.",
    },
  );

  return (
    <div className="min-h-screen bg-[#050506] text-white">
      <section className="relative overflow-hidden border-b border-amber-400/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.25),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(250,204,21,0.12),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-300">AgenticForce Ops</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white md:text-6xl">AI Agents Performance Dashboard</h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">Real Hermes telemetry from Telegram sessions, CLI sessions, cron runs, gateway logs and tool usage. Built for the AgenticForce server and published at <span className="text-amber-200">/dashboard/agents</span>.</p>
            </div>
            <div className="rounded-2xl border border-amber-300/20 bg-black/50 px-5 py-4 text-sm text-zinc-300">
              <p className="text-zinc-500">Last generated</p>
              <p className="mt-1 font-medium text-amber-200">{formatDate(metrics.generated_at)}</p>
              <p className="mt-2 text-xs text-zinc-500">Asia/Ulaanbaatar display time</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metric("Total sessions", nf.format(metrics.total_sessions), `${metrics.telegram_sessions} Telegram · ${metrics.cli_sessions} CLI · ${metrics.cron_sessions} cron`)}
          {metric("Tool calls", nf.format(metrics.total_tool_calls), `${nf.format(metrics.total_messages)} messages processed`)}
          {metric("Success rate", `${metrics.session_success_rate}%`, `${metrics.gateway_errors} gateway errors detected`)}
          {metric("Gateway activity", nf.format(metrics.gateway_api_calls), `${metrics.gateway_inbound_messages} inbound messages · ${metrics.active_cron_jobs} active cron jobs`)}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Observed agents</p>
                <h2 className="mt-2 text-2xl font-semibold">Run volume and reliability</h2>
              </div>
              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-200">{agents.length} with telemetry</span>
            </div>
            <div className="mt-6 space-y-5">
              {agents.map((agent) => (
                <div key={agent.name} className="rounded-2xl border border-white/8 bg-black/30 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{agent.name}</h3>
                      <p className="mt-1 text-sm text-zinc-400">{agent.runs} runs · {agent.tool_calls} tool calls · last {formatDate(agent.last_active)}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xl font-semibold text-amber-200">{agent.success_rate}%</p>
                      <p className="text-xs text-zinc-500">success rate</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <Bar value={agent.runs} max={maxRuns} />
                    <Bar value={agent.tool_calls} max={maxTools} tone="sky" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Daily activity</p>
            <h2 className="mt-2 text-2xl font-semibold">Session trend</h2>
            <div className="mt-8 flex h-72 items-end gap-5 rounded-2xl border border-white/8 bg-black/30 p-5">
              {series.map((point) => (
                <div key={point.day} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex h-52 w-full items-end justify-center rounded-t-2xl bg-zinc-900/80 px-2">
                    <div className="w-full rounded-t-2xl bg-gradient-to-t from-amber-500 to-yellow-200" style={{ height: `${Math.max(8, Math.round((point.sessions / maxDailySessions) * 100))}%` }} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-white">{point.day}</p>
                    <p className="text-xs text-zinc-500">{point.sessions} sessions</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-amber-300/10 bg-amber-300/5 p-4 text-sm leading-6 text-zinc-300">
              <span className="font-semibold text-amber-200">Note:</span> {metrics.note}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Agent registry</p>
              <h2 className="mt-2 text-2xl font-semibold">All AgenticForce agents</h2>
            </div>
            <p className="text-sm text-zinc-500">Observed rows use real logs; inactive rows show zero until production telemetry exists.</p>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-12 bg-zinc-950 px-4 py-3 text-xs uppercase tracking-[0.18em] text-zinc-500">
              <div className="col-span-5">Agent</div>
              <div className="col-span-2 text-right">Runs</div>
              <div className="col-span-2 text-right">Success</div>
              <div className="col-span-3 text-right">Last active</div>
            </div>
            {allAgents.map((agent) => (
              <div key={agent.name} className="grid grid-cols-12 items-center border-t border-white/8 px-4 py-4 text-sm">
                <div className="col-span-5">
                  <p className="font-medium text-white">{agent.name}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-zinc-500">{agent.sample}</p>
                </div>
                <div className="col-span-2 text-right text-zinc-300">{agent.runs}</div>
                <div className="col-span-2 text-right text-amber-200">{agent.runs ? `${agent.success_rate}%` : "Pending"}</div>
                <div className="col-span-3 text-right text-zinc-400">{formatDate(agent.last_active)}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Recent sessions</p>
            <h2 className="mt-2 text-2xl font-semibold">Latest Hermes work</h2>
            <div className="mt-5 space-y-4">
              {recent_sessions.slice(0, 5).map((session) => (
                <div key={session.file} className="rounded-2xl border border-white/8 bg-black/30 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-white">{session.agent}</p>
                    <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-200">{session.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{session.platform} · {session.tool_calls} tools · {session.messages} messages</p>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-500">{session.final}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Performance timing</p>
            <h2 className="mt-2 text-2xl font-semibold">Gateway response profile</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {metric("Average", `${metrics.avg_response_s}s`, "mean response")}
              {metric("Median", `${metrics.median_response_s}s`, "typical response")}
              {metric("Max", `${metrics.max_response_s}s`, "longest response")}
            </div>
            <div className="mt-6 rounded-2xl border border-white/8 bg-black/30 p-5">
              <p className="text-sm font-medium text-white">Data sources</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                {metrics.data_sources.map((source) => (
                  <li key={source} className="flex gap-2"><span className="text-amber-300">•</span><span>{source}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
