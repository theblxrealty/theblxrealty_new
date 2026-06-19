 
import Image from "next/image";
import Link from "next/link";

export default function MortgageFinancingAssistance() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[100vh] w-full">
        <Image
          src="/wcu_3.webp" // replace with your hero image
          alt="Mortgage & Financing Assistance"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 
                  className="font-bold mb-6 font-serif animate-slide-up text-white" 
                  style={{ fontFamily: 'Tiempos Headline, serif', fontSize: '60px', fontWeight: '400' }}
                >
                  Mortgage FinancingAssistance
                </h1>
        </div>
      </div>

      {/* Intro Section */}
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        <h2 className="text-3xl font-bold">
          Simplifying Property Financing with Trusted Partners
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          We simplify the financing process by connecting you with top-tier
          financial institutions offering competitive rates and flexible terms.
          Our goal is to ensure you make well-informed decisions that align with
          your property investment strategy and long-term financial goals.
        </p>
      </div>

      {/* Service Highlights */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 p-8">
        <ServiceCard title="Loan Consultation">
          Personalized guidance on choosing the right mortgage or financing plan
          tailored to your needs and repayment capacity.
        </ServiceCard>

        <ServiceCard title="Bank Partnerships">
          Exclusive tie-ups with leading banks and financial institutions
          offering preferential interest rates and fast approvals.
        </ServiceCard>

        <ServiceCard title="Flexible Financing Options">
          Access to a variety of mortgage products—from fixed-rate to floating—
          designed to suit different investor profiles.
        </ServiceCard>

        <ServiceCard title="Eligibility & Pre-Approval">
          Assistance with eligibility checks and pre-approvals to strengthen
          your buying position and speed up property acquisition.
        </ServiceCard>

        <ServiceCard title="End-to-End Documentation">
          Complete support in gathering, reviewing, and submitting financial
          documents required for seamless loan approval.
        </ServiceCard>

        <ServiceCard title="Strategic Advisory">
          Expert advice on aligning financing choices with long-term investment
          strategy, tax benefits, and portfolio growth.
        </ServiceCard>
      </section>

      {/* Call to Action */}
      <div className="max-w-5xl mx-auto mt-8 mb-16 p-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
        <h2 className="text-2xl font-bold mb-3">
          Need Help with Mortgage & Financing?
        </h2>
        <p className="mb-4 text-gray-700">
          Speak to our experts today and get the right financing solutions for
          your property purchase.
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
