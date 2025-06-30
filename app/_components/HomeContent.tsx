'use client';

import { useState, useEffect } from 'react';
import TrackingModal from './TrackingModal';
import TrackingForm from './TrackingForm';

export default function HomeContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleTrackingSubmit = (number: string) => {
    setTrackingNumber(number);
    setIsModalOpen(true);
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-secondary"></div>;
  }

  return (
    <main className="min-h-screen bg-secondary flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
          <div className="text-center mb-8 space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Track Your USPS Package
            </h1>
            <p className="text-lg text-gray-600">
              Get real-time updates and notifications for your USPS shipments
            </p>
          </div>
          
          <div className="w-full">
            <TrackingForm onTrackingSubmit={handleTrackingSubmit} />
          </div>
        </div>
      </div>

      <TrackingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trackingNumber={trackingNumber}
      />
    </main>
  );
} 