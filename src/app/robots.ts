import { MetadataRoute } from 'next';

import { AppConfig } from '@/utils/AppConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/404', '/500', '/private/*', '/api/*'],
    },
    host: `${AppConfig.site}`,
  };
}
