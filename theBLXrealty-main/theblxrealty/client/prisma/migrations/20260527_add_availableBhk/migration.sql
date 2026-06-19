-- Prisma migration: add availableBhk column to properties
-- Run: `npx prisma migrate deploy` or apply the SQL directly

ALTER TABLE "properties"
ADD COLUMN IF NOT EXISTS "availableBhk" text;
