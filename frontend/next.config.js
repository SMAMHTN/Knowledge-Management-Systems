/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverActionsBodySizeLimit: '5gb',
  },
  output: 'standalone',
};

module.exports = nextConfig;
