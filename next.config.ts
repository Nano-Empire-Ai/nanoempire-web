import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimized for Native Vercel Deployment
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;