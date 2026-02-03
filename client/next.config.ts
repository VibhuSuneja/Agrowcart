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
  },

  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'  // Prevents clickjacking attacks
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'  // Prevents MIME type sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'  // Controls referrer info
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'  // Legacy XSS protection
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=(self), payment=(self)'  // Restricts browser APIs
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'  // Enables DNS prefetching for performance
          }
        ]
      }
    ]
  }
};

export default nextConfig;

// Trigger rebuild timestamp: 2026-01-24 v2
