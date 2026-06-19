// pages/services/premium-property-portfolio.tsx
import Image from "next/image";
import Link from "next/link";

export default function PremiumPropertyPortfolio() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[100vh] w-full">
        <Image
          src="/wcu_1.webp" // replace with your hero image
          alt="Premium Property Portfolio"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 
                  className="font-bold mb-6 font-serif animate-slide-up text-white" 
                  style={{ fontFamily: 'Tiempos Headline, serif', fontSize: '60px', fontWeight: '400' }}
                >
            Premium Property Portfolio
          </h1>
        </div>
      </div>

      {/* Intro Section */}
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        <h2 className="text-3xl font-bold">Buy Ready and Off-Plan Properties</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Discover the best of luxury living and investment opportunities in Bengaluru with our handpicked collection of apartments, villas, commercial spaces and more, located in the city's most sought-after areas. Whether you are searching for a ready-to-move-in property or an off-plan investment opportunity, BLXREALTY offers exclusive access to premium projects from trusted developers.
        </p>
      </div>

      {/* Service Highlights */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 p-8">
        <ServiceCard title="Luxury Apartments & Villas">
          Find luxury apartments and villas in Bengaluru featuring modern architecture, premium amenities and prime locations for sophisticated urban living.
        </ServiceCard>

        <ServiceCard title="Commercial Investments">
          Get access to high-yielding offices, retail stores and co-working spaces strategically located in prime commercial hubs of Bengaluru.
        </ServiceCard>

        <ServiceCard title="Off-Plan Opportunities">
          Pre-launch properties in Bengaluru at pre-launch prices with flexible payment plans and high appreciation potential as the project nears completion.
        </ServiceCard>

        <ServiceCard title="Ready-to-Move Properties">
          Get in without delay. Choose from fully completed, legally verified, ready-to-move flats, villas and office spaces available for immediate possession.
        </ServiceCard>

        <ServiceCard title="Verified Developers">
         We work only with trusted, RERA-registered developers – ensuring quality construction, clear property titles and timely project delivery you can count on.
        </ServiceCard>

        <ServiceCard title="End-to-End Support">
          From property selection and documentation to home loans and legal verification, BLXREALTY offers end-to-end guidance for a safe and smooth property purchase.
        </ServiceCard>
      </section>

      {/* Call to Action */}
      <div className="max-w-5xl mx-auto mt-8 mb-16 p-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
        <h2 className="text-2xl font-bold mb-3">
          Ready to Explore Bengaluru's Finest Properties?
        </h2>
        <p className="mb-4 text-gray-700">
         Connect with our team of real estate experts in Bengaluru and discover premium apartments, villas, and investment properties tailored to your needs — from ready-to-move homes to off-plan opportunities across North, South, and East Bengaluru.
        </p>
        <Link
          href="/contact"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}

function ServiceCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700">{children}</p>
    </div>
  );
}
