"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"

export default function PropertyGallery({ images = [], title }: { images?: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <div className="relative bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
            <div className="md:col-span-2 relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
              <Image
                src={images[0] || "/placeholder.svg"}
                alt={`${title} - Main Image`}
                fill
                className="object-cover"
              />
              <button
                className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                onClick={() => setShowLightbox(true)}
                aria-label="View full gallery"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            </div>

            <div className="hidden md:grid grid-rows-2 gap-4">
              <div className="relative h-full rounded-lg overflow-hidden">
                <Image src={images[1] || "/placeholder.svg"} alt={`${title} - Image 2`} fill className="object-cover" />
              </div>
              <div className="relative h-full rounded-lg overflow-hidden">
                <Image src={images[2] || "/placeholder.svg"} alt={`${title} - Image 3`} fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          >
            <button
              className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setShowLightbox(false)}
              aria-label="Close gallery"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="relative w-full max-w-4xl h-[80vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={images[currentIndex] || "/placeholder.svg"}
                    alt={`${title} - Image ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full px-4 py-2 text-white text-sm">
                {currentIndex + 1} / {images.length}
              </div>

              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                onClick={prevImage}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                onClick={nextImage}
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_: unknown, index: number) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
