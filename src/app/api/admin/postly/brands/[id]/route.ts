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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const { body, logoFile } = await readBrandBody(request);
  const data = brandPayload(body);
  if (!data.companyName) {
    return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
  }

  const existing = await prisma.companyProfile.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Brand not found" }, { status: 404 });

  let uploadedLogo: Awaited<ReturnType<typeof uploadBrandLogo>> | null = null;
  if (logoFile instanceof File && logoFile.size > 0) {
    try {
      uploadedLogo = await uploadBrandLogo({ companyId: id, file: logoFile });
      data.logoUrl = uploadedLogo.url;
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Logo upload failed" }, { status: 400 });
    }
  }

  const brand = await prisma.companyProfile.update({
    where: { id },
    data: {
      ...data,
      brandGuideline: {
        upsert: {
          create: guidelinePayload(body),
          update: guidelinePayload(body),
        },
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
    companyId: id,
    agentName: "Postly Admin",
    action: "brand.update",
    status: "success",
    message: `Admin updated brand ${brand.companyName}`,
    rawPayload: { ...body, uploadedLogo },
  });

  return NextResponse.json({ ok: true, brand });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const existing = await prisma.companyProfile.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Brand not found" }, { status: 404 });

  await prisma.companyProfile.delete({ where: { id } });
  await writeAgentLog({
    agentName: "Postly Admin",
    action: "brand.delete",
    status: "success",
    message: `Admin deleted brand ${existing.companyName ?? id}`,
    rawPayload: { companyId: id },
  });

  return NextResponse.json({ ok: true });
}
