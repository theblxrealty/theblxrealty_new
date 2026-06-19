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
import { Trash2, Edit, Eye, Briefcase } from 'lucide-react'
import { toast } from 'sonner'

interface CareerApplication {
  id: string
  position: string
  firstName: string
  lastName: string
  email: string
  resume?: string
  coverLetter?: string
  status: 'pending' | 'reviewed' | 'rejected' | 'hired'
  createdAt: string
}

export default function AdminCareersPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<CareerApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      router.push('/')
      return
    }
    fetchApplications()
  }, [router])

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/career-applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
      } else {
        toast.error('Failed to fetch career applications')
      }
    } catch (error) {
      console.error('Error fetching career applications:', error)
      toast.error('Failed to fetch career applications')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/career-applications/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Career application deleted successfully')
        setApplications(prev => prev.filter(app => app.id !== deleteId))
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete career application')
      }
    } catch (error) {
      console.error('Error deleting career application:', error)
      toast.error('Failed to delete career application')
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
            <div className="text-lg">Loading career applications...</div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Application Management</h1>
            <p className="text-gray-600">Manage all career applications</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => router.push('/careers')} className="bg-[#011337] hover:bg-[#011337]/90\">
              <Briefcase className="h-4 w-4 mr-2" />
              View Careers Page
            </Button>
            <Button onClick={() => router.back()} variant="outline">
              Back
            </Button>
          </div>
        </div>

        {/* Applications Grid */}
        {applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">No career applications found</p>
              <Button onClick={() => router.push('/careers')} className="bg-[#011337] hover:bg-[#011337]/90">
                View Available Careers
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <Card key={app.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">{app.position}</CardTitle>
                  <div className="flex items-center text-gray-600 text-sm">
                    <p className="mr-1 font-medium">{app.firstName} {app.lastName}</p>
                    <span className="text-gray-500">- {app.email}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Badge variant={
                      app.status === 'hired' ? 'default' :
                      app.status === 'reviewed' ? 'secondary' :
                      'outline'
                    }>
                      {app.status}
                    </Badge>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { /* Implement view details logic */ }}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {app.resume && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(app.resume, '_blank')}
                        className="flex-1"
                      >
                        View Resume
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteId(app.id)}
                      className="text-[#011337] hover:text-[#011337]/70 hover:bg-[#011337]/5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 pt-2 border-t">
                    <p>Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
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
              <AlertDialogTitle>Delete Career Application</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this career application? This action cannot be undone.
                The application will be permanently removed from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-[#011337] hover:bg-[#011337]/90"
              >
                {deleting ? 'Deleting...' : 'Delete Application'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
