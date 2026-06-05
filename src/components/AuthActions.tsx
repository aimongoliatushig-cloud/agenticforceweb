"use client";

import { useState } from "react";
import Link from "next/link";
import { Show, SignInButton, SignUpButton, useClerk, useUser } from "@clerk/nextjs";
import { LayoutDashboard, LogIn, LogOut, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { dictionary } from "@/lib/i18n";

type AuthActionsProps = {
  locale: Locale;
  compact?: boolean;
};

export function AuthActions({ locale, compact = false }: AuthActionsProps) {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const labels =
    locale === "mn"
      ? {
          admin: "CRM",
          signIn: "Нэвтрэх",
          signUp: "Бүртгүүлэх",
        }
      : dictionary[locale].nav;

  if (!clerkEnabled) {
    return (
      <Button
        asChild
        className="premium-cta h-[42px] rounded-xl bg-gradient-to-r from-red-500 to-amber-500 px-4 text-sm text-white shadow-[0_8px_24px_rgba(245,158,11,0.16)] hover:from-red-500 hover:to-amber-400 2xl:px-[22px]"
      >
        <Link href={`/${locale}#newsletter`}>{labels.signUp}</Link>
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
          admin: "CRM",
          signIn: "Нэвтрэх",
          signUp: "Бүртгүүлэх",
        }
      : dictionary[locale].nav;
  const signOutLabel = locale === "mn" ? "Гарах" : "Sign out";
  const dashboardLabel = locale === "mn" ? "Хяналтын самбар" : "Dashboard";
  const userInitial =
    user?.firstName?.charAt(0) ||
    user?.primaryEmailAddress?.emailAddress?.charAt(0) ||
    "U";

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
            className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
            onClick={() => setIsUserMenuOpen((open) => !open)}
            aria-expanded={isUserMenuOpen}
            aria-label="Open user menu"
          >
            {userInitial.toUpperCase()}
          </button>

          {isUserMenuOpen ? (
            <div className="absolute right-0 top-full z-50 mt-3 min-w-36 rounded-2xl border border-white/[0.06] bg-black/90 p-2 shadow-[0_18px_48px_rgba(0,0,0,0.45),0_8px_24px_rgba(245,158,11,0.08)] backdrop-blur-xl">
              <Link
                href={`/${locale}/dashboard/postly`}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/80 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4" />
                {dashboardLabel}
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/80 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white"
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
          <SignInButton mode="modal" forceRedirectUrl={`/${locale}/dashboard/postly`}>
            <Button
              variant="ghost"
              className="premium-control h-[42px] rounded-xl border border-white/[0.05] bg-white/[0.035] px-3 text-sm text-white hover:border-white/10 hover:bg-white/[0.055] focus-visible:ring-2 focus-visible:ring-amber-500/60 2xl:px-4"
            >
              <LogIn className="h-4 w-4" />
              {labels.signIn}
            </Button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl={`/${locale}/dashboard/postly`}>
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
