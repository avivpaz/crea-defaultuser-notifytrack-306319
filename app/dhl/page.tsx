import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../_components/Header';
import { FaArrowRight, FaPlane, FaTruck, FaClock, FaGlobe, FaBox } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'DHL Shipping & Tracking Services | Notify Track',
  description: 'Track all your DHL packages easily. Get notifications for DHL Express, DHL eCommerce, and other international shipping services.',
  keywords: ['DHL tracking', 'DHL Express', 'DHL eCommerce', 'package tracking', 'DHL notifications', 'international shipping'],
  openGraph: {
    title: 'DHL Shipping & Tracking Services | Notify Track',
    description: 'Track all your DHL packages easily. Get notifications for DHL Express, DHL eCommerce, and other international shipping services.',
    url: 'https://notifytrack.com/dhl',
    type: 'website',
  }
};

export default function DHLPage() {
  // DHL services to display
  const services = [
    {
      name: 'DHL Express',
      description: 'Premium international shipping service with time-definite delivery for urgent documents and parcels.',
      icon: <FaPlane className="w-6 h-6 text-primary" />,
      features: ['Express delivery to 220+ countries', 'Time-definite options', 'Door-to-door service', 'Customs clearance included']
    },
    {
      name: 'DHL eCommerce',
      description: 'Optimized shipping solutions for online sellers and e-commerce businesses with flexible delivery options.',
      icon: <FaBox className="w-6 h-6 text-primary" />,
      features: ['Delivery confirmation', 'Cross-border e-commerce delivery', 'Returns management', 'End-to-end tracking']
    },
    {
      name: 'DHL Parcel International Direct',
      description: 'Cost-effective international shipping service for non-urgent parcels with reliable tracking.',
      icon: <FaGlobe className="w-6 h-6 text-primary" />,
      features: ['International parcel delivery', 'Full tracking capabilities', 'Cost-effective rates', 'Delivery to over 200 countries']
    },
    {
      name: 'DHL Parcel International Standard',
      description: 'Economical shipping solution for sending packages internationally with longer transit times.',
      icon: <FaTruck className="w-6 h-6 text-primary" />,
      features: ['Economical international shipping', 'Reliable service', 'End-to-end tracking', 'Support for heavier parcels']
    },
    {
      name: 'DHL Same Day',
      description: 'Ultra-fast shipping for time-critical deliveries needed on the same day.',
      icon: <FaClock className="w-6 h-6 text-primary" />,
      features: ['Same-day delivery', 'Time-critical shipping', 'Door-to-door service', 'Dedicated vehicles when needed']
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
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">DHL Package Tracking</h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  Track your DHL Express and DHL eCommerce shipments in real-time and get instant notifications about delivery status changes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/?carrier=dhl_express" 
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
            
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">DHL Shipping Services</h2>
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
                  href={`/?carrier=${service.name === 'DHL Express' ? 'dhl_express' : 'dhl_ecommerce'}`}
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
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Track Your DHL Package</h2>
              <p className="mb-8 max-w-2xl mx-auto">
                Enter your tracking number to get real-time updates and notifications about your DHL shipment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/?carrier=dhl_express" 
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-primary bg-white hover:bg-gray-100 transition duration-150 ease-in-out shadow-sm"
                >
                  Track DHL Express
                </Link>
                <Link 
                  href="/?carrier=dhl_ecommerce" 
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-primary-dark hover:bg-primary-dark/90 transition duration-150 ease-in-out shadow-sm border-white"
                >
                  Track DHL eCommerce
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 