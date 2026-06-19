"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  category: string
  author: {
    firstName: string
    lastName: string
  }
}

export default function LatestInsights() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLatestBlogs() {
      try {
        const res = await fetch("/api/blog/posts?limit=3")
        if (res.ok) {
          const data = await res.json()
          setPosts(data.posts || [])
        }
      } catch (err) {
        console.warn("Failed to fetch latest blogs:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchLatestBlogs()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#011337]"></div>
      </div>
    )
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article key={post.slug} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-[#011337]/5 text-[#011337] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {post.category}
              </span>
              <span className="text-gray-400 text-xs flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-black mb-3 leading-snug font-tiempos" style={{ fontFamily: 'Tiempos Headline, serif', fontWeight: '400' }}>
              {post.title}
            </h3>
            
            <p className="text-gray-500 text-sm leading-relaxed mb-6 font-suisse line-clamp-3">
              {post.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <User className="h-3 w-3" />
              {post.author ? `${post.author.firstName} ${post.author.lastName}` : "The BLX Realty"}
            </span>
            
            <Link href={`/blog/${post.slug}`} className="text-[#011337] hover:text-[#011337]/70 font-semibold text-sm flex items-center gap-1 group">
              Read More
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}
