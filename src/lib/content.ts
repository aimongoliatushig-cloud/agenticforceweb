import { Bot, BrainCircuit, BriefcaseBusiness, GraduationCap, Network, Workflow } from "lucide-react";
import type { Locale } from "./i18n";

export type LocalizedArticle = {
  id?: string;
  slug: string;
  status?: "draft" | "published" | "archived";
  category: string;
  coverImage?: string | null;
  readTime: number;
  sourceName?: string | null;
  canonicalSourceUrl?: string | null;
  industrySlug?: string | null;
  dailyRank?: number | null;
  imageAltEn?: string | null;
  imageAltMn?: string | null;
  tags?: string[];
  importanceScore?: number | null;
  publishedAt?: Date | string | null;
  titleEn: string;
  titleMn: string;
  excerptEn: string;
  excerptMn: string;
  bodyEn: string;
  bodyMn: string;
};

export const services = [
  {
    icon: Bot,
    titleEn: "Agentic AI consulting",
    titleMn: "Agentic AI зөвлөх үйлчилгээ",
    descriptionEn:
      "Identify practical agent opportunities, design governance, and build a rollout path that your operators can trust.",
    descriptionMn:
      "Бодит агентын боломжийг тодорхойлж, governance болон хэрэгжилтийн замыг танай багт ойлгомжтойгоор гаргана.",
  },
  {
    icon: BriefcaseBusiness,
    titleEn: "Agentic ERP",
    titleMn: "Agentic ERP",
    descriptionEn:
      "Upgrade ERP workflows with agents that prepare records, route approvals, surface risks, and support managers.",
    descriptionMn:
      "ERP урсгалыг бичилт бэлтгэх, зөвшөөрөл чиглүүлэх, эрсдэл илрүүлэх, менежер дэмжих агентуудаар сайжруулна.",
  },
  {
    icon: Workflow,
    titleEn: "Workflow automation",
    titleMn: "Ажлын урсгал автоматжуулалт",
    descriptionEn:
      "Connect forms, documents, approvals, alerts, and human-in-the-loop reviews into measurable AI-assisted processes.",
    descriptionMn:
      "Форм, баримт, зөвшөөрөл, сануулга, хүний хяналтыг хэмжигдэхүйц AI-дэмжсэн процесс болгон холбоно.",
  },
  {
    icon: Network,
    titleEn: "Enterprise integration",
    titleMn: "Байгууллагын интеграци",
    descriptionEn:
      "Integrate agents with CRMs, ERPs, websites, email, analytics, and internal data sources with clear access control.",
    descriptionMn:
      "Агентуудыг CRM, ERP, веб, имэйл, analytics, дотоод өгөгдөлтэй эрхийн хяналттайгаар нэгтгэнэ.",
  },
];

export const academyTracks = [
  {
    titleEn: "Agentic AI Professional",
    titleMn: "Agentic AI Professional",
    descriptionEn:
      "For analysts and managers who need to design workflows, evaluate agent outputs, and manage adoption.",
    descriptionMn:
      "Ажлын урсгал загварчлах, агентын үр дүн үнэлэх, нэвтрүүлэлт удирдах аналитик, менежерүүдэд.",
  },
  {
    titleEn: "AI Agent Builder",
    titleMn: "AI Agent Builder",
    descriptionEn:
      "For developers who build tools, memory, integrations, evaluation loops, and production-ready agent systems.",
    descriptionMn:
      "Tool, memory, integration, evaluation loop, production agent систем бүтээх хөгжүүлэгчдэд.",
  },
  {
    titleEn: "Agentic ERP Operator",
    titleMn: "Agentic ERP Operator",
    descriptionEn:
      "For ERP teams that want agents to support finance, HR, procurement, service, and document operations.",
    descriptionMn:
      "Санхүү, хүний нөөц, худалдан авалт, үйлчилгээ, баримтын ERP ажиллагааг агентуудаар дэмжих багуудад.",
  },
];

export const seedArticles: LocalizedArticle[] = [
  {
    slug: "agentic-erp-next-operating-model",
    status: "published",
    category: "Agentic ERP",
    industrySlug: "manufacturing",
    coverImage: "/images/analytics.png",
    readTime: 6,
    sourceName: "AgenticForce",
    publishedAt: "2026-05-23T00:00:00.000Z",
    titleEn: "Agentic ERP is the next operating model",
    titleMn: "Agentic ERP бол дараагийн ажиллагааны загвар",
    excerptEn:
      "ERP systems become more valuable when AI agents prepare decisions, monitor exceptions, and keep people in control.",
    excerptMn:
      "AI агентууд шийдвэр бэлтгэж, онцгой тохиолдлыг хянаж, хүний удирдлагыг хадгалах үед ERP илүү үнэ цэнтэй болно.",
    bodyEn:
      "Agentic ERP is not a chatbot placed beside a legacy system. It is an operating layer where agents prepare routine work, detect missing information, draft next actions, and route exceptions to accountable people.\n\nThe practical starting point is not full autonomy. It is narrow, measurable assistance: invoice checks, HR document preparation, procurement comparisons, service ticket triage, and management reporting.\n\nA reliable rollout needs clear data boundaries, approval rules, logs, and human review. When those controls exist, AI agents can reduce repetitive work while keeping the organization auditable.\n\nAgenticForce designs these workflows around the real processes that already exist in your organization, then adds agent support where it produces measurable operational leverage.",
    bodyMn:
      "Agentic ERP гэдэг нь хуучин системийн хажууд тавьсан chatbot биш. Энэ нь агентууд давтамжтай ажлыг бэлтгэж, дутуу мэдээлэл илрүүлж, дараагийн үйлдлийг боловсруулж, онцгой тохиолдлыг хариуцсан хүмүүст чиглүүлдэг ажиллагааны давхарга юм.\n\nЭхлэх цэг нь бүрэн автономи биш. Харин нэхэмжлэл шалгах, HR баримт бэлтгэх, худалдан авалтын харьцуулалт, үйлчилгээний хүсэлт ангилах, удирдлагын тайлан зэрэг нарийн, хэмжигдэхүйц туслалцаа юм.\n\nНайдвартай нэвтрүүлэлтэд өгөгдлийн хил, зөвшөөрлийн дүрэм, лог, хүний хяналт хэрэгтэй. Эдгээр хяналт байвал AI агентууд байгууллагын audit боломжийг хадгалан давтамжтай ажлыг бууруулна.\n\nAgenticForce нь танай байгууллагад аль хэдийн байгаа бодит процессыг суурь болгон agentic дэмжлэгийг хэмжигдэхүйц үр дүн гарах газарт нэмнэ.",
  },
  {
    slug: "training-agentic-ai-professionals",
    status: "published",
    category: "Academy",
    industrySlug: "education",
    coverImage: "/images/team.png",
    readTime: 5,
    sourceName: "AgenticForce Academy",
    publishedAt: "2026-05-23T00:00:00.000Z",
    titleEn: "What agentic AI professionals need to learn",
    titleMn: "Agentic AI мэргэжилтнүүд юу сурах хэрэгтэй вэ",
    excerptEn:
      "The new skill set combines process thinking, prompt design, evaluation, data boundaries, and change management.",
    excerptMn:
      "Шинэ ур чадвар нь процессын сэтгэлгээ, prompt design, evaluation, өгөгдлийн хил, өөрчлөлтийн удирдлагыг нэгтгэнэ.",
    bodyEn:
      "Agentic AI professionals do not only write prompts. They understand workflows, design tool access, test outputs, and decide where people must remain responsible.\n\nA strong training program should include agent patterns, data security, evaluation methods, ERP and CRM process mapping, and stakeholder communication.\n\nThe most valuable professionals are translators between business reality and technical implementation. They can explain what an agent should do, what it must never do, and how success will be measured.\n\nAgenticForce Academy is built around those practical capabilities, so teams can move from curiosity to confident delivery.",
    bodyMn:
      "Agentic AI мэргэжилтэн зөвхөн prompt бичдэг хүн биш. Тэд ажлын урсгалыг ойлгож, tool access загварчилж, үр дүнг шалгаж, аль хэсэгт хүн хариуцлагатай үлдэхийг шийддэг.\n\nСайн сургалт нь agent pattern, data security, evaluation арга, ERP/CRM процесс зураглал, stakeholder харилцааг хамрах ёстой.\n\nХамгийн үнэ цэнтэй мэргэжилтнүүд бизнесийн бодит байдал ба техникийн хэрэгжилтийн хооронд орчуулагч болдог. Тэд агент юу хийх, юу хэзээ ч хийхгүй байх, амжилтыг яаж хэмжихийг тодорхой хэлж чадна.\n\nAgenticForce Академи эдгээр практик чадвар дээр төвлөрч багуудыг сониуч байдлаас итгэлтэй хэрэгжилт рүү шилжүүлнэ.",
  },
  {
    slug: "hermes-reviewed-ai-news-workflow",
    status: "published",
    category: "Hermes",
    industrySlug: "government-public-sector",
    coverImage: "/images/automation.png",
    readTime: 4,
    sourceName: "Hermes Agent",
    publishedAt: "2026-05-23T00:00:00.000Z",
    titleEn: "How Hermes turns AI news into reviewed briefings",
    titleMn: "Hermes AI мэдээг шалгагдсан тойм болгох нь",
    excerptEn:
      "A cron-driven agent can collect AI news, summarize it, translate it, and queue it for human publishing review.",
    excerptMn:
      "Cron дээр ажиллах агент AI мэдээ цуглуулж, тоймлон орчуулж, хүний review-д draft болгон оруулна.",
    bodyEn:
      "Hermes is designed as a news operations agent, not an uncontrolled publisher. It collects source URLs, detects duplicates, drafts bilingual summaries, and records attribution.\n\nThe important control is review. AI news changes quickly, and scraped material can create quality and copyright risks if it is published without judgment.\n\nIn AgenticForce, Hermes drafts are reviewed before publication. The newsletter uses only published articles, and every email click is tracked so the CRM can show which topics generate real interest.\n\nThat loop turns market monitoring into a measurable audience and lead signal.",
    bodyMn:
      "Hermes нь хяналтгүй нийтлэгч биш, харин news operations агент байхаар загварчлагдсан. Эх сурвалжийн URL цуглуулж, давхардал илрүүлж, хоёр хэлний тойм draft үүсгэж, attribution хадгална.\n\nГол хяналт нь review юм. AI мэдээ хурдан өөрчлөгддөг бөгөөд scraped материал шууд нийтлэгдсэн тохиолдолд чанар, copyright эрсдэл үүсгэнэ.\n\nAgenticForce дээр Hermes draft-ууд нийтлэгдэхээс өмнө шалгагдана. Newsletter зөвхөн published нийтлэл ашиглаж, email click бүрийг хэмжсэнээр CRM ямар сэдэв бодит сонирхол үүсгэж байгааг харуулна.\n\nИнгэснээр market monitoring нь хэмжигдэхүйц audience болон lead signal болно.",
  },
];

export function articleTitle(article: LocalizedArticle, locale: Locale) {
  return locale === "mn" ? article.titleMn : article.titleEn;
}

export function articleExcerpt(article: LocalizedArticle, locale: Locale) {
  return locale === "mn" ? article.excerptMn : article.excerptEn;
}

export function articleBody(article: LocalizedArticle, locale: Locale) {
  return locale === "mn" ? article.bodyMn : article.bodyEn;
}

export function localized<T extends { titleEn: string; titleMn: string }>(
  item: T,
  locale: Locale
) {
  return locale === "mn" ? item.titleMn : item.titleEn;
}

export const serviceIconFallback = BrainCircuit;
