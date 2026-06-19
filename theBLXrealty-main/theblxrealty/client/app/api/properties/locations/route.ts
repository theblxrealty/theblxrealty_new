import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get unique property locations
export async function GET(request: NextRequest) {
  try {
    // Fetch all active properties and get unique locations
    const properties = await prisma.property.findMany({
      where: {
        isActive: true,
        location: {
          not: null
        }
      },
      select: {
        location: true
      },
      distinct: ['location'],
      take: 10 // Limit to 10 most recent unique locations
    })

    // Extract and clean the locations
    const locations = properties
      .map(p => p.location)
      .filter((location): location is string => location !== null && location.trim() !== '')
      .slice(0, 6) // Get top 6 locations

    return NextResponse.json({
      success: true,
      locations
    })
  } catch (error) {
    console.warn('Error fetching locations:', error)
    return NextResponse.json({
      success: true,
      locations: [
        "Whitefield",
        "Electronic City",
        "Yelahanka",
        "Koramangala",
        "HSR Layout",
        "Lavelle Road"
      ],
      fallback: true
    })
  }
}
