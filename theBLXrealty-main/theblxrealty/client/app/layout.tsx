import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AutoRegisterPrompt from "@/components/auto-register-prompt"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "The BLX Realty | Premium Real Estate in Bangalore",
  description:
    "Find your dream property in Bangalore with The BLX Realty. Expert guidance for buying, selling, and renting properties across the city's prime locations.",
  generator: 'v0.dev',
  icons: {
    icon: [


      { url: '/logo2.webp', sizes: '64x64', type: 'image/jpeg' },
      { url: '/logo2.webp', sizes: '48x48', type: 'image/jpeg' },
      { url: '/logo2.webp', sizes: '32x32', type: 'image/jpeg' },
    ],
    shortcut: '/logo2.webp',                    
    apple: [
      { url: '/logo2.webp', sizes: '192x192', type: 'image/jpeg' },
      { url: '/logo2.webp', sizes: '180x180', type: 'image/jpeg' },
 
    ],
  },
}

const globalJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://theblxrealty.com/#organization",
      "name": "The BLX Realty",
      "url": "https://theblxrealty.com",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://theblxrealty.com/#logo",
        "url": "https://theblxrealty.com/logo2.webp",
        "caption": "The BLX Realty Logo"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9743264328",
        "contactType": "sales",
        "areaServed": ["IN", "GB"],
        "availableLanguage": ["English", "Hindi", "Kannada"]
      },
      "sameAs": [
        "https://www.facebook.com/theblxrealty",
        "https://www.instagram.com/theblxrealty",
        "https://www.linkedin.com/company/theblxrealty"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://theblxrealty.com/#website",
      "url": "https://theblxrealty.com",
      "name": "The BLX Realty",
      "publisher": {
        "@id": "https://theblxrealty.com/#organization"
      }
    }
  ]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }}
        />
        <Providers>
          <Header />
          {children}
          <Footer />
          <AutoRegisterPrompt />
        </Providers>
      </body>
    </html>
  )
}
