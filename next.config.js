/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
const isDevEnv = process.env.NODE_ENV === 'development';

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: isDevEnv,
  // register: true,
  // scope: '/app',
});

const nextConfig = withPWA({
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
});

module.exports = nextConfig;
