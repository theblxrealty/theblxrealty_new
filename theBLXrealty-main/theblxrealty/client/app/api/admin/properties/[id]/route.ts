import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  deleteProperty,
  findUniqueProperty,
  updateProperty,
  withPriceUnitDefault,
} from '@/lib/property-db'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

const toNullableNumber = (value: unknown) => {
  if (value === undefined) return undefined
  if (value === null || value === '') return null
  if (typeof value === 'number') return Number.isNaN(value) ? null : value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
}

const toNullableInt = (value: unknown) => {
  const normalized = toNullableNumber(value)
  if (normalized === undefined || normalized === null) return normalized
  return Math.trunc(normalized)
}

// Middleware to verify admin token
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

const PropertyUpdateSchema = z.object({
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  longDescription: z.string().optional().nullable(),
  price: z.union([z.number(), z.null(), z.string()]).optional(),
  priceUnit: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  latitude: z.union([z.number(), z.null(), z.string()]).optional(),
  longitude: z.union([z.number(), z.null(), z.string()]).optional(),
  propertyType: z.string().optional().nullable(),
  propertyCategory: z.string().optional().nullable(),
  bedrooms: z.union([z.number(), z.null(), z.string()]).optional(),
  bathrooms: z.union([z.number(), z.null(), z.string()]).optional(),
  area: z.union([z.number(), z.null(), z.string()]).optional(),
  availableBhk: z.string().optional().nullable(),
  yearBuilt: z.union([z.number(), z.null(), z.string()]).optional(),
  lotSize: z.string().optional().nullable(),
  amenities: z.array(z.string()).optional(),
  ecoFeatures: z.array(z.string()).optional(),
  agentName: z.string().optional().nullable(),
  agentPhone: z.string().optional().nullable(),
  agentEmail: z.string().optional().nullable(),
  agentImage: z.string().optional().nullable(),
  nearbyAmenities: z.any().optional().nullable(),
  transportation: z.any().optional().nullable(),
  propertyBanner1: z.string().optional().nullable(),
  propertyBanner2: z.string().optional().nullable(),
  images: z.array(z.any()).optional(),
  additionalImages: z.array(z.any()).optional(),
  isActive: z.boolean().optional(),
}).passthrough()

// GET - Get single property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const property = await findUniqueProperty({
      where: { id },
      includeAdmin: true,
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Transform property to include images array
    const images = []
    if (property.propertyBanner1) images.push(property.propertyBanner1)
    if (property.propertyBanner2) images.push(property.propertyBanner2)
    if (property.additionalImages && property.additionalImages.length > 0) {
      images.push(...property.additionalImages)
    }
    if (images.length === 0) images.push('/placeholder.svg')

    return NextResponse.json({
      ...withPriceUnitDefault(property),
      images,
    })

  } catch (error) {
    console.error('Get property error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update property
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    console.log("Received body:", JSON.stringify(body, null, 2))

    const validatedData = PropertyUpdateSchema.safeParse(body)
    if (!validatedData.success) {
      console.error("Validation Error:", JSON.stringify(validatedData.error.errors, null, 2))
      console.error("Received body was:", JSON.stringify(body, null, 2))
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: validatedData.error.errors,
          receivedBody: body
        },
        { status: 400 }
      )
    }

    const { 
      title, 
      description, 
      longDescription, 
      price, 
      priceUnit,
      location, 
      latitude, 
      longitude, 
      propertyType, 
      propertyCategory, 
      bedrooms, 
      bathrooms, 
      area, 
      availableBhk,
      yearBuilt, 
      lotSize, 
      amenities, 
      ecoFeatures, 
      agentName, 
      agentPhone, 
      agentEmail, 
      agentImage, 
      nearbyAmenities, 
      transportation, 
      propertyBanner1, 
      propertyBanner2, 
      images,
      additionalImages,
      isActive 
    } = validatedData.data

    // Check if property exists
    const existingProperty = await findUniqueProperty({
      where: { id },
    })

    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Build update data, filtering out undefined values
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (longDescription !== undefined) updateData.longDescription = longDescription
    if (price !== undefined) updateData.price = toNullableNumber(price)
    if (priceUnit !== undefined) updateData.priceUnit = priceUnit
    if (location !== undefined) updateData.location = location
    if (latitude !== undefined) updateData.latitude = toNullableNumber(latitude)
    if (longitude !== undefined) updateData.longitude = toNullableNumber(longitude)
    if (propertyType !== undefined) updateData.propertyType = propertyType
    if (propertyCategory !== undefined) updateData.propertyCategory = propertyCategory
    if (bedrooms !== undefined) updateData.bedrooms = toNullableInt(bedrooms)
    if (bathrooms !== undefined) updateData.bathrooms = toNullableInt(bathrooms)
    if (area !== undefined) updateData.area = toNullableNumber(area)
    if (availableBhk !== undefined) updateData.availableBhk = availableBhk
    if (yearBuilt !== undefined) updateData.yearBuilt = toNullableInt(yearBuilt)
    if (lotSize !== undefined) updateData.lotSize = lotSize
    if (amenities !== undefined) updateData.amenities = amenities
    if (ecoFeatures !== undefined) updateData.ecoFeatures = ecoFeatures
    if (agentName !== undefined) updateData.agentName = agentName
    if (agentPhone !== undefined) updateData.agentPhone = agentPhone
    if (agentEmail !== undefined) updateData.agentEmail = agentEmail
    if (agentImage !== undefined) updateData.agentImage = agentImage
    if (nearbyAmenities !== undefined) updateData.nearbyAmenities = nearbyAmenities
    if (transportation !== undefined) updateData.transportation = transportation
    if (propertyBanner1 !== undefined) updateData.propertyBanner1 = propertyBanner1
    if (propertyBanner2 !== undefined) updateData.propertyBanner2 = propertyBanner2
    if (additionalImages !== undefined || images !== undefined) {
      updateData.additionalImages = additionalImages || images || []
    }
    if (isActive !== undefined) updateData.isActive = isActive

    await updateProperty({
      where: { id },
      data: updateData,
    })

    const propertyWithAdmin = await findUniqueProperty({
      where: { id },
      includeAdmin: true,
    })

    return NextResponse.json({
      message: 'Property updated successfully',
      property: propertyWithAdmin
        ? withPriceUnitDefault(propertyWithAdmin)
        : null,
    })

  } catch (error) {
    console.error('Update property error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    
    // Check if property exists
    const property = await findUniqueProperty({
      where: { id },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Delete the property
    await deleteProperty({ id })

    return NextResponse.json({
      message: 'Property deleted successfully'
    })

  } catch (error) {
    console.error('Delete property error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
