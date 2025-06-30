'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PhoneInputModal from './PhoneInputModal';
import ManagePlanModal from './ManagePlanModal';
import { TierDetails } from '../_types/tiers';
import { Subscription } from '../lib/db';
import { FaCaretDown, FaEnvelope, FaUserCircle, FaTruck, FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [currentSubscriptionForManage, setCurrentSubscriptionForManage] = useState<Subscription | null>(null);
  const [currentUserIdForManage, setCurrentUserIdForManage] = useState<number | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isCarrierMenuOpen, setIsCarrierMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const carrierMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const carriers = [
    { name: 'USPS', href: '/usps-international' },
    { name: 'FedEx', href: '/fedex' },
    { name: 'UPS', href: '/ups' },
    { name: 'DHL', href: '/dhl' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (carrierMenuRef.current && !carrierMenuRef.current.contains(event.target as Node)) {
        setIsCarrierMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePhoneSuccess = async (tierDetails: TierDetails | null, userId: number | null) => {
    console.log('Phone input success, received basic tier:', tierDetails?.name || 'None', 'userId:', userId);
    setIsPhoneModalOpen(false); // Close phone modal immediately
    setFetchError(null); // Clear previous errors
    setCurrentUserIdForManage(userId); // Store userId

    if (tierDetails && userId) {
      // User has an active plan, fetch the full subscription details
      setIsLoadingSubscription(true); // Show loading state (if you implement one)
      try {
        console.log(`Fetching full subscription details for user ${userId}...`);
        const response = await fetch(`/api/user/subscription?userId=${userId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                 console.warn(`No active subscription found on backend for userId ${userId}, although phone modal reported one.`);
                 setCurrentSubscriptionForManage(null); // Ensure state is null
            } else {
                const errorData = await response.json().catch(() => ({})); // Catch potential JSON parse error
                throw new Error(errorData.error || `Failed to fetch subscription: ${response.statusText}`);
            }
        } else {
            const fullSubscription: Subscription = await response.json();
            console.log('Fetched full subscription:', fullSubscription);
            setCurrentSubscriptionForManage(fullSubscription); // Store fetched data
        }

      } catch (err: any) {
        console.error('Error fetching full subscription:', err);
        setFetchError(err.message || 'Could not load subscription details.');
        setCurrentSubscriptionForManage(null); // Clear potentially stale data
      } finally {
        setIsLoadingSubscription(false);
      }
    } else {
      // No active plan reported by phone modal
      console.log('No active tier reported, setting subscription state to null.');
      setCurrentSubscriptionForManage(null);
    }

    // Always open the manage modal after attempt (it can handle null subscription)
    setIsManageModalOpen(true); 
  };

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
              {/* Carrier dropdown menu */}
              <div className="relative mr-6" ref={carrierMenuRef}>
                <button
                  onClick={() => setIsCarrierMenuOpen(!isCarrierMenuOpen)}
                  className="text-sm text-white hover:bg-primary-dark rounded-lg px-4 py-2.5 transition-colors flex items-center"
                >
                  <FaTruck className="mr-2 text-base" />
                  <span>Carriers</span>
                  <FaCaretDown className={`ml-2 transition-transform ${isCarrierMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCarrierMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {carriers.map((carrier) => (
                      <Link 
                        key={carrier.name}
                        href={carrier.href}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsCarrierMenuOpen(false)}
                      >
                        {carrier.name}
                      </Link>
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

              <button
                onClick={() => setIsPhoneModalOpen(true)}
                className="text-sm text-white hover:bg-primary-dark rounded-lg px-4 py-2.5 transition-colors flex items-center mr-6"
              >
                <FaUserCircle className="mr-2 text-base" />
                <span>Manage Plan</span>
              </button>

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
                  onClick={() => setIsCarrierMenuOpen(!isCarrierMenuOpen)}
                  className="w-full text-left flex justify-between items-center px-4 py-3 text-white hover:bg-primary-dark rounded-lg"
                >
                  <div className="flex items-center">
                    <FaTruck className="mr-3 text-base" />
                    <span>Carriers</span>
                  </div>
                  <FaCaretDown className={`transition-transform ${isCarrierMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCarrierMenuOpen && (
                  <div className="pl-8 mt-1 space-y-1">
                    {carriers.map((carrier) => (
                      <Link 
                        key={carrier.name}
                        href={carrier.href}
                        className="block px-4 py-2.5 text-white hover:bg-primary-dark rounded-lg"
                        onClick={() => {
                          setIsCarrierMenuOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {carrier.name}
                      </Link>
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
              
              <button
                onClick={() => {
                  setIsPhoneModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left flex items-center px-4 py-3 text-white hover:bg-primary-dark rounded-lg"
              >
                <FaUserCircle className="mr-3 text-base" />
                <span>Manage Plan</span>
              </button>
              
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

      <PhoneInputModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onSuccess={handlePhoneSuccess}
        trackingNumber=""
      />

      {isManageModalOpen && (
         <ManagePlanModal
           isOpen={isManageModalOpen}
           onClose={() => setIsManageModalOpen(false)}
           initialSubscription={currentSubscriptionForManage}
           userId={currentUserIdForManage}
           trackingNumber=""
           notificationType="email"
           contactInfo=""
         />
      )}
    </>
  );
} 