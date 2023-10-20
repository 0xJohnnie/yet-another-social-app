import { MetadataRoute } from 'next';

import AppConfig from '@/utils/AppConfig';

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/404', '/500', '/private/*', '/api/*'],
    },
    host: `${AppConfig.site}`,
  };
};

export default robots;
