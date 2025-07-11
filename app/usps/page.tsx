import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../_components/Header';
import { FaArrowRight, FaTruck, FaClock, FaGlobe, FaBox, FaEnvelope } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'USPS Shipping & Tracking Services | Notify Track',
  description: 'Track all your USPS packages easily. Get notifications for USPS shipping services including Priority Mail, First Class, and more.',
  keywords: ['USPS tracking', 'USPS shipping', 'mail tracking', 'package tracking', 'USPS notifications'],
  openGraph: {
    title: 'USPS Shipping & Tracking Services | Notify Track',
    description: 'Track all your USPS packages easily. Get notifications for USPS shipping services including Priority Mail, First Class, and more.',
    url: 'https://notifytrack.com/usps',
    type: 'website',
  }
};

export default function USPSPage() {
  // USPS services to display
  const services = [
    {
      name: 'Priority Mail',
      description: 'Fast delivery in 1-3 business days with tracking and insurance included.',
      icon: <FaTruck className="w-6 h-6 text-primary" />,
      features: ['Delivery in 1-3 business days', 'Tracking included', 'Up to $50 insurance included', 'Free pickup available']
    },
    {
      name: 'Express Mail',
      description: 'Overnight to 2-day delivery with a money-back guarantee and tracking.',
      icon: <FaClock className="w-6 h-6 text-primary" />,
      features: ['Overnight delivery to most locations', 'Money-back guarantee', 'Tracking included', '$100 insurance included']
    },
    {
      name: 'First Class Mail',
      description: 'Affordable service for letters, cards, and small packages under 13 ounces.',
      icon: <FaEnvelope className="w-6 h-6 text-primary" />,
      features: ['Delivery in 1-3 business days', 'For packages under 13oz', 'Tracking available', 'Most economical option']
    },
    {
      name: 'International Shipping',
      description: 'Global shipping services to over 190 countries and territories.',
      icon: <FaGlobe className="w-6 h-6 text-primary" />,
      features: ['Global delivery options', 'Insurance available', 'Tracking for most services', 'Customs forms assistance']
    },
    {
      name: 'Retail Ground',
      description: 'Economical shipping for packages with tracking included.',
      icon: <FaBox className="w-6 h-6 text-primary" />,
      features: ['Delivery in 2-8 business days', 'For packages up to 70lbs', 'Tracking included', 'Economical option for larger packages']
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white py-16 border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">USPS Package Tracking</h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  Track your USPS packages in real-time and get notifications about delivery status changes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/?carrier=usps" 
                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 transition duration-150 ease-in-out shadow-sm"
                  >
                    Track a Package
                  </Link>
                  <Link 
                    href="#services" 
                    className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out shadow-sm"
                  >
                    View Services
                    <FaArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md h-64 md:h-80">
                  <div className="flex items-center justify-center h-full w-full text-3xl font-bold text-gray-700">
                    USPS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">USPS Shipping Services</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  {service.icon}
                  <h3 className="ml-3 text-xl font-semibold text-gray-900">
                    {service.name}
                  </h3>
                </div>
                <p className="text-gray-600 mb-5">{service.description}</p>
                
                {/* Feature list */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-primary mr-2">â¢</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Track button */}
                <Link 
                  href="/?carrier=usps" 
                  className="inline-flex items-center mt-4 text-primary hover:text-primary/80 font-medium"
                >
                  Track a shipment
                  <FaArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-primary rounded-xl shadow-md p-8 text-white">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Track Your USPS Package</h2>
              <p className="mb-8 max-w-2xl mx-auto">
                Enter your tracking number to get real-time updates and notifications about your USPS shipment.
              </p>
              <Link 
                href="/?carrier=usps" 
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-primary bg-white hover:bg-gray-100 transition duration-150 ease-in-out shadow-sm"
              >
                Track Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 