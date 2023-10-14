import { Metadata } from 'next';
import dynamic from 'next/dynamic';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Analytics } from '@vercel/analytics/react';
import React from 'react';

import { AppConfig } from '@/utils/AppConfig';
import { resolver, theme } from '@/utils/theme';

export const metadata: Metadata = {
  metadataBase: new URL(AppConfig.site),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  title: AppConfig.title,
  description: AppConfig.description,
  other: {
    version: AppConfig.version,
  },
  manifest: '/manifest.json',
  themeColor: '#FFFFFF',

  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: AppConfig.title,
  },

  formatDetection: {
    telephone: false,
  },

  twitter: {
    card: 'summary_large_image',
    creator: AppConfig.author.name,

    title: {
      default: AppConfig.title,
      template: AppConfig.title_template,
    },

    description: AppConfig.description,
  },

  applicationName: AppConfig.site_name,

  viewport:
    'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',

  icons: [
    { rel: 'apple-touch-icon', url: '/icons/apple-touch-icon.png' },
    { rel: 'shortcut icon', url: '/favicon.ico' },
  ],
  keywords: [
    '0xJohnnie',
    'YASA',
    'cross-chain event management',
    'Web3 social app',
    'Account Abstraction',
  ],
};

const MainAppShell = dynamic(() => import('./MainAppShell'));

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider
          theme={theme}
          cssVariablesResolver={resolver}
          defaultColorScheme="dark"
        >
          <MainAppShell>
            {children}
            <Analytics debug={false} />
          </MainAppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
