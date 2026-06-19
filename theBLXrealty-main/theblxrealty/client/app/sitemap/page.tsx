import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { MapPin, FileText, Home, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'HTML Sitemap | The BLX Realty',
  description: 'Navigate the complete portal of premium residential, commercial, and investment real estate listing directories at The BLX Realty.',
  alternates: {
    canonical: 'https://theblxrealty.com/sitemap',
  },
}

export default async function HtmlSitemapPage() {
  let properties: any[] = []
  let blogPosts: any[] = []

  try {
    properties = await prisma.property.findMany({
      where: { isActive: true },
      select: { id: true, title: true, location: true, propertyType: true },
      orderBy: { createdAt: 'desc' },
      take: 12,
    })
  } catch (e) {
    console.warn('Failed to load sitemap properties:', e)
  }

  try {
    blogPosts = await prisma.blogPost.findMany({
      where: { isPublished: true, publishedAt: { not: null } },
      select: { slug: true, title: true, category: true },
      orderBy: { publishedAt: 'desc' },
      take: 12,
    })
  } catch (e) {
    console.warn('Failed to load sitemap blog posts:', e)
  }

  const staticLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Properties Portal', href: '/properties' },
    { name: 'Insights & Blogs', href: '/blog' },
    { name: 'Careers & Vacancies', href: '/careers' },
    { name: 'Contact & Valuation', href: '/contact' },
    { name: 'Premium Portfolio', href: '/portfolio' },
    { name: 'Financing & Mortgages', href: '/financing' },
    { name: 'Transaction Security', href: '/transaction-security' },
    { name: 'Terms of Service', href: '/terms' },
  ]

  const categories = [
    { name: 'Flats & Apartments', href: '/properties?category=flats' },
    { name: 'Luxury Villas', href: '/properties?category=villas' },
    { name: 'Commercial Spaces', href: '/properties?category=commercial' },
    { name: 'Penthouses', href: '/properties?category=penthouses' },
  ]

  const locations = [
    { name: 'JP Nagar, Bangalore', href: '/properties?location=JP%20Nagar' },
    { name: 'Whitefield, Bangalore', href: '/properties?location=Whitefield' },
    { name: 'Indiranagar, Bangalore', href: '/properties?location=Indiranagar' },
    { name: 'Yeswanthpur, Bangalore', href: '/properties?location=Yeswanthpur' },
    { name: 'London, UK', href: '/properties?location=London' },
  ]

  return (
    <main className="bg-slate-50 min-h-screen py-16 md:py-24 font-suisse">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-tiempos">
            Portal Sitemap
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Find your way around our premium property directories, global real estate services, and recent industry insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Section 1: Corporate Pages */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-3 font-tiempos">
              <Home className="h-6 w-6 text-[#011337]" />
              Corporate Directory
            </h2>
            <ul className="space-y-4">
              {staticLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center justify-between text-slate-600 hover:text-[#011337] group transition-colors">
                    <span>{link.name}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Property Search & Filters */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-3 font-tiempos">
                <MapPin className="h-6 w-6 text-[#011337]" />
                Browse Categories
              </h2>
              <ul className="space-y-4">
                {categories.map((cat) => (
                  <li key={cat.href}>
                    <Link href={cat.href} className="flex items-center justify-between text-slate-600 hover:text-[#011337] group transition-colors">
                      <span>{cat.name}</span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-3 font-tiempos">
                <MapPin className="h-6 w-6 text-[#011337]" />
                Prime Locations
              </h2>
              <ul className="space-y-4">
                {locations.map((loc) => (
                  <li key={loc.href}>
                    <Link href={loc.href} className="flex items-center justify-between text-slate-600 hover:text-[#011337] group transition-colors">
                      <span>{loc.name}</span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 3: Latest Blogs */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-3 font-tiempos">
              <FileText className="h-6 w-6 text-[#011337]" />
              Market Insights & Blogs
            </h2>
            <ul className="space-y-4">
              {blogPosts.length > 0 ? (
                blogPosts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="flex flex-col text-slate-600 hover:text-[#011337] transition-colors group">
                      <span className="font-medium line-clamp-1 group-hover:underline">{post.title}</span>
                      <span className="text-xs text-slate-400 capitalize">{post.category}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-slate-400 text-sm">No blogs posted yet.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Section 4: Showcase Properties */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 flex items-center gap-3 font-tiempos">
            <Home className="h-6 w-6 text-[#011337]" />
            Premium Real Estate Showcases
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {properties.length > 0 ? (
              properties.map((prop) => (
                <Link key={prop.id} href={`/properties/${prop.id}`} className="group p-4 rounded-xl border border-slate-100 hover:border-[#011337]/25 hover:bg-slate-50 transition-all">
                  <div className="text-slate-950 font-semibold text-base line-clamp-1 group-hover:text-[#011337] transition-colors">{prop.title}</div>
                  <div className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="line-clamp-1">{prop.location || 'Bangalore'}</span>
                  </div>
                  <div className="text-xs text-[#011337] font-medium mt-2 capitalize">{prop.propertyType || 'Residential'}</div>
                </Link>
              ))
            ) : (
              <div className="text-slate-400 text-sm col-span-full">No active property listings available.</div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
