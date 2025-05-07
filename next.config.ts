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
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
