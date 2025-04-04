import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["scontent.cdninstagram.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
        port: "",
        pathname: "/v/**",
      },
    ],
    unoptimized: true, // Use this as a last resort
  },
  serverExternalPackages: ["sharp", "onnxruntime-node"],
};

export default nextConfig;
