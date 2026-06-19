import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://theblxrealty.com'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/profile/',
        '/admin-blogs/',
        '/admin-properties/',
        '/admin-careers/',
        '/admin-career-postings/',
        '/addprop/',
        '/add-career-posting/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
