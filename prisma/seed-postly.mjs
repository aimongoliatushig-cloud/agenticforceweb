import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());
if (!process.env.SUPABASE_DATABASE_URL && process.env.DATABASE_URL) {
  process.env.SUPABASE_DATABASE_URL = process.env.DATABASE_URL;
}
if (!process.env.SUPABASE_DATABASE_URL) {
  throw new Error("SUPABASE_DATABASE_URL is missing. Add it to .env.local before seeding Postly.");
}

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { clerkUserId: "postly-seed-user" },
    update: { email: "postly-seed@agenticforce.local", name: "Postly Seed User" },
    create: {
      clerkUserId: "postly-seed-user",
      email: "postly-seed@agenticforce.local",
      name: "Postly Seed User",
      role: "admin",
    },
  });

  const company = await prisma.companyProfile.upsert({
    where: { clerkUserId: "postly-seed-user" },
    update: {
      userId: user.id,
      companyName: "Postly Demo Brand",
      businessType: "AI marketing agency",
      activityDirection: "Social media automation",
      email: user.email,
    },
    create: {
      clerkUserId: "postly-seed-user",
      userId: user.id,
      companyName: "Postly Demo Brand",
      businessType: "AI marketing agency",
      activityDirection: "Social media automation",
      email: user.email,
    },
  });

  await prisma.brandGuideline.upsert({
    where: { companyId: company.id },
    update: {
      toneOfVoice: "Professional, clear, action-driven",
      brandColors: ["#111111", "#FFB000"],
      language: "mn",
    },
    create: {
      companyId: company.id,
      toneOfVoice: "Professional, clear, action-driven",
      brandColors: ["#111111", "#FFB000"],
      language: "mn",
    },
  });

  await prisma.productService.create({
    data: {
      companyId: company.id,
      name: "AI Social Media Operating System",
      description: "Monthly social media planning, approval, generation, and posting workflow.",
      benefits: ["Faster content production", "Approval-first publishing", "Centralized tracking"],
      painPoints: ["Slow content calendar", "Inconsistent captions", "Manual posting"],
    },
  });

  const template = await prisma.brandTemplate.create({
    data: {
      companyId: company.id,
      name: "Demo Promo Poster",
      type: "POSTER",
      category: "promo",
      size: "1080x1080",
      previewImageUrl: "https://example.com/postly-demo-template.png",
    },
  });

  const plan = await prisma.contentPlan.create({
    data: {
      companyId: company.id,
      month: "2026-06",
      totalCarousels: 7,
      totalReels: 4,
      totalPosts: 11,
      status: "ACTIVE",
      strategyNote: "Seed plan for backend smoke testing.",
      createdById: user.id,
    },
  });

  await prisma.contentItem.create({
    data: {
      companyId: company.id,
      contentPlanId: plan.id,
      templateId: template.id,
      contentType: "POSTER",
      category: "promo",
      title: "Seed Promo Poster",
      status: "PLANNED",
    },
  });

  console.log(`Seeded Postly sample company: ${company.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
