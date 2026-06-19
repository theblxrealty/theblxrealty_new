"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation, Phone, Mail } from "lucide-react"
import { Loader } from "@googlemaps/js-api-loader"

// TypeScript declarations for Google Maps
declare const google: any;

interface ContactMapProps {
  center?: { lat: number; lng: number }
  zoom?: number
  officeName?: string
  address?: string
  phone?: string
  email?: string
  height?: string
}

export default function ContactMap({
  center = { lat: 13.0303765, lng: 77.542251 }, // Bangalore coordinates
  zoom = 15,
  officeName = "The BLX Realty Office",
  address = "#0301D 3rd floor, Brigade Twin Towers\nWard No. 38, No. 11/1-4 Pipeline Road HMT, Yeswanthpur, Bengaluru, Karnataka 560022, India",
  phone = "+91 9743264328",
  email = "Discoverblr@theblxrealty.com",
  height = "500px"
}: ContactMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any | null>(null)
  const [marker, setMarker] = useState<any | null>(null)
  const [infoWindow, setInfoWindow] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to create marker icon
  const createMarkerIcon = (color: string, size: number) => {
    const iconSvg = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${color}"/>
    </svg>`
    
    return {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(iconSvg),
      scaledSize: new (google as any).maps.Size(size, size),
      anchor: new (google as any).maps.Point(size/2, size)
    }
  }

  // Initialize map only once
  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Check if Google Maps API key is available
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API || process.env.GOOGLE_MAPS_API
        if (!apiKey) {
          throw new Error("Google Maps API key not found")
        }

        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places"]
        })

        const google = await loader.load()
        
        if (!mapRef.current) return

        // Create map instance
        const mapInstance = new (google as any).maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#f5f5f5" }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#c9c9c9" }]
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9c9c9c" }]
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#757575" }]
            },
            {
              featureType: "poi",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "landscape",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "landscape",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9e9e9e" }]
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }]
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#c9c9c9" }]
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#616161" }]
            },
            {
              featureType: "road",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#ffffff" }]
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#e5e5e5" }]
            },
            {
              featureType: "transit",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9e9e9e" }]
            },
            {
              featureType: "administrative",
              elementType: "labels.text.fill",
              stylers: [{ color: "#bdbdbd" }]
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#eeeeee" }]
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#e5e5e5" }]
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [{ color: "#6b9a76" }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          gestureHandling: "cooperative"
        })

        // Create marker
        const markerInstance = new (google as any).maps.Marker({
          position: center,
          map: mapInstance,
          title: officeName,
          icon: createMarkerIcon("#dc2626", 48)
        })

        // Create info window
        const infoWindowInstance = new (google as any).maps.InfoWindow({
          content: `
            <div style="padding: 16px; max-width: 300px; font-family: 'Suisse Intl', sans-serif;">
              <div style="margin-bottom: 12px;">
                <h3 style="margin: 0 0 8px 0; color: #1e293b; font-weight: 600; font-size: 16px;">${officeName}</h3>
                <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.4;">${address}</p>
              </div>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 12px;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                  <span style="color: #d97706; margin-right: 8px;">📞</span>
                  <span style="color: #475569; font-size: 14px;">${phone}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="color: #d97706; margin-right: 8px;">✉️</span>
                  <span style="color: #475569; font-size: 14px;">${email}</span>
                </div>
              </div>
            </div>
          `
        })

        // Add click listener to marker
        markerInstance.addListener("click", () => {
          infoWindowInstance.open(mapInstance, markerInstance)
        })

        setMap(mapInstance)
        setMarker(markerInstance)
        setInfoWindow(infoWindowInstance)
        setIsLoading(false)

      } catch (err) {
        console.warn("Error loading Google Maps:", err)
        setError("Failed to load map. Please try again later.")
        setIsLoading(false)
      }
    }

    // Only initialize map once if mapRef is available and map is not already initialized
    if (mapRef.current && !map) {
      initMap()
    }
  }, [center, zoom]) // Only re-initialize map when center or zoom change

  const handleDirections = () => {
    if (map && marker) {
      const position = marker.getPosition()
      if (position) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${position.lat()},${position.lng()}&travelmode=driving`
        window.open(url, "_blank")
      }
    }
  }

  const handleCall = () => {
    window.open(`tel:${phone}`, "_self")
  }

  const handleEmail = () => {
    window.open(`mailto:${email}`, "_self")
  }

  return (
    <div className="relative w-full bg-slate-100 rounded-2xl overflow-hidden" style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#011337] mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading map...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
          <div className="text-center p-6">
            <div className="text-[#011337] mb-4\">
              <MapPin className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-slate-600 font-medium mb-2">Map unavailable</p>
            <p className="text-slate-500 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div ref={mapRef} className="w-full h-full" />

      {/* Map Controls */}
      <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg border border-slate-200 p-3">
        <div className="flex items-center mb-2">
          <MapPin className="h-4 w-4 text-[#011337] mr-2" />
          <span className="text-sm font-medium text-slate-900">{officeName}</span>
        </div>
        <p className="text-xs text-slate-600 mb-3">{address}</p>
        <div className="space-y-2">
          <button
            onClick={handleDirections}
            className="flex items-center w-full text-xs text-slate-700 hover:text-[#011337] transition-colors"
          >
            <Navigation className="h-3 w-3 mr-2" />
            Get Directions
          </button>
          <button
            onClick={handleCall}
            className="flex items-center w-full text-xs text-slate-700 hover:text-[#011337] transition-colors"
          >
            <Phone className="h-3 w-3 mr-2" />
            Call Office
          </button>
          <button
            onClick={handleEmail}
            className="flex items-center w-full text-xs text-slate-700 hover:text-[#011337] transition-colors"
          >
            <Mail className="h-3 w-3 mr-2" />
            Send Email
          </button>
        </div>
      </div>

      {/* Map Type Indicator */}
      <div className="absolute bottom-4 right-4 bg-white py-2 px-3 rounded-lg shadow-lg border border-slate-200">
        <span className="text-xs text-slate-500 font-medium">Google Maps</span>
      </div>
    </div>
  )
}
