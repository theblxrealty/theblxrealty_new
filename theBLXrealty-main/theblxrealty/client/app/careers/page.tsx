"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import Link from "next/link" // Import Link for navigation
import { Checkbox } from "@/components/ui/checkbox"
import { useSearchParams } from 'next/navigation'

import { Upload, Send, MapPin, Clock, DollarSign, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
// import { uploadImage } from "@/lib/uploadImage" // Removed import

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
}

function CareersContent() {
  const [activeTab, setActiveTab] = useState<'apply' | 'jobs'>('jobs') // Default to 'jobs' tab
  const [jobPostings, setJobPostings] = useState<CareerPosting[]>([])
  const [loadingPostings, setLoadingPostings] = useState(true)
  const [errorPostings, setErrorPostings] = useState<string | null>(null)
  
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    message: "",
    resume: null as string | null, // Changed type to string | null
    submitted: false,
    loading: false,
    error: "",
    // uploadingResume: false, // Removed this state
    location: "", // Add location to formState
  })

  const [availableLocations, setAvailableLocations] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])

  const searchParams = useSearchParams() // Initialize useSearchParams

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const queryParams = new URLSearchParams()
        selectedLocations.forEach(loc => queryParams.append('location', loc))
        const queryString = queryParams.toString()
        
        const response = await fetch(`/api/career-postings${queryString ? `?${queryString}` : ''}`)
        if (response.ok) {
          const data: { postings: CareerPosting[] } = await response.json()
          setJobPostings(data.postings)
          // Extract unique locations for filters
          const uniqueLocations = Array.from(new Set(data.postings.map((job: CareerPosting) => job.location)))
          setAvailableLocations(uniqueLocations)
        } else {
          setErrorPostings('Failed to fetch job postings')
        }
      } catch (error) {
        console.warn('Error fetching job postings:', error)
        setErrorPostings('Failed to fetch job postings')
      } finally {
        setLoadingPostings(false)
      }
    }
    fetchJobPostings()
  }, [selectedLocations]) // Rerun fetch when selectedLocations change

  useEffect(() => {
    const positionFromUrl = searchParams.get('position')
    const locationFromUrl = searchParams.get('location') // Get location from URL

    if (positionFromUrl) {
      setActiveTab('apply')
      setFormState(prev => ({
        ...prev,
        position: positionFromUrl,
        ...(locationFromUrl && { location: locationFromUrl }), // Set location if present
      }))
    }
  }, [searchParams])

  const handleLocationFilterChange = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location)
        ? prev.filter(loc => loc !== location)
        : [...prev, location]
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file) // Read file as Base64
      reader.onload = () => {
    setFormState((prev) => ({
      ...prev,
          resume: reader.result as string, // Store Base64 string
        }))
      }
      reader.onerror = (error) => {
        console.warn("Error reading file:", error)
        toast.error("Failed to read resume file.")
        setFormState((prev) => ({ ...prev, resume: null }))
      }
    } else {
      setFormState((prev) => ({ ...prev, resume: null }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState((prev) => ({ ...prev, loading: true, error: "" }))

    // Removed resume upload logic as it's now handled by reading file as Base64

    try {
      const response = await fetch('/api/career-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
          phone: formState.phone,
          position: formState.position,
          experience: formState.experience,
          message: formState.message,
          resume: formState.resume, // Pass the Base64 resume string directly
          location: formState.location, // Pass location
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setFormState((prev) => ({
          ...prev,
          submitted: true,
          loading: false,
          error: "",
        }))
        toast.success('Application submitted successfully!')
      } else {
        console.warn('Form submission failed:', data.error)
        // Handle validation errors specifically
        let errorMessage = data.error || 'Form submission failed. Please try again.'
        
        if (data.details && Array.isArray(data.details)) {
          errorMessage = data.details.join(', ')
        }
        
        setFormState((prev) => ({ 
          ...prev, 
          loading: false,
          error: errorMessage
        }))
        toast.error(errorMessage)
      }
    } catch (error) {
      console.warn('Form submission error:', error)
      setFormState((prev) => ({ 
        ...prev, 
        loading: false,
        error: 'Network error. Please check your connection and try again.'
      }))
      toast.error('Network error. Please check your connection and try again.')
    }
  }

  const positionOptions = jobPostings.map(job => job.title)

  const experienceOptions = [
    "Entry Level (0-1 years)",
    "Mid Level (2-5 years)",
    "Senior Level (5-10 years)",
    "Executive Level (10+ years)"
  ]

  if (formState.submitted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 pt-16 z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-lg">
          <div className="mx-auto w-12 h-12 bg-[#011337]/10 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-[#011337]"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Application Submitted!</h3>
          <p className="text-gray-600 text-sm mb-4 font-['Suisse_Intl',sans-serif]">
            Thank you for your interest in joining our team. We'll review your application and get back to you soon.
          </p>
          <Button
            onClick={() => setFormState((prev) => ({ ...prev, submitted: false }))}
            variant="outline"
            size="sm"
            className="w-full font-['Suisse_Intl',sans-serif]"
          >
            Submit Another Application
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Image - Full Height */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/carrer-banner.webp"
          alt="Join our professional team"
          fill
          className="object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-16">
        {/* Content Section */}
        <div className="flex items-center justify-center p-4 py-16 lg:py-24 min-h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
            {/* Left Side - Title and Description */}
            <div 
              className="flex flex-col justify-center text-white lg:pr-8 animate-fade-in"
            >
              <h1 
                className="font-bold mb-6 font-serif text-4xl lg:text-6xl animate-slide-up" 
                style={{ fontFamily: 'Tiempos Headline, serif', fontWeight: '400' }}
              >
                Join Our Team
              </h1>
              <p 
                className="text-lg mb-6 font-['Suisse_Intl',sans-serif] leading-relaxed animate-slide-up-delay-1"
              >
                Build your career with us in the dynamic world of luxury real estate. We're looking for passionate 
                professionals to{" "}
                <button 
                  onClick={() => setActiveTab('jobs')}
                  className="underline hover:text-[#011337]/70 transition-colors cursor-pointer"
                >
                  join our growing team
                </button>.
              </p>

              {/* Location Filters */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl mt-8">
                <h3 className="text-xl font-bold text-black mb-4" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>
                  Filter by Location
                </h3>
                <div className="space-y-3">
                  {availableLocations.map(location => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox 
                        id={location}
                        checked={selectedLocations.includes(location)}
                        onCheckedChange={() => handleLocationFilterChange(location)}
                      />
                      <label
                        htmlFor={location}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-800"
                      >
                        {location} ({jobPostings.filter(job => job.location === location).length})
                      </label>
                    </div>
                  ))}
                  {availableLocations.length === 0 && <p className="text-sm text-gray-500">No locations available</p>}
                </div>
              </div>

            </div>

            {/* Right Side - Content */}
            <div className="flex items-start lg:items-center">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 lg:p-8 w-full shadow-2xl">
                {/* Tab Navigation */}
                <div className="flex mb-6 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`px-4 py-2 font-['Suisse_Intl',sans-serif] font-medium transition-colors ${
                      activeTab === 'jobs'
                        ? 'text-[#011337]  border-b-2 border-[#011337] '
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Job Listings
                  </button>
                </div>

                {activeTab === 'apply' ? (
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-black" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>
                        Apply Now
                      </h2>
                      <p className="text-gray-600 font-['Suisse_Intl',sans-serif] text-sm">
                        Tell us about yourself and the role you're interested in.
                      </p>
                    </div>

              {/* Error Display */}
              {formState.error && (
                <div className="bg-[#011337]/5 border border-[#011337]/20 rounded-md p-3 mb-4">
                  <p className="text-[#011337] text-sm font-['Suisse_Intl',sans-serif]">
                    {formState.error}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-['Suisse_Intl',sans-serif] font-medium">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formState.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="mt-1 font-['Suisse_Intl',sans-serif]"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-sm font-['Suisse_Intl',sans-serif] font-medium">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formState.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className="mt-1 font-['Suisse_Intl',sans-serif]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-['Suisse_Intl',sans-serif] font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="mt-1 font-['Suisse_Intl',sans-serif]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-['Suisse_Intl',sans-serif] font-medium">
                    Phone Number *\
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formState.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="mt-1 font-['Suisse_Intl',sans-serif]"
                    required
                  />
                </div>

                {/* Position and Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-['Suisse_Intl',sans-serif] font-medium">
                      Position of Interest *
                    </Label>
                    <Select
                      value={formState.position}
                      onValueChange={(value) => handleSelectChange('position', value)}
                      required
                    >
                      <SelectTrigger className="mt-1 font-['Suisse_Intl',sans-serif]">
                        <SelectValue placeholder="Select a position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positionOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-['Suisse_Intl',sans-serif] font-medium">
                      Experience Level *
                    </Label>
                    <Select
                      value={formState.experience}
                      onValueChange={(value) => handleSelectChange('experience', value)}
                      required
                    >
                      <SelectTrigger className="mt-1 font-['Suisse_Intl',sans-serif]">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location Field - Always display a Select for user input */}
                <div>
                  <Label className="text-sm font-['Suisse_Intl',sans-serif] font-medium">
                    Location *
                  </Label>
                  <Select
                    value={formState.location}
                    onValueChange={(value) => handleSelectChange('location', value)}
                    required
                  >
                    <SelectTrigger className="mt-1 font-['Suisse_Intl',sans-serif]">
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLocations.length === 0 ? (
                        <div className="p-2 text-sm text-gray-500">No locations available</div>
                      ) : (
                        availableLocations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message" className="text-sm font-['Suisse_Intl',sans-serif] font-medium">
                    Tell us about your interests and qualifications *\
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Share your relevant experience, skills, and why you're interested in joining our team..."
                    rows={4}
                    className="mt-1 font-['Suisse_Intl',sans-serif] resize-none"
                    required
                  />
                </div>

                {/* Resume Upload */}
                <div>
                  <Label htmlFor="resume" className="text-sm font-['Suisse_Intl',sans-serif] font-medium">
                    Resume/CV <span className="text-gray-400">(optional)</span>
                  </Label>
                  <div className="mt-1">
                    <label
                      htmlFor="resume"
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-2 pb-2">
                        <Upload className="w-6 h-6 mb-2 text-gray-500" />
                        <p className="mb-1 text-sm text-gray-500 font-['Suisse_Intl',sans-serif]">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 font-['Suisse_Intl',sans-serif]">
                          PDF, DOC, or DOCX (MAX. 5MB)
                        </p>
                        {formState.resume && (
                          <p className="mt-1 text-sm text-[#011337] font-['Suisse_Intl',sans-serif]">
                            Selected: {formState.resume.split(',')[1].substring(0, 20)}...\
                          </p>
                        )}
                      </div>
                      <input
                        id="resume"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={formState.loading}
                    className="w-full bg-[#011337] hover:bg-[#011337]/90 text-white py-3 font-['Suisse_Intl',sans-serif] font-medium transition-colors"
                  >
                    {formState.loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting Application...\
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>

                {/* Privacy Notice */}
                <div className="pt-2 text-center">
                  <p className="text-xs text-gray-600 font-['Suisse_Intl',sans-serif]">
                    By submitting this application, you agree to our{" "}
                    <a href="/privacy" className="font-bold text-black underline">Privacy Policy</a> and{" "}
                    <a href="/terms" className="font-bold text-black underline">Terms of Service</a>.
                  </p>
                </div>
                </form>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-black" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>
                    Open Positions
                  </h2>
                  <p className="text-gray-600 font-['Suisse_Intl',sans-serif] text-sm">
                    Explore our current job openings and find the perfect role for your career.
                  </p>
                </div>

                {loadingPostings ? (
                  <div className="text-center py-12 text-gray-500">Loading job postings...</div>
                ) : errorPostings ? (
                  <div className="text-center py-12 text-[#011337]">Error: {errorPostings}</div>
                ) : jobPostings.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">No job postings available at the moment.</div>
                ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {jobPostings.map((job) => (
                    <Link href={`/careers/${job.id}`} key={job.id}>
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-[#011337]/50 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg text-black font-['Suisse_Intl',sans-serif]">
                          {job.title}
                        </h3>
                        {/* Optional: Display job type/date like in the first screenshot */}
                        <div className="text-sm text-gray-500 font-['Suisse_Intl',sans-serif] flex-shrink-0">
                          {job.type}
                          {/* Add creation date if available and desired */}
                          {/* {job.createdAt && <span className="ml-2">{new Date(job.createdAt).toLocaleDateString()}</span>} */}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="font-['Suisse_Intl',sans-serif]">{job.location}</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm font-['Suisse_Intl',sans-serif] line-clamp-2">
                        {job.description}
                      </p>
                      
                      {/* Removed Apply Now button from here as the entire card will be clickable */}
                      {/* Removed detailed requirements and benefits from here */}
                        </div>
                    </Link>
                  ))}
                </div>
                )}
              </>
            )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CareersPage() {
  return (
    <Suspense fallback={<div>Loading careers page...</div>}>
      <CareersContent />
    </Suspense>
  )
}