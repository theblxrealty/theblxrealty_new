// pages/services/expert-market-insights.tsx
import Image from "next/image";
import Link from "next/link";

export default function ExpertMarketInsights() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[100vh] w-full">
        <Image
          src="/wcu_2.webp" // replace with your hero image
          alt="Expert Market Insights & Investment Advisory"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 
                  className="font-bold mb-6 font-serif animate-slide-up text-white" 
                  style={{ fontFamily: 'Tiempos Headline, serif', fontSize: '60px', fontWeight: '400' }}
                >
            Expert Market Insights & Investment Advisory
          </h1>
        </div>
      </div>

      {/* Intro Section */}
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        <h2 className="text-3xl font-bold">Professional Property Valuations & Investment Guidance</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Our Advisory Team offers comprehensive property valuations, real estate market intelligence, and strategic investment advice to buyers and investors in Bangalore and across India. Our certified experts and industry specialists help ensure your property investments align with current market trends and long-term value.
        </p>
      </div>

      {/* Service Highlights */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 p-8">
        <ServiceCard title="Property Valuations">
          Accurate data-driven property valuations to help you find out the real market value of residential, commercial and industrial properties in Bengaluru.
        </ServiceCard>

        <ServiceCard title="Market Research & Trends">
         Comprehensive insights into Bengaluru's property market trends, price movements, and demand-supply dynamics — helping you time your investment with confidence.
        </ServiceCard>

        <ServiceCard title="Investment Advisory">
          Tailored real estate investment strategies for individual and institutional investors, with a focus on risk management, rental yield, and long-term capital appreciation.
        </ServiceCard>

        <ServiceCard title="Portfolio Optimization">
          Expert guidance on restructuring and diversifying your real estate portfolio to maximize returns, minimize risk exposure, and build long-term wealth.
        </ServiceCard>

        <ServiceCard title="Location & Growth Analysis">
          Micro and macro-level studies of Bengaluru's prime growth corridors — including North, South, and East Bengaluru — to help identify the best-performing real estate investments.
        </ServiceCard>

        <ServiceCard title="Expert Consultation">
          One-on-one consultations with certified real estate market specialists to resolve your queries, explore investment opportunities, and plan your property purchase effectively.
        </ServiceCard>
      </section>

      {/* Call to Action */}
      <div className="max-w-5xl mx-auto mt-8 mb-16 p-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
        <h2 className="text-2xl font-bold mb-3">
          Ready to Make Smarter Real Estate Investments?
        </h2>
        <p className="mb-4 text-gray-700">
          Connect with our market experts today and gain valuable insights into Bengaluru's property market that will shape your next real estate investment.
        </p>
        <Link
          href="/contact#contact-information"
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
