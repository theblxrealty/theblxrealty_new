import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    // Check if Supabase credentials are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Supabase credentials missing!'
      }, { status: 500 })
    }

    // Create Supabase client with service role key for admin access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Test 1: Upload banner images
    console.log('Step 1: Uploading banner images...')
    
    // Upload first banner (placeholder.webp)
    const banner1Path = join(process.cwd(), 'public', 'placeholder.webp')
    const banner1Buffer = readFileSync(banner1Path)
    const banner1File = new File([banner1Buffer], 'banner1.jpg', { type: 'image/jpeg' })
    const banner1FileName = `banner1-${Date.now()}.jpg`
    const banner1FilePath = `properties/${banner1FileName}`

    const { data: banner1Data, error: banner1Error } = await supabase.storage
      .from('images')
      .upload(banner1FilePath, banner1File, { cacheControl: '3600', upsert: false })

    if (banner1Error) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Banner 1 upload failed', 
        error: banner1Error.message 
      }, { status: 500 })
    }

    // Upload second banner (wcu_1.webp)
    const banner2Path = join(process.cwd(), 'public', 'wcu_1.webp')
    const banner2Buffer = readFileSync(banner2Path)
    const banner2File = new File([banner2Buffer], 'banner2.webp', { type: 'image/webp' })
    const banner2FileName = `banner2-${Date.now()}.webp`
    const banner2FilePath = `properties/${banner2FileName}`

    const { data: banner2Data, error: banner2Error } = await supabase.storage
      .from('images')
      .upload(banner2FilePath, banner2File, { cacheControl: '3600', upsert: false })

    if (banner2Error) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Banner 2 upload failed', 
        error: banner2Error.message 
      }, { status: 500 })
    }

    // Upload additional images (image1.webp, image2.webp, image3.webp)
    console.log('Step 2: Uploading additional images...')
    
    const additionalImages = ['image1.webp', 'image2.webp', 'image3.webp']
    const uploadedAdditionalImages = []

    for (const imageName of additionalImages) {
      const imagePath = join(process.cwd(), 'public', imageName)
      const imageBuffer = readFileSync(imagePath)
      const imageFile = new File([imageBuffer], imageName, { type: 'image/webp' })
      const fileName = `additional-${Date.now()}-${imageName}`
      const filePath = `properties/${fileName}`

      const { data: imageData, error: imageError } = await supabase.storage
        .from('images')
        .upload(filePath, imageFile, { cacheControl: '3600', upsert: false })

      if (imageError) {
        console.error(`Failed to upload ${imageName}:`, imageError)
        continue
      }

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(imageData.path)

      uploadedAdditionalImages.push(urlData.publicUrl)
    }

    // Get public URLs for banners
    const { data: banner1UrlData } = supabase.storage
      .from('images')
      .getPublicUrl(banner1Data.path)

    const { data: banner2UrlData } = supabase.storage
      .from('images')
      .getPublicUrl(banner2Data.path)

    // Test 3: Create property in database with image URLs
    console.log('Step 3: Creating property in database...')
    
    const propertyData = {
      title: 'Test Property with Images',
      description: 'This is a test property created to verify image upload and database storage functionality',
      price: 750000,
      location: 'Test Location, Test City',
      latitude: 12.9716,
      longitude: 77.5946,
      propertyType: 'house',
      propertyCategory: 'residential',
      bedrooms: 4,
      bathrooms: 3,
      area: 2000,
      propertyBanner1: banner1UrlData.publicUrl,
      propertyBanner2: banner2UrlData.publicUrl,
      additionalImages: uploadedAdditionalImages,
      adminId: 'test-admin-id', // Since we're bypassing auth
      isActive: true
    }

    const property = await prisma.property.create({
      data: propertyData,
      include: {
        admin: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    console.log('Property created successfully:', property.id)

    return NextResponse.json({ 
      status: 'success', 
      message: 'Complete admin property creation flow tested successfully!',
      uploadedImages: {
        banner1: {
          path: banner1Data.path,
          url: banner1UrlData.publicUrl
        },
        banner2: {
          path: banner2Data.path,
          url: banner2UrlData.publicUrl
        },
        additionalImages: uploadedAdditionalImages
      },
      createdProperty: {
        id: property.id,
        title: property.title,
        propertyBanner1: property.propertyBanner1,
        propertyBanner2: property.propertyBanner2,
        additionalImages: property.additionalImages
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Test failed:', error)
    return NextResponse.json({ 
      status: 'error', 
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
