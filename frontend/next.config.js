/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverActionsBodySizeLimit: '5gb',
  },
  output: 'standalone',
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'upload.wikimedia.org',
    }],
  },
};

module.exports = nextConfig;
