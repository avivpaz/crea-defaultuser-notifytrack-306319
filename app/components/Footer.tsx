import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 pb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <Image src="/icon.png" alt="Notify Tracking" width={24} height={24} className="mr-2" />
              <h3 className="text-2xl font-bold text-primary">NotifyTracking</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              The most reliable package tracking and notification service for all major carriers. Get instant updates on your deliveries via SMS or email.
            </p>
            
            {/* Social Media */}
            {/* <div className="flex space-x-5 mt-6">
              <a href="https://twitter.com/notifytracking" aria-label="Twitter" 
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="https://facebook.com/notifytracking" aria-label="Facebook" 
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="https://instagram.com/notifytracking" aria-label="Instagram" 
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div> */}
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-gray-800">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services section */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-gray-800">Shipping Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* USPS Services */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">USPS</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/usps-tracking" className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                      Tracking
                    </Link>
                  </li>
                  <li>
                    <Link href="/usps-priority" className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                      Priority Mail
                    </Link>
                  </li>
                  <li>
                    <Link href="/usps-express" className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                      Express Mail
                    </Link>
                  </li>
                  <li>
                    <Link href="/usps-first-class" className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                      First Class
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Other Carriers */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">More Services</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/fedex" className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                      FedEx
                    </Link>
                  </li>
                  <li>
                    <Link href="/ups" className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                      UPS
                    </Link>
                  </li>
                  <li>
                    <Link href="/dhl" className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                      DHL
                    </Link>
                  </li>
                  <li>
                    <Link href="/usps-international" className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                      International
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
            
        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            Â© {currentYear} NotifyTracking. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Not affiliated with USPS, FedEx, UPS, DHL or any carrier.
          </p>
        </div>
        
        {/* Structured data for SEO */}
        <div className="hidden" aria-hidden="true" itemScope itemType="https://schema.org/Organization">
          <meta itemProp="name" content="NotifyTracking" />
          <meta itemProp="description" content="A comprehensive package tracking and notification system for all major shipping carriers" />
          <meta itemProp="url" content="https://notifytracking.com" />
          <meta itemProp="logo" content="https://notifytracking.com/icon.png" />
          <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <meta itemProp="addressLocality" content="San Francisco" />
            <meta itemProp="addressRegion" content="CA" />
            <meta itemProp="postalCode" content="94105" />
            <meta itemProp="addressCountry" content="US" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 