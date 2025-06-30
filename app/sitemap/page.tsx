import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sitemap | NotifyTracking',
  description: 'Complete sitemap of NotifyTracking package tracking notification service.',
};

const SitemapPage = () => {
  // Define all site pages organized by category
  const pages = {
    'Main Pages': [
      { title: 'Home', path: '/' },
      { title: 'About Us', path: '/about' },
      { title: 'Contact', path: '/contact' },
    ],
    'Tracking Services': [
      { title: 'USPS Tracking', path: '/usps-tracking' },
      { title: 'USPS International', path: '/usps-international' },
      { title: 'USPS Priority Mail', path: '/usps-priority' },
      { title: 'USPS Express Mail', path: '/usps-express' },
      { title: 'USPS First Class', path: '/usps-first-class' },
      { title: 'USPS Media Mail', path: '/usps-media-mail' },
      { title: 'USPS Retail Ground', path: '/usps-retail-ground' },
      { title: 'USPS Certified Mail', path: '/usps-certified-mail' },
    ],
    'Legal Pages': [
      { title: 'Terms of Service', path: '/terms-of-service' },
      { title: 'Privacy Policy', path: '/privacy-policy' },
      { title: 'Cookies', path: '/cookies' },
    ],
    'User Pages': [
      { title: 'Track Package', path: '/track' },
      { title: 'Thank You', path: '/thank-you' },
    ],
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Sitemap</h1>
          <p className="text-gray-700 mb-8">
            Find all pages on the NotifyTracking website organized by category.
          </p>
          
          <div className="space-y-10">
            {Object.entries(pages).map(([category, links]) => (
              <div key={category} className="border-b border-gray-200 pb-6 last:border-0">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{category}</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {links.map((link) => (
                    <li key={link.path}>
                      <Link 
                        href={link.path}
                        className="text-primary hover:underline flex items-center"
                      >
                        <svg 
                          className="w-4 h-4 mr-2 text-gray-400" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Looking for our XML Sitemap?</h2>
            <p className="text-gray-700 mb-4">
              If you're looking for our XML sitemap for search engines, you can find it at:
            </p>
            <div className="bg-white p-3 rounded border border-gray-200 font-mono text-sm text-gray-600">
              https://notifytracking.com/sitemap.xml
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage; 