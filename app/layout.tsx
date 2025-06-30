import './globals.css';
import { Inter } from 'next/font/google';
import PayPalProvider from './_components/PayPalProvider';
import Footer from './components/Footer';
import { Metadata } from 'next';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Package Tracking & Notifications | USPS, FedEx, UPS Tracking | Notify Track',
  description: 'Get automatic notifications when your packages change status. Track USPS, FedEx, UPS and more with real-time updates via SMS or email.',
  keywords: [
    'package tracking', 
    'shipping notifications', 
    'delivery alerts', 
    'USPS tracking', 
    'FedEx tracking',
    'UPS tracking',
    'shipment tracking', 
    'package notifications'
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://uspsnotify.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="USPS Notify" />
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MR35PPDR');
          `}
        </Script>
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-secondary`} suppressHydrationWarning>
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-MR35PPDR"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <PayPalProvider>
          {children}
          <Footer />
        </PayPalProvider>
      </body>
    </html>
  );
} 