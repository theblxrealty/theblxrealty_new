"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import PropertyCard from "@/components/property-card"

interface Property {
  id: string
  title: string
  location: string
  images: string[]
  beds?: number
  baths?: number
  sqft: number
  amenities?: string[]
  isNew?: boolean
  featured?: boolean
  type: string
  rating?: number
  price?: number
  priceUnit?: string
  priceRange?: string
  development?: boolean
  availableBhk?: string
}

interface SimilarPropertiesProps {
  currentPropertyId: string
  currentPropertyType?: string
  currentPropertyLocation?: string
}

export default function SimilarProperties({ 
  currentPropertyId, 
  currentPropertyType, 
  currentPropertyLocation 
}: SimilarPropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleProperties, setVisibleProperties] = useState<Property[]>([])
  const [startIndex, setStartIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(1) // Show only 1 property at a time

  // Fetch similar properties from the database
  useEffect(() => {
    const fetchSimilarProperties = async () => {
      setLoading(true)
      try {
        // Build query parameters to find similar properties
        const params = new URLSearchParams()
        
        // Use the correct property type for filtering
        if (currentPropertyType && currentPropertyType !== 'any') {
          // For residential properties, include both residential and apartments
          if (currentPropertyType === 'residential') {
            params.append('type', 'residential')
          } else {
            params.append('type', currentPropertyType)
          }
        }
        
        // Add location-based search for better similarity
        if (currentPropertyLocation) {
          // Extract city/area name from location (e.g., "Mumbai, Maharashtra" -> "Mumbai")
          const cityName = currentPropertyLocation.split(',')[0].trim()
          if (cityName) {
            params.append('search', cityName)
          }
        }
        
        params.append('limit', '15') // Get more properties to choose from
        params.append('exclude', currentPropertyId) // Exclude current property

        console.log('Fetching similar properties with params:', params.toString())
        console.log('Current property type:', currentPropertyType)
        console.log('Current property location:', currentPropertyLocation)
        console.log('Current property ID:', currentPropertyId)
        console.log('API URL:', `/api/properties?${params.toString()}`)

        const response = await fetch(`/api/properties?${params.toString()}`)
        const data = await response.json()

        console.log('Similar properties API response:', data)
        console.log('Response status:', response.status)
        console.log('Response headers:', Object.fromEntries(response.headers.entries()))
        console.log('Properties count in response:', data.properties?.length || 0)

        if (data.properties && Array.isArray(data.properties)) {
          // Transform the properties to match our interface
          const transformedProperties = data.properties
            .filter((p: any) => p.id && p.id !== currentPropertyId) // Double-check exclusion and ensure id exists
            .map((property: any) => ({
              id: property.id,
              title: property.title || "Property",
              location: property.location || "Location not specified",
              images: property.images || ["/placeholder.svg"],
              beds: property.bedrooms || undefined, // Only set if bedrooms exist
              baths: property.bathrooms || undefined, // Only set if bathrooms exist
              sqft: property.area || 0,
              amenities: ["Security", "Parking", "Power Backup"], // Default amenities
              isNew: true,
              featured: true,
              type: property.propertyCategory || property.propertyType || "residential",
              rating: 4.8,
              price: property.price ?? undefined,
              priceUnit: property.priceUnit ?? undefined,
              development: true,
                availableBhk: property.availableBhk
            }))
            .slice(0, 12) // Limit to 12 properties max

          console.log('Transformed similar properties:', transformedProperties)
          
          // If we found similar properties, use them
          if (transformedProperties.length > 0) {
            setProperties(transformedProperties)
          } else {
            // Fallback: try to get any properties (excluding current one)
            console.log('No similar properties found, trying fallback...')
            const fallbackParams = new URLSearchParams()
            fallbackParams.append('limit', '12')
            fallbackParams.append('exclude', currentPropertyId)
            
            try {
              const fallbackResponse = await fetch(`/api/properties?${fallbackParams.toString()}`)
              const fallbackData = await fallbackResponse.json()
              
              if (fallbackData.properties && Array.isArray(fallbackData.properties)) {
                const fallbackProperties = fallbackData.properties
                  .filter((p: any) => p.id && p.id !== currentPropertyId)
                  .map((property: any) => ({
                    id: property.id,
                    title: property.title || "Property",
                    location: property.location || "Location not specified",
                    images: property.images || ["/placeholder.svg"],
                    beds: property.bedrooms || undefined, // Only set if bedrooms exist
                    baths: property.bathrooms || undefined, // Only set if bathrooms exist
                    sqft: property.area || 0,
                    amenities: ["Security", "Parking", "Power Backup"],
                    isNew: true,
                    featured: true,
                    type: property.propertyCategory || property.propertyType || "residential",
                    rating: 4.8,
                    price: property.price ?? undefined,
                    priceUnit: property.priceUnit ?? undefined,
                    development: true,
                    availableBhk: property.availableBhk
                  }))
                  .slice(0, 12)
                
                console.log('Fallback properties found:', fallbackProperties.length)
                setProperties(fallbackProperties)
              } else {
                setProperties([])
              }
            } catch (fallbackError) {
              console.warn('Fallback fetch error:', fallbackError)
              setProperties([])
            }
          }
        } else {
          console.log('No properties found in API response')
          setProperties([])
        }
      } catch (error) {
        console.warn('Error fetching similar properties:', error)
        // Fallback to empty array
        setProperties([])
      } finally {
        setLoading(false)
      }
    }

    if (currentPropertyId) {
      fetchSimilarProperties()
    }
  }, [currentPropertyId, currentPropertyType, currentPropertyLocation])

  useEffect(() => {
    // Update visible count based on screen size - always show 1 per row for better UI
    const handleResize = () => {
      setVisibleCount(1) // Always show 1 property per row
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    // Update visible properties when startIndex or visibleCount changes
    setVisibleProperties(properties.slice(startIndex, startIndex + visibleCount))
  }, [startIndex, visibleCount, properties])

  const nextProperties = () => {
    const newStartIndex = (startIndex + visibleCount) % properties.length
    setStartIndex(newStartIndex)
  }

  const prevProperties = () => {
    const newStartIndex = (startIndex - visibleCount + properties.length) % properties.length
    setStartIndex(newStartIndex)
  }

  // Don't show navigation if we have 1 or fewer properties
  const showNavigation = properties.length > 1

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
          <div className="space-y-2">
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            <div className="bg-gray-200 h-4 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No similar properties found at the moment.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {showNavigation && (
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevProperties}
              className="h-9 w-9"
              aria-label="Previous properties"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextProperties}
              className="h-9 w-9"
              aria-label="Next properties"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {visibleProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  )
}
