// IP-based rate limiting storage
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>()

// Get client IP address
export const getClientIP = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  // Fallback to a default IP (in production, this should be the actual IP)
  return 'unknown'
}

// IP-based rate limiting
export const checkIPRateLimit = (
  ip: string, 
  maxRequests: number = 10, 
  windowMs: number = 3600000
): boolean => {
  const now = Date.now()
  const ipRequests = ipRequestCounts.get(ip)

  if (!ipRequests || now > ipRequests.resetTime) {
    // First request or window expired
    ipRequestCounts.set(ip, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }

  if (ipRequests.count >= maxRequests) {
    return false // Rate limit exceeded
  }

  // Increment count
  ipRequests.count++
  return true
}

// Clean up old rate limit entries (run periodically)
export const cleanupRateLimits = () => {
  const now = Date.now()
  for (const [key, value] of ipRequestCounts.entries()) {
    if (now > value.resetTime) {
      ipRequestCounts.delete(key)
    }
  }
}

// Run cleanup every hour
setInterval(cleanupRateLimits, 3600000) 