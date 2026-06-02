import Link from "next/link";
import { redirect } from "next/navigation";
import { Grid2X2, ListFilter, MessageCircle, MoreHorizontal, Plus, Search, Store } from "lucide-react";
import type { ReactNode } from "react";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import PostlyAdminShell from "../PostlyAdminShell";

export const dynamic = "force-dynamic";

export default async function AdminPostlyBrandsPage() {
  const allowed = await isAdminUser();
  if (!allowed) redirect("/en");

  const brands = hasDatabaseUrl()
    ? await prisma.companyProfile.findMany({
        orderBy: [{ companyName: "asc" }, { createdAt: "desc" }],
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
      })
    : [];

  return (
    <PostlyAdminShell active="brands">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">Brands</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
              Manage every brand, attach templates, and connect Hermes to brand-specific content work.
            </p>
          </div>
          <Link
            href="/admin/postly/brands"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-amber-300 px-4 text-sm font-bold text-black transition hover:bg-amber-200"
          >
            <Plus className="h-4 w-4" />
            Add Brand
          </Link>
        </div>

        {!hasDatabaseUrl() ? (
          <div className="mt-8 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
            DATABASE_URL is not configured.
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="relative block w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input
              placeholder="Search brand..."
              className="h-11 w-full rounded-md border border-white/10 bg-white/[0.04] pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-amber-300/60"
            />
          </label>
          <div className="flex items-center gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-md border border-amber-300/40 bg-amber-300/10 text-amber-200">
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-white/55">
              <ListFilter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {brands.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-sm text-white/55">
              No Postly brands found.
            </div>
          ) : (
            brands.map((brand) => (
              <article
                key={brand.id}
                className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20 transition hover:border-amber-300/40 hover:bg-white/[0.06]"
              >
                <Link href={`/admin/postly/brands/${brand.id}`} className="block p-5">
                  <div>
                    <div className="grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-black text-xl font-black text-amber-200">
                      {(brand.companyName || "P").slice(0, 1)}
                    </div>
                    <h2 className="mt-4 text-lg font-bold">{brand.companyName || "Unnamed brand"}</h2>
                    <p className="mt-1 text-sm text-white/50">{brand.businessType || "Brand"}</p>
                    <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-white/45">
                      {brand.activityDirection || brand.description || "Hermes-ready Postly brand."}
                    </p>
                  </div>
                  <div className="mt-4 space-y-2 text-xs text-white/55">
                    <p>Target: {brand.description?.slice(0, 58) || "brand audience not set"}</p>
                    <p>
                      Hermes: <span className="font-semibold text-emerald-300">Active</span>
                    </p>
                    <p>Templates: {brand._count.brandTemplates}</p>
                  </div>
                </Link>
                <div className="grid grid-cols-3 border-t border-white/10">
                  <IconLink href={`/admin/postly/brands/${brand.id}`} label="Chat" icon={<MessageCircle className="h-4 w-4" />} />
                  <IconLink href={`/admin/postly/brands/${brand.id}`} label="Templates" icon={<Store className="h-4 w-4" />} />
                  <IconLink href={`/admin/postly/brands/${brand.id}`} label="More" icon={<MoreHorizontal className="h-4 w-4" />} />
                </div>
              </article>
            ))
          )}
          <Link
            href="/admin/postly/brands"
            className="grid min-h-[286px] place-items-center rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-6 text-center transition hover:border-amber-300/45 hover:bg-amber-300/5"
          >
            <div>
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-amber-300 text-black">
                <Plus className="h-5 w-5" />
              </span>
              <p className="mt-4 font-semibold">Add New Brand</p>
              <p className="mt-2 text-sm text-white/45">Brand creation form can be connected here next.</p>
            </div>
          </Link>
        </div>
      </main>
    </PostlyAdminShell>
  );
}

function IconLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <Link href={href} className="flex h-11 items-center justify-center gap-2 border-r border-white/10 text-xs text-white/55 last:border-r-0 hover:bg-white/5 hover:text-amber-200">
      <span className="sr-only">{label}</span>
      <span className="text-amber-200">
        {icon}
      </span>
    </Link>
  );
}
