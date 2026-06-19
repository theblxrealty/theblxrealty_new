-- AddColumn priceUnit
-- Add priceUnit column to properties table with safe conditional check

DO $$
BEGIN
  IF NOT EXISTS(
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'properties' 
    AND column_name = 'priceUnit'
  ) THEN
    ALTER TABLE "public"."properties" ADD COLUMN "priceUnit" TEXT NOT NULL DEFAULT 'cr';
  END IF;
END $$;
