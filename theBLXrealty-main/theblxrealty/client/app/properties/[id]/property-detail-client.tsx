"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Share2,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Bus,
  Train,
  Plane,
  Route,
  Shield,
  Car,
  Wifi,
  Dumbbell,
  Trees,
  Droplets,
  Building2,
  Home,
  Sparkles,
  Cctv,
  Zap,
  KeyRound,
  Users,
} from "lucide-react"
import PropertyContactForm from "@/components/property-contact-form"
import PropertyMap from "@/components/property-map"
import SimilarProperties from "@/components/similar-properties"
import ShareModal from "@/components/share-modal"
import { formatPrice } from "@/lib/utils"

// Property type definition
interface Property {
  id: string
  title: string
  description: string
  longDescription: string
  location: string
  priceAmount: number | null
  priceUnit: string
  development: boolean
  propertyRef: string
  coordinates?: { lat: number; lng: number }
  images: string[]
  beds?: number
  baths?: number
  sqft: number | null
  yearBuilt: number
  lotSize: string
  ecoFeatures: string[]
  amenities: string[]
  type: string
  propertyCategory: string
  isNew: boolean
  featured: boolean
  agent: {
    name: string
    phone: string
    email: string
    image: string
  }
  nearbyAmenities?: Record<string, string> | null
  transportation?: Record<string, string> | null
}

interface PropertyDetailPageClientProps {
  property: Property
}

export default function PropertyDetailPageClient({ property }: PropertyDetailPageClientProps) {
  const displayPrice =
    property.priceAmount != null
      ? formatPrice(property.priceAmount, property.priceUnit)
      : "Price on Application"

  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [propertyUrl, setPropertyUrl] = useState('')
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<number, boolean>>({})
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription)
  }

  const openPhotoModal = () => {
    setIsPhotoModalOpen(true)
    setCurrentPhotoIndex(0)
  }

  const closePhotoModal = () => {
    setIsPhotoModalOpen(false)
  }

  const goToPreviousPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }

  const goToNextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const goToPhoto = (index: number) => {
    setCurrentPhotoIndex(index)
  }

  const openShareModal = () => {
    setIsShareModalOpen(true)
  }

  const closeShareModal = () => {
    setIsShareModalOpen(false)
  }

  const handleImageLoad = (index: number) => {
    setImageLoadingStates(prev => ({ ...prev, [index]: false }))
    setImageErrors(prev => ({ ...prev, [index]: false }))
  }

  const handleImageError = (index: number) => {
    setImageLoadingStates(prev => ({ ...prev, [index]: false }))
    setImageErrors(prev => ({ ...prev, [index]: true }))
  }

  const handleImageLoadStart = (index: number) => {
    setImageLoadingStates(prev => ({ ...prev, [index]: true }))
  }

  // Get available images (filter out empty strings and ensure we have at least placeholder)
  const availableImages = property.images.filter(img => img && img.trim() !== "")
  const displayImages = availableImages.length > 0 ? availableImages : ["/placeholder.svg"]

  const amenityItems = Array.isArray(property.amenities)
    ? property.amenities.map((a) => String(a).trim()).filter(Boolean)
    : []

  const amenityIcon = (amenity: string) => {
    const s = amenity.toLowerCase()
    if (s.includes("security") || s.includes("guard")) return Shield
    if (s.includes("cctv") || s.includes("camera")) return Cctv
    if (s.includes("parking") || s.includes("car")) return Car
    if (s.includes("wifi") || s.includes("internet")) return Wifi
    if (s.includes("gym") || s.includes("fitness")) return Dumbbell
    if (s.includes("garden") || s.includes("park") || s.includes("green")) return Trees
    if (s.includes("pool") || s.includes("swim")) return Droplets
    if (s.includes("power") || s.includes("backup") || s.includes("electric")) return Zap
    if (s.includes("club") || s.includes("community") || s.includes("lounge")) return Users
    if (s.includes("lift") || s.includes("elevator")) return Building2
    if (s.includes("key") || s.includes("access") || s.includes("gated")) return KeyRound
    if (s.includes("furnished") || s.includes("premium") || s.includes("luxury")) return Sparkles
    return Home
  }

  // Set the property URL on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPropertyUrl(`${window.location.origin}/properties/${property.id}`)
    }
  }, [property.id])

  // Keyboard navigation for photo modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isPhotoModalOpen) return
      
      switch (event.key) {
        case 'Escape':
          closePhotoModal()
          break
        case 'ArrowLeft':
          event.preventDefault()
          goToPreviousPhoto()
          break
        case 'ArrowRight':
          event.preventDefault()
          goToNextPhoto()
          break
        case 'Home':
          event.preventDefault()
          goToPhoto(0)
          break
        case 'End':
          event.preventDefault()
          goToPhoto(displayImages.length - 1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isPhotoModalOpen, displayImages.length])

  return (
    <div className="flex flex-col min-h-screen pt-16 bg-white">
      {/* Back to results */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <Link href="/properties" className="text-[#011337] hover:text-[#011337]/70 flex items-center mb-4 sm:mb-6 font-['Suisse_Intl',sans-serif] text-sm sm:text-base">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to results
        </Link>
      </div>

      {/* Main Property Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side - Images */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] mb-4 rounded-lg overflow-hidden group shadow-lg">
              {imageLoadingStates[0] && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="text-gray-500 font-['Suisse_Intl',sans-serif]">Loading...</div>
                </div>
              )}
              {imageErrors[0] ? (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-500 font-['Suisse_Intl',sans-serif] text-center">
                    <div className="text-lg mb-2">Image unavailable</div>
                    <div className="text-sm">Please try refreshing the page</div>
                  </div>
                </div>
              ) : (
                <Image
                  src={displayImages[0]}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onLoad={() => handleImageLoad(0)}
                  onError={() => handleImageError(0)}
                  onLoadStart={() => handleImageLoadStart(0)}
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
            </div>
            
            {/* Thumbnail Images Row */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
                {displayImages.slice(1, 3).map((image, index) => (
                  <div key={index} className="relative h-32 sm:h-40 lg:h-48 rounded-lg overflow-hidden group shadow-md">
                    <Image
                      src={image}
                      alt={`${property.title} - Image ${index + 2}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                  </div>
                ))}
              </div>
            )}

            {/* Show More Photos Button */}
            {displayImages.length > 3 && (
              <button
                onClick={openPhotoModal}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-['Suisse_Intl',sans-serif] font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:bg-gray-300 hover:shadow-md active:scale-95"
              >
                <span>Show all {displayImages.length} photos</span>
                <span className="text-sm text-gray-500">({displayImages.length - 3} more)</span>
              </button>
            )}

            {/* Amenities (below photos) */}
            {amenityItems.length > 0 && (
              <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h2
                  className="text-xl font-bold text-black mb-4"
                  style={{ fontFamily: "Tiempos Headline, serif", fontWeight: "400" }}
                >
                  Amenities available
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {amenityItems.map((amenity) => {
                    const Icon = amenityIcon(amenity)
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-3"
                      >
                        <div className="h-9 w-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-[#011337]" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900 font-['Suisse_Intl',sans-serif] truncate">
                            {amenity}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* A little more about the property (moved below amenities) */}
            <section className="py-10 bg-gray-100 mt-8 rounded-xl">
              <div className="px-6 sm:px-8">
                <div className="max-w-none">
                  <h2
                    className="text-3xl sm:text-4xl font-bold mb-6 text-black"
                    style={{ fontFamily: "Tiempos Headline, serif", fontWeight: "400" }}
                  >
                    A little more about the property
                  </h2>

                  <div>
                    <p className="text-gray-500 font-['Suisse_Intl',sans-serif] leading-relaxed mb-4">
                      {property.description ||
                        `This ${
                          property.propertyCategory === "farm house"
                            ? "farm house"
                            : property.propertyCategory === "commercial"
                              ? "commercial property"
                              : property.propertyCategory === "luxury villas"
                                ? "luxury villa"
                                : property.propertyCategory === "flats"
                                  ? "apartment"
                                  : property.propertyCategory === "new buildings"
                                    ? "new building"
                                    : property.propertyCategory === "sites"
                                      ? "development plot"
                                      : property.propertyCategory === "investment"
                                        ? "investment property"
                                        : "property"
                        } is located in ${property.location}, offering an excellent opportunity for ${
                          property.propertyCategory === "farm house"
                            ? "agricultural development"
                            : property.propertyCategory === "commercial"
                              ? "business expansion"
                              : property.propertyCategory === "sites"
                                ? "development and construction"
                                : "residential living"
                        }. The location provides easy access to major amenities and transportation networks.`}
                    </p>

                    {!showFullDescription && (
                      <p className="text-gray-500 font-['Suisse_Intl',sans-serif] leading-relaxed mb-6">
                        ...
                      </p>
                    )}

                    {showFullDescription && (
                      <div className="text-gray-500 font-['Suisse_Intl',sans-serif] leading-relaxed mb-6 space-y-4">
                        {property.longDescription ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: property.longDescription.replace(/\n/g, "<br />"),
                            }}
                          />
                        ) : (
                          <>
                            <p>
                              This{" "}
                              {property.propertyCategory === "farm house"
                                ? "farm house"
                                : property.propertyCategory === "commercial"
                                  ? "commercial property"
                                  : property.propertyCategory === "luxury villas"
                                    ? "luxury villa"
                                    : property.propertyCategory === "flats"
                                      ? "apartment"
                                      : property.propertyCategory === "new buildings"
                                        ? "new building"
                                        : property.propertyCategory === "sites"
                                          ? "development plot"
                                          : property.propertyCategory === "investment"
                                            ? "investment property"
                                            : "property"}{" "}
                              offers excellent potential for development and investment. The location in{" "}
                              {property.location} provides strategic advantages for{" "}
                              {property.propertyCategory === "farm house"
                                ? "agricultural and residential development"
                                : property.propertyCategory === "commercial"
                                  ? "business operations and expansion"
                                  : property.propertyCategory === "sites"
                                    ? "construction and development"
                                    : property.propertyCategory === "investment"
                                      ? "investment returns and appreciation"
                                      : "comfortable family living and lifestyle enhancement"}
                              .
                            </p>

                            <p>
                              {property.location} is a thriving area with excellent amenities including schools, shopping
                              centers, restaurants, and recreational facilities. The location provides easy access to
                              major transportation networks, making it convenient for daily commutes and business
                              operations.
                            </p>

                            <p>
                              This represents a unique opportunity to acquire a{" "}
                              {property.propertyCategory === "sites"
                                ? "development plot"
                                : property.propertyCategory === "commercial"
                                  ? "commercial space"
                                  : property.propertyCategory === "investment"
                                    ? "investment property"
                                    : "residential property"}{" "}
                              in one of{" "}
                              {property.location.split(",")[1]?.trim() || "the area"}
                              's most sought-after locations.
                            </p>
                          </>
                        )}
                      </div>
                    )}

                    <button
                      onClick={toggleDescription}
                      className="flex items-center gap-2 text-[#011337] hover:text-[#011337]/70 font-['Suisse_Intl',sans-serif] font-medium transition-colors"
                    >
                      <span className="w-6 h-6 border border-[#011337] rounded-full flex items-center justify-center">
                        <span className="text-[#011337] text-sm">{showFullDescription ? "−" : "+"}</span>
                      </span>
                      {showFullDescription ? "See less" : "See more"}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right side - Property Details */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Property Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-black" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>
                {property.title}
              </h1>

              {/* Price */}
              <div className="text-2xl font-bold text-black" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '500'}}>
                Starting from {displayPrice}
              </div>

              {/* Property Type */}
              <div>
                <h3 className="text-lg font-semibold mb-2 font-['Suisse_Intl',sans-serif]">
                  {property.propertyCategory === 'luxury villas' ? 'Luxury Villa' : 
                   property.propertyCategory === 'flats' ? 'Apartment' : 
                   property.propertyCategory === 'new buildings' ? 'New Building' : 
                   property.propertyCategory === 'farm house' ? 'Farm House' : 
                   property.propertyCategory === 'sites' ? 'Development Plot' : 
                   property.propertyCategory === 'commercial' ? 'Commercial Property' : 
                   property.propertyCategory === 'investment' ? 'Investment Property' : 
                   property.development ? "Development Plot" : "Property"} for sale in {property.location}
                </h3>
                <p className="text-gray-600 font-['Suisse_Intl',sans-serif] flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location}
                </p>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-700 font-['Suisse_Intl',sans-serif] leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Share button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center py-4">
                <button 
                  onClick={openShareModal}
                  className="flex items-center justify-center gap-2 text-gray-600 hover:text-[#011337] transition-colors font-['Suisse_Intl',sans-serif] px-3 py-2 rounded-lg hover:bg-gray-50 flex-1 sm:flex-none"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>

              {/* Property Reference */}
              {/* <div className="text-sm text-gray-500 font-['Suisse_Intl',sans-serif]">
                Property Ref: {property.propertyRef}
              </div> */}

              {/* Guide Price Section */}
              {/* <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 font-['Suisse_Intl',sans-serif]">Guide price</h3>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-black font-['Suisse_Intl',sans-serif]">
                    {property.price}
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 font-['Suisse_Intl',sans-serif]">
                    ₹
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div> */}

              {/* Contact Seller card (reference-style) */}
              <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white">
                <h3 className="text-lg font-bold mb-4 font-['Suisse_Intl',sans-serif] text-black">
                  Contact Seller
                </h3>

                <div className="flex items-center gap-3 mb-4">
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                    <Image
                      src={property.agent.image || "/placeholder.svg"}
                      alt={property.agent.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-gray-900 font-['Suisse_Intl',sans-serif] truncate">
                      {property.agent.name}
                    </div>
                    <div className="text-xs text-gray-600 font-['Suisse_Intl',sans-serif]">
                      Seller
                    </div>
                    <div className="text-xs text-gray-900 font-['Suisse_Intl',sans-serif] truncate">
                      {property.agent.phone}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <PropertyContactForm
                    propertyTitle={property.id.toString()}
                    variant="embedded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Location Map */}
      <section className="py-12 bg-white mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Property Location</h2>
            <p className="text-gray-600 mb-6 font-['Suisse_Intl',sans-serif]">
              Located at {property.location}. Explore the neighborhood and nearby amenities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map */}
            <div className="lg:col-span-2">
                          <div className="h-[650px] bg-gray-100 rounded-xl overflow-hidden shadow-lg">
              <PropertyMap 
                properties={[{
                  id: property.id.toString(),
                  title: property.title,
                  address: property.location,
                  price: displayPrice,
                  type: property.propertyCategory === 'farm house' ? 'Farm House' : 
                        property.propertyCategory === 'commercial' ? 'Commercial' : 
                        property.propertyCategory === 'luxury villas' ? 'Luxury Villa' : 
                        property.propertyCategory === 'flats' ? 'Apartment' : 
                        property.propertyCategory === 'new buildings' ? 'New Building' : 
                        property.propertyCategory === 'sites' ? 'Development Plot' : 
                        property.propertyCategory === 'investment' ? 'Investment Property' : 'Residential',
                  coordinates: property.coordinates || { lat: 12.9716, lng: 77.5946 }
                }]}
                center={property.coordinates || { lat: 12.9716, lng: 77.5946 }}
                zoom={15}
                height="100%"
              />
            </div>
            </div>
            
            {/* Location Details */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center font-['Suisse_Intl',sans-serif]">
                  <MapPin className="h-5 w-5 text-[#011337] mr-2" />
                  Address
                </h3>
                <p className="text-gray-700 font-['Suisse_Intl',sans-serif]">{property.location}</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 font-['Suisse_Intl',sans-serif]">Transportation</h3>
                <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-4 font-['Suisse_Intl',sans-serif]">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Bus className="h-4 w-4 text-[#011337]" />
                    Bus Stop
                  </span>
                  <span className="font-semibold text-gray-900 text-right break-words">
                    {property.transportation?.["Bus Stop"] || "-"}
                  </span>

                  <span className="text-gray-600 flex items-center gap-2">
                    <Train className="h-4 w-4 text-[#011337]" />
                    Metro Station
                  </span>
                  <span className="font-semibold text-gray-900 text-right break-words">
                    {property.transportation?.["Metro Station"] || "-"}
                  </span>

                  <span className="text-gray-600 flex items-center gap-2">
                    <Plane className="h-4 w-4 text-[#011337]" />
                    Airport
                  </span>
                  <span className="font-semibold text-gray-900 text-right break-words">
                    {property.transportation?.["Airport"] || "-"}
                  </span>

                  <span className="text-gray-600 flex items-center gap-2">
                    <Route className="h-4 w-4 text-[#011337]" />
                    Highway Access
                  </span>
                  <span className="font-semibold text-gray-900 text-right break-words">
                    {property.transportation?.["Highway Access"] || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-black" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Similar Properties</h2>
          <SimilarProperties 
            currentPropertyId={property.id} 
            currentPropertyType={property.type}
            currentPropertyLocation={property.location}
          />
        </div>
      </section>

      {/* Internal Linking: Related Locations & Blogs */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Related Locations */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-black font-tiempos" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>
                Explore Properties by Location
              </h2>
              <div className="flex flex-wrap gap-3 font-suisse">
                {[
                  { name: "JP Nagar, Bangalore", href: "/properties?location=JP%20Nagar" },
                  { name: "Whitefield, Bangalore", href: "/properties?location=Whitefield" },
                  { name: "Indiranagar, Bangalore", href: "/properties?location=Indiranagar" },
                  { name: "Yeswanthpur, Bangalore", href: "/properties?location=Yeswanthpur" },
                  { name: "London, United Kingdom", href: "/properties?location=London" }
                ].map((loc) => (
                  <Link 
                    key={loc.name} 
                    href={loc.href}
                    className="px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-[#011337]/30 text-gray-700 hover:text-[#011337] rounded-lg transition-all"
                  >
                    {loc.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Blogs */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-black font-tiempos" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>
                Real Estate Insights & Guides
              </h2>
              <div className="space-y-4 font-suisse">
                {[
                  { title: "Why Bangalore is India's Silicon Valley for Property Investments", desc: "Understand why global and NRI investors are pouring funds into Bangalore real estate.", href: "/blog" },
                  { title: "5 Tips to Safely Purchase Premium Flats and Villas", desc: "A comprehensive checklist covering RERA approval, documentation, and key negotiations.", href: "/blog" }
                ].map((blog) => (
                  <Link 
                    key={blog.title} 
                    href={blog.href}
                    className="block p-4 rounded-xl border border-gray-100 hover:border-[#011337]/20 hover:bg-gray-50/50 transition-all"
                  >
                    <div className="font-semibold text-[#011337] text-sm md:text-base hover:underline">{blog.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{blog.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={closeShareModal}
        propertyTitle={property.title}
        propertyUrl={propertyUrl}
      />
      {/* Photo Modal */}
      {isPhotoModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={closePhotoModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="photo-modal-title"
          aria-describedby="photo-modal-description"
        >
          <div 
            className="relative w-full max-w-6xl max-h-full bg-white rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="absolute top-4 left-4 z-10 text-white">
              <div id="photo-modal-title" className="sr-only">
                {property.title} - Photo Gallery
              </div>
              <div id="photo-modal-description" className="sr-only">
                Use arrow keys to navigate between photos, Home/End keys to go to first/last photo, and Escape to close
              </div>
              <div className="text-sm font-medium font-['Suisse_Intl',sans-serif]">
                {currentPhotoIndex + 1} of {displayImages.length}
              </div>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={closePhotoModal} 
              className="absolute top-4 right-4 text-white z-10 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              aria-label="Close photo gallery"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Navigation Buttons */}
            <button 
              onClick={goToPreviousPhoto} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button 
              onClick={goToNextPhoto} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white z-10 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            
            {/* Main Image */}
            <div className="relative w-full h-[60vh] sm:h-[80vh] bg-black">
              <Image
                src={displayImages[currentPhotoIndex]}
                alt={`${property.title} - Photo ${currentPhotoIndex + 1}`}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              />
            </div>
            
            {/* Thumbnail Strip */}
            <div className="bg-gray-100 p-2 sm:p-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToPhoto(index)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      index === currentPhotoIndex 
                        ? 'border-[#011337]' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${property.title} - Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
