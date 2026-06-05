import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());
if (!process.env.SUPABASE_DATABASE_URL && process.env.DATABASE_URL) {
  process.env.SUPABASE_DATABASE_URL = process.env.DATABASE_URL;
}
if (!process.env.SUPABASE_DATABASE_URL) {
  throw new Error("SUPABASE_DATABASE_URL is missing. Add it to .env.local before running Postly flow tests.");
}

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  const company = await prisma.companyProfile.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      brandGuideline: true,
      makeIntegration: true,
      socialAccounts: true,
    },
  });
  assert(company, "No company found. Run npm run seed:postly first.");

  const plan = await prisma.contentPlan.findFirst({
    where: { companyId: company.id },
    orderBy: { createdAt: "desc" },
  });
  assert(plan, "No content plan found. Run npm run seed:postly first.");

  let item = await prisma.contentItem.findFirst({
    where: { companyId: company.id, contentPlanId: plan.id },
    orderBy: { createdAt: "desc" },
  });

  if (!item) {
    item = await prisma.contentItem.create({
      data: {
        companyId: company.id,
        contentPlanId: plan.id,
        contentType: "POSTER",
        category: "smoke_test",
        title: "Smoke Test Post",
        status: "PLANNED",
      },
    });
  }

  item = await prisma.contentItem.update({
    where: { id: item.id },
    data: {
      title: "Smoke Test Post",
      headline: "Backend flow is working",
      caption: "This is a backend smoke test caption.",
      imagePrompt: "A clean social media poster for an AI marketing system.",
      creativeDirection: "Minimal, premium, clear CTA.",
      status: "DRAFT_GENERATED",
    },
  });

  await prisma.approvalRequest.create({
    data: {
      contentItemId: item.id,
      telegramChatId: "smoke-test-chat",
      telegramMessageId: `smoke-${Date.now()}`,
      status: "APPROVED",
      approvedAt: new Date(),
    },
  });

  item = await prisma.contentItem.update({
    where: { id: item.id },
    data: { status: "APPROVED" },
  });

  const makeIntegration = await prisma.makeIntegration.upsert({
    where: { companyId: company.id },
    update: {
      webhookUrl: "https://example.com/mock-make-webhook",
      scenarioName: "Mock Postly Smoke Scenario",
      webhookSecretHint: "mock",
      status: "active",
    },
    create: {
      companyId: company.id,
      webhookUrl: "https://example.com/mock-make-webhook",
      scenarioName: "Mock Postly Smoke Scenario",
      webhookSecretHint: "mock",
      status: "active",
    },
  });

  const facebook = await prisma.socialAccount.upsert({
    where: { id: (await prisma.socialAccount.findFirst({ where: { companyId: company.id, platform: "FACEBOOK" } }))?.id ?? "__missing__" },
    update: {
      pageName: "Mock Facebook Page",
      pageId: "fb_page_smoke",
      status: "CONNECTED",
    },
    create: {
      companyId: company.id,
      platform: "FACEBOOK",
      pageName: "Mock Facebook Page",
      pageId: "fb_page_smoke",
      status: "CONNECTED",
    },
  }).catch(async () => {
    return prisma.socialAccount.create({
      data: {
        companyId: company.id,
        platform: "FACEBOOK",
        pageName: "Mock Facebook Page",
        pageId: "fb_page_smoke",
        status: "CONNECTED",
      },
    });
  });

  const instagramExisting = await prisma.socialAccount.findFirst({ where: { companyId: company.id, platform: "INSTAGRAM" } });
  const instagram = instagramExisting
    ? await prisma.socialAccount.update({
        where: { id: instagramExisting.id },
        data: {
          pageName: "Mock Instagram Account",
          pageId: "ig_page_smoke",
          instagramAccountId: "ig_account_smoke",
          status: "CONNECTED",
        },
      })
    : await prisma.socialAccount.create({
        data: {
          companyId: company.id,
          platform: "INSTAGRAM",
          pageName: "Mock Instagram Account",
          pageId: "ig_page_smoke",
          instagramAccountId: "ig_account_smoke",
          status: "CONNECTED",
        },
      });

  item = await prisma.contentItem.update({
    where: { id: item.id },
    data: {
      status: "SENT_TO_MAKE",
      makeStatus: "sent_to_make_smoke",
    },
  });

  await Promise.all(
    ["FACEBOOK", "INSTAGRAM"].map(async (platform) => {
      const existing = await prisma.postingJob.findFirst({ where: { contentItemId: item.id, platform } });
      if (existing) {
        return prisma.postingJob.update({
          where: { id: existing.id },
          data: {
            companyId: company.id,
            status: "SENT_TO_MAKE",
            makeWebhookResponse: { smoke: true, makeIntegrationId: makeIntegration.id },
          },
        });
      }

      return prisma.postingJob.create({
        data: {
          companyId: company.id,
          contentItemId: item.id,
          platform,
          status: "SENT_TO_MAKE",
          makeWebhookResponse: { smoke: true, makeIntegrationId: makeIntegration.id },
        },
      });
    }),
  );

  const asset = await prisma.contentAsset.create({
    data: {
      companyId: company.id,
      contentItemId: item.id,
      assetType: "IMAGE",
      source: "MAKE",
      fileUrl: "https://example.com/mock-postly-generated-image.png",
      status: "ready",
    },
  });

  item = await prisma.contentItem.update({
    where: { id: item.id },
    data: {
      status: "POSTED",
      makeStatus: "posted_smoke",
      facebookPostUrl: "https://facebook.com/mock-post",
      instagramPostUrl: "https://instagram.com/p/mock-post",
    },
  });

  await prisma.postingLog.create({
    data: {
      companyId: company.id,
      contentItemId: item.id,
      status: "POSTED",
      postedUrl: item.facebookPostUrl,
      rawResponse: {
        smoke: true,
        facebookPageId: facebook.pageId,
        instagramAccountId: instagram.instagramAccountId,
        assetId: asset.id,
      },
    },
  });

  await prisma.agentLog.create({
    data: {
      companyId: company.id,
      contentItemId: item.id,
      agentName: "Postly Smoke Test",
      action: "postly.flow.smoke",
      status: "success",
      message: "PLANNED to POSTED backend flow completed",
      rawPayload: { smoke: true },
    },
  });

  const final = await prisma.contentItem.findUnique({
    where: { id: item.id },
    include: {
      assets: true,
      approvalRequests: true,
      postingJobs: true,
      postingLogs: true,
      agentLogs: true,
    },
  });

  assert(final?.status === "POSTED", "Final content item status should be POSTED.");
  assert(final.assets.length > 0, "Expected at least one generated asset.");
  assert(final.approvalRequests.some((approval) => approval.status === "APPROVED"), "Expected approved approval request.");
  assert(final.postingJobs.length >= 2, "Expected Facebook and Instagram posting jobs.");
  assert(final.postingLogs.some((log) => log.status === "POSTED"), "Expected posted log.");

  console.log(JSON.stringify({
    ok: true,
    companyId: company.id,
    contentPlanId: plan.id,
    contentItemId: final.id,
    finalStatus: final.status,
    makeWebhookConfigured: Boolean(makeIntegration.webhookUrl),
    facebookPageId: facebook.pageId,
    instagramAccountId: instagram.instagramAccountId,
    assets: final.assets.length,
    approvalRequests: final.approvalRequests.length,
    postingJobs: final.postingJobs.length,
    postingLogs: final.postingLogs.length,
    agentLogs: final.agentLogs.length,
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
