import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendBulkNewsletterEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { blogId } = await request.json()

    if (!blogId) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      )
    }

    // Get the blog post details
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: blogId }
    })

    if (!blogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    if (!blogPost.isPublished || !blogPost.publishedAt) {
      return NextResponse.json(
        { error: 'Blog post is not published' },
        { status: 400 }
      )
    }

    // Get all active newsletter subscribers
    const subscribers = await prisma.newsletterSubscription.findMany({
      where: { isActive: true },
      select: { email: true }
    })

    if (subscribers.length === 0) {
      return NextResponse.json(
        { message: 'No active subscribers found' },
        { status: 200 }
      )
    }

    const subscriberEmails = subscribers.map(sub => sub.email)

    // Prepare newsletter data
    const newsletterData = {
      blogTitle: blogPost.title,
      blogExcerpt: blogPost.excerpt || blogPost.content.substring(0, 150) + '...',
      blogUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/blog/${blogPost.slug}`,
      category: blogPost.category || 'General',
      publishedDate: blogPost.publishedAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // Send newsletter emails to all subscribers
    const results = await sendBulkNewsletterEmail(subscriberEmails, newsletterData)

    // Count successful and failed emails
    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    return NextResponse.json({
      message: 'Newsletter sent successfully',
      totalSubscribers: subscriberEmails.length,
      successful,
      failed,
      blogTitle: blogPost.title
    })

  } catch (error) {
    console.error('Newsletter sending error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
