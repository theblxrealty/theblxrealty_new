import { findUniqueProperty, withPriceUnitDefault } from "@/lib/property-db"
import { notFound } from "next/navigation"
import PropertyDetailPageClient from "./property-detail-client"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params

  try {
    const property = await findUniqueProperty({
      where: { id },
      includeAdmin: true,
    })

    if (!property) {
      return {
        title: "Property Not Found | The BLX Realty",
        description: "The requested premium property listing could not be found.",
      }
    }

    const title = `${property.title} in ${property.location || 'Bangalore'} | The BLX Realty`
    const description = property.description || `Premium ${property.propertyType || 'property'} for sale in ${property.location || 'Bangalore'}. Learn more details.`
    const ogImage = property.propertyBanner1 || "/logo.svg"

    return {
      title,
      description,
      alternates: {
        canonical: `https://theblxrealty.com/properties/${id}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        url: `https://theblxrealty.com/properties/${id}`,
        images: [
          {
            url: ogImage,
            alt: property.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    }
  } catch (error) {
    return {
      title: "Property Details | The BLX Realty",
    }
  }
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  console.log('Fetching property with ID:', id)
  
  try {
    console.log('Executing Prisma query for ID:', id)
    
    const property = await findUniqueProperty({
      where: { id },
      includeAdmin: true,
    })

    console.log('Property found:', property ? 'Yes' : 'No')
    if (property) {
      console.log('Property title:', property.title)
      console.log('Property banner1:', property.propertyBanner1 ? 'Yes' : 'No')
      console.log('Property banner2:', property.propertyBanner2 ? 'Yes' : 'No')
      console.log('Property additional images count:', property.additionalImages?.length || 0)
    }
    
    if (!property) {
      console.log('Property not found, calling notFound()')
      notFound()
    }

    console.log('Starting property transformation...')
    
    const normalized = withPriceUnitDefault(property)

    const transformedProperty = {
      id: normalized.id,
      title: normalized.title,
      description: normalized.description || "",
      longDescription: normalized.longDescription || normalized.description || "",
      location: normalized.location || "Location not specified",
      priceAmount: normalized.price ?? null,
      priceUnit: normalized.priceUnit,
      development: true,
      propertyRef: property.id.slice(-8).toUpperCase(),
      coordinates: property.latitude && property.longitude 
        ? { lat: property.latitude, lng: property.longitude }
        : { lat: 12.9716, lng: 77.5946 },
      
      // Combine all images: banner1, banner2, and additional images
      images: (() => {
        const allImages: string[] = []
        
        // Add banner images first (these are the main showcase images)
        if ((property as any).propertyBanner1) {
          allImages.push((property as any).propertyBanner1)
        }
        if ((property as any).propertyBanner2) {
          allImages.push((property as any).propertyBanner2)
        }
        
        // Add additional images
        if ((property as any).additionalImages && (property as any).additionalImages.length > 0) {
          allImages.push(...(property as any).additionalImages)
        }
        
        // If no images at all, use placeholder
        if (allImages.length === 0) {
          allImages.push("/placeholder.svg?height=600&width=800")
        }
        
        console.log('Combined images for property:', allImages.length, 'images')
        return allImages
      })(),
      
      beds: property.bedrooms || undefined,
      baths: property.bathrooms || undefined,
      availableBhk: property.availableBhk || undefined,
      sqft: property.area || null,
      yearBuilt: property.yearBuilt || new Date().getFullYear(),
      lotSize: property.lotSize || "Not specified",
      ecoFeatures: property.ecoFeatures || [],
      amenities: property.amenities || [],
      type: property.propertyType || "residential",
      propertyCategory: property.propertyCategory || "flats",
      isNew: property.yearBuilt ? (new Date().getFullYear() - property.yearBuilt) <= 2 : false,
      featured: true,
      agent: {
        name: property.agentName || "The BLX Realty Agent",
        phone: property.agentPhone || "+91 9743264328",
        email: property.agentEmail || "Discoverblr@theblxrealty.com",
        image: property.agentImage || "/placeholder-user.webp",
      },
      nearbyAmenities: property.nearbyAmenities || null,
      transportation: property.transportation || null
    }

    console.log('Property transformation completed, returning component')
    console.log('Property type being passed:', transformedProperty.type)
    console.log('Property location being passed:', transformedProperty.location)
    
    const propertyTypeSchema = (() => {
      const type = (property.propertyType || '').toLowerCase()
      const category = (property.propertyCategory || '').toLowerCase()
      if (type.includes('villa') || type.includes('house') || category.includes('villas')) {
        return 'House'
      }
      if (type.includes('apartment') || type.includes('flat') || category.includes('flats')) {
        return 'Apartment'
      }
      return 'SingleFamilyResidence'
    })()

    const breadcrumbJsonLd = {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://theblxrealty.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Properties",
          "item": "https://theblxrealty.com/properties"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": property.title,
          "item": `https://theblxrealty.com/properties/${id}`
        }
      ]
    }

    const offersSchema = property.price ? {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": property.priceUnit === "£" || property.priceUnit === "GBP" ? "GBP" : "INR",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    } : undefined

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "RealEstateListing",
          "name": property.title,
          "description": property.description || "",
          "url": `https://theblxrealty.com/properties/${id}`,
          "image": property.propertyBanner1 || "https://theblxrealty.com/logo.svg",
          "datePosted": property.createdAt,
          "numberOfItems": 1,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "item": {
                "@type": propertyTypeSchema,
                "name": property.title,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": property.location || "Bangalore",
                  "addressRegion": "Karnataka",
                  "addressCountry": "IN"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": property.latitude || 12.9716,
                  "longitude": property.longitude || 77.5946
                },
                "numberOfBedrooms": property.bedrooms || undefined,
                "numberOfBathroomsTotal": property.bathrooms || undefined,
                "floorSize": property.area ? {
                  "@type": "QuantitativeValue",
                  "value": property.area,
                  "unitCode": "FTK"
                } : undefined,
                "offers": offersSchema
              }
            }
          ]
        },
        breadcrumbJsonLd
      ]
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PropertyDetailPageClient property={transformedProperty} />
      </>
    )
  } catch (error) {
    console.warn('Error fetching property:', error)
    notFound()
  }
}
