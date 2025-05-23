import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint:{
    ignoreDuringBuilds: true,
  },
  // Optimize for Vercel deployment
  experimental: {
    optimizePackageImports: ['@mui/icons-material', 'lucide-react'],
  },
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable static optimization
  output: 'standalone',
  // Compress responses
  compress: true,
  // Bundle analyzer in development
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: any) => {
      config.plugins.push(
        new (require('@next/bundle-analyzer')({ enabled: true }))()
      );
      return config;
    },
  }),
};

export default nextConfig;
