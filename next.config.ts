import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/top-spots", destination: "/destinations", permanent: true },
      { source: "/plan", destination: "/planner", permanent: true },
      { source: "/trip-planner", destination: "/planner", permanent: true },
    ];
  },
};

export default nextConfig;
