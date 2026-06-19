import { NextRequest, NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { findManyProperties, withPriceUnitDefault } from '@/lib/property-db'
import { getSupabaseImageUrl } from '@/lib/utils'

// GET - Get all properties with search functionality
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const bedrooms = searchParams.get('bedrooms')
    const exclude = searchParams.get('exclude')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const whereClause: Prisma.PropertyWhereInput = {
      isActive: true,
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { propertyType: { contains: search, mode: 'insensitive' } },
        { propertyCategory: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (type && type !== 'any') {
      const normalizedType = type.toLowerCase().trim()
      const typeConditions = [
        { propertyCategory: normalizedType },
        {
          propertyCategory: {
            contains: normalizedType,
            mode: 'insensitive' as const,
          },
        },
      ]

      if (whereClause.OR) {
        whereClause.AND = [{ OR: whereClause.OR }, { OR: typeConditions }]
        delete whereClause.OR
      } else {
        whereClause.OR = typeConditions
      }
    }

    if (bedrooms && bedrooms !== 'any') {
      whereClause.bedrooms = { gte: parseInt(bedrooms) }
    }

    if (exclude) {
      whereClause.NOT = { id: exclude }
    }

    const [properties, total] = await Promise.all([
      findManyProperties({
        where: whereClause,
        includeAdmin: true,
        orderBy: [{ propertyCategory: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.property.count({ where: whereClause }),
    ])

    const transformedProperties = properties.map((property: any) => {
      const images: string[] = []

      if (property.propertyBanner1) {
        images.push(getSupabaseImageUrl(property.propertyBanner1))
      }
      if (property.propertyBanner2) {
        images.push(getSupabaseImageUrl(property.propertyBanner2))
      }
      if (property.additionalImages?.length) {
        images.push(
          ...property.additionalImages.map((img: string) => getSupabaseImageUrl(img))
        )
      }
      if (images.length === 0) {
        images.push('/placeholder.svg')
      }

      return {
        ...withPriceUnitDefault(property),
        images,
        sqft: property.area || 0,
        beds: property.bedrooms,
        baths: property.bathrooms,
        type: property.propertyCategory,
        // Do NOT rely on DB column `availableBhk` (may not exist yet in production).
        // If it exists, use it; otherwise fall back to `bedrooms` (single BHK value).
        availableBhk:
          (property as { availableBhk?: string | null }).availableBhk ??
          (typeof property.bedrooms === 'number' && property.bedrooms > 0
            ? String(property.bedrooms)
            : null),
      }
    })

    return NextResponse.json({
      properties: transformedProperties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.warn('Get properties error:', error)
    return NextResponse.json({
      properties: [],
      pagination: {
        page: 1,
        limit: 100,
        total: 0,
        totalPages: 0,
      },
      fallback: true
    })
  }
}
