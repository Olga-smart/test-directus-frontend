import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8055",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "directus-s35r.onrender.com",
        port: "1000",
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
