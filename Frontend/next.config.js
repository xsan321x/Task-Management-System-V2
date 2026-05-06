/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure the app works on Railway
  output: 'standalone',
  // Disable image optimization for Railway (optional, can remove if using Railway's image optimization)
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
