"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Building, Bed, Bath } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPropertyType } from "@/lib/utils"

interface Property {
  id: string
  title: string
  location: string
  price: number | null
  propertyType: string
  bedrooms: number | null
  bathrooms: number | null
  images: string[]
}

interface PropertySearchProps {
  placeholder?: string
  className?: string
}

export default function PropertySearch({ placeholder = "Search by location, property type, or bedrooms...", className = "" }: PropertySearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        fetchProperties(searchQuery)
      } else {
        setProperties([])
        setShowDropdown(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchProperties = async (query: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/properties?search=${encodeURIComponent(query)}&limit=8`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties || [])
        setShowDropdown(data.properties && data.properties.length > 0)
      }
    } catch (error) {
      console.warn('Error fetching properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < properties.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && properties[selectedIndex]) {
        handlePropertySelect(properties[selectedIndex])
      } else if (searchQuery.trim()) {
        handleSearch()
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
      setSelectedIndex(-1)
    }
  }

  const handlePropertySelect = (property: Property) => {
    router.push(`/properties/${property.id}`)
    setSearchQuery("")
    setShowDropdown(false)
    setSelectedIndex(-1)
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const params = new URLSearchParams()
      params.set('search', searchQuery.trim())
      router.push(`/properties?${params.toString()}`)
      setSearchQuery("")
      setShowDropdown(false)
    }
  }

  const formatPrice = (price: number | null) => {
    if (!price) return "Price on Application"
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getPropertyTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'villa':
      case 'luxury-villas':
        return <Building className="h-4 w-4" />
      case 'farm':
      case 'farm-house':
        return <MapPin className="h-4 w-4" />
      default:
        return <Building className="h-4 w-4" />
    }
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex-1 flex items-center px-6 py-3">
            <MapPin className="h-5 w-5 text-[#011337] mr-3 flex-shrink-0" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (properties.length > 0) setShowDropdown(true)
              }}
              className="flex-1 bg-transparent border-none text-gray-800 placeholder-gray-500 outline-none text-lg focus:ring-0 focus:border-none"
            />
          </div>
          <Button
            type="button"
            onClick={handleSearch}
            className="bg-transparent hover:bg-gray-50 text-gray-800 px-8 py-3 transition-all duration-300 flex items-center gap-2"
          >
            <Search className="h-5 w-5" />
            <span className="font-medium">Search</span>
          </Button>
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
          {/* Filter Options */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const params = new URLSearchParams()
                  params.set('type', 'luxury-villas')
                  window.location.href = `/properties?${params.toString()}`
                }}
                className="px-3 py-1 text-xs font-medium rounded-full border border-gray-300 text-gray-800 hover:bg-gray-100 transition-all duration-200"
              >
                Luxury Villas
              </button>
              <button
                onClick={() => {
                  const params = new URLSearchParams()
                  params.set('type', 'apartments')
                  window.location.href = `/properties?${params.toString()}`
                }}
                className="px-3 py-1 text-xs font-medium rounded-full border border-gray-300 text-gray-800 hover:bg-gray-100 transition-all duration-200"
              >
                Apartments
              </button>
              <button
                onClick={() => {
                  const params = new URLSearchParams()
                  params.set('type', 'farm-house')
                  window.location.href = `/properties?${params.toString()}`
                }}
                className="px-3 py-1 text-xs font-medium rounded-full border border-gray-300 text-gray-800 hover:bg-gray-100 transition-all duration-200"
              >
                Farm Houses
              </button>
              <button
                onClick={() => {
                  const params = new URLSearchParams()
                  params.set('type', 'commercial')
                  window.location.href = `/properties?${params.toString()}`
                }}
                className="px-3 py-1 text-xs font-medium rounded-full border border-gray-300 text-gray-800 hover:bg-gray-100 transition-all duration-200"
              >
                Commercial
              </button>
              <button
                onClick={() => {
                  const params = new URLSearchParams()
                  params.set('bedrooms', '3')
                  window.location.href = `/properties?${params.toString()}`
                }}
                className="px-3 py-1 text-xs font-medium rounded-full border border-gray-300 text-gray-800 hover:bg-gray-100 transition-all duration-200"
              >
                3+ Beds
              </button>
              <button
                onClick={() => {
                  const params = new URLSearchParams()
                  params.set('bedrooms', '4')
                  window.location.href = `/properties?${params.toString()}`
                }}
                className="px-3 py-1 text-xs font-medium rounded-full border border-gray-300 text-gray-800 hover:bg-gray-100 transition-all duration-200"
              >
                4+ Beds
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#011337] mx-auto mb-2"></div>
              Searching properties...
            </div>
          ) : properties.length > 0 ? (
            <div className="py-2">
              {properties.map((property, index) => (
                <div
                  key={property.id}
                  onClick={() => handlePropertySelect(property)}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    index === selectedIndex ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getPropertyTypeIcon(property.propertyType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {property.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                        {property.location}
                      </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        {property.bedrooms && (
                          <span className="flex items-center gap-1">
                            <Bed className="h-3 w-3" />
                            {property.bedrooms} Beds
                          </span>
                        )}
                        {property.bathrooms && (
                          <span className="flex items-center gap-1">
                            <Bath className="h-3 w-3" />
                            {property.bathrooms} Baths
                          </span>
                        )}
                        <span>
                          {formatPropertyType(property.propertyType)}
                        </span>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {properties.length >= 8 && (
                <div className="px-4 py-3 border-t border-gray-200">
                  <button
                    onClick={handleSearch}
                    className="text-sm text-[#011337] hover:text-[#011337]/70 font-medium"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div>
              )}
            </div>
          ) : searchQuery.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              No properties found for "{searchQuery}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
} 