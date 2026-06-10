import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: false,
  },
  async rewrites() {
    return [
      // Common Stripe webhook URL typos — forward to the real handler
      { source: '/api/stripe/webhook', destination: '/api/webhooks/stripe' },
      { source: '/api/webhook/stripe', destination: '/api/webhooks/stripe' },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [600, 640, 750, 800, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 200, 256, 384, 500],
  },
};

export default nextConfig;
