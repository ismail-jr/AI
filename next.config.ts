import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Helps catch potential issues
  output: "standalone", // Optimized for deployment
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false }; // Fix Firebase issues
    return config;
  },
};

export default nextConfig;
