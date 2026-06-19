import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

const propertyDelegate = prisma.property as any

type MissingLegacyColumns = {
  priceUnit: boolean
  availableBhk: boolean
}

function getMissingLegacyColumns(error: unknown): MissingLegacyColumns {
  const message =
    typeof (error as { message?: string })?.message === 'string'
      ? (error as { message: string }).message.toLowerCase()
      : ''

  return {
    priceUnit: message.includes('priceunit'),
    availableBhk: message.includes('availablebhk'),
  }
}

export function isMissingPriceUnitColumnError(error: unknown): boolean {
  const err = error as { code?: string; message?: string }
  const missing = getMissingLegacyColumns(error)
  return (
    err?.code === 'P2022' &&
    typeof err?.message === 'string' &&
    (missing.priceUnit || missing.availableBhk)
  )
}

export function withPriceUnitDefault<T extends Record<string, unknown>>(property: T) {
  return {
    ...property,
    priceUnit: (property as { priceUnit?: string }).priceUnit ?? 'cr',
  }
}

const adminInclude = {
  admin: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
} satisfies Prisma.PropertyInclude

type FindManyArgs = Omit<Prisma.PropertyFindManyArgs, 'include'> & {
  includeAdmin?: boolean
}

type FindUniqueArgs = Omit<Prisma.PropertyFindUniqueArgs, 'include'> & {
  includeAdmin?: boolean
}

const legacyPropertySelect = {
  id: true,
  title: true,
  description: true,
  longDescription: true,
  price: true,
  location: true,
  latitude: true,
  longitude: true,
  propertyType: true,
  bedrooms: true,
  bathrooms: true,
  area: true,
  yearBuilt: true,
  lotSize: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  adminId: true,
  propertyCategory: true,
  additionalImages: true,
  propertyBanner1: true,
  propertyBanner2: true,
  amenities: true,
  ecoFeatures: true,
  nearbyAmenities: true,
  transportation: true,
  priceUnit: true,
  availableBhk: true,
  agentName: true,
  agentPhone: true,
  agentEmail: true,
  agentImage: true,
} as const

function buildFallbackSelect(
  includeAdmin?: boolean,
  missing?: MissingLegacyColumns
) {
  const select = { ...legacyPropertySelect } as Record<string, unknown>

  if (missing?.priceUnit) {
    delete select.priceUnit
  }
  if (missing?.availableBhk) {
    delete select.availableBhk
  }

  if (includeAdmin) {
    select.admin = adminInclude.admin
  }

  return select
}

export async function findManyProperties(args: FindManyArgs) {
  const { includeAdmin, ...rest } = args

  try {
    return await propertyDelegate.findMany({
      ...rest,
      // Always use an explicit select to avoid implicitly selecting
      // columns that may not exist yet in older databases.
      select: buildFallbackSelect(includeAdmin),
    })
  } catch (error) {
    if (!isMissingPriceUnitColumnError(error)) {
      throw error
    }
    const missing = getMissingLegacyColumns(error)
    return propertyDelegate.findMany({
      ...rest,
      select: buildFallbackSelect(includeAdmin, missing),
    })
  }
}

export async function findUniqueProperty(args: FindUniqueArgs) {
  const { includeAdmin, ...rest } = args

  try {
    return await propertyDelegate.findUnique({
      ...rest,
      // Always use an explicit select to avoid implicitly selecting
      // columns that may not exist yet in older databases.
      select: buildFallbackSelect(includeAdmin),
    })
  } catch (error) {
    if (!isMissingPriceUnitColumnError(error)) {
      throw error
    }
    const missing = getMissingLegacyColumns(error)
    return propertyDelegate.findUnique({
      ...rest,
      select: buildFallbackSelect(includeAdmin, missing),
    })
  }
}

async function writeWithLegacyFallback<T>(
  withColumns: () => Promise<T>,
  withoutMissingColumns: (missing: MissingLegacyColumns) => Promise<T>
): Promise<T> {
  try {
    return await withColumns()
  } catch (error) {
    if (!isMissingPriceUnitColumnError(error)) {
      throw error
    }
    return withoutMissingColumns(getMissingLegacyColumns(error))
  }
}

export async function updateProperty(
  args: Omit<Prisma.PropertyUpdateArgs, 'data'> & {
    data: Prisma.PropertyUpdateInput
  }
) {
  const data = args.data as Record<string, unknown>

  return writeWithLegacyFallback(
    () =>
      prisma.property.update({
        ...args,
        data: data as Prisma.PropertyUpdateInput,
      }),
    (missing) => {
      const dataWithoutMissing = { ...data }
      if (missing.priceUnit) {
        delete dataWithoutMissing.priceUnit
      }
      if (missing.availableBhk) {
        delete dataWithoutMissing.availableBhk
      }

      return propertyDelegate.update({
        ...args,
        data: dataWithoutMissing as Prisma.PropertyUpdateInput,
        select: buildFallbackSelect(false, missing),
      })
    }
  )
}

export async function createProperty(
  args: Omit<Prisma.PropertyCreateArgs, 'data'> & {
    data: Prisma.PropertyCreateInput
  }
) {
  const data = args.data as Record<string, unknown>

  return writeWithLegacyFallback(
    () =>
      prisma.property.create({
        ...args,
        data: data as Prisma.PropertyCreateInput,
      }),
    (missing) => {
      const dataWithoutMissing = { ...data }
      if (missing.priceUnit) {
        delete dataWithoutMissing.priceUnit
      }
      if (missing.availableBhk) {
        delete dataWithoutMissing.availableBhk
      }

      return propertyDelegate.create({
        ...args,
        data: dataWithoutMissing as Prisma.PropertyCreateInput,
        select: buildFallbackSelect(false, missing),
      })
    }
  )
}

export async function deleteProperty(
  where: Prisma.PropertyWhereUniqueInput
) {
  return prisma.property.delete({
    where,
    select: { id: true },
  })
}
