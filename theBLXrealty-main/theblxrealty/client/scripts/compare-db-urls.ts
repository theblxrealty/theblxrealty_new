import { config } from 'dotenv'
import { resolve } from 'path'
import { PrismaClient } from '@prisma/client'

config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

async function countWith(label: string, url: string | undefined) {
  if (!url) {
    console.log(`${label}: (not set)`)
    return
  }
  const prisma = new PrismaClient({ datasources: { db: { url } } })
  try {
    const total = await prisma.property.count()
    const active = await prisma.property.count({ where: { isActive: true } })
    console.log(`${label}: total=${total}, active=${active}`)
  } catch (e) {
    console.log(`${label}: ERROR`, (e as Error).message)
  } finally {
    await prisma.$disconnect()
  }
}

async function main() {
  const { getPrismaConnectionUrl } = await import('../lib/prisma')
  await countWith('DATABASE_URL (6543)', process.env.DATABASE_URL)
  await countWith('DIRECT_URL (5432)', process.env.DIRECT_URL)
  await countWith('App (getPrismaConnectionUrl)', getPrismaConnectionUrl())
}

main()
