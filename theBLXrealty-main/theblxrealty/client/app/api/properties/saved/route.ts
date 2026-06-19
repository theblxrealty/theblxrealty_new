import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { withPriceUnitDefault } from '@/lib/property-db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get saved properties for the user
    const savedProperties = await prisma.savedProperty.findMany({
      where: {
        userId: (session.user as any).id
      },
      include: {
        property: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match the expected format
    const transformedProperties = savedProperties.map((saved) => {
      const property = withPriceUnitDefault(saved.property)
      return {
      id: property.id,
      title: property.title,
      description: property.description || "",
      location: property.location || "Location not specified",
      price: property.price || 0,
      priceUnit: property.priceUnit,
      propertyRef: property.id.slice(-8).toUpperCase(),
      coordinates: { lat: 12.9716, lng: 77.5946 }, // Default coordinates
      
      // Combine all images: banner1, banner2, and additional images
      images: (() => {
        const allImages: string[] = []
        
        // Add banner images first (these are the main showcase images)
        if (property.propertyBanner1) {
          allImages.push(property.propertyBanner1)
        }
        if (property.propertyBanner2) {
          allImages.push(property.propertyBanner2)
        }
        
        // Add additional images
        if (property.additionalImages && property.additionalImages.length > 0) {
          allImages.push(...property.additionalImages)
        }
        
        // If no images at all, use placeholder
        if (allImages.length === 0) {
          allImages.push("/placeholder.svg?height=600&width=800")
        }
        
        return allImages
      })(),
      
      beds: property.bedrooms || undefined,
      baths: property.bathrooms || undefined,
      sqft: property.area || 0,
      type: property.propertyType || "residential",
      propertyCategory: property.propertyCategory || "flats",
      isActive: property.isActive,
      savedAt: saved.createdAt,
    }
    })

    return NextResponse.json({ 
      properties: transformedProperties,
      count: transformedProperties.length
    })
  } catch (error) {
    console.warn('Error fetching saved properties:', error)
    return NextResponse.json({
      properties: [],
      count: 0,
      fallback: true
    })
  }
}
