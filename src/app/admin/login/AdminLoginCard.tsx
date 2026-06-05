"use client";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk-config";

export function AdminLoginCard({
  redirectTarget,
  devBypassEnabled,
}: {
  redirectTarget: string;
  devBypassEnabled: boolean;
}) {
  if (!isClerkConfigured()) {
    return (
      <div className="w-full max-w-[420px] rounded-lg border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-violet-950/30">
        <h2 className="text-xl font-black text-white">Clerk is not configured</h2>
        <p className="mt-3 text-sm leading-6 text-white/60">
          Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to enable admin sign-in, then restart the dev server.
        </p>
        {devBypassEnabled ? (
          <form action="/api/admin/bypass" method="post" className="mt-6 space-y-3">
            <input type="hidden" name="redirect_url" value={redirectTarget} />
            <label className="block text-sm font-semibold text-white/75" htmlFor="admin-token">
              Local admin token
            </label>
            <input
              id="admin-token"
              name="token"
              type="password"
              autoComplete="off"
              className="h-11 w-full rounded-md border border-white/10 bg-black px-3 text-sm text-white outline-none transition focus:border-violet-300"
              placeholder="Enter local bypass token"
            />
            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-violet-500 px-4 text-sm font-bold text-white transition hover:bg-violet-400"
            >
              Continue to admin
            </button>
          </form>
        ) : (
          <Link
            href="/en"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-violet-500 px-4 text-sm font-bold text-white transition hover:bg-violet-400"
          >
            Back to site
          </Link>
        )}
      </div>
    );
  }

  return (
    <SignIn
      routing="hash"
      forceRedirectUrl={redirectTarget}
      fallbackRedirectUrl={redirectTarget}
      signUpForceRedirectUrl={redirectTarget}
      signUpFallbackRedirectUrl={redirectTarget}
      appearance={{
        elements: {
          rootBox: "w-full max-w-[420px]",
          cardBox: "shadow-2xl shadow-violet-950/30",
          card: "border border-white/10 bg-zinc-950 text-white",
          headerTitle: "text-white",
          headerSubtitle: "text-white/60",
          socialButtonsBlockButton: "border-white/10 bg-white/5 text-white hover:bg-white/10",
          formButtonPrimary: "bg-violet-500 text-white hover:bg-violet-400",
          footerActionText: "text-white/60",
          footerActionLink: "text-violet-200 hover:text-violet-100",
        },
      }}
    />
  );
}
