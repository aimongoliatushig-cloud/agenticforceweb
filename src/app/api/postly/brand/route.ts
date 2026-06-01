import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { asString, asStringArray, readJson, requirePostlyCompany, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

export async function GET() {
  const context = await requirePostlyCompany();
  if ("response" in context) return context.response;

  const guideline = await prisma.brandGuideline.findUnique({
    where: { companyId: context.company.id },
  });

  return NextResponse.json({ company: context.company, guideline });
}

export async function PUT(request: Request) {
  const context = await requirePostlyCompany();
  if ("response" in context) return context.response;

  const body = await readJson(request);
  const guideline = await prisma.brandGuideline.upsert({
    where: { companyId: context.company.id },
    update: {
      toneOfVoice: asString(body.toneOfVoice),
      brandColors: asStringArray(body.brandColors),
      fonts: asStringArray(body.fonts),
      logoUrl: asString(body.logoUrl),
      forbiddenWords: asStringArray(body.forbiddenWords),
      preferredWords: asStringArray(body.preferredWords),
      ctaStyle: asString(body.ctaStyle),
      visualStyle: asString(body.visualStyle),
      language: asString(body.language) || "mn",
    },
    create: {
      companyId: context.company.id,
      toneOfVoice: asString(body.toneOfVoice),
      brandColors: asStringArray(body.brandColors),
      fonts: asStringArray(body.fonts),
      logoUrl: asString(body.logoUrl),
      forbiddenWords: asStringArray(body.forbiddenWords),
      preferredWords: asStringArray(body.preferredWords),
      ctaStyle: asString(body.ctaStyle),
      visualStyle: asString(body.visualStyle),
      language: asString(body.language) || "mn",
    },
  });

  await writeAgentLog({
    companyId: context.company.id,
    agentName: "Postly API",
    action: "brand_guideline.upsert",
    status: "success",
    message: "Brand guideline saved",
    rawPayload: body,
  });

  return NextResponse.json({ ok: true, guideline });
}
