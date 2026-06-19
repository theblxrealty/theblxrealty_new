"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface Partner {
  id: number
  name: string
  logo: string
}

const partners: Partner[] = [
  {
    id: 1,
    name: "Brigade",
    logo: "/partners/brigade png.webp",
  },
  {
    id: 2,
    name: "embassy",
    logo: "/partners/embassy png.webp",
  },
  {
    id: 3,
    name:  "godrej",
    logo: "/partners/godreg png.webp",
  },
  // {
  //   id: 4,
  //   name: "JRC Builders",
  //   logo: "/partners/jrc.png",
  // },
  // {
  //   id: 5,
  //   name: "Rohan Builders",
  //   logo: "/partners/rohan.png",
  // },
  {
    id: 6,
    name: "nambiar",
    logo: "/partners/nambiar png.webp",
  },
  {
    id: 7,
    name: "Prestige Group",
    logo: "/partners/prestige  png.webp",
  },
  {
    id: 8,
    name: "Lodha Group",
    logo: "/partners/lodha png.webp",
  } 
]

export default function ChannelPartnersSlider() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const itemsPerSlide = 6

  const nextSlide = () => {
    if (partners.length <= 6) return
    setDirection(1)
    setCurrent((prev) => (prev + 1) % partners.length)
  }

  const prevSlide = () => {
    if (partners.length <= 6) return
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + partners.length) % partners.length)
  }

  const visiblePartners = Array.from({ length: itemsPerSlide }).map((_, i) =>
    partners[(current + i) % partners.length]
  )

  useEffect(() => {
    // Only auto-slide if there are more than 6 partners
    if (partners.length <= 6) return

    const interval = setInterval(() => {
      nextSlide()
    }, 3000)

    return () => clearInterval(interval)
  }, [partners.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: direction > 0 ? 50 : -50 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
    exit: { opacity: 0 },
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className="text-4xl md:text-4xl font-bold mb-6 text-black"
            style={{
              fontFamily: "Tiempos Headline, serif",
              fontWeight: "400",
            }}
          >
            Our Channel Partners
          </h2>
          <p
            className="text-lg text-gray-500 font-['Suisse_Intl',sans-serif]"
          >
            Trusted collaborations with leading builders and developers to bring
            you the finest properties and investment opportunities.
          </p>
        </div> */}

        <div className="relative">
          {/* Partners Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-6 lg:gap-8 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={current}
          >
            {visiblePartners.map((partner) => (
              <motion.div
                key={partner.id}
                variants={itemVariants}
                className="flex items-center justify-center"
              >
                <div
                  className="relative w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center justify-center overflow-hidden group"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain p-6 md:p-8 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
