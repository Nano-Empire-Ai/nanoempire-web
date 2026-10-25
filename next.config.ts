import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimized for Native Vercel Deployment (supports dynamic API routes & Turbopack)
  images: {
    unoptimized: true,
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
