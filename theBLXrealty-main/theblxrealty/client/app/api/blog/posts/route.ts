import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get all published blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const slug = searchParams.get('slug')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const whereClause: any = {
      isPublished: true,
      publishedAt: {
        not: null
      }
    }

    // If slug is provided, search by slug instead of other filters
    if (slug) {
      whereClause.slug = slug
    } else {
      if (category) {
        whereClause.category = category
      }

      if (search) {
        whereClause.OR = [
          {
            title: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            excerpt: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            content: {
              contains: search,
              mode: 'insensitive'
            }
          }
        ]
      }
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: whereClause,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: {
          publishedAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.blogPost.count({
        where: whereClause
      })
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.warn('Get blog posts error:', error)
    return NextResponse.json({
      posts: [],
      pagination: {
        page: 1,
        limit: 100,
        total: 0,
        totalPages: 0
      },
      fallback: true
    })
  }
} 