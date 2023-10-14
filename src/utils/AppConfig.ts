export const AppConfig = {
  site_name: 'YASA',
  title:
    'YASA - A cross-chain event management and social dApp that supports Account Abstraction',
  title_template: '%s - by 0xJohnnie',
  site:
    process.env.NODE_ENV === 'production'
      ? process.env.NEXTAUTH_URL
      : 'http://localhost:3000',

  description:
    'YASA - A cross-chain event management and social dApp that supports Account Abstraction',
  author: { name: '0xJohnnie', site: 'https://linktr.ee/0xJohnnie' },
  locale: 'en',
  version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? 'PROD',
};
