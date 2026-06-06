import Link from "next/link";
import { redirect } from "next/navigation";
import { Bot, Clock3, MessageSquareText, Package, Sparkles } from "lucide-react";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import PostlyAdminShell from "../PostlyAdminShell";

export const dynamic = "force-dynamic";

function adminLang(value: unknown): "en" | "mn" {
  return value === "mn" ? "mn" : "en";
}

function firstLetter(value?: string | null) {
  return (value || "B").slice(0, 1).toUpperCase();
}

function formatTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function statusTone(status?: string | null) {
  const value = (status || "").toLowerCase();
  if (value.includes("failed") || value.includes("rejected")) return "border-red-400/25 bg-red-400/10 text-red-200";
  if (value.includes("queued") || value.includes("draft") || value.includes("approval")) return "border-amber-300/25 bg-amber-300/10 text-amber-100";
  if (value.includes("generated") || value.includes("approved") || value.includes("posted")) return "border-emerald-300/25 bg-emerald-300/10 text-emerald-100";
  return "border-white/10 bg-white/[0.06] text-white/55";
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
  const c = currentLang === "mn"
    ? {
        title: "Брэнд AI чат",
        subtitle: "Брэнд бүрийн Hermes яриа, context, output-ийг messenger шиг нэг дор харна.",
        noBrand: "Брэнд одоогоор алга.",
        noMessages: "Энэ брэнд дээр чат одоогоор алга. Брэнд workspace рүү орж эхний prompt өг.",
        open: "Чатлаж prompt өгөх",
        context: "Брэнд context",
        recent: "Сүүлийн output",
        brandList: "Брэндүүд",
      }
    : {
        title: "Brand AI Chat",
        subtitle: "A messenger-style view of each brand's Hermes conversation, context, and outputs.",
        noBrand: "No brands yet.",
        noMessages: "No conversation yet. Open the brand workspace and send the first prompt.",
        open: "Open chat composer",
        context: "Brand context",
        recent: "Recent outputs",
        brandList: "Brands",
      };

  const brands = hasDatabaseUrl()
    ? await prisma.companyProfile.findMany({
        orderBy: [{ updatedAt: "desc" }, { companyName: "asc" }],
        include: {
          brandGuideline: true,
          brandTemplates: { orderBy: { createdAt: "desc" }, take: 5 },
          productsServicesPostly: { orderBy: { createdAt: "desc" }, take: 5 },
          contentItems: {
            orderBy: [{ updatedAt: "desc" }],
            take: 6,
            include: { template: true, assets: true },
          },
          hermesChatMessages: {
            orderBy: { createdAt: "asc" },
            take: 50,
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

  const selectedBrand = brands.find((brand) => brand.id === brandId) || brands[0];

  return (
    <PostlyAdminShell active="chat" lang={currentLang} currentPath="/admin/postly/chat">
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-violet-100">
            <MessageSquareText className="h-3.5 w-3.5" /> Hermes Messenger
          </div>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">{c.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/52">{c.subtitle}</p>
        </div>

        <div className="grid min-h-[720px] gap-4 xl:grid-cols-[320px_minmax(0,1fr)_340px]">
          <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-3">
            <h2 className="px-2 pb-3 text-sm font-black text-white/70">{c.brandList}</h2>
            <div className="space-y-2">
              {brands.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/15 p-5 text-center text-sm text-white/42">{c.noBrand}</p>
              ) : (
                brands.map((brand) => {
                  const selected = selectedBrand?.id === brand.id;
                  const lastMessage = brand.hermesChatMessages.at(-1);
                  return (
                    <Link
                      key={brand.id}
                      href={`/admin/postly/chat?lang=${currentLang}&brandId=${brand.id}`}
                      className={`block rounded-2xl border p-3 transition ${
                        selected ? "border-violet-300/45 bg-violet-500/15" : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-black font-black text-amber-200">
                          {brand.logoUrl ? <img src={brand.logoUrl} alt="" className="h-full w-full object-cover" /> : firstLetter(brand.companyName)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-black">{brand.companyName || "Unnamed brand"}</p>
                          <p className="truncate text-xs text-white/42">{brand.businessType || "Brand workspace"}</p>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,.8)]" />
                      </div>
                      <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/40">
                        {lastMessage?.message || brand.description || c.noMessages}
                      </p>
                    </Link>
                  );
                })
              )}
            </div>
          </aside>

          <section className="flex min-h-[720px] flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04]">
            {selectedBrand ? (
              <>
                <div className="border-b border-white/10 bg-black/25 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-black text-lg font-black text-amber-200">
                        {selectedBrand.logoUrl ? <img src={selectedBrand.logoUrl} alt="" className="h-full w-full object-cover" /> : firstLetter(selectedBrand.companyName)}
                      </div>
                      <div>
                        <h2 className="font-black">{selectedBrand.companyName || "Unnamed brand"}</h2>
                        <p className="text-xs text-white/42">{selectedBrand.businessType || selectedBrand.description || "Hermes chat"}</p>
                      </div>
                    </div>
                    <Link
                      href={`/admin/postly/brands/${selectedBrand.id}?lang=${currentLang}`}
                      className="inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-xs font-black text-black transition hover:bg-violet-100"
                    >
                      {c.open}
                    </Link>
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                  {selectedBrand.hermesChatMessages.length === 0 ? (
                    <div className="grid h-full min-h-[420px] place-items-center text-center">
                      <div className="max-w-sm">
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-400/15 text-violet-100">
                          <Bot className="h-7 w-7" />
                        </div>
                        <p className="mt-4 text-sm leading-6 text-white/45">{c.noMessages}</p>
                      </div>
                    </div>
                  ) : (
                    selectedBrand.hermesChatMessages.map((message) => {
                      const isAdmin = message.sender === "admin";
                      return (
                        <div key={message.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[78%] rounded-[1.25rem] border p-4 ${isAdmin ? "border-violet-300/25 bg-violet-500/20" : "border-white/10 bg-black/30"}`}>
                            <div className="mb-2 flex items-center gap-2 text-xs text-white/35">
                              <span>{isAdmin ? "Admin" : "Hermes"}</span>
                              <span>·</span>
                              <span>{formatTime(message.createdAt)}</span>
                            </div>
                            <p className="whitespace-pre-wrap text-sm leading-6 text-white/78">{message.message}</p>
                            {message.status ? (
                              <span className={`mt-3 inline-flex rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${statusTone(message.status)}`}>
                                {message.status.replace(/_/g, " ")}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              <div className="grid flex-1 place-items-center text-white/45">{c.noBrand}</div>
            )}
          </section>

          <aside className="space-y-4">
            {selectedBrand ? (
              <>
                <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                  <h3 className="flex items-center gap-2 font-black"><Sparkles className="h-4 w-4 text-violet-200" /> {c.context}</h3>
                  <div className="mt-4 grid gap-3 text-sm text-white/58">
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 p-3"><span className="flex items-center gap-2"><Package className="h-4 w-4 text-violet-200" />Products</span><b className="text-white">{selectedBrand._count.productsServicesPostly}</b></div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 p-3"><span>Templates</span><b className="text-white">{selectedBrand._count.brandTemplates}</b></div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 p-3"><span>Content</span><b className="text-white">{selectedBrand._count.contentItems}</b></div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 p-3"><span>Plans</span><b className="text-white">{selectedBrand._count.contentPlans}</b></div>
                  </div>
                </section>

                <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                  <h3 className="flex items-center gap-2 font-black"><Clock3 className="h-4 w-4 text-violet-200" /> {c.recent}</h3>
                  <div className="mt-3 space-y-2">
                    {selectedBrand.contentItems.length === 0 ? (
                      <p className="rounded-2xl border border-dashed border-white/15 p-4 text-sm text-white/42">No output yet.</p>
                    ) : (
                      selectedBrand.contentItems.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-white/10 bg-black/25 p-3">
                          <p className="truncate text-sm font-bold">{item.title || item.contentType}</p>
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <p className="text-xs text-white/38">{item.template?.name || item.contentType}</p>
                            <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${statusTone(item.status)}`}>{item.status.replace(/_/g, " ")}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </>
            ) : null}
          </aside>
        </div>
      </main>
    </PostlyAdminShell>
  );
}
