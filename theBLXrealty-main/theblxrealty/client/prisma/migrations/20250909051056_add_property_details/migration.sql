-- AlterTable
ALTER TABLE "public"."properties" ADD COLUMN     "agentEmail" TEXT,
ADD COLUMN     "agentImage" TEXT,
ADD COLUMN     "agentName" TEXT,
ADD COLUMN     "agentPhone" TEXT,
ADD COLUMN     "amenities" TEXT[],
ADD COLUMN     "ecoFeatures" TEXT[],
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "lotSize" TEXT,
ADD COLUMN     "nearbyAmenities" JSONB,
ADD COLUMN     "transportation" JSONB,
ADD COLUMN     "yearBuilt" INTEGER;
