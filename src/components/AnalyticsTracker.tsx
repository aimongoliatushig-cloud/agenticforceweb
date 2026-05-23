"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";

function sessionInfo() {
  const key = "agenticforce_session_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return { id: existing, isFirstVisit: false };
  const created = crypto.randomUUID();
  window.localStorage.setItem(key, created);
  return { id: created, isFirstVisit: true };
}

export function AnalyticsTracker({ locale }: { locale?: Locale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const startedAt = Date.now();
    const session = sessionInfo();
    const newsletterClickId = searchParams.get("ncid");

    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "page_view",
        path: pathname,
        locale,
        sessionId: session.id,
        isFirstVisit: session.isFirstVisit,
        referrer: document.referrer,
        utmSource: searchParams.get("utm_source"),
        utmMedium: searchParams.get("utm_medium"),
        utmCampaign: searchParams.get("utm_campaign"),
        newsletterClickId,
      }),
      keepalive: true,
    }).catch(() => undefined);

    return () => {
      const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      navigator.sendBeacon?.(
        "/api/analytics/event",
        new Blob(
          [
            JSON.stringify({
              eventType: "page_duration",
              path: pathname,
              locale,
              sessionId: session.id,
              durationSeconds,
              newsletterClickId,
            }),
          ],
          { type: "application/json" }
        )
      );
    };
  }, [locale, pathname, searchParams]);

  return null;
}
