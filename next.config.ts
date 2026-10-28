import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  poweredByHeader: false,
  allowedDevOrigins: ["192.168.1.4"],

  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },

  // serverExternalPackages: ["better-sqlite3"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  async headers() {
    return [
=======
  images: {
    remotePatterns: [
>>>>>>> 07c8f05eba4df243b011603284b31eb0bcb262fc
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
