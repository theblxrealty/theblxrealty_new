import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendCareerApplicationEmail } from '@/lib/email'
import { validateCareerApplication } from '@/lib/validation'
import { supabase } from '@/lib/supabaseClient' // Import Supabase client
import { Buffer } from 'buffer'; // Import Buffer

// Helper function to upload Base64 file to Supabase
async function uploadBase64ToSupabase(base64Data: string, fileName: string, bucket: string) {
  const  fileExt  = fileName.split('.').pop();
  const  mimetype  = `application/${fileExt === 'pdf' ? 'pdf' : 'octet-stream'}`;
  
  // Convert Base64 to ArrayBuffer
  const base64WithoutPrefix = base64Data.split(',')[1];
  const imageBuffer = Buffer.from(base64WithoutPrefix, 'base64');

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, imageBuffer, {
      contentType: mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return publicUrlData.publicUrl;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      experience,
      message,
      resume,
      location // Add location to validation
    } = body

    // Validate all data including spam prevention
    const validation = await validateCareerApplication({
      firstName,
      lastName,
      email,
      phone,
      position,
      experience,
      message,
      resume,
      location // Add location to validation
    }, request)

    if (!validation.isValid) {
      console.error('Career application validation failed:', validation.errors)
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validation.errors
        },
        { status: 400 }
      )
    }

    // Check if user exists, if not create one
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          phone,
          firstName,
          lastName,
          password: 'temp-password-' + Math.random().toString(36).substring(7) // Temporary password
        }
      })
    }

    // Supabase resume upload
    let resumeUrl: string | null = null;
    if (resume) {
      try {
        const uniqueFileName = `resumes/${email}_${position.replace(/\s+/g, '-')}_${Date.now()}.pdf`;
        resumeUrl = await uploadBase64ToSupabase(resume, uniqueFileName, 'career-resumes');
      } catch (uploadError: any) {
        console.error('Error uploading resume to Supabase:', uploadError.message, uploadError.stack);
        // Continue without resume if upload fails, or return an error
        return NextResponse.json(
          { error: 'Failed to upload resume', details: uploadError.message },
          { status: 500 }
        );
      }
    }

    // Create career application in database
    const careerApplication = await prisma.careerApplication.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        email,
        phone,
        position,
        experience,
        message,
        resume: resumeUrl, // Store Supabase URL here
        status: 'pending',
        location, // Store the location
      }
    })

    // Send email notification
    const emailResult = await sendCareerApplicationEmail({
      firstName,
      lastName,
      email,
      phone,
      position,
      experience,
      message,
      resume: resumeUrl || undefined, // Pass Supabase URL to email function
      location // Pass location to email function
    })

    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error)
      // Continue with the request even if email fails
    }

    return NextResponse.json({
      message: 'Career application submitted successfully',
      applicationId: careerApplication.id,
      emailSent: emailResult.success
    }, { status: 201 })

  } catch (error: any) {
    console.error('Career application error:', error.message, error.stack)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
} 