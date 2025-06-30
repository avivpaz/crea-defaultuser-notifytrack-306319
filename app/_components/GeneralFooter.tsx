import Link from 'next/link';
import Image from 'next/image';
import { FaEnvelope, FaBell, FaTruck, FaChartLine, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const GeneralFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <Image src="/icon.png" alt="Notify Tracking" width={28} height={28} className="mr-3" />
              <h3 className="text-2xl font-bold text-primary">Notify Tracking</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Smart notifications when you need them. Get instant alerts for package deliveries and stock price changes. Never miss what matters most.
            </p>
            
            {/* Contact */}
            <div className="space-y-3">
              <a 
                href="mailto:contact@notifytracking.com" 
                className="flex items-center text-gray-600 hover:text-primary transition-colors"
              >
                <FaEnvelope className="w-4 h-4 mr-2" />
                <span className="text-sm">contact@notifytracking.com</span>
              </a>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-gray-800 flex items-center">
              <FaBell className="w-4 h-4 mr-2 text-primary" />
              Our Services
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/packages" 
                  className="group flex items-center text-gray-600 hover:text-primary transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors">
                    <FaTruck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Package Tracking</div>
                    <div className="text-xs text-gray-500">Real-time delivery updates</div>
                  </div>
                </Link>
              </li>
              <li>
                <a 
                  href="https://stocks.notifytracking.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center text-gray-600 hover:text-primary transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                    <FaChartLine className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Stock Alerts</div>
                    <div className="text-xs text-gray-500">Price monitoring & alerts</div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-gray-800">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/pricing" 
                  className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms-of-service" 
                  className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/refund-policy" 
                  className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                  Refund Policy
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:contact@notifytracking.com"
                  className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          
          {/* Features & Benefits */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-gray-800">Why Choose Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-gray-700 text-sm">Instant Notifications</div>
                  <div className="text-xs text-gray-500">Real-time SMS & email alerts</div>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-gray-700 text-sm">99.9% Uptime</div>
                  <div className="text-xs text-gray-500">Reliable & always available</div>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-gray-700 text-sm">Secure & Private</div>
                  <div className="text-xs text-gray-500">Your data is protected</div>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-gray-700 text-sm">Multi-Platform</div>
                  <div className="text-xs text-gray-500">Works everywhere</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="py-8 border-t border-gray-200 border-b border-gray-200 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50K+</div>
              <div className="text-sm text-gray-600">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1M+</div>
              <div className="text-sm text-gray-600">Notifications Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-gray-600">Delivery Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-gray-600">Monitoring</div>
            </div>
          </div>
        </div>
            
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
            <p className="text-gray-500 text-sm mb-2 md:mb-0 md:mr-6">
              Â© {currentYear} Notify Tracking. All rights reserved.
            </p>
            <p className="text-xs text-gray-400">
              Independent service â¢ Not affiliated with any carrier
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex space-x-4">
            <a 
              href="https://twitter.com/notifytracking" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all duration-200"
              aria-label="Follow us on Twitter"
            >
              <FaTwitter className="w-4 h-4" />
            </a>
            <a 
              href="https://linkedin.com/company/notifytracking" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all duration-200"
              aria-label="Follow us on LinkedIn"
            >
              <FaLinkedin className="w-4 h-4" />
            </a>
            <a 
              href="https://github.com/notifytracking" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all duration-200"
              aria-label="Follow us on GitHub"
            >
              <FaGithub className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        {/* Structured data for SEO */}
        <div className="hidden" aria-hidden="true" itemScope itemType="https://schema.org/Organization">
          <meta itemProp="name" content="Notify Tracking" />
          <meta itemProp="description" content="Smart notification services for package tracking and stock price alerts" />
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

export default GeneralFooter; 