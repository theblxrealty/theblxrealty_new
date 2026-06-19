import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

async function main() {
  console.log('Resolving missing priceUnit column...');
  // Initialize with the protocol that the terminal test worked with
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  }).$extends(withAccelerate());

  try {
    console.log('Executing raw SQL to add priceUnit column...');
    await prisma.$executeRawUnsafe(`
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
    `);
    console.log('✅ Column priceUnit added successfully (if it did not exist).');

    // Test the fetch again
    const properties = await (prisma as any).property.findMany({ take: 1 });
    console.log(`✅ Success! Fetched ${properties.length} properties.`);

  } catch (error) {
    console.error('❌ Error executing SQL:', error);
  } finally {
    process.exit(0);
  }
}

main();