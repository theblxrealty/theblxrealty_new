/*
  Warnings:

  - You are about to drop the column `images` on the `properties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."properties" DROP COLUMN "images",
ADD COLUMN     "additionalImages" TEXT[],
ADD COLUMN     "propertyBanner1" TEXT,
ADD COLUMN     "propertyBanner2" TEXT;

-- CreateTable
CREATE TABLE "public"."saved_properties" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "saved_properties_userId_propertyId_key" ON "public"."saved_properties"("userId", "propertyId");

-- AddForeignKey
ALTER TABLE "public"."saved_properties" ADD CONSTRAINT "saved_properties_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saved_properties" ADD CONSTRAINT "saved_properties_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
