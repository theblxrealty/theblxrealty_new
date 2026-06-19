import { config } from 'dotenv'
import { resolve } from 'path'
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

const ACCELERATE_URL =
  process.env.PRISMA_ACCELERATE_URL ||
  'prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza18yU2ZYZjQ1eDlGTXZhaG5iYjN6clIiLCJhcGlfa2V5IjoiMDFLNEc5NjhNNTY3TlBUTkZNNjVNQ0RETkUiLCJ0ZW5hbnRfaWQiOiIyZjU5ZjM0YTg2ODYwMzg0OTE5MGRjOTc1OTVmNjM5ZDY5N2NlMmZjNzgzZTBjOGE5NGZjNmI2ZDE0Mjc1YWFkIiwiaW50ZXJuYWxfc2VjcmV0IjoiOGYxM2MyOTgtMWVhOC00NzcxLTg5YzctN2RkMjRlMGRhOTY0In0.k80-Qi71ANrmmoIMBxZn74FhQtUwYFA3uitp9Dtg2sM'

async function counts(label: string, prisma: PrismaClient) {
  try {
    const [properties, blogs, careers] = await Promise.all([
      prisma.property.count(),
      prisma.blogPost.count(),
      prisma.careerPosting.count(),
    ])
    console.log(`${label}: properties=${properties}, blogs=${blogs}, careers=${careers}`)
  } catch (e) {
    console.log(`${label}: ERROR`, (e as Error).message)
  } finally {
    await prisma.$disconnect()
  }
}

async function main() {
  const supabaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL
  if (supabaseUrl?.startsWith('postgresql')) {
    const supa = new PrismaClient({ datasources: { db: { url: supabaseUrl } } })
    await counts('Supabase Postgres', supa)
  }

  const accel = new PrismaClient({
    datasources: { db: { url: ACCELERATE_URL } },
  }).$extends(withAccelerate()) as unknown as PrismaClient
  await counts('Prisma Accelerate (your live data)', accel)
}

main()
