import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, authenticateAdmin, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // First try to authenticate as admin
    const admin = await authenticateAdmin(email, password)
    
    if (admin) {
      // Generate JWT token for admin
      const token = generateToken({
        id: admin.id,
        email: admin.email,
        role: admin.role,
        type: 'admin'
      })

      // Remove password from response
      const { password: _, ...adminWithoutPassword } = admin

      // Create response with token in cookie
      const response = NextResponse.json({
        message: 'Admin login successful',
        user: adminWithoutPassword,
        token,
        isAdmin: true
      })

      // Set HTTP-only cookie
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      })

      return response
    }

    // If not admin, try to authenticate as regular user
    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token for user
    const token = generateToken({
      id: user.id,
      email: user.email,
      type: 'user'
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    // Create response with token in cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
      isAdmin: false
    })

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 