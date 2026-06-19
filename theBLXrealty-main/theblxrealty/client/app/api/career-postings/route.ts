import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get all active career postings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const locations = searchParams.getAll('location')

    const whereClause: any = {
      isActive: true,
    }

    if (locations.length > 0) {
      whereClause.location = { in: locations }
    }

    const [postings, total] = await Promise.all([
      prisma.careerPosting.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit
      }),
      prisma.careerPosting.count({
        where: whereClause,
      })
    ])

    return NextResponse.json({
      postings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.warn('Get active career postings error:', error)
    return NextResponse.json({
      postings: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      },
      fallback: true
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, location, type, salary, experience, responsibilities, qualifications, education, benefits } = body

    // Basic validation
    if (!title || !description || !location || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Combine responsibilities, qualifications, and education into requirements
    const combinedRequirements: string[] = []
    if (Array.isArray(responsibilities)) {
      combinedRequirements.push(...responsibilities)
    } else if (typeof responsibilities === 'string' && responsibilities) {
      combinedRequirements.push(responsibilities)
    }
    if (Array.isArray(qualifications)) {
      combinedRequirements.push(...qualifications)
    } else if (typeof qualifications === 'string' && qualifications) {
      combinedRequirements.push(qualifications)
    }
    if (typeof education === 'string' && education) {
      combinedRequirements.push(`Education: ${education}`)
    }

    const newPosting = await prisma.careerPosting.create({
      data: {
        title,
        description,
        location,
        type,
        salary,
        experience,
        requirements: combinedRequirements,
        benefits: Array.isArray(benefits) ? benefits : [],
        isActive: true, // New postings are active by default
      },
    })

    return NextResponse.json(newPosting, { status: 201 })
  } catch (error) {
    console.error('Create career posting error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}