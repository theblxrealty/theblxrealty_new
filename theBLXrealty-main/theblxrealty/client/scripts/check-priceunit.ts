import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const rows: any = await prisma.$queryRawUnsafe(`SELECT id, "priceUnit" FROM properties LIMIT 10;`);
    console.log('Sample rows (id, priceUnit):');
    console.log(JSON.stringify(rows, null, 2));

    const cnt: any = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS count FROM properties;`);
    console.log('Total properties rows:', cnt[0]?.count ?? cnt);
  } catch (e) {
    console.error('Error querying priceUnit:', e);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
