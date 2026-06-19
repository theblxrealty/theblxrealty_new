"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Bed, Bath, Maximize, MapPin, Building, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Sample property data for Bangalore - diverse property types
const properties = [
  {
    id: 1,
    title: "Luxury Villa in Koramangala",
    location: "Koramangala 5th Block, Bangalore",
    images: ["/placeholder.svg"],
    beds: 4,
    baths: 3,
    sqft: 2800,
    amenities: ["Swimming Pool", "Garden", "Security", "Parking"],
    isNew: true,
    type: "Villa",
    category: "Residential",
    status: "For Sale",
    rating: 4.9,
  },
  {
    id: 2,
    title: "Commercial Office Space",
    location: "Outer Ring Road, Bangalore",

    images: ["/placeholder.svg"],
    beds: null,
    baths: 4,
    sqft: 3500,
    amenities: ["IT Ready", "Parking", "Power Backup", "Lift"],
    isNew: false,
    type: "Office",
    category: "Commercial",
    status: "For Sale",
    rating: 4.8,
  },
  {
    id: 3,
    title: "Residential Plot in Whitefield",
    location: "Whitefield, Bangalore",

    images: ["/placeholder.svg"],
    beds: null,
    baths: null,
    sqft: 2400,
    amenities: ["BMRDA Approved", "Corner Plot", "Clear Title", "Gated Layout"],
    isNew: true,
    type: "Plot",
    category: "Land",
    status: "For Sale",
    rating: 4.7,
  },
  {
    id: 4,
    title: "Retail Shop in Commercial Street",
    location: "Commercial Street, Bangalore",

    images: ["/placeholder.svg"],
    beds: null,
    baths: 1,
    sqft: 450,
    amenities: ["High Footfall", "Prime Location", "Parking", "Security"],
    isNew: false,
    type: "Shop",
    category: "Commercial",
    status: "For Sale",
    rating: 4.6,
  },
  {
    id: 5,
    title: "3BHK Apartment in HSR Layout",
    location: "HSR Layout Sector 2, Bangalore",

    images: ["/placeholder.svg"],
    beds: 3,
    baths: 3,
    sqft: 1850,
    amenities: ["Club House", "Gym", "Swimming Pool", "Children's Play Area"],
    isNew: false,
    type: "Apartment",
    category: "Residential",
    status: "For Sale",
    rating: 4.8,
  },
  {
    id: 6,
    title: "Warehouse in Electronic City",
    location: "Electronic City Phase 2, Bangalore",

    images: ["/placeholder.svg"],
    beds: null,
    baths: 2,
    sqft: 8500,
    amenities: ["Loading Dock", "High Ceiling", "Power Supply", "Security"],
    isNew: true,
    type: "Warehouse",
    category: "Commercial",
    status: "For Sale",
    rating: 4.5,
  },
]

export default function FeaturedProperties() {

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Residential":
        return "bg-navy-600"
      case "Commercial":
        return "bg-gold-600"
      case "Land":
        return "bg-slate-600"
      default:
        return "bg-slate-600"
    }
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property, index) => (
          <div
            key={property.id}
            // OPTIMIZED: Removed Framer Motion motion.div and whileInView animations
            // CSS will handle visibility animations more efficiently
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col h-full opacity-animation"
          >
            <div className="relative h-64">
              <Image src={property.images?.[0] || "/placeholder.svg"} alt={property.title} fill className="object-cover" />
              {property.isNew && (
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white border-0">
                  New Listing
                </Badge>
              )}

              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Badge className={`${getCategoryColor(property.category)} text-white`}>{property.category}</Badge>
                <Badge variant="secondary" className="bg-white/90 text-navy-800">
                  {property.type}
                </Badge>
              </div>
              <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="h-3 w-3 text-gold-400 fill-current" />
                <span className="text-white text-xs">{property.rating}</span>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <div className="flex-grow">
                {/* Title and Location - Fixed Height */}
                <div className="mb-4 min-h-[60px]">
                  <h3 className="text-xl font-bold mb-2 text-navy-900 line-clamp-2">{property.title}</h3>
                  <p className="text-slate-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gold-600 flex-shrink-0" />
                    <span className="line-clamp-1">{property.location}</span>
                  </p>
                </div>

                {/* Property Details - Fixed Height */}
                <div className="mb-4 min-h-[24px]">
                  <div className="flex justify-between">
                    {property.beds && (
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 text-slate-500 mr-1" />
                        <span className="text-sm text-slate-600">{property.beds} BHK</span>
                      </div>
                    )}
                    {property.baths && (
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 text-slate-500 mr-1" />
                        <span className="text-sm text-slate-600">{property.baths}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Maximize className="h-4 w-4 text-slate-500 mr-1" />
                      <span className="text-sm text-slate-600">
                        {property.sqft} {property.category === "Land" ? "sq ft" : "sq ft"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-slate-500 mr-1" />
                      <span className="text-sm text-slate-600">{property.status}</span>
                    </div>
                  </div>
                </div>

                {/* Key Features - Fixed Height */}
                <div className="mb-6 min-h-[60px]">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-navy-900">Key Features</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.slice(0, 2).map((amenity, i) => (
                      <Badge key={i} variant="secondary" className="bg-navy-50 text-navy-700 text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {property.amenities.length > 2 && (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-xs">
                        +{property.amenities.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <Link href={`/properties/${property.id}`}>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
