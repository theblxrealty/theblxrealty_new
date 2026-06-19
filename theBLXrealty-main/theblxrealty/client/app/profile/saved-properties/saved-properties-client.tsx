"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, Bed, Bath, Square, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface SavedProperty {
  id: string
  createdAt: Date
  property: {
    id: string
    title: string
    description: string | null
    price: number | null
    location: string | null
    propertyType: string | null
    propertyCategory: string
    bedrooms: number | null
    bathrooms: number | null
    area: number | null
    propertyBanner1: string | null
    propertyBanner2: string | null
    additionalImages: string[]
    createdAt: Date
  }
}

interface SavedPropertiesClientProps {
  savedProperties: SavedProperty[]
}

export default function SavedPropertiesClient({ savedProperties }: SavedPropertiesClientProps) {
  const [properties, setProperties] = useState(savedProperties)
  const { toast } = useToast()

  const handleRemoveProperty = async (savedPropertyId: string, propertyTitle: string) => {
    try {
      const response = await fetch('/api/properties/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          propertyId: properties.find(sp => sp.id === savedPropertyId)?.property.id 
        }),
      })

      if (response.ok) {
        setProperties(prev => prev.filter(sp => sp.id !== savedPropertyId))
        toast({
          title: "Property Removed",
          description: `${propertyTitle} has been removed from your saved properties`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to remove property. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.warn('Error removing property:', error)
      toast({
        title: "Error",
        description: "Failed to remove property. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatPrice = (price: number | null) => {
    if (!price) return "Price on Application"
    return `INR ${(price / 10000000).toFixed(1)} Cr`
  }

  const getPropertyImage = (property: SavedProperty['property']) => {
    if (property.propertyBanner1) return property.propertyBanner1
    if (property.propertyBanner2) return property.propertyBanner2
    if (property.additionalImages && property.additionalImages.length > 0) {
      return property.additionalImages[0]
    }
    return "/placeholder.svg"
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4 font-['Tiempos_Headline',serif]">
                No Saved Properties Yet
              </h1>
              <p className="text-lg text-gray-600 mb-8 font-['Suisse_Intl',sans-serif]">
                Start exploring properties and save the ones you like to view them later.
              </p>
            </div>
            <Link href="/properties">
              <Button size="lg" className="bg-[#011337] hover:bg-[#011337]/90">
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/profile" 
            className="text-[#011337] hover:text-[#011337]/70 flex items-center mb-6 font-['Suisse_Intl',sans-serif]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-['Tiempos_Headline',serif]">
            Saved Properties
          </h1>
          <p className="text-lg text-gray-600 font-['Suisse_Intl',sans-serif]">
            You have {properties.length} saved propert{properties.length === 1 ? 'y' : 'ies'}
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((savedProperty) => (
            <div 
              key={savedProperty.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Property Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={getPropertyImage(savedProperty.property)}
                  alt={savedProperty.property.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Button
                    onClick={() => handleRemoveProperty(savedProperty.id, savedProperty.property.title)}
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Tiempos_Headline',serif] line-clamp-2">
                  {savedProperty.property.title}
                </h3>
                
                <p className="text-2xl font-bold text-[#011337] mb-3 font-['Tiempos_Headline',serif]">
                  {formatPrice(savedProperty.property.price)}
                </p>

                <div className="flex items-center text-gray-600 mb-3 font-['Suisse_Intl',sans-serif]">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{savedProperty.property.location}</span>
                </div>

                {/* Property Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 font-['Suisse_Intl',sans-serif]">
                  {savedProperty.property.bedrooms && (
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span>{savedProperty.property.bedrooms}</span>
                    </div>
                  )}
                  {savedProperty.property.bathrooms && (
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span>{savedProperty.property.bathrooms}</span>
                    </div>
                  )}
                  {savedProperty.property.area && (
                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      <span>{savedProperty.property.area} sq ft</span>
                    </div>
                  )}
                </div>

                {/* Property Type */}
                <div className="mb-4">
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium font-['Suisse_Intl',sans-serif]">
                    {savedProperty.property.propertyCategory === 'luxury villas' ? 'Luxury Villa' : 
                     savedProperty.property.propertyCategory === 'flats' ? 'Apartment' : 
                     savedProperty.property.propertyCategory === 'new buildings' ? 'New Building' : 
                     savedProperty.property.propertyCategory === 'farm house' ? 'Farm House' : 
                     savedProperty.property.propertyCategory === 'sites' ? 'Development Plot' : 
                     savedProperty.property.propertyCategory === 'commercial' ? 'Commercial Property' : 
                     savedProperty.property.propertyCategory === 'investment' ? 'Investment Property' : 
                     'Property'}
                  </span>
                </div>

                {/* View Property Button */}
                <Link href={`/properties/${savedProperty.property.id}`}>
                  <Button className="w-full bg-[#011337] hover:bg-[#011337]/90">
                    View Property
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

