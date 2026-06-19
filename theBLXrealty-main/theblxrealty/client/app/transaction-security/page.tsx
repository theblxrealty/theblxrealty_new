 
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
          Buying or selling property involves critical legal and financial processes. 
          Our dedicated team ensures transparency, compliance, and protection at every step. 
          From legal verification and documentation to financing assistance and secure transaction management, 
          we provide the complete support you need for a worry-free property experience.
        </p>
      </div>

      {/* Service Highlights */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 p-8">
        <ServiceCard title="Legal Verification">
          Thorough due diligence of property documents, title deeds, and ownership 
          records to ensure clear and dispute-free transactions.
        </ServiceCard>

        <ServiceCard title="Documentation Support">
          Drafting, reviewing, and verifying agreements, MoUs, and registration papers 
          handled by experts for seamless paperwork.
        </ServiceCard>

        <ServiceCard title="Financing Assistance">
          End-to-end support in securing loans, connecting with financial institutions, 
          and obtaining the best terms for your investment.
        </ServiceCard>

        <ServiceCard title="Regulatory Compliance">
          Guidance to comply with all local laws, RERA regulations, and municipal approvals, 
          ensuring every transaction is fully legal.
        </ServiceCard>

        <ServiceCard title="Secure Payments">
          Transparent financial management and structured payment schedules, protecting both buyers and sellers.
        </ServiceCard>

        <ServiceCard title="End-to-End Transaction Management">
          A single-window approach that covers every step—from property verification to 
          deal closure—providing peace of mind throughout.
        </ServiceCard>
      </section>

      {/* Call to Action */}
      <div className="max-w-5xl mx-auto mt-8 mb-16 p-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
        <h2 className="text-2xl font-bold mb-3">
          Looking for a Secure and Hassle-Free Property Transaction?
        </h2>
        <p className="mb-4 text-gray-700">
          Our experts ensure that your real estate journey is legally sound, 
          financially secure, and completely transparent.
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
