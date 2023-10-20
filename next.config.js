/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
const isDevEnv = process.env.NODE_ENV === 'development';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: isDevEnv,
  // register: true,
  // scope: '/app',
});

const nextConfig = withBundleAnalyzer(
  withPWA({
    experimental: {
      serverActions: true,
    },
    eslint: {
      ignoreDuringBuilds: false,
    },
    swcMinify: true,
    reactStrictMode: true,
    poweredByHeader: false,
  }),
);

module.exports = nextConfig;
