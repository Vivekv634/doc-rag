import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  allowedDevOrigins: [`${process.env.NEXT_PUBLIC_IP}`],
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
        destination: `http://${process.env.NEXT_PUBLIC_IP}:8000/:path*`,
      },
    ];
  },
};

export default nextConfig;
