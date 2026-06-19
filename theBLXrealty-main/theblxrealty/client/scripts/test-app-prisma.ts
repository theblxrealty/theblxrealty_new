import { prisma, getPrismaConnectionUrl } from '../lib/prisma'
import { findManyProperties } from '../lib/property-db'

async function main() {
  console.log('Connection:', getPrismaConnectionUrl().slice(0, 40) + '...')
  const total = await prisma.property.count()
  const active = await prisma.property.count({ where: { isActive: true } })
  console.log('prisma.property.count:', { total, active })
  const list = await findManyProperties({ where: { isActive: true }, take: 3 })
  console.log('findManyProperties:', list.length, list.map((p: any) => p.title))
}

main().catch(console.error)
