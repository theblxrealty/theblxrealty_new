import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const baseUrl = 'https://theblxrealty.com'
  let properties: { id: string; updatedAt: Date }[] = []
  
  try {
    properties = await prisma.property.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
    })
  } catch (e) {
    console.warn('Sitemap properties query failed:', e)
  }

  const propertyUrls = properties.map((prop) => `
  <url>
    <loc>${baseUrl}/properties/${prop.id}</loc>
    <lastmod>${prop.updatedAt ? prop.updatedAt.toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')

  const staticUrls = [
    '/properties',
  ].map((route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${propertyUrls}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=600',
    },
  })
}
