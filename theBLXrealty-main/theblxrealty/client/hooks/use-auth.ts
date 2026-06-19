'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuth(requireAuth = false, redirectTo = '/') {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (requireAuth && !session) {
      // User is not authenticated and auth is required
      router.push(redirectTo)
    } else if (!requireAuth && session) {
      // User is authenticated but shouldn't be on this page (e.g., login page)
      router.push('/')
    }
  }, [session, status, requireAuth, redirectTo, router])

  return { session, status, isAuthenticated: !!session }
}
