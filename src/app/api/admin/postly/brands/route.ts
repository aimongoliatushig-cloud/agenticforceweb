import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { uploadBrandLogo } from "@/lib/postly-admin-templates";
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

async function readBrandBody(request: Request) {
  const isMultipart = request.headers.get("content-type")?.includes("multipart/form-data");
  const form = isMultipart ? await request.formData() : null;
  const body = form
    ? Object.fromEntries(Array.from(form.entries()).filter(([, value]) => typeof value === "string"))
    : await readJson(request);
  return { body, logoFile: form?.get("logoFile") };
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const brands = await prisma.companyProfile.findMany({
    orderBy: [{ createdAt: "desc" }, { companyName: "asc" }],
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

  const { body, logoFile } = await readBrandBody(request);
  const data = brandPayload(body);
  if (!data.companyName) {
    return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
  }

  let uploadedLogo: Awaited<ReturnType<typeof uploadBrandLogo>> | null = null;
  if (logoFile instanceof File && logoFile.size > 0) {
    try {
      uploadedLogo = await uploadBrandLogo({ file: logoFile });
      data.logoUrl = uploadedLogo.url;
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Logo upload failed" }, { status: 400 });
    }
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
    rawPayload: { ...body, uploadedLogo },
  });

  return NextResponse.json({ ok: true, brand }, { status: 201 });
}
