// Run: npx ts-node scripts/seed-postly.ts
// Or: npx prisma db seed (if configured)

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const brandName = process.argv[2] || "Postly";

  const existing = await prisma.postlyBrand.findUnique({ where: { brandName } });
  if (existing) {
    console.log(`Brand "${brandName}" already exists. Skipping.`);
    return;
  }

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
  console.log(`✅ Created brand: ${brand.brandName} (${brand.id})`);

  const plan = await prisma.postlyContentPlan.create({
    data: {
      brandId: brand.id,
      monthYear: "2026-06",
      status: "active",
      strategyNote: "June 2026 content plan: brand awareness, product consideration, promotional campaigns.",
    },
  });
  console.log(`✅ Created content plan: ${plan.monthYear} (${plan.id})`);

  const items = [
    { contentType: "POSTER", category: "education", title: "AI Marketing Automation гэж юу вэ?", caption: "AI Marketing Automation-ийн тусламжтайгаар таны бизнес хэрхэн өсөх вэ?" },
    { contentType: "CAROUSEL", category: "promo", title: "Postly Starter Plan-ийн давуу талууд", caption: "390,000₮-өөр бүтэн AI marketing team." },
    { contentType: "REEL", category: "smoke_test", title: "Postly AI Reel Demo", caption: "AI-ийн тусламжтайгаар reel видео бүтээх нь." },
    { contentType: "POSTER", category: "education", title: "Сошиал медиа маркетингийн ирээдүй", caption: "AI agent-ууд сошиал медиа маркетингийг хэрхэн өөрчилж байна вэ?" },
    { contentType: "CAROUSEL", category: "promo", title: "Postly-гүй vs Postly-тай — Зардлын харьцуулалт", caption: "1 social media manager-ын цалингаар бүтэн AI marketing team ажиллуулна." },
  ];

  for (const item of items) {
    await prisma.postlyContentItem.create({
      data: {
        contentPlanId: plan.id,
        brandId: brand.id,
        contentType: item.contentType as any,
        category: item.category,
        title: item.title,
        caption: item.caption,
        status: "PLANNED",
      },
    });
  }
  console.log(`✅ Created ${items.length} planned content items`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
