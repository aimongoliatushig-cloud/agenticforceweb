ALTER TABLE "BrandTemplate" ADD COLUMN IF NOT EXISTS "createdById" TEXT;
ALTER TABLE "BrandTemplate" ADD COLUMN IF NOT EXISTS "platform" "PostlyPlatform";

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'BrandTemplate_createdById_fkey'
  ) THEN
    ALTER TABLE "BrandTemplate"
      ADD CONSTRAINT "BrandTemplate_createdById_fkey"
      FOREIGN KEY ("createdById") REFERENCES "User"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "BrandTemplate_companyId_platform_idx" ON "BrandTemplate"("companyId", "platform");
