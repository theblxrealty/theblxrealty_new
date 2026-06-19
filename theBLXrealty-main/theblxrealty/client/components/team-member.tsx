"use client"

import { useState } from "react"
// NOTE: Replaced 'next/image' with a functional component to resolve compilation errors
import { motion } from "framer-motion"
import { Linkedin, Twitter, Mail, X } from "lucide-react" // Imported X icon

// --- START: Component to safely replace next/image ---
interface LocalImageProps {
  src: string;
  alt: string;
  className: string;
  priority?: boolean;
}

const LocalImage = ({ src, alt, className }: LocalImageProps) => {
  // Anchors the image to the top to ensure the face is visible (objectPosition: 'top')
  return (
    <img
      src={src}
      alt={alt}
      className={`${className} w-full h-full absolute top-0 left-0`}
      style={{ objectFit: 'cover', objectPosition: 'top' }} 
    />
  );
}
// --- END: Component to safely replace next/image ---

interface TeamMemberProps {
  member: {
    name: string
    role: string
    image: string
    bio: string
  }
}

export default function TeamMember({ member }: TeamMemberProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(true)}
      >
        <div className="relative h-80 w-full">
          <LocalImage // Using LocalImage workaround
            src={member.image || "/placeholder.svg"}
            alt={member.name}
            className="rounded-2xl object-center object-cover"
            priority
          />

          {/* Hover Social Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-800/60 to-transparent flex items-end justify-center pb-6"
          >
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/nishchith-umesh-b08734159?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" className="text-white hover:text-gold-400 transition-colors">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </motion.div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold mb-1 text-navy-900">{member.name}</h3>
          <p className="text-gold-600 mb-4 font-medium">{member.role}</p>
          <div
            className="prose max-w-none text-slate-700 leading-relaxed text-base md:text-lg line-clamp-3"
            dangerouslySetInnerHTML={{ __html: member.bio }}
          />
        </div>
      </motion.div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            // Responsive sizing for the modal container
            className="bg-white rounded-xl sm:rounded-3xl shadow-xl max-w-sm sm:max-w-3xl lg:max-w-7xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-8 relative"
          >
            {/* Close Button: Fixed syntax and added X icon */}
            <button
              className="absolute top-3 right-3 sm:top-5 sm:right-5 text-gray-500 hover:text-black text-2xl z-10 p-2"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
              {/* Left: Image */}
              <div className="relative w-full h-96 md:h-[800px]">
                <LocalImage // Using LocalImage workaround
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="object-cover rounded-xl"
                  priority
                />
              </div>

              {/* Right: Bio */}
              <div className="flex flex-col justify-start overflow-y-auto pr-0 md:pr-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">{member.name}</h2>
                <p className="text-gold-600 font-medium text-base sm:text-lg mb-4">{member.role}</p>
                <div
                  // FIX: Removed invalid class "fontsize -5". Set proper responsive text sizes.
                  className="prose max-w-none text-slate-700 leading-relaxed text-base md:text-lg lg:text-xl"
                  dangerouslySetInnerHTML={{ __html: member.bio }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
