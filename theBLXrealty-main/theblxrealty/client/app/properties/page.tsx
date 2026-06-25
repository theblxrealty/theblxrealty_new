"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PropertyFilters from "@/components/property-filters"
import PropertyCard from "@/components/property-card"
import PropertyTypesSection from "@/components/property-types-section"
import PropertySearch from "@/components/property-search"
import { formatPropertyType } from "@/lib/utils"

// Property type display names mapping - using centralized utility function
const getTypeDisplayName = (type: string) => {
  return formatPropertyType(type)
}

function PropertiesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedType = searchParams.get('type')
  const searchQuery = searchParams.get('search')
  const bedroomsFilter = searchParams.get('bedrooms')
  const bathroomsFilter = searchParams.get('bathrooms')
  const amenitiesFilter = searchParams.get('amenities')
  const currentPage = parseInt(searchParams.get('page') || '1')

  // State for properties and pagination
  const [properties, setProperties] = useState<any[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)

  // Temporary mock data for testing the new design
  const mockProperties = [
    {
      id: "1",
      title: "10 OXFORD",
      location: "Jumeirah Village Circle, Dubai",
      images: ["/placeholder.svg", "/placeholder.svg"],
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      propertyType: "Apartments, Flat",
      price: 678150
    },
    {
      id: "2", 
      title: "Luxury Villa in Koramangala",
      location: "Koramangala 5th Block, Bangalore",
      images: ["/placeholder.svg", "/placeholder.svg"],
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      propertyType: "Luxury Villa",
      price: 45000000
    },
    {
      id: "3",
      title: "Modern Apartment in HSR Layout",
      location: "HSR Layout Sector 2, Bangalore",
      images: ["/placeholder.svg", "/placeholder.svg"],
      bedrooms: 3,
      bathrooms: 3,
      area: 1850,
      propertyType: "Apartment",
      price: 28000000
    }
  ]

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.append('search', searchQuery)
        if (selectedType && selectedType !== 'any') params.append('type', selectedType)
        if (bedroomsFilter && bedroomsFilter !== 'any') params.append('bedrooms', bedroomsFilter)
        params.append('page', currentPage.toString())
        params.append('limit', '9')

        const response = await fetch(`/api/properties?${params.toString()}`)
        const data = await response.json()

        if (data.properties) {
          setProperties(data.properties)
          setPagination(data.pagination || {
            page: currentPage,
            limit: 9,
            total: data.properties.length,
            totalPages: Math.ceil(data.properties.length / 9)
          })
        } else {
          // Use mock data if API fails
          setProperties(mockProperties)
          setPagination({
            page: 1,
            limit: 9,
            total: mockProperties.length,
            totalPages: 1
          })
        }
      } catch (error) {
        console.warn('Error fetching properties:', error)
        // Use mock data if API fails
        setProperties(mockProperties)
        setPagination({
          page: 1,
          limit: 9,
          total: mockProperties.length,
          totalPages: 1
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [searchQuery, selectedType, bedroomsFilter, bathroomsFilter, amenitiesFilter, currentPage])

  // Scroll to top of properties section when page changes
  useEffect(() => {
    const propertiesSection = document.querySelector('[data-properties-section]')
    if (propertiesSection && !loading) {
      propertiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [currentPage, loading])

  // Get page title based on selected type
  const pageTitle = selectedType 
    ? `${getTypeDisplayName(selectedType)} in Bangalore`
    : "Premium Properties in Bangalore"

  const pageDescription = selectedType
    ? `Discover premium ${getTypeDisplayName(selectedType).toLowerCase()} for sale across Bangalore's most prestigious locations`
    : "Discover your perfect luxury home from our exclusive collection of premium properties across Bangalore's most prestigious locations"



  return (
    <div className="flex flex-col min-h-screen pt-30">
      {/* Hero Section */}
      <section className="relative w-full h-[100vh] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <Image
            src="/prop-banner.webp?height=1080&width=1920"
            alt="Luxury properties in Bangalore"
            fill
            className="object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-end pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-white animate-fade-in">
                              {/* Main Heading */}
              <h1 
                className="font-bold mb-6 font-serif animate-slide-up" 
                style={{ fontFamily: 'Tiempos Headline, serif', fontSize: '50px', fontWeight: '400' }}
              >
                Seek Out Your Perfect Nest
              </h1>

                {/* Description */}
                <p 
                  className="text-lg text-white mb-8 font-['Suisse_Intl',sans-serif] animate-slide-up-delay-1"
                >
                  "Let us guide you to a place where your dreams take flight and every corner feels like home."
                </p>

                {selectedType && (
                  <div className="mt-4 animate-slide-up-delay-2">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20 font-['Suisse_Intl',sans-serif]">
                      Showing {pagination.total} {getTypeDisplayName(selectedType).toLowerCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <PropertySearch 
              placeholder="Search by location, property type, or bedrooms..."
              className="max-w-4xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <PropertyTypesSection />

      {/* Main Content - Properties Grid */}
      <section className="flex-1 bg-gray-50" data-properties-section>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-black" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>
                {selectedType ? getTypeDisplayName(selectedType) : "Available Properties"}
              </h2>
              <p className="text-gray-500 mt-2 font-['Suisse_Intl',sans-serif]">
                {pagination.total} properties found{selectedType ? ` in ${getTypeDisplayName(selectedType).toLowerCase()}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-['Suisse_Intl',sans-serif]">Sort by:</span>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px] border-gray-300 focus:border-[#011337]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#011337] mx-auto mb-4"></div>
              <p className="text-slate-500">Loading properties...</p>
            </div>
          ) : properties.length > 0 ? (
            <div className="space-y-6">
              {properties.map((property: any) => (
                <div key={property.id} className="animate-fade-in">
                  <PropertyCard property={{
                    id: property.id,
                    title: property.title,
                    location: property.location,
                    images: property.images || ["/placeholder.svg"],
                    beds: property.bedrooms,
                    baths: property.bathrooms,
                    sqft: property.area,
                    amenities: ["Security", "Parking", "Power Backup"],
                    isNew: true,
                    featured: true,
                    type: property.propertyCategory, // Use propertyCategory consistently
                    rating: 4.8,
                    development: true,
                    price: typeof property.price === "number" ? property.price : undefined,
                    priceUnit: property.priceUnit,
                    availableBhk: property.availableBhk
                  }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl md:text-3xl font-bold text-black mb-2" style={{ fontFamily: 'Tiempos Headline, serif', fontWeight: '400' }}>
                Coming Soon
              </h3>
              <p className="text-gray-500 mb-4 font-['Suisse_Intl',sans-serif]">
                For off-market Deals - Do Contact Us
              </p>
              <Button
                variant="default"
                className="bg-[#011337] hover:bg-[#011337]/90 text-white px-8 py-4 font-['Suisse_Intl',sans-serif] font-medium"
                onClick={() => router.push('/contact#contact-information')}
              >
                Contact Us
              </Button>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                {/* Previous button */}
                {pagination.page > 1 && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 bg-white border-slate-300 hover:bg-slate-50"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.set('page', (pagination.page - 1).toString())
                      router.push(`/properties?${params.toString()}`, { scroll: false })
                    }}
                  >
                    ←
                  </Button>
                )}
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button 
                      key={pageNum}
                      variant={pagination.page === pageNum ? "default" : "outline"}
                      size="icon" 
                      className={`h-8 w-8 ${pagination.page === pageNum ? 'bg-[#011337] text-white' : 'bg-white border-slate-300 hover:bg-slate-50'}`}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString())
                        params.set('page', pageNum.toString())
                        router.push(`/properties?${params.toString()}`, { scroll: false })
                      }}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                
                {/* Next button */}
                {pagination.page < pagination.totalPages && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 bg-white border-slate-300 hover:bg-slate-50"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.set('page', (pagination.page + 1).toString())
                      router.push(`/properties?${params.toString()}`, { scroll: false })
                    }}
                  >
                    →
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Can't find what you're looking for?</h2>
            <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif]">
              Let our luxury property experts help you find the perfect property that matches your requirements and
              investment goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-[#011337] hover:bg-[#011337]/90 text-white px-8 py-4 font-['Suisse_Intl',sans-serif] font-medium"
                onClick={() => router.push('/contact#contact-information')}
              >
                Schedule a Consultation
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-[#011337] text-[#011337] hover:bg-[#011337] hover:text-white px-8 py-4 font-['Suisse_Intl',sans-serif] font-medium"
                onClick={() => router.push('/contact#contact-information')}
              >
                Contact Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen pt-16">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#011337]"></div>
        </div>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  )
}
