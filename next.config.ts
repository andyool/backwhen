import type { NextConfig } from "next";

// STATIC_EXPORT=1 produces a plain static site in ./out for GitHub Pages
// (scripts/build-static.mjs). API routes and the Stripe success page are
// left out of that build; checkout needs a Node host such as Vercel.
const isStatic = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A second dev server (another port) can build into its own folder so it
  // doesn't trample .next while the first one is running.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  ...(isStatic
    ? {
        output: "export",
        trailingSlash: true,
        images: { unoptimized: true },
        basePath: basePath || undefined,
        assetPrefix: basePath || undefined,
      }
    : {}),
};

export default nextConfig;
