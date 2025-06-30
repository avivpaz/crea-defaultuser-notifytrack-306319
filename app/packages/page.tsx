'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import TrackingModal from '../_components/TrackingModal';
import TrackingForm from '../_components/TrackingForm';
import Header from '../_components/Header';

// Component with search params
function HomeWithSearch({ 
  onTrackingSubmit
}: { 
  onTrackingSubmit: (number: string, carrier: string) => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [processedTrackingNumbers, setProcessedTrackingNumbers] = useState<Set<string>>(new Set());
  const searchParams = useSearchParams();
  
  // Handle URL parameter check
  useEffect(() => {
    setIsMounted(true);
    
    // Check for tracking parameter in URL
    const urlTrackingNumber = searchParams.get('tracking');
    const urlCarrier = searchParams.get('carrier') || 'usps';
    
    if (urlTrackingNumber && !processedTrackingNumbers.has(urlTrackingNumber)) {
      // Add to processed set to avoid reopening
      setProcessedTrackingNumbers(prev => new Set(prev).add(urlTrackingNumber));
      onTrackingSubmit(urlTrackingNumber, urlCarrier);
    }
  }, [searchParams, onTrackingSubmit, processedTrackingNumbers]);

  return null; // No direct rendering, just URL parameter handling
}

function HomeContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('usps');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial carrier from URL if present
  useEffect(() => {
    const urlCarrier = searchParams.get('carrier');
    if (urlCarrier) {
      setCarrier(urlCarrier);
    }
  }, [searchParams]);

  const handleTrackingSubmit = (number: string, selectedCarrier: string) => {
    console.log('Home: Tracking submission with carrier:', selectedCarrier);
    setTrackingNumber(number);
    setCarrier(selectedCarrier);
    setIsModalOpen(true);
    
    // Preserve all existing query params (such as phone/email)
    const params = new URLSearchParams(window.location.search);
    params.set('tracking', number);
    params.set('carrier', selectedCarrier);
    // Use replace to avoid creating new history entries each time
    router.replace(`?${params.toString()}`);
  };
  
  const handleCloseModal = () => {
    console.log('Parent close modal handler called');
    
    // First, update the URL without the tracking parameter
    router.push('/packages', { scroll: false });
    
    // Then close the modal
    setIsModalOpen(false);
    setTrackingNumber('');
  };

  const oneTime = searchParams.get('oneTime') === 'true';

  return (
    <main className="bg-secondary flex flex-col">
      <Header />

      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 sm:gap-8 mt-0">
            {/* Main content container */}
            <div className="lg:col-span-12 flex flex-col lg:flex-row w-full gap-6 md:my-8">
              {/* Hero image + form */}
              <div className="lg:w-8/12 mt-0">
                <div 
                  className="rounded-none sm:rounded-xl shadow-sm border-0 sm:border sm:border-gray-200 bg-white overflow-hidden mt-0 pt-0 mb-0 pb-0"
                >
                  {/* Desktop: Side-by-side layout */}
                  <div className="hidden sm:flex">
                    {/* Left side: Image */}
                    <div className="w-2/5 relative" style={{ height: "500px" }}>
                      <Image 
                        src="/women-image2.png" 
                        alt="Package Tracking" 
                        fill
                        sizes="40vw"
                        style={{ objectFit: "cover" }}
                        priority
                      />
                    </div>
                    
                    {/* Right side: Content and form */}
                    <div className="w-3/5 flex flex-col justify-center p-6 sm:p-8">
                      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl mb-3">
                        Real-Time Package Updates.No Stress
                      </h1>
                      <p className="text-gray-600 mb-6 text-base leading-relaxed">
                        Enter your tracking number and get real-time updatesâno need to check manually.
                      </p>
                      <div className="w-full max-w-full">
                        <TrackingForm onTrackingSubmit={handleTrackingSubmit} initialCarrier={carrier} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile: Stacked layout with background image */}
                  <div 
                    className="sm:hidden flex flex-col items-center justify-between relative overflow-hidden"
                    style={{
                      backgroundImage: 'url(/women-image2.png)',
                      backgroundPosition: 'top center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      minHeight: '550px',
                    }}
                  >
                    <div className="w-full pt-12 px-6 flex flex-col items-center z-10">
                      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 text-center mb-3">
                      Tired of Checking Your Tracking?
                      </h1>
                      <p className="text-gray-600 mb-4 text-lg leading-relaxed text-center">
                      We'll notify you the moment your package moves.
                      Peace of mind, for less than a coffee.
                      </p>
                    </div>
                    
                    <div className="mt-auto w-full px-6 pb-8 z-10">
                      <div className="max-w-lg mx-auto w-full">
                        <TrackingForm onTrackingSubmit={handleTrackingSubmit} initialCarrier={carrier} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile-only sidebar content - will show above features on mobile */}
                <div className="lg:hidden mt-4">
                  {/* Quick Info */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Track Once, Stay Notified</h2>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                          <span className="text-xs font-medium">1</span>
                        </div>
                        <p className="ml-3 text-sm text-gray-700 font-medium">Enter your tracking number and select carrier</p>
                      </li>
                      <li className="flex items-start bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                          <span className="text-xs font-medium">2</span>
                        </div>
                        <p className="ml-3 text-sm text-gray-700 font-medium">Select how you want updates (SMS or Email)</p>
                      </li>
                      <li className="flex items-start bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                          <span className="text-xs font-medium">3</span>
                        </div>
                        <p className="ml-3 text-sm text-gray-700 font-medium">Get instant alerts when your package status changes</p>
                      </li>
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Benefits</h2>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center text-sm bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">Real-time delivery status updates</span>
                      </li>
                      <li className="flex items-center text-sm bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">Instant notifications on status changes</span>
                      </li>
                      <li className="flex items-center text-sm bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">Secure & private tracking data</span>
                      </li>
                      <li className="flex items-center text-sm bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">Never miss a delivery update</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sidebar - hidden on mobile since we duplicated it above */}
              <div className="hidden lg:block lg:w-4/12 space-y-6 lg:mt-0">
                {/* Quick Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Track Once, Stay Notified</h2>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                        <span className="text-xs font-medium">1</span>
                      </div>
                      <p className="ml-3 text-sm text-gray-700 font-medium">Enter your tracking number and select carrier</p>
                    </li>
                    <li className="flex items-start bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                        <span className="text-xs font-medium">2</span>
                      </div>
                      <p className="ml-3 text-sm text-gray-700 font-medium">Select how you want updates (SMS or Email)</p>
                    </li>
                    <li className="flex items-start bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                        <span className="text-xs font-medium">3</span>
                      </div>
                      <p className="ml-3 text-sm text-gray-700 font-medium">Get instant alerts when your package status changes</p>
                    </li>
                  </ul>
                </div>

                {/* Benefits */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Benefits</h2>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">Real-time delivery status updates</span>
                    </li>
                    <li className="flex items-center text-sm bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">Instant notifications on status changes</span>
                    </li>
                    <li className="flex items-center text-sm bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">Secure & private tracking data</span>
                    </li>
                    <li className="flex items-center text-sm bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">Never miss a delivery update</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Move Suspense inside the component for URL handling only */}
      <Suspense fallback={null}>
        <HomeWithSearch onTrackingSubmit={handleTrackingSubmit} />
      </Suspense>

      {/* Render TrackingModal for both one-time and subscription flows */}
      {isModalOpen && trackingNumber && (
        <TrackingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          trackingNumber={trackingNumber}
          carrier={carrier}
          oneTime={oneTime}
        />
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-secondary flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading...</div>
    </div>}>
      <HomeContent />
    </Suspense>
  );
} 