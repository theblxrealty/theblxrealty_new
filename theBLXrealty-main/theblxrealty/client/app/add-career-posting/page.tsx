"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Plus, MinusCircle } from "lucide-react"

interface CareerPostingFormData {
  title: string
  location: string
  type: string
  salary: string
  experience: string
  description: string
  requirements: string[]
  benefits: string[]
  isActive: boolean
}

function AddCareerPostingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [postingId, setPostingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CareerPostingFormData>({
    title: "",
    location: "",
    type: "Full-time",
    salary: "",
    experience: "Entry Level (0-1 years)",
    description: "",
    requirements: [""],
    benefits: [""],
    isActive: true,
  })

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      setIsEditing(true)
      setPostingId(id)
      fetchPosting(id)
    }
  }, [searchParams])

  const fetchPosting = async (id: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        toast.error('Admin access required. Please login as admin.')
        router.push('/')
        return
      }
      const response = await fetch(`/api/admin/career-postings/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setFormData({
          title: data.title,
          location: data.location,
          type: data.type,
          salary: data.salary || "",
          experience: data.experience,
          description: data.description,
          requirements: data.requirements || [""],
          benefits: data.benefits || [""],
          isActive: data.isActive,
        })
      } else {
        toast.error('Failed to fetch career posting for editing.')
        router.push('/admin-career-postings')
      }
    } catch (error) {
      console.error('Error fetching career posting:', error)
      toast.error('Failed to fetch career posting.')
      router.push('/admin-career-postings')
    } finally {
      setLoading(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (field: keyof CareerPostingFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field: 'requirements' | 'benefits', index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...prev[field]]
      newArray[index] = value
      return { ...prev, [field]: newArray }
    })
  }

  const addArrayItem = (field: 'requirements' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field: 'requirements' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      toast.error('Admin access required. Please login as admin.')
      return
    }

    setLoading(true)
    
    try {
      const url = isEditing ? `/api/admin/career-postings/${postingId}` : '/api/admin/career-postings'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(`Career posting ${isEditing ? 'updated' : 'created'} successfully!`)
        router.push('/admin-career-postings') // Redirect to admin postings list
      } else {
        toast.error(result.error || `Failed to ${isEditing ? 'update' : 'create'} career posting`)
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} career posting`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen pt-40 bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 
              className="text-3xl md:text-4xl font-bold mb-4 text-black"
              style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}
            >
              {isEditing ? 'Edit Career Posting' : 'Add New Career Posting'}
            </h1>
            <p className="text-lg text-gray-600 font-['Suisse_Intl',sans-serif]">
              Create a new job opening for the careers page
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="flex-1 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-['Suisse_Intl',sans-serif]">Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="font-['Suisse_Intl',sans-serif]">Job Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Senior Real Estate Agent"
                      className="font-['Suisse_Intl',sans-serif]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="location" className="font-['Suisse_Intl',sans-serif]">Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g., Bangalore, Karnataka / Remote"
                        className="font-['Suisse_Intl',sans-serif]"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type" className="font-['Suisse_Intl',sans-serif]">Employment Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger className="font-['Suisse_Intl',sans-serif]">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="salary" className="font-['Suisse_Intl',sans-serif]">Salary (Optional)</Label>
                      <Input
                        id="salary"
                        value={formData.salary}
                        onChange={(e) => handleInputChange('salary', e.target.value)}
                        placeholder="e.g., ₹8-12 LPA or Competitive"
                        className="font-['Suisse_Intl',sans-serif]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience" className="font-['Suisse_Intl',sans-serif]">Experience Level *</Label>
                      <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                        <SelectTrigger className="font-['Suisse_Intl',sans-serif]">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Entry Level (0-1 years)">Entry Level (0-1 years)</SelectItem>
                          <SelectItem value="Mid Level (2-5 years)">Mid Level (2-5 years)</SelectItem>
                          <SelectItem value="Senior Level (5-10 years)">Senior Level (5-10 years)</SelectItem>
                          <SelectItem value="Executive Level (10+ years)">Executive Level (10+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="font-['Suisse_Intl',sans-serif]">Job Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Provide a detailed description of the job role and responsibilities..."
                      rows={5}
                      className="font-['Suisse_Intl',sans-serif]"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-['Suisse_Intl',sans-serif]">Requirements</CardTitle>
                  <p className="text-sm text-gray-600 font-['Suisse_Intl',sans-serif]">List key requirements for this position.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={req}
                        onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                        placeholder="e.g., Proven track record in sales"
                        className="font-['Suisse_Intl',sans-serif]"
                      />
                      {formData.requirements.length > 1 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removeArrayItem('requirements', index)}>
                          <MinusCircle className="h-4 w-4 text-[#011337]" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => addArrayItem('requirements')}>
                    <Plus className="h-4 w-4 mr-2" /> Add Requirement
                  </Button>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-['Suisse_Intl',sans-serif]">Benefits</CardTitle>
                  <p className="text-sm text-gray-600 font-['Suisse_Intl',sans-serif]">List benefits offered with this position.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={benefit}
                        onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                        placeholder="e.g., Health insurance, Performance bonuses"
                        className="font-['Suisse_Intl',sans-serif]"
                      />
                      {formData.benefits.length > 1 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removeArrayItem('benefits', index)}>
                          <MinusCircle className="h-4 w-4 text-[#011337]" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => addArrayItem('benefits')}>
                    <Plus className="h-4 w-4 mr-2" /> Add Benefit
                  </Button>
                </CardContent>
              </Card>

              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-['Suisse_Intl',sans-serif]">Posting Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="isActive" className="font-['Suisse_Intl',sans-serif] flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="form-checkbox h-5 w-5 text-[#011337] rounded"
                    />
                    Is Active
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">Uncheck to hide this job posting from the public careers page.</p>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="font-['Suisse_Intl',sans-serif]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#011337] hover:bg-[#011337]/90 text-white font-['Suisse_Intl',sans-serif]"
                >
                  {loading ? (isEditing ? 'Updating Posting...' : 'Creating Posting...') : (isEditing ? 'Update Career Posting' : 'Create Career Posting')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function AddCareerPostingPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <AddCareerPostingContent />
    </Suspense>
  )
}
