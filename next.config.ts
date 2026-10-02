import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimized for Native Vercel Deployment (Removed output: 'export' to support dynamic API routes)
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
