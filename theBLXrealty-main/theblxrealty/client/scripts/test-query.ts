import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Hardcode the prisma client to test exactly what the api route does
const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  console.log('Testing properties fetch...');
  try {
    const properties = await prisma.property.findMany({
      take: 2,
    });
    console.log('Successfully fetched properties:', properties.length);
    console.log(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
  }

  console.log('Testing blogs fetch...');
  try {
    const blogs = await prisma.blogPost.findMany({
      take: 2,
    });
    console.log('Successfully fetched blogs:', blogs.length);
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }
}

main().catch(console.error).finally(() => process.exit(0));
