import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, User, Tag, ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Metadata } from "next"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featuredImage?: string
  category?: string
  tags: string[]
  isPublished: boolean
  publishedAt?: string
  createdAt: string
  redirectUrl?: string // Add redirectUrl here
  author: {
    id: string
    firstName?: string
    lastName?: string
    email: string
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params

  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      isPublished: true,
      publishedAt: { not: null },
    },
  })

  if (!post) {
    return {
      title: "Blog Post Not Found | The BLX Realty",
      description: "The requested blog post could not be found.",
    }
  }

  const title = `${post.title} | The BLX Realty Blog`
  const description = post.excerpt || `Read our blog post about ${post.title}`
  const ogImage = post.featuredImage || "/logo.svg"

  return {
    title,
    description,
    alternates: {
      canonical: `https://theblxrealty.com/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://theblxrealty.com/blog/${slug}`,
      images: [
        {
          url: ogImage,
          alt: post.title,
        },
      ],
      publishedTime: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ["The BLX Realty Team"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      isPublished: true,
      publishedAt: { not: null },
    },
  })

  if (!post) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://theblxrealty.com/blog/${post.slug}`,
    },
    "headline": post.title,
    "description": post.excerpt || `Read our blog post about ${post.title}`,
    "image": post.featuredImage || "https://theblxrealty.com/logo.svg",
    "author": {
      "@type": "Organization",
      "name": "The BLX Realty",
      "url": "https://theblxrealty.com",
    },
    "publisher": {
      "@type": "Organization",
      "name": "The BLX Realty",
      "logo": {
        "@type": "ImageObject",
        "url": "https://theblxrealty.com/logo.svg",
      },
    },
    "datePublished": post.publishedAt || post.createdAt,
    "dateModified": post.updatedAt,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Featured Image as Hero */}
      {post.featuredImage && (
        <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="max-w-4xl mx-auto">
          {/* Back to Blog Posts Button (Top Left) */}
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="outline" className="">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog Posts
              </Button>
            </Link>
          </div>

          {/* Blog Post Header (Title, Category, Meta) */}
          <header className="mb-8">
            {post.category && (
              <span className="inline-block bg-[#011337]/10 text-[#011337] text-sm px-3 py-1 rounded-full font-medium mb-4">
                {post.category}
              </span>
            )}

            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight font-tiempos text-gray-900">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>The BLX Realty</span>
              </div>
            </div>

            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-8 font-suisse leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div 
              className="text-gray-700 leading-relaxed font-['Suisse_Intl',sans-serif]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            >
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 border-t pt-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  )
} 