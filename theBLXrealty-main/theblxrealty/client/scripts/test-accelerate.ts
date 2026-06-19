import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

async function main() {
  console.log('Connecting to Accelerate database...');
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza18yU2ZYZjQ1eDlGTXZhaG5iYjN6clIiLCJhcGlfa2V5IjoiMDFLNEc5NjhNNTY3TlBUTkZNNjVNQ0RETkUiLCJ0ZW5hbnRfaWQiOiIyZjU5ZjM0YTg2ODYwMzg0OTE5MGRjOTc1OTVmNjM5ZDY5N2NlMmZjNzgzZTBjOGE5NGZjNmI2ZDE0Mjc1YWFkIiwiaW50ZXJuYWxfc2VjcmV0IjoiOGYxM2MyOTgtMWVhOC00NzcxLTg5YzctN2RkMjRlMGRhOTY0In0.k80-Qi71ANrmmoIMBxZn74FhQtUwYFA3uitp9Dtg2sM"
      }
    }
  }).$extends(withAccelerate());

  try {
    console.log('Testing properties fetch via Accelerate...');
    // Type casting to bypass TS strict mode in this test script
    const properties = await (prisma as any).property.findMany({ take: 1 });
    console.log('Properties fetched successfully via accelerate!');
  } catch (error) {
    console.error('❌ Accelerate Error:', error);
  } finally {
    process.exit(0);
  }
}

main();