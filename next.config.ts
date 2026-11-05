import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['images.unsplash.com'],
  },
  serverExternalPackages: [
    '@libsql/client',
    '@prisma/adapter-libsql',
    '@prisma/client',
  ],
};

export default nextConfig;
