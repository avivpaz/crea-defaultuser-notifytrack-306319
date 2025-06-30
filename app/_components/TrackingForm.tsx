'use client';

import { useState } from 'react';
import { FaSearch, FaBox, FaExclamationCircle } from 'react-icons/fa';

interface TrackingFormProps {
  onTrackingSubmit: (trackingNumber: string, carrier: string) => void;
  initialCarrier?: string;
}

const TEST_TRACKING_NUMBERS = {
  DELIVERED: 'SHIPPO_DELIVERED',
  TRANSIT: 'SHIPPO_TRANSIT',
  FAILURE: 'SHIPPO_FAILURE',
  RETURNED: 'SHIPPO_RETURNED',
  UNKNOWN: 'SHIPPO_UNKNOWN',
  PRE_TRANSIT: 'SHIPPO_PRE_TRANSIT'
};

// Available carriers - removed emojis
const CARRIERS = [
  { value: 'usps', label: 'USPS' },
  { value: 'fedex', label: 'FedEx' },
  { value: 'ups', label: 'UPS' },
  { value: 'dhl_express', label: 'DHL Express' },
  { value: 'dhl_ecommerce', label: 'DHL eCommerce' }
];

export default function TrackingForm({ onTrackingSubmit, initialCarrier = 'usps' }: TrackingFormProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState(initialCarrier);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const trimmedTrackingNumber = trackingNumber.trim();

    if (!trimmedTrackingNumber) {
      setError('Please enter a tracking number');
      setIsSubmitting(false);
      return;
    }

    const cleanedTrackingNumber = trimmedTrackingNumber.replace(/\s+/g, '');

    try {
      onTrackingSubmit(cleanedTrackingNumber, carrier);
      setTrackingNumber('');
      setIsSubmitting(false);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  const activeCarrier = CARRIERS.find(c => c.value === carrier) || CARRIERS[0];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} id="tracking-number-form" suppressHydrationWarning>
        <div className="space-y-4">
          {/* Tracking inputs section */}
          <div className="relative">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Carrier selector - now first */}
              <div className="sm:w-1/3 min-w-[120px]">
                <div className="relative">
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full appearance-none px-3 py-3 border border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-gray-900 shadow-sm font-medium text-base"
                    id="carrier-select"
                    aria-label="Select carrier"
                  >
                    {CARRIERS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Tracking number input with icon */}
              <div className="relative flex-grow sm:w-2/3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <FaBox className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-gray-900 placeholder-gray-400 shadow-sm text-base overflow-hidden"
                  placeholder={`Enter ${activeCarrier.label} tracking number`}
                  id="tracking-number-input"
                  aria-describedby={error ? "tracking-error-message" : undefined}
                  autoComplete="off"
                  minLength={5}
                  maxLength={40}
                />
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 flex items-start" id="tracking-error-message" role="alert">
              <FaExclamationCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Submit button with loading state */}
          <button
            id="track-package-btn"
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all ${
              isSubmitting ? 'bg-primary/80 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark active:transform active:scale-[0.99]'
            } shadow-sm text-base flex justify-center items-center`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Tracking...
              </>
            ) : (
              <>
                <FaSearch className="mr-2" />
                Track Package
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 