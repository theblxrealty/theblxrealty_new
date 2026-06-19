"use client"

import { useState, useEffect } from 'react'
import { X, Heart, MapPin, Bed, Bath, Square, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface SavedProperty {
  id: string
  title: string
  description: string
  location: string
  price: number
  priceUnit: string
  propertyRef: string
  images: string[]
  beds?: number
  baths?: number
  sqft: number
  type: string
  propertyCategory: string
  isActive: boolean
  savedAt: string
}

interface SavedPropertiesSidebarProps {
  isOpen: boolean
  onClose: () => void
  refreshTrigger?: number
}

export default function SavedPropertiesSidebar({ isOpen, onClose, refreshTrigger }: SavedPropertiesSidebarProps) {
  const { data: session } = useSession()
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && (session?.user as any)?.id) {
      fetchSavedProperties()
    }
  }, [isOpen, (session?.user as any)?.id, refreshTrigger])

  const fetchSavedProperties = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/properties/saved')
      if (response.ok) {
        const data = await response.json()
        setSavedProperties(data.properties)
      } else {
        toast({
          title: "Error",
          description: "Failed to load saved properties",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.warn('Error fetching saved properties:', error)
      toast({
        title: "Error",
        description: "Failed to load saved properties",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnsaveProperty = async (propertyId: string) => {
    try {
      const response = await fetch('/api/properties/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyId }),
      })

      if (response.ok) {
        // Remove from local state
        setSavedProperties(prev => prev.filter(prop => prop.id !== propertyId))
        toast({
          title: "Property Unsaved",
          description: "Property has been removed from your saved list",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to unsave property",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.warn('Error unsaving property:', error)
      toast({
        title: "Error",
        description: "Failed to unsave property",
        variant: "destructive",
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold font-['Suisse_Intl',sans-serif]">
            Saved Properties
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500 font-['Suisse_Intl',sans-serif]">
                Loading saved properties...
              </div>
            </div>
          ) : savedProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
              <Heart className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-['Suisse_Intl',sans-serif]">
                No saved properties
              </h3>
              <p className="text-gray-500 font-['Suisse_Intl',sans-serif]">
                Properties you save will appear here
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {savedProperties.map((property) => (
                <div key={property.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  {/* Property Image */}
                  <div className="relative h-32 w-full mb-3 rounded-lg overflow-hidden">
                    <Image
                      src={property.images[0] || "/placeholder.svg"}
                      alt={property.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>

                  {/* Property Details */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 font-['Suisse_Intl',sans-serif]">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="font-['Suisse_Intl',sans-serif]">{property.location}</span>
                    </div>

                    <div className="text-lg font-bold text-gray-900 font-['Suisse_Intl',sans-serif]">
                      {formatPrice(property.price, property.priceUnit)}
                    </div>

                    {/* Property Features */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {property.beds && (
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          <span className="font-['Suisse_Intl',sans-serif]">{property.beds}</span>
                        </div>
                      )}
                      {property.baths && (
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          <span className="font-['Suisse_Intl',sans-serif]">{property.baths}</span>
                        </div>
                      )}
                      {property.sqft > 0 && (
                        <div className="flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          <span className="font-['Suisse_Intl',sans-serif]">{property.sqft} sq ft</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Link 
                        href={`/properties/${property.id}`}
                        className="flex-1 bg-[#011337] hover:bg-[#011337]/90 text-white py-2 px-3 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1 font-['Suisse_Intl',sans-serif]"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Details
                      </Link>
                      <Button
                        onClick={() => handleUnsaveProperty(property.id)}
                        variant="outline"
                        size="sm"
                        className="px-3"
                      >
                        <Heart className="h-4 w-4 fill-[#011337] text-[#011337]" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {savedProperties.length > 0 && (
          <div className="p-6 border-t">
            <div className="text-sm text-gray-500 text-center font-['Suisse_Intl',sans-serif]">
              {savedProperties.length} saved propert{savedProperties.length === 1 ? 'y' : 'ies'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
