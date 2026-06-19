"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import PropertySearch from "@/components/property-search"

export default function HeroSection() {

  return (
    <section className="relative w-full h-[100vh] overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        {/* OPTIMIZED: Added preload and poster attributes to video */}
        <video 
          className="w-full h-full object-cover"
          autoPlay 
          loop 
          muted 
          playsInline
          preload="metadata"
          poster="/hero-poster.webp"
        >
          <source src="/home-banner2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay - removed blue tint */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-end pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-white">
              {/* Main Heading */}
              <h1 className="font-bold mb-6 font-serif" style={{ fontFamily: 'Tiempos Headline, serif', fontSize: '50px', fontWeight: '400' }}>
                Find your dream property
              </h1>

              {/* Search Form */}
              <div className="max-w-4xl mx-auto mb-8">
                <PropertySearch 
                  placeholder="Search by location, property type, or bedrooms..."
                  className="max-w-5xl mx-auto"
                />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Link href="/properties">
                  <Button 
                    size="lg" 
                    variant="ghost"
                    className="text-lg px-8 py-4 h-auto text-white hover:bg-transparent hover:text-white transition-all duration-300 hover:scale-105 relative group"
                  >
                    <span className="relative">
                      Buy Properties
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#011337] transition-all duration-300 group-hover:w-full"></span>
                    </span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button 
                    size="lg" 
                    variant="ghost"
                    className="text-lg px-8 py-4 h-auto text-white hover:bg-transparent hover:text-white transition-all duration-300 hover:scale-105 relative group"
                  >
                    <span className="relative">
                      Sell Properties
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#011337] transition-all duration-300 group-hover:w-full"></span>
                    </span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
