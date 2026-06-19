"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Youtube, Instagram, Linkedin,Twitter} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const { toast } = useToast()

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsSubscribing(true)
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Successfully Subscribed! 🎉",
          description: data.message || "You're now subscribed to our newsletter.",
        })
        setEmail("")
      } else {
        toast({
          title: "Subscription Failed",
          description: data.error || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <footer className="bg-gradient-to-br from-[#011337] via-[#011337]/95 to-[#011337]/90 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Section 1: Company Info & Social Links */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <div className="relative w-12 h-12 overflow-hidden">
                <Image
                  src="/logo2.webp"
                  alt="The BLX Realty Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="ml-3 text-xl text-white" style={{fontFamily: 'Tiempos Headline, serif', fontWeight: '500'}}>The Bengaluru-London Exchange</span>
            </Link>
            <p className="text-slate-300 mb-6" style={{fontFamily: 'Tiempos Headline, serif'}}>
              Your trusted partner for buying, selling and investing in premium properties, Residential & Commercial Plots across Bengaluru & London's most
              prestigious locations.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/BLXrealty" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://www.instagram.com/theblxrealty/" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              
              <a href="https://x.com/BlxRealty" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">X</span>
              </a>
              
              <a href="https://www.youtube.com/@BLXREALTY" className="text-slate-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">Youtube</span>
              </a>
              <a href="https://www.linkedin.com/company/11-square-realty/?viewAsMember=true" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div className="lg:col-span-1 flex flex-col items-center text-center">
            <h3 className="text-lg font-bold mb-6 text-white font-['Suisse_Intl',sans-serif]">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-slate-300 hover:text-white transition-colors font-['Suisse_Intl',sans-serif]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-slate-300 hover:text-white transition-colors font-['Suisse_Intl',sans-serif]">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-white transition-colors font-['Suisse_Intl',sans-serif]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-slate-300 hover:text-white transition-colors font-['Suisse_Intl',sans-serif]">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-white transition-colors font-['Suisse_Intl',sans-serif]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Contact Us */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-6 text-white font-['Suisse_Intl',sans-serif]">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                <span className="text-slate-300 font-['Suisse_Intl',sans-serif]">#0301D 3rd floor, Brigade Twin Towers
Ward No. 38, No. 11/1-4 Pipeline Road HMT, Yeswanthpur, Bengaluru, Karnataka 560022, India</span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                <span className="text-slate-300 font-['Suisse_Intl',sans-serif]">+91 9743264328</span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                <span className="text-slate-300 font-['Suisse_Intl',sans-serif]">Discoverblr@theblxrealty.com</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Newsletter Subscription */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-6 text-white font-['Suisse_Intl',sans-serif]">Newsletter</h3>
            <p className="text-slate-300 mb-4 font-['Suisse_Intl',sans-serif]">
              Stay updated with the latest property insights, market trends, and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-300 focus:border-white backdrop-blur-sm"
                required
              />
              <Button 
                type="submit" 
                className="w-full bg-white text-[#011337] hover:bg-slate-100"
                disabled={isSubscribing}
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            <p className="text-slate-400 text-xs mt-2 font-['Suisse_Intl',sans-serif]">
              We respect your privacy. 
            </p>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm mb-4 md:mb-0 font-['Suisse_Intl',sans-serif]">
            &copy; {new Date().getFullYear()} BLX Realty Pvt LTD. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors font-['Suisse_Intl',sans-serif]">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
