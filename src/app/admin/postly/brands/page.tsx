import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import PostlyAdminShell from "../PostlyAdminShell";
import BrandsManager from "./BrandsManager";

export const dynamic = "force-dynamic";

function adminLang(value: unknown): "en" | "mn" {
  return value === "mn" ? "mn" : "en";
}

export default async function AdminPostlyBrandsPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const allowed = await isAdminUser();
  if (!allowed) redirect("/en");

  const { lang } = await searchParams;
  const currentLang = adminLang(lang);
  const brands = hasDatabaseUrl()
    ? (await prisma.companyProfile.findMany({
        orderBy: [{ createdAt: "desc" }, { companyName: "asc" }],
        include: {
          brandGuideline: true,
          _count: {
            select: {
              brandTemplates: true,
              contentItems: true,
              contentPlans: true,
              productsServicesPostly: true,
            },
          },
        },
      })).map((brand) => ({
        id: brand.id,
        companyName: brand.companyName,
        businessType: brand.businessType,
        activityDirection: brand.activityDirection,
        description: brand.description,
        phone: brand.phone,
        email: brand.email,
        website: brand.website,
        address: brand.address,
        facebookUrl: brand.facebookUrl,
        instagramUrl: brand.instagramUrl,
        tiktokUrl: brand.tiktokUrl,
        logoUrl: brand.logoUrl,
        brandGuideline: brand.brandGuideline
          ? {
              toneOfVoice: brand.brandGuideline.toneOfVoice,
              brandColors: brand.brandGuideline.brandColors,
              visualStyle: brand.brandGuideline.visualStyle,
              language: brand.brandGuideline.language,
            }
          : null,
        _count: brand._count,
      }))
    : [];

  return (
    <PostlyAdminShell active="brands" lang={currentLang} currentPath="/admin/postly/brands">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!hasDatabaseUrl() ? (
          <div className="mt-8 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
            DATABASE_URL is not configured.
          </div>
        ) : null}

        <BrandsManager initialBrands={brands} lang={currentLang} />
      </main>
    </PostlyAdminShell>
  );
}
