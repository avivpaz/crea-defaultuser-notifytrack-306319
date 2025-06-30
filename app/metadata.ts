import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Notify Tracking - USPS Package Tracking & Notifications Made Simple',
  description: 'Get real-time notifications for your USPS shipments. Track packages, receive updates via email or SMS, and never miss a delivery with Notify Tracking.',
  applicationName: 'Notify Tracking',
  authors: [{ name: 'Notify Tracking Team' }],
  keywords: [
    'USPS tracking',
    'package notifications',
    'shipping updates',
    'real-time tracking',
    'delivery notifications',
    'USPS package alerts',
    'mail tracking',
    'package delivery status',
    'shipping notifications',
    'USPS delivery updates'
  ],
  robots: {
    index: true,
    follow: true
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.ico' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/icon.ico',
    apple: { url: '/icon.png', sizes: '180x180', type: 'image/png' }
  },
  openGraph: {
    type: 'website',
    title: 'Notify Tracking - USPS Package Tracking & Notifications Made Simple',
    description: 'Get real-time notifications for your USPS shipments. Track packages, receive updates via email or SMS, and never miss a delivery with Notify Tracking.',
    siteName: 'Notify Tracking',
    url: 'https://notifytrack.com',
    images: [
      {
        url: 'https://notifytrack.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Notify Tracking - USPS Package Tracking & Notifications'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notify Tracking - USPS Package Tracking & Notifications Made Simple',
    description: 'Get real-time notifications for your USPS shipments. Track packages, receive updates via email or SMS, and never miss a delivery.',
    images: ['https://notifytrack.com/twitter-image.png']
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    other: {
      'msvalidate.01': 'bing-verification-code'
    }
  },
  alternates: {
    canonical: 'https://notifytrack.com',
    languages: {
      'en-US': 'https://notifytrack.com',
      'es-ES': 'https://notifytrack.com/es'
    }
  }
}; 

// Separate viewport configuration to fix Next.js warnings
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}; 