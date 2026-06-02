// POST /api/hermes/postly/seed - Seed Postly brand data for testing
import { NextRequest, NextResponse } from "next/server";
import { hasDatabaseUrl, prisma } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: NextRequest) {
  const expected = process.env.HERMES_AGENT_SECRET;
  const provided = request.headers.get("x-hermes-secret");
  if (!expected || provided !== expected) return unauthorized();
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: "No database configured" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const brandName = body.brandName || "Postly";

  // Check if brand already exists
  const existing = await prisma.postlyBrand.findUnique({
    where: { brandName },
  });
  if (existing) {
    return NextResponse.json({ ok: true, message: "Brand already exists", brand: existing });
  }

  // Create Postly brand
  const brand = await prisma.postlyBrand.create({
    data: {
      brandName,
      businessType: "AI Content Marketing Automation",
      brandGuideline: {
        toneOfVoice: "Professional, friendly, modern",
        brandColors: ["#4CBFDD", "#5ED4C0", "#063B4A", "#FFFFFF"],
        fonts: ["Nunito Bold", "Nunito Regular"],
        language: "Mongolian",
        tagline: "1 social media manager-ын цалингаар бүтэн AI marketing team ажиллуулна.",
      },
      products: [
        {
          name: "Starter Plan",
          description: "7 carousel posts + 4 AI reel videos per month",
          price: "390,000₮/сар",
          benefits: ["7 carousel posts", "4 AI reel videos", "Auto-post system", "Content calendar", "1 boost setup free"],
          status: "active",
        },
        {
          name: "Growth Plan",
          description: "12 carousel posts + 8 AI reel videos per month",
          price: "690,000₮/сар",
          benefits: ["12 carousel posts", "8 AI reel videos", "Daily posting", "Messenger funnel idea", "2 boost setups free"],
          status: "active",
        },
        {
          name: "Enterprise Plan",
          description: "20 carousel posts + 16 AI reel videos per month",
          price: "1,190,000₮/сар",
          benefits: ["20 carousel posts", "16 AI reel videos", "Full automation", "Competitor monitoring", "4 boost setups free"],
          status: "active",
        },
      ],
      templates: [
        { name: "Default Carousel", type: "CAROUSEL", slides: 4, format: "1:1" },
        { name: "Default Poster", type: "POSTER", format: "1:1" },
        { name: "AI Reel", type: "REEL", duration: "24s" },
      ],
      socialAccounts: [
        { platform: "Facebook", status: "active" },
        { platform: "Instagram", status: "active" },
      ],
      makeIntegration: {
        webhookUrl: process.env.MAKE_POSTLY_WEBHOOK_URL || null,
        scenarioName: "Postly Content Publishing",
        status: "configured",
      },
    },
  });

  // Create a June 2026 content plan
  const plan = await prisma.postlyContentPlan.create({
    data: {
      brandId: brand.id,
      monthYear: "2026-06",
      status: "active",
      strategyNote: "June 2026 content plan: brand awareness, product consideration, promotional campaigns.",
    },
  });

  // Create sample planned content items
  const sampleItems = [
    {
      contentType: "POSTER" as const,
      category: "education",
      title: "AI Marketing Automation гэж юу вэ?",
      caption: "AI Marketing Automation-ийн тусламжтайгаар таны бизнес хэрхэн өсөх вэ? Энгийн тайлбар.",
      status: "PLANNED" as const,
    },
    {
      contentType: "CAROUSEL" as const,
      category: "promo",
      title: "Postly Starter Plan-ийн давуу талууд",
      caption: "390,000₮-өөр бүтэн AI marketing team. 7 carousel + 4 reel сар бүр.",
      status: "PLANNED" as const,
    },
    {
      contentType: "REEL" as const,
      category: "smoke_test",
      title: "Postly AI Reel Demo - 24 секунд",
      caption: "AI-ийн тусламжтайгаар хэрхэн reel видео бүтээх вэ?",
      status: "PLANNED" as const,
    },
    {
      contentType: "POSTER" as const,
      category: "education",
      title: "Сошиал медиа маркетингийн ирээдүй",
      caption: "AI agent-ууд сошиал медиа маркетингийг хэрхэн өөрчилж байна вэ?",
      status: "PLANNED" as const,
    },
    {
      contentType: "CAROUSEL" as const,
      category: "promo",
      title: "Postly-гүй vs Postly-тай — Зардлын харьцуулалт",
      caption: "1 social media manager-ын цалингаар бүтэн AI marketing team ажиллуулна.",
      status: "PLANNED" as const,
    },
  ];

  for (const item of sampleItems) {
    await prisma.postlyContentItem.create({
      data: {
        contentPlanId: plan.id,
        brandId: brand.id,
        contentType: item.contentType,
        category: item.category,
        title: item.title,
        caption: item.caption,
        status: item.status,
      },
    });
  }

  return NextResponse.json({
    ok: true,
    brand,
    plan,
    itemsCreated: sampleItems.length,
  });
}
