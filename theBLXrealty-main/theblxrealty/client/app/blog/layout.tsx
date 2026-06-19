import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Real Estate Blog, Market Insights & Trends | The BLX Realty",
  description: "Read the latest real estate market analysis, buying guides, property investment advice, legal tips, and luxury living trends from our expert blog.",
  alternates: {
    canonical: "/blog"
  }
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
