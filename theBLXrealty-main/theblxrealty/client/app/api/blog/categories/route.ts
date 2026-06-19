import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get unique blog categories
export async function GET(request: NextRequest) {
  try {
    // Fetch all published blog posts and get unique categories
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        isPublished: true,
        category: {
          not: null
        }
      },
      select: {
        category: true
      },
      distinct: ['category']
    })

    // Extract and clean the categories
    const categories = blogPosts
      .map(p => p.category)
      .filter((category): category is string => category !== null && category.trim() !== '')
      .sort()

    return NextResponse.json({
      success: true,
      categories
    })
  } catch (error) {
    console.warn('Error fetching blog categories:', error)
    return NextResponse.json({
      success: true,
      categories: [
        "Legal",
        "Investment",
        "Market",
        "Guide",
        "News",
        "Tips"
      ],
      fallback: true
    })
  }
}
