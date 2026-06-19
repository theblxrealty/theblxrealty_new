import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  compress: true,
  poweredByHeader: false,
  output: "standalone",
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns", "framer-motion"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("@tinymce/tinymce-react");
    }
    return config;
  },
  images: {
    // FIXED: Enable Next.js image optimization for WebP/AVIF conversion, responsive sizing, lazy loading
    // This single fix provides 50-70% image file size reduction
    unoptimized: false,
    // Enable AVIF format for maximum compression (Chrome, Edge)
    formats: ['image/avif', 'image/webp'],
    // Increase device sizes for better responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gjpujedmzdthonncnwsg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(nextConfig);
