import { prisma } from './prisma'
import { getClientIP, checkIPRateLimit } from './rate-limit'

// Rate limiting storage (in production, use Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

// Validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '')
  // Check if it's between 10-15 digits
  return cleanPhone.length >= 10 && cleanPhone.length <= 15
}

export const validateName = (name: string): boolean => {
  // Check if name is not empty and has reasonable length
  return name.trim().length >= 2 && name.trim().length <= 50
}

// Rate limiting function
export const checkRateLimit = (identifier: string, maxRequests: number = 5, windowMs: number = 3600000): boolean => {
  const now = Date.now()
  const userRequests = requestCounts.get(identifier)

  if (!userRequests || now > userRequests.resetTime) {
    // First request or window expired
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }

  if (userRequests.count >= maxRequests) {
    return false // Rate limit exceeded
  }

  // Increment count
  userRequests.count++
  return true
}

// Check for duplicate property view requests
export const checkDuplicatePropertyRequest = async (
  propertyId: string,
  email: string,
  timeWindowHours: number = 24
): Promise<boolean> => {
  const timeWindow = new Date()
  timeWindow.setHours(timeWindow.getHours() - timeWindowHours)

  const existingRequest = await prisma.propertyViewRequest.findFirst({
    where: {
      propertyId,
      email,
      createdAt: {
        gte: timeWindow
      }
    }
  })

  return !!existingRequest
}

// Check for duplicate contact requests
export const checkDuplicateContactRequest = async (
  email: string,
  timeWindowHours: number = 24
): Promise<boolean> => {
  const timeWindow = new Date()
  timeWindow.setHours(timeWindow.getHours() - timeWindowHours)

  const existingRequest = await prisma.contactRequest.findFirst({
    where: {
      email,
      createdAt: {
        gte: timeWindow
      }
    }
  })

  return !!existingRequest
}

// Validate property view request data
export const validatePropertyViewRequest = async (
  data: {
    propertyId: string
    firstName: string
    lastName: string
    email: string
    phone: string
    title?: string
    preferredDate?: string
    preferredTime?: string
    additionalInfo?: string
    heardFrom?: string
  },
  request?: Request
) => {
  const errors: string[] = []

  // Check if property exists
  const property = await prisma.property.findUnique({
    where: { id: data.propertyId },
    select: { id: true },
  })

  if (!property) {
    errors.push('Property not found')
  }

  // Validate required fields
  if (!data.firstName || !validateName(data.firstName)) {
    errors.push('Valid first name is required')
  }

  if (!data.lastName || !validateName(data.lastName)) {
    errors.push('Valid last name is required')
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email address is required')
  }

  if (!data.phone || !validatePhone(data.phone)) {
    errors.push('Valid phone number is required')
  }

  // Check for duplicate request
  if (property) {
    const isDuplicate = await checkDuplicatePropertyRequest(data.propertyId, data.email)
    if (isDuplicate) {
      errors.push('You have already requested a viewing for this property in the last 24 hours')
    }
  }

  // Rate limiting checks
  const rateLimitKey = `property_view_${data.email}`
  if (!checkRateLimit(rateLimitKey, 3, 3600000)) { // 3 requests per hour
    errors.push('Too many property view requests. Please wait before making another request.')
  }

  // IP-based rate limiting
  if (request) {
    const clientIP = getClientIP(request)
    if (!checkIPRateLimit(clientIP, 20, 3600000)) { // 20 requests per hour per IP
      errors.push('Too many requests from this IP address. Please wait before making another request.')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validate contact request data
export const validateContactRequest = async (
  data: {
    name: string
    email: string
    phone: string
    message: string
  },
  request?: Request
) => {
  const errors: string[] = []

  // Validate required fields
  if (!data.name || !validateName(data.name)) {
    errors.push('Valid name is required')
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email address is required')
  }

  if (!data.phone || !validatePhone(data.phone)) {
    errors.push('Valid phone number is required')
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long')
  }

  if (data.message && data.message.length > 1000) {
    errors.push('Message is too long (maximum 1000 characters)')
  }

  // Check for duplicate contact request
  const isDuplicate = await checkDuplicateContactRequest(data.email)
  if (isDuplicate) {
    errors.push('You have already submitted a contact request in the last 24 hours')
  }

  // Rate limiting checks
  const rateLimitKey = `contact_${data.email}`
  if (!checkRateLimit(rateLimitKey, 2, 3600000)) { // 2 requests per hour
    errors.push('Too many contact requests. Please wait before making another request.')
  }

  // IP-based rate limiting
  if (request) {
    const clientIP = getClientIP(request)
    if (!checkIPRateLimit(clientIP, 15, 3600000)) { // 15 requests per hour per IP
      errors.push('Too many requests from this IP address. Please wait before making another request.')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validate career application data
export const validateCareerApplication = async (
  data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    position: string
    experience: string
    message: string
    resume?: string
    location?: string // Add location to data interface
  },
  request?: Request
) => {
  const errors: string[] = []

  // Validate required fields
  if (!data.firstName || !validateName(data.firstName)) {
    errors.push('Valid first name is required')
  }

  if (!data.lastName || !validateName(data.lastName)) {
    errors.push('Valid last name is required')
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email address is required')
  }

  if (!data.phone || !validatePhone(data.phone)) {
    errors.push('Valid phone number is required')
  }

  if (!data.position || data.position.trim().length < 2) {
    errors.push('Valid position is required')
  }

  if (!data.location || data.location.trim().length < 2) { // Add validation for location
    errors.push('Valid location is required')
  }

  if (!data.experience || data.experience.trim().length < 2) {
    errors.push('Valid experience level is required')
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long')
  }

  if (data.message && data.message.length > 1000) {
    errors.push('Message is too long (maximum 1000 characters)')
  }

  // Check for duplicate career application
  const isDuplicate = await checkDuplicateCareerApplication(data.email)
  if (isDuplicate) {
    errors.push('You have already submitted a career application in the last 24 hours')
  }

  // Rate limiting checks
  const rateLimitKey = `career_${data.email}`
  if (!checkRateLimit(rateLimitKey, 100, 3600000)) { // 100 applications per hour for testing
    errors.push('Too many career applications. Please wait before making another application.')
  }

  // IP-based rate limiting
  if (request) {
    const clientIP = getClientIP(request)
    if (!checkIPRateLimit(clientIP, 100, 3600000)) { // 100 applications per hour per IP for testing
      errors.push('Too many applications from this IP address. Please wait before making another application.')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Check for duplicate career applications
export const checkDuplicateCareerApplication = async (
  email: string,
  timeWindowHours: number = 24
): Promise<boolean> => {
  const timeWindow = new Date()
  timeWindow.setHours(timeWindow.getHours() - timeWindowHours)

  const existingApplication = await prisma.careerApplication.findFirst({
    where: {
      email,
      createdAt: {
        gte: timeWindow
      }
    }
  })

  return !!existingApplication
} 