import type { NextConfig } from "next";
import dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // dev proxy limit is 30s by default; LLM queries can take minutes
    proxyTimeout: 300_000,
  },
  env: {
    IP: process.env.IP,
  },
  allowedDevOrigins: [`${process.env.IP}`],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: `http://${process.env.IP}:8000/:path*`,
      },
    ];
  },
};

export default nextConfig;
