import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import PostlyAdminShell from "../PostlyAdminShell";
import TemplatesManager from "./TemplatesManager";

export const dynamic = "force-dynamic";

function adminLang(value: unknown): "en" | "mn" {
  return value === "mn" ? "mn" : "en";
}

export default async function AdminPostlyTemplatesPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const allowed = await isAdminUser();
  if (!allowed) redirect("/en");

  const { lang } = await searchParams;
  const currentLang = adminLang(lang);
  const templates = hasDatabaseUrl()
    ? await prisma.brandTemplate.findMany({
        orderBy: [{ createdAt: "desc" }],
        take: 300,
        include: {
          company: {
            select: {
              id: true,
              companyName: true,
              businessType: true,
            },
          },
          _count: {
            select: {
              contentItems: true,
            },
          },
        },
      })
    : [];

  return (
    <PostlyAdminShell active="templates" lang={currentLang} currentPath="/admin/postly/templates">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!hasDatabaseUrl() ? (
          <div className="mb-8 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
            DATABASE_URL is not configured.
          </div>
        ) : null}
        <TemplatesManager initialTemplates={JSON.parse(JSON.stringify(templates))} lang={currentLang} />
      </main>
    </PostlyAdminShell>
  );
}
