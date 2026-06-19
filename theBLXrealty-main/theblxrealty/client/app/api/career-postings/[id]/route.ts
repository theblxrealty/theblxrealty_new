import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const posting = await prisma.careerPosting.findUnique({
      where: { id, isActive: true },
    })

    if (!posting) {
      return NextResponse.json(
        { error: 'Career posting not found or not active' },
        { status: 404 }
      )
    }

    return NextResponse.json(posting)
  } catch (error) {
    console.warn('Error fetching public career posting:', error)
    return NextResponse.json(
      { error: 'Career posting not found or database offline', posting: null, fallback: true }
    )
  }
}
