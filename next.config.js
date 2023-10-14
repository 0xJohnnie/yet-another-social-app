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
  sw: 'yasa-nextpwa-service-worker.js',
});

const nextConfig = withBundleAnalyzer(
  withPWA({
    eslint: {
      ignoreDuringBuilds: false,
    },
    swcMinify: true,
    reactStrictMode: true,
    poweredByHeader: false,
  }),
);

module.exports = nextConfig;
