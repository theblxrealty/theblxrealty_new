"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { Trash2, Edit, Eye, Briefcase } from 'lucide-react'
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
  isActive: boolean
  createdAt: string
}

export default function AdminCareerPostingsPage() {
  const router = useRouter()
  const [postings, setPostings] = useState<CareerPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      router.push('/')
      return
    }
    fetchPostings()
  }, [router])

  const fetchPostings = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/career-postings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPostings(data.postings)
      } else {
        toast.error('Failed to fetch career postings')
      }
    } catch (error) {
      console.error('Error fetching career postings:', error)
      toast.error('Failed to fetch career postings')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/career-postings/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Career posting deleted successfully')
        setPostings(prev => prev.filter(p => p.id !== deleteId))
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete career posting')
      }
    } catch (error) {
      console.error('Error deleting career posting:', error)
      toast.error('Failed to delete career posting')
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
            <div className="text-lg">Loading career postings...</div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Posting Management</h1>
            <p className="text-gray-600">Manage all your active and inactive job postings</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => router.push('/add-career-posting')} className="bg-[#011337] hover:bg-[#011337]/90\">
              <Briefcase className="h-4 w-4 mr-2" />
              Add New Posting
            </Button>
            <Button onClick={() => router.back()} variant="outline">
              Back
            </Button>
          </div>
        </div>

        {/* Postings Grid */}
        {postings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">No career postings found</p>
              <Button onClick={() => router.push('/add-career-posting')} className="bg-[#011337] hover:bg-[#011337]/90">
                Create Your First Posting
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postings.map((posting) => (
              <Card key={posting.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">{posting.title}</CardTitle>
                  {posting.location && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {posting.location}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Posting Details */}
                  <div className="space-y-2">
                    {posting.salary && (
                      <p className="text-lg font-bold text-[#011337]">
                        {posting.salary}
                      </p>
                    )}
                    
                    <Badge variant={posting.isActive ? "default" : "secondary"}>
                      {posting.isActive ? "Active" : "Inactive"}
                    </Badge>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {posting.experience && (
                        <div className="flex items-center">
                          <span>Exp: {posting.experience}</span>
                        </div>
                      )}
                      {posting.type && (
                        <div className="flex items-center">
                          <span>Type: {posting.type}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {/* <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/careers/${posting.id}`)} // Link to individual job posting page (if implemented)
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button> */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/add-career-posting?id=${posting.id}`)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteId(posting.id)}
                      className="text-[#011337] hover:text-[#011337]/70 hover:bg-[#011337]/5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Posting Info */}
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    <p>Created: {new Date(posting.createdAt).toLocaleDateString()}</p>
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
              <AlertDialogTitle>Delete Career Posting</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this career posting? This action cannot be undone.
                The posting will be permanently removed from the system and will no longer appear on the careers page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-[#011337] hover:bg-[#011337]/90"
              >
                {deleting ? 'Deleting...' : 'Delete Posting'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
