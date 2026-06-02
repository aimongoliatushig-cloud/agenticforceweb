import { NextResponse } from "next/server";
import { PostlyContentStatus, PostlyTemplateStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { hasDatabaseUrl } from "@/lib/db";
import { requireSecret, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = requireSecret(request, "HERMES_AGENT_SECRET", "x-hermes-secret");
  if (denied) return denied;
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });

  const items = await prisma.contentItem.findMany({
    where: { status: PostlyContentStatus.PLANNED },
    orderBy: [{ scheduledAt: "asc" }, { createdAt: "asc" }],
    take: 25,
    include: {
      company: { include: { brandGuideline: true, productsServicesPostly: true, socialAccounts: true } },
      contentPlan: true,
      template: true,
    },
  });

  const templateCompanyIds = [...new Set(items.map((item) => item.companyId))];
  const templates = await prisma.brandTemplate.findMany({
    where: { companyId: { in: templateCompanyIds }, status: PostlyTemplateStatus.ACTIVE },
    orderBy: { createdAt: "desc" },
  });

  await writeAgentLog({
    agentName: "Hermes",
    action: "postly.planned.fetch",
    status: "success",
    message: `Fetched ${items.length} planned Postly items`,
    rawPayload: { count: items.length },
  });

  return NextResponse.json({ items, templates });
}
