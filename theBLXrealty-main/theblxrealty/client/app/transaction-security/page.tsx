 
import Image from "next/image";
import Link from "next/link";

export default function CompleteTransactionSecurity() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[100vh] w-full">
        <Image
          src="/wcu_4.webp" // replace with your hero image
          alt="Complete Transaction Security"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 
                  className="font-bold mb-6 font-serif animate-slide-up text-white" 
                  style={{ fontFamily: 'Tiempos Headline, serif', fontSize: '60px', fontWeight: '400' }}
                >
            Complete Transaction Security
          </h1>
        </div>
      </div>

      {/* Intro Section */}
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        <h2 className="text-3xl font-bold">End-to-End Secure Real Estate Transactions</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
         Buying and selling property in Bengaluru involves important legal and financial processes. BLXREALTY’s dedicated team guarantees complete transparency, RERA compliance and buyer protection throughout the process – from legal verification and title due diligence to home loan assistance and secure transaction management. We provide you with the full support you need to make a worry-free and fraud-free property purchase.
        </p>
      </div>

      {/* Service Highlights */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 p-8">
        <ServiceCard title="Legal Verification">
          Full legal due diligence of property documents, title deeds, encumbrance certificates and ownership records – ensuring clear title and dispute-free property transactions in Bengaluru.
        </ServiceCard>

        <ServiceCard title="Documentation Support">
          Expert drafting, reviewing, and verifying of sale agreements, sale deeds, and property registration papers — ensuring seamless, legally compliant documentation for your purchase.
        </ServiceCard>

        <ServiceCard title="Financing Assistance">
          We offer comprehensive support for home loans, connecting you with reputable banks and financial institutions to secure the best interest rates and terms for property investments in Bengaluru.
        </ServiceCard>

        <ServiceCard title="Regulatory Compliance">
          Full guidance on RERA rules, approvals from Karnataka municipal authorities, stamp duty compliance and local property laws – so that every transaction is 100% legal and covered from A to Z.
        </ServiceCard>

        <ServiceCard title="Secure Payments">
          Structured payment schedules for properties and transparent financial management – all safe and fraud-free, protecting both buyers and sellers throughout the transaction.
        </ServiceCard>

        <ServiceCard title="End-to-End Transaction Management">
          Single-window property transaction management system for all your property needs - from property verification and legal checks to deal closure and handing over possession. Complete peace of mind for your purchase.
        </ServiceCard>
      </section>

      {/* Call to Action */}
      <div className="max-w-5xl mx-auto mt-8 mb-16 p-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
        <h2 className="text-2xl font-bold mb-3">
          Looking for a Secure and Hassle-Free Property Transaction?
        </h2>
        <p className="mb-4 text-gray-700">
          Our property transaction experts in Bengaluru ensure your real estate journey is legally sound, financially secure, and completely transparent — from first site visit to final registration.
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
