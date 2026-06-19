import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPropertyViewRequestEmail } from '@/lib/email'
import { validatePropertyViewRequest } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received property view request:', body)
    
    const {
      propertyId,
      firstName,
      lastName,
      email,
      phone,
      title,
      preferredDate,
      preferredTime,
      additionalInfo,
      heardFrom
    } = body

    // Validate all data including spam prevention
    console.log('Starting validation...')
    const validation = await validatePropertyViewRequest({
      propertyId,
      firstName,
      lastName,
      email,
      phone,
      title,
      preferredDate,
      preferredTime,
      additionalInfo,
      heardFrom
    }, request)

    console.log('Validation result:', validation)

    if (!validation.isValid) {
      console.log('Validation failed:', validation.errors)
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validation.errors
        },
        { status: 400 }
      )
    }

    // Get property details for email
    let property = null
    try {
      property = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true, title: true, location: true },
      })
    } catch (error) {
      console.log('Property not found in database, using propertyId as title')
    }

    // If property not found in database, create a mock property object
    if (!property) {
      property = {
        id: propertyId,
        title: propertyId, // Use propertyId as title
        description: 'Property details not available',
        price: null,
        location: 'Location not specified',
        propertyType: 'Unknown',
        propertyCategory: 'flats',
        bedrooms: null,
        bathrooms: null,
        area: null,
        images: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }

    // Check if user exists by phone number, if not create one
    console.log('Checking for existing user with phone:', phone)
    let user = null
    try {
      user = await prisma.user.findUnique({
        where: { phone }
      })
    } catch (error) {
      console.error('Error finding user:', error)
    }

    if (!user) {
      console.log('Creating new user...')
      try {
        // Create new user with all form details
        user = await prisma.user.create({
          data: {
            email,
            phone,
            firstName,
            lastName,
            title,
            password: 'temp-password-' + Math.random().toString(36).substring(7) // Temporary password for non-registered users
          }
        })
        console.log('Created new user for property view request:', user.id)
      } catch (error) {
        console.error('Error creating user:', error)
        throw new Error('Failed to create user: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    } else {
      console.log('Found existing user for property view request:', user.id)
    }

    // Create property view request
    console.log('Creating property view request...')
    let propertyViewRequest = null
    try {
      // First, create a property if it doesn't exist
      let property = null
      try {
        property = await prisma.property.findUnique({
          where: { id: propertyId },
          select: { id: true },
        })
      } catch (error) {
        console.log('Property lookup error:', error)
      }

      if (!property) {
        console.log('Creating property in database...')
        property = await prisma.property.create({
          select: { id: true },
          data: {
            id: propertyId,
            title: `Luxury Property ${propertyId}`,
            description: 'Premium property available for viewing',
            price: null,
            location: 'Bangalore, Karnataka',
            propertyType: 'Residential',
            propertyCategory: 'flats',
            bedrooms: null,
            bathrooms: null,
            area: null,
            isActive: true,
          },
        })
        console.log('Created property:', property.id)
      }

      propertyViewRequest = await prisma.propertyViewRequest.create({
        data: {
          propertyId,
          userId: user.id,
          firstName,
          lastName,
          email,
          phone,
          title,
          preferredDate,
          preferredTime,
          additionalInfo,
          heardFrom,
          status: 'pending'
        }
      })
      console.log('Created property view request:', propertyViewRequest.id)
    } catch (error) {
      console.error('Error creating property view request:', error)
      throw new Error('Failed to create property view request: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }

    // Send email notification
    console.log('Sending email notification...')
    let emailResult = null
    try {
      emailResult = await sendPropertyViewRequestEmail({
        propertyId,
        propertyTitle: property?.title || `Luxury Property ${propertyId}`,
        propertyLocation: property?.location || 'Bangalore, Karnataka',
        firstName,
        lastName,
        email,
        phone,
        title,
        preferredDate,
        preferredTime,
        additionalInfo,
        heardFrom
      })

      if (!emailResult.success) {
        console.error('Email sending failed:', emailResult.error)
        // Continue with the request even if email fails
      } else {
        console.log('Email sent successfully')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      // Continue with the request even if email fails
    }

    return NextResponse.json({
      message: 'Property view request submitted successfully',
      requestId: propertyViewRequest.id,
      emailSent: emailResult ? emailResult.success : false
    }, { status: 201 })

  } catch (error) {
    console.error('Property view request error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 