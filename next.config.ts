import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Jika ingin mengizinkan gambar dari Vercel Blob, cukup tambahkan ini:
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
