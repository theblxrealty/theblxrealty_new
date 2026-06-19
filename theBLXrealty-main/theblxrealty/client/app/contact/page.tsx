import Image from "next/image"

import { MapPin, Phone, Mail, Clock } from "lucide-react"
import ContactForm from "@/components/contact-form"
import ContactMap from "@/components/contact-map"

export default function ContactPage() {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": "https://theblxrealty.com/contact/#webpage",
        "url": "https://theblxrealty.com/contact",
        "name": "Contact The BLX Realty Property Experts",
        "description": "Get in touch with our luxury real estate consultants in Bangalore and London.",
        "breadcrumb": {
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
              "name": "Contact",
              "item": "https://theblxrealty.com/contact"
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://theblxrealty.com/contact/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What makes your properties premium?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our properties are carefully curated based on location, architecture, amenities, and investment potential. We focus on luxury residences, prime commercial spaces, and high-growth investment opportunities in Bangalore's most prestigious areas."
            }
          },
          {
            "@type": "Question",
            "name": "Do luxury properties cost more to maintain?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "While premium properties may have higher maintenance costs, they typically offer superior amenities, better appreciation potential, and enhanced lifestyle benefits. Our team provides detailed cost analysis to help you make informed decisions."
            }
          },
          {
            "@type": "Question",
            "name": "Can I customize my property search?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We provide personalized property search services based on your specific requirements, budget, and lifestyle preferences. Our experts will curate options that match your exact needs."
            }
          },
          {
            "@type": "Question",
            "name": "Do you offer virtual property tours?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we offer comprehensive virtual tours, 3D walkthroughs, and video consultations for all our properties. Schedule a virtual tour to explore properties from the comfort of your home."
            }
          },
          {
            "@type": "Question",
            "name": "What financing options do you offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We partner with leading banks and financial institutions to offer competitive home loan options, including special rates for luxury properties. Our team provides end-to-end assistance with loan applications, documentation, and approval processes."
            }
          }
        ]
      }
    ]
  }

  return (
    <div className="flex flex-col min-h-screen pt-30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative w-full h-[100vh] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <Image
            src="/contact-banner.webp?height=1080&width=1920"
            alt="Contact our luxury property experts"
            fill
            className="object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-end pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-white animate-fade-in">
                {/* Main Heading */}
                <h1 
                  className="font-bold mb-6 font-serif heading-hover-bounce animate-slide-up" 
                  style={{ fontFamily: 'Tiempos Headline, serif', fontSize: '60px', fontWeight: '400' }}
                >
                  Get in Touch
                </h1>

                {/* Description */}
                <p 
                  className="text-lg text-white mb-8 font-['Suisse_Intl',sans-serif] animate-slide-up-delay-1"
                >
                  Connect with our luxury property experts for personalized guidance on buying, selling, or investing in
                  Bengaluru's, Dubai's and UK's premium real estate market.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl md:text-4xl font-bold mb-6 text-black heading-hover-bounce" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Contact Information</h2>
              <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif]">
                Whether you're seeking your dream luxury property, looking to sell your premium asset, or exploring
                investment opportunities, our expert team is here to provide personalized guidance.
              </p>

              <div className="space-y-8">
                {/* Bangalore Office */}
                <div className="border-l-4 border-[#011337] pl-6">
                  <h3 className="font-bold text-black text-xl mb-4 font-['Suisse_Intl',sans-serif]">Bengaluru</h3>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-[#011337]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <MapPin className="h-6 w-6 text-[#011337]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-black text-lg font-['Suisse_Intl',sans-serif]">Visit Our Premium Office</h4>
                        <p className="text-gray-500 font-['Suisse_Intl',sans-serif] text-sm leading-relaxed">#0301D 3rd floor, Brigade Twin Towers Ward No. 38, No. 11/1-4 Pipeline Road HMT, Yeswanthpur, Bengaluru, Karnataka 560022, India</p>
                        <p className="text-gray-500 mt-2 font-['Suisse_Intl',sans-serif] text-sm">
                           open for walk-ins and scheduled appointments.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-[#011337]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Phone className="h-6 w-6 text-[#011337]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-black text-lg font-['Suisse_Intl',sans-serif]">Call Our Experts</h4>
                        <p className="text-gray-500 font-['Suisse_Intl',sans-serif] text-sm">+91 97432 64328</p>
                        <p className="text-gray-500 mt-2 font-['Suisse_Intl',sans-serif] text-sm">
                          Our property specialists are available Monday to Saturday, 9:00 AM to 6:00 PM.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-[#011337]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Mail className="h-6 w-6 text-[#011337]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-black text-lg font-['Suisse_Intl',sans-serif]">Email Us</h4>
                        <p className="text-gray-500 font-['Suisse_Intl',sans-serif] text-sm">Discoverblr@theblxrealty.com</p>
                        <p className="text-gray-500 mt-2 font-['Suisse_Intl',sans-serif] text-sm">
                          We aim to respond to all inquiries within 24 hours during business days.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* London Office */}
                <div className="border-l-4 border-[#011337] pl-6">
                  <h3 className="font-bold text-black text-xl mb-4 font-['Suisse_Intl',sans-serif]">London, UK</h3>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-[#011337]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <MapPin className="h-6 w-6 text-[#011337]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-black text-lg font-['Suisse_Intl',sans-serif]">Visit Our Premium Office</h4>
                        <p className="text-gray-500 font-['Suisse_Intl',sans-serif] text-sm leading-relaxed">Suite RA01, 195-197 Wood Street, London, E17 3NU, United Kingdom</p>
                        <p className="text-gray-500 mt-2 font-['Suisse_Intl',sans-serif] text-sm">
                          open for walk-ins and scheduled appointments.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-[#011337]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Phone className="h-6 w-6 text-[#011337]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-black text-lg font-['Suisse_Intl',sans-serif]">Call Our Experts</h4>
                        <p className="text-gray-500 font-['Suisse_Intl',sans-serif] text-sm">+44 7944450039</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-[#011337]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Mail className="h-6 w-6 text-[#011337]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-black text-lg font-['Suisse_Intl',sans-serif]">Email Us</h4>
                        <p className="text-gray-500 font-['Suisse_Intl',sans-serif] text-sm">Discoveruk@theblxrealty.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-[#011337] pl-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#011337]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Clock className="h-6 w-6 text-[#011337]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-black text-lg font-['Suisse_Intl',sans-serif]">Business Hours</h3>
                      <p className="text-gray-500 text-sm font-['Suisse_Intl',sans-serif] mt-1">Monday - Sunday: <span className="font-semibold">9:00 AM - 6:00 PM</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="font-bold text-lg mb-4 text-black font-['Suisse_Intl',sans-serif]">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://www.facebook.com/BLXrealty"
                    className="bg-gradient-to-br from-[#011337]/10 to-[#011337]/20 p-3 rounded-2xl text-[#011337] hover:from-[#011337]/20 hover:to-[#011337]/30 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>\n                    </svg>
                    <span className="sr-only">Facebook</span>
                  </a>
                  <a
                    href="https://www.instagram.com/theblxrealty/"
                    className="bg-gradient-to-br from-[#011337]/10 to-[#011337]/20 p-3 rounded-2xl text-[#011337] hover:from-[#011337]/20 hover:to-[#011337]/30 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="https://www.instagram.com/theblxrealty/"
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
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    <span className="sr-only">Instagram</span>
                  </a>
                  <a
                    href="https://x.com/BlxRealty"
                    className="bg-gradient-to-br from-[#011337]/10 to-[#011337]/20 p-3 rounded-2xl text-[#011337] hover:from-[#011337]/20 hover:to-[#011337]/30 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.106-6.694-5.834 6.694h-3.308l7.725-8.835L.404 2.25h6.837l4.882 6.268L18.244 2.25zM17.15 18.75h1.828L5.293 3.992H3.24L17.15 18.75z"/>
                    </svg>
                    <span className="sr-only">Twitter</span>
                  </a>
                  <a
                    href="https://www.youtube.com/@BLXREALTY"
                    className="bg-gradient-to-br from-[#011337]/10 to-[#011337]/20 p-3 rounded-2xl text-[#011337] hover:from-[#011337]/20 hover:to-[#011337]/30 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span className="sr-only">Youtube</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/11-square-realty/?viewAsMember=true"
                    className="bg-gradient-to-br from-[#011337]/10 to-[#011337]/20 p-3 rounded-2xl text-[#011337] hover:from-[#011337]/20 hover:to-[#011337]/30 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="https://www.linkedin.com/company/11-square-realty/?viewAsMember=true"
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
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                    <span className="sr-only">LinkedIn</span>
                  </a>
                  
                  
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-black font-['Suisse_Intl',sans-serif]">Send Us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-black" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Our Global Offices</h2>
            <p className="text-gray-500 font-['Suisse_Intl',sans-serif]">
              Walk into our refined offices to explore our high-end property portfolio and consult with our experienced professionals face-to-face.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bangalore Office */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-black font-['Suisse_Intl',sans-serif]">Bangalore </h3>
                <p className="text-gray-500 font-['Suisse_Intl',sans-serif] text-sm">
                  #0301D 3rd floor, Brigade Twin Towers
Ward No. 38, No. 11/1-4 Pipeline Road HMT, Yeswanthpur, Bengaluru, Karnataka 560022, India
                </p>
              </div>
              <div className="h-[400px] rounded-lg overflow-hidden shadow-lg border border-gray-100">
                <ContactMap 
                  center={{ lat: 13.0303765, lng: 77.542251}}
                  officeName="The BLX Realty Bangalore"
                  address="#0301D 3rd floor, Brigade Twin Towers
Ward No. 38, No. 11/1-4 Pipeline Road HMT, Yeswanthpur, Bengaluru, Karnataka 560022, India"
                  phone="+91 9743264328"
                  email="Discoverblr@theblxrealty.com"
                />
              </div>
              <div className="text-center">
                 
              </div>
            </div>

            {/* London Office */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-black font-['Suisse_Intl',sans-serif]">London  </h3>
                <p className="text-gray-500 font-['Suisse_Intl',sans-serif] text-sm">
                 Suite RA01, 195-197 Wood Street, London, E17 3NU, United Kingdom
                </p>
                <br />
              </div>
              <div className="h-[400px] rounded-lg overflow-hidden shadow-lg border border-gray-100">
                <ContactMap 
                  center={{ lat: 51.585813, lng: -0.001676 }}
                  officeName="The BLX Realty London"
                  address="Suite RA01, 195-197 Wood Street, London, E17 3NU, United Kingdom"
                  phone="+44 7944450039"
                  email="Discoverblr@theblxrealty.com"
                />
              </div>
              <div className="text-center">
                 
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-white via-[#011337]/5 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-black" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Frequently Asked Questions</h2>
            <p className="text-gray-500 font-['Suisse_Intl',sans-serif]">Find answers to common questions about our luxury properties and services.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="group bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#011337]/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg text-black group-hover:text-[#011337] transition-colors duration-300" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>What makes your properties premium?</h3>
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#011337]/10 group-hover:bg-[#011337]/20 transition-colors duration-300 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#011337] group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-32">
                  <p className="text-gray-500 font-['Suisse_Intl',sans-serif] group-hover:text-gray-700 transition-colors duration-300 pt-3">
                    Our properties are carefully curated based on location, architecture, amenities, and investment
                    potential. We focus on luxury residences, prime commercial spaces, and high-growth investment
                    opportunities in Bangalore's most prestigious areas.
                  </p>
                </div>
              </div>

              <div className="group bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#011337]/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg text-black group-hover:text-[#011337] transition-colors duration-300" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Do luxury properties cost more to maintain?</h3>
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#011337]/10 group-hover:bg-[#011337]/20 transition-colors duration-300 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#011337] group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-32">
                  <p className="text-gray-500 font-['Suisse_Intl',sans-serif] group-hover:text-gray-700 transition-colors duration-300 pt-3">
                    While premium properties may have higher maintenance costs, they typically offer superior amenities,
                    better appreciation potential, and enhanced lifestyle benefits. Our team provides detailed cost
                    analysis to help you make informed decisions.
                  </p>
                </div>
              </div>

              <div className="group bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#011337]/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg text-black group-hover:text-[#011337] transition-colors duration-300" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Can I customize my property search?</h3>
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#011337]/10 group-hover:bg-[#011337]/20 transition-colors duration-300 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#011337] group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-32">
                  <p className="text-gray-500 font-['Suisse_Intl',sans-serif] group-hover:text-gray-700 transition-colors duration-300 pt-3">
                    We provide personalized property search services based on your specific requirements, budget, and
                    lifestyle preferences. Our experts will curate options that match your exact needs.
                  </p>
                </div>
              </div>

              <div className="group bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#011337]/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg text-black group-hover:text-[#011337] transition-colors duration-300" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Do you offer virtual property tours?</h3>
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#011337]/10 group-hover:bg-[#011337]/20 transition-colors duration-300 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#011337] group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-32">
                  <p className="text-gray-500 font-['Suisse_Intl',sans-serif] group-hover:text-gray-700 transition-colors duration-300 pt-3">
                    Yes, we offer comprehensive virtual tours, 3D walkthroughs, and video consultations for all our
                    properties. Schedule a virtual tour to explore properties from the comfort of your home.
                  </p>
                </div>
              </div>

              <div className="group bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#011337]/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg text-black group-hover:text-[#011337] transition-colors duration-300" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>What financing options do you offer?</h3>
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#011337]/10 group-hover:bg-[#011337]/20 transition-colors duration-300 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#011337] group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-40">
                  <p className="text-gray-500 font-['Suisse_Intl',sans-serif] group-hover:text-gray-700 transition-colors duration-300 pt-3">
                    We partner with leading banks and financial institutions to offer competitive home loan options, 
                    including special rates for luxury properties. Our team provides end-to-end assistance with 
                    loan applications, documentation, and approval processes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
