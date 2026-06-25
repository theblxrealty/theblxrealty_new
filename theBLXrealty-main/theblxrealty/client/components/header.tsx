"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Phone, Search, User, LogOut, Shield, Plus, Home, FileText, Briefcase, Building2, TreePine, Warehouse, MapPin, Scale, TrendingUp, BookOpen, Lightbulb, Newspaper } from "lucide-react"
import { Button } from "@/components/ui/button"
import AuthModal from "@/components/auth-modal"
import PropertySearch from "@/components/property-search"
import { useSession, signOut } from "next-auth/react"
import { useAdmin } from "@/hooks/use-admin"

const navItems = [
  { name: "About", path: "/about" },
  { name: "Careers", path: "/careers", newWindow: true },
  { name: "Contact", path: "/contact" },
]

const propertyTypes = [
  { name: "Flats", path: "/properties?type=flats", icon: Building2 },
  { name: "Villas", path: "/properties?type=luxury villas", icon: Home },
  { name: "Commercial", path: "/properties?type=commercial", icon: Warehouse },
  { name: "Sites", path: "/properties?type=sites", icon: MapPin },
]

const blogCategoryIcons: { [key: string]: any } = {
  "legal": Scale,
  "investment": TrendingUp,
  "market": Building2,
  "guide": BookOpen,
  "news": Newspaper,
  "tips": Lightbulb,
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null)
  const [popularAreas, setPopularAreas] = useState<string[]>([])
  const [areasLoading, setAreasLoading] = useState(true)
  const [blogCategories, setBlogCategories] = useState<string[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const { isAdmin, adminUser, loading: adminLoading, logout } = useAdmin()

  useEffect(() => {
    let lastScrollY = 0;
    let ticking = false;

    const handleScroll = () => {
      lastScrollY = window.scrollY;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // OPTIMIZED: Throttled scroll listener using requestAnimationFrame (60fps max)
          // BEFORE: Fired 60+ times per second, causing jank
          // AFTER: Fired max once per frame (16.67ms), eliminating scroll lag
          if (lastScrollY > 500) {
            setIsScrolled(true)
          } else {
            setIsScrolled(false)
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    // Check initial scroll position on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Effect to load user data from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        setUserDisplayName(user.firstName || user.email)
      }
    }
  }, [])

  // Effect to fetch popular areas from database
  useEffect(() => {
    const fetchPopularAreas = async () => {
      try {
        setAreasLoading(true)
        const response = await fetch('/api/properties/locations')
        const data = await response.json()
        if (data.locations && Array.isArray(data.locations)) {
          setPopularAreas(data.locations.slice(0, 6))
        }
      } catch (error) {
        console.warn('Failed to fetch popular areas:', error)
        // Fallback to default areas if API fails
        setPopularAreas([
          "Whitefield",
          "Electronic City",
          "Yelahanka",
          "Koramangala",
          "HSR Layout",
          "Lavelle Road"
        ])
      } finally {
        setAreasLoading(false)
      }
    }

    fetchPopularAreas()
    // Refresh areas every 5 minutes to keep them up to date
    const interval = setInterval(fetchPopularAreas, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Effect to fetch blog categories from database
  useEffect(() => {
    const fetchBlogCategories = async () => {
      try {
        setCategoriesLoading(true)
        const response = await fetch('/api/blog/categories')
        const data = await response.json()
        if (data.categories && Array.isArray(data.categories)) {
          setBlogCategories(data.categories)
        }
      } catch (error) {
        console.warn('Failed to fetch blog categories:', error)
        // Fallback to default categories if API fails
        setBlogCategories([
          "Legal",
          "Investment",
          "Market",
          "Guide",
          "News",
          "Tips"
        ])
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchBlogCategories()
    // Refresh categories every 5 minutes to keep them up to date
    const interval = setInterval(fetchBlogCategories, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' })
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('adminUser')
      localStorage.removeItem('adminToken')
      setUserDisplayName(null)
    } catch (error) {
      console.warn('Logout error:', error)
    }
  }

  const handleLoginSuccess = (userData: any, adminStatus: boolean) => {
    if (!adminStatus) {
      setUserDisplayName(userData.firstName || userData.email)
    }
    // Handle admin login success
    if (adminStatus) {
      // Force refresh to update admin state
      window.location.reload()
    }
    setAuthModalOpen(false)
  }

  // Determine text color based on scrolled state for high contrast
  const textColor = isScrolled ? "text-gray-900" : "text-slate-200"
  const hoverTextColor = "hover:text-[#011337]"
  const activeTextColor = "text-[#011337] font-bold"

  const headerPadding = "py-"

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled 
          // 1. New: bg-gray-100 for light gray background when scrolled
          ? "bg-gray-100 shadow-lg" 
          : "bg-transparent" 
      }`}
    >
      {/* 2. Reduced padding (py-2 for both states) to reduce overall height */}
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${headerPadding}`}>
        <div className="flex items-center justify-between">
          
          {/* Left Section - Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-[150px] h-[150px] overflow-visible">
              <Image
                src="/logo.webp"
                alt="The BLX Realty Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Center Section - Navigation */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {/* For Buyers Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
                href="/properties"
                className={`text-base font-medium transition-colors relative font-['Suisse_Intl',sans-serif] ${
                  pathname === "/properties"
                    ? activeTextColor
                    : `${textColor} ${hoverTextColor}`
                }`}
              >
                Properties
              </Link>
              
              {/* Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-[650px] bg-white rounded-xl shadow-2xl border border-gray-100 py-6 px-6 z-50"
                  >
                    <div className="grid grid-cols-2 gap-8">
                      {/* Property Types Section */}
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                          <div className="w-1 h-4 bg-[#011337] rounded"></div>
                          Property Type
                        </h3>
                        <div className="space-y-3">
                          {propertyTypes.map((type) => {
                            const IconComponent = type.icon
                            return (
                              <Link
                                key={type.name}
                                href={type.path}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                              >
                                <div className="p-1.5 bg-[#011337]/5 rounded-lg group-hover:bg-[#011337]/10 transition-colors flex-shrink-0">
                                  <IconComponent className="w-4 h-4 text-[#011337]" />
                                </div>
                                <span className="text-gray-700 text-sm font-medium group-hover:text-[#011337] transition-colors">
                                  {type.name}
                                </span>
                              </Link>
                            )
                          })}
                        </div>
                      </div>

                      {/* Popular Areas Section */}
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                          <div className="w-1 h-4 bg-[#011337] rounded"></div>
                          Popular Areas
                        </h3>
                        <div className="space-y-2">
                          {areasLoading ? (
                            <div className="text-gray-500 text-sm">Loading...</div>
                          ) : popularAreas.length > 0 ? (
                            popularAreas.map((area) => (
                              <button
                                key={area}
                                onClick={() => {
                                  router.push(`/properties?search=${encodeURIComponent(area)}`)
                                  setDropdownOpen(false)
                                }}
                                className="text-left p-2 rounded-lg hover:bg-gray-50 transition-colors group w-full"
                              >
                                <span className="text-gray-600 text-sm font-medium group-hover:text-[#011337] transition-colors flex items-center gap-2">
                                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                  {area}
                                </span>
                              </button>
                            ))
                          ) : (
                            <div className="text-gray-500 text-sm">No areas available</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Blog Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setBlogDropdownOpen(true)}
              onMouseLeave={() => setBlogDropdownOpen(false)}
            >
              <Link
                href="/blog"
                className={`text-base font-medium transition-colors relative font-['Suisse_Intl',sans-serif] ${
                  pathname === "/blog"
                    ? activeTextColor
                    : `${textColor} ${hoverTextColor}`
                }`}
              >
                Blog
              </Link>
              
              {/* Blog Dropdown Menu */}
              <AnimatePresence>
                {blogDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-4 px-4 z-50"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide px-2">
                        <div className="w-1 h-4 bg-[#011337] rounded"></div>
                        Categories
                      </h3>
                      <div className="space-y-2">
                        {categoriesLoading ? (
                          <div className="text-gray-500 text-sm px-2">Loading...</div>
                        ) : blogCategories.length > 0 ? (
                          blogCategories.map((category) => {
                            const IconComponent = blogCategoryIcons[category.toLowerCase()] || BookOpen
                            return (
                              <Link
                                key={category}
                                href={`/blog?category=${encodeURIComponent(category)}`}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                                onClick={() => setBlogDropdownOpen(false)}
                              >
                                <div className="p-1.5 bg-[#011337]/5 rounded-lg group-hover:bg-[#011337]/10 transition-colors flex-shrink-0">
                                  <IconComponent className="w-4 h-4 text-[#011337]" />
                                </div>
                                <span className="text-gray-700 text-sm font-medium group-hover:text-[#011337] transition-colors">
                                  {category}
                                </span>
                              </Link>
                            )
                          })
                        ) : (
                          <div className="text-gray-500 text-sm px-2">No categories available</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                target={item.newWindow ? "_blank" : undefined}
                rel={item.newWindow ? "noopener noreferrer" : undefined}
                className={`text-base font-medium transition-colors relative font-['Suisse_Intl',sans-serif] ${
                  pathname === item.path
                    ? activeTextColor // Red and bold when active
                    // 4. Updated default and hover colors for light gray background
                    : `${textColor} ${hoverTextColor}` 
                }`}
              >
                {item.name}
                {pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#011337]"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section - Search, Admin Actions, Auth Button and Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              // 4. Updated text color for light gray background
              className={`${isScrolled ? "text-gray-900" : "text-white"} hover:text-[#011337] transition-colors p-2`}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Admin Add Button (Colors remain the same as it has its own background) */}
            {isAdmin && !adminLoading && (
              <button
                onClick={() => setAddModalOpen(true)}
                className="flex items-center space-x-1 bg-[#011337] hover:bg-[#011337] text-white px-4 py-2 rounded-lg font-['Suisse_Intl',sans-serif] font-medium transition-all duration-300 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            )}

            {/* User Session/Login/Admin Display */}
            {userDisplayName ? (
              <div className="flex items-center space-x-2">
                <span className={textColor + " text-sm"}>
                  Welcome, {userDisplayName}
                </span>
                <Button
                  onClick={handleLogout}
                  // 4. Updated text color for light gray background
                  className={`bg-transparent ${textColor} px-4 py-2 font-['Suisse_Intl',sans-serif] font-medium hover:bg-transparent ${hoverTextColor} transition-all duration-300 relative group text-sm`}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : isAdmin && !adminLoading ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-sm" style={{ color: isScrolled ? '#374151' : 'white' }}>
                  <Shield className="h-4 w-4 text-[#011337]" />
                  <span>Admin: {adminUser?.firstName || adminUser?.email}</span>
                </div>
                <Button
                  onClick={() => {
                    logout()
                    window.location.reload()
                  }}
                  // 4. Updated text color for light gray background
                  className={`bg-transparent ${textColor} px-4 py-2 font-['Suisse_Intl',sans-serif] font-medium hover:bg-transparent ${hoverTextColor} transition-all duration-300 relative group text-sm`}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setAuthModalOpen(true)}
                // 4. Updated text color for light gray background
                className={`bg-transparent ${textColor} px-6 py-2 font-['Suisse_Intl',sans-serif] font-medium hover:bg-transparent ${hoverTextColor} transition-all duration-300 relative group text-base`}
              >
                <span className="relative flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Sign in
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#011337] transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? (
                // 4. Updated icon color for light gray background
                <X className={`h-6 w-6 ${isScrolled ? "text-gray-900" : "text-white"}`} />
              ) : (
                // 4. Updated icon color for light gray background
                <Menu className={`h-6 w-6 ${isScrolled ? "text-gray-900" : "text-white"}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content (Keep dark background for readability) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-700 bg-gradient-to-br from-[#011337] via-[#011337]/95 to-[#011337]/90"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {/* Mobile For Buyers Dropdown */}
              <div>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-lg py-2 font-['Suisse_Intl',sans-serif] text-slate-200 hover:text-[#011337] w-full text-left"
                >
                  For Buyers
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 mt-3 space-y-4 border-l-2 border-slate-500 pl-4"
                    >
                      {/* Mobile Property Types */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Property Type</h4>
                        <div className="space-y-1.5">
                          {propertyTypes.map((type) => {
                            const IconComponent = type.icon
                            return (
                              <Link
                                key={type.name}
                                href={type.path}
                                className="flex items-center gap-2 text-slate-200 hover:text-[#011337] py-1.5 font-['Suisse_Intl',sans-serif] transition-colors text-sm"
                                onClick={() => {
                                  setMobileMenuOpen(false)
                                  setDropdownOpen(false)
                                }}
                              >
                                <IconComponent className="w-4 h-4" />
                                {type.name}
                              </Link>
                            )
                          })}
                        </div>
                      </div>

                      {/* Mobile Popular Areas */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Popular Areas</h4>
                        <div className="space-y-1">
                          {areasLoading ? (
                            <div className="text-slate-400 text-xs">Loading...</div>
                          ) : popularAreas.length > 0 ? (
                            popularAreas.map((area) => (
                              <button
                                key={area}
                                onClick={() => {
                                  router.push(`/properties?search=${encodeURIComponent(area)}`)
                                  setMobileMenuOpen(false)
                                  setDropdownOpen(false)
                                }}
                                className="block text-slate-200 hover:text-[#011337] py-1 font-['Suisse_Intl',sans-serif] text-left text-sm transition-colors"
                              >
                                📍 {area}
                              </button>
                            ))
                          ) : (
                            <div className="text-slate-400 text-xs">No areas available</div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Blog Dropdown */}
              <div>
                <button
                  onClick={() => setBlogDropdownOpen(!blogDropdownOpen)}
                  className="text-lg py-2 font-['Suisse_Intl',sans-serif] text-slate-200 hover:text-[#011337] w-full text-left"
                >
                  Blog
                </button>
                <AnimatePresence>
                  {blogDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 mt-3 space-y-2 border-l-2 border-slate-500 pl-4"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Categories</h4>
                        <div className="space-y-1.5">
                          {categoriesLoading ? (
                            <div className="text-slate-400 text-xs">Loading...</div>
                          ) : blogCategories.length > 0 ? (
                            blogCategories.map((category) => {
                              const IconComponent = blogCategoryIcons[category.toLowerCase()] || BookOpen
                              return (
                                <Link
                                  key={category}
                                  href={`/blog?category=${encodeURIComponent(category)}`}
                                  className="flex items-center gap-2 text-slate-200 hover:text-[#011337] py-1.5 font-['Suisse_Intl',sans-serif] transition-colors text-sm"
                                  onClick={() => {
                                    setMobileMenuOpen(false)
                                    setBlogDropdownOpen(false)
                                  }}
                                >
                                  <IconComponent className="w-4 h-4" />
                                  {category}
                                </Link>
                              )
                            })
                          ) : (
                            <div className="text-slate-400 text-xs">No categories available</div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  target={item.newWindow ? "_blank" : undefined}
                  rel={item.newWindow ? "noopener noreferrer" : undefined}
                  className={`text-lg py-2 font-['Suisse_Intl',sans-serif] ${
                    pathname === item.path ? "text-[#011337] font-medium" : "text-slate-200 hover:text-[#011337]"
                  }`}
                  onClick={() => !item.newWindow && setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Admin Add Button - Mobile */}
              {isAdmin && !adminLoading && (
                <button
                  onClick={() => {
                    setAddModalOpen(true)
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-2 bg-[#011337] hover:bg-[#011337] text-white px-4 py-3 rounded-lg font-['Suisse_Intl',sans-serif] font-medium transition-all duration-300 text-lg"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add</span>
                </button>
              )}

              <div className="pt-4 border-t border-slate-700">
                {userDisplayName ? (
                  <div className="space-y-2">
                    <div className="text-white text-sm">
                      Welcome, {userDisplayName}
                    </div>
                    <Button
                      onClick={handleLogout}
                      className="w-full bg-transparent text-white font-['Suisse_Intl',sans-serif] font-medium hover:bg-transparent hover:text-white transition-all duration-300 relative group text-lg"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : isAdmin && !adminLoading ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-white text-sm">
                      <Shield className="h-4 w-4 text-[#011337]" />
                      <span>Admin: {adminUser?.firstName || adminUser?.email}</span>
                    </div>
                    <Button
                      onClick={() => {
                        logout() 
                        setMobileMenuOpen(false)
                        window.location.reload() 
                      }}
                      className="w-full bg-transparent text-white font-['Suisse_Intl',sans-serif] font-medium hover:bg-transparent hover:text-white transition-all duration-300 relative group text-lg"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setAuthModalOpen(true)}
                    className="w-full bg-transparent text-white font-['Suisse_Intl',sans-serif] font-medium hover:bg-transparent hover:text-white transition-all duration-300 relative group text-lg"
                  >
                    <span className="relative flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Sign in
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#011337] transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Overlay with PropertySearch */}
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-3xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <PropertySearch 
                placeholder="Search by location, property type, or bedrooms..."
                className="w-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Auth Modal (No changes needed) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Add Modal (No changes needed) */}
      <AnimatePresence>
        {addModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setAddModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h3>
                <p className="text-gray-600">Manage your properties and blog posts</p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    router.push('/addprop')
                    setAddModalOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 p-4 bg-[#011337]/5 hover:bg-[#011337]/10 border border-[#011337]/20 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-[#011337] rounded-lg flex items-center justify-center group-hover:bg-[#011337] transition-colors">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">Add Property</h4>
                    <p className="text-sm text-gray-600">Create a new property listing</p>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    router.push('/admin-blogs/add')
                    setAddModalOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">Add Blog Post</h4>
                    <p className="text-sm text-gray-600">Create a new blog article</p>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    router.push('/add-career-posting')
                    setAddModalOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">Add Career Posting</h4>
                    <p className="text-sm text-gray-600">Create a new job posting</p>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    router.push('/admin-properties')
                    setAddModalOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">Manage Properties</h4>
                    <p className="text-sm text-gray-600">View and delete properties</p>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    router.push('/admin-blogs')
                    setAddModalOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">Manage Blog Posts</h4>
                    <p className="text-sm text-gray-600">View and delete blog posts</p>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    router.push('/admin-career-postings')
                    setAddModalOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">Manage Career Postings</h4>
                    <p className="text-sm text-gray-600">View and delete job postings</p>
                  </div>
                </button>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}