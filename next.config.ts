import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    config.module.exprContextCritical = false;
    return config;
  },
};

export default nextConfig;
