import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const baseUrl = 'https://theblxrealty.com'
  let blogPosts: { slug: string; updatedAt: Date }[] = []
  
  try {
    blogPosts = await prisma.blogPost.findMany({
      where: { isPublished: true, publishedAt: { not: null } },
      select: { slug: true, updatedAt: true },
    })
  } catch (e) {
    console.warn('Sitemap blog query failed:', e)
  }

  const blogUrls = blogPosts.map((post) => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt ? post.updatedAt.toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')

  const staticUrls = [
    '/blog',
  ].map((route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${blogUrls}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=600',
    },
  })
}
