'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Eye, EyeOff, X, Mail } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: (user: any, isAdmin: boolean) => void
  defaultToRegister?: boolean
}

interface AuthFormData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
  title?: string
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess, defaultToRegister = false }: AuthModalProps) {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(!defaultToRegister)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    title: ''
  })

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError('')
      setSuccess('')
      setIsLogin(!defaultToRegister)
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        title: ''
      })
    }
  }, [isOpen, defaultToRegister])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      if (isLogin) {
        // Store token and user data
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // If admin, store admin flag
        if (data.isAdmin) {
          localStorage.setItem('adminUser', JSON.stringify(data.user))
          localStorage.setItem('adminToken', data.token)
          setSuccess('Admin login successful!')
          onLoginSuccess(data.user, true)
          setTimeout(() => {
            onClose()
            // Don't redirect - let admin stay on main page to see "Add Property" button
          }, 1000)
        } else {
          setSuccess('Login successful!')
          onLoginSuccess(data.user, false)
          setTimeout(() => {
            onClose()
          }, 1000)
        }
      } else {
        setSuccess('Registration successful! Please login.')
        setIsLogin(true)
        setFormData({
          email: formData.email,
          password: '',
          firstName: '',
          lastName: '',
          phone: '',
          title: ''
        })
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setSuccess('')
    if (!isLogin) {
      // Clear form when switching to login
      setFormData({
        email: formData.email,
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        title: ''
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-100 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-black" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>
            {isLogin ? 'Welcome Back' : 'Register'}
          </DialogTitle>
          <p className="text-center text-lg text-gray-500 font-['Suisse_Intl',sans-serif]">
            {isLogin 
              ? 'Sign in to your account to continue'
              : 'Create your account to access exclusive features'
            }
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-black font-['Suisse_Intl',sans-serif] font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="border-gray-300 focus:border-[#011337] focus:ring-[#011337] font-['Suisse_Intl',sans-serif]"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-black font-['Suisse_Intl',sans-serif] font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="border-gray-300 focus:border-[#011337] focus:ring-[#011337] font-['Suisse_Intl',sans-serif]"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="text-black font-['Suisse_Intl',sans-serif] font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="border-gray-300 focus:border-[#011337] focus:ring-[#011337] font-['Suisse_Intl',sans-serif]"
                />
              </div>
              <div>
                <Label htmlFor="title" className="text-black font-['Suisse_Intl',sans-serif] font-medium">Title (Optional)</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Mr., Mrs., Dr., etc."
                  className="border-gray-300 focus:border-[#011337] focus:ring-[#011337] font-['Suisse_Intl',sans-serif]"
                />
              </div>
            </>
          )}
          
          <div>
            <Label htmlFor="email" className="text-black font-['Suisse_Intl',sans-serif] font-medium">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="border-gray-300 focus:border-[#011337] focus:ring-[#011337] font-['Suisse_Intl',sans-serif]"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-black font-['Suisse_Intl',sans-serif] font-medium">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                required
                className="border-gray-300 focus:border-[#011337] focus:ring-[#011337] font-['Suisse_Intl',sans-serif]"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="border-[#011337]/20 bg-[#011337]/5">
              <AlertDescription className="text-[#011337] font-['Suisse_Intl',sans-serif]">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800 font-['Suisse_Intl',sans-serif]">{success}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-[#011337] hover:bg-[#011337]/90 text-white px-8 py-4 font-['Suisse_Intl',sans-serif] font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              isLogin ? 'Sign In' : 'Register'
            )}
          </Button>
        </form>

        <div className="text-center pt-4">
          <Button
            variant="link"
            onClick={toggleMode}
            className="text-sm text-gray-500 hover:text-[#011337] font-['Suisse_Intl',sans-serif] relative group"
          >
            <span className="relative">
              {isLogin 
                ? "Don't have an account? Register"
                : "Already have an account? Sign in"
              }
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#011337] transition-all duration-300 group-hover:w-full"></span>
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 