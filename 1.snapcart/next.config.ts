import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "plus.unsplash.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "via.placeholder.com" },
      { hostname: "placehold.co" },
      { hostname: "www.indianhealthyrecipes.com" },
      { hostname: "www.archanaskitchen.com" },
      { hostname: "rakskitchen.net" }
    ]
  }
};

export default nextConfig;

// Trigger rebuild timestamp: 2026-01-24 v2
