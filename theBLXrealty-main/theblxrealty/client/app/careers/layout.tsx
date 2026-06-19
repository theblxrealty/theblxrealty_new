import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Careers | Join The BLX Realty Team",
  description: "Build your career in luxury real estate with The BLX Realty. Explore our job openings and apply to join our global team in Bangalore, London, or Dubai.",
  alternates: {
    canonical: "/careers"
  }
}

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
