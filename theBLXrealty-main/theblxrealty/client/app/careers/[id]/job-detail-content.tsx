"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, DollarSign, Building, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface CareerPosting {
  id: string
  title: string
  location: string
  type: string
  salary?: string
  experience: string
  description: string
  requirements: string[]
  benefits: string[]
  createdAt: string
}

export default function JobDetailContent() {
  const params = useParams()
  const router = useRouter()
  const [jobPosting, setJobPosting] = useState<CareerPosting | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchJobDetail(params.id as string)
    }
  }, [params.id])

  const fetchJobDetail = async (id: string) => {
    try {
      const response = await fetch(`/api/career-postings/${id}`)
      if (response.ok) {
        const data = await response.json()
        setJobPosting(data)
      } else {
        setError('Failed to fetch job posting details')
        toast.error('Failed to fetch job posting details')
      }
    } catch (err) {
      console.warn('Error fetching job detail:', err)
      setError('An unexpected error occurred')
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-40 pb-8 flex items-center justify-center">
        <div className="text-lg text-gray-700">Loading job details...</div>
      </div>
    )
  }

  if (error || !jobPosting) {
    return (
      <div className="min-h-screen bg-gray-50 pt-40 pb-8 flex items-center justify-center">
        <div className="text-[#011337] text-lg">{error || 'Job posting not found.'}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center text-white p-4"
        style={{
          backgroundImage: 'url(/carrer-banner.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif"
            style={{ fontFamily: 'Tiempos Headline, serif', fontWeight: '400' }}>
            {jobPosting.title}
          </h1>
          <p className="text-lg md:text-xl font-['Suisse_Intl',sans-serif]">
            <MapPin className="inline-block h-5 w-5 mr-2" />
            {jobPosting.location} - {jobPosting.type}
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex justify-start mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="text-gray-700 hover:text-[#011337]">
            <ChevronLeft className="h-5 w-5 mr-2" /> Back to Job Listings
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Job Description and Details */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif"
              style={{ fontFamily: 'Tiempos Headline, serif', fontWeight: '400' }}>
              Job Description
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6 font-['Suisse_Intl',sans-serif]">
              {jobPosting.description}
            </p>

            {jobPosting.requirements && jobPosting.requirements.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif"
                  style={{ fontFamily: 'Tiempos Headline, serif', fontWeight: '400' }}>
                  Requirements
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 font-['Suisse_Intl',sans-serif]">
                  {jobPosting.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {jobPosting.benefits && jobPosting.benefits.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif"
                  style={{ fontFamily: 'Tiempos Headline, serif', fontWeight: '400' }}>
                  Benefits
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 font-['Suisse_Intl',sans-serif]">
                  {jobPosting.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8">
              <Link href={`/careers?position=${encodeURIComponent(jobPosting.title)}&location=${encodeURIComponent(jobPosting.location)}`}>
                <Button size="lg" className="bg-[#011337] hover:bg-[#011337]/90 text-white font-['Suisse_Intl',sans-serif]">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Job Information Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif"
              style={{ fontFamily: 'Tiempos Headline, serif', fontWeight: '400' }}>
              Job Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center text-gray-700 font-['Suisse_Intl',sans-serif]">
                <Clock className="h-5 w-5 mr-3 text-[#011337]" />
                <div>
                  <p className="font-semibold">Date Posted</p>
                  <p>{new Date(jobPosting.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700 font-['Suisse_Intl',sans-serif]">
                <Building className="h-5 w-5 mr-3 text-[#011337]" />
                <div>
                  <p className="font-semibold">Job Type</p>
                  <p>{jobPosting.type}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700 font-['Suisse_Intl',sans-serif]">
                <MapPin className="h-5 w-5 mr-3 text-[#011337]" />
                <div>
                  <p className="font-semibold">Location</p>
                  <p>{jobPosting.location}</p>
                </div>
              </div>
              {jobPosting.experience && (
                <div className="flex items-center text-gray-700 font-['Suisse_Intl',sans-serif]">
                  <Clock className="h-5 w-5 mr-3 text-[#011337]" />
                  <div>
                    <p className="font-semibold">Experience</p>
                    <p>{jobPosting.experience}</p>
                  </div>
                </div>
              )}
              {jobPosting.salary && (
                <div className="flex items-center text-gray-700 font-['Suisse_Intl',sans-serif]">
                  <DollarSign className="h-5 w-5 mr-3 text-[#011337]" />
                  <div>
                    <p className="font-semibold">Salary</p>
                    <p>{jobPosting.salary}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Removed Share This Job Section */}
          </div>
        </div>
      </div>
    </div>
  )
}
