import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./scripts/good-ideas-products/**/*.json", "./scripts/products/**/*.json"],
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
        source: "/:locale/category/ski",
        destination: "/:locale/category/ski-snowboard",
        permanent: true,
      },
      {
        source: "/:locale/category/snowboard",
        destination: "/:locale/category/ski-snowboard",
        permanent: true,
      },
      {
        source: "/:locale/category/cycling",
        destination: "/:locale/category/cycling-running",
        permanent: true,
      },
      {
        source: "/:locale/category/sleeping-systems",
        destination: "/:locale/category/camping-survival-gear",
        permanent: true,
      },
      {
        source: "/:locale/products/gn-ski-snow-001",
        destination: "/:locale/products/gn-ski-snow-001-sk7a1",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
