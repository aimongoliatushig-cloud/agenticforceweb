import { NextResponse } from "next/server";
import { PostlyContentStatus } from "@prisma/client";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  const allowed = await isAdminUser();
  if (!allowed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

function contentStatus(value: string | null) {
  const normalized = value?.toUpperCase();
  return normalized && Object.values(PostlyContentStatus).includes(normalized as PostlyContentStatus)
    ? (normalized as PostlyContentStatus)
    : undefined;
}

export async function GET(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const status = contentStatus(searchParams.get("status"));
  const brandId = searchParams.get("brandId") || undefined;

  const items = await prisma.contentItem.findMany({
    where: {
      companyId: brandId,
      status,
    },
    orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
    take: 200,
    include: {
      company: true,
      template: true,
      approvalRequests: { orderBy: { createdAt: "desc" }, take: 3 },
      postingJobs: { orderBy: { createdAt: "desc" }, take: 3 },
      postingLogs: { orderBy: { createdAt: "desc" }, take: 3 },
    },
  });

  return NextResponse.json({ items });
}
