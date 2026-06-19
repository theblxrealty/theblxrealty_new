import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Heart, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function ProfilePage() {
  const session = await getServerSession() as any
  
  if (!session?.user?.id) {
    redirect('/')
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-['Tiempos_Headline',serif]">
              My Profile
            </h1>
            <p className="text-lg text-gray-600 font-['Suisse_Intl',sans-serif]">
              Welcome back, {session.user.name || session.user.email}
            </p>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-[#011337]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-[#011337]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Suisse_Intl',sans-serif]">
                Saved Properties
              </h3>
              <p className="text-gray-600 font-['Suisse_Intl',sans-serif]">
                View and manage your saved properties
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Suisse_Intl',sans-serif]">
                Personal Info
              </h3>
              <p className="text-gray-600 font-['Suisse_Intl',sans-serif]">
                Update your profile information
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Suisse_Intl',sans-serif]">
                Preferences
              </h3>
              <p className="text-gray-600 font-['Suisse_Intl',sans-serif]">
                Manage your account settings
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Tiempos_Headline',serif]">
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/profile/saved-properties">
                <Button className="w-full h-16 text-lg bg-[#011337] hover:bg-[#011337]/90">
                  <Heart className="h-6 w-6 mr-3" />
                  View Saved Properties
                </Button>
              </Link>
              
              <Link href="/properties">
                <Button variant="outline" className="w-full h-16 text-lg">
                  Browse More Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
