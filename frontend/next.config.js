/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverActionsBodySizeLimit: '5gb',
    logging: {
      level: 'verbose',
      fullUrl: true,
    },
  },
  output: 'standalone',
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'upload.wikimedia.org',
    }],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;