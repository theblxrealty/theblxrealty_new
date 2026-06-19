"use client"

import { memo } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { formatPropertyType, formatPrice } from "@/lib/utils"

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

function formatAvailableBhk(value?: string | null) {
  if (value === undefined || value === null) return null

  const raw = String(value).trim()
  if (raw === '') return null

  const bhkValues = Array.from(new Set(raw.match(/\d+/g) ?? []))
  if (bhkValues.length === 0) return null

  const hasOnlyZero = bhkValues.every((bhk) => bhk === '0')
  if (hasOnlyZero) return null

  return `${bhkValues.join(', ')} BHK`
}

function PropertyCard({ property }: { property: Property }) {
  const availableBhkLabel = formatAvailableBhk(property.availableBhk)

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden py-4 transform hover:scale-105 hover:-translate-y-1">
        <div className="flex flex-col lg:flex-row h-80">
          <div className="lg:w-1/2 px-4 lg:px-6 flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-2xl lg:text-3xl font-tiempos text-amber-600 mb-2 leading-tight">
                {property.title}
              </h3>
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-suisse font-medium text-sm">{property.location}</span>
              </div>
              <div className="text-xl lg:text-2xl font-tiempos font-bold text-gray-900 mb-2" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '500'}}>
                Starting from {property.priceRange || (property.price ? formatPrice(property.price, property.priceUnit) : "Price on Application")}
              </div>
              {/* BHK display removed from top; moved below the Area section to match design */}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-amber-600 font-suisse text-sm font-medium">Property Type</span>
                <span className="text-gray-900 font-suisse font-semibold text-sm">
                  {formatPropertyType(property.type)}
                </span>
              </div>
              <div className={`flex items-center justify-between py-2 ${availableBhkLabel ? '' : 'border-b border-gray-100'}`}>
                <span className="text-amber-600 font-suisse text-sm font-medium">Area</span>
                <span className="text-gray-900 font-suisse font-semibold text-sm">
                  {property.sqft && property.sqft > 0 ? `${property.sqft} sq ft` : '-'}
                </span>
              </div>
              {availableBhkLabel ? (
                <div className="flex items-center justify-start py-1">
                  <span className="text-gray-800 font-suisse font-semibold text-sm">
                    {availableBhkLabel} Apartments
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="grid grid-cols-2 h-full gap-2 px-2">
              <div className="relative h-full overflow-hidden rounded-lg">
                <Image 
                  src={property.images?.[0] || "/placeholder.svg"} 
                  alt={`${property.title} - Exterior View`} 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
              <div className="relative h-full overflow-hidden rounded-lg">
                <Image 
                  src={property.images?.[1] || property.images?.[0] || "/placeholder.svg"} 
                  alt={`${property.title} - Interior View`} 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-3 right-3 bg-amber-600 text-white p-2 rounded-lg shadow-lg hover:bg-amber-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default memo(PropertyCard)
