import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { isAdminUser } from "@/lib/auth";
import { AdminLoginCard } from "./AdminLoginCard";

export const dynamic = "force-dynamic";

function adminRedirectTarget(value?: string) {
  if (!value) return "/admin";

  try {
    const decoded = decodeURIComponent(value);
    if (
      decoded === "/admin" ||
      (decoded.startsWith("/admin/") && !decoded.startsWith("/admin/login"))
    ) {
      return decoded;
    }
  } catch {
    // Fall through to the safe default.
  }

  return "/admin";
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const { redirect_url } = await searchParams;
  const redirectTarget = adminRedirectTarget(redirect_url);
  const allowed = await isAdminUser();
  const devBypassEnabled =
    process.env.NODE_ENV !== "production" && process.env.POSTLY_ADMIN_BYPASS_ENABLED === "true";

  if (allowed) {
    redirect(redirectTarget);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,.18),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.1),#000_92%)]" />

        <div className="relative grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Link href="/en" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/60 transition hover:text-white">
              AgenticForce
            </Link>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-4 py-2 text-sm font-semibold text-violet-100">
              <ShieldCheck className="h-4 w-4" />
              Admin access
            </div>
            <h1 className="max-w-xl text-4xl font-black leading-tight sm:text-5xl">
              Sign in to AgenticForce admin
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/60">
              Use your authorized admin account. After authentication you will be sent straight to the admin panel.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <AdminLoginCard redirectTarget={redirectTarget} devBypassEnabled={devBypassEnabled} />
          </div>
        </div>
      </section>
    </main>
  );
}
