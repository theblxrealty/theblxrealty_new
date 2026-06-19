import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    // Check if Supabase credentials are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Supabase credentials missing!',
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
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

    // Test Supabase storage by listing buckets with admin privileges
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('Storage buckets error:', bucketsError)
      return NextResponse.json({ 
        status: 'error', 
        message: 'Supabase storage not accessible', 
        error: bucketsError.message 
      }, { status: 500 })
    }

    // Test if 'images' bucket exists
    const imagesBucket = buckets?.find(bucket => bucket.name === 'images')
    
    if (!imagesBucket) {
      return NextResponse.json({ 
        status: 'partial', 
        message: 'Supabase is working but images bucket not found',
        availableBuckets: buckets?.map(b => b.name) || [],
        timestamp: new Date().toISOString()
      })
    }

    // Test actual image upload - read placeholder.webp from public folder
    const imagePath = join(process.cwd(), 'public', 'placeholder.webp')
    const imageBuffer = readFileSync(imagePath)
    
    // Create a File object from the buffer
    const testFile = new File([imageBuffer], 'test-placeholder.webp', { type: 'image/jpeg' })
    
    // Generate unique filename
    const fileName = `test-${Date.now()}-placeholder.webp`
    const filePath = `properties/${fileName}`
    
    console.log('Uploading test image to path:', filePath)

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, testFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ 
        status: 'partial', 
        message: 'Supabase storage working but upload failed',
        bucketExists: true,
        uploadError: uploadError.message,
        timestamp: new Date().toISOString()
      })
    }

    // Get public URL for the uploaded image
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(uploadData.path)

    console.log('Upload successful, public URL:', urlData.publicUrl)

    return NextResponse.json({ 
      status: 'success', 
      message: 'Supabase storage is working and image upload successful!',
      bucketExists: true,
      availableBuckets: buckets?.map(b => b.name) || [],
      uploadedFile: {
        path: uploadData.path,
        publicUrl: urlData.publicUrl
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      status: 'error', 
      message: 'Unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
