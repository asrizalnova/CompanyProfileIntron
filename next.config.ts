import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Izinkan hostname Vercel Blob agar pratinjau gambar galeri muncul sempurna
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
