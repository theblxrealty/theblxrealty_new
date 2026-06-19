"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

// Updated testimonials for property buying/selling
const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Property Buyer",
    image: "/placeholder.svg?height=200&width=200",
    quote:
      "The BLX Realtyhelped me find the perfect commercial space for my business in Koramangala. Their market knowledge and negotiation skills saved me both time and money. Excellent service!",
    rating: 5,
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Property Seller",
    image: "/placeholder.svg?height=200&width=200",
    quote:
              "I was able to sell my apartment in HSR Layout successfully through The BLX Realty. They handled everything from valuation to documentation. Highly professional team!",
    rating: 5,
  },
  {
    id: 3,
    name: "Ankit Mehta",
    role: "Land Investor",
    image: "/placeholder.svg?height=200&width=200",
    quote:
      "Bought a residential plot in Whitefield through The BLX Realty. Their due diligence process and legal verification gave me complete confidence in my investment. Great experience!",
    rating: 5,
  },
  {
    id: 4,
    name: "Sneha Reddy",
    role: "First-time Buyer",
    image: "/placeholder.svg?height=200&width=200",
    quote:
      "As a first-time property buyer, The BLX Realtyguided me through the entire process. From home loan assistance to registration, they made everything seamless and stress-free.",
    rating: 5,
  },
]

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0)

  const nextTestimonial = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const [direction, setDirection] = useState(1)

  const handleNext = () => {
    setDirection(1)
    nextTestimonial()
  }

  const handlePrev = () => {
    setDirection(-1)
    prevTestimonial()
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
        <Quote className="h-24 w-24 text-gold-400/30" />
      </div>

      <div className="relative overflow-hidden min-h-[300px]">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute w-full"
          >
            <div className="flex flex-col items-center text-center px-4">
              <div className="relative w-20 h-20 mb-6 rounded-full overflow-hidden border-4 border-gold-400">
                <Image
                  src={testimonials[current].image || "/placeholder.svg"}
                  alt={testimonials[current].name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-gold-400 fill-current" />
                ))}
              </div>

              <p className="text-xl md:text-2xl italic mb-6 max-w-3xl text-slate-200">
                "{testimonials[current].quote}"
              </p>

              <div>
                <h4 className="font-bold text-lg text-white">{testimonials[current].name}</h4>
                <p className="text-gold-300">{testimonials[current].role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <Button
          variant="outline"
          size="icon"
          className="bg-navy-800/50 border-navy-700 text-white hover:bg-navy-700/50 backdrop-blur-sm"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === current ? "bg-gold-400 w-8" : "bg-slate-600"
              }`}
              onClick={() => {
                setDirection(index > current ? 1 : -1)
                setCurrent(index)
              }}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="bg-navy-800/50 border-navy-700 text-white hover:bg-navy-700/50 backdrop-blur-sm"
          onClick={handleNext}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
