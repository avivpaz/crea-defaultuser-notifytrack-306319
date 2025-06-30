'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCaretDown, FaEnvelope, FaBell, FaBars, FaTimes } from 'react-icons/fa';

export default function GeneralHeader() {
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const services = [
    { name: 'Package Tracking', href: '/packages', description: 'Get alerts for your shipments' },
    { name: 'Stock Alerts', href: 'https://stocks.notifytracking.com', description: 'Monitor stock price changes', external: true }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target as Node)) {
        setIsServicesMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className="bg-primary text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center space-x-3 transition-opacity">
              <Image 
                src="/icon.png" 
                alt="Notify Tracking Icon" 
                width={28} 
                height={28} 
                className="w-7 h-7"
              />
              <span className="font-semibold text-lg">Notify Tracking</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              {/* Services dropdown menu */}
              <div className="relative mr-6" ref={servicesMenuRef}>
                <button
                  onClick={() => setIsServicesMenuOpen(!isServicesMenuOpen)}
                  className="text-sm text-white hover:bg-primary-dark rounded-lg px-4 py-2.5 transition-colors flex items-center"
                >
                  <FaBell className="mr-2 text-base" />
                  <span>Services</span>
                  <FaCaretDown className={`ml-2 transition-transform ${isServicesMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isServicesMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-10">
                    {services.map((service) => (
                      service.external ? (
                        <a 
                          key={service.name}
                          href={service.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsServicesMenuOpen(false)}
                        >
                          <div className="font-medium text-gray-900">{service.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{service.description}</div>
                        </a>
                      ) : (
                        <Link 
                          key={service.name}
                          href={service.href}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsServicesMenuOpen(false)}
                        >
                          <div className="font-medium text-gray-900">{service.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{service.description}</div>
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/pricing"
                className="text-sm text-white hover:bg-primary-dark rounded-lg px-4 py-2.5 transition-colors flex items-center mr-6"
              >
                <span>Pricing</span>
              </Link>

              <a 
                href="mailto:contact@notifytracking.com"
                className="text-sm text-white hover:bg-primary-dark rounded-lg px-4 py-2.5 transition-colors flex items-center"
              >
                <FaEnvelope className="mr-2 text-base" />
                <span>Contact Us</span>
              </a>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2.5 rounded-lg hover:bg-primary-dark transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
          
          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div 
              className="md:hidden pt-2 pb-3 space-y-1 border-t border-primary-light mt-3"
              ref={mobileMenuRef}
            >
              <div>
                <button
                  onClick={() => setIsServicesMenuOpen(!isServicesMenuOpen)}
                  className="w-full text-left flex justify-between items-center px-4 py-3 text-white hover:bg-primary-dark rounded-lg"
                >
                  <div className="flex items-center">
                    <FaBell className="mr-3 text-base" />
                    <span>Services</span>
                  </div>
                  <FaCaretDown className={`transition-transform ${isServicesMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isServicesMenuOpen && (
                  <div className="pl-8 mt-1 space-y-1">
                    {services.map((service) => (
                      service.external ? (
                        <a 
                          key={service.name}
                          href={service.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2.5 text-white hover:bg-primary-dark rounded-lg"
                          onClick={() => {
                            setIsServicesMenuOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <div className="font-medium">{service.name}</div>
                          <div className="text-xs text-gray-300 mt-1">{service.description}</div>
                        </a>
                      ) : (
                        <Link 
                          key={service.name}
                          href={service.href}
                          className="block px-4 py-2.5 text-white hover:bg-primary-dark rounded-lg"
                          onClick={() => {
                            setIsServicesMenuOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <div className="font-medium">{service.name}</div>
                          <div className="text-xs text-gray-300 mt-1">{service.description}</div>
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
              
              <Link
                href="/pricing"
                className="w-full text-left flex items-center px-4 py-3 text-white hover:bg-primary-dark rounded-lg"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                }}
              >
                <span>Pricing</span>
              </Link>
              
              <a 
                href="mailto:contact@notifytracking.com"
                className="flex items-center px-4 py-3 text-white hover:bg-primary-dark rounded-lg"
              >
                <FaEnvelope className="mr-3 text-base" />
                <span>Contact Us</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 