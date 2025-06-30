'use client';

import React from 'react';
import { X, Check, Zap } from 'lucide-react'; // Import additional icons for consistency

interface UseExistingSubModalProps {
  isOpen: boolean;
  onClose: () => void; // General close/cancel action
  onConfirm: () => void; // Action to use the credit
  onViewOptions: () => void; // Action to see tier selection instead
  remainingPackages: number;
  tierName: string;
}

const UseExistingSubModal: React.FC<UseExistingSubModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onViewOptions,
  remainingPackages,
  tierName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-sm min-w-[280px] sm:min-w-[380px] overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-white px-4 sm:px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg sm:text-xl font-semibold">Active Subscription</h3>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Plan Found!</h3>
            
            <div className="flex items-center justify-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-medium text-primary">{tierName}</span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-5">
              <p className="text-sm text-gray-700">
                {/* Conditionally display remaining packages for non-unlimited plans */}
                {remainingPackages >= 0 && tierName !== 'Pro Plan' && (
                    <>You have <span className="font-semibold text-gray-900">{remainingPackages}</span> package credit{remainingPackages !== 1 ? 's' : ''} remaining</>
                )}
                 {/* Show different text for unlimited */}
                {tierName === 'Pro Plan' && (
                    <>You have unlimited package credits with your Pro Plan.</>
                )}
                <span className="block mt-1 text-xs text-gray-500">Click "Activate Notifications" to use one credit for this package</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              id="confirm-use-credit-btn"
              onClick={onConfirm}
              className="w-full inline-flex items-center justify-center rounded-md border border-transparent shadow-sm px-4 py-3 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm transition-colors"
            >
              Activate Notifications
            </button>
            <button
              id="view-other-options-btn"
              onClick={onViewOptions}
              type="button"
              className="w-full inline-flex items-center justify-center rounded-md border border-gray-300 shadow-sm px-4 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm transition-colors"
            >
              View other options
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseExistingSubModal; 