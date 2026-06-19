import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const baseUrl = 'https://theblxrealty.com'
  let properties: { id: string; title: string; propertyBanner1: string | null }[] = []
  
  try {
    properties = await prisma.property.findMany({
      where: { isActive: true },
      select: { id: true, title: true, propertyBanner1: true },
    })
  } catch (e) {
    console.warn('Sitemap images query failed:', e)
  }

  const escapeXml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  const imageUrls = properties
    .filter((prop) => prop.propertyBanner1)
    .map((prop) => {
      const imgPath = prop.propertyBanner1!.startsWith('/') 
        ? `${baseUrl}${prop.propertyBanner1}` 
        : prop.propertyBanner1!
        
      return `
  <url>
    <loc>${baseUrl}/properties/${prop.id}</loc>
    <image:image>
      <image:loc>${escapeXml(imgPath)}</image:loc>
      <image:title>${escapeXml(prop.title)}</image:title>
    </image:image>
  </url>`
    }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.0">
  ${imageUrls}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=600',
    },
  })
}
