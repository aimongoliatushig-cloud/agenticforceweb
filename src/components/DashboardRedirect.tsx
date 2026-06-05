"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import type { Locale } from "@/lib/i18n";

export function DashboardRedirect({ locale }: { locale: Locale }) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    router.replace(`/${locale}/dashboard`);
  }, [isLoaded, isSignedIn, locale, router]);

  return null;
}
