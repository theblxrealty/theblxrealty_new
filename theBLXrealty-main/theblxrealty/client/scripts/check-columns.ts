import { PrismaClient } from '@prisma/client';

async function main() {
  console.log('Connecting to database...');
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  try {
    console.log('Checking if properties table exists and listing columns...');
    const result: any[] = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'properties';
    `);
    
    console.log('Columns in properties table:');
    result.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}`);
    });

    const hasPriceUnit = result.some(r => r.column_name === 'priceUnit');
    console.log(`\nHas priceUnit column? ${hasPriceUnit}`);

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();