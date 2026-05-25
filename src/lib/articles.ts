import { hasDatabaseUrl, prisma } from "./db";
import { seedArticles, type LocalizedArticle } from "./content";
import { articleIndustries, getArticleIndustry } from "./article-industries";

type ArticleQueryOptions = {
  industrySlug?: string;
  take?: number;
};

export type ArticleIndustryGroup = {
  slug: string;
  labelEn: string;
  labelMn: string;
  articles: LocalizedArticle[];
};

const fallbackAngles = [
  {
    slug: "workflow-automation",
    titleEn: "AI is automating routine workflows",
    titleMn: "AI өдөр тутмын ажлын урсгалыг автоматжуулж байна",
    excerptEn: "Teams are using agents to classify requests, prepare records, and route exceptions to people.",
    excerptMn: "Багууд хүсэлтийг ангилж, бүртгэл бэлдэж, онцгой тохиолдлыг хүнд шилжүүлэхэд AI агент ашиглаж байна.",
  },
  {
    slug: "customer-service",
    titleEn: "AI agents are changing customer service",
    titleMn: "AI агентууд харилцагчийн үйлчилгээг өөрчилж байна",
    excerptEn: "Always-on assistants are answering repeated questions while keeping complex decisions with staff.",
    excerptMn: "24/7 туслахууд давтагддаг асуултад хариулж, төвөгтэй шийдвэрийг ажилтанд үлдээж байна.",
  },
  {
    slug: "data-insight",
    titleEn: "AI is turning operations data into decisions",
    titleMn: "AI үйл ажиллагааны өгөгдлийг шийдвэр болгож байна",
    excerptEn: "New dashboards summarize demand, risk, bottlenecks, and next best actions for managers.",
    excerptMn: "Шинэ самбарууд эрэлт, эрсдэл, саатал, дараагийн зөв алхмыг удирдлагад нэгтгэн харуулж байна.",
  },
  {
    slug: "document-intelligence",
    titleEn: "Document intelligence is reducing admin load",
    titleMn: "Баримт бичгийн AI админ ачааллыг бууруулж байна",
    excerptEn: "AI systems are extracting, summarizing, checking, and routing documents across daily processes.",
    excerptMn: "AI системүүд өдөр тутмын процесст баримтыг уншиж, нэгтгэж, шалгаж, чиглүүлж байна.",
  },
  {
    slug: "personalization",
    titleEn: "AI personalization is changing engagement",
    titleMn: "AI хувийн тохируулга харилцааг өөрчилж байна",
    excerptEn: "Organizations are tailoring messages, offers, reminders, and follow-ups from real behavior data.",
    excerptMn: "Байгууллагууд бодит зан төлөв дээр үндэслэн мессеж, санал, сануулга, follow-up хийж байна.",
  },
  {
    slug: "forecasting",
    titleEn: "AI forecasting is improving planning",
    titleMn: "AI таамаглал төлөвлөлтийг сайжруулж байна",
    excerptEn: "Forecast models are helping teams prepare capacity, inventory, staffing, and service levels.",
    excerptMn: "Таамаглалын загварууд хүчин чадал, нөөц, ажиллах хүч, үйлчилгээний түвшинг төлөвлөхөд тусалж байна.",
  },
  {
    slug: "compliance",
    titleEn: "AI governance is becoming a board topic",
    titleMn: "AI засаглал удирдлагын түвшний сэдэв болж байна",
    excerptEn: "Leaders are adding approval rules, logs, source attribution, and review steps to AI workflows.",
    excerptMn: "Удирдлагууд AI workflow-д зөвшөөрөл, лог, эх сурвалж, хүний хяналтын алхам нэмж байна.",
  },
  {
    slug: "employee-copilots",
    titleEn: "Employee copilots are changing daily work",
    titleMn: "Ажилтны AI туслах өдөр тутмын ажлыг өөрчилж байна",
    excerptEn: "Copilots are drafting replies, preparing summaries, checking data, and speeding routine tasks.",
    excerptMn: "AI туслахууд хариу бичиж, товч нэгтгэл бэлдэж, өгөгдөл шалгаж, давтагддаг ажлыг хурдасгаж байна.",
  },
  {
    slug: "agentic-integrations",
    titleEn: "Agentic integrations are connecting legacy tools",
    titleMn: "Agentic интеграц хуучин системүүдийг холбож байна",
    excerptEn: "Agents are bridging email, CRM, ERP, spreadsheets, and portals without replacing every system.",
    excerptMn: "Агентууд бүх системийг солихгүйгээр имэйл, CRM, ERP, spreadsheet, портал холбож байна.",
  },
  {
    slug: "market-shift",
    titleEn: "AI competition is reshaping market expectations",
    titleMn: "AI өрсөлдөөн зах зээлийн хүлээлтийг өөрчилж байна",
    excerptEn: "Customers now expect faster answers, smarter self-service, and more proactive communication.",
    excerptMn: "Харилцагчид илүү хурдан хариу, ухаалаг self-service, идэвхтэй харилцааг хүлээдэг болж байна.",
  },
];

const fallbackImages = [
  "/images/analytics.png",
  "/images/automation.png",
  "/images/dashboard.png",
  "/images/hero.webp",
  "/images/hero1.webp",
  "/images/hero2.png",
];

const industrySeedArticles: LocalizedArticle[] = articleIndustries.flatMap((industry, industryIndex) =>
  fallbackAngles.map((angle, angleIndex) => ({
    slug: `${industry.slug}-${angle.slug}`,
    status: "published",
    category: industry.en.label,
    industrySlug: industry.slug,
    coverImage: fallbackImages[(industryIndex + angleIndex) % fallbackImages.length],
    readTime: 4 + (angleIndex % 3),
    sourceName: "Hermes sample feed",
    publishedAt: new Date(Date.UTC(2026, 4, 25 - angleIndex, 0, 0, 0)).toISOString(),
    titleEn: `${industry.en.label}: ${angle.titleEn}`,
    titleMn: `${industry.mn.label}: ${angle.titleMn}`,
    excerptEn: angle.excerptEn,
    excerptMn: angle.excerptMn,
    bodyEn: `${angle.excerptEn}\n\nHermes can place provider-sourced summaries into this industry category each day. The page then shows the newest ten items and the ten most-read items for readers who follow this sector.\n\nFor production use, every imported item should include a canonical source URL, provider name, bilingual title, bilingual summary, and a clear industrySlug so it can appear in the right feed.\n\nAgenticForce uses this structure to connect market monitoring with practical AI adoption signals for ${industry.en.label.toLowerCase()}.`,
    bodyMn: `${angle.excerptMn}\n\nHermes өдөр бүр эх сурвалжтай мэдээний тоймыг энэ салбарын ангилалд оруулж чадна. Ингэснээр хуудас хамгийн сүүлийн 10 болон хамгийн их уншсан 10 мэдээг харуулна.\n\nProduction орчинд мэдээ бүр canonical source URL, provider name, хоёр хэлний гарчиг, хоёр хэлний товч тайлбар, зөв industrySlug-тэй байх ёстой.\n\nAgenticForce энэ бүтцийг ашиглан зах зээлийн мэдээллийг ${industry.mn.label} салбарын бодит AI нэвтрүүлэлтийн дохиотой холбодог.`,
  }))
);

const fallbackArticles = [...seedArticles, ...industrySeedArticles];

function articleTime(article: LocalizedArticle) {
  const value = article.publishedAt;
  if (!value) return 0;
  return value instanceof Date ? value.getTime() : new Date(value).getTime();
}

function fallbackFor(options: ArticleQueryOptions = {}) {
  const filtered = options.industrySlug
    ? fallbackArticles.filter((article) => article.industrySlug === options.industrySlug)
    : fallbackArticles;

  return filtered
    .slice()
    .sort((a, b) => articleTime(b) - articleTime(a))
    .slice(0, options.take ?? 24);
}

export async function getPublishedArticles(options: ArticleQueryOptions = {}): Promise<LocalizedArticle[]> {
  if (!hasDatabaseUrl()) {
    return fallbackFor(options);
  }

  try {
    const articles = await prisma.article.findMany({
      where: {
        status: "published",
        ...(options.industrySlug ? { industrySlug: options.industrySlug } : {}),
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: options.take ?? 24,
    });

    return articles.length > 0 ? articles : fallbackFor(options);
  } catch {
    return fallbackFor(options);
  }
}

export async function getTopReadArticles(options: ArticleQueryOptions = {}): Promise<LocalizedArticle[]> {
  if (!hasDatabaseUrl()) {
    return fallbackFor({ ...options, take: options.take ?? 10 });
  }

  try {
    const articles = await prisma.article.findMany({
      where: {
        status: "published",
        ...(options.industrySlug ? { industrySlug: options.industrySlug } : {}),
      },
      orderBy: [{ views: { _count: "desc" } }, { publishedAt: "desc" }, { createdAt: "desc" }],
      take: options.take ?? 10,
    });

    return articles.length > 0 ? articles : fallbackFor({ ...options, take: options.take ?? 10 });
  } catch {
    return fallbackFor({ ...options, take: options.take ?? 10 });
  }
}

function articleRankScore(article: LocalizedArticle) {
  return [
    article.importanceScore ?? 0,
    article.dailyRank ? 100 - article.dailyRank : 0,
    articleTime(article),
  ];
}

function compareRankedArticles(a: LocalizedArticle, b: LocalizedArticle) {
  const aScore = articleRankScore(a);
  const bScore = articleRankScore(b);

  for (let index = 0; index < aScore.length; index += 1) {
    if (aScore[index] !== bScore[index]) return bScore[index] - aScore[index];
  }

  return 0;
}

export async function getArticleGroupsByIndustry(takePerIndustry = 3): Promise<ArticleIndustryGroup[]> {
  const articles = await getPublishedArticles({ take: 300 });

  return articleIndustries
    .map((industry) => ({
      slug: industry.slug,
      labelEn: industry.en.label,
      labelMn: industry.mn.label,
      articles: articles
        .filter((article) => article.industrySlug === industry.slug)
        .sort(compareRankedArticles)
        .slice(0, takePerIndustry),
    }))
    .filter((group) => group.articles.length > 0);
}

export async function getArticleBySlug(slug: string): Promise<LocalizedArticle | null> {
  if (!hasDatabaseUrl()) {
    return fallbackArticles.find((article) => article.slug === slug) ?? null;
  }

  try {
    const article = await prisma.article.findUnique({ where: { slug } });
    return article ?? fallbackArticles.find((item) => item.slug === slug) ?? null;
  } catch {
    return fallbackArticles.find((article) => article.slug === slug) ?? null;
  }
}

export function articleCategoryLabel(article: LocalizedArticle, locale: "en" | "mn") {
  return getArticleIndustry(article.industrySlug)?.[locale].label ?? article.category;
}
