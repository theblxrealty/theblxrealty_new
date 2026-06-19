"use client"

import { useState } from 'react'
import { X, Copy, Share2, MessageCircle, Facebook, Twitter, Mail, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  propertyTitle: string
  propertyUrl: string
}

export default function ShareModal({ isOpen, onClose, propertyTitle, propertyUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  if (!isOpen) return null

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(propertyUrl)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Property link has been copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the link manually",
        variant: "destructive",
      })
    }
  }

  const handleWhatsAppShare = () => {
    const text = `Check out this amazing property: ${propertyTitle}`
    const url = `https://wa.me/?text=${encodeURIComponent(`${text} ${propertyUrl}`)}`
    window.open(url, '_blank')
  }

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`
    window.open(url, '_blank')
  }

  const handleTwitterShare = () => {
    const text = `Check out this amazing property: ${propertyTitle}`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(propertyUrl)}`
    window.open(url, '_blank')
  }

  const handleEmailShare = () => {
    const subject = `Amazing Property: ${propertyTitle}`
    const body = `Hi,\n\nI found this amazing property that might interest you:\n\n${propertyTitle}\n\nCheck it out here: ${propertyUrl}\n\nBest regards`
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(url)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold font-['Suisse_Intl',sans-serif]">Share Property</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Property URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 font-['Suisse_Intl',sans-serif]">
              Property Link
            </label>
            <div className="flex gap-2">
              <Input
                value={propertyUrl}
                readOnly
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="min-w-[80px]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 font-['Suisse_Intl',sans-serif]">
              Share via
            </label>
            
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-green-50 rounded-lg transition-colors group"
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 font-['Suisse_Intl',sans-serif]">WhatsApp</div>
                <div className="text-sm text-gray-500">Share via WhatsApp</div>
              </div>
              <Share2 className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebookShare}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-blue-50 rounded-lg transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Facebook className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 font-['Suisse_Intl',sans-serif]">Facebook</div>
                <div className="text-sm text-gray-500">Share on Facebook</div>
              </div>
              <Share2 className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>

            {/* Twitter */}
            <button
              onClick={handleTwitterShare}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-sky-50 rounded-lg transition-colors group"
            >
              <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
                <Twitter className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 font-['Suisse_Intl',sans-serif]">Twitter</div>
                <div className="text-sm text-gray-500">Share on Twitter</div>
              </div>
              <Share2 className="h-4 w-4 text-gray-400 group-hover:text-sky-500 transition-colors" />
            </button>

            {/* Email */}
            <button
              onClick={handleEmailShare}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#011337]/5 rounded-lg transition-colors group"
            >
              <div className="w-10 h-10 bg-[#011337] rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 font-['Suisse_Intl',sans-serif]">Email</div>
                <div className="text-sm text-gray-500">Share via Email</div>
              </div>
              <Share2 className="h-4 w-4 text-gray-400 group-hover:text-[#011337] transition-colors" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <Button
            onClick={onClose}
            className="w-full"
            variant="outline"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

