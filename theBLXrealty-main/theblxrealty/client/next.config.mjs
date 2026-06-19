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
    // Disable optimization since images are already in optimized WebP format
    // This prevents 402 errors on Vercel from image optimization API
    unoptimized: true,
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
