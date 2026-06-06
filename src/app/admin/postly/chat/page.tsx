import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import PostlyAdminShell from "../PostlyAdminShell";
import BrandMessenger from "./BrandMessenger";

export const dynamic = "force-dynamic";

function adminLang(value: unknown): "en" | "mn" {
  return value === "mn" ? "mn" : "en";
}

export default async function AdminPostlyChatPage({
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
        orderBy: [{ updatedAt: "desc" }, { companyName: "asc" }],
        include: {
          brandGuideline: true,
          productsServicesPostly: { orderBy: { createdAt: "desc" }, take: 5 },
          brandTemplates: { orderBy: { createdAt: "desc" }, take: 6 },
          contentItems: {
            orderBy: [{ updatedAt: "desc" }],
            take: 8,
            include: { template: true, assets: true },
          },
          hermesChatMessages: {
            orderBy: { createdAt: "asc" },
            take: 40,
          },
          _count: {
            select: {
              brandTemplates: true,
              contentItems: true,
              contentPlans: true,
              productsServicesPostly: true,
            },
          },
        },
      })
    : [];

  return (
    <PostlyAdminShell active="chat" lang={currentLang} currentPath="/admin/postly/chat">
      <BrandMessenger
        initialBrands={JSON.parse(JSON.stringify(brands))}
        initialBrandId={brandId}
        lang={currentLang}
        databaseReady={hasDatabaseUrl()}
      />
    </PostlyAdminShell>
  );
}
