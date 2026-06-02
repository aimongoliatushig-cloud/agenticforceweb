import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { asString, asStringArray, readJson, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  const allowed = await isAdminUser();
  if (!allowed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

function slugPart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "brand";
}

function brandPayload(body: Record<string, unknown>) {
  return {
    companyName: asString(body.companyName) || asString(body.brandName),
    businessType: asString(body.businessType) || asString(body.industry),
    activityDirection: asString(body.activityDirection) || asString(body.audience),
    description: asString(body.description),
    phone: asString(body.phone),
    email: asString(body.email),
    website: asString(body.website),
    address: asString(body.address),
    facebookUrl: asString(body.facebookUrl),
    instagramUrl: asString(body.instagramUrl),
    tiktokUrl: asString(body.tiktokUrl),
    logoUrl: asString(body.logoUrl),
  };
}

function guidelinePayload(body: Record<string, unknown>) {
  return {
    toneOfVoice: asString(body.toneOfVoice) || asString(body.tone),
    brandColors: asStringArray(body.brandColors),
    visualStyle: asString(body.visualStyle),
    language: asString(body.language) || "mn",
  };
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const brands = await prisma.companyProfile.findMany({
    orderBy: [{ companyName: "asc" }, { createdAt: "desc" }],
    include: {
      brandGuideline: true,
      _count: {
        select: {
          brandTemplates: true,
          contentItems: true,
          contentPlans: true,
          productsServicesPostly: true,
        },
      },
    },
  });

  return NextResponse.json({ brands });
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await readJson(request);
  const data = brandPayload(body);
  if (!data.companyName) {
    return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
  }

  const brand = await prisma.companyProfile.create({
    data: {
      ...data,
      clerkUserId: `admin-brand-${slugPart(data.companyName)}-${Date.now()}`,
      brandGuideline: {
        create: guidelinePayload(body),
      },
    },
    include: {
      brandGuideline: true,
      _count: {
        select: {
          brandTemplates: true,
          contentItems: true,
          contentPlans: true,
          productsServicesPostly: true,
        },
      },
    },
  });

  await writeAgentLog({
    companyId: brand.id,
    agentName: "Postly Admin",
    action: "brand.create",
    status: "success",
    message: `Admin created brand ${brand.companyName}`,
    rawPayload: body,
  });

  return NextResponse.json({ ok: true, brand }, { status: 201 });
}
