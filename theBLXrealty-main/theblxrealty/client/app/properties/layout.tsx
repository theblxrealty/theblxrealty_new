import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Premium Properties in Bangalore & London | Houses & Apartments for Sale",
  description: "Browse the exclusive property listings in Bangalore and London by The BLX Realty. Find premium luxury apartments, flats, residential villas, and commercial real estate.",
  alternates: {
    canonical: "/properties"
  }
}

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
