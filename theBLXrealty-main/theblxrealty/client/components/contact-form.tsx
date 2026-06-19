"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Send, User, Mail, Phone, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"

interface FormState {
  name: string
  email: string
  phone: string
  message: string
  loading: boolean
  submitted: boolean
  error: string
}

export default function ContactForm() {
  const { data: session } = useSession()
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
    loading: false,
    submitted: false,
    error: "",
  })

  const [user, setUser] = useState<any>(null)
  const [isAutoFilled, setIsAutoFilled] = useState(false)
  const [isGoogleUser, setIsGoogleUser] = useState(false)

  // Check for logged in user and auto-fill form
  useEffect(() => {
    // First check NextAuth session (for Google OAuth users)
    if (session?.user) {
      const userInfo = session.user
      setUser(userInfo)
      
      // Auto-fill form with session data
      setFormState(prev => ({
        ...prev,
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: "", // Google users don't have phone, leave empty
      }))
      setIsAutoFilled(true)
      setIsGoogleUser(true) // Mark as Google user so phone field is editable
    } else {
      // Fallback to localStorage (for regular login users)
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const userInfo = JSON.parse(userData)
          setUser(userInfo)
          
          // Auto-fill form with user data
          setFormState(prev => ({
            ...prev,
            name: `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim(),
            email: userInfo.email || "",
            phone: userInfo.phone || "",
          }))
          setIsAutoFilled(true)
          setIsGoogleUser(false) // Regular user, phone might be pre-filled
        } catch (error) {
          console.warn('Error parsing user data:', error)
        }
      } else {
        setUser(null)
        setIsAutoFilled(false)
        setIsGoogleUser(false)
      }
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    const errors: string[] = []
    
    if (!formState.name.trim() || formState.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long')
    }
    
    if (!formState.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      errors.push('Please enter a valid email address')
    }
    
    if (!formState.phone || !/^\d{10,15}$/.test(formState.phone.replace(/\D/g, ''))) {
      errors.push('Please enter a valid 10-digit phone number')
    }
    
    if (!formState.message.trim() || formState.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long')
    }
    
    if (errors.length > 0) {
      setFormState((prev) => ({ 
        ...prev, 
        error: errors.join(', '),
        loading: false 
      }))
      return
    }
    
    setFormState((prev) => ({ ...prev, loading: true, error: "" }))

    try {
      const response = await fetch('/api/contact-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          message: formState.message,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setFormState((prev) => ({ ...prev, loading: false, submitted: true, error: "" }))
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
      }
    } catch (error) {
      console.warn('Form submission error:', error)
      setFormState((prev) => ({ 
        ...prev, 
        loading: false,
        error: 'Network error. Please check your connection and try again.'
      }))
    }
  }

  if (formState.submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-navy-900 mb-2">Message Sent Successfully!</h3>
        <p className="text-slate-600 mb-6">
          Thank you for contacting us. Our team will get back to you within 24 hours.
        </p>
        <Button
          onClick={() => setFormState((prev) => ({ ...prev, submitted: false }))}
          variant="outlineNavy"
        >
          Send Another Inquiry
        </Button>
      </motion.div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-navy-900 mb-2">Get in Touch</h3>
        <p className="text-slate-600">
          Ready to start your luxury property journey? Let's discuss your requirements.
        </p>
      </div>

      {/* Auto-fill notification */}
      {isAutoFilled && user && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-6">
          <div className="flex items-center">
            <User className="h-4 w-4 text-green-600 mr-2" />
            <p className="text-green-800 text-sm">
              Welcome back, {user.firstName || user.name || user.email}! Your details have been auto-filled and are editable.
              {isGoogleUser && " Please provide your phone number below."}
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {formState.error && (
        <div className="bg-[#011337]/5 border border-[#011337]/20 rounded-md p-3 mb-6">
          <p className="text-[#011337] text-sm">
            {formState.error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Your Name"
            value={formState.name}
            onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
            required
            className={`pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-500 ${isAutoFilled ? 'bg-green-50 border-green-300' : ''}`}
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <Input
            type="email"
            placeholder="Email Address"
            value={formState.email}
            onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
            required
            className={`pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-500 ${isAutoFilled ? 'bg-green-50 border-green-300' : ''}`}
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <Input
            type="tel"
            placeholder="+91 98765 43210"
            value={formState.phone}
            onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
            required
            className={`pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-500 ${isAutoFilled && !isGoogleUser ? 'bg-green-50 border-green-300' : ''}`}
          />
          {isGoogleUser && isAutoFilled && (
            <p className="text-xs text-gray-500 mt-1">
              Please provide your phone number to complete the inquiry
            </p>
          )}
        </div>

        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <Textarea
            placeholder="Tell us about your property requirements... (minimum 10 characters)"
            value={formState.message}
            onChange={(e) => setFormState((prev) => ({ ...prev, message: e.target.value }))}
            required
            rows={4}
            className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-500 resize-none"
          />
        </div>

        <Button
          type="submit"
          variant="navy"
          className="w-full"
          disabled={formState.loading}
          color="#011337 "
        >
          {formState.loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4 " />
              Send Inquiry
            </>
          )}
        </Button>
      </form>


    </div>
  )
}
