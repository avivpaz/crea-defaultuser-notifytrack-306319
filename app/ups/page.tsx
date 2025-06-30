import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../_components/Header';
import { FaArrowRight, FaTruck, FaPlane, FaGlobe, FaBox, FaClock } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'UPS Shipping & Tracking Services | Notify Track',
  description: 'Track all your UPS packages easily. Get notifications for UPS shipping services including Ground, Next Day Air, and international delivery.',
  keywords: ['UPS tracking', 'UPS shipping', 'package tracking', 'UPS notifications', 'UPS delivery updates'],
  openGraph: {
    title: 'UPS Shipping & Tracking Services | Notify Track',
    description: 'Track all your UPS packages easily. Get notifications for UPS shipping services including Ground, Next Day Air, and international delivery.',
    url: 'https://notifytrack.com/ups',
    type: 'website',
  }
};

export default function UPSPage() {
  // UPS services to display
  const services = [
    {
      name: 'UPS Ground',
      description: 'Cost-effective delivery for packages typically within 1-5 business days within the continental U.S.',
      icon: <FaTruck className="w-6 h-6 text-primary" />,
      features: ['Delivery typically within 1-5 business days', 'Cost-effective shipping option', 'Tracking included']
    },
    {
      name: 'UPS Next Day Air',
      description: 'Guaranteed overnight delivery by the next business day for time-sensitive shipments.',
      icon: <FaPlane className="w-6 h-6 text-primary" />,
      features: ['Guaranteed next-business-day delivery', 'Time-definite delivery options', 'Saturday delivery available']
    },
    {
      name: 'UPS 2nd Day Air',
      description: 'Guaranteed delivery in 2 business days for less urgent shipments.',
      icon: <FaClock className="w-6 h-6 text-primary" />,
      features: ['Guaranteed 2-business-day delivery', 'Cost-effective for less urgent shipments', 'Saturday delivery available']
    },
    {
      name: 'UPS 3 Day Select',
      description: 'Delivery within 3 business days to destinations within the continental U.S.',
      icon: <FaBox className="w-6 h-6 text-primary" />,
      features: ['Delivery in 3 business days', 'Available to all 50 states', 'Guaranteed day-definite delivery']
    },
    {
      name: 'UPS Worldwide',
      description: 'International shipping solutions for global delivery with customs clearance support.',
      icon: <FaGlobe className="w-6 h-6 text-primary" />,
      features: ['Export and import services', 'Customs clearance included', 'Delivery to 220+ countries']
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
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">UPS Package Tracking</h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  Track your UPS shipments in real-time and get instant notifications about delivery status changes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/?carrier=ups" 
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
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">UPS Shipping Services</h2>
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
                
                {/* Feature list instead of invalid links */}
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
                
                {/* Track button instead of "Learn more" */}
                <Link 
                  href="/?carrier=ups" 
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
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Track Your UPS Package</h2>
              <p className="mb-8 max-w-2xl mx-auto">
                Enter your tracking number to get real-time updates and notifications about your UPS shipment.
              </p>
              <Link 
                href="/?carrier=ups" 
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