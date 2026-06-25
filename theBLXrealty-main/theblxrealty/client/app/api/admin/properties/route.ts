import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { findManyProperties, withPriceUnitDefault } from '@/lib/property-db'
import { verifyToken } from '@/lib/auth'

const verifyAdminToken = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)

  if (!decoded || decoded.type !== 'admin') {
    return null
  }

  return decoded
}

export async function GET(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const skip = (page - 1) * limit

    const [properties, total] = await Promise.all([
      findManyProperties({
        includeAdmin: true,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.property.count(),
    ])

    const transformedProperties = properties.map((property: any) => {
      const images: string[] = []

      if (property.propertyBanner1) images.push(property.propertyBanner1)
      if (property.propertyBanner2) images.push(property.propertyBanner2)
      if (property.additionalImages?.length) {
        images.push(...property.additionalImages)
      }
      if (images.length === 0) images.push('/placeholder.svg')

      return { ...withPriceUnitDefault(property), images }
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
    console.error('Get properties error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
