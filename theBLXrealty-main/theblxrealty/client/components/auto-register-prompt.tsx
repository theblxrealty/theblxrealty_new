'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import AuthModal from '@/components/auth-modal'

export default function AutoRegisterPrompt() {
  const { data: session } = useSession()
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [hasShownPrompt, setHasShownPrompt] = useState(false)

  useEffect(() => {
    // Only show the prompt if user is not authenticated and we haven't shown it yet
    if (!session && !hasShownPrompt) {
      const timer = setTimeout(() => {
        setShowRegisterModal(true)
        setHasShownPrompt(true)
      }, 10000) // 15 seconds

      return () => clearTimeout(timer)
    }
  }, [session, hasShownPrompt])

  const handleLoginSuccess = () => {
    // Just close the modal, session will be updated
    setShowRegisterModal(false)
  }

  return (
    <AuthModal
      isOpen={showRegisterModal}
      onClose={() => setShowRegisterModal(false)}
      onLoginSuccess={handleLoginSuccess}
      defaultToRegister={true}
    />
  )
}
