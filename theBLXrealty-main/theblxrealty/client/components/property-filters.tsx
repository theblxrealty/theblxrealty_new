"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface PropertyFiltersProps {
  onFiltersChange?: (filters: any) => void
}

export default function PropertyFilters({ onFiltersChange }: PropertyFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Get initial values from URL params
  const initialSearchQuery = useMemo(() => searchParams.get('search') || '', [searchParams])
  const initialPropertyType = useMemo(() => searchParams.get('type') || 'any', [searchParams])
  const initialBedrooms = useMemo(() => searchParams.get('bedrooms') || 'any', [searchParams])
  const initialBathrooms = useMemo(() => searchParams.get('bathrooms') || 'any', [searchParams])
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [propertyType, setPropertyType] = useState(initialPropertyType)
  const [bedrooms, setBedrooms] = useState(initialBedrooms)
  const [bathrooms, setBathrooms] = useState(initialBathrooms)
  const [priceRange, setPriceRange] = useState([0, 100])
  const [amenities, setAmenities] = useState<string[]>([])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    
    if (searchQuery) params.set('search', searchQuery)
    if (propertyType !== 'any') params.set('type', propertyType)
    if (bedrooms !== 'any') params.set('bedrooms', bedrooms)
    if (bathrooms !== 'any') params.set('bathrooms', bathrooms)
    if (amenities.length > 0) params.set('amenities', amenities.join(','))
    
    const newUrl = `/properties?${params.toString()}`
    router.replace(newUrl, { scroll: false })
    
    // Notify parent component of filter changes
    if (onFiltersChange) {
      onFiltersChange({
        search: searchQuery,
        type: propertyType,
        bedrooms,
        bathrooms,
        priceRange,
        amenities
      })
    }
  }, [searchQuery, propertyType, bedrooms, bathrooms, priceRange, amenities])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by useEffect above
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setAmenities(prev => [...prev, amenity])
    } else {
      setAmenities(prev => prev.filter(a => a !== amenity))
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setPropertyType('any')
    setBedrooms('any')
    setBathrooms('any')
    setPriceRange([0, 100])
    setAmenities([])
  }


  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      {/* Basic Search */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by location, property name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-slate-300 focus:border-navy-500 focus:ring-navy-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-[120px] border-slate-300 focus:border-navy-500">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Type</SelectItem>
              <SelectItem value="luxury-villas">Luxury Villas</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="apartments">Apartments</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" className="bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-800 text-white">
            Search
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Toggle advanced filters"
            className="border-slate-300 hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
          </Button>

          {(searchQuery || propertyType !== 'any' || bedrooms !== 'any' || bathrooms !== 'any' || amenities.length > 0) && (
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              className="border-slate-300 hover:bg-slate-50"
            >
              Clear
            </Button>
          )}
        </div>
      </form>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">


          <div className="space-y-4">
            <h3 className="font-medium text-navy-900">Bedrooms & Bathrooms</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger className="border-slate-300 focus:border-navy-500">
                    <SelectValue placeholder="BHK" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1 BHK</SelectItem>
                    <SelectItem value="2">2 BHK</SelectItem>
                    <SelectItem value="3">3 BHK</SelectItem>
                    <SelectItem value="4">4+ BHK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={bathrooms} onValueChange={setBathrooms}>
                  <SelectTrigger className="border-slate-300 focus:border-navy-500">
                    <SelectValue placeholder="Baths" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-navy-900">Amenities</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="parking" 
                  className="border-navy-600 text-navy-600"
                  checked={amenities.includes('Parking')}
                  onCheckedChange={(checked) => handleAmenityChange('Parking', checked as boolean)}
                />
                <Label htmlFor="parking" className="text-slate-700">
                  Parking
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="gym" 
                  className="border-navy-600 text-navy-600"
                  checked={amenities.includes('Gym')}
                  onCheckedChange={(checked) => handleAmenityChange('Gym', checked as boolean)}
                />
                <Label htmlFor="gym" className="text-slate-700">
                  Gym
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="pool" 
                  className="border-navy-600 text-navy-600"
                  checked={amenities.includes('Swimming Pool')}
                  onCheckedChange={(checked) => handleAmenityChange('Swimming Pool', checked as boolean)}
                />
                <Label htmlFor="pool" className="text-slate-700">
                  Swimming Pool
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="security" 
                  className="border-navy-600 text-navy-600"
                  checked={amenities.includes('Security')}
                  onCheckedChange={(checked) => handleAmenityChange('Security', checked as boolean)}
                />
                <Label htmlFor="security" className="text-slate-700">
                  24/7 Security
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-navy-900">More Filters</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="py-2 text-sm font-normal text-slate-700">Location</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="koramangala" className="border-navy-600 text-navy-600" />
                      <Label htmlFor="koramangala" className="text-slate-700">
                        Koramangala
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="indiranagar" className="border-navy-600 text-navy-600" />
                      <Label htmlFor="indiranagar" className="text-slate-700">
                        Indiranagar
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="whitefield" className="border-navy-600 text-navy-600" />
                      <Label htmlFor="whitefield" className="text-slate-700">
                        Whitefield
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hsr" className="border-navy-600 text-navy-600" />
                      <Label htmlFor="hsr" className="text-slate-700">
                        HSR Layout
                      </Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="py-2 text-sm font-normal text-slate-700">
                  Property Features
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="furnished" className="border-navy-600 text-navy-600" />
                      <Label htmlFor="furnished" className="text-slate-700">
                        Furnished
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="balcony" className="border-navy-600 text-navy-600" />
                      <Label htmlFor="balcony" className="text-slate-700">
                        Balcony
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="garden" className="border-navy-600 text-navy-600" />
                      <Label htmlFor="garden" className="text-slate-700">
                        Garden
                      </Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between">
          <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50 bg-transparent">
            Reset Filters
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-800 text-white"
          >
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  )
}
