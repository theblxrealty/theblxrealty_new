import { config } from 'dotenv'
import { resolve } from 'path'
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

config({ path: resolve(process.cwd(), '.env') })
config({ path: resolve(process.cwd(), '.env.local'), override: true })

function normalizeEnvUrl(url: string | undefined): string | undefined {
  if (!url) return url
  let value = url.trim().replace(/^["']|["']$/g, '')
  if (value.startsWith('@')) value = value.slice(1)
  return value
}

function isAccelerateUrl(url: string): boolean {
  return url.startsWith('prisma://') || url.startsWith('prisma+')
}

/**
 * Runtime DB for properties, blogs, careers:
 * - Prisma Accelerate (prisma://) = where your live data is today
 * - postgresql:// Supabase = empty until you migrate; used via DIRECT_URL for migrations
 */
export function getPrismaConnectionUrl(): string {
  const databaseUrl = normalizeEnvUrl(process.env.DATABASE_URL) || ''

  if (isAccelerateUrl(databaseUrl)) {
    return databaseUrl
  }

  const directUrl = normalizeEnvUrl(process.env.DIRECT_URL) || ''
  if (directUrl.startsWith('postgresql://') || directUrl.startsWith('postgres://')) {
    return directUrl
  }

  return databaseUrl
}

const prismaClientSingleton = () => {
  const databaseUrl = normalizeEnvUrl(process.env.DATABASE_URL) || ''

  if (isAccelerateUrl(databaseUrl)) {
    return new PrismaClient().$extends(withAccelerate()) as unknown as PrismaClient
  }

  const connectionUrl = getPrismaConnectionUrl()
  return new PrismaClient({
    datasources: {
      db: { url: connectionUrl },
    },
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
