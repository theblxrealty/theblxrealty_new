import Image from "next/image"
import Link from "next/link"

import { ArrowRight, Users, Award, Shield, Target, CheckCircle2, Building, TrendingUp, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen pt-30">
      {/* Hero Section */}
      <section className="relative w-full h-[100vh] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <Image
            src="/about-banner.webp?height=1080&width=1920"
            alt="Luxury building with premium architecture"
            fill
            className="w-full h-full object-cover"
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
                  About Us
                </h1>

                {/* Description */}
                <p 
                  className="text-lg text-white mb-8 font-['Suisse_Intl',sans-serif] animate-slide-up-delay-1"
                >
                   The Bengaluru-London Exchange Realty — Turning aspirations into addresses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-4xl font-bold mb-6 text-[#011337] heading-hover-bounce" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>From Vision to Reality</h2>
              <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif]">
                Welcome to The Bengaluru-London Exchange [BLX] Realty, where your property dreams take shape and become a reality. Founded with a passion for real estate and a commitment to excellence, we specialize in helping clients buy and sell properties with confidence and ease over past 5 years across London, Dubai and India.

              </p>
              <h4 className="text-4xl md:text-3xl font-bold mb-6 text-[#011337] heading-hover-bounce" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Who We Are</h4>
              <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif]">
                At The Bengaluru-London Exchange [BLX] Realty, we are more than just a real estate company—we are trusted partners in your journey to find the perfect home or investment property. With branches in India, Dubai, and the UK, we bring a global perspective combined with local market expertise. Our diverse team of skilled professionals is dedicated to delivering personalized solutions tailored to your unique needs and aspirations.
              </p>
               
              <Link href="/contact">
                <Button className="bg-[#011337] hover:bg-[#011337]/90 text-white px-8 py-4 font-['Suisse_Intl',sans-serif] font-medium\">
                  Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative h-[600px] w-full overflow-hidden">
              <Image
                src="/about1.webp?height=1000&width=800"
                alt="The BLX Realtyfounder"
                fill
                className="object-cover image-hover-bounce"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Market Leadership */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative h-[600px] w-full overflow-hidden">
                <Image
                  src="/about2.webp?height=1000&width=800"
                  alt="Luxury property portfolio"
                  fill
                  className="object-cover image-hover-bounce"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-4xl font-bold mb-6 text-[#011337] heading-hover-bounce" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Our Mission</h2>
              <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif]">
                Our mission is simple: to help you discover and own your dream property. We believe that buying or selling real estate is not just a transaction; it's a life-changing experience. That's why we focus on transparency, integrity, and unparalleled client support throughout every step of the process. We strive to make your journey seamless, rewarding, and inspiring.

              </p>
              <h2 className="text-4xl md:text-3xl font-bold mb-6 text-[#011337] heading-hover-bounce" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}> What Sets Us Apart</h2>
              <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif]">
                <strong className="font-bold text-black">Global Reach with Local Insight:</strong> Our presence across key international markets means you have access to the best properties and opportunities around the world.

              </p>
              <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif]">
                <strong className="font-bold text-black">Client-Centric Approach:</strong> Every client is unique, and so is our approach. We listen carefully, understand your goals, and tailor our services to exceed your expectations.

              </p>
               <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif]">
                <strong className="font-bold text-black">Experienced Team:</strong> Our experts bring years of industry knowledge and insightful guidance, ensuring you make informed decisions.

              </p>
               <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif]">
                 <strong className="font-bold text-black">Commitment to Excellence:</strong> We uphold the highest standards of professionalism, ethics, and customer service in every deal we handle.
              </p>
              <Link href="/properties">
                <Button className="bg-[#011337] hover:bg-[#011337]/90 text-white px-8 py-4 font-['Suisse_Intl',sans-serif] font-medium">
                  Explore Properties <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Innovation */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-4xl font-bold mb-6 text-[#011337] heading-hover-bounce" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Why Choose The Bengaluru-London Exchange Realty?
</h2>
              <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif]">
                When you choose The BLX Realty, you're not just getting a real estate agent—you're gaining a dedicated partner who cares about your future. We help you navigate the complexities of the property market, whether it's your first home or your next big investment. Our goal is to unlock the door to opportunities that match your lifestyle and ambitions.


              </p>
              <h2 className="text-4xl md:text-3xl font-bold mb-6 text-[#011337] heading-hover-bounce" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}> Join Us on This Journey

</h2>
              <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif]">
               We invite you to explore the possibilities with The BLX Realty. Let us be the key to your perfect nest—where comfort, security, and happiness come together. Whether you're buying, selling, or seeking expert advice, we're here to make your real estate dreams come true.

              </p>
               
              <Link href="/contact">
                <Button className="bg-[#011337] hover:bg-[#011337]/90 text-white px-8 py-4 font-['Suisse_Intl',sans-serif] font-medium">
                  Experience Innovation <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative h-[600px] w-full overflow-hidden">
              <Image
                src="/about3.webp?height=1000&width=800"
                alt="Technology and innovation in real estate"
                fill
                className="object-cover image-hover-bounce"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Global Network */}
      {/* <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg?height=1000&width=800"
                  alt="Global network and partnerships"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-block rounded-lg bg-gradient-to-r from-gold-100 to-gold-200 px-3 py-1 text-sm text-gold-800 mb-4">
                Global Network
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-navy-900">Connecting Global Opportunities</h2>
              <p className="text-slate-600 mb-6">
                Our extensive network spans international markets, connecting Bangalore's luxury real estate with
                global investors and high-net-worth individuals seeking premium opportunities in India's tech capital.
              </p>
              <p className="text-slate-600 mb-6">
                Through strategic partnerships with leading international real estate firms and investment banks, we
                provide our clients with access to exclusive global opportunities while showcasing Bangalore's finest
                properties to the world.
              </p>
              <p className="text-slate-600 mb-8">
                This global perspective, combined with deep local expertise, enables us to deliver exceptional value
                to both domestic and international clients seeking premium real estate opportunities in Bangalore.
              </p>
              <Link href="/contact">
                <Button variant="premium">
                  Join Our Network <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-4xl font-bold mb-6 text-black" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>What Drives Us</h2>
            <p className="text-lg text-gray-500 font-['Suisse_Intl',sans-serif]">
              Our core values guide every decision we make, from the properties we showcase to the relationships we
              build with our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="mb-6">
                <div className="w-16 h-16 bg-[#011337]/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-[#011337]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-black font-['Suisse_Intl',sans-serif]">Trust & Integrity</h3>
                <p className="text-gray-500 font-['Suisse_Intl',sans-serif]">
                  We prioritize transparency and honesty in every transaction, ensuring our clients make informed
                  decisions with complete confidence.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="mb-6">
                <div className="w-16 h-16 bg-[#011337]/10 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-[#011337]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-black font-['Suisse_Intl',sans-serif]">Excellence</h3>
                <p className="text-gray-500 font-['Suisse_Intl',sans-serif]">
                  We never compromise on quality, ensuring that every property we represent meets the highest standards of
                  luxury and sophistication.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="mb-6">
                <div className="w-16 h-16 bg-[#011337]/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-[#011337]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-black font-['Suisse_Intl',sans-serif]">Client-Centric</h3>
                <p className="text-gray-500 font-['Suisse_Intl',sans-serif]">
                  We build lasting relationships by understanding our clients' unique needs and delivering personalized
                  solutions that exceed expectations.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="mb-6">
                <div className="w-16 h-16 bg-[#011337]/10 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-[#011337]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-black font-['Suisse_Intl',sans-serif]">Innovation</h3>
                <p className="text-gray-500 font-['Suisse_Intl',sans-serif]">
                  We continuously embrace new technologies and approaches to enhance the property buying and selling
                  experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-[#011337]/10 to-[#011337]/20 p-6 rounded-2xl border border-[#011337]/20">
              <CheckCircle2 className="h-6 w-6 text-[#011337] mb-4" />
              <h3 className="text-lg font-bold mb-2 text-[#011337]">Premium Curation</h3>
                  <p className="text-slate-600 text-sm">
                    We carefully select only the finest properties that meet our strict criteria for luxury, location,
                    and investment potential.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gold-50 to-gold-100 p-6 rounded-2xl border border-gold-200">
                  <CheckCircle2 className="h-6 w-6 text-gold-600 mb-4" />
                  <h3 className="text-lg font-bold mb-2 text-navy-900">Market Expertise</h3>
                  <p className="text-slate-600 text-sm">
                    Our team provides deep insights into Bangalore's luxury market trends, pricing, and investment
                    opportunities.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200">
                  <CheckCircle2 className="h-6 w-6 text-slate-600 mb-4" />
                  <h3 className="text-lg font-bold mb-2 text-navy-900">Legal Assurance</h3>
                  <p className="text-slate-600 text-sm">
                    We ensure complete legal verification and documentation support for secure and hassle-free
                    transactions.
                  </p>
                </div>

                            <div className="bg-gradient-to-br from-[#011337]/10 to-[#011337]/20 p-6 rounded-2xl border border-[#011337]/20">
              <CheckCircle2 className="h-6 w-6 text-[#011337] mb-4" />
              <h3 className="text-lg font-bold mb-2 text-[#011337]">Personalized Service</h3>
                  <p className="text-slate-600 text-sm">
                    Our dedicated relationship managers provide white-glove service tailored to each client's unique
                    requirements.
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-block rounded-lg bg-gradient-to-r from-navy-100 to-navy-200 px-3 py-1 text-sm text-navy-800 mb-4">
                Our Approach
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-navy-900">Luxury Real Estate by Design</h2>
              <p className="text-slate-600 mb-6">
                At The BLX Realty, luxury isn't just about value—it's about creating exceptional experiences that reflect our
                clients' aspirations and lifestyle goals.
              </p>
              <p className="text-slate-600 mb-6">
                Our comprehensive approach considers every aspect of the property transaction, from initial consultation
                and market analysis to final handover and after-sales support.
              </p>
              <p className="text-slate-600 mb-6">
                The result is a seamless, sophisticated experience that not only meets but exceeds the expectations of
                discerning property buyers and sellers in Bangalore.
              </p>
            </div>
          </div>
        </div>
      </section> */}



      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Join Us in Building a Premium Future</h2>
            <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif]">
              Whether you're seeking your dream luxury property or looking to maximize the value of your premium asset,
              we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/properties">
                <Button
                  size="lg"
                  className="bg-[#011337] hover:bg-[#011337]/90 text-white px-8 py-4 font-['Suisse_Intl',sans-serif] font-medium"
                >
                  Explore Our Properties
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-[#011337]   text-[#ffffff] hover:bg-[#011337]/90 hover:text-white px-8 py-4 font-['Suisse_Intl',sans-serif] font-medium"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
