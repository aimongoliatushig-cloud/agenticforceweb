"use client";

import { useState } from "react";
import Link from "next/link";
import { Show, SignInButton, SignUpButton, useClerk, useUser } from "@clerk/nextjs";
import { ChevronDown, LayoutDashboard, LogIn, LogOut, ShieldCheck, UserCircle, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { dictionary } from "@/lib/i18n";

type AuthActionsProps = {
  locale: Locale;
  compact?: boolean;
};

export function AuthActions({ locale, compact = false }: AuthActionsProps) {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!clerkEnabled) {
    return (
      <Button
        asChild
        className="premium-cta h-[42px] rounded-xl bg-gradient-to-r from-red-500 to-amber-500 px-4 text-sm text-white shadow-[0_8px_24px_rgba(245,158,11,0.16)] hover:from-red-500 hover:to-amber-400 2xl:px-[22px]"
      >
        <Link href="/admin/login">Admin login</Link>
      </Button>
    );
  }

  return <ClerkAuthActions locale={locale} compact={compact} />;
}

function ClerkAuthActions({ locale, compact }: AuthActionsProps) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const labels =
    locale === "mn"
      ? {
          signIn: "Nevtreh",
          signUp: "Burtguuleh",
        }
      : dictionary[locale].nav;
  const signOutLabel = locale === "mn" ? "Garah" : "Sign out";
  const dashboardLabel = locale === "mn" ? "Dashboard" : "Dashboard";
  const adminLabel = locale === "mn" ? "Admin sambar" : "Admin panel";
  const signedInLabel = locale === "mn" ? "Nevtersen" : "Signed in";
  const userInitial =
    user?.firstName?.charAt(0) ||
    user?.primaryEmailAddress?.emailAddress?.charAt(0) ||
    "U";
  const displayName = user?.firstName || user?.fullName || user?.primaryEmailAddress?.emailAddress || "Account";
  const displayEmail = user?.primaryEmailAddress?.emailAddress || "";

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);

    try {
      await signOut({ redirectUrl: `/${locale}` });
    } catch (error) {
      console.error("Sign out failed", error);
      window.location.assign(`/${locale}`);
    }
  };

  return (
    <>
      <Show when="signed-in">
        <div className="relative flex items-center">
          <button
            type="button"
            className="flex min-h-[42px] max-w-[230px] items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1.5 text-left text-white transition hover:border-emerald-200/35 hover:bg-emerald-300/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
            onClick={() => setIsUserMenuOpen((open) => !open)}
            aria-expanded={isUserMenuOpen}
            aria-label="Open account menu"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-600 text-sm font-black text-white">
              {userInitial.toUpperCase()}
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-xs font-bold leading-4">{displayName}</span>
              <span className="block truncate text-[11px] leading-3 text-emerald-100/65">{signedInLabel}</span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-emerald-100/70" />
          </button>

          {isUserMenuOpen ? (
            <div className="absolute right-0 top-full z-50 mt-3 min-w-64 rounded-2xl border border-white/[0.08] bg-black/95 p-2 shadow-[0_18px_48px_rgba(0,0,0,0.45),0_8px_24px_rgba(245,158,11,0.08)] backdrop-blur-xl">
              <div className="mb-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-2">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <UserCircle className="h-4 w-4 text-emerald-200" />
                  {displayName}
                </div>
                {displayEmail ? <p className="mt-1 truncate text-xs text-white/50">{displayEmail}</p> : null}
              </div>
              <Link
                href={`/${locale}/dashboard`}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/80 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4" />
                {dashboardLabel}
              </Link>
              <Link
                href="/admin"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/80 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <ShieldCheck className="h-4 w-4" />
                {adminLabel}
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-1 flex w-full items-center gap-2 rounded-xl border-t border-white/[0.06] px-3 py-2 text-left text-sm text-red-100/85 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-50"
              >
                <LogOut className="h-4 w-4" />
                {signOutLabel}
              </button>
            </div>
          ) : null}
        </div>
      </Show>
      <Show when="signed-out">
        <div className={compact ? "flex flex-col gap-2" : "flex items-center gap-2 2xl:gap-4"}>
          <SignInButton mode="modal" forceRedirectUrl={`/${locale}/dashboard`}>
            <Button
              variant="ghost"
              className="premium-control h-[42px] rounded-xl border border-white/[0.05] bg-white/[0.035] px-3 text-sm text-white hover:border-white/10 hover:bg-white/[0.055] focus-visible:ring-2 focus-visible:ring-amber-500/60 2xl:px-4"
            >
              <LogIn className="h-4 w-4" />
              {labels.signIn}
            </Button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl={`/${locale}/dashboard`}>
            <Button className="premium-cta h-[42px] rounded-xl border-0 bg-gradient-to-r from-red-500 to-amber-500 px-4 text-sm text-white shadow-[0_8px_24px_rgba(245,158,11,0.16)] hover:from-red-500 hover:to-amber-400 2xl:px-[22px]">
              <UserPlus className="h-4 w-4" />
              {labels.signUp}
            </Button>
          </SignUpButton>
        </div>
      </Show>
    </>
  );
}
