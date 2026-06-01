-- CreateTable
CREATE TABLE "MakeIntegration" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "webhookUrl" TEXT,
    "webhookSecretHint" TEXT,
    "scenarioName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MakeIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MakeIntegration_companyId_key" ON "MakeIntegration"("companyId");

-- AddForeignKey
ALTER TABLE "MakeIntegration" ADD CONSTRAINT "MakeIntegration_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
