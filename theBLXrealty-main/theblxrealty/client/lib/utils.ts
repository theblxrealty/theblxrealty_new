import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to capitalize first letters of words
export function capitalizeWords(str: string): string {
  if (!str) return str
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

// Helper function to format property types with proper capitalization
export function formatPropertyType(type: string): string {
  if (!type) return 'Property'
  
  // Handle special cases first
  const specialCases: { [key: string]: string } = {
    'luxury villas': 'Luxury Villas',
    'flats': 'Flats',
    'new buildings': 'New Buildings',
    'farm house': 'Farm House',
    'sites': 'Sites',
    'commercial': 'Commercial',
    'investment': 'Investment',
    'apartment villa': 'Apartment Villa',
    'apartment-villa': 'Apartment Villa'
  }
  
  // Check for special cases first
  const lowerType = type.toLowerCase()
  if (specialCases[lowerType]) {
    return specialCases[lowerType]
  }
  
  // Fallback to general capitalization
  return capitalizeWords(type)
}

// Helper function to convert image URLs to full Supabase storage URLs
export function getSupabaseImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return '/placeholder.svg'
  
  // If it's already a full URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // If it's a placeholder, return as is
  if (imageUrl.startsWith('/')) {
    return imageUrl
  }
  
  // Otherwise, construct the full Supabase URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gjpujedmzdthonncnwsg.supabase.co'
  return `${supabaseUrl}/storage/v1/object/public/images/properties/${imageUrl}`
}

/** Normalize DB/form values to keys used by formatPrice. */
export function normalizePriceUnit(unit: string | null | undefined): string {
  const raw = (unit || 'cr').toLowerCase().trim().replace(/\s+/g, '_')
  const aliases: Record<string, string> = {
    per_sqft: 'per_sqft',
    per_sq_ft: 'per_sqft',
    persqft: 'per_sqft',
    per_sq: 'per_sqft',
    sqft: 'per_sqft',
    sq_ft: 'per_sqft',
    rs: 'rs',
    inr: 'rs',
    lakh: 'lakh',
    lakhs: 'lakh',
    cr: 'cr',
    crore: 'cr',
    crores: 'cr',
  }
  return aliases[raw] ?? raw
}

// Format price with unit
export function formatPrice(
  price: number | string | null | undefined,
  unit: string | null | undefined
): string {
  if (price === null || price === undefined) {
    return 'N/A'
  }

  // Defensive: some callers can pass price as a string
  const numericPrice =
    typeof price === 'number' ? price : Number.parseFloat(String(price))
  if (Number.isNaN(numericPrice)) {
    return 'N/A'
  }

  const unitKey = normalizePriceUnit(unit)

  const formatters: { [key: string]: (price: number) => string } = {
    rs: (p: number) => {
      if (p >= 1000000) return `₹${(p / 1000000).toFixed(2)} Cr`
      if (p >= 100000) return `₹${(p / 100000).toFixed(2)} Lakhs`
      return `₹${p.toLocaleString('en-IN')}`
    },
    lakh: (p: number) => `₹${p.toFixed(2)} Lakhs`,
    cr: (p: number) => `₹${p.toFixed(2)} Cr`,
    per_sqft: (p: number) => `₹${p.toFixed(0)}/Sq.Ft`,
  }

  const formatter = formatters[unitKey] || formatters.cr
  return formatter(numericPrice)
}
