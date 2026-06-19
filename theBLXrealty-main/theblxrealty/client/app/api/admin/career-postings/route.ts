import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

// Middleware to verify admin token
const verifyAdminToken = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)
  
  if (!decoded || decoded.type !== 'admin') {
    return null
  }

  return decoded
}

// Schema for validating career posting creation
const careerPostingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.string().min(1, 'Type is required'),
  salary: z.string().optional(),
  experience: z.string().min(1, 'Experience is required'),
  description: z.string().min(1, 'Description is required'),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
})

// GET - Get all career postings for admin management
export async function GET(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [postings, total] = await Promise.all([
      prisma.careerPosting.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.careerPosting.count()
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
    console.error('Get career postings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new career posting
export async function POST(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedBody = careerPostingSchema.safeParse(body)

    if (!validatedBody.success) {
      return NextResponse.json(
        { error: 'Validation Error', details: validatedBody.error.errors.map(e => e.message) },
        { status: 400 }
      )
    }

    const { title, location, type, salary, experience, description, requirements, benefits, isActive } = validatedBody.data

    const newPosting = await prisma.careerPosting.create({
      data: {
        title,
        location,
        type,
        salary,
        experience,
        description,
        requirements: requirements || [],
        benefits: benefits || [],
        isActive,
      },
    })

    return NextResponse.json({
      message: 'Career posting created successfully',
      posting: newPosting,
    }, { status: 201 })

  } catch (error) {
    console.error('Create career posting error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
