"use client"

import { useState, useEffect } from "react"
import { X, ChevronDown, ChevronLeft, ChevronRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "next-auth/react"

interface PropertyContactFormProps {
  propertyTitle: string
  isOpen?: boolean
  onClose?: () => void
  variant?: "drawer" | "embedded"
}

export default function PropertyContactForm({
  propertyTitle,
  isOpen = false,
  onClose,
  variant = "drawer",
}: PropertyContactFormProps) {
  const { data: session } = useSession()
  const isVisible = variant === "embedded" ? true : isOpen
  // Get current date for calendar
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const [formState, setFormState] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneCountry: "IN",
    phoneNumber: "",
    preferredDate: "",
    preferredTime: "afternoon",
    additionalInfo: "",
    heardFrom: "",
    submitted: false,
    loading: false,
    error: "",
  })

  const [user, setUser] = useState<any>(null)
  const [isAutoFilled, setIsAutoFilled] = useState(false)
  const [isGoogleUser, setIsGoogleUser] = useState(false)

  // Calendar navigation state
  const [calendarView, setCalendarView] = useState({
    month: currentMonth,
    year: currentYear
  })

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

  // Check for logged in user and auto-fill form
  useEffect(() => {
    if (isVisible) {
      // First check NextAuth session (for Google OAuth users)
      if (session?.user) {
        const userInfo = session.user
        setUser(userInfo)
        
        // Extract first and last name from full name
        const nameParts = userInfo.name?.split(' ') || []
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        
        // Auto-fill form with session data
        setFormState(prev => ({
          ...prev,
          title: "",
          firstName: firstName,
          lastName: lastName,
          email: userInfo.email || "",
          phoneNumber: "", // Google users don't have phone, leave empty
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
              title: userInfo.title || "",
              firstName: userInfo.firstName || "",
              lastName: userInfo.lastName || "",
              email: userInfo.email || "",
              phoneNumber: userInfo.phone || "",
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
    }
  }, [isVisible, session])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Client-side validation
    const errors: string[] = []
    
    if (!formState.firstName.trim()) {
      errors.push('First name is required')
    }
    
    if (!formState.lastName.trim()) {
      errors.push('Last name is required')
    }
    
    if (!formState.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      errors.push('Valid email address is required')
    }
    
    if (!formState.phoneNumber || !/^\d{10,15}$/.test(formState.phoneNumber.replace(/\D/g, ''))) {
      errors.push('Valid phone number is required')
    }
    
    if (!formState.preferredDate) {
      errors.push('Please select a preferred date')
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
      const response = await fetch('/api/property-view-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: propertyTitle, // Using propertyTitle as propertyId for now
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
          phone: formState.phoneNumber,
          title: formState.title,
          preferredDate: formState.preferredDate,
          preferredTime: formState.preferredTime,
          additionalInfo: formState.additionalInfo,
          heardFrom: formState.heardFrom,
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

  // Calendar navigation functions
  const navigateCalendar = (direction: 'prev' | 'next') => {
    setCalendarView(prev => {
      let newMonth = prev.month
      let newYear = prev.year

      if (direction === 'prev') {
        if (newMonth === 0) {
          newMonth = 11
          newYear--
        } else {
          newMonth--
        }
      } else {
        if (newMonth === 11) {
          newMonth = 0
          newYear++
        } else {
          newMonth++
        }
      }

      return { month: newMonth, year: newYear }
    })
  }

  // Generate calendar dates for the current view
  const generateCalendarDates = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const dates = []
    const currentDate = new Date(startDate)

    // Generate 6 weeks of dates (42 days)
    for (let i = 0; i < 42; i++) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
  }


  const timeSlots = [
    { value: "morning", label: "Morning 9am-12pm" },
    { value: "afternoon", label: "Afternoon 1pm-5pm" },
    { value: "allday", label: "All Day 9am-5pm" },
  ]

  const heardFromOptions = [
    "Google Search",
    "Social Media",
    "Property Website",
    "Friend/Family",
    "Advertisement",
    "Other",
  ]

  // Generate calendar dates
  const calendarDates = generateCalendarDates(calendarView.month, calendarView.year)
  const monthNames = ["January", "February", "March", "April", "May", "June",
                     "July", "August", "September", "October", "November", "December"]

  if (formState.submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
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
          <h3 className="text-lg font-bold mb-2" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Request Sent!</h3>
          <p className="text-gray-600 text-sm mb-4 font-['Suisse_Intl',sans-serif]">We've received your viewing request and will get back to you shortly.</p>
          <Button
            onClick={() => {
              setFormState((prev) => ({ ...prev, submitted: false }))
              onClose?.()
            }}
            variant="outline"
            size="sm"
            className="w-full font-['Suisse_Intl',sans-serif]"
          >
            Close
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Backdrop (drawer only) */}
      {variant === "drawer" && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Slide-in Form - Reduced Size */}
      <div
        className={
          variant === "embedded"
            ? "w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            : `fixed top-0 right-0 h-full w-full md:w-[400px] lg:w-[450px] bg-white z-50 transform transition-transform duration-300 ease-in-out ${
                isOpen ? "translate-x-0" : "translate-x-full"
              } shadow-2xl`
        }
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          {variant === "drawer" ? (
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Request viewing</h2>
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold font-['Suisse_Intl',sans-serif] text-black">Request viewing</h2>
              <p className="text-xs text-gray-600 font-['Suisse_Intl',sans-serif] mt-1">
                Share your details and we’ll get back to you.
              </p>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Error Display */}
              {formState.error && (
                <div className="bg-[#011337]/5 border border-[#011337]/20 rounded-md p-3 mb-4">
                  <p className="text-[#011337] text-sm font-['Suisse_Intl',sans-serif]">
                    {formState.error}
                  </p>
                </div>
              )}
              
              {/* Auto-fill notification */}
              {isAutoFilled && user && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-green-600 mr-2" />
                    <p className="text-green-800 text-sm font-['Suisse_Intl',sans-serif]">
                      Welcome back, {user.firstName || user.name || user.email}! Your details have been auto-filled.
                      {isGoogleUser && " Please provide your phone number below."}
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-gray-600 text-sm font-['Suisse_Intl',sans-serif]">
                Use this form to let us know roughly when you're free and we'll handle the rest. 
                One of the team will accompany you to the appointment.
              </p>

              <form id="viewing-form" onSubmit={handleSubmit} className="space-y-4">
                {/* Your details Section */}
                <div>
                  <div className="border-t border-gray-200 pt-3 mb-3">
                    <h3 className="text-sm font-medium italic" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Your details</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="title" className="text-sm font-['Suisse_Intl',sans-serif]">
                        Title <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Input 
                        id="title" 
                        name="title" 
                        value={formState.title} 
                        onChange={handleChange} 
                        placeholder="e.g. Mr/Mrs" 
                        className={`mt-1 font-['Suisse_Intl',sans-serif] ${isAutoFilled ? 'bg-green-50 border-green-300' : ''}`}
                      />
                    </div>

                    <div>
                      <Label htmlFor="firstName" className="text-sm font-['Suisse_Intl',sans-serif]">First name</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={formState.firstName} 
                        onChange={handleChange} 
                        placeholder="Please enter your name" 
                        className={`mt-1 font-['Suisse_Intl',sans-serif] ${isAutoFilled ? 'bg-green-50 border-green-300' : ''}`}
                      />
                    </div>

                    <div>
                      <Label htmlFor="lastName" className="text-sm font-['Suisse_Intl',sans-serif]">Last name</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={formState.lastName} 
                        onChange={handleChange} 
                        placeholder="Please enter your last name" 
                        className={`mt-1 font-['Suisse_Intl',sans-serif] ${isAutoFilled ? 'bg-green-50 border-green-300' : ''}`}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-['Suisse_Intl',sans-serif]">Email address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email"
                        value={formState.email} 
                        onChange={handleChange} 
                        placeholder="e.g. name@mail.com" 
                        className={`mt-1 font-['Suisse_Intl',sans-serif] ${isAutoFilled ? 'bg-green-50 border-green-300' : ''}`}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-['Suisse_Intl',sans-serif]">Phone number</Label>
                      <div className="flex mt-1">
                        <div className="flex items-center border border-r-0 rounded-l-md px-3 bg-gray-50">
                          <span className="text-sm">🇮🇳</span>
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </div>
                        <Input 
                          id="phone" 
                          name="phoneNumber" 
                          value={formState.phoneNumber} 
                          onChange={handleChange} 
                          placeholder="(+91) 98765 43210" 
                          className={`rounded-l-none font-['Suisse_Intl',sans-serif] ${isAutoFilled && !isGoogleUser ? 'bg-green-50 border-green-300' : ''}`}
                        />
                        {isGoogleUser && isAutoFilled && (
                          <p className="text-xs text-gray-500 mt-1">
                            Please provide your phone number to complete the request
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* The Viewing Section */}
                <div>
                  <div className="border-t border-gray-200 pt-3 mb-3">
                    <h3 className="text-sm font-medium italic" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>The Viewing</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-['Suisse_Intl',sans-serif]">Preferred date</Label>
                      <div className="mt-2">
                        {/* Calendar */}
                        <div className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <button
                              type="button"
                              onClick={() => navigateCalendar('prev')}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <ChevronLeft className="h-3 w-3 text-gray-400" />
                            </button>
                            <span className="text-xs font-['Suisse_Intl',sans-serif]">
                              {monthNames[calendarView.month]} {calendarView.year}
                            </span>
                            <button
                              type="button"
                              onClick={() => navigateCalendar('next')}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <ChevronRight className="h-3 w-3 text-gray-400" />
                            </button>
                          </div>
                          
                          {/* Calendar Grid */}
                          <div className="grid grid-cols-7 gap-1 text-xs">
                            <div className="text-center text-gray-400 font-['Suisse_Intl',sans-serif]">Sun</div>
                            <div className="text-center text-gray-400 font-['Suisse_Intl',sans-serif]">Mon</div>
                            <div className="text-center text-gray-400 font-['Suisse_Intl',sans-serif]">Tue</div>
                            <div className="text-center text-gray-400 font-['Suisse_Intl',sans-serif]">Wed</div>
                            <div className="text-center text-gray-400 font-['Suisse_Intl',sans-serif]">Thu</div>
                            <div className="text-center text-gray-400 font-['Suisse_Intl',sans-serif]">Fri</div>
                            <div className="text-center text-gray-400 font-['Suisse_Intl',sans-serif]">Sat</div>
                            
                            {calendarDates.map((date, index) => {
                              const isCurrentMonth = date.getMonth() === calendarView.month
                              const isToday = date.toDateString() === new Date().toDateString()
                              const isSelected = formState.preferredDate === date.toISOString().split('T')[0]
                              
                              return (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleSelectChange('preferredDate', date.toISOString().split('T')[0])}
                                  className={`py-1 text-center font-['Suisse_Intl',sans-serif] rounded text-xs ${
                                    isCurrentMonth
                                      ? isSelected
                                        ? 'bg-[#011337] text-white'
                                        : isToday
                                        ? 'bg-[#011337]/10 text-[#011337]'
                                        : 'hover:bg-gray-100'
                                      : 'text-gray-300'
                                  }`}
                                  disabled={!isCurrentMonth}
                                >
                                  {date.getDate()}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-['Suisse_Intl',sans-serif]">Preferred time</Label>
                      <RadioGroup 
                        value={formState.preferredTime} 
                        onValueChange={(value) => handleSelectChange('preferredTime', value)}
                        className="mt-2 space-y-2"
                      >
                        {timeSlots.map((slot) => (
                          <div key={slot.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={slot.value} id={slot.value} className="text-[#011337]" />
                            <Label htmlFor={slot.value} className="cursor-pointer text-sm font-['Suisse_Intl',sans-serif]">
                              {slot.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* Additional info Section */}
                <div>
                  <div className="border-t border-gray-200 pt-3 mb-3">
                    <h3 className="text-sm font-medium italic" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '400'}}>Additional info</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="additionalInfo" className="text-sm font-['Suisse_Intl',sans-serif]">
                        Anything else we should know? <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Textarea 
                        id="additionalInfo" 
                        name="additionalInfo" 
                        value={formState.additionalInfo} 
                        onChange={handleChange} 
                        placeholder="Enter your message" 
                        rows={3}
                        className="mt-1 font-['Suisse_Intl',sans-serif] resize-none"
                      />
                    </div>

                    <div>
                      <Label htmlFor="heardFrom" className="text-sm font-['Suisse_Intl',sans-serif]">
                        Where did you hear about us? <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Select
                        value={formState.heardFrom}
                        onValueChange={(value) => handleSelectChange('heardFrom', value)}
                      >
                        <SelectTrigger className="mt-1 font-['Suisse_Intl',sans-serif]">
                          <SelectValue placeholder="Please select" />
                        </SelectTrigger>
                        <SelectContent>
                          {heardFromOptions.map((option) => (
                            <SelectItem key={option} value={option.toLowerCase().replace(/\s+/g, '-')}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Your privacy Section */}
                <div>
                  <div className="border-t border-gray-200 pt-3 mb-3">
                    <h3 className="text-sm font-bold font-['Suisse_Intl',sans-serif]">Your privacy</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600 font-['Suisse_Intl',sans-serif]">
                      We take the processing and privacy of your information very seriously. Your data is collected and used in accordance with our{" "}
                      <a href="#" className="font-bold text-black underline">Terms and Conditions</a> and{" "}
                      <a href="#" className="font-bold text-black underline">Global Privacy Policy</a>.
                    </p>
                    <p className="text-xs text-gray-600 font-['Suisse_Intl',sans-serif]">
                      Find out{" "}
                      <a href="#" className="font-bold text-black underline">how we use your personal information.</a>
                    </p>
                  </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="text-center pt-3">
                  <p className="text-xs text-gray-500 font-['Suisse_Intl',sans-serif]">
                    This site is protected by reCAPTCHA and the Google{" "}
                    <a href="#" className="font-bold text-black underline">Privacy Policy</a> and{" "}
                    <a href="#" className="font-bold text-black underline">Terms of Services</a>.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Fixed Footer with Action Buttons */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="space-y-2">
              <Button 
                type="submit" 
                form="viewing-form"
                className="w-full bg-[#011337] hover:bg-[#011337]/90 text-white font-['Suisse_Intl',sans-serif]" 
                disabled={formState.loading}
              >
                {formState.loading ? "Submitting..." : "Submit"}
              </Button>
              {variant === "drawer" ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="w-full border-black text-black hover:bg-gray-50 font-['Suisse_Intl',sans-serif]"
                >
                  Close
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
