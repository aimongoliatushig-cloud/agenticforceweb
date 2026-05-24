import {
  BarChart3,
  BookOpenText,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  DatabaseZap,
  Eye,
  Gauge,
  Globe2,
  ImagePlus,
  Lightbulb,
  Mail,
  MessageSquareText,
  MousePointerClick,
  Newspaper,
  PenLine,
  PhoneCall,
  Radar,
  Rocket,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type AgentVisualType =
  | "prospector-radar"
  | "enrichment-profile"
  | "research-intel"
  | "blog-seo"
  | "newsletter-hub"
  | "email-signals"
  | "sms-router"
  | "scoring-gauge"
  | "crm-sync"
  | "social-radar"
  | "calendar-grid"
  | "ideation-engine"
  | "brand-system"
  | "media-generator"
  | "visual-qa"
  | "publishing-orbit"
  | "reporting-room";

export type AgentIntroData = {
  slug: string;
  agentName: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryBenefit: string;
  hoursSaved: string;
  qualifiedLeadImpact: string;
  channels: string[];
  processSteps: string[];
  benefits: string[];
  humanInLoop: string;
  integrations: string[];
  visualType: AgentVisualType;
  icon: LucideIcon;
};

export type AgentCategory = {
  name: string;
  description: string;
  agents: string[];
};

export const overviewSlug = "sales-marketing-agents";

export const solutionsNavItems = [
  { label: "Sales & Marketing Agents", href: "/solutions/sales-marketing-agents" },
  { label: "Lead Prospector Agent", href: "/solutions/lead-prospector-agent" },
  { label: "Lead Enrichment Agent", href: "/solutions/lead-enrichment-agent" },
  { label: "Research Intelligence Agent", href: "/solutions/research-intelligence-agent" },
  { label: "Blog Writer Agent", href: "/solutions/blog-writer-agent" },
  { label: "Newsletter Agent", href: "/solutions/newsletter-agent" },
  { label: "Email Marketing Agent", href: "/solutions/email-marketing-agent" },
  { label: "SMS Outreach Agent", href: "/solutions/sms-outreach-agent" },
  { label: "Lead Scoring Agent", href: "/solutions/lead-scoring-agent" },
  { label: "Agentic CRM Agent", href: "/solutions/agentic-crm-agent" },
  { label: "Social Media Research Agent", href: "/solutions/social-media-research-agent" },
  { label: "Content Planner Agent", href: "/solutions/content-planner-agent" },
  { label: "Content Ideation Agent", href: "/solutions/content-ideation-agent" },
  { label: "Visual Designer Agent", href: "/solutions/visual-designer-agent" },
  { label: "Post Generator Agent", href: "/solutions/post-generator-agent" },
  { label: "Visual QA Agent", href: "/solutions/visual-qa-agent" },
  { label: "Social Publishing Agent", href: "/solutions/social-publishing-agent" },
  { label: "Performance Reporting Agent", href: "/solutions/performance-reporting-agent" },
];

const defaultChannels = ["Website", "Email", "SMS", "CRM", "Facebook", "Instagram", "X", "LinkedIn"];

export const agents: AgentIntroData[] = [
  {
    slug: "lead-prospector-agent",
    agentName: "Lead Prospector Agent",
    eyebrow: "Lead Generation",
    headline: "Finds your next customers before your competitors do.",
    subheadline:
      "Scrapes and collects leads from Mongolian business directories, recruiting platforms, company websites, and public sources.",
    primaryBenefit: "Builds a larger qualified prospect pipeline without manual list building.",
    hoursSaved: "10-15 hrs/week",
    qualifiedLeadImpact: "2-4x more target accounts",
    channels: ["Directories", "Recruiting platforms", "Company websites", "Public sources", "CRM"],
    processSteps: ["Search sources", "Collect company data", "Extract contacts", "Remove duplicates", "Send to CRM"],
    benefits: ["Faster prospecting", "Bigger pipeline", "Better targeting", "Less manual research"],
    humanInLoop: "User approves source rules and target industries before scraping.",
    integrations: ["Mongolian directories", "Company websites", "Recruiting platforms", "Agentic CRM"],
    visualType: "prospector-radar",
    icon: Radar,
  },
  {
    slug: "lead-enrichment-agent",
    agentName: "Lead Enrichment Agent",
    eyebrow: "Lead Intelligence",
    headline: "Turns raw contacts into sales-ready company profiles.",
    subheadline:
      "Adds industry, company size, decision makers, emails, phones, social links, website, and buying signals.",
    primaryBenefit: "Transforms incomplete lead records into useful sales context.",
    hoursSaved: "8-12 hrs/week",
    qualifiedLeadImpact: "Cleaner records, stronger personalization",
    channels: ["CRM", "Company websites", "Email", "Phone", "Social profiles"],
    processSteps: ["Receive raw lead", "Enrich company profile", "Classify industry", "Identify decision makers", "Update CRM"],
    benefits: ["Better personalization", "Cleaner CRM", "Stronger outreach"],
    humanInLoop: "User reviews enrichment rules and approves sensitive data fields before activation.",
    integrations: ["Agentic CRM", "Website sources", "Email tools", "Social channels"],
    visualType: "enrichment-profile",
    icon: DatabaseZap,
  },
  {
    slug: "research-intelligence-agent",
    agentName: "Research Intelligence Agent",
    eyebrow: "Market Intelligence",
    headline: "Reads the market every day so your brand always sounds smart.",
    subheadline:
      "Browses industry websites, news, reports, and competitor content to find useful insights.",
    primaryBenefit: "Keeps marketing grounded in fresh, industry-specific insight.",
    hoursSaved: "6-10 hrs/week",
    qualifiedLeadImpact: "More relevant content angles",
    channels: ["Industry websites", "News", "Reports", "Competitors", "Content agents"],
    processSteps: ["Scan sources", "Extract insights", "Summarize", "Rank by relevance", "Send to content agents"],
    benefits: ["Fresh ideas", "Stronger authority", "Industry-specific content"],
    humanInLoop: "User approves trusted sources, blocked sources, and strategic topics.",
    integrations: ["News sources", "Competitor sites", "Research reports", "Content Planner"],
    visualType: "research-intel",
    icon: BrainCircuit,
  },
  {
    slug: "blog-writer-agent",
    agentName: "Blog Writer Agent",
    eyebrow: "Content Engine",
    headline: "Converts insights into SEO-ready articles.",
    subheadline: "Writes educational blog posts and website articles based on researched insights.",
    primaryBenefit: "Turns market intelligence into publishable authority content.",
    hoursSaved: "6-12 hrs/week",
    qualifiedLeadImpact: "More organic education touchpoints",
    channels: ["Website", "Blog", "SEO", "Newsletter", "LinkedIn"],
    processSteps: ["Receive insight", "Create outline", "Write article", "Optimize title/meta", "Send for approval"],
    benefits: ["More website traffic", "Authority building", "Reusable content"],
    humanInLoop: "User approves article angles, final copy, and publishing priority.",
    integrations: ["Research Agent", "CMS", "Newsletter Agent", "Search Console"],
    visualType: "blog-seo",
    icon: PenLine,
  },
  {
    slug: "newsletter-agent",
    agentName: "Newsletter Agent",
    eyebrow: "Nurture Content",
    headline: "Keeps prospects warm with valuable industry insights.",
    subheadline: "Turns articles and research into email newsletters.",
    primaryBenefit: "Creates consistent high-value touchpoints for prospects.",
    hoursSaved: "5-8 hrs/week",
    qualifiedLeadImpact: "More repeat engagement",
    channels: ["Email newsletter", "Blog", "CRM segments", "Industry lists"],
    processSteps: ["Choose topic", "Write newsletter", "Add CTA", "Personalize by industry", "Send to Email Agent"],
    benefits: ["Consistent nurturing", "Trust building", "Repeat touchpoints"],
    humanInLoop: "User approves newsletter topic, audience segment, and CTA before campaign handoff.",
    integrations: ["Blog Writer", "Email Agent", "Agentic CRM", "Audience segments"],
    visualType: "newsletter-hub",
    icon: Newspaper,
  },
  {
    slug: "email-marketing-agent",
    agentName: "Email Marketing Agent",
    eyebrow: "Email Nurturing",
    headline: "Sends newsletters, tracks interest, and moves leads forward.",
    subheadline: "Sends campaigns, tracks opens/clicks/replies, and updates lead score.",
    primaryBenefit: "Turns email engagement into measurable sales signals.",
    hoursSaved: "8-12 hrs/week",
    qualifiedLeadImpact: "Better follow-up timing",
    channels: ["Email", "CRM", "Newsletter", "Lead scoring"],
    processSteps: ["Segment audience", "Send email", "Track opens", "Track clicks", "Update CRM"],
    benefits: ["Automated nurturing", "Measurable engagement", "Better follow-up timing"],
    humanInLoop: "User approves audience rules, templates, send windows, and high-impact campaigns.",
    integrations: ["Email platform", "Agentic CRM", "Lead Scoring", "Newsletter Agent"],
    visualType: "email-signals",
    icon: Mail,
  },
  {
    slug: "sms-outreach-agent",
    agentName: "SMS Outreach Agent",
    eyebrow: "Direct Response",
    headline: "Turns interest into replies through short CallPro messages.",
    subheadline:
      "Sends personalized SMS through CallPro and tracks replies like yes, interested, stop, or meeting request.",
    primaryBenefit: "Converts warm intent into direct conversations faster.",
    hoursSaved: "6-8 hrs/week",
    qualifiedLeadImpact: "Faster reply and meeting conversion",
    channels: ["CallPro", "SMS", "CRM", "Lead scoring", "Sales team"],
    processSteps: ["Select hot leads", "Generate short SMS", "Send via CallPro", "Detect reply intent", "Update score"],
    benefits: ["Faster response", "Stronger CTA", "Direct meeting conversion", "Opt-out handling"],
    humanInLoop: "User approves SMS templates, send rules, and opt-out handling before outreach.",
    integrations: ["CallPro", "Agentic CRM", "Lead Scoring", "Sales calendar"],
    visualType: "sms-router",
    icon: MessageSquareText,
  },
  {
    slug: "lead-scoring-agent",
    agentName: "Lead Scoring Agent",
    eyebrow: "Intent Detection",
    headline: "Knows who is ready to buy.",
    subheadline:
      "Scores leads based on website visits, article reads, email opens, link clicks, webinar signup, webinar attendance, SMS replies, and meeting interest.",
    primaryBenefit: "Shows sales which leads deserve attention now.",
    hoursSaved: "6-10 hrs/week",
    qualifiedLeadImpact: "Higher close-rate focus",
    channels: ["Website", "Email", "SMS", "Webinar", "CRM"],
    processSteps: ["Collect events", "Assign score", "Classify lead temperature", "Trigger next action", "Notify sales"],
    benefits: ["Sales focus", "Less wasted calls", "Better close rate"],
    humanInLoop: "User approves scoring weights and thresholds before automated next actions.",
    integrations: ["Web analytics", "Email Agent", "SMS Agent", "Agentic CRM", "Webinar tools"],
    visualType: "scoring-gauge",
    icon: Gauge,
  },
  {
    slug: "agentic-crm-agent",
    agentName: "Agentic CRM Agent",
    eyebrow: "Revenue Operations",
    headline: "A CRM that updates itself.",
    subheadline: "Stores leads, events, notes, statuses, scores, and next actions automatically.",
    primaryBenefit: "Keeps the funnel current without manual admin work.",
    hoursSaved: "8-12 hrs/week",
    qualifiedLeadImpact: "Full funnel visibility",
    channels: ["CRM", "Sales tasks", "Email", "SMS", "Reporting"],
    processSteps: ["Receive events", "Update lead profile", "Create task", "Notify human", "Archive history"],
    benefits: ["Cleaner database", "No forgotten follow-up", "Full funnel visibility"],
    humanInLoop: "User approves pipeline stages, notification rules, and ownership assignment.",
    integrations: ["Agentic CRM", "Email", "SMS", "Sales calendar", "Reporting"],
    visualType: "crm-sync",
    icon: ClipboardCheck,
  },
  {
    slug: "social-media-research-agent",
    agentName: "Social Media Research Agent",
    eyebrow: "Social Intelligence",
    headline: "Finds what your audience should hear today.",
    subheadline: "Researches trends, news, industry pain points, customer questions, and competitor posts.",
    primaryBenefit: "Feeds social strategy with timely customer-relevant topics.",
    hoursSaved: "5-8 hrs/week",
    qualifiedLeadImpact: "More relevant social content",
    channels: ["Facebook", "Instagram", "X", "LinkedIn", "Competitor feeds"],
    processSteps: ["Scan trends", "Read audience questions", "Review competitors", "Cluster themes", "Send insights"],
    benefits: ["Timely topics", "Better audience fit", "Less blank-page work"],
    humanInLoop: "User approves topic categories, competitors, and brand-safe research boundaries.",
    integrations: ["Social platforms", "Competitor pages", "Content Planner", "Ideation Agent"],
    visualType: "social-radar",
    icon: Search,
  },
  {
    slug: "content-planner-agent",
    agentName: "Content Planner Agent",
    eyebrow: "Editorial Operations",
    headline: "Builds your weekly content calendar automatically.",
    subheadline: "Plans daily/weekly content across Facebook, Instagram, X, LinkedIn, and blog.",
    primaryBenefit: "Turns scattered ideas into a usable publishing plan.",
    hoursSaved: "4-7 hrs/week",
    qualifiedLeadImpact: "More consistent demand generation",
    channels: ["Facebook", "Instagram", "X", "LinkedIn", "Blog"],
    processSteps: ["Collect topics", "Balance channels", "Assign formats", "Schedule calendar", "Send for approval"],
    benefits: ["Consistent cadence", "Balanced channels", "Clear weekly priorities"],
    humanInLoop: "User approves campaign priorities and weekly calendar before production starts.",
    integrations: ["Research Agent", "Content Ideation", "Publishing Agent", "Blog Writer"],
    visualType: "calendar-grid",
    icon: CalendarClock,
  },
  {
    slug: "content-ideation-agent",
    agentName: "Content Ideation Agent",
    eyebrow: "Creative Strategy",
    headline: "Creates scroll-stopping content angles.",
    subheadline:
      "Converts research into hooks, stories, carousel ideas, short video ideas, and educational posts.",
    primaryBenefit: "Creates stronger campaign angles from the same research base.",
    hoursSaved: "5-8 hrs/week",
    qualifiedLeadImpact: "Higher engagement potential",
    channels: ["Facebook", "Instagram", "X", "LinkedIn", "Video", "Blog"],
    processSteps: ["Receive research", "Generate hooks", "Map content formats", "Rank ideas", "Send to production"],
    benefits: ["More angles", "Better hooks", "Faster content production"],
    humanInLoop: "User approves content angles and rejects off-brand ideas before design generation.",
    integrations: ["Research Agent", "Planner Agent", "Visual Designer", "Post Generator"],
    visualType: "ideation-engine",
    icon: Lightbulb,
  },
  {
    slug: "visual-designer-agent",
    agentName: "Visual Designer Agent",
    eyebrow: "Brand System",
    headline: "Keeps every post on-brand.",
    subheadline: "Applies brand colors, fonts, visual style, layout rules, and design system.",
    primaryBenefit: "Protects brand quality while scaling production.",
    hoursSaved: "4-8 hrs/week",
    qualifiedLeadImpact: "More professional campaign assets",
    channels: ["Brand kit", "Templates", "Social posts", "Carousels", "Video covers"],
    processSteps: ["Load brand kit", "Select layout", "Apply visual rules", "Prepare asset brief", "Send to generator"],
    benefits: ["Brand consistency", "Less design rework", "Faster approvals"],
    humanInLoop: "User approves brand system rules and any new campaign visual direction.",
    integrations: ["Brand assets", "Design templates", "Post Generator", "Visual QA"],
    visualType: "brand-system",
    icon: Sparkles,
  },
  {
    slug: "post-generator-agent",
    agentName: "Post Generator Agent",
    eyebrow: "Creative Production",
    headline: "Creates branded images, carousels, and videos.",
    subheadline: "Uses image/video generation APIs and templates to create actual social posts.",
    primaryBenefit: "Produces campaign assets without waiting on manual design cycles.",
    hoursSaved: "8-15 hrs/week",
    qualifiedLeadImpact: "More campaign output per week",
    channels: ["Image generation", "Video generation", "Templates", "Social platforms"],
    processSteps: ["Receive approved idea", "Generate creative", "Apply template", "Export variations", "Send to QA"],
    benefits: ["More assets", "Faster production", "Reusable variations"],
    humanInLoop: "User approves generated assets before publishing or paid distribution.",
    integrations: ["Image APIs", "Video APIs", "Design templates", "Visual QA", "Publishing Agent"],
    visualType: "media-generator",
    icon: ImagePlus,
  },
  {
    slug: "visual-qa-agent",
    agentName: "Visual QA Agent",
    eyebrow: "Quality Control",
    headline: "Checks quality before anything goes public.",
    subheadline: "Reviews design alignment, typo risk, brand consistency, CTA clarity, and goal alignment.",
    primaryBenefit: "Stops weak or risky creative before it reaches customers.",
    hoursSaved: "3-6 hrs/week",
    qualifiedLeadImpact: "Higher trust and brand consistency",
    channels: ["Design assets", "Social posts", "CTA checks", "Brand rules"],
    processSteps: ["Inspect design", "Check copy", "Score brand fit", "Route fixes", "Send for approval/posting"],
    benefits: ["Fewer mistakes", "Stronger brand alignment", "Cleaner CTAs"],
    humanInLoop: "Sends bad designs back to generator; sends good designs for approval/posting.",
    integrations: ["Post Generator", "Brand system", "Publishing Agent", "Approval queue"],
    visualType: "visual-qa",
    icon: Eye,
  },
  {
    slug: "social-publishing-agent",
    agentName: "Social Publishing Agent",
    eyebrow: "Distribution",
    headline: "Publishes content across every channel.",
    subheadline: "Schedules and posts to Facebook, Instagram, X, LinkedIn, and other channels.",
    primaryBenefit: "Turns approved content into reliable multi-channel execution.",
    hoursSaved: "3-5 hrs/week",
    qualifiedLeadImpact: "More consistent visibility",
    channels: ["Facebook", "Instagram", "X", "LinkedIn", "Other channels"],
    processSteps: ["Receive approved posts", "Schedule by channel", "Publish", "Track status", "Send events to reporting"],
    benefits: ["Reliable posting", "Channel consistency", "Less manual scheduling"],
    humanInLoop: "User approves final content queue before publishing starts.",
    integrations: ["Facebook", "Instagram", "X", "LinkedIn", "Reporting Agent"],
    visualType: "publishing-orbit",
    icon: Send,
  },
  {
    slug: "performance-reporting-agent",
    agentName: "Performance Reporting Agent",
    eyebrow: "Analytics",
    headline: "Turns marketing activity into Monday morning decisions.",
    subheadline:
      "Collects website traffic, post engagement, email KPIs, SMS replies, webinar attendance, and lead conversions.",
    primaryBenefit: "Shows what worked, what failed, and what to do next.",
    hoursSaved: "4-8 hrs/week",
    qualifiedLeadImpact: "Faster campaign improvement",
    channels: ["Website", "Social", "Email", "SMS", "Webinar", "CRM"],
    processSteps: ["Collect data", "Summarize KPIs", "Detect wins/problems", "Recommend actions", "Send report"],
    benefits: ["Clear ROI", "Faster decisions", "Better campaign improvement"],
    humanInLoop: "User reviews recommendations and approves major strategy changes.",
    integrations: ["Web analytics", "Social platforms", "Email", "CallPro", "Webinars", "Agentic CRM"],
    visualType: "reporting-room",
    icon: BarChart3,
  },
];

export const agentCategories: AgentCategory[] = [
  {
    name: "Lead Generation",
    description: "Find, enrich, score, and manage every prospect record.",
    agents: ["lead-prospector-agent", "lead-enrichment-agent", "lead-scoring-agent", "agentic-crm-agent"],
  },
  {
    name: "Content & Research",
    description: "Turn market intelligence into useful authority content.",
    agents: ["research-intelligence-agent", "blog-writer-agent", "newsletter-agent"],
  },
  {
    name: "Outreach & Nurturing",
    description: "Move warm prospects through email and SMS touchpoints.",
    agents: ["email-marketing-agent", "sms-outreach-agent"],
  },
  {
    name: "Social Media",
    description: "Research, plan, create, QA, and publish social content.",
    agents: [
      "social-media-research-agent",
      "content-planner-agent",
      "content-ideation-agent",
      "visual-designer-agent",
      "post-generator-agent",
      "visual-qa-agent",
      "social-publishing-agent",
    ],
  },
  {
    name: "Analytics",
    description: "Turn activity into decisions and next best actions.",
    agents: ["performance-reporting-agent"],
  },
];

export const overviewChannels = [
  "Website & Blog",
  "Email Newsletter",
  "SMS / CallPro",
  "Facebook",
  "Instagram",
  "X",
  "LinkedIn",
];

export const overviewProcess = [
  "Prospect",
  "Enrich",
  "Research",
  "Create Content",
  "Publish",
  "Nurture",
  "Score",
  "Human Sales Call",
  "Report",
];

export const salesFunnel = [
  "Audience",
  "Lead",
  "Engaged Reader",
  "Webinar Signup",
  "Hot Lead",
  "Sales Meeting",
  "Customer",
];

export const overviewBenefits = [
  { label: "70-90%", body: "human hours saved", icon: CheckCircle2 },
  { label: "2-5x", body: "more qualified leads", icon: Target },
  { label: "24/7", body: "nurturing across channels", icon: Rocket },
  { label: "Lower CAC", body: "with automated touchpoints", icon: MousePointerClick },
  { label: "Faster cycles", body: "from intent to meeting", icon: PhoneCall },
  { label: "Human approval", body: "before important actions", icon: ShieldCheck },
];

export const channelIconMap: Record<string, LucideIcon> = {
  Website: Globe2,
  "Website & Blog": Globe2,
  Blog: BookOpenText,
  Email: Mail,
  "Email newsletter": Mail,
  "Email Newsletter": Mail,
  SMS: MessageSquareText,
  "SMS / CallPro": MessageSquareText,
  CallPro: MessageSquareText,
  CRM: DatabaseZap,
  "Agentic CRM": DatabaseZap,
  Facebook: Share2,
  Instagram: ImagePlus,
  X: MessageSquareText,
  LinkedIn: UsersRound,
  Webinar: CalendarClock,
  "Public sources": Search,
  Directories: Radar,
  "Company websites": Globe2,
};

export function getChannelIcon(channel: string) {
  return channelIconMap[channel] ?? Sparkles;
}

export function getAgentBySlug(slug: string) {
  return agents.find((agent) => agent.slug === slug);
}

export function getAgentsBySlugs(slugs: string[]) {
  return slugs.map((slug) => getAgentBySlug(slug)).filter(Boolean) as AgentIntroData[];
}

export function getDefaultChannels() {
  return defaultChannels;
}
