"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog'
import { Trash2, Edit, Eye, Home, MapPin, Bed, Bath, Square } from 'lucide-react'
import { toast } from 'sonner'
import { formatPropertyType } from '@/lib/utils'

interface Property {
  id: string
  title: string
  description?: string
  price?: number
  location?: string
  propertyType?: string
  propertyCategory?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  images: string[]
  isActive: boolean
  createdAt: string
  admin: {
    id: string
    firstName?: string
    lastName?: string
    email: string
  }
}

export default function AdminPropertiesPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      router.push('/')
      return
    }
    fetchProperties()
  }, [router])

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties)
      } else {
        toast.error('Failed to fetch properties')
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast.error('Failed to fetch properties')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/properties/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Property deleted successfully')
        setProperties(prev => prev.filter(p => p.id !== deleteId))
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete property')
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      toast.error('Failed to delete property')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-40 pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading properties...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-40 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Management</h1>
            <p className="text-gray-600">Manage all your property listings</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => router.push('/addprop')} className="bg-[#011337] hover:bg-[#011337]/90\">
              <Home className="h-4 w-4 mr-2" />
              Add Property
            </Button>
            <Button onClick={() => router.back()} variant="outline">
              Back
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">No properties found</p>
              <Button onClick={() => router.push('/addprop')} className="bg-[#011337] hover:bg-[#011337]/90">
                Add Your First Property
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Property Image */}
                <div className="aspect-video relative bg-gray-200">
                  <Image
                    src={property.images[0] || '/placeholder.svg'}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={property.isActive ? "default" : "secondary"}>
                      {property.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">{property.title}</CardTitle>
                  {property.location && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Property Details */}
                  <div className="space-y-2">
                    {property.price && (
                      <p className="text-xl font-bold text-[#011337]">
                        ₹{property.price.toLocaleString()}
                      </p>
                    )}
                    
                    {property.propertyCategory && (
                      <Badge variant="outline" className="text-xs">
                        {property.propertyCategory}
                      </Badge>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {property.bedrooms && (
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          {property.bedrooms}
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          {property.bathrooms}
                        </div>
                      )}
                      {property.area && (
                        <div className="flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          {property.area} sq ft
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/properties/${property.id}`)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/addprop?id=${property.id}`)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteId(property.id)}
                      className="text-[#011337] hover:text-[#011337]/70 hover:bg-[#011337]/5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Property Info */}
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    <p>Created: {new Date(property.createdAt).toLocaleDateString()}</p>
                    <p>By: {property.admin.firstName} {property.admin.lastName}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Property</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this property? This action cannot be undone.
                The property will be permanently removed from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-[#011337] hover:bg-[#011337]/90"
              >
                {deleting ? 'Deleting...' : 'Delete Property'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
