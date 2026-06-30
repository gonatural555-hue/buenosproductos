import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // turbopack.root solo aplica con `npm run dev:turbo`. En Windows/OneDrive usar `npm run dev` (webpack).
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingIncludes: {
    "/*": ["./scripts/good-ideas-products/**/*.json"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:locale/good-ideas",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale/good-ideas/:path*",
        destination: "/:locale/:path*",
        permanent: true,
      },
      {
        source: "/:locale/go-natural",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale/go-natural/:path*",
        destination: "/:locale/:path*",
        permanent: true,
      },
      {
        source: "/:locale/category/:path*",
        destination: "/:locale/products",
        permanent: true,
      },
      {
        source: "/:locale/categories",
        destination: "/:locale/products",
        permanent: true,
      },
      {
        source: "/:locale/brands/:path*",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale/landing",
        destination: "/:locale",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
