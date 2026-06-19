import { NextRequest, NextResponse } from 'next/server'
import { prisma, getPrismaConnectionUrl } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    // Get properties count
    const propertiesCount = await prisma.property.count()
    
    // Get environment info (without sensitive data)
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasDirectUrl: !!process.env.DIRECT_URL,
      prismaUsesDirectUrl: getPrismaConnectionUrl().includes(':5432'),
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasAzureTenantId: !!process.env.AZURE_TENANT_ID,
      hasAzureClientId: !!process.env.AZURE_CLIENT_ID,
      hasAzureClientSecret: !!process.env.AZURE_CLIENT_SECRET,
      hasEmailFrom: !!process.env.EMAIL_FROM,
      hasGoogleMapsApi: !!process.env.GOOGLE_MAPS_API,
      hasNextPublicGoogleMapsApi: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API
    }

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      propertiesCount,
      environment: envInfo,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 