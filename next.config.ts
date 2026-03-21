import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  serverExternalPackages: ['prisma', '@prisma/client'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
    ],
  },
};

export default nextConfig;
