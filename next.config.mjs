/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.shopify.com"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache images for 1 year in production
    minimumCacheTTL: 60 * 60 * 24 * 365,
    // Modern formats for better compression
    formats: ["image/webp", "image/avif"],
    // Optimize on-demand
    unoptimized: false,
  },
  productionBrowserSourceMaps: false,
  compress: true,
  swcMinify: true,
};

export default nextConfig;
