import Link from "next/link"

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#011337] to-[#17346e] px-6 sm:px-10 py-10 text-white">
            <h1
              className="text-3xl sm:text-4xl mb-4"
              style={{ fontFamily: "Tiempos Headline, serif", fontWeight: "400" }}
            >
              Terms and Conditions
            </h1>
            <p className="text-white/90 font-['Suisse_Intl',sans-serif] text-sm sm:text-base">
              Last updated: April 20, 2026
            </p>
          </div>

          <div className="px-6 sm:px-10 py-10 space-y-8 text-gray-700 font-['Suisse_Intl',sans-serif] leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-2xl text-[#011337]" style={{ fontFamily: "Tiempos Headline, serif", fontWeight: "500" }}>
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using The BLX Realty website and services, you agree to be bound by these Terms and
                Conditions. If you do not agree with any part of these terms, please do not use this website.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-[#011337]" style={{ fontFamily: "Tiempos Headline, serif", fontWeight: "500" }}>
                2. Services and Information
              </h2>
              <p>
                The BLX Realty provides real estate listings, consulting, and related support services. Property
                descriptions, prices, availability, specifications, and images are provided for general informational
                purposes and may change without prior notice.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-[#011337]" style={{ fontFamily: "Tiempos Headline, serif", fontWeight: "500" }}>
                3. User Responsibilities
              </h2>
              <p>You agree to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide accurate and complete information when submitting forms.</li>
                <li>Use the website only for lawful and genuine real estate inquiry purposes.</li>
                <li>Not attempt unauthorized access to any part of the website, APIs, or related systems.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-[#011337]" style={{ fontFamily: "Tiempos Headline, serif", fontWeight: "500" }}>
                4. Property Listings and Availability
              </h2>
              <p>
                Listings are subject to availability, seller confirmation, legal verification, and market conditions.
                The BLX Realty does not guarantee that every listed property will remain available at the displayed
                price or terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-[#011337]" style={{ fontFamily: "Tiempos Headline, serif", fontWeight: "500" }}>
                5. Financial and Legal Disclaimer
              </h2>
              <p>
                Content on this website does not constitute legal, tax, or financial advice. You should seek guidance
                from qualified legal and financial professionals before making purchase, sale, investment, or financing
                decisions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-[#011337]" style={{ fontFamily: "Tiempos Headline, serif", fontWeight: "500" }}>
                6. Intellectual Property
              </h2>
              <p>
                All website content including logos, text, graphics, and design elements are owned by or licensed to
                The BLX Realty. You may not copy, reproduce, republish, or distribute this content without prior
                written consent.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-[#011337]" style={{ fontFamily: "Tiempos Headline, serif", fontWeight: "500" }}>
                7. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, The BLX Realty shall not be liable for indirect, incidental,
                special, or consequential damages arising from use of this website, reliance on listing content, or
                inability to access the platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-[#011337]" style={{ fontFamily: "Tiempos Headline, serif", fontWeight: "500" }}>
                8. Privacy
              </h2>
              <p>
                Your use of this website is also governed by our data handling practices. Information submitted through
                contact, newsletter, and property inquiry forms may be used to provide services and support.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-[#011337]" style={{ fontFamily: "Tiempos Headline, serif", fontWeight: "500" }}>
                9. Changes to Terms
              </h2>
              <p>
                We may update these Terms and Conditions at any time. Updated terms will be posted on this page with a
                revised last-updated date. Continued use of the website after updates constitutes acceptance of the
                revised terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-[#011337]" style={{ fontFamily: "Tiempos Headline, serif", fontWeight: "500" }}>
                10. Contact Information
              </h2>
              <p>If you have questions regarding these Terms and Conditions, please contact us:</p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-1 text-sm sm:text-base">
                <p>
                  Email: <a href="mailto:Discoverblr@theblxrealty.com" className="text-[#17346e] hover:underline">Discoverblr@theblxrealty.com</a>
                </p>
                <p>Phone: +91 8197773166</p>
              </div>
            </section>

            <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 rounded-md bg-[#011337] text-white hover:bg-[#011337]/90 transition-colors"
              >
                Back to Home
              </Link>
              <Link
                href="/contact#contact-information"
                className="inline-flex items-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
