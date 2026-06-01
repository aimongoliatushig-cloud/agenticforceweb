-- CreateEnum
CREATE TYPE "PostlyContentStatus" AS ENUM ('PLANNED', 'DRAFT_GENERATED', 'WAITING_APPROVAL', 'APPROVED', 'REJECTED', 'NEEDS_REVISION', 'SENT_TO_MAKE', 'MEDIA_GENERATED', 'SCHEDULED', 'POSTED', 'FAILED');

-- CreateEnum
CREATE TYPE "PostlyPlanStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PostlyTemplateStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PostlyProductStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PostlyApprovalStatus" AS ENUM ('WAITING', 'APPROVED', 'REJECTED', 'NEEDS_REVISION');

-- CreateEnum
CREATE TYPE "PostlyPostingStatus" AS ENUM ('PENDING', 'SENT_TO_MAKE', 'SCHEDULED', 'POSTED', 'FAILED');

-- CreateEnum
CREATE TYPE "PostlyPlatform" AS ENUM ('FACEBOOK', 'INSTAGRAM');

-- CreateEnum
CREATE TYPE "PostlyContentType" AS ENUM ('CAROUSEL', 'REEL', 'POSTER', 'STORY');

-- CreateEnum
CREATE TYPE "PostlyAssetType" AS ENUM ('IMAGE', 'VIDEO', 'CAROUSEL_SLIDE', 'REEL_COVER');

-- CreateEnum
CREATE TYPE "PostlyAssetSource" AS ENUM ('UPLOADED', 'GENERATED', 'MAKE', 'HERMES');

-- CreateEnum
CREATE TYPE "PostlySocialStatus" AS ENUM ('CONNECTED', 'EXPIRED', 'DISCONNECTED');

-- CreateTable
CREATE TABLE "BrandGuideline" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "toneOfVoice" TEXT,
    "brandColors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "fonts" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "logoUrl" TEXT,
    "forbiddenWords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredWords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ctaStyle" TEXT,
    "visualStyle" TEXT,
    "language" TEXT NOT NULL DEFAULT 'mn',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandGuideline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandTemplate" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PostlyContentType" NOT NULL,
    "category" TEXT,
    "templateFileUrl" TEXT,
    "previewImageUrl" TEXT,
    "editableFields" JSONB,
    "size" TEXT,
    "status" "PostlyTemplateStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductService" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" TEXT,
    "benefits" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "targetCustomer" TEXT,
    "painPoints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "PostlyProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentPlan" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "totalCarousels" INTEGER NOT NULL DEFAULT 0,
    "totalReels" INTEGER NOT NULL DEFAULT 0,
    "totalPosts" INTEGER NOT NULL DEFAULT 0,
    "strategyNote" TEXT,
    "status" "PostlyPlanStatus" NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentItem" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "contentPlanId" TEXT,
    "templateId" TEXT,
    "contentType" "PostlyContentType" NOT NULL,
    "category" TEXT,
    "title" TEXT,
    "caption" TEXT,
    "headline" TEXT,
    "imagePrompt" TEXT,
    "creativeDirection" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "status" "PostlyContentStatus" NOT NULL DEFAULT 'PLANNED',
    "telegramMessageId" TEXT,
    "makeStatus" TEXT,
    "facebookPostUrl" TEXT,
    "instagramPostUrl" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentAsset" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "contentItemId" TEXT NOT NULL,
    "assetType" "PostlyAssetType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "source" "PostlyAssetSource" NOT NULL DEFAULT 'UPLOADED',
    "slideOrder" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ready',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalRequest" (
    "id" TEXT NOT NULL,
    "contentItemId" TEXT NOT NULL,
    "telegramChatId" TEXT,
    "telegramMessageId" TEXT,
    "status" "PostlyApprovalStatus" NOT NULL DEFAULT 'WAITING',
    "approvedAt" TIMESTAMP(3),
    "revisionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostingJob" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "contentItemId" TEXT NOT NULL,
    "platform" "PostlyPlatform" NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "status" "PostlyPostingStatus" NOT NULL DEFAULT 'PENDING',
    "makeWebhookResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostingJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostingLog" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "contentItemId" TEXT,
    "platform" "PostlyPlatform",
    "status" TEXT NOT NULL,
    "postedUrl" TEXT,
    "errorMessage" TEXT,
    "rawResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialAccount" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "platform" "PostlyPlatform" NOT NULL,
    "pageName" TEXT,
    "pageId" TEXT,
    "instagramAccountId" TEXT,
    "accessTokenEncrypted" TEXT,
    "status" "PostlySocialStatus" NOT NULL DEFAULT 'DISCONNECTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentLog" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "contentItemId" TEXT,
    "agentName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrandGuideline_companyId_key" ON "BrandGuideline"("companyId");

-- CreateIndex
CREATE INDEX "BrandTemplate_companyId_status_idx" ON "BrandTemplate"("companyId", "status");

-- CreateIndex
CREATE INDEX "BrandTemplate_companyId_type_idx" ON "BrandTemplate"("companyId", "type");

-- CreateIndex
CREATE INDEX "ProductService_companyId_status_idx" ON "ProductService"("companyId", "status");

-- CreateIndex
CREATE INDEX "ContentPlan_companyId_month_idx" ON "ContentPlan"("companyId", "month");

-- CreateIndex
CREATE INDEX "ContentPlan_companyId_status_idx" ON "ContentPlan"("companyId", "status");

-- CreateIndex
CREATE INDEX "ContentItem_companyId_status_idx" ON "ContentItem"("companyId", "status");

-- CreateIndex
CREATE INDEX "ContentItem_contentPlanId_contentType_idx" ON "ContentItem"("contentPlanId", "contentType");

-- CreateIndex
CREATE INDEX "ContentItem_scheduledAt_idx" ON "ContentItem"("scheduledAt");

-- CreateIndex
CREATE INDEX "ContentAsset_companyId_createdAt_idx" ON "ContentAsset"("companyId", "createdAt");

-- CreateIndex
CREATE INDEX "ContentAsset_contentItemId_assetType_idx" ON "ContentAsset"("contentItemId", "assetType");

-- CreateIndex
CREATE INDEX "ApprovalRequest_contentItemId_status_idx" ON "ApprovalRequest"("contentItemId", "status");

-- CreateIndex
CREATE INDEX "ApprovalRequest_telegramMessageId_idx" ON "ApprovalRequest"("telegramMessageId");

-- CreateIndex
CREATE INDEX "PostingJob_companyId_status_idx" ON "PostingJob"("companyId", "status");

-- CreateIndex
CREATE INDEX "PostingJob_contentItemId_platform_idx" ON "PostingJob"("contentItemId", "platform");

-- CreateIndex
CREATE INDEX "PostingLog_companyId_createdAt_idx" ON "PostingLog"("companyId", "createdAt");

-- CreateIndex
CREATE INDEX "PostingLog_contentItemId_createdAt_idx" ON "PostingLog"("contentItemId", "createdAt");

-- CreateIndex
CREATE INDEX "SocialAccount_companyId_platform_idx" ON "SocialAccount"("companyId", "platform");

-- CreateIndex
CREATE INDEX "AgentLog_companyId_createdAt_idx" ON "AgentLog"("companyId", "createdAt");

-- CreateIndex
CREATE INDEX "AgentLog_contentItemId_createdAt_idx" ON "AgentLog"("contentItemId", "createdAt");

-- CreateIndex
CREATE INDEX "AgentLog_agentName_action_idx" ON "AgentLog"("agentName", "action");

-- AddForeignKey
ALTER TABLE "BrandGuideline" ADD CONSTRAINT "BrandGuideline_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandTemplate" ADD CONSTRAINT "BrandTemplate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductService" ADD CONSTRAINT "ProductService_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPlan" ADD CONSTRAINT "ContentPlan_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPlan" ADD CONSTRAINT "ContentPlan_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_contentPlanId_fkey" FOREIGN KEY ("contentPlanId") REFERENCES "ContentPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "BrandTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAsset" ADD CONSTRAINT "ContentAsset_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAsset" ADD CONSTRAINT "ContentAsset_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "ContentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "ContentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostingJob" ADD CONSTRAINT "PostingJob_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostingJob" ADD CONSTRAINT "PostingJob_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "ContentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostingLog" ADD CONSTRAINT "PostingLog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostingLog" ADD CONSTRAINT "PostingLog_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "ContentItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialAccount" ADD CONSTRAINT "SocialAccount_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentLog" ADD CONSTRAINT "AgentLog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentLog" ADD CONSTRAINT "AgentLog_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "ContentItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
