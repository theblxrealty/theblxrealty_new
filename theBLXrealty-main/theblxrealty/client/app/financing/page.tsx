 
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
                  Mortgage Financing Assistance
                </h1>
        </div>
      </div>

      {/* Intro Section */}
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        <h2 className="text-3xl font-bold">
          Trusted partners for easier property financing
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          BLXREALTY will make the home loan and property financing process easy by connecting you to the best banks and financial institutions in Bengaluru, providing home loans at competitive interest rates and flexible repayment terms. We want to help you make smart financing choices that match your property investment strategy and long-term financial goals.
        </p>
      </div>

      {/* Service Highlights */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 p-8">
        <ServiceCard title="Loan Consultation">
          Customised home loan consultation to help you select the right mortgage, housing loan or finance plan - customised to your income, repayment capacity and property investment aspirations.
        </ServiceCard>

        <ServiceCard title="Bank Partnerships">
          Exclusive tie-ups with top banks and NBFCs for home loan interest rates, lower processing fees, and quick loan approvals for property buyers in Bengaluru.
        </ServiceCard>

        <ServiceCard title="Flexible Financing Options">
          Avail home loan products from fixed to floating rate mortgages for first-time buyers, seasoned investors and NRIs looking to buy property in Bengaluru.
        </ServiceCard>

        <ServiceCard title="Eligibility & Pre-Approval">
         Check your home loan eligibility for free & get pre-approval help to improve your buying position & get your property fast in Bengaluru. Know your borrowing power.
        </ServiceCard>

        <ServiceCard title="End-to-End Documentation">
          Full support in the collection, verification and submission of all home loan documents like income proof, property papers, KYC, and bank statements for quick and hassle-free loan approval in Bengaluru.
        </ServiceCard>

        <ServiceCard title="Strategic Advisory">
          Expert Advice on Real Estate Financing: How to Align Your Home Loan Options with Long Term Investment Strategy, Section 24 Tax Benefits on Home Loan Interest and Property Portfolio Growth.
        </ServiceCard>
      </section>

      {/* Call to Action */}
      <div className="max-w-5xl mx-auto mt-8 mb-16 p-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
        <h2 className="text-2xl font-bold mb-3">
          Need Help with Home Loan & Property Financing in Bengaluru?
        </h2>
        <p className="mb-4 text-gray-700">
          Speak to our home loan experts in Bengaluru today and get the right financing solutions, best interest rates, and complete documentation support for your property purchase.
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
