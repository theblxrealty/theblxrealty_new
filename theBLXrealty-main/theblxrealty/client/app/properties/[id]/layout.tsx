import { Inter } from "next/font/google"
import "../../globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "The BLX Realty| Premium Real Estate in Bangalore",
  description:
    "Find your dream property in Bangalore with The BLX Realty. Expert guidance for buying, selling, and renting properties across the city's prime locations.",
    generator: 'v0.dev'
}

export default function PropertyDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
