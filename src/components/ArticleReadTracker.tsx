"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

function sessionId() {
  const key = "agenticforce_session_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  window.localStorage.setItem(key, created);
  return created;
}

export function ArticleReadTracker({ slug, locale }: { slug: string; locale: Locale }) {
  useEffect(() => {
    const startedAt = Date.now();
    const session = sessionId();

    fetch("/api/articles/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, locale, sessionId: session, percentRead: 0, timeOnPage: 0 }),
      keepalive: true,
    }).catch(() => undefined);

    return () => {
      const documentHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const percentRead = Math.min(100, Math.max(0, Math.round((window.scrollY / documentHeight) * 100)));
      const timeOnPage = Math.max(1, Math.round((Date.now() - startedAt) / 1000));

      navigator.sendBeacon?.(
        "/api/articles/view",
        new Blob([JSON.stringify({ slug, locale, sessionId: session, percentRead, timeOnPage })], {
          type: "application/json",
        })
      );
    };
  }, [locale, slug]);

  return null;
}
