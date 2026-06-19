import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createProperty, findUniqueProperty, withPriceUnitDefault } from '@/lib/property-db'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization')
    const cookieToken = request.cookies.get('token')?.value
    
    const token = authHeader?.replace('Bearer ', '') || cookieToken
    
    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.type !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
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
      yearBuilt,
      lotSize,
      amenities,
      ecoFeatures,
      agentName,
      agentPhone,
      agentEmail,
      agentImage,
      // Individual amenity fields
      shoppingCentersDistance,
      schoolsDistance,
      hospitalsDistance,
      parksDistance,
      publicTransportDistance,
      // Individual transportation fields
      busStopTime,
      metroStationTime,
      airportTime,
      highwayAccessTime,
      // Legacy fields (for backward compatibility)
      nearbyAmenities,
      transportation,
      propertyBanner1,
      propertyBanner2,
      additionalImages
    } = body

    // Build nearby amenities object from individual fields or use legacy data
    let nearbyAmenitiesJson = nearbyAmenities || {}
    if (shoppingCentersDistance?.trim()) nearbyAmenitiesJson["Shopping Centers"] = shoppingCentersDistance.trim()
    if (schoolsDistance?.trim()) nearbyAmenitiesJson["Schools"] = schoolsDistance.trim()
    if (hospitalsDistance?.trim()) nearbyAmenitiesJson["Hospitals"] = hospitalsDistance.trim()
    if (parksDistance?.trim()) nearbyAmenitiesJson["Parks"] = parksDistance.trim()
    if (publicTransportDistance?.trim()) nearbyAmenitiesJson["Public Transport"] = publicTransportDistance.trim()

    // Build transportation object from individual fields or use legacy data
    let transportationJson = transportation || {}
    if (busStopTime?.trim()) transportationJson["Bus Stop"] = busStopTime.trim()
    if (metroStationTime?.trim()) transportationJson["Metro Station"] = metroStationTime.trim()
    if (airportTime?.trim()) transportationJson["Airport"] = airportTime.trim()
    if (highwayAccessTime?.trim()) transportationJson["Highway Access"] = highwayAccessTime.trim()

    console.log('Built nearbyAmenities:', nearbyAmenitiesJson)
    console.log('Built transportation:', transportationJson)

    // Validate required fields
    if (!title || !propertyCategory) {
      return NextResponse.json(
        { error: 'Title and property category are required' },
        { status: 400 }
      )
    }

    // Create property in database
    const property = await createProperty({
      data: {
        title: title.trim(),
        description: description?.trim(),
        longDescription: longDescription?.trim(),
        price: price ? parseFloat(price) : null,
        priceUnit: priceUnit || "cr",
        location: location?.trim(),
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        propertyType: propertyType?.trim(),
        propertyCategory: propertyCategory.trim(),
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        area: area ? parseFloat(area) : null,
        yearBuilt: yearBuilt ? parseInt(yearBuilt) : null,
        lotSize: lotSize?.trim(),
        amenities: amenities || [],
        ecoFeatures: ecoFeatures || [],
        agentName: agentName?.trim(),
        agentPhone: agentPhone?.trim(),
        agentEmail: agentEmail?.trim(),
        agentImage: agentImage?.trim(),
        nearbyAmenities: Object.keys(nearbyAmenitiesJson).length > 0 ? nearbyAmenitiesJson : null,
        transportation: Object.keys(transportationJson).length > 0 ? transportationJson : null,
        propertyBanner1: propertyBanner1,
        propertyBanner2: propertyBanner2,
        additionalImages: additionalImages || [],
        admin: decoded.id ? { connect: { id: decoded.id } } : undefined,
        isActive: true,
      },
    })

    const propertyWithAdmin = await findUniqueProperty({
      where: { id: property.id },
      includeAdmin: true,
    })

    return NextResponse.json({
      success: true,
      property: propertyWithAdmin
        ? withPriceUnitDefault(propertyWithAdmin)
        : { id: property.id },
      message: 'Property created successfully',
    })

  } catch (error) {
    console.error('Add property error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
