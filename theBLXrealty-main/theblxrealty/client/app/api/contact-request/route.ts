import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendContactRequestEmail } from '@/lib/email'
import { validateContactRequest } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    // Validate all data including spam prevention
    const validation = await validateContactRequest({
      name,
      email,
      phone,
      message
    }, request)

    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validation.errors
        },
        { status: 400 }
      )
    }

    // Check if user exists by email first (priority)
    let user = await prisma.user.findUnique({
      where: { email }
    })

    // If no user found by email, check by phone
    if (!user) {
      user = await prisma.user.findUnique({
        where: { phone }
      })
    }

    if (!user) {
      // Create new user
      const [firstName, ...lastNameParts] = name.split(' ')
      const lastName = lastNameParts.join(' ') || ''
      
      try {
        user = await prisma.user.create({
          data: {
            email,
            phone,
            firstName,
            lastName,
            password: 'temp-password-' + Math.random().toString(36).substring(7) // Temporary password
          }
        })
              } catch (createError: any) {
          // Handle unique constraint violations
          if (createError.code === 'P2002') {
            // If creation fails due to unique constraint, check if user exists
            const existingUser = await prisma.user.findUnique({
              where: { email }
            })
            
            if (existingUser) {
              user = existingUser
            } else {
              return NextResponse.json(
                { error: 'Phone number already exists with different email. Please use a different phone number.' },
                { status: 400 }
              )
            }
          } else {
            throw createError
          }
        }
    } else {
      // User exists, use their existing record without updating
      console.log('Using existing user:', user.id)
    }

    // Create contact request
    console.log('Creating contact request for user:', user.id)
    const contactRequest = await prisma.contactRequest.create({
      data: {
        userId: user.id,
        name,
        email,
        phone,
        message,
        status: 'pending'
      }
    })
    console.log('Contact request created:', contactRequest.id)

    // Send email notification
    const emailResult = await sendContactRequestEmail({
      name,
      email,
      phone,
      message
    })

    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error)
      // Continue with the request even if email fails
    }

    return NextResponse.json({
      message: 'Contact request submitted successfully',
      requestId: contactRequest.id,
      emailSent: emailResult.success
    }, { status: 201 })

  } catch (error) {
    console.error('Contact request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 