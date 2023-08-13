/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  api: {
    bodyParser: {
      sizeLimit: "5mb", // Set desired value here
    },
  },
};

module.exports = nextConfig;
