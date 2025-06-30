'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { TrackingUpdate } from '../lib/db'; // Corrected relative import path
import UseExistingSubModal from './UseExistingSubModal'; // Import the new modal
import PayPalProvider from './PayPalProvider';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { TierDetails } from '../_types/tiers';
import { Package, MapPin, CalendarDays, Info, AlertTriangle, DollarSign } from 'lucide-react';

// Define tiers locally for lookup (mirroring TierSelectionModal)
// TODO: Consider moving this to a shared lib file
const availableTiers: Array<TierDetails & { isPopular?: boolean }> = [
  {
    name: 'Single Package',
    price: '1.99',
    priceSuffix: '',
    paypalPlanId: null,
    isMonthly: false,
    packageLimit: 1,
  },
  {
    name: 'monthly',
    price: '6',
    priceSuffix: '/month',
    paypalPlanId: process.env.NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID || 'P-3W692804CY162341TM7WYEJY',
    isMonthly: true,
    packageLimit: 4,
    isPopular: true,
  },
  {
    name: 'yearly',
    price: '10',
    priceSuffix: '/year',
    paypalPlanId: process.env.NEXT_PUBLIC_PAYPAL_YEARLY_PLAN_ID || 'P-5XT02841GN163472XMQBCVNI',
    isMonthly: false,
    packageLimit: -1,
  },
];

// Helper function to find tier details by name
// Export the function
export const getTierDetailsByName = (name: string): TierDetails | null => {
    return availableTiers.find(tier => tier.name === name) || null;
};


interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackingNumber: string;
  carrier?: string;
  oneTime?: boolean;
}

interface SubscriptionFormData {
  notificationType: 'email' | 'sms';
  contactInfo: string;
  // notificationFrequency removed as tier implies frequency
  subscriptionId?: number; // Keep for potential future use if needed
  pendingPackageId?: number; // To link activation/payment to the pending package
  userId?: number; // Add userId to store after check
  currentPayPalSubscriptionId?: string | null; // Add field to store current PayPal ID
  carrier?: string; // Add carrier field
  termsOfUseApproved: boolean; // Add explicit field for terms approval
}

// Updated TrackingStatus to align with API response structure
interface TrackingStatusFromApi {
  status: string;
  summary: string;
  details: string;
  lastUpdate: string;
  deliveryDate: string | null;
  location: string | null;
  events?: TrackingUpdate[]; // Use the imported TrackingUpdate type
}

// Interface for the active package info from the API
interface ActivePackageInfo {
    notification_type: string;
    contact_info: string;
}


// Modified formatDate function to ensure consistent rendering between server and client
const formatDate = (dateString: string | Date) => {
  try {
    // Ensure dateString is a valid Date object or string
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    if (isNaN(date.getTime())) {
        return String(dateString); // Return original string if invalid
    }
    // Use a fixed locale and options to ensure consistent rendering
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC' // Use UTC to ensure consistent rendering
    });
  } catch (error) {
    // Fallback in case of errors
    return String(dateString);
  }
};

export default function TrackingModal({ isOpen, onClose, trackingNumber, carrier = 'usps', oneTime = false }: TrackingModalProps) {
  const [isLoading, setIsLoading] = useState(true); // Start loading true
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatusFromApi | null>(null);
  const [activePackageInfo, setActivePackageInfo] = useState<ActivePackageInfo | null>(null);
  // Remove old subscription state: const [subscription, setSubscription] = useState<{...} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false); // Keep success for payment confirmation
  const [showHistory, setShowHistory] = useState(false);
  const [showPayPalModal, setShowPayPalModal] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionFormData | null>(null);
  // Remove hasPrefilledForm state, logic changes: const [hasPrefilledForm, setHasPrefilledForm] = useState(false);

  // State for managing the flow
  const [modalStep, setModalStep] = useState<'loading' | 'showActive' | 'showForm' | 'showUseExisting' | 'showTierSelection' | 'showCheckout' | 'showSuccess' | 'showCancelled' | 'planSelection'>('loading');

  // State for data needed by UseExistingSubModal & potentially Checkout Modal
  // Add currentPayPalSubscriptionId here as well
  const [useExistingSubInfo, setUseExistingSubInfo] = useState<{ 
    tierName: string; 
    remainingPackages: number;
    currentPayPalSubscriptionId?: string | null; // Add here
  } | null>(null);
  const [isActivatingCredit, setIsActivatingCredit] = useState(false); // Loading state for credit activation
  const [isCancelling, setIsCancelling] = useState(false); // Loading state for cancellation

  // State to hold selected tier details
  const [selectedTier, setSelectedTier] = useState<TierDetails | null>(null);
  // State to hold the user's current tier details if fetched
  const [currentUserTierDetails, setCurrentUserTierDetails] = useState<TierDetails | null>(null);

  // Add state for showing more tracking details
  const [showMoreTrackingDetails, setShowMoreTrackingDetails] = useState(false);
  // Add state for showing tracking history
  const [showTrackingHistory, setShowTrackingHistory] = useState(false);

  // 1. Add new modalStep: 'planSelection' and state for selectedPlan
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'onetime' | null>('monthly');
  const [showMonthlyPlans, setShowMonthlyPlans] = useState(false);

  // 2. Add plan details for monthly/yearly
  // Add one-time plan option
  const oneTimePlan = {
    key: 'onetime',
    label: 'Single Package',
    price: '1.99',
    priceSuffix: '',
    benefits: [
      'Perfect for one-time shipments',
      'No subscription required',
      'Instant SMS or email alerts'
    ],
    paypalPlanId: null,
    isMonthly: false,
  };

  
  const monthlyPlan = {
    key: 'monthly',
    label: 'Monthly',
    price: '3.49',
    priceSuffix: '/month',
    benefits: [
      'Unlimited package tracking, any carrier.',
      'Instant SMS/email notifications.',
      'Cancel anytime, no hidden fees.'
    ],
    paypalPlanId: process.env.NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID || 'P-5XT02841GN163472XMQBCVNI',
    isMonthly: true,
  };
  const yearlyPlan = {
    key: 'yearly',
    label: 'Yearly',
    price: (3.49 * 10).toFixed(2),
    priceSuffix: '/year',
    benefits: [
      'Late delivery cashback',
      '2 months free',
      'All monthly benefits included.'
    ],
    paypalPlanId: process.env.NEXT_PUBLIC_PAYPAL_PRO_YEARLY_PLAN_ID || '',
    isMonthly: false
  };
  const planOptions = oneTime ? [
    oneTimePlan,
    monthlyPlan,
    yearlyPlan
  ] : [
    monthlyPlan,
    yearlyPlan
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues, // Need getValues to retrieve pendingPackageId/userId later
    reset, // Add reset to form methods for handling new tracking numbers
  } = useForm<SubscriptionFormData>({
    defaultValues: {
      notificationType: 'sms',
      carrier: carrier,
      termsOfUseApproved: false, // Default unchecked
    },
    mode: 'onChange'
  });

  const notificationType = watch('notificationType');
  const contactInfo = watch('contactInfo');
  // Remove isContactInfoValid as submit button logic will change: const isContactInfoValid = contactInfo && !errors.contactInfo;

  // Add a mounted state to prevent hydration issues
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;

  const hasAutoSubmitted = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get the notification type registration
  const notificationTypeRef = register("notificationType");

  // Handle notification type change manually
  const handleNotificationTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = event.target.value as 'email' | 'sms';
    setValue('notificationType', newType);
    // Clear contact info when type changes unless it was pre-filled (which is no longer the case here)
    setValue('contactInfo', '');
    // Remove hasPrefilledForm logic
  };

  // Memoize onSubmit to prevent infinite loops
  const onSubmit = useCallback(async (formData: SubscriptionFormData) => {
    setIsSubmitting(true);
    setError(null);
    setUseExistingSubInfo(null);
    setCurrentUserTierDetails(null);
    const carrierCode = formData.carrier || carrier;
    try {
      const response = await fetch('/api/user/check-status-and-prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingNumber,
          carrier: carrierCode,
          notificationType: formData.notificationType,
          contactInfo: formData.contactInfo
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Check status and prepare package failed');
      setValue('pendingPackageId', data.pendingPackageId);
      setValue('userId', data.userId);
      setSubscriptionData({
        ...formData,
        userId: data.userId,
        pendingPackageId: data.pendingPackageId,
        termsOfUseApproved: formData.termsOfUseApproved,
      });
      if (data.hasActiveSubscription && data.tierName && data.hasCredit) {
        // Activate immediately, no modal
        await handleConfirmUseCreditImmediate(data.userId, data.pendingPackageId);
      } else {
        setModalStep('planSelection');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check user status. Please try again.');
      setModalStep('showForm');
    } finally {
      setIsSubmitting(false);
    }
  }, [carrier, trackingNumber, setValue]);

  // Update the auto-submit useEffect to remove onSubmit from dependencies
  useEffect(() => {
    if (!isOpen || !trackingNumber || !searchParams) return;
    if (hasAutoSubmitted.current) return;
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    if (email || phone) {
      const notificationType = email ? 'email' : 'sms';
      const contactInfo = email || phone || '';
      setValue('notificationType', notificationType);
      setValue('contactInfo', contactInfo);
      setValue('termsOfUseApproved', true); // Auto-check for auto-submission
      if (modalStep === 'showForm' && !isLoading && !isSubmitting) {
        hasAutoSubmitted.current = true;
        onSubmit({
          notificationType,
          contactInfo,
          carrier,
          termsOfUseApproved: true, // Required for type safety
        });
      }
    }
  // Only include stable dependencies
  }, [isOpen, trackingNumber, setValue, modalStep, isLoading, isSubmitting, carrier, searchParams, onSubmit]);
  
  useEffect(() => {
    if (!isOpen) {
      hasAutoSubmitted.current = false;
    }
  }, [isOpen]);
  
  // Extracted tracking status fetch logic into a separate function for reusability
  const fetchTrackingStatus = async (number: string, carrierCode: string) => {
    try {
      const response = await fetch(`/api/package/status?trackingNumber=${encodeURIComponent(number)}&carrier=${encodeURIComponent(carrierCode)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tracking status');
      }

      setTrackingStatus(data.trackingStatus);
      setActivePackageInfo(data.activePackageInfo);

      // Determine the next step based on the response
      if (data.activePackageInfo) {
          setModalStep('showActive');
      } else {
          setModalStep('showForm');
          // Reset form values when showing form anew
          setValue('notificationType', 'sms');
          setValue('contactInfo', '');
          setValue('carrier', carrierCode);
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch initial tracking status');
      setModalStep('showForm'); // Fallback to showing form on error?
    } finally {
      setIsLoading(false);
    }
  };

  // 4. New function for immediate activation
  const handleConfirmUseCreditImmediate = async (userId: number, pendingPackageId: number) => {
    setIsActivatingCredit(true);
    setError(null);
    try {
      const response = await fetch('/api/package/activate-existing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, pendingPackageId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to activate package using credit.');
      setSuccess(true);
      setModalStep('showSuccess');
      setTimeout(() => { onClose(); }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while using your package credit.');
      setModalStep('showForm');
    } finally {
      setIsActivatingCredit(false);
    }
  };

  // Function to handle tier selection from TierSelectionModal
  const handleSelectTier = (tier: TierDetails) => {
    console.log("Tier selected:", tier);
    setSelectedTier(tier);

    // Prepare data needed for SubscriptionCheckoutModal (and payment creation later)
    const checkoutData: SubscriptionFormData = {
        ...(subscriptionData || { // Use existing form data or defaults
             notificationType: getValues('notificationType'),
             contactInfo: getValues('contactInfo') || '',
             pendingPackageId: getValues('pendingPackageId'),
             userId: getValues('userId'),
             termsOfUseApproved: getValues('termsOfUseApproved'), // Ensure always present
        }),
        // Add tier-specific info if needed, though checkout modal might fetch price again
    };
    
    // Log and validate the essential IDs
    console.log("User ID:", checkoutData.userId);
    console.log("Pending Package ID:", checkoutData.pendingPackageId);
    
    // Validate IDs are present for monthly plans before proceeding
    if (tier.isMonthly && (!checkoutData.userId || !checkoutData.pendingPackageId)) {
      console.error("Missing required IDs for subscription!", checkoutData);
      setError("Required user information is missing. Please try again or contact support.");
      return; // Don't proceed to checkout
    }
    
    setSubscriptionData(checkoutData);

    // Close the tier selection modal and show the checkout modal
    // Note: In a more robust flow, we might call the payment creation API *here*
    // before showing the checkout modal, passing the necessary IDs.
    setModalStep('showCheckout'); // Use a dedicated step or just control showPayPalModal
    setShowPayPalModal(true);
  };

  const handleSubscriptionComplete = () => {
    console.log('Subscription complete, showing success state');
    setSuccess(true);
    setShowPayPalModal(false);
    setModalStep('showSuccess'); // Use success step after payment too
    
    // Use setTimeout to ensure proper closure after success
    setTimeout(() => {
      console.log('Success timeout complete, closing modal');
      onClose(); // Call parent's onClose directly
    }, 3000); // Increased delay to see success message
  };

  const handleModalClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any bubbling of the event
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Handle modal close triggered - simplified version');
    
    // Call the parent's onClose handler directly without setTimeout
    onClose();
  };

  // Separate handler for backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking exactly on the backdrop (not its children)
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Backdrop click detected');
      onClose();
    }
  };

  const payButtonsRef = useRef<HTMLDivElement | null>(null);
  const [showInfoPopover, setShowInfoPopover] = useState(false);
  const infoBtnRef = useRef<HTMLButtonElement | null>(null);

  // Close popover on outside click (mobile only)
  useEffect(() => {
    if (!showInfoPopover || !isMobile) return;
    function handleClick(e: MouseEvent) {
      if (infoBtnRef.current && !infoBtnRef.current.contains(e.target as Node)) {
        setShowInfoPopover(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showInfoPopover, isMobile]);

  // Add state for cashback tooltip
  const [showCashbackTooltip, setShowCashbackTooltip] = useState(false);
  const cashbackInfoRef = useRef<HTMLButtonElement | null>(null);

  // Add effect to close tooltip on outside click
  useEffect(() => {
    if (!showCashbackTooltip) return;
    function handleClick(e: MouseEvent) {
      if (cashbackInfoRef.current && !cashbackInfoRef.current.contains(e.target as Node)) {
        setShowCashbackTooltip(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showCashbackTooltip]);

  const renderNotificationSetup = (payButtonsRef: React.RefObject<HTMLDivElement>) => {
    if (!isMounted) return null;
    if (isLoading || isSubmitting || isActivatingCredit || isCancelling) {
      return (
        <div className="py-6">
          <div className="space-y-4 pt-4 border-t">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
              <p className="text-sm text-center text-gray-500 pt-2">
                {isCancelling ? 'Cancelling Subscription...' : isActivatingCredit ? 'Activating with credit...' : (isSubmitting ? 'Checking...' : 'Loading...')}
              </p>
            </div>
          </div>
        </div>
      );
    }
    if (modalStep === 'showSuccess' && success) {
      return (
        <div className="p-6 text-center border-t">
          <svg className="mx-auto mb-4 w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Success!</h3>
          <p className="text-sm text-gray-600">Notifications activated for {trackingNumber}.</p>
          <p className="text-sm text-gray-500 mt-4">This window will close automatically.</p>
        </div>
      );
    }
    if (modalStep === 'showCancelled') {
      return (
        <div className="p-6 text-center border-t">
          <svg className="mx-auto mb-4 w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscription Cancelled</h3>
          <p className="text-sm text-gray-600">Your subscription has been cancelled and will not renew.</p>
          <p className="text-sm text-gray-500 mt-4">Returning to options shortly...</p>
        </div>
      );
    }
    if (modalStep === 'showActive' && activePackageInfo) {
      return (
        <div className="p-6 bg-primary/5 border-t">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3 className="text-lg font-semibold text-primary">Notifications Active</h3>
          </div>
          <p className="text-sm text-gray-700 pl-9">Notifications for this package are already active.</p>
        </div>
      );
    }
    if (modalStep === 'showForm') {
      return (
        <div className="py-6">
          <div className="space-y-4 pt-4 border-t">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-primary">Get Tracking Notifications</h3>
                <p className="text-sm text-gray-600 max-w-xl">Enter your contact details to get started.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="tracking-notification-form">
              <div className="space-y-4">
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    {/* SMS Option */}
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${notificationType === "sms" ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200 hover:border-primary/50"}`} id="sms-notification-label" htmlFor="sms-notification-radio">
                      <input type="radio" id="sms-notification-radio" value="sms" {...register("notificationType")} checked={notificationType === "sms"} className="w-4 h-4 text-primary focus:ring-primary" />
                      <div className="ml-3">
                        <div className="flex items-center text-base font-medium text-gray-900"><svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>SMS</div>
                        <div className="text-sm text-gray-600 mt-1">Real-time alerts via text</div>
                      </div>
                    </label>
                    {/* Email Option */}
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${notificationType === "email" ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200 hover:border-primary/50"}`} id="email-notification-label" htmlFor="email-notification-radio">
                      <input type="radio" id="email-notification-radio" value="email" {...register("notificationType")} checked={notificationType === "email"} className="w-4 h-4 text-primary focus:ring-primary" />
                      <div className="ml-3">
                        <div className="flex items-center text-base font-medium text-gray-900"><svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>Email</div>
                        <div className="text-sm text-gray-600 mt-1">Instant updates to your inbox</div>
                      </div>
                    </label>
                  </div>
                </div>
                {/* Contact Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" id="contact-info-label">{notificationType === 'email' ? 'Email Address' : 'Phone Number'}</label>
                  <input type="text" {...register("contactInfo", { required: "This field is required", pattern: notificationType === 'email' ? { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" } : { value: /^\+?[1-9]\d{1,14}$/, message: "Invalid phone number" } })} placeholder={notificationType === 'email' ? 'you@example.com' : '+15551234567'} className="w-full px-3 py-2 bg-[#F8F9FA] border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 placeholder-gray-400 text-sm" id="contact-info-input" />
                  {errors.contactInfo && (<p className="mt-2 text-sm text-red-600" id="contact-info-error">{errors.contactInfo.message}</p>)}
                </div>
                {/* Terms of Use Approval Checkbox */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer select-none" htmlFor="terms-of-use-checkbox">
                    <input
                      type="checkbox"
                      id="terms-of-use-checkbox"
                      {...register("termsOfUseApproved", { required: "You must agree to the Terms of Service to receive notifications." })}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      By checking this box, you agree to receive package information and notifications (including via SMS if selected), and you agree to the
                      <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">Terms of Service</a>.
                    </span>
                  </label>
                  {errors.termsOfUseApproved && (
                    <p className="mt-2 text-sm text-red-600" id="terms-of-use-error">{errors.termsOfUseApproved.message}</p>
                  )}
                </div>
              </div>
              {error && !errors.contactInfo && (<div className="bg-red-50 border border-red-100 rounded-lg p-4 my-4"><p className="text-sm text-red-600">Error: {error}</p></div>)}
              <div className="pt-3 border-t">
                <button id="continue-btn" type="submit" disabled={!isValid || isSubmitting} className={`w-full py-3 sm:py-2.5 px-4 rounded-lg font-medium text-white transition-colors text-sm flex items-center justify-center${(!isValid || isSubmitting) ? ' bg-gray-400 cursor-not-allowed' : ' bg-primary hover:bg-primary/90 active:transform active:scale-[0.99]'}`}>{isSubmitting ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Checking...</>) : ('Continue')}</button>
              </div>
            </form>
          </div>
        </div>
      );
    }
    // New: Plan selection step
    if (modalStep === 'planSelection') {
      return (
        <div className="py-6">
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-primary mb-2 text-center">{oneTime ? 'One-Time Notification' : 'Choose Your Plan'}</h3>
            <div className={`grid ${oneTime && !showMonthlyPlans ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} gap-4 mb-4`}>
              {oneTime && !showMonthlyPlans ? (
                <label
                  key={oneTimePlan.key}
                  className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all relative ${selectedPlan === oneTimePlan.key ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 hover:border-primary/50'}`}
                  onClick={() => {
                    setSelectedPlan(oneTimePlan.key as 'onetime');
                    setShowInfoPopover(false);
                    setTimeout(() => {
                      if (payButtonsRef.current) {
                        payButtonsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }, 100);
                  }}
                >
                  <div className="text-lg font-bold text-primary text-center mb-1">{oneTimePlan.label}</div>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl font-bold text-primary mr-2">${oneTimePlan.price}</span>
                    <span className="text-xs text-gray-500 align-top">{oneTimePlan.priceSuffix}</span>
                  </div>
                  <ul className="text-sm text-gray-700 mb-2 list-disc pl-5">
                    {oneTimePlan.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                  {selectedPlan === oneTimePlan.key && <div className="mt-2 text-xs text-primary font-bold">Selected</div>}
                </label>
              ) : (
                planOptions.map((plan) => (
                  <label
                    key={plan.key}
                    className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all relative ${selectedPlan === plan.key ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 hover:border-primary/50'}`}
                    onClick={() => {
                      setSelectedPlan(plan.key as 'monthly' | 'yearly' | 'onetime');
                      setShowInfoPopover(false);
                      setTimeout(() => {
                        if (payButtonsRef.current) {
                          payButtonsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }, 100);
                    }}
                  >
                    <div className="text-lg font-bold text-primary text-center mb-1">{plan.label}</div>
                    {plan.key === 'yearly' && (
                      <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded shadow">Best Value</span>
                    )}
                    <div className="flex items-center mb-2">
                      <span className="text-2xl font-bold text-primary mr-2">${plan.price}</span>
                      <span className="text-xs text-gray-500 align-top">{plan.priceSuffix}</span>
                    </div>
                    <ul className="text-sm text-gray-700 mb-2 list-disc pl-5">
                      {plan.benefits.map((b, i) => {
                        if (plan.key === 'yearly' && b.toLowerCase().includes('late delivery cashback')) {
                          return (
                            <li key={i} className="font-bold relative">
                              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                Late delivery cashback
                                <button
                                  type="button"
                                  ref={cashbackInfoRef}
                                  className="ml-1 p-0.5 rounded-full hover:bg-green-200 focus:outline-none"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setShowCashbackTooltip(v => !v);
                                  }}
                                  aria-label="Info about cashback"
                                >
                                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><text x="12" y="16" textAnchor="middle" fontSize="12" fill="currentColor" dy=".3em">i</text></svg>
                                </button>
                              </span>
                              {showCashbackTooltip && (
                                <div className="absolute left-1/2 mt-2 w-64 -translate-x-1/2 bg-white border border-green-200 rounded-lg shadow-lg p-3 text-xs text-gray-700 z-[999]" style={{ top: '100%' }}>
                                  <div className="font-semibold text-green-700 mb-1">How cashback works</div>
                                  Cashback applies to <span className="font-bold">one package per month</span>. If your package is late for more than <span className="font-bold">48 hours</span>, you get <span className="font-bold">$10</span>.
                                </div>
                              )}
                            </li>
                          );
                        }
                        if (plan.key === 'yearly' && b.toLowerCase().includes('2 months free')) {
                          return <li key={i} className="font-bold text-amber-800"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-semibold">2 months free</span></li>;
                        }
                        return <li key={i} className={plan.key === 'yearly' ? 'ml-1' : ''}>{b}</li>;
                      })}
                    </ul>
                    {selectedPlan === plan.key && <div className="mt-2 text-xs text-primary font-bold">Selected</div>}
                  </label>
                ))
              )}
            </div>
            {oneTime && !showMonthlyPlans && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowMonthlyPlans(true)}
                  className="text-primary hover:text-primary/80 text-sm font-medium flex items-center justify-center gap-1 mx-auto"
                >
                  <span>View Monthly Plans</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
            {/* Show PayPal buttons only after a plan is selected */}
            {selectedPlan && (
              <div className="mt-4" ref={payButtonsRef}>
                <PayPalProvider>
                  <PayPalButtons
                    key={selectedPlan}
                    style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: oneTime ? 'pay' : 'subscribe', tagline: false }}
                    {...(oneTime
                      ? {
                          createOrder: async () => {
                            setError(null);
                            setProcessing(true);
                            try {
                              // Use create-reference route for one-time order creation
                              const response = await fetch('/api/payment/create-reference', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  price: oneTimePlan.price,
                                  planType: 'single',
                                  trackingNumber,
                                  notificationType: subscriptionData?.notificationType || 'sms',
                                  contactInfo: subscriptionData?.contactInfo || '',
                                }),
                              });
                              const data = await response.json();
                              if (!response.ok) throw new Error(data.error || 'Failed to create PayPal order');
                              setSubscriptionDbId(data.dbSubscriptionId || null);
                              // Store userId and pendingPackageId for activation step
                              setSubscriptionData((prev) => ({
                                ...prev,
                                userId: data.userId,
                                pendingPackageId: data.pendingPackageId,
                                notificationType: prev?.notificationType || 'sms',
                                contactInfo: prev?.contactInfo || '',
                                termsOfUseApproved: typeof prev?.termsOfUseApproved === 'boolean' ? prev.termsOfUseApproved : false,
                                carrier: prev?.carrier || carrier,
                              }));
                              setProcessing(false);
                              return data.id; // Use the returned PayPal order ID
                            } catch (err) {
                              setError(err instanceof Error ? err.message : 'Failed to prepare payment.');
                              setProcessing(false);
                              throw err;
                            }
                          },
                          onApprove: async (data: any) => {
                            setError(null);
                            setProcessing(true);
                            try {
                              // Call the capture-paypal-reference endpoint to capture and activate the payment
                              const response = await fetch('/api/payment/capture-paypal-reference', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  orderId: data.orderID,
                                }),
                              });
                              const responseData = await response.json();
                              if (!response.ok || !responseData.success) throw new Error(responseData.error || responseData.message || 'Failed to activate notification after payment.');
                              if (!subscriptionData) throw new Error('Missing subscription data.');
                              // Redirect to thank you page with all relevant params
                              const thankYouUrl = `/thank-you?trackingNumber=${encodeURIComponent(trackingNumber ?? '')}` +
                                `&transactionId=${encodeURIComponent(data.orderID ?? '')}` +
                                (subscriptionData.notificationType === 'email'
                                  ? `&email=${encodeURIComponent(subscriptionData.contactInfo ?? '')}`
                                  : `&phone=${encodeURIComponent(subscriptionData.contactInfo ?? '')}`) +
                                `&plan=onetime`;
                              router.push(thankYouUrl);
                            } catch (err) {
                              setError(err instanceof Error ? err.message : 'Failed to finalize payment.');
                            } finally {
                              setProcessing(false);
                            }
                          },
                        }
                      : {
                          createSubscription: async () => {
                            setError(null);
                            setProcessing(true);
                            try {
                              const plan = planOptions.find(p => p.key === selectedPlan);
                              if (!plan) throw new Error('Plan not found');
                              const response = await fetch('/api/payment/create-reference', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  price: plan.price,
                                  planType: plan.key,
                                  trackingNumber,
                                  notificationType: subscriptionData?.notificationType || 'sms',
                                  contactInfo: subscriptionData?.contactInfo || '',
                                  paypalPlanId: plan.paypalPlanId,
                                  packageLimit: -1,
                                  userId: subscriptionData?.userId,
                                  pendingPackageId: subscriptionData?.pendingPackageId,
                                  cancelPreviousPayPalSubId: subscriptionData?.currentPayPalSubscriptionId || null,
                                }),
                              });
                              const data = await response.json();
                              if (!response.ok) throw new Error(data.error || 'Failed to create PayPal reference');
                              setSubscriptionDbId(data.dbSubscriptionId || null);
                              setProcessing(false);
                              return data.id;
                            } catch (err) {
                              setError(err instanceof Error ? err.message : 'Failed to prepare payment.');
                              setProcessing(false);
                              throw err;
                            }
                          },
                          onApprove: async (data: any) => {
                            setError(null);
                            setProcessing(true);
                            try {
                              const response = await fetch('/api/subscription/activate', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  subscriptionId: subscriptionDbId,
                                  paypalSubscriptionId: data.subscriptionID,
                                  pendingPackageId: subscriptionData?.pendingPackageId || null,
                                  trackingNumber,
                                  userId: subscriptionData?.userId,
                                }),
                              });
                              const responseData = await response.json();
                              if (!response.ok) throw new Error(responseData.message || 'Failed to activate subscription');
                              if (!subscriptionData || !selectedPlan) throw new Error('Missing subscription data or plan.');
                              const thankYouUrl = `/thank-you?trackingNumber=${encodeURIComponent(trackingNumber ?? '')}` +
                                `&transactionId=${encodeURIComponent(data.subscriptionID ?? '')}` +
                                (subscriptionData.notificationType === 'email'
                                  ? `&email=${encodeURIComponent(subscriptionData.contactInfo ?? '')}`
                                  : `&phone=${encodeURIComponent(subscriptionData.contactInfo ?? '')}`) +
                                `&plan=${encodeURIComponent(String(selectedPlan ?? ''))}`;
                              router.push(thankYouUrl);
                            } catch (err) {
                              setError(err instanceof Error ? err.message : 'Failed to finalize payment.');
                            } finally {
                              setProcessing(false);
                            }
                          },
                        })}
                    onError={(err) => {
                      setError('An error occurred with the PayPal payment process. Please try again.');
                      setProcessing(false);
                    }}
                    onCancel={() => {
                      setError('Payment was cancelled.');
                      setProcessing(false);
                    }}
                  />
                </PayPalProvider>
                {error && <div className="mt-3 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">{error}</div>}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const [processing, setProcessing] = useState(false);

  // Add state to store dbSubscriptionId
  const [subscriptionDbId, setSubscriptionDbId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  // Restore effect to fetch tracking status on open or tracking number change
  useEffect(() => {
    if (isOpen && trackingNumber) {
      setIsLoading(true);
      setModalStep('loading');
      setError(null);
      setTrackingStatus(null);
      setActivePackageInfo(null);
      setUseExistingSubInfo(null);
      setCurrentUserTierDetails(null);
      // Reset the form state for the new tracking number
      reset({
        notificationType: 'sms',
        carrier: carrier,
      });
      setValue('pendingPackageId', undefined);
      setValue('userId', undefined);
      // Fetch the tracking status
      fetchTrackingStatus(trackingNumber, carrier);
    }
  }, [isOpen, trackingNumber, carrier, reset, setValue]);

  if (!isOpen || !isMounted) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start sm:items-center justify-center p-0 z-50 overflow-y-auto"
        onClick={handleBackdropClick}
      >
        <div 
          className="relative w-full sm:w-auto bg-white sm:rounded-lg shadow-lg sm:max-w-lg my-4 min-w-[320px] sm:min-w-[480px]"
        >
          {/* Header */}
          <div className="bg-primary text-white px-4 py-4 sm:rounded-t-lg flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <h2 className="text-lg font-semibold">Package Status</h2>
            </div>
            <button
              type="button"
              id="close-tracking-modal-btn"
              onClick={handleModalClose}
              className="text-white/80 hover:text-white transition-colors p-2"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4 sm:p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {/* Tracking Info Section (Display regardless of notification setup step) */}
            <div className="mb-3 bg-white/90 p-3 rounded-xl border border-primary/10 shadow-sm">
              <div className="flex flex-col gap-2 sm:gap-3 mb-2 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-xs font-medium text-gray-500">Tracking Number</span>
                    <span className="text-xs font-mono text-primary break-all">{trackingNumber}</span>
                  </div>
                </div>
                {trackingStatus?.deliveryDate && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-normal">
                    <CalendarDays className="w-3 h-3" />
                    <span>Expected Delivery: {formatDate(trackingStatus.deliveryDate)}</span>
                  </div>
                )}
              </div>

              {/* Loading for initial status fetch */}
              {isLoading && modalStep === 'loading' && (
                <div className="animate-pulse space-y-2 w-full">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mt-1"></div>
                </div>
              )}
              {/* Error during initial fetch */}
              {!isLoading && error && modalStep !== 'loading' && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-2 py-1 my-1">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-600">Error fetching status: {error}</span>
                </div>
              )}
              {/* No Tracking Data Found */}
              {!isLoading && !error && !trackingStatus && modalStep !== 'loading' && (
                <div className="flex flex-col items-center py-2">
                  <Info className="w-8 h-8 text-gray-400 mb-1" />
                  <p className="text-sm font-medium text-gray-700 mb-0.5">No Tracking Data Found</p>
                  <p className="text-xs text-gray-500">Tracking information might not be available yet. Please check back later.</p>
                </div>
              )}
              {/* Display Tracking Status if available */}
              {!isLoading && trackingStatus && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1 text-primary font-semibold text-sm">
                    <Info className="w-4 h-4" />
                    <span>{trackingStatus.summary || trackingStatus.status}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>Last Update: {formatDate(trackingStatus.lastUpdate)}</span>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-primary underline hover:text-primary/80 focus:outline-none mb-0.5 mt-1"
                    onClick={() => setShowMoreTrackingDetails((prev) => !prev)}
                    aria-expanded={showMoreTrackingDetails}
                  >
                    {showMoreTrackingDetails ? 'Hide Details' : 'Show Details'}
                  </button>
                  {showMoreTrackingDetails && (
                    <div className="space-y-1 border-t pt-2 mt-1">
                      {trackingStatus.details && (
                        <div className="flex items-start gap-1 text-xs text-gray-600">
                          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          <span>{trackingStatus.details}</span>
                        </div>
                      )}
                      {trackingStatus.location && (
                        <div className="flex items-start gap-1 text-xs text-gray-600">
                          <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          <span>{trackingStatus.location}</span>
                        </div>
                      )}
                      {/* Tracking History Section - only show when expanded and toggled */}
                      {trackingStatus.events && trackingStatus.events.length > 0 && (
                        <div className="mt-2 border-t pt-2">
                          <button
                            type="button"
                            className="text-xs text-primary underline hover:text-primary/80 focus:outline-none mb-1"
                            onClick={() => setShowTrackingHistory((prev) => !prev)}
                            aria-expanded={showTrackingHistory}
                          >
                            {showTrackingHistory ? 'Hide History' : `Show History (${trackingStatus.events.length})`}
                          </button>
                          {showTrackingHistory && (
                            <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                              {[...trackingStatus.events].reverse().map((event, index, reversedArray) => {
                                const locationString = event.location ? (typeof event.location === 'string' ? event.location : JSON.stringify(event.location)) : null;
                                return (
                                  <div key={event.id || index} className="relative pl-5 text-xs">
                                    {index !== reversedArray.length - 1 && (
                                      <div className="absolute left-[0.25rem] top-4 bottom-0 w-px bg-gray-200"></div>
                                    )}
                                    <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full border border-primary bg-white"></div>
                                    <div>
                                      <p className="font-medium text-gray-700">{event.status}</p>
                                      { locationString && (
                                        <div className="flex items-center space-x-1 text-gray-500">
                                          <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                          <span>{locationString}</span>
                                        </div>
                                      )}
                                      <p className="text-xxs text-gray-400">
                                        {formatDate(event.status_date)}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notification Setup Section (Rendered conditionally by renderNotificationSetup) */}
            {renderNotificationSetup(payButtonsRef)}
          </div>
        </div>
      </div>


    </>
  );
}