import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import BrandWorkspace from "./BrandWorkspace";

export const dynamic = "force-dynamic";

function adminLang(value: unknown): "en" | "mn" {
  return value === "mn" ? "mn" : "en";
}

export default async function AdminPostlyBrandPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const allowed = await isAdminUser();
  if (!allowed) redirect("/en");
  if (!hasDatabaseUrl()) {
    return (
      <div className="min-h-screen bg-black pt-24 text-white">
        <main className="container mx-auto px-4 py-10">
          <Link href="/admin/postly/brands" className="text-sm text-amber-300 hover:text-amber-200">
            Back to brands
          </Link>
          <div className="mt-8 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
            DATABASE_URL is not configured.
          </div>
        </main>
      </div>
    );
  }

  const { id } = await params;
  const { lang } = await searchParams;
  const currentLang = adminLang(lang);
  const brand = await prisma.companyProfile.findUnique({
    where: { id },
    include: {
      brandGuideline: true,
      productsServicesPostly: { orderBy: { createdAt: "desc" } },
      brandTemplates: { orderBy: { createdAt: "desc" } },
      contentPlans: {
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { _count: { select: { contentItems: true } } },
      },
      contentItems: {
        orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
        take: 12,
        include: { template: true, assets: true },
      },
      agentLogs: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      hermesChatMessages: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      socialAccounts: true,
      makeIntegration: true,
    },
  });

  if (!brand) notFound();

  return <BrandWorkspace brand={brand} lang={currentLang} />;
}
