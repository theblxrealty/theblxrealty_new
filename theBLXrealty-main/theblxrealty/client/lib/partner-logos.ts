/**
 * Partner Logo Paths
 * All partner logos are stored in the public/partners directory
 */

export const partnerLogos = {
  brigade: {
    png: "/partners/brigade png.webp",
    jpg: "/partners/brigade jpeg.webp",
  },
  embassy: {
    png: "/partners/embassy png.webp",
    jpg: "/partners/embassy jpeg.webp",
  },
  godrej: {
    png: "/partners/godreg png.webp",
    jpg: "/partners/godrej  jpeg.webp",
  },
  lodha: {
    png: "/partners/lodha png.webp",
    jpg: "/partners/lodha jpeg.webp",
  },
  nambiar: {
    png: "/partners/nambiar png.webp",
    jpg: "/partners/nambiar jpeg.webp",
  },
  prestige: {
    png: "/partners/prestige  png.webp",
    jpg: "/partners/prestige  jpeg.webp",
  },
} as const;

// Direct paths for easy use
export const PARTNER_LOGO_PATHS = {
  BRIGADE: "/partners/brigade png.webp",
  EMBASSY: "/partners/embassy png.webp",
  GODREJ: "/partners/godreg png.webp",
  LODHA: "/partners/lodha png.webp",
  NAMBIAR: "/partners/nambiar png.webp",
  PRESTIGE: "/partners/prestige  png.webp",
} as const;

/**
 * Helper function to get partner logo path
 * Defaults to PNG if available, falls back to JPG
 */
export const getPartnerLogo = (
  partner: keyof typeof partnerLogos,
  format: "png" | "jpg" = "png"
): string => {
  return partnerLogos[partner]?.[format] || "";
};
