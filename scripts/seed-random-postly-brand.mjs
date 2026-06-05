import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());
if (!process.env.SUPABASE_DATABASE_URL && process.env.DATABASE_URL) {
  process.env.SUPABASE_DATABASE_URL = process.env.DATABASE_URL;
}
if (!process.env.SUPABASE_DATABASE_URL) {
  throw new Error("SUPABASE_DATABASE_URL is missing. Add it to .env.local before seeding Postly brands.");
}

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

const brands = [
  {
    slug: "luna-brew",
    name: "Luna Brew",
    email: "hello@lunabrew.mn",
    businessType: "specialty coffee shop",
    activityDirection: "Coffee, brunch, and community events",
    colors: ["#101820", "#F2AA4C", "#FFFFFF"],
    product: "Monthly coffee subscription",
  },
  {
    slug: "nomad-fit",
    name: "Nomad Fit",
    email: "team@nomadfit.mn",
    businessType: "fitness studio",
    activityDirection: "Group training and personal coaching",
    colors: ["#111827", "#22C55E", "#F9FAFB"],
    product: "30-day transformation program",
  },
  {
    slug: "urban-nomad-studio",
    name: "Urban Nomad Studio",
    email: "studio@urbannomad.mn",
    businessType: "interior design studio",
    activityDirection: "Apartment and office interior design",
    colors: ["#0F172A", "#D6A85A", "#E5E7EB"],
    product: "Small apartment redesign package",
  },
];

function pick() {
  return brands[Math.floor(Math.random() * brands.length)];
}

async function main() {
  const brand = pick();
  const clerkUserId = `postly-random-${brand.slug}`;
  const user = await prisma.user.upsert({
    where: { clerkUserId },
    update: {
      email: brand.email,
      name: `${brand.name} Admin`,
    },
    create: {
      clerkUserId,
      email: brand.email,
      name: `${brand.name} Admin`,
      role: "admin",
    },
  });

  const company = await prisma.companyProfile.upsert({
    where: { clerkUserId },
    update: {
      userId: user.id,
      companyName: brand.name,
      businessType: brand.businessType,
      activityDirection: brand.activityDirection,
      description: `${brand.name} is a demo Postly brand for testing content planning and publishing automation.`,
      email: brand.email,
      facebookUrl: `https://facebook.com/${brand.slug}`,
      instagramUrl: `https://instagram.com/${brand.slug.replaceAll("-", "")}`,
      productsServices: [brand.product],
      plan: "Growth",
      postingTime: "morning",
      postingDays: ["monday", "wednesday", "friday"],
    },
    create: {
      clerkUserId,
      userId: user.id,
      companyName: brand.name,
      businessType: brand.businessType,
      activityDirection: brand.activityDirection,
      description: `${brand.name} is a demo Postly brand for testing content planning and publishing automation.`,
      email: brand.email,
      facebookUrl: `https://facebook.com/${brand.slug}`,
      instagramUrl: `https://instagram.com/${brand.slug.replaceAll("-", "")}`,
      productsServices: [brand.product],
      plan: "Growth",
      postingTime: "morning",
      postingDays: ["monday", "wednesday", "friday"],
    },
  });

  const guideline = await prisma.brandGuideline.upsert({
    where: { companyId: company.id },
    update: {
      toneOfVoice: "Warm, practical, premium, and concise",
      brandColors: brand.colors,
      fonts: ["Inter", "Geist"],
      ctaStyle: "clear direct booking CTA",
      visualStyle: "clean editorial social visuals",
      language: "mn",
    },
    create: {
      companyId: company.id,
      toneOfVoice: "Warm, practical, premium, and concise",
      brandColors: brand.colors,
      fonts: ["Inter", "Geist"],
      ctaStyle: "clear direct booking CTA",
      visualStyle: "clean editorial social visuals",
      language: "mn",
    },
  });

  const product = await prisma.productService.create({
    data: {
      companyId: company.id,
      name: brand.product,
      description: `A demo offer for ${brand.name}.`,
      price: "From 199,000 MNT",
      benefits: ["Easy to understand", "High value", "Good for monthly campaigns"],
      targetCustomer: "Urban professionals",
      painPoints: ["Too many choices", "No time to compare", "Need a trusted provider"],
    },
  });

  const template = await prisma.brandTemplate.create({
    data: {
      companyId: company.id,
      name: `${brand.name} Promo Poster`,
      type: "POSTER",
      category: "promo",
      size: "1080x1080",
      previewImageUrl: "https://example.com/postly-random-brand-template.png",
    },
  });

  const plan = await prisma.contentPlan.create({
    data: {
      companyId: company.id,
      month: "2026-06",
      totalCarousels: 3,
      totalReels: 2,
      totalPosts: 6,
      status: "ACTIVE",
      strategyNote: `${brand.name} June demo campaign: awareness, product education, and conversion CTA.`,
      createdById: user.id,
    },
  });

  const items = await prisma.$transaction([
    prisma.contentItem.create({
      data: {
        companyId: company.id,
        contentPlanId: plan.id,
        templateId: template.id,
        contentType: "POSTER",
        category: "promo",
        title: `${brand.name} launch offer`,
        headline: "Шинэ сарын онцгой санал",
        caption: `${brand.name}-ийн ${brand.product}-г энэ сард туршаад үзээрэй.`,
        imagePrompt: `Premium square social media poster for ${brand.name}, ${brand.businessType}, using colors ${brand.colors.join(", ")}`,
        creativeDirection: "Premium clean layout with strong headline and product focus.",
        status: "PLANNED",
      },
    }),
    prisma.contentItem.create({
      data: {
        companyId: company.id,
        contentPlanId: plan.id,
        contentType: "CAROUSEL",
        category: "education",
        title: `${brand.name} education carousel`,
        creativeDirection: "Three to five slide educational carousel.",
        status: "PLANNED",
      },
    }),
  ]);

  await prisma.makeIntegration.upsert({
    where: { companyId: company.id },
    update: {
      webhookUrl: "https://example.com/mock-make-webhook",
      webhookSecretHint: "mock",
      scenarioName: `${brand.name} Mock Make Scenario`,
      status: "active",
    },
    create: {
      companyId: company.id,
      webhookUrl: "https://example.com/mock-make-webhook",
      webhookSecretHint: "mock",
      scenarioName: `${brand.name} Mock Make Scenario`,
      status: "active",
    },
  });

  console.log(JSON.stringify({
    ok: true,
    companyId: company.id,
    brandName: company.companyName,
    guidelineId: guideline.id,
    productId: product.id,
    templateId: template.id,
    contentPlanId: plan.id,
    contentItemIds: items.map((item) => item.id),
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
