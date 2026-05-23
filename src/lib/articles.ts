import { hasDatabaseUrl, prisma } from "./db";
import { seedArticles, type LocalizedArticle } from "./content";

export async function getPublishedArticles(): Promise<LocalizedArticle[]> {
  if (!hasDatabaseUrl()) {
    return seedArticles;
  }

  try {
    const articles = await prisma.article.findMany({
      where: { status: "published" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 24,
    });

    return articles.length > 0 ? articles : seedArticles;
  } catch {
    return seedArticles;
  }
}

export async function getArticleBySlug(slug: string): Promise<LocalizedArticle | null> {
  if (!hasDatabaseUrl()) {
    return seedArticles.find((article) => article.slug === slug) ?? null;
  }

  try {
    const article = await prisma.article.findUnique({ where: { slug } });
    return article ?? seedArticles.find((item) => item.slug === slug) ?? null;
  } catch {
    return seedArticles.find((article) => article.slug === slug) ?? null;
  }
}
