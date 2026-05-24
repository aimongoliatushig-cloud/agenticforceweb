import type { Locale } from "@/lib/i18n";
import {
  agents,
  agentCategories,
  overviewBenefits,
  overviewChannels,
  overviewProcess,
  salesFunnel,
  type AgentIntroData,
} from "./data";

type AgentText = Pick<
  AgentIntroData,
  | "agentName"
  | "eyebrow"
  | "headline"
  | "subheadline"
  | "primaryBenefit"
  | "qualifiedLeadImpact"
  | "channels"
  | "processSteps"
  | "benefits"
  | "humanInLoop"
  | "integrations"
>;

type OverviewCopy = {
  home: string;
  solutions: string;
  label: string;
  titleLead: string;
  titleAccent: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  stats: Array<[string, string]>;
  ecosystemLabel: string;
  ecosystemTitle: string;
  ecosystemCount: string;
  agentsCount: string;
  savedSuffix: string;
  funnelLabel: string;
  funnelTitle: string;
  benefitsLabel: string;
  benefitsTitle: string;
  approvalTitle: string;
  approvalBody: string;
  channelsLabel: string;
  channelsTitle: string;
  ctaLabel: string;
  ctaTitle: string;
  ctaBody: string;
  commandFunnelLabel: string;
  commandFunnelTitle: string;
  commandFunnelBadge: string;
  stage: string;
};

type IntroCopy = {
  solutions: string;
  bookDemo: string;
  exploreSystem: string;
  hoursSaved: string;
  pipelineImpact: string;
  primaryBenefit: string;
  howItWorks: string;
  operatingSequence: string;
  stepBody: string;
  businessOutcomes: string;
  whyItMatters: string;
  humanLabel: string;
  humanTitle: string;
  channelsLabel: string;
  channelsTitle: string;
  kpiLabel: string;
  kpiTitle: string;
  manualWork: string;
  revenueEffect: string;
  mockTitle: string;
  mockBody: string;
  deployLabel: string;
  deployTitle: (agentName: string) => string;
  deployBody: string;
  workflowLabel: string;
  mockData: string;
};

export const introCopy: Record<Locale, IntroCopy> = {
  en: {
    solutions: "Solutions",
    bookDemo: "Book a Demo",
    exploreSystem: "Explore Full Agentic System",
    hoursSaved: "Hours saved",
    pipelineImpact: "Pipeline impact",
    primaryBenefit: "Primary benefit",
    howItWorks: "How It Works",
    operatingSequence: "The operating sequence",
    stepBody: "The agent records the action, updates context, and prepares the next step for the system.",
    businessOutcomes: "Business Outcomes",
    whyItMatters: "Why it matters",
    humanLabel: "Human In The Loop",
    humanTitle: "AI does the heavy lifting. Your team stays in control.",
    channelsLabel: "Channels & Integrations",
    channelsTitle: "Connected to the revenue system",
    kpiLabel: "Operator KPI View",
    kpiTitle: "Weekly capacity released",
    manualWork: "Manual work removed",
    revenueEffect: "Revenue effect",
    mockTitle: "Mock command data only",
    mockBody: "No live scraping, CRM, email, SMS, or social platform API is connected in this version.",
    deployLabel: "Deploy The Agent",
    deployTitle: (agentName) => `Put ${agentName} inside your sales and marketing command center.`,
    deployBody:
      "Connect this specialist into the larger AgenticForce system and let your team focus on approvals, relationships, and closing.",
    workflowLabel: "Live Workflow Map",
    mockData: "Mock Data",
  },
  mn: {
    solutions: "Шийдлүүд",
    bookDemo: "Демо захиалах",
    exploreSystem: "Бүрэн агент системийг үзэх",
    hoursSaved: "Хэмнэх цаг",
    pipelineImpact: "Борлуулалтын нөлөө",
    primaryBenefit: "Гол ашиг тус",
    howItWorks: "Хэрхэн ажилладаг вэ",
    operatingSequence: "Ажиллах дараалал",
    stepBody: "Агент үйлдлийг бүртгэж, нөхцөл байдлыг шинэчилж, дараагийн алхмыг системд бэлдэнэ.",
    businessOutcomes: "Бизнесийн үр дүн",
    whyItMatters: "Яагаад чухал вэ",
    humanLabel: "Хүний хяналттай",
    humanTitle: "AI хүнд ажлыг хийж, танай баг хяналтаа хадгална.",
    channelsLabel: "Суваг ба интеграци",
    channelsTitle: "Орлогын системтэй холбогдсон",
    kpiLabel: "Операторын KPI самбар",
    kpiTitle: "Долоо хоног бүр чөлөөлөгдөх хүчин чадал",
    manualWork: "Хасагдах гар ажиллагаа",
    revenueEffect: "Орлогын нөлөө",
    mockTitle: "Зөвхөн жишээ команд дата",
    mockBody: "Энэ хувилбарт бодит scraping, CRM, email, SMS эсвэл social API холбогдоогүй.",
    deployLabel: "Агентийг нэвтрүүлэх",
    deployTitle: (agentName) => `${agentName}-ийг борлуулалт, маркетингийн команд төвдөө байрлуул.`,
    deployBody:
      "Энэ мэргэжлийн агентийг AgenticForce-ийн том системд холбоод, танай баг баталгаажуулалт, харилцаа, хаалтад төвлөрнө.",
    workflowLabel: "Шууд workflow зураглал",
    mockData: "Жишээ дата",
  },
};

export const overviewCopy: Record<Locale, OverviewCopy> = {
  en: {
    home: "Home",
    solutions: "Solutions",
    label: "Sales & Marketing Agents",
    titleLead: "Your AI Sales & Marketing Team.",
    titleAccent: "Always Working.",
    subheadline:
      "Agentic AI finds leads, researches industries, creates content, nurtures prospects across web, email, SMS, and social media, then scores buying intent and hands hot leads to your human sales team.",
    primaryCta: "Deploy Your Agentic Sales Machine",
    secondaryCta: "Explore All Agents",
    stats: [
      ["70-90%", "Hours saved"],
      ["2-5x", "More qualified leads"],
      ["24/7", "Nurturing"],
      ["Human", "Approval layer"],
    ],
    ecosystemLabel: "The Complete Agentic Ecosystem",
    ecosystemTitle: "A team of specialized AI agents working for you",
    ecosystemCount: "17 specialist agents plus one command system",
    agentsCount: "agents",
    savedSuffix: "saved",
    funnelLabel: "Sales Funnel Visualization",
    funnelTitle: "From audience to customer",
    benefitsLabel: "Benefits",
    benefitsTitle: "Why businesses choose Agentic AI",
    approvalTitle: "Human approval before important actions",
    approvalBody: "AgenticForce is designed as a controlled operating system, not an unchecked autopilot.",
    channelsLabel: "Channels We Work Across",
    channelsTitle: "One command layer across every customer touchpoint",
    ctaLabel: "CTA",
    ctaTitle: "Deploy Your Agentic Sales Machine",
    ctaBody:
      "Launch a controlled AI workforce for prospecting, content, nurturing, scoring, reporting, and human handoff.",
    commandFunnelLabel: "Multi-channel command funnel",
    commandFunnelTitle: "Agentic орлогын workflow",
    commandFunnelBadge: "AI driven. Human approved.",
    stage: "Stage",
  },
  mn: {
    home: "Нүүр",
    solutions: "Шийдлүүд",
    label: "Борлуулалт ба маркетингийн агентууд",
    titleLead: "Таны AI борлуулалт, маркетингийн баг.",
    titleAccent: "Үргэлж ажиллаж байна.",
    subheadline:
      "Agentic AI нь лийд олж, салбарын судалгаа хийж, контент бүтээж, web, email, SMS, social сувгаар харилцагчдыг nurturing хийж, худалдан авах сонирхлыг оноож, халуун лийдийг хүний борлуулалтын багт шилжүүлнэ.",
    primaryCta: "Agentic борлуулалтын машинаа нэвтрүүлэх",
    secondaryCta: "Бүх агентийг үзэх",
    stats: [
      ["70-90%", "Цаг хэмнэлт"],
      ["2-5x", "Илүү чанартай лийд"],
      ["24/7", "Тасралтгүй nurturing"],
      ["Хүн", "Баталгаажуулалтын давхарга"],
    ],
    ecosystemLabel: "Бүрэн agentic экосистем",
    ecosystemTitle: "Танд ажиллах мэргэшсэн AI агентуудын баг",
    ecosystemCount: "17 мэргэшсэн агент ба нэг команд систем",
    agentsCount: "агент",
    savedSuffix: "хэмнэнэ",
    funnelLabel: "Борлуулалтын funnel зураглал",
    funnelTitle: "Audience-оос customer хүртэл",
    benefitsLabel: "Ашиг тус",
    benefitsTitle: "Бизнесүүд яагаад Agentic AI сонгодог вэ",
    approvalTitle: "Чухал үйлдлийн өмнө хүний баталгаажуулалт",
    approvalBody: "AgenticForce нь хяналтгүй autopilot биш, удирдлагатай operating system байдлаар бүтээгдсэн.",
    channelsLabel: "Ажиллах сувгууд",
    channelsTitle: "Хэрэглэгчийн бүх touchpoint дээр нэг команд давхарга",
    ctaLabel: "CTA",
    ctaTitle: "Agentic борлуулалтын машинаа нэвтрүүлэх",
    ctaBody:
      "Prospecting, content, nurturing, scoring, reporting, human handoff бүхий хяналттай AI ажиллах хүчийг эхлүүл.",
    commandFunnelLabel: "Олон сувгийн команд funnel",
    commandFunnelTitle: "Agentic revenue workflow",
    commandFunnelBadge: "AI ажиллуулна. Хүн батална.",
    stage: "Шат",
  },
};

const categoryText: Record<Locale, Record<string, { name: string; description: string }>> = {
  en: Object.fromEntries(agentCategories.map((category) => [category.name, category])),
  mn: {
    "Lead Generation": {
      name: "Лийд үүсгэлт",
      description: "Бүх prospect record-ыг олох, баяжуулах, оноох, удирдах.",
    },
    "Content & Research": {
      name: "Контент ба судалгаа",
      description: "Зах зээлийн intelligence-ийг authority content болгон хувиргах.",
    },
    "Outreach & Nurturing": {
      name: "Outreach ба nurturing",
      description: "Дулаан prospect-уудыг email болон SMS touchpoint-уудаар урагшлуулах.",
    },
    "Social Media": {
      name: "Social media",
      description: "Social контентийг судлах, төлөвлөх, бүтээх, шалгах, нийтлэх.",
    },
    Analytics: {
      name: "Аналитик",
      description: "Маркетингийн үйл ажиллагааг шийдвэр болон дараагийн action болгох.",
    },
  },
};

const overviewTranslations: Record<
  Locale,
  {
    process: string[];
    channels: string[];
    funnel: string[];
    benefits: Array<{ label: string; body: string }>;
  }
> = {
  en: {
    process: overviewProcess,
    channels: overviewChannels,
    funnel: salesFunnel,
    benefits: overviewBenefits.map(({ label, body }) => ({ label, body })),
  },
  mn: {
    process: [
      "Prospect олох",
      "Баяжуулах",
      "Судлах",
      "Контент бүтээх",
      "Нийтлэх",
      "Nurture хийх",
      "Оноох",
      "Хүний борлуулалтын дуудлага",
      "Тайлагнах",
    ],
    channels: ["Website & Blog", "Email newsletter", "SMS / CallPro", "Facebook", "Instagram", "X", "LinkedIn"],
    funnel: ["Audience", "Лийд", "Идэвхтэй уншигч", "Webinar signup", "Халуун лийд", "Sales meeting", "Customer"],
    benefits: [
      { label: "70-90%", body: "хүний цаг хэмнэнэ" },
      { label: "2-5x", body: "илүү чанартай лийд" },
      { label: "24/7", body: "бүх сувгаар nurturing" },
      { label: "Бага CAC", body: "автомат touchpoint-уудаар" },
      { label: "Хурдан цикл", body: "сонирхлоос meeting хүртэл" },
      { label: "Хүний баталгаа", body: "чухал үйлдлийн өмнө" },
    ],
  },
};

const mnAgents: Record<string, AgentText> = {
  "lead-prospector-agent": {
    agentName: "Lead Prospector Agent",
    eyebrow: "Лийд үүсгэлт",
    headline: "Өрсөлдөгчөөс тань өмнө дараагийн хэрэглэгчдийг олно.",
    subheadline:
      "Монголын бизнес лавлах, recruiting платформ, компанийн website болон public source-уудаас лийд цуглуулна.",
    primaryBenefit: "Гар аргаар жагсаалт үүсгэхгүйгээр илүү том qualified prospect pipeline бүрдүүлнэ.",
    qualifiedLeadImpact: "2-4x илүү target account",
    channels: ["Лавлахууд", "Recruiting платформ", "Компанийн website", "Public source", "CRM"],
    processSteps: ["Source хайх", "Компанийн дата цуглуулах", "Contact ялгах", "Давхардал арилгах", "CRM рүү илгээх"],
    benefits: ["Илүү хурдан prospecting", "Илүү том pipeline", "Илүү сайн targeting", "Гар судалгаа багасна"],
    humanInLoop: "Scraping эхлэхээс өмнө хэрэглэгч source rules болон target industry-г батална.",
    integrations: ["Монгол бизнес лавлах", "Компанийн website", "Recruiting платформ", "Agentic CRM"],
  },
  "lead-enrichment-agent": {
    agentName: "Lead Enrichment Agent",
    eyebrow: "Лийд intelligence",
    headline: "Түүхий contact-ыг sales-ready company profile болгоно.",
    subheadline:
      "Industry, company size, decision maker, email, phone, social link, website болон buying signal нэмнэ.",
    primaryBenefit: "Дутуу lead record-ыг борлуулалтад хэрэгтэй context болгон хувиргана.",
    qualifiedLeadImpact: "Цэвэр record, илүү сайн personalization",
    channels: ["CRM", "Компанийн website", "Email", "Phone", "Social profile"],
    processSteps: ["Түүхий лийд хүлээн авах", "Company profile баяжуулах", "Industry ангилах", "Decision maker олох", "CRM шинэчлэх"],
    benefits: ["Илүү сайн personalization", "Цэвэр CRM", "Илүү хүчтэй outreach"],
    humanInLoop: "Хэрэглэгч enrichment rules болон sensitive data field-үүдийг идэвхжүүлэхээс өмнө батална.",
    integrations: ["Agentic CRM", "Website source", "Email tool", "Social channel"],
  },
  "research-intelligence-agent": {
    agentName: "Research Intelligence Agent",
    eyebrow: "Зах зээлийн intelligence",
    headline: "Танай брэндийг үргэлж ухаалаг сонсогдуулахын тулд зах зээлийг өдөр бүр уншина.",
    subheadline: "Industry website, news, report болон competitor content-оос хэрэгтэй insight олно.",
    primaryBenefit: "Маркетингийг шинэ, салбарын онцлогтой insight дээр тулгуурлуулна.",
    qualifiedLeadImpact: "Илүү relevant content angle",
    channels: ["Industry website", "News", "Report", "Competitor", "Content agent"],
    processSteps: ["Source scan хийх", "Insight ялгах", "Товчлох", "Relevance-аар эрэмбэлэх", "Content agent руу илгээх"],
    benefits: ["Шинэ санаа", "Илүү хүчтэй authority", "Салбарын онцлогтой content"],
    humanInLoop: "Хэрэглэгч trusted source, blocked source болон strategic topic-уудыг батална.",
    integrations: ["News source", "Competitor site", "Research report", "Content Planner"],
  },
  "blog-writer-agent": {
    agentName: "Blog Writer Agent",
    eyebrow: "Контент engine",
    headline: "Insight-ыг SEO-ready article болгоно.",
    subheadline: "Судалгааны insight дээр тулгуурлан educational blog post болон website article бичнэ.",
    primaryBenefit: "Market intelligence-ийг publish хийх боломжтой authority content болгон хувиргана.",
    qualifiedLeadImpact: "Илүү олон organic education touchpoint",
    channels: ["Website", "Blog", "SEO", "Newsletter", "LinkedIn"],
    processSteps: ["Insight хүлээн авах", "Outline үүсгэх", "Article бичих", "Title/meta optimize хийх", "Баталгаажуулалтад илгээх"],
    benefits: ["Website traffic өснө", "Authority бүрдэнэ", "Дахин ашиглах content"],
    humanInLoop: "Хэрэглэгч article angle, final copy болон publishing priority-г батална.",
    integrations: ["Research Agent", "CMS", "Newsletter Agent", "Search Console"],
  },
  "newsletter-agent": {
    agentName: "Newsletter Agent",
    eyebrow: "Nurture content",
    headline: "Үнэ цэнтэй салбарын insight-аар prospect-уудыг дулаан хадгална.",
    subheadline: "Article болон research-ийг email newsletter болгоно.",
    primaryBenefit: "Prospect-д тогтмол өндөр үнэ цэнтэй touchpoint бий болгоно.",
    qualifiedLeadImpact: "Илүү олон давтан engagement",
    channels: ["Email newsletter", "Blog", "CRM segment", "Industry list"],
    processSteps: ["Сэдэв сонгох", "Newsletter бичих", "CTA нэмэх", "Industry-гаар personalize хийх", "Email Agent руу илгээх"],
    benefits: ["Тогтмол nurturing", "Итгэлцэл бий болгох", "Давтан touchpoint"],
    humanInLoop: "Хэрэглэгч newsletter topic, audience segment болон CTA-г campaign handoff-оос өмнө батална.",
    integrations: ["Blog Writer", "Email Agent", "Agentic CRM", "Audience segment"],
  },
  "email-marketing-agent": {
    agentName: "Email Marketing Agent",
    eyebrow: "Email nurturing",
    headline: "Newsletter илгээж, сонирхлыг хэмжиж, лийдийг урагшлуулна.",
    subheadline: "Campaign илгээж, open/click/reply tracking хийж, lead score шинэчилнэ.",
    primaryBenefit: "Email engagement-ийг хэмжигдэх sales signal болгоно.",
    qualifiedLeadImpact: "Илүү зөв follow-up timing",
    channels: ["Email", "CRM", "Newsletter", "Lead scoring"],
    processSteps: ["Audience segment хийх", "Email илгээх", "Open tracking", "Click tracking", "CRM шинэчлэх"],
    benefits: ["Автомат nurturing", "Хэмжигдэх engagement", "Илүү зөв follow-up timing"],
    humanInLoop: "Хэрэглэгч audience rule, template, send window болон high-impact campaign-уудыг батална.",
    integrations: ["Email platform", "Agentic CRM", "Lead Scoring", "Newsletter Agent"],
  },
  "sms-outreach-agent": {
    agentName: "SMS Outreach Agent",
    eyebrow: "Шууд хариу",
    headline: "Сонирхлыг богино CallPro message-ээр reply болгон хувиргана.",
    subheadline:
      "CallPro-оор personalized SMS илгээж, yes, interested, stop, meeting request зэрэг reply intent-ийг танина.",
    primaryBenefit: "Дулаан intent-ийг илүү хурдан шууд conversation болгоно.",
    qualifiedLeadImpact: "Илүү хурдан reply ба meeting conversion",
    channels: ["CallPro", "SMS", "CRM", "Lead scoring", "Sales team"],
    processSteps: ["Hot lead сонгох", "Богино SMS үүсгэх", "CallPro-оор илгээх", "Reply intent таних", "Score шинэчлэх"],
    benefits: ["Хурдан response", "Илүү хүчтэй CTA", "Шууд meeting conversion", "Opt-out handling"],
    humanInLoop: "Хэрэглэгч SMS template, send rule болон opt-out handling-г outreach-оос өмнө батална.",
    integrations: ["CallPro", "Agentic CRM", "Lead Scoring", "Sales calendar"],
  },
  "lead-scoring-agent": {
    agentName: "Lead Scoring Agent",
    eyebrow: "Intent detection",
    headline: "Хэн худалдан авахад бэлэн байгааг мэднэ.",
    subheadline:
      "Website visit, article read, email open, link click, webinar signup/attendance, SMS reply, meeting interest дээр үндэслэн лийд онооно.",
    primaryBenefit: "Sales багт аль лийд одоо анхаарал авах ёстойг харуулна.",
    qualifiedLeadImpact: "Илүү өндөр close-rate focus",
    channels: ["Website", "Email", "SMS", "Webinar", "CRM"],
    processSteps: ["Event цуглуулах", "Score оноох", "Lead temperature ангилах", "Дараагийн action trigger хийх", "Sales-д мэдэгдэх"],
    benefits: ["Sales focus", "Дэмий дуудлага багасна", "Close rate сайжирна"],
    humanInLoop: "Хэрэглэгч scoring weight болон threshold-уудыг automated action-оос өмнө батална.",
    integrations: ["Web analytics", "Email Agent", "SMS Agent", "Agentic CRM", "Webinar tool"],
  },
  "agentic-crm-agent": {
    agentName: "Agentic CRM Agent",
    eyebrow: "Revenue operations",
    headline: "Өөрөө шинэчлэгддэг CRM.",
    subheadline: "Лийд, event, note, status, score болон next action-уудыг автоматаар хадгална.",
    primaryBenefit: "Гар admin ажилгүйгээр funnel-ийг шинэ байлгана.",
    qualifiedLeadImpact: "Бүрэн funnel visibility",
    channels: ["CRM", "Sales task", "Email", "SMS", "Reporting"],
    processSteps: ["Event хүлээн авах", "Lead profile шинэчлэх", "Task үүсгэх", "Хүнд мэдэгдэх", "History archive хийх"],
    benefits: ["Цэвэр database", "Follow-up мартагдахгүй", "Бүрэн funnel visibility"],
    humanInLoop: "Хэрэглэгч pipeline stage, notification rule болон ownership assignment-г батална.",
    integrations: ["Agentic CRM", "Email", "SMS", "Sales calendar", "Reporting"],
  },
  "social-media-research-agent": {
    agentName: "Social Media Research Agent",
    eyebrow: "Social intelligence",
    headline: "Өнөөдөр танай audience юу сонсох ёстойг олно.",
    subheadline: "Trend, news, industry pain point, customer question болон competitor post-уудыг судална.",
    primaryBenefit: "Social strategy-г цаг үеэ олсон customer-relevant topic-уудаар тэжээнэ.",
    qualifiedLeadImpact: "Илүү relevant social content",
    channels: ["Facebook", "Instagram", "X", "LinkedIn", "Competitor feed"],
    processSteps: ["Trend scan хийх", "Audience question унших", "Competitor шалгах", "Theme cluster хийх", "Insight илгээх"],
    benefits: ["Цаг үеэ олсон topic", "Илүү сайн audience fit", "Blank-page ажил багасна"],
    humanInLoop: "Хэрэглэгч topic category, competitor болон brand-safe research boundary-г батална.",
    integrations: ["Social platform", "Competitor page", "Content Planner", "Ideation Agent"],
  },
  "content-planner-agent": {
    agentName: "Content Planner Agent",
    eyebrow: "Editorial operations",
    headline: "Долоо хоногийн content calendar-ийг автоматаар бүтээнэ.",
    subheadline: "Facebook, Instagram, X, LinkedIn болон blog дээр daily/weekly content төлөвлөнө.",
    primaryBenefit: "Тархай санааг ашиглах боломжтой publishing plan болгоно.",
    qualifiedLeadImpact: "Илүү тогтмол demand generation",
    channels: ["Facebook", "Instagram", "X", "LinkedIn", "Blog"],
    processSteps: ["Topic цуглуулах", "Channel тэнцвэржүүлэх", "Format оноох", "Calendar schedule хийх", "Баталгаажуулалтад илгээх"],
    benefits: ["Тогтмол cadence", "Тэнцвэртэй channel", "Тодорхой weekly priority"],
    humanInLoop: "Хэрэглэгч campaign priority болон weekly calendar-ийг production эхлэхээс өмнө батална.",
    integrations: ["Research Agent", "Content Ideation", "Publishing Agent", "Blog Writer"],
  },
  "content-ideation-agent": {
    agentName: "Content Ideation Agent",
    eyebrow: "Creative strategy",
    headline: "Scroll зогсоох content angle-ууд бүтээнэ.",
    subheadline: "Research-ийг hook, story, carousel idea, short video idea болон educational post болгон хувиргана.",
    primaryBenefit: "Нэг research base-аас илүү хүчтэй campaign angle гаргана.",
    qualifiedLeadImpact: "Илүү өндөр engagement potential",
    channels: ["Facebook", "Instagram", "X", "LinkedIn", "Video", "Blog"],
    processSteps: ["Research хүлээн авах", "Hook үүсгэх", "Content format зураглах", "Idea эрэмбэлэх", "Production руу илгээх"],
    benefits: ["Илүү олон angle", "Илүү сайн hook", "Хурдан content production"],
    humanInLoop: "Хэрэглэгч content angle-уудыг баталж, off-brand idea-г design generation-оос өмнө хасна.",
    integrations: ["Research Agent", "Planner Agent", "Visual Designer", "Post Generator"],
  },
  "visual-designer-agent": {
    agentName: "Visual Designer Agent",
    eyebrow: "Brand system",
    headline: "Пост бүрийг on-brand байлгана.",
    subheadline: "Brand color, font, visual style, layout rule болон design system-ийг хэрэглэнэ.",
    primaryBenefit: "Production scale хийхдээ brand quality-г хамгаална.",
    qualifiedLeadImpact: "Илүү professional campaign asset",
    channels: ["Brand kit", "Template", "Social post", "Carousel", "Video cover"],
    processSteps: ["Brand kit ачаалах", "Layout сонгох", "Visual rule хэрэглэх", "Asset brief бэлдэх", "Generator руу илгээх"],
    benefits: ["Brand consistency", "Design rework багасна", "Approval хурдсана"],
    humanInLoop: "Хэрэглэгч brand system rule болон шинэ campaign visual direction-ийг батална.",
    integrations: ["Brand asset", "Design template", "Post Generator", "Visual QA"],
  },
  "post-generator-agent": {
    agentName: "Post Generator Agent",
    eyebrow: "Creative production",
    headline: "Branded image, carousel болон video бүтээнэ.",
    subheadline: "Image/video generation API болон template ашиглан бодит social post бүтээнэ.",
    primaryBenefit: "Гар design cycle хүлээлгүй campaign asset үйлдвэрлэнэ.",
    qualifiedLeadImpact: "Долоо хоногт илүү олон campaign output",
    channels: ["Image generation", "Video generation", "Template", "Social platform"],
    processSteps: ["Approved idea хүлээн авах", "Creative generate хийх", "Template хэрэглэх", "Variation export хийх", "QA руу илгээх"],
    benefits: ["Илүү олон asset", "Хурдан production", "Дахин ашиглах variation"],
    humanInLoop: "Хэрэглэгч generated asset-ыг publishing эсвэл paid distribution-оос өмнө батална.",
    integrations: ["Image API", "Video API", "Design template", "Visual QA", "Publishing Agent"],
  },
  "visual-qa-agent": {
    agentName: "Visual QA Agent",
    eyebrow: "Quality control",
    headline: "Юу ч public болохоос өмнө quality-г шалгана.",
    subheadline: "Design alignment, typo risk, brand consistency, CTA clarity болон goal alignment шалгана.",
    primaryBenefit: "Сул эсвэл эрсдэлтэй creative-ийг хэрэглэгчид хүрэхээс өмнө зогсооно.",
    qualifiedLeadImpact: "Илүү өндөр trust ба brand consistency",
    channels: ["Design asset", "Social post", "CTA check", "Brand rule"],
    processSteps: ["Design шалгах", "Copy шалгах", "Brand fit оноох", "Fix route хийх", "Approval/posting руу илгээх"],
    benefits: ["Алдаа багасна", "Brand alignment сайжирна", "CTA цэвэр болно"],
    humanInLoop: "Муу design-ыг generator руу буцааж, сайн design-ыг approval/posting руу илгээнэ.",
    integrations: ["Post Generator", "Brand system", "Publishing Agent", "Approval queue"],
  },
  "social-publishing-agent": {
    agentName: "Social Publishing Agent",
    eyebrow: "Distribution",
    headline: "Бүх сувгаар content нийтэлнэ.",
    subheadline: "Facebook, Instagram, X, LinkedIn болон бусад сувгуудад schedule хийж нийтэлнэ.",
    primaryBenefit: "Approved content-ыг найдвартай multi-channel execution болгоно.",
    qualifiedLeadImpact: "Илүү тогтмол visibility",
    channels: ["Facebook", "Instagram", "X", "LinkedIn", "Бусад суваг"],
    processSteps: ["Approved post хүлээн авах", "Channel-аар schedule хийх", "Нийтлэх", "Status track хийх", "Reporting руу event илгээх"],
    benefits: ["Найдвартай posting", "Channel consistency", "Гар scheduling багасна"],
    humanInLoop: "Хэрэглэгч final content queue-г publishing эхлэхээс өмнө батална.",
    integrations: ["Facebook", "Instagram", "X", "LinkedIn", "Reporting Agent"],
  },
  "performance-reporting-agent": {
    agentName: "Performance Reporting Agent",
    eyebrow: "Analytics",
    headline: "Маркетингийн үйл ажиллагааг Даваа гарагийн шийдвэр болгоно.",
    subheadline:
      "Website traffic, post engagement, email KPI, SMS reply, webinar attendance болон lead conversion цуглуулна.",
    primaryBenefit: "Юу ажилласан, юу унасан, дараа нь юу хийхийг харуулна.",
    qualifiedLeadImpact: "Campaign improvement хурдсана",
    channels: ["Website", "Social", "Email", "SMS", "Webinar", "CRM"],
    processSteps: ["Дата цуглуулах", "KPI товчлох", "Win/problem илрүүлэх", "Action санал болгох", "Report илгээх"],
    benefits: ["Тодорхой ROI", "Хурдан шийдвэр", "Илүү сайн campaign improvement"],
    humanInLoop: "Хэрэглэгч recommendation-уудыг шалгаж, том strategy change-ийг батална.",
    integrations: ["Web analytics", "Social platform", "Email", "CallPro", "Webinar", "Agentic CRM"],
  },
};

export function solutionPath(path: string, locale: Locale = "en", includeLocale = true) {
  return includeLocale ? `/${locale}${path}` : path;
}

export function getLocalizedAgentBySlug(slug: string, locale: Locale = "en") {
  const agent = agents.find((item) => item.slug === slug);
  if (!agent) return undefined;

  if (locale === "en") return agent;
  return {
    ...agent,
    ...mnAgents[slug],
  };
}

export function getLocalizedAgentsBySlugs(slugs: string[], locale: Locale = "en") {
  return slugs.map((slug) => getLocalizedAgentBySlug(slug, locale)).filter(Boolean) as AgentIntroData[];
}

export function getLocalizedCategories(locale: Locale = "en") {
  return agentCategories.map((category) => ({
    ...category,
    ...categoryText[locale][category.name],
  }));
}

export function getLocalizedOverview(locale: Locale = "en") {
  const localized = overviewTranslations[locale];
  return {
    process: localized.process,
    channels: localized.channels,
    funnel: localized.funnel,
    benefits: overviewBenefits.map((benefit, index) => ({
      ...benefit,
      ...localized.benefits[index],
    })),
  };
}

export function getSolutionsNavItems(locale: Locale = "en", includeLocale = false) {
  return [
    {
      label: locale === "mn" ? "Борлуулалт ба маркетингийн агентууд" : "Sales & Marketing Agents",
      href: solutionPath("/solutions/sales-marketing-agents", locale, includeLocale),
    },
    ...agents.map((agent) => {
      const localized = getLocalizedAgentBySlug(agent.slug, locale) ?? agent;
      return {
        label: localized.agentName,
        href: solutionPath(`/solutions/${agent.slug}`, locale, includeLocale),
      };
    }),
  ];
}
