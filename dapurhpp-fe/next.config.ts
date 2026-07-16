import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const BASE_URL = API_URL.replace(/\/api\/?$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${BASE_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
