import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Building, Award, Shield, TrendingUp, MapPin, Phone, Mail, UserCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import HeroSection from "@/components/hero-section"
import PropertyCarousel from "@/components/property-carousel"
import FeaturedProperties from "@/components/featured-properties"
import TeamMember from "@/components/team-member"
import ChannelPartnersSlider from "@/components/channel-partners-slider"
import ContactForm from "@/components/contact-form"
import LatestInsights from "@/components/latest-insights"
import Email from "next-auth/providers/email"


// Sample team data
const teamMembers = [
{
    name: "Nishchith Umesh",
    role: "Founder & CEO",
    image: "/nishchith.webp?height=400&width=400",
    bio: `
<p>
Nishchith Umesh is a visionary entrepreneur and seasoned property investor, driven by a commitment to transforming landscapes across India and internationally.
</p>
<br />
<p>
Serving as Managing Director & CEO at <strong>Stonesbridge Developers India</strong> and <strong>NUE Properties Ltd London</strong>, he has built a reputation for leadership within the real estate sector, developing impactful projects and pioneering innovative business strategies.
</p>
<br />
<p>
Nishchith combines years of hands-on experience with a global perspective, enabling him to guide clients and teams through every stage of property buying, selling, and investment.
</p>
<br />
<p>
With roots in the UK property market and substantial expertise in both Indian and overseas real estate, Nishchith brings <strong>strategic insight, integrity, and client-focused passion</strong> to The BLX Realty. His approach centers on helping people achieve their dreams of home ownership and investment success, while upholding the highest standards of professionalism and service.
</p>
<br />
<p>
Under his leadership, The BLX Realty continues to expand its footprint, empower its clients, and build thriving communities.
</p>
<br />
<h3 class="font-bold mt-4 mb-2">Key Highlights</h3>
<ul class="list-disc ml-6 space-y-2">
  <li><strong>Visionary entrepreneurship:</strong> Renowned for leading and innovating in property investment and development.</li>
  <li><strong>Global experience:</strong> Direct involvement in real estate markets throughout India, UK, Dubai and overseas.</li>
  <li><strong>Client-driven approach:</strong> Focused on unlocking property opportunities and guiding clients to realize their dreams.</li>
  <li><strong>Commitment to excellence:</strong> Dedicated to ethical business practices and professional growth for the entire The BLX Realty team.</li>
</ul>
`
  },

  // {
  //   name: "Michael Chen",
  //   role: "Chief Investment Officer",
  //   image: "/placeholder.svg?height=400&width=400",
  //   bio: "Michael specializes in commercial real estate investments and has successfully managed property portfolios worth over ₹500 crores across Bangalore.",
  // },
  // { 
  //   name: "Emily Rodriguez",
  //   role: "Head of Luxury Sales",
  //   image: "/placeholder.svg?height=400&width=400",
  //   bio: "Emily leads our luxury property division and has facilitated transactions for some of Bangalore's most prestigious residential and commercial properties.",
  // },
  // {
  //   name: "David Wilson",
  //   role: "Director of Client Relations",
  //   image: "/placeholder.svg?height=400&width=400",
  //   bio: "David ensures exceptional client experiences and has built lasting relationships with high-net-worth individuals and institutional investors.",
  // },
]

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      {/* Property Carousel Section */}
      <PropertyCarousel />

      {/* Property Valuation Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-4xl font-bold mb-6 text-black heading-hover-bounce" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Free Property Valuation & Real Estate Services | BLXREALTY?</h2>
              <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif]">
                We provide reliable, data-driven property valuations based on the latest local market insights - helping homeowners, landlords, and sellers make confident decisions.
              </p>
              <Link href="/contact">
                <Button className="bg-[#011337]  hover:bg-[#011337]/90 text-white px-8 py-4 font-['Suisse_Intl',sans-serif] font-medium">
                  Book your free valuation
                </Button>
              </Link>
            </div>
            <div className="relative h-[250px] w-full bg-gray-50 overflow-hidden">
              <Image
                src="/property-value.webp"
                alt="Luxury property interior"
                fill
                className="object-cover image-hover-bounce"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dream Properties Section */}
      <section className="py-4 md:py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative h-[600px] w-full overflow-hidden">
                <Image
                  src="/image1.webp?height=2560&width=2560"
                  alt="Luxury interior with chandelier"
                  fill
                  className="object-cover image-hover-bounce"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-4xl font-bold mb-6 text-black heading-hover-bounce" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Discover Your Dream Home with BLXREALTY</h2>
              <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif]">
                We use your vision of the perfect home as our blueprint for action. With passion, local expertise and personalised care, BLXREALTY will match you with a property that fits your life — not just your budget.
              </p>
              <div className="space-y-8">
                <Link href="/contact" className="group cursor-pointer block">
                  <div className="text-black font-['Suisse_Intl',sans-serif] relative inline-block" style={{fontSize: '1.2rem', fontWeight: 550, lineHeight: 1}}>
                    Sell with us
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#011337]  transition-all duration-300 group-hover:w-full"></span>
                  </div>
                </Link>
                <Link href="/properties" className="group cursor-pointer block">
                  <div className="text-black font-['Suisse_Intl',sans-serif] relative inline-block" style={{fontSize: '1.2rem', fontWeight: 550, lineHeight: 1}}>
                    Buy with us
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#011337]  transition-all duration-300 group-hover:w-full"></span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* We're here for you Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-4xl font-bold mb-6 text-black heading-hover-bounce" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>We're here for you</h2>
              <br />
              <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif]">
                Buy or Sell Property in Bengaluru, London & World Wide
              </p>
               
               
              <div className="mb-8">
                <div className="flex items-start">
                  <blockquote className="text-3xl font-bold text-black mb-6 leading-tight flex-1" style={{fontFamily: 'Tiempos Headline, serif', lineHeight: 1.2, fontWeight: '500'}}>
                    "From luxury apartments in Bengaluru to prime real estate in London, our team is aware of the local markets and the needs of buyers around the world, ensuring that your property journey is smooth, no matter where it begins or ends."
                  </blockquote>
                </div>
                
              </div>
            </div>
            <div className="relative h-[450px] w-full overflow-hidden">
              <Image
                src="/image2.webp?height=2560&width=2560"
                alt="Woman with teacup"
                fill
                className="object-cover image-hover-bounce"
              />
              
            </div>
            {/* <div className="mt-6">
                  <div className="font-bold text-black text-lg font-['Suisse_Intl',sans-serif]"> Loana Grace</div>
                  <div className="text-gray-600">Sale team lead London-The BLX Realty</div>
                </div> */}
          </div>
        </div>
      </section>

      {/* The View from Knight Frank Section */}
      {/* <section className="py-16 md:py-24 bg-white justify-between">
        <div className="container mx-auto px-8 sm:px-6 lg:px-8 justify-between">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative h-[600px] w-full">
                <Image
                  src="/image3.webp?height=2560&width=2560"
                  alt="Woman looking through window"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-4xl font-bold mb-6 text-black" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>The View from The BLX Realty</h2>
              <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif]">
                Dream property inspiration, the latest on luxury trends, and insights into the best areas to live in the Bangalore.
              </p>
              <button className="border border-white text-white px-8 py-3 rounded hover:bg-white hover:text-[#011337] transition-colors font-semibold">
                Visit The View
              </button>
            </div>
          </div>
        </div>
      </section> */}



      {/* Testimonials */}
      {/* <section className="py-20 bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Hear from discerning property buyers and sellers who achieved their real estate goals with The BLX Realty.
            </p>
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-4xl font-bold mb-6 text-black heading-hover-bounce" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Why The BLX Realty?</h2>
            <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif] max-w-3xl mx-auto">
             The BLX Realty is the leading luxury property marketplace in Bengaluru and London, connecting discerning buyers and sellers across residential, commercial and investment properties. We have become the trusted platform for NRIs to search for, buy, and sell properties across borders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

      {/* Card 1 */}
      <Link href="/portfolio" className="relative h-60 shadow-lg overflow-hidden group block transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
        <Image
          src="/wcu_1.webp"
          alt="Premium Property Portfolio"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105 image-hover-bounce"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#011337]/95 via-[#011337]/60 to-transparent transition-opacity duration-300 group-hover:from-[#011337]/98 group-hover:via-[#011337]/70"></div>
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h3 className="text-lg font-bold mb-2 text-white font-['Suisse_Intl',sans-serif]">
            Premium Property Portfolio
          </h3>
          <p className="text-white/90 font-['Suisse_Intl',sans-serif] leading-relaxed text-sm">
            
            Buy Premium Properties in Bangalore - Ready & Off Plan
          </p>
        </div>
      </Link>

      {/* Card 2 */}
      <Link href="/insights" className="relative h-60 shadow-lg overflow-hidden group block transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
        <Image
          src="/wcu_2.webp"
          alt="Expert Market Insights"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105 image-hover-bounce"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#011337]/95 via-[#011337]/60 to-transparent transition-opacity duration-300 group-hover:from-[#011337]/98 group-hover:via-[#011337]/70"></div>
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h3 className="text-lg font-bold mb-2 text-white font-['Suisse_Intl',sans-serif]">
            Expert Market Insights
          </h3>
          <p className="text-white/90 font-['Suisse_Intl',sans-serif] leading-relaxed text-sm">
            Bengaluru Real Estate Market Insights & Investment Advisory | BLXREALTY
          </p>
        </div>
      </Link>

      {/* Card 3 */}
      <Link href="/transaction-security" className="relative h-60 shadow-lg overflow-hidden group block transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
        <Image
          src="/wcu_3.webp"
          alt="Complete Transaction Security"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105 image-hover-bounce"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#011337]/95 via-[#011337]/60 to-transparent transition-opacity duration-300 group-hover:from-[#011337]/98 group-hover:via-[#011337]/70"></div>
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h3 className="text-lg font-bold mb-2 text-white font-['Suisse_Intl',sans-serif]">
            Transaction Security
          </h3>
          <p className="text-white/90 font-['Suisse_Intl',sans-serif] leading-relaxed text-sm">
            End-to-end support with legal verification and secure management.
          </p>
        </div>
      </Link>

      {/* Card 4 */}
      <Link href="/financing" className="relative h-60 shadow-lg overflow-hidden group block transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
        <Image
          src="/wcu_4.webp"
          alt="Mortgage & Financing Assistance"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105 image-hover-bounce"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#011337]/95 via-[#011337]/60 to-transparent transition-opacity duration-300 group-hover:from-[#011337]/98 group-hover:via-[#011337]/70"></div>
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h3 className="text-lg font-bold mb-2 text-white font-['Suisse_Intl',sans-serif]">
            Financing Assistance
          </h3>
          <p className="text-white/90 font-['Suisse_Intl',sans-serif] leading-relaxed text-sm">
            Connecting with top-tier institutions for competitive rates and flexible terms.
          </p>
        </div>
      </Link>
    </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-4xl font-bold mb-6 text-black heading-hover-bounce" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Meet the Experts</h2>
            <p className="text-lg text-gray-500 font-['Suisse_Intl',sans-serif]">
              Our diverse team of professionals brings together expertise in luxury real estate, investment analysis,
              and client relations to deliver exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMember key={index} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Channel Partners Slider */}
      <ChannelPartnersSlider />

      {/* Latest Market Insights & Recent Blogs */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-4xl font-bold mb-6 text-black heading-hover-bounce font-tiempos" style={{ fontFamily: 'Tiempos Headline, serif', fontWeight: '400' }}>
              Latest Market Insights
            </h2>
            <p className="text-lg text-gray-500 font-suisse">
              Stay updated with premium real estate guides, neighborhood showcases, and professional valuation advice.
            </p>
          </div>
          <LatestInsights />
        </div>
      </section>

      {/* Our Success Stories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-4xl font-bold mb-6 text-black heading-hover-bounce" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Our Success Stories</h2>
            <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif] max-w-3xl mx-auto">
              Hear from discerning property buyers and sellers who achieved their real estate goals with BLX Realty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Success Story 1 */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-4 bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <UserCircle2 className="w-12 h-12 text-gray-400" />
                </div>
                <blockquote className="text-base md:text-[14px] text-gray-700 mb-4 font-['Suisse_Intl',sans-serif] leading-relaxed">
                  “I had a great experience working with this BLX Realty for selling my property. Their team handled everything professionally — from property marketing and client visits to negotiations and paperwork. They found genuine buyers quickly and ensured the entire process was transparent and hassle-free. What impressed me most was their regular updates and honest approach throughout the transaction. I would definitely recommend them to anyone looking to sell their property with confidence.”
                </blockquote>
              </div>
              <div>
                <div className="font-bold text-black text-base font-['Suisse_Intl',sans-serif]">Suresh K</div>
                <div className="text-gray-500 text-xs">Seller - JP Nagar Bengaluru</div>
              </div>
            </div>

            {/* Success Story 2 */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-4 bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <UserCircle2 className="w-12 h-12 text-gray-400" />
                </div>
                <blockquote className="text-base md:text-[14px] text-gray-700 mb-4 font-['Suisse_Intl',sans-serif] leading-relaxed">
                  “We were searching for a trustworthy real estate company while living in the Middle East, and the entire experience turned out to be smooth and stress-free. The BLX team was very professional, transparent, and always available to answer our questions despite the time difference. They helped us find the right property, handled all the documentation clearly, and guided us through every step until registration. As an NRI buyer, trust and communication were most important for us, and they exceeded our expectations. Highly recommended for anyone looking to invest in property from abroad.”
                </blockquote>
              </div>
              <div>
                <div className="font-bold text-black text-base font-['Suisse_Intl',sans-serif]">Lenin Krishnan</div>
                <div className="text-gray-500 text-xs">NRI Buyer</div>
              </div>
            </div>

            {/* Success Story 3 */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-4 bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <UserCircle2 className="w-12 h-12 text-gray-400" />
                </div>
                <blockquote className="text-base md:text-[14px] text-gray-700 mb-4 font-['Suisse_Intl',sans-serif] leading-relaxed">
                  “Recently bought an apartment in Godrej Aveline through BLX and honestly the whole process was pretty smooth. They have got very good knowledge about Banglore market and they were helpful and easy to reach, and cleared all our doubts patiently. Really happy with the support and overall experience.”
                </blockquote>
              </div>
              <div>
                <div className="font-bold text-black text-base font-['Suisse_Intl',sans-serif]">Rajesh</div>
                <div className="text-gray-500 text-xs">Buyer - Bengaluru </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-4xl font-bold mb-6 text-black" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Ready to Buy or Sell?</h2>
              <p className="text-lg text-gray-500 mb-8 font-['Suisse_Intl',sans-serif]">
                Whether you're seeking a luxury property or looking to sell your premium asset, our expert team provides
                personalized guidance throughout your real estate journey.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#011337] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-black text-lg font-['Suisse_Intl',sans-serif]">Visit Our Premium Office</h3>
                    <p className="text-gray-500 font-['Suisse_Intl',sans-serif] text-sm leading-relaxed">#0301D 3rd floor, Brigade Twin Towers Ward No. 38, No. 11/1-4 Pipeline Road HMT, Yeswanthpur, Bengaluru, Karnataka 560022, India</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#011337] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-black text-lg font-['Suisse_Intl',sans-serif]">Call Our Experts</h3>
                    <p className="text-gray-500 font-['Suisse_Intl',sans-serif] text-sm">+91 9743264328</p>
                  </div>
              </div>

              <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#011337] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-black text-lg font-['Suisse_Intl',sans-serif]">Email</h3>
                    <p className="text-gray-500 font-['Suisse_Intl',sans-serif] text-sm">Discoverblr@theblxrealty.com</p>
                  </div>
              </div>

              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "LocalBusiness",
                "@id": "https://theblxrealty.com/#localbusiness",
                "name": "The BLX Realty Office",
                "image": "https://theblxrealty.com/logo2.webp",
                "telePhone": "+91 9743264328",
                "email": "Discoverblr@theblxrealty.com",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "#0301D 3rd floor, Brigade Twin Towers Ward No. 38, No. 11/1-4 Pipeline Road HMT, Yeswanthpur",
                  "addressLocality": "Bengaluru",
                  "addressRegion": "Karnataka",
                  "postalCode": "560022",
                  "addressCountry": "IN"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": 13.0292,
                  "longitude": 77.5401
                }
              },
              {
                "@type": "Service",
                "@id": "https://theblxrealty.com/#service-valuation",
                "name": "Free Real Estate Valuation",
                "provider": {
                  "@id": "https://theblxrealty.com/#organization"
                },
                "serviceType": "Property Valuation",
                "areaServed": "IN"
              },
              {
                "@type": "Service",
                "@id": "https://theblxrealty.com/#service-financing",
                "name": "Mortgage & Financing Assistance",
                "provider": {
                  "@id": "https://theblxrealty.com/#organization"
                },
                "serviceType": "Financing Brokerage",
                "areaServed": "IN"
              },
              {
                "@type": "VideoObject",
                "name": "The BLX Realty Luxury Showcase",
                "description": "Showcase of premium flats, apartments, and luxury villas globally and in Bangalore.",
                "thumbnailUrl": "https://theblxrealty.com/property-value.webp",
                "uploadDate": "2026-05-27T00:00:00Z",
                "contentUrl": "https://theblxrealty.com/home-banner2-optimized.webm"
              }
            ]
          })
        }}
      />
    </main>
  )
}
