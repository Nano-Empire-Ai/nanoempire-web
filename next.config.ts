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
  async rewrites() {
    return [
      {
        source: "/recall-roulette",
        destination: "/recall-roulette.html",
      },
      {
        source: "/verified-directory",
        destination: "/manifests.html",
      },
      {
        source: "/verified-directory.html",
        destination: "/manifests.html",
      },
    ];
  },
};

export default nextConfig;
