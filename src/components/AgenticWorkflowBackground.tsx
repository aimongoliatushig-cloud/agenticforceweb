import {
  BarChart3,
  Bot,
  Database,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";

const agents = [
  {
    label: "Trigger",
    sublabel: "New request",
    icon: Workflow,
    className: "left-[16%] top-[28%] md:left-[38%] lg:left-[35%]",
  },
  {
    label: "AI Agent",
    sublabel: "Analyze & plan",
    icon: Bot,
    className: "left-[24%] top-[54%] md:left-[40%] lg:left-[37%]",
  },
  {
    label: "Data Agent",
    sublabel: "Fetch insights",
    icon: Database,
    className: "right-[8%] top-[31%] md:right-[16%] lg:right-auto lg:left-[48%]",
  },
  {
    label: "Action Agent",
    sublabel: "Execute tasks",
    icon: Zap,
    className: "right-[8%] top-[55%] md:right-[13%] lg:right-auto lg:left-[49%]",
  },
  {
    label: "Report Agent",
    sublabel: "Deliver results",
    icon: BarChart3,
    className: "right-[12%] top-[76%] md:right-[16%] lg:right-auto lg:left-[48%]",
  },
];

function AgentNode({
  label,
  sublabel,
  icon: Icon,
  className,
}: (typeof agents)[number]) {
  return (
    <div
      className={`agent-node absolute -translate-x-1/2 -translate-y-1/2 ${className}`}
      aria-hidden="true"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-zinc-950/45 shadow-[0_0_28px_rgba(245,158,11,0.08)] backdrop-blur-xl md:h-auto md:w-auto md:min-w-[154px] md:justify-start md:gap-3 md:rounded-full md:px-4 md:py-3">
        <Icon className="h-5 w-5 shrink-0 text-zinc-200/85 md:h-6 md:w-6" />
        <div className="hidden md:block">
          <div className="text-xs font-semibold leading-none text-white/80">
            {label}
          </div>
          <div className="mt-1 text-[11px] leading-none text-white/35">
            {sublabel}
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowPacket({
  path,
  delay,
  duration = "14s",
}: {
  path: string;
  delay: string;
  duration?: string;
}) {
  return (
    <circle className="workflow-packet" r="3.4" fill="#fbbf24">
      <animateMotion dur={duration} begin={delay} repeatCount="indefinite">
        <mpath href={`#${path}`} />
      </animateMotion>
    </circle>
  );
}

export function AgenticWorkflowBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_54%_49%,rgba(245,158,11,0.18),transparent_18rem),linear-gradient(115deg,#030303_0%,#09090b_42%,#11100d_62%,#030303_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(255,255,255,0.08),transparent_24rem),radial-gradient(circle_at_78%_72%,rgba(249,115,22,0.08),transparent_22rem)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/70 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-black via-black/82 to-transparent lg:w-[42%]" />

      <div className="absolute inset-0 opacity-55 [mask-image:linear-gradient(to_right,transparent_0%,black_12%,black_86%,transparent_100%)] md:opacity-75 lg:opacity-100">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 720"
          preserveAspectRatio="none"
          role="img"
        >
          <defs>
            <linearGradient id="workflowLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#71717a" stopOpacity="0" />
              <stop offset="42%" stopColor="#a1a1aa" stopOpacity="0.34" />
              <stop offset="58%" stopColor="#f59e0b" stopOpacity="0.46" />
              <stop offset="100%" stopColor="#71717a" stopOpacity="0.22" />
            </linearGradient>
            <filter id="packetGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path
              id="trigger-to-core"
              d="M 300 285 C 402 285 398 210 478 210 L 520 210 C 574 210 558 342 596 342 L 612 342"
              stroke="url(#workflowLine)"
              strokeWidth="1.25"
              opacity="0.7"
            />
            <path
              id="agent-to-core"
              d="M 286 348 C 390 348 428 348 506 348 C 552 348 582 348 612 348"
              stroke="url(#workflowLine)"
              strokeWidth="1.35"
              opacity="0.78"
            />
            <path
              id="core-to-data"
              d="M 632 346 C 660 346 650 210 690 210 L 732 210"
              stroke="url(#workflowLine)"
              strokeWidth="1.25"
              opacity="0.78"
            />
            <path
              id="core-to-action"
              d="M 632 348 C 664 348 700 348 742 348"
              stroke="url(#workflowLine)"
              strokeWidth="1.35"
              opacity="0.82"
            />
            <path
              id="core-to-report"
              d="M 632 350 C 660 350 650 498 690 498 L 734 498"
              stroke="url(#workflowLine)"
              strokeWidth="1.25"
              opacity="0.72"
            />
            <path
              d="M 440 295 C 440 410 516 422 596 422 C 628 422 620 383 620 360"
              stroke="#a1a1aa"
              strokeDasharray="7 12"
              strokeWidth="1"
              opacity="0.14"
            />
            <path
              d="M 318 348 C 398 348 452 470 568 470 C 612 470 616 404 616 368"
              stroke="#f59e0b"
              strokeDasharray="5 15"
              strokeWidth="1"
              opacity="0.11"
            />
          </g>

          <g filter="url(#packetGlow)">
            <FlowPacket path="trigger-to-core" delay="-1s" duration="16s" />
            <FlowPacket path="agent-to-core" delay="-5s" duration="14s" />
            <FlowPacket path="core-to-data" delay="-2s" duration="13s" />
            <FlowPacket path="core-to-action" delay="-6s" duration="15s" />
            <FlowPacket path="core-to-report" delay="-9s" duration="17s" />
          </g>

          <g opacity="0.65">
            <circle cx="612" cy="348" r="4" fill="#f59e0b" />
            <circle cx="300" cy="285" r="3" fill="#a1a1aa" />
            <circle cx="286" cy="348" r="3" fill="#a1a1aa" />
            <circle cx="732" cy="210" r="3" fill="#fbbf24" />
            <circle cx="742" cy="348" r="3" fill="#fbbf24" />
            <circle cx="734" cy="498" r="3" fill="#fbbf24" />
          </g>
        </svg>

        <div className="agent-core absolute left-[50%] top-[49%] -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/45 bg-zinc-950/70 shadow-[0_0_44px_rgba(245,158,11,0.32)] backdrop-blur-2xl md:h-20 md:w-20">
            <div className="absolute inset-2 rounded-full bg-amber-400/10 blur-md" />
            <Sparkles className="relative h-7 w-7 text-amber-200 md:h-9 md:w-9" />
          </div>
        </div>

        {agents.map((agent) => (
          <AgentNode key={agent.label} {...agent} />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/35" />
    </div>
  );
}
