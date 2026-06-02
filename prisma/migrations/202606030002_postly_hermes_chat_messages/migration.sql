CREATE TABLE IF NOT EXISTS "HermesChatMessage" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "contentItemId" TEXT,
  "sender" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "HermesChatMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "HermesChatMessage_companyId_createdAt_idx"
  ON "HermesChatMessage"("companyId", "createdAt");

CREATE INDEX IF NOT EXISTS "HermesChatMessage_contentItemId_createdAt_idx"
  ON "HermesChatMessage"("contentItemId", "createdAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'HermesChatMessage_companyId_fkey'
  ) THEN
    ALTER TABLE "HermesChatMessage"
      ADD CONSTRAINT "HermesChatMessage_companyId_fkey"
      FOREIGN KEY ("companyId") REFERENCES "CompanyProfile"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'HermesChatMessage_contentItemId_fkey'
  ) THEN
    ALTER TABLE "HermesChatMessage"
      ADD CONSTRAINT "HermesChatMessage_contentItemId_fkey"
      FOREIGN KEY ("contentItemId") REFERENCES "ContentItem"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
