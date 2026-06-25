'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice } from '@/lib/utils'

interface Property {
  id: string
  title: string
  location: string
  price: number
  priceUnit: string
  bedrooms: number
  bathrooms: number
  images: string[]
  admin?: {
    firstName?: string
    lastName?: string
  }
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

export default function PropertyCarousel() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Fetch all active properties without limit
        const response = await fetch('/api/properties?limit=1000')
        if (!response.ok) {
          console.warn('Properties API error:', response.status, await response.text())
          return
        }
        const data = await response.json()

        if (data.properties && Array.isArray(data.properties)) {
          setProperties(
            data.properties.map((p: Property & { beds?: number; baths?: number }) => ({
              ...p,
              bedrooms: p.bedrooms ?? p.beds ?? 0,
              bathrooms: p.bathrooms ?? p.baths ?? 0,
            }))
          )
        }
      } catch (error) {
        console.warn('Failed to fetch properties:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()

    // Refresh properties every 30 seconds to detect newly added properties
    const refreshInterval = setInterval(fetchProperties, 30000)
    
    return () => clearInterval(refreshInterval)
  }, [])

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll || properties.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % properties.length)
    }, 8000) // 8 seconds

    return () => clearInterval(interval)
  }, [autoScroll, properties.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? properties.length - 1 : prevIndex - 1
    )
    setAutoScroll(false)
    setTimeout(() => setAutoScroll(true), 8000)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % properties.length)
    setAutoScroll(false)
    setTimeout(() => setAutoScroll(true), 8000)
  }

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-96 bg-gray-100 rounded-xl">
            <div className="text-gray-500">Loading properties...</div>
          </div>
        </div>
      </section>
    )
  }

  if (properties.length === 0) {
    return null
  }

  const currentProperty = properties[currentIndex]

  const availableBhkLabel = formatAvailableBhk(currentProperty.availableBhk)

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Carousel Container */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              onClick={() => router.push(`/properties/${currentProperty.id}`)}
              className="relative bg-gradient-to-br from-pink-100 to-purple-50 rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-96">
                {/* Image Section - 2 columns */}
                <div className="lg:col-span-2 relative h-96 lg:h-full">
                  <Image
                    src={currentProperty.images?.[0] || '/placeholder.svg'}
                    alt={currentProperty.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Card Section - 1 column */}
                <div className="bg-gradient-to-br from-pink-100 to-purple-50 p-8 flex flex-col justify-between">
                  {/* Builder Logo and Name */}
                  <div>
                    <div className="mb-8">
                      {/* <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-md mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#011337]">
                            {currentProperty.title.charAt(0)}
                          </div>
                        </div>
                      </div> */}
                      <h3 className="text-2xl font-bold text-black mb-2 font-['Tiempos_Headline',serif] leading-tight">
                        {currentProperty.title}
                      </h3>
                    </div>

                    {/* View Projects Link */}
                    <Link
                      href={`/properties/${currentProperty.id}`}
                      className="text-[#011337] font-semibold text-sm hover:underline mb-6 inline-block"
                    >
                      View Projects →
                    </Link>

                    {/* Location */}
                    <p className="text-gray-600 text-sm mb-4 font-['Suisse_Intl',sans-serif]">
                      {currentProperty.location}
                    </p>

                    {/* Price */}
                    <p className="text-2xl font-bold text-black mb-2 font-['Suisse_Intl',sans-serif]">
                      Starting from {formatPrice(currentProperty.price, currentProperty.priceUnit)}
                    </p>

                    {/* BHK */}
                    {availableBhkLabel ? (
                      <div className="bg-pink-200 rounded-md py-2 px-3 inline-block mb-8">
                        <p className="text-gray-800 text-sm font-bold font-['Suisse_Intl',sans-serif]">
                          {availableBhkLabel}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  {/* Contact Button */}
                  <Link
                    href={`/properties/${currentProperty.id}`}
                    className="w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white py-3 rounded-full font-bold font-['Suisse_Intl',sans-serif] transition-all duration-300 text-center"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none z-10">
            {/* Left Arrow */}
            <button
              onClick={goToPrevious}
              className="pointer-events-auto -ml-6 lg:-ml-16 w-14 h-14 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:bg-gray-50 group"
              aria-label="Previous property"
            >
              <ChevronLeft className="h-6 w-6 text-[#011337] group-hover:scale-110 transition-transform" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={goToNext}
              className="pointer-events-auto -mr-6 lg:-mr-16 w-14 h-14 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:bg-gray-50 group"
              aria-label="Next property"
            >
              <ChevronRight className="h-6 w-6 text-[#011337] group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {properties.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setAutoScroll(false)
                  setTimeout(() => setAutoScroll(true), 8000)
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-[#011337]'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to property ${index + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-6 text-gray-600 font-['Suisse_Intl',sans-serif]">
            {currentIndex + 1} / {properties.length}
          </div>
        </div>
      </div>
    </section>
  )
}
