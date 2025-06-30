'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaInfoCircle, FaCheckCircle, FaQuestionCircle } from 'react-icons/fa';

interface CarrierServicePageProps {
  title: string;
  description: string;
  serviceType: string;
  features: string[];
  faqs: { question: string; answer: string }[];
  estimatedDelivery: string;
  trackingAvailable: boolean;
  price: string;
  imageUrl?: string;
  carrier: string;
  relatedServices?: Array<{
    name: string;
    path: string;
  }>;
}

const CarrierServicePage: React.FC<CarrierServicePageProps> = ({
  title,
  description,
  serviceType,
  features,
  faqs,
  estimatedDelivery,
  trackingAvailable,
  price,
  imageUrl = '/usps-logo.png',
  carrier = 'USPS',
  relatedServices = []
}) => {
  const services = relatedServices.length > 0 ? relatedServices : [
    {
      name: `${carrier} Priority Mail`,
      path: `/${carrier.toLowerCase()}-priority`
    },
    {
      name: `${carrier} Express Mail`,
      path: `/${carrier.toLowerCase()}-express`
    },
    {
      name: `${carrier} First Class`,
      path: `/${carrier.toLowerCase()}-first-class`
    },
    {
      name: `${carrier} International`,
      path: `/${carrier.toLowerCase()}-international`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-16 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{title}</h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">{description}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href={`/?carrier=${carrier.toLowerCase()}`}
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 transition duration-150 ease-in-out shadow-sm"
                >
                  Track a Package
                </Link>
                <Link 
                  href="#faqs" 
                  className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out shadow-sm"
                >
                  Learn More
                  <FaArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md h-64 md:h-80">
                <Image 
                  src={imageUrl} 
                  alt={title}
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Info */}
          <div className="lg:col-span-2 space-y-12">
            {/* Service Overview */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About {carrier} {serviceType}</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center p-4 bg-secondary rounded-lg">
                    <FaInfoCircle className="text-primary h-8 w-8 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Estimated Delivery</h3>
                    <p className="text-gray-600 text-center">{estimatedDelivery}</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-secondary rounded-lg">
                    <FaCheckCircle className="text-primary h-8 w-8 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Tracking Available</h3>
                    <p className="text-gray-600 text-center">{trackingAvailable ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-secondary rounded-lg">
                    <div className="text-primary font-bold text-2xl mb-3">$</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Price</h3>
                    <p className="text-gray-600 text-center">{price}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Features & Benefits</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <ul className="space-y-4">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <FaCheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* FAQs */}
            <section id="faqs">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-start">
                      <FaQuestionCircle className="text-primary h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                      <span>{faq.question}</span>
                    </h3>
                    <p className="text-gray-600 ml-7">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* CTA Card */}
            <div className="bg-primary rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Track Your Package Now</h3>
              <p className="mb-6 text-white/90">Enter your tracking number to get real-time updates on your USPS shipment.</p>
              <Link 
                href={`/?carrier=${carrier.toLowerCase()}`} 
                className="block w-full py-3 px-4 bg-white text-primary text-center font-medium rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out"
              >
                Go to Tracking
              </Link>
            </div>

            {/* Related Services */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Related {carrier} Services</h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <Link href={service.path} className="text-primary hover:underline flex items-center">
                      <FaArrowRight className="h-3 w-3 mr-2" />
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Notification Signup */}
            <div className="bg-secondary rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Get Notifications</h3>
              <p className="text-gray-600 mb-4">Sign up to receive automatic updates when your package status changes.</p>
              <Link 
                href="/" 
                className="block w-full py-3 px-4 bg-primary text-white text-center font-medium rounded-lg hover:bg-primary/90 transition duration-150 ease-in-out"
              >
                Set Up Notifications
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrierServicePage; 