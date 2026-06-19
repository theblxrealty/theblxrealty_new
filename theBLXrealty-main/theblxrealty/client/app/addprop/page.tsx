"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Upload, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { capitalizeWords } from "@/lib/utils"

interface PropertyFormData {
  title: string
  description: string
  longDescription: string
  price: string
  priceUnit: string
  location: string
  latitude: string
  longitude: string
  propertyType: string
  propertyCategory: string
  bedrooms: string
  bathrooms: string
  area: string
  yearBuilt: string
  lotSize: string
  amenities: string
  ecoFeatures: string
  agentName: string
  agentPhone: string
  agentEmail: string
  agentImage: string
  // Individual nearby amenity distances
  shoppingCentersDistance: string
  schoolsDistance: string
  hospitalsDistance: string
  parksDistance: string
  publicTransportDistance: string
  // Individual transportation times
  busStopTime: string
  metroStationTime: string
  airportTime: string
  highwayAccessTime: string
}

interface PropertyDetailsSection {
  bedrooms: string
  bathrooms: string
  propertyType: string
  yearBuilt: string
  lotSize: string
}

function AddPropertyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [propertyId, setPropertyId] = useState<string | null>(null)
  
  // Banner images
  const [banner1File, setBanner1File] = useState<File | null>(null)
  const [banner1Preview, setBanner1Preview] = useState<string>("")
  const [banner1ExistingUrl, setBanner1ExistingUrl] = useState<string | null>(null)
  const [banner2File, setBanner2File] = useState<File | null>(null)
  const [banner2Preview, setBanner2Preview] = useState<string>("")
  const [banner2ExistingUrl, setBanner2ExistingUrl] = useState<string | null>(null)
  
  // Additional images
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([])
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([])
  const [additionalExistingUrls, setAdditionalExistingUrls] = useState<string[]>([])
  const [propertyDetailsSections, setPropertyDetailsSections] = useState<PropertyDetailsSection[]>([
    {
      bedrooms: "",
      bathrooms: "",
      propertyType: "",
      yearBuilt: "",
      lotSize: ""
    }
  ])

  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    longDescription: "",
    price: "",
    priceUnit: "cr",
    location: "",
    latitude: "",
    longitude: "",
    propertyType: "",
    propertyCategory: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    yearBuilt: "",
    lotSize: "",
    amenities: "",
    ecoFeatures: "",
    agentName: "",
    agentPhone: "",
    agentEmail: "",
    agentImage: "",
    // Individual nearby amenity distances
    shoppingCentersDistance: "",
    schoolsDistance: "",
    hospitalsDistance: "",
    parksDistance: "",
    publicTransportDistance: "",
    // Individual transportation times
    busStopTime: "",
    metroStationTime: "",
    airportTime: "",
    highwayAccessTime: ""
  })

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      setIsEditing(true)
      setPropertyId(id)
      fetchProperty(id)
    }
  }, [searchParams])

  const fetchProperty = async (id: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        toast.error('Admin access required. Please login as admin.')
        router.push('/')
        return
      }
      const response = await fetch(`/api/admin/properties/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setFormData({
          title: data.title || "",
          description: data.description || "",
          longDescription: data.longDescription || "",
          price: data.price ? String(data.price) : "",
          priceUnit: data.priceUnit || "cr",
          location: data.location || "",
          latitude: data.latitude ? String(data.latitude) : "",
          longitude: data.longitude ? String(data.longitude) : "",
          propertyType: data.propertyType || "",
          propertyCategory: data.propertyCategory || "",
          bedrooms: data.bedrooms ? String(data.bedrooms) : "",
          bathrooms: data.bathrooms ? String(data.bathrooms) : "",
          area: data.area ? String(data.area) : "",
          yearBuilt: data.yearBuilt ? String(data.yearBuilt) : "",
          lotSize: data.lotSize || "",
          amenities: data.amenities ? data.amenities.join(', ') : "",
          ecoFeatures: data.ecoFeatures ? data.ecoFeatures.join(', ') : "",
          agentName: data.agentName || "",
          agentPhone: data.agentPhone || "",
          agentEmail: data.agentEmail || "",
          agentImage: data.agentImage || "",
          shoppingCentersDistance: data.nearbyAmenities?.["Shopping Centers"] || "",
          schoolsDistance: data.nearbyAmenities?.["Schools"] || "",
          hospitalsDistance: data.nearbyAmenities?.["Hospitals"] || "",
          parksDistance: data.nearbyAmenities?.["Parks"] || "",
          publicTransportDistance: data.nearbyAmenities?.["Public Transport"] || "",
          busStopTime: data.transportation?.["Bus Stop"] || "",
          metroStationTime: data.transportation?.["Metro Station"] || "",
          airportTime: data.transportation?.["Airport"] || "",
          highwayAccessTime: data.transportation?.["Highway Access"] || ""
        })
        setPropertyDetailsSections([
          {
            bedrooms: data.bedrooms ? String(data.bedrooms) : "",
            bathrooms: data.bathrooms ? String(data.bathrooms) : "",
            propertyType: data.propertyType || "",
            yearBuilt: data.yearBuilt ? String(data.yearBuilt) : "",
            lotSize: data.lotSize || ""
          }
        ])
        setBanner1ExistingUrl(data.propertyBanner1 || null)
        setBanner2ExistingUrl(data.propertyBanner2 || null)
        setAdditionalExistingUrls(data.additionalImages || [])
      } else {
        toast.error('Failed to fetch property for editing.')
        router.push('/admin-properties')
      }
    } catch (error) {
      console.error('Error fetching property:', error)
      toast.error('Failed to fetch property.')
      router.push('/admin-properties')
    } finally {
      setLoading(false)
    }
  }

  // Handle form input changes with auto-formatting
  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    let formattedValue = value
    
    // Auto-format title and location
    if (field === 'title' || field === 'location') {
      formattedValue = capitalizeWords(value)
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }))
  }

  const handlePropertyDetailsChange = (index: number, field: keyof PropertyDetailsSection, value: string) => {
    setPropertyDetailsSections(prev => {
      const next = [...prev]
      next[index] = {
        ...next[index],
        [field]: value
      }
      return next
    })
  }

  const addPropertyDetailsSection = () => {
    setPropertyDetailsSections(prev => [
      ...prev,
      {
        bedrooms: "",
        bathrooms: "",
        propertyType: "",
        yearBuilt: "",
        lotSize: ""
      }
    ])
  }

  const removePropertyDetailsSection = (index: number) => {
    setPropertyDetailsSections(prev => prev.filter((_, i) => i !== index))
  }

  // Handle banner 1 image selection
  const handleBanner1Select = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (banner1Preview) {
        URL.revokeObjectURL(banner1Preview)
      }
      setBanner1File(file)
      setBanner1Preview(URL.createObjectURL(file))
    }
  }

  // Handle banner 2 image selection
  const handleBanner2Select = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (banner2Preview) {
        URL.revokeObjectURL(banner2Preview)
      }
      setBanner2File(file)
      setBanner2Preview(URL.createObjectURL(file))
    }
  }

  // Handle additional images selection
  const handleAdditionalImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Limit to 8 additional images
    const remainingSlots = 8 - additionalFiles.length
    const newFiles = files.slice(0, remainingSlots)

    setAdditionalFiles(prev => [...prev, ...newFiles])

    // Create preview URLs
    const newPreviews = newFiles.map(file => URL.createObjectURL(file))
    setAdditionalPreviews(prev => [...prev, ...newPreviews])
  }

  // Remove additional image
  const removeAdditionalImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      setAdditionalExistingUrls(prev => prev.filter((_, i) => i !== index))
    } else {
      setAdditionalFiles(prev => prev.filter((_, i) => i !== index))
      URL.revokeObjectURL(additionalPreviews[index])
      setAdditionalPreviews(prev => prev.filter((_, i) => i !== index))
    }
  }

  // Remove banner image
  const removeBanner1 = () => {
    if (banner1Preview) {
      URL.revokeObjectURL(banner1Preview)
    }
    setBanner1File(null)
    setBanner1Preview("")
    setBanner1ExistingUrl(null)
  }

  const removeBanner2 = () => {
    if (banner2Preview) {
      URL.revokeObjectURL(banner2Preview)
    }
    setBanner2File(null)
    setBanner2Preview("")
    setBanner2ExistingUrl(null)
  }

  // Upload all images to Supabase via API
  const uploadAllImages = async () => {
    setUploadingImages(true)
    try {
      const uploadPromises: Promise<string | null>[] = []
      
      // Upload banner 1
      if (banner1File) {
        uploadPromises.push(
          uploadImageViaAPI(banner1File).then(result => result.success ? result.url || null : null)
        )
      } else {
        uploadPromises.push(Promise.resolve(banner1ExistingUrl))
      }
      
      // Upload banner 2
      if (banner2File) {
        uploadPromises.push(
          uploadImageViaAPI(banner2File).then(result => result.success ? result.url || null : null)
        )
      } else {
        uploadPromises.push(Promise.resolve(banner2ExistingUrl))
      }
      
      // Upload new additional images
      for (const file of additionalFiles) {
        uploadPromises.push(
          uploadImageViaAPI(file).then(result => result.success ? result.url || null : null)
        )
      }

      const results = await Promise.all(uploadPromises)
      const banner1Url = results[0]
      const banner2Url = results[1]
      const newlyUploadedAdditionalUrls = results.slice(2).filter(url => url !== null) as string[]
      const allAdditionalUrls = [...additionalExistingUrls, ...newlyUploadedAdditionalUrls]

      toast.success(`${results.filter(url => url !== null).length} images uploaded successfully`)
      return { banner1Url, banner2Url, additionalUrls: allAdditionalUrls }
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error('Failed to upload images')
      throw error
    } finally {
      setUploadingImages(false)
    }
  }

  // Upload image via API using service role key
  const uploadImageViaAPI = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      // Get admin token
      const adminToken = localStorage.getItem('adminToken')
      if (!adminToken) {
        return { success: false, error: 'Admin token not found' }
      }

      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      // Upload via API
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formData
      })

      const result = await response.json()

      if (response.ok && result.success) {
        return { success: true, url: result.url }
      } else {
        return { success: false, error: result.error || 'Upload failed' }
      }
    } catch (error) {
      console.error('API upload error:', error)
      return { success: false, error: 'Upload failed' }
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if user is admin
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      toast.error('Admin access required. Please login as admin.')
      return
    }
    
    if (!formData.title || !formData.propertyCategory) {
      toast.error('Title and property category are required')
      return
    }

    if (!banner1File && !banner1ExistingUrl) {
      toast.error('Banner Image 1 is required')
      return
    }

    setLoading(true)
    
    try {
      // Upload images first
      const { banner1Url, banner2Url, additionalUrls } = await uploadAllImages()
      
      console.log('Upload results:', { banner1Url, banner2Url, additionalUrls })

      // Build nearby amenities object from individual fields
      const nearbyAmenitiesJson: Record<string, string> = {}
      if (formData.shoppingCentersDistance.trim()) nearbyAmenitiesJson["Shopping Centers"] = formData.shoppingCentersDistance.trim()
      if (formData.schoolsDistance.trim()) nearbyAmenitiesJson["Schools"] = formData.schoolsDistance.trim()
      if (formData.hospitalsDistance.trim()) nearbyAmenitiesJson["Hospitals"] = formData.hospitalsDistance.trim()
      if (formData.parksDistance.trim()) nearbyAmenitiesJson["Parks"] = formData.parksDistance.trim()
      if (formData.publicTransportDistance.trim()) nearbyAmenitiesJson["Public Transport"] = formData.publicTransportDistance.trim()

      // Build transportation object from individual fields
      const transportationJson: Record<string, string> = {}
      if (formData.busStopTime.trim()) transportationJson["Bus Stop"] = formData.busStopTime.trim()
      if (formData.metroStationTime.trim()) transportationJson["Metro Station"] = formData.metroStationTime.trim()
      if (formData.airportTime.trim()) transportationJson["Airport"] = formData.airportTime.trim()
      if (formData.highwayAccessTime.trim()) transportationJson["Highway Access"] = formData.highwayAccessTime.trim()

      const primaryDetails = propertyDetailsSections[0] || {
        bedrooms: "",
        bathrooms: "",
        propertyType: "",
        yearBuilt: "",
        lotSize: ""
      }

      // Prepare property data
      const propertyData: any = {
        title: formData.title,
        description: formData.description,
        longDescription: formData.longDescription,
        price: parseFloat(formData.price) || null,
        priceUnit: formData.priceUnit,
        location: formData.location,
        latitude: parseFloat(formData.latitude) || null,
        longitude: parseFloat(formData.longitude) || null,
        propertyType: primaryDetails.propertyType,
        propertyCategory: formData.propertyCategory,
        bedrooms: parseInt(primaryDetails.bedrooms) || null,
        bathrooms: parseInt(primaryDetails.bathrooms) || null,
        area: parseInt(formData.area) || null,
        yearBuilt: parseInt(primaryDetails.yearBuilt) || null,
        lotSize: primaryDetails.lotSize,
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
        ecoFeatures: formData.ecoFeatures.split(',').map(f => f.trim()).filter(f => f),
        agentName: formData.agentName,
        agentPhone: formData.agentPhone,
        agentEmail: formData.agentEmail || undefined, // Send undefined if empty to make it optional
        agentImage: formData.agentImage || undefined, // Send undefined if empty to make it optional
        propertyBanner1: banner1Url,
        propertyBanner2: banner2Url,
        additionalImages: additionalUrls,
        nearbyAmenities: Object.keys(nearbyAmenitiesJson).length > 0 ? nearbyAmenitiesJson : null,
        transportation: Object.keys(transportationJson).length > 0 ? transportationJson : null
      }
      
      console.log('Property data being sent:', propertyData)

      // Get auth token from localStorage (set by auth modal)
      const token = localStorage.getItem('adminToken')

      // Submit to API
      const url = isEditing ? `/api/admin/properties/${propertyId}` : '/api/addprop'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(propertyData)
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(`Property ${isEditing ? 'updated' : 'created'} successfully!`)
        router.push('/admin-properties') // Redirect to admin properties list
      } else {
        toast.error(result.error || `Failed to ${isEditing ? 'update' : 'create'} property`)
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} property`)
    } finally {
      setLoading(false)
    }
  }

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      if (banner1Preview) URL.revokeObjectURL(banner1Preview)
      if (banner2Preview) URL.revokeObjectURL(banner2Preview)
      additionalPreviews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [banner1Preview, banner2Preview, additionalPreviews])

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
              {isEditing ? 'Edit Property' : 'Add New Property'}
            </h1>
            <p className="text-lg text-gray-600 font-['Suisse_Intl',sans-serif]">
              {isEditing ? 'Modify an existing property listing' : 'Create a new property listing with images and detailed information'}
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
                  <CardTitle className="font-['Suisse_Intl',sans-serif]">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title" className="font-['Suisse_Intl',sans-serif]">Property Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g., luxury villa in koramangala"
                        className="font-['Suisse_Intl',sans-serif]"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="propertyCategory" className="font-['Suisse_Intl',sans-serif]">Property Category *</Label>
                      <Select value={formData.propertyCategory} onValueChange={(value) => handleInputChange('propertyCategory', value)}>
                        <SelectTrigger className="font-['Suisse_Intl',sans-serif]">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="luxury villas">Luxury Villas</SelectItem>
                          <SelectItem value="flats">Flats</SelectItem>
                          <SelectItem value="new buildings">New Buildings</SelectItem>
                          <SelectItem value="farm house">Farm House</SelectItem>
                          <SelectItem value="sites">Sites</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="investment">Investment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                    <div>
                      <Label htmlFor="description" className="font-['Suisse_Intl',sans-serif]">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe the property features and highlights..."
                        rows={3}
                        className="font-['Suisse_Intl',sans-serif]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="longDescription" className="font-['Suisse_Intl',sans-serif]">Extended Description</Label>
                      <Textarea
                        id="longDescription"
                        value={formData.longDescription}
                        onChange={(e) => handleInputChange('longDescription', e.target.value)}
                        placeholder="Provide more detailed information about the property, neighborhood, and investment potential..."
                        rows={5}
                        className="font-['Suisse_Intl',sans-serif]"
                      />
                    </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="price" className="font-['Suisse_Intl',sans-serif]">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="e.g., 45000000 or 4.5"
                        className="font-['Suisse_Intl',sans-serif]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="priceUnit" className="font-['Suisse_Intl',sans-serif]">Unit</Label>
                      <Select value={formData.priceUnit} onValueChange={(value) => handleInputChange('priceUnit', value)}>
                        <SelectTrigger id="priceUnit" className="font-['Suisse_Intl',sans-serif]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rs">₹ Rupees</SelectItem>
                          <SelectItem value="lakh">₹ Lakhs</SelectItem>
                          <SelectItem value="cr">₹ Crores</SelectItem>
                          <SelectItem value="per_sqft">₹/Sq.Ft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="area" className="font-['Suisse_Intl',sans-serif]">Area (sq ft)</Label>
                      <Input
                        id="area"
                        type="number"
                        value={formData.area}
                        onChange={(e) => handleInputChange('area', e.target.value)}
                        placeholder="e.g., 2800"
                        className="font-['Suisse_Intl',sans-serif]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-['Suisse_Intl',sans-serif]">Location Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="location" className="font-['Suisse_Intl',sans-serif]">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., koramangala 5th block, bangalore"
                      className="font-['Suisse_Intl',sans-serif]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="latitude" className="font-['Suisse_Intl',sans-serif]">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) => handleInputChange('latitude', e.target.value)}
                        placeholder="e.g., 12.9352"
                        className="font-['Suisse_Intl',sans-serif]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude" className="font-['Suisse_Intl',sans-serif]">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) => handleInputChange('longitude', e.target.value)}
                        placeholder="e.g., 77.6245"
                        className="font-['Suisse_Intl',sans-serif]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="font-['Suisse_Intl',sans-serif]">Property Details</CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addPropertyDetailsSection}
                      className="font-['Suisse_Intl',sans-serif]"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {propertyDetailsSections.map((details, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 p-4 space-y-6 bg-white">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-gray-600 font-['Suisse_Intl',sans-serif]">Detail Set {index + 1}</p>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removePropertyDetailsSection(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 font-['Suisse_Intl',sans-serif]"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <Label htmlFor={`bedrooms-${index}`} className="font-['Suisse_Intl',sans-serif]">Bedrooms</Label>
                          <Input
                            id={`bedrooms-${index}`}
                            type="number"
                            value={details.bedrooms}
                            onChange={(e) => handlePropertyDetailsChange(index, 'bedrooms', e.target.value)}
                            placeholder="e.g., 3"
                            className="font-['Suisse_Intl',sans-serif]"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`bathrooms-${index}`} className="font-['Suisse_Intl',sans-serif]">Bathrooms</Label>
                          <Input
                            id={`bathrooms-${index}`}
                            type="number"
                            value={details.bathrooms}
                            onChange={(e) => handlePropertyDetailsChange(index, 'bathrooms', e.target.value)}
                            placeholder="e.g., 2"
                            className="font-['Suisse_Intl',sans-serif]"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`propertyType-${index}`} className="font-['Suisse_Intl',sans-serif]">Property Type</Label>
                          <Input
                            id={`propertyType-${index}`}
                            value={details.propertyType}
                            onChange={(e) => handlePropertyDetailsChange(index, 'propertyType', e.target.value)}
                            placeholder="e.g., Independent House"
                            className="font-['Suisse_Intl',sans-serif]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor={`yearBuilt-${index}`} className="font-['Suisse_Intl',sans-serif]">Year Built</Label>
                          <Input
                            id={`yearBuilt-${index}`}
                            type="number"
                            value={details.yearBuilt}
                            onChange={(e) => handlePropertyDetailsChange(index, 'yearBuilt', e.target.value)}
                            placeholder="e.g., 2020"
                            className="font-['Suisse_Intl',sans-serif]"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`lotSize-${index}`} className="font-['Suisse_Intl',sans-serif]">Lot Size</Label>
                          <Input
                            id={`lotSize-${index}`}
                            value={details.lotSize}
                            onChange={(e) => handlePropertyDetailsChange(index, 'lotSize', e.target.value)}
                            placeholder="e.g., 40x60 ft, 2400 sq ft"
                            className="font-['Suisse_Intl',sans-serif]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Property Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-['Suisse_Intl',sans-serif]">Property Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="amenities" className="font-['Suisse_Intl',sans-serif]">Amenities</Label>
                    <Textarea
                      id="amenities"
                      value={formData.amenities}
                      onChange={(e) => handleInputChange('amenities', e.target.value)}
                      placeholder="Enter amenities separated by commas (e.g., Swimming Pool, Gym, Garden, Security, Parking)"
                      rows={3}
                      className="font-['Suisse_Intl',sans-serif]"
                    />
                    <p className="text-sm text-gray-500 mt-1">Separate each amenity with a comma</p>
                  </div>

                  <div>
                    <Label htmlFor="ecoFeatures" className="font-['Suisse_Intl',sans-serif]">Eco-Friendly Features</Label>
                    <Textarea
                      id="ecoFeatures"
                      value={formData.ecoFeatures}
                      onChange={(e) => handleInputChange('ecoFeatures', e.target.value)}
                      placeholder="Enter eco-friendly features separated by commas (e.g., Solar Panels, Rainwater Harvesting, Energy Efficient Lighting)"
                      rows={2}
                      className="font-['Suisse_Intl',sans-serif]"
                    />
                    <p className="text-sm text-gray-500 mt-1">Separate each feature with a comma</p>
                  </div>
                </CardContent>
              </Card>

              {/* Neighborhood Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-['Suisse_Intl',sans-serif]">Neighborhood Information</CardTitle>
                  <p className="text-sm text-gray-600">Enter distances to nearby amenities. Leave blank to display "-" on the property page.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4 font-['Suisse_Intl',sans-serif]">Nearby Amenities</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shoppingCentersDistance" className="font-['Suisse_Intl',sans-serif]">Shopping Centers Distance</Label>
                        <Input
                          id="shoppingCentersDistance"
                          value={formData.shoppingCentersDistance}
                          onChange={(e) => handleInputChange('shoppingCentersDistance', e.target.value)}
                          placeholder="e.g., 0.8 km, 10 min walk"
                          className="font-['Suisse_Intl',sans-serif]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="schoolsDistance" className="font-['Suisse_Intl',sans-serif]">Schools Distance</Label>
                        <Input
                          id="schoolsDistance"
                          value={formData.schoolsDistance}
                          onChange={(e) => handleInputChange('schoolsDistance', e.target.value)}
                          placeholder="e.g., 1.3 km, 15 min walk"
                          className="font-['Suisse_Intl',sans-serif]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hospitalsDistance" className="font-['Suisse_Intl',sans-serif]">Hospitals Distance</Label>
                        <Input
                          id="hospitalsDistance"
                          value={formData.hospitalsDistance}
                          onChange={(e) => handleInputChange('hospitalsDistance', e.target.value)}
                          placeholder="e.g., 2.0 km, 25 min walk"
                          className="font-['Suisse_Intl',sans-serif]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="parksDistance" className="font-['Suisse_Intl',sans-serif]">Parks Distance</Label>
                        <Input
                          id="parksDistance"
                          value={formData.parksDistance}
                          onChange={(e) => handleInputChange('parksDistance', e.target.value)}
                          placeholder="e.g., 0.3 km, 5 min walk"
                          className="font-['Suisse_Intl',sans-serif]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="publicTransportDistance" className="font-['Suisse_Intl',sans-serif]">Public Transport Distance</Label>
                        <Input
                          id="publicTransportDistance"
                          value={formData.publicTransportDistance}
                          onChange={(e) => handleInputChange('publicTransportDistance', e.target.value)}
                          placeholder="e.g., 0.5 km, 7 min walk"
                          className="font-['Suisse_Intl',sans-serif]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4 font-['Suisse_Intl',sans-serif]">Transportation</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="busStopTime" className="font-['Suisse_Intl',sans-serif]">Bus Stop</Label>
                        <Input
                          id="busStopTime"
                          value={formData.busStopTime}
                          onChange={(e) => handleInputChange('busStopTime', e.target.value)}
                          placeholder="e.g., 5 min walk"
                          className="font-['Suisse_Intl',sans-serif]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="metroStationTime" className="font-['Suisse_Intl',sans-serif]">Metro Station</Label>
                        <Input
                          id="metroStationTime"
                          value={formData.metroStationTime}
                          onChange={(e) => handleInputChange('metroStationTime', e.target.value)}
                          placeholder="e.g., 15 min walk"
                          className="font-['Suisse_Intl',sans-serif]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="airportTime" className="font-['Suisse_Intl',sans-serif]">Airport</Label>
                        <Input
                          id="airportTime"
                          value={formData.airportTime}
                          onChange={(e) => handleInputChange('airportTime', e.target.value)}
                          placeholder="e.g., 45 min drive"
                          className="font-['Suisse_Intl',sans-serif]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="highwayAccessTime" className="font-['Suisse_Intl',sans-serif]">Highway Access</Label>
                        <Input
                          id="highwayAccessTime"
                          value={formData.highwayAccessTime}
                          onChange={(e) => handleInputChange('highwayAccessTime', e.target.value)}
                          placeholder="e.g., 15 min drive"
                          className="font-['Suisse_Intl',sans-serif]"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Agent Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-['Suisse_Intl',sans-serif]">Agent Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="agentName" className="font-['Suisse_Intl',sans-serif]">Agent Name</Label>
                      <Input
                        id="agentName"
                        value={formData.agentName}
                        onChange={(e) => handleInputChange('agentName', e.target.value)}
                        placeholder="e.g., John Smith"
                        className="font-['Suisse_Intl',sans-serif]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="agentPhone" className="font-['Suisse_Intl',sans-serif]">Agent Phone</Label>
                      <Input
                        id="agentPhone"
                        value={formData.agentPhone}
                        onChange={(e) => handleInputChange('agentPhone', e.target.value)}
                        placeholder="e.g., +91 9876543210"
                        className="font-['Suisse_Intl',sans-serif]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="agentEmail" className="font-['Suisse_Intl',sans-serif]">Agent Email</Label>
                    <Input
                      id="agentEmail"
                      type="email"
                      value={formData.agentEmail}
                      onChange={(e) => handleInputChange('agentEmail', e.target.value)}
                      placeholder="e.g., john.smith@The BLX Realty.com"
                      className="font-['Suisse_Intl',sans-serif]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="agentImage" className="font-['Suisse_Intl',sans-serif]">Agent Profile Image URL</Label>
                    <Input
                      id="agentImage"
                      value={formData.agentImage}
                      onChange={(e) => handleInputChange('agentImage', e.target.value)}
                      placeholder="e.g., https://example.com/agent-photo.jpg"
                      className="font-['Suisse_Intl',sans-serif]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Banner Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-['Suisse_Intl',sans-serif]">Banner Images (Required)</CardTitle>
                  <p className="text-sm text-gray-600 font-['Suisse_Intl',sans-serif]">
                    These will be the main images displayed on property cards and listings
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Banner 1 */}
                    <div>
                      <Label htmlFor="banner1" className="font-['Suisse_Intl',sans-serif]">
                        Banner Image 1 * (Main Property Image)
                      </Label>
                      <div className="mt-2">
                        <input
                          id="banner1"
                          type="file"
                          accept="image/*"
                          onChange={handleBanner1Select}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('banner1')?.click()}
                          className="w-full h-32 border-dashed border-2 border-gray-300 hover:border-gray-400 font-['Suisse_Intl',sans-serif]"
                        >
                          <div className="text-center">
                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-gray-600">
                              {banner1File || banner1ExistingUrl ? 'Change Banner 1' : 'Upload Banner 1'}
                            </span>
                          </div>
                        </Button>
                      </div>
                      {(banner1Preview || banner1ExistingUrl) && (
                        <div className="mt-2 relative group">
                          <div className="aspect-video relative overflow-hidden rounded-lg border border-gray-200">
                            <Image
                              src={banner1Preview || banner1ExistingUrl || ''}
                              alt="Banner 1 Preview"
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeBanner1}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <div className="absolute bottom-1 left-1 bg-[#011337] text-white text-xs px-1 py-0.5 rounded font-['Suisse_Intl',sans-serif]">
                            Banner 1
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Banner 2 */}
                    <div>
                      <Label htmlFor="banner2" className="font-['Suisse_Intl',sans-serif]">
                        Banner Image 2 (Secondary Property Image)
                      </Label>
                      <div className="mt-2">
                        <input
                          id="banner2"
                          type="file"
                          accept="image/*"
                          onChange={handleBanner2Select}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('banner2')?.click()}
                          className="w-full h-32 border-dashed border-2 border-gray-300 hover:border-gray-400 font-['Suisse_Intl',sans-serif]"
                        >
                          <div className="text-center">
                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-gray-600">
                              {banner2File || banner2ExistingUrl ? 'Change Banner 2' : 'Upload Banner 2'}
                            </span>
                          </div>
                        </Button>
                      </div>
                      {(banner2Preview || banner2ExistingUrl) && (
                        <div className="mt-2 relative group">
                          <div className="aspect-video relative overflow-hidden rounded-lg border border-gray-200">
                            <Image
                              src={banner2Preview || banner2ExistingUrl || ''}
                              alt="Banner 2 Preview"
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeBanner2}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded font-['Suisse_Intl',sans-serif]">
                            Banner 2
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-['Suisse_Intl',sans-serif]">Additional Images (Optional)</CardTitle>
                  <p className="text-sm text-gray-600 font-['Suisse_Intl',sans-serif]">
                    Upload up to 8 additional images for the property detail page
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="additionalImages" className="font-['Suisse_Intl',sans-serif]">
                      Upload Additional Images (Max {8 - additionalExistingUrls.length})
                    </Label>
                    <div className="mt-2">
                      <input
                        id="additionalImages"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleAdditionalImagesSelect}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('additionalImages')?.click()}
                        className="w-full h-32 border-dashed border-2 border-gray-300 hover:border-gray-400 font-['Suisse_Intl',sans-serif]"
                        disabled={additionalFiles.length + additionalExistingUrls.length >= 8}
                      >
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-gray-600">
                            {additionalFiles.length + additionalExistingUrls.length >= 8 
                              ? 'Maximum 8 additional images selected' 
                              : `Upload additional images (${additionalFiles.length + additionalExistingUrls.length}/8)`
                            }
                          </span>
                        </div>
                      </Button>
                    </div>
                  </div>

                  {/* Existing Additional Image Previews */}
                  {additionalExistingUrls.length > 0 && (
                    <div>
                      <Label className="font-['Suisse_Intl',sans-serif]">
                        Existing Images ({additionalExistingUrls.length})
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {additionalExistingUrls.map((url, index) => (
                          <div key={`existing-${index}`} className="relative group">
                            <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200">
                              <Image
                                src={url}
                                alt={`Existing Image ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 25vw"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeAdditionalImage(index, true)}
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Newly Added Additional Image Previews */}
                  {additionalFiles.length > 0 && (
                    <div>
                      <Label className="font-['Suisse_Intl',sans-serif]">
                        New Images ({additionalFiles.length})
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {additionalPreviews.map((url, index) => (
                          <div key={`new-${index}`} className="relative group">
                            <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200">
                              <Image
                                src={url}
                                alt={`Additional Image ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 25vw"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeAdditionalImage(index)}
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                  disabled={loading || uploadingImages}
                  className="bg-[#011337] hover:bg-[#011337]/90 text-white font-['Suisse_Intl',sans-serif]"
                >
                  {loading ? (isEditing ? 'Updating Property...' : 'Creating Property...') : (isEditing ? 'Update Property' : 'Create Property')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function AddPropertyPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <AddPropertyContent />
    </Suspense>
  )
}
