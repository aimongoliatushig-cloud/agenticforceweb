import { NextRequest, NextResponse } from "next/server";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { normalizeLocale } from "@/lib/i18n";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const fallbackSlug = request.nextUrl.searchParams.get("slug") || "";
  const locale = normalizeLocale(request.nextUrl.searchParams.get("locale") || undefined);
  let slug = fallbackSlug;
  let clickId = token ?? "";

  if (token && hasDatabaseUrl()) {
    try {
      const click = await prisma.newsletterClick.update({
        where: { token },
        data: { clickedAt: new Date() },
      });
      slug = click.articleSlug;
      clickId = click.id;
    } catch {
      slug = fallbackSlug;
    }
  }

  const target = new URL(`/${locale}/articles/${slug || "agentic-erp-next-operating-model"}`, request.url);
  if (clickId) target.searchParams.set("ncid", clickId);
  return NextResponse.redirect(target);
}
