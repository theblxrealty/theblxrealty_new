import { prisma } from '../lib/prisma'
import { findManyProperties } from '../lib/property-db'

async function main() {
  const total = await prisma.property.count()
  const active = await prisma.property.count({ where: { isActive: true } })
  console.log('Total properties:', total)
  console.log('Active properties:', active)

  try {
    const list = await findManyProperties({
      where: { isActive: true },
      take: 5,
      includeAdmin: true,
    })
    console.log('findManyProperties:', list.length)
    list.forEach((p: any) => console.log(' -', p.id, p.title, p.priceUnit))
  } catch (e) {
    console.error('findManyProperties failed:', e)
  }

  await prisma.$disconnect()
}

main()
