import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import PostlyAdminShell from "../PostlyAdminShell";
import ContentStudio from "./ContentStudio";

export const dynamic = "force-dynamic";

function adminLang(value: unknown): "en" | "mn" {
  return value === "mn" ? "mn" : "en";
}

export default async function AdminPostlyContentStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; brandId?: string }>;
}) {
  const allowed = await isAdminUser();
  if (!allowed) redirect("/en");

  const { lang, brandId } = await searchParams;
  const currentLang = adminLang(lang);
  const brands = hasDatabaseUrl()
    ? await prisma.companyProfile.findMany({
        orderBy: [{ companyName: "asc" }, { createdAt: "desc" }],
        take: 100,
        select: {
          id: true,
          companyName: true,
          businessType: true,
          activityDirection: true,
          brandGuideline: { select: { toneOfVoice: true, brandColors: true, language: true } },
          brandTemplates: {
            where: { status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
            select: { id: true, name: true, type: true, platform: true, previewImageUrl: true },
          },
          productsServicesPostly: {
            where: { status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: { id: true, name: true, description: true },
          },
        },
      })
    : [];

  return (
    <PostlyAdminShell active="studio" lang={currentLang} currentPath="/admin/postly/content-studio">
      <ContentStudio
        brands={JSON.parse(JSON.stringify(brands))}
        initialBrandId={brandId}
        lang={currentLang}
        databaseReady={hasDatabaseUrl()}
      />
    </PostlyAdminShell>
  );
}
