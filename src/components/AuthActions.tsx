"use client";

import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { LogIn, UserPlus } from "lucide-react";
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
        className="premium-cta h-[42px] rounded-xl bg-gradient-to-r from-red-500 to-amber-500 px-[22px] text-white shadow-[0_8px_24px_rgba(245,158,11,0.16)] hover:from-red-500 hover:to-amber-400"
      >
        <Link href={`/${locale}#newsletter`}>{labels.signUp}</Link>
      </Button>
    );
  }

  return <ClerkAuthActions locale={locale} compact={compact} />;
}

function ClerkAuthActions({ locale, compact }: AuthActionsProps) {
  const labels =
    locale === "mn"
      ? {
          admin: "CRM",
          signIn: "Нэвтрэх",
          signUp: "Бүртгүүлэх",
        }
      : dictionary[locale].nav;

  return (
    <>
      <Show when="signed-in">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            className="premium-control h-[42px] rounded-xl border border-white/[0.05] bg-white/[0.035] text-white hover:border-white/10 hover:bg-white/[0.055]"
          >
            <Link href="/admin">{labels.admin}</Link>
          </Button>
          <UserButton />
        </div>
      </Show>
      <Show when="signed-out">
        <div className={compact ? "flex flex-col gap-2" : "flex items-center gap-2 lg:gap-4"}>
          <SignInButton mode="modal" forceRedirectUrl={`/${locale}`}>
            <Button
              variant="ghost"
              className="premium-control h-[42px] rounded-xl border border-white/[0.05] bg-white/[0.035] text-white hover:border-white/10 hover:bg-white/[0.055] focus-visible:ring-2 focus-visible:ring-amber-500/60"
            >
              <LogIn className="h-4 w-4" />
              {labels.signIn}
            </Button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl={`/${locale}`}>
            <Button className="premium-cta h-[42px] rounded-xl border-0 bg-gradient-to-r from-red-500 to-amber-500 px-[22px] text-white shadow-[0_8px_24px_rgba(245,158,11,0.16)] hover:from-red-500 hover:to-amber-400">
              <UserPlus className="h-4 w-4" />
              {labels.signUp}
            </Button>
          </SignUpButton>
        </div>
      </Show>
    </>
  );
}
