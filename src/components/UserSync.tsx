"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import type { Locale } from "@/lib/i18n";

export function UserSync({ locale }: { locale?: Locale }) {
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    fetch("/api/user/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    }).catch(() => undefined);
  }, [isLoaded, isSignedIn, locale]);

  return null;
}
