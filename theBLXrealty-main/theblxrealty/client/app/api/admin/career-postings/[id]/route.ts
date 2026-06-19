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

const CareerPostingUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  location: z.string().min(1, "Location is required").optional(),
  type: z.enum(["Full-time", "Part-time", "Contract", "Internship"]).optional(),
  salary: z.string().optional(),
  experience: z.string().min(1, "Experience is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const posting = await prisma.careerPosting.findUnique({
      where: { id }
    })

    if (!posting) {
      return NextResponse.json(
        { error: 'Career posting not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(posting)
  } catch (error) {
    console.error('Fetch single career posting error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update career posting
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    const validatedData = CareerPostingUpdateSchema.safeParse(body)
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors },
        { status: 400 }
      )
    }

    // Check if career posting exists
    const existingPosting = await prisma.careerPosting.findUnique({
      where: { id }
    })

    if (!existingPosting) {
      return NextResponse.json(
        { error: 'Career posting not found' },
        { status: 404 }
      )
    }

    const updatedPosting = await prisma.careerPosting.update({
      where: { id },
      data: validatedData.data,
    })

    return NextResponse.json({
      message: 'Career posting updated successfully',
      posting: updatedPosting,
    })

  } catch (error) {
    console.error('Update career posting error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete career posting
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    
    // Check if career posting exists
    const posting = await prisma.careerPosting.findUnique({
      where: { id }
    })

    if (!posting) {
      return NextResponse.json(
        { error: 'Career posting not found' },
        { status: 404 }
      )
    }

    // Delete the career posting
    await prisma.careerPosting.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Career posting deleted successfully'
    })

  } catch (error) {
    console.error('Delete career posting error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
