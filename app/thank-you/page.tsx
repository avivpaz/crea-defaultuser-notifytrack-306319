'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

// Define expected Tier names
type TierName = 'Single' | 'Basic' | 'Pro' | 'Single Package' | 'Basic Plan' | 'Pro Plan' | 'monthly' | 'yearly' | null;

// Helper function to get full tier name for display
const getFullTierName = (shortName: TierName): string => {
  switch(shortName) {
    case 'Single': return 'Single Package';
    case 'Basic': return 'Basic Plan';
    case 'Pro': return 'Pro Plan';
    case 'monthly': return 'Monthly';
    case 'yearly': return 'Yearly';
    default: return shortName ? shortName.charAt(0).toUpperCase() + shortName.slice(1) : '';
  }
};

function ThankYouContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [notificationInfo, setNotificationInfo] = useState({
    trackingNumber: '',
    notificationType: '',
    contactInfo: '',
    warning: '',
    tierName: null as TierName,
    transactionId: ''
  });
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // searchParams can be null in Next.js App Router during initial render
    if (!searchParams) return;

    // Use 'let' for trackingNumber so we can reassign it if needed
    let trackingNumber = searchParams.get('trackingNumber');
    let notificationType = searchParams.get('notificationType');
    // Try to get contactInfo, fallback to email or phone if not present
    let contactInfo = searchParams.get('contactInfo');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    if (!contactInfo) {
      if (email) {
        contactInfo = email;
      } else if (phone) {
        contactInfo = phone;
      }
    }
    // Set notificationType based on contact info if not provided
    if (!notificationType) {
      if (email) {
        notificationType = 'email';
      } else if (phone) {
        notificationType = 'sms';
      }
    }
    const warning = searchParams.get('warning') || '';
    // Support both 'plan' and 'tierName' query parameters
    const planParam = searchParams.get('plan');
    const tierName = (planParam || searchParams.get('tierName')) as TierName;
    const transactionId = searchParams.get('transctionId') || '';

    // Log all query parameters to debug
    console.log('ThankYouPage received params:', { 
      trackingNumber, notificationType, contactInfo, warning, tierName, transactionId 
    });

    // Emergency fallback - if we have a tier name but no tracking number, set a default
    // This can happen with subscription flows where notification setup fails
    if (tierName && !trackingNumber) {
      console.log('No tracking number but we have a tier name, using default value');
      // Use this tracking number to avoid redirection
      trackingNumber = 'UNKNOWN';
    }

    // For single package purchases, set default notification type to show elements even if not passed
    // We infer that it's a single package purchase if:
    // 1. We have a tracking number that's not 'N/A'
    // 2. The tier name is 'Single Package' or missing
    const isSinglePackage = (trackingNumber && trackingNumber !== 'N/A') && 
                           (!tierName || tierName === 'Single Package');
    
    // Set defaults for notification type and contact info if it's a single package
    const defaultNotificationType = isSinglePackage ? 'sms' : '';
    const defaultContactInfo = isSinglePackage ? '(Contact details not shown)' : '';

    // Process warning message to handle contact info mismatch
    let processedWarning = warning;
    // Check if we have a warning about missing SMS contact info but we're using email
    if (warning.includes('has no sms contact information') && notificationType === 'email') {
      // If we're using email notifications, suppress the SMS warning
      console.log('Suppressing SMS warning since notification type is email');
      processedWarning = ''; // Clear the warning - it's not relevant
    }

    setNotificationInfo({
      trackingNumber: trackingNumber || 'N/A',
      notificationType: notificationType || defaultNotificationType,
      contactInfo: contactInfo || defaultContactInfo,
      warning: processedWarning,
      tierName: tierName,
      transactionId: transactionId
    });
    setIsLoading(false);
  }, [searchParams, router]);

  // Determine if the user came from the Manage Plan flow (no specific package)
  const cameFromManagePlan = notificationInfo.trackingNumber === 'N/A';

  // Determine messages based on tier and origin
  const isSubscription = notificationInfo.tierName === 'Basic Plan' || 
                         notificationInfo.tierName === 'Pro Plan' ||
                         notificationInfo.tierName === 'Basic' || 
                         notificationInfo.tierName === 'Pro';
                         
  const confirmationTitle = isSubscription ? "Subscription Updated!" : "Payment Successful!";
  
  let confirmationMessage = '';
  if (isSubscription) {
    confirmationMessage = cameFromManagePlan
      ? `Your ${getFullTierName(notificationInfo.tierName)} subscription is now active.`
      : `Your ${getFullTierName(notificationInfo.tierName)} subscription is now active. Notifications for package ${notificationInfo.trackingNumber} are set up.`;
  } else { // One-time purchase always has a tracking number
    confirmationMessage = `You will now receive tracking updates for ${notificationInfo.trackingNumber}.`;
  }

  // Determine if we should show notification details - modified to allow showing even with warnings
  const hasValidNotification = notificationInfo.notificationType && notificationInfo.contactInfo;

  if (isLoading) {
    return (
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="animate-pulse space-y-6">
              {/* Loading Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              </div>
              {/* Loading Title and Text */}
              <div className="space-y-3">
                <div className="h-7 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
              {/* Loading Info Box */}
              <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                {/* Only show contact info if available */} 
                {searchParams?.get('notificationType') && (
                     <div className="flex justify-between items-center">
                       <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                       <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                     </div>
                )}
              </div>
              {/* Loading Button */}
              <div className="flex justify-center">
                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
        </div>
    );
  }

  return (
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">{confirmationTitle}</h1>
          <p className="text-gray-600">
            {confirmationMessage}
          </p>
        </div>

        {notificationInfo.warning && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6 flex items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">{notificationInfo.warning}</p>
          </div>
        )}

        {/* Conditionally render package details only if NOT from ManagePlan flow */}
        {!cameFromManagePlan && (
            <div className="bg-[#F8F9FA] rounded-lg p-4 mb-6 border border-gray-200">
            <div className="space-y-3">
                {/* Always show Tracking Number */}
                <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tracking Number:</span>
                <span className="text-sm font-medium text-[#333366]">{notificationInfo.trackingNumber}</span>
                </div>
                
                {/* Show transaction ID if available */}
                {notificationInfo.transactionId && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Transaction ID:</span>
                    <span className="text-sm font-medium text-[#333366]">{notificationInfo.transactionId}</span>
                  </div>
                )}
                
                {/* Always show Tier Name if available */}
                {notificationInfo.tierName && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Plan Type:</span>
                        <span className="text-sm font-medium text-[#333366]">{getFullTierName(notificationInfo.tierName)}</span>
                    </div>
                )}
                {/* Conditionally show notification details - show even with warnings */}
                {hasValidNotification && (
                    <>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Notification Type:</span>
                            <span className="text-sm font-medium text-[#333366] uppercase">{notificationInfo.notificationType}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Contact:</span>
                            <span className="text-sm font-medium text-[#333366] break-all">{notificationInfo.contactInfo}</span>
                        </div>
                    </>
                )}
            </div>
            </div>
        )}
        {/* Always show tier if subscription from manage plan */} 
        {cameFromManagePlan && notificationInfo.tierName && (
             <div className="bg-[#F8F9FA] rounded-lg p-4 mb-6 border border-gray-200">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">New Active Plan:</span>
                    <span className="text-sm font-medium text-[#333366]">{getFullTierName(notificationInfo.tierName)}</span>
                </div>
            </div>
        )}

        <div className="text-center">
            {/* Conditionally render notification sentence */}
            {!cameFromManagePlan && hasValidNotification && (
                 <p className="text-sm text-gray-500 mb-4">
                     You will receive notifications via {notificationInfo.notificationType}.
                 </p>
            )}
             {isSubscription && (
                 <p className="text-xs text-gray-500 mb-4">
                    Manage your subscription through your PayPal account.
                 </p>
             )}
          <Link
            id="track-another-package-btn"
            href="/"
            className="inline-block bg-[#333366] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#282855] transition-colors"
          >
            Track Another Package
          </Link>
        </div>
      </div>
  );
}

// Wrap the main content with Suspense for searchParams
export default function ThankYouPage() {
    return (
        <main className="min-h-screen bg-secondary">
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
                 <Suspense fallback={
                    // Provide a similar loading skeleton within Suspense
                    <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                         <div className="animate-pulse space-y-6">
                             <div className="flex justify-center"><div className="w-16 h-16 bg-gray-200 rounded-full"></div></div>
                             <div className="space-y-3">
                                 <div className="h-7 bg-gray-200 rounded w-1/2 mx-auto"></div>
                                 <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                             </div>
                             <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                                 <div className="h-4 bg-gray-200 rounded w-full"></div>
                                 <div className="h-4 bg-gray-200 rounded w-full"></div>
                             </div>
                             <div className="flex justify-center"><div className="h-10 bg-gray-200 rounded w-1/2"></div></div>
                         </div>
                    </div>
                 }>
                    <ThankYouContent />
                 </Suspense>
            </div>
        </main>
    );
} 