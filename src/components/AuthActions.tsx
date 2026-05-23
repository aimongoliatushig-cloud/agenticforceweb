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
  const labels = dictionary[locale].nav;

  if (!clerkEnabled) {
    return (
      <Button asChild className="bg-gradient-to-r from-red-500 to-amber-500 text-white">
        <Link href={`/${locale}#newsletter`}>{labels.signUp}</Link>
      </Button>
    );
  }

  return <ClerkAuthActions locale={locale} compact={compact} />;
}

function ClerkAuthActions({ locale, compact }: AuthActionsProps) {
  const labels = dictionary[locale].nav;

  return (
    <>
      <Show when="signed-in">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="text-white hover:bg-white/10">
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
              className="text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-500/70"
            >
              <LogIn className="h-4 w-4" />
              {labels.signIn}
            </Button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl={`/${locale}`}>
            <Button className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white border-0 shadow-lg shadow-amber-500/20">
              <UserPlus className="h-4 w-4" />
              {labels.signUp}
            </Button>
          </SignUpButton>
        </div>
      </Show>
    </>
  );
}
