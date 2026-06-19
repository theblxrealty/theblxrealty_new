/*
  Warnings:

  - Added the required column `propertyCategory` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- Step 1: Add the column with a default value
ALTER TABLE "public"."properties" ADD COLUMN "propertyCategory" TEXT DEFAULT 'residential';

-- Step 2: Update existing records based on their propertyType
UPDATE "public"."properties" 
SET "propertyCategory" = CASE 
  WHEN "propertyType" = 'luxury-villas' THEN 'luxury villas'
  WHEN "propertyType" = 'apartments' THEN 'flats'
  WHEN "propertyType" = 'commercial' THEN 'commercial'
  WHEN "propertyType" = 'farm-land' THEN 'farm house'
  WHEN "propertyType" = 'residential' THEN 'flats'
  ELSE 'flats'
END;

-- Step 3: Make the column required
ALTER TABLE "public"."properties" ALTER COLUMN "propertyCategory" SET NOT NULL;
ALTER TABLE "public"."properties" ALTER COLUMN "propertyCategory" DROP DEFAULT;
