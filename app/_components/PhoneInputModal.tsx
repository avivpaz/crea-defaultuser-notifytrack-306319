'use client';

import { useState } from 'react';
import { X, Mail, Phone, Info, Loader2, Zap } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { TierDetails } from '../_types/tiers';

interface SubscriptionLookupFormData {
    contactInfo: string;
    contactType: 'email' | 'sms';
}

interface PhoneInputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (tierDetails: TierDetails | null, userId: number | null) => void; // Callback on successful fetch
    trackingNumber: string; // Add trackingNumber prop
}

type TierName = 'Single Package' | 'monthly' | 'yearly';

const availableTiers: TierDetails[] = [
    {
        name: 'monthly',
        price: '3.49',
        priceSuffix: '/month',
        paypalPlanId: process.env.NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID || 'P-5XT02841GN163472XMQBCVNI',
        isMonthly: true,
        packageLimit: -1,
    },
    {
        name: 'yearly',
        price: (3.49 * 10).toFixed(2),
        priceSuffix: '/year',
        paypalPlanId: process.env.NEXT_PUBLIC_PAYPAL_PRO_YEARLY_PLAN_ID || '',
        isMonthly: false,
        packageLimit: -1,
    },
];

export default function PhoneInputModal({ isOpen, onClose, onSuccess, trackingNumber }: PhoneInputModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [contactType, setContactType] = useState<'email' | 'sms'>('sms');
    const [userData, setUserData] = useState<{userId: number | null, contactInfo: string, contactType: 'email' | 'sms'} | null>(null);
    const [currentTierData, setCurrentTierData] = useState<TierDetails | null>(null);
    const [processing, setProcessing] = useState(false);
    const [showPayPalModal, setShowPayPalModal] = useState(false);
    const [selectedTier, setSelectedTier] = useState<TierDetails | null>(null);
    const [subscriptionDbId, setSubscriptionDbId] = useState<number | null>(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<SubscriptionLookupFormData>({
        defaultValues: {
            contactInfo: '',
            contactType: 'sms' as const,
        },
    });

    const watchContactType = watch('contactType');

    const handleFormSubmit = async (data: { contactInfo: string; contactType: 'email' | 'sms' }) => {
        try {
            setIsLoading(true);
            setError(null);
            await onSubmit(data);
            reset();
        } catch (error) {
            setError((error as Error).message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getTierDetailsByName = (name: string): TierDetails | null => {
        return availableTiers.find(tier => tier.name === name) || null;
    };

    const onSubmit = async (data: { contactInfo: string; contactType: 'email' | 'sms' }) => {
        try {
            const response = await fetch('/api/user/subscription-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    contactInfo: data.contactInfo, 
                    contactType: data.contactType 
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to fetch subscription status');
            }
            setUserData({
                userId: result.userId,
                contactInfo: data.contactInfo,
                contactType: data.contactType
            });
            setCurrentTierData(result.currentTier ? getTierDetailsByName(result.currentTier.name) : null);
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
        }
    };

    const handleNotificationTypeChange = (type: 'email' | 'sms') => {
        setValue('contactType', type);
        setContactType(type);
        setValue('contactInfo', '');
    };

    const handleSwitchPlan = (targetTier: TierDetails) => {
        setSelectedTier(targetTier);
        setShowPayPalModal(true);
    };

    const handleCancelPlan = async () => {
        if (!userData?.userId) return;
        setShowCancelConfirm(false);
        setProcessing(true);
        setError(null);
        try {
            const response = await fetch('/api/subscription/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userData.userId }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to cancel subscription');
            setCurrentTierData(null);
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to cancel subscription.');
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md min-w-[280px] sm:min-w-[380px] overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary text-white px-4 sm:px-6 py-4 flex justify-between items-center">
                        <h2 className="text-lg sm:text-xl font-semibold">Manage Plan</h2>
                        <button 
                            onClick={() => {
                                reset();
                                setError(null);
                                setUserData(null);
                                setCurrentTierData(null);
                                setProcessing(false);
                                setContactType('sms');
                                onClose();
                            }} 
                            className="text-white/80 hover:text-white transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="p-4 sm:p-6">
                        {/* Show plan cards if userData and currentTierData exist */}
                        {userData && currentTierData ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    {availableTiers.map(tier => {
                                        const isCurrent = tier.name === currentTierData.name;
                                        return (
                                            <div
                                                key={tier.name}
                                                className={`relative flex flex-col p-4 border-2 rounded-lg transition-all ${isCurrent ? 'border-primary bg-primary/5 shadow-sm ring-2 ring-primary' : 'border-gray-200 hover:border-primary/50'}${/* Remove yearly ring-yellow-400 */''}`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="text-lg font-bold text-primary">{tier.name === 'monthly' ? 'Monthly Plan' : 'Yearly Plan'}</div>
                                                    {isCurrent && <span className="text-xs font-bold text-primary">Current</span>}
                                                    {tier.name === 'yearly' && (
                                                        <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded shadow">Best Value</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <span className="text-2xl font-bold text-primary mr-2">${tier.price}</span>
                                                    <span className="text-xs text-gray-500 align-top">{tier.priceSuffix}</span>
                                                </div>
                                                <ul className="text-sm text-gray-700 mb-2 list-disc pl-5">
                                                    {tier.name === 'monthly' ? (
                                                        <>
                                                            <li>Unlimited package tracking, any carrier.</li>
                                                            <li>Instant SMS/email notifications.</li>
                                                            <li>Cancel anytime, no hidden fees.</li>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <li>2 months free</li>
                                                            <li>All monthly benefits included.</li>
                                                        </>
                                                    )}
                                                </ul>
                                                {!isCurrent && (
                                                    <button
                                                        className="mt-2 w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-[#292952] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#333366] text-sm font-medium"
                                                        onClick={() => handleSwitchPlan(tier)}
                                                        disabled={processing}
                                                    >
                                                        Switch to {tier.name === 'monthly' ? 'Monthly' : 'Yearly'} Plan
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <button
                                    className="w-full px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-sm font-medium"
                                    onClick={() => setShowCancelConfirm(true)}
                                    disabled={processing}
                                >
                                    {processing ? 'Cancelling...' : 'Cancel Plan'}
                                </button>
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-start">
                                        <Info className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}
                            </div>
                        ) : userData && !currentTierData ? (
                            <div className="flex flex-col items-center justify-center min-h-[180px]">
                                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-gray-700 text-lg font-semibold text-center mb-2">No active plan found</p>
                                <p className="text-gray-500 text-sm text-center">You do not have an active subscription plan.</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-700 mb-4 text-sm sm:text-base">
                                    Enter your contact information to check if you have an active subscription.
                                </p>
                                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Type</label>
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <label
                                                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                    watchContactType === "sms"
                                                        ? "border-[#333366] bg-[#333366]/5 shadow-sm"
                                                        : "border-gray-200 hover:border-[#333366]/50"
                                                }`}
                                                htmlFor="sms-radio"
                                            >
                                                <input
                                                    id="sms-radio"
                                                    type="radio"
                                                    value="sms"
                                                    className="w-4 h-4 text-[#333366] border-gray-300 focus:ring-[#333366]"
                                                    checked={watchContactType === 'sms'}
                                                    {...register('contactType')}
                                                    onChange={() => handleNotificationTypeChange('sms')}
                                                />
                                                <div className="ml-3">
                                                    <div className="flex items-center text-base font-medium text-gray-900">
                                                        <Phone className="w-4 h-4 mr-2 text-[#333366]" />
                                                        SMS
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">Real-time alerts via text</div>
                                                </div>
                                            </label>
                                            <label
                                                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                    watchContactType === "email"
                                                        ? "border-[#333366] bg-[#333366]/5 shadow-sm"
                                                        : "border-gray-200 hover:border-[#333366]/50"
                                                }`}
                                                htmlFor="email-radio"
                                            >
                                                <input
                                                    id="email-radio"
                                                    type="radio"
                                                    value="email"
                                                    className="w-4 h-4 text-[#333366] border-gray-300 focus:ring-[#333366]"
                                                    checked={watchContactType === 'email'}
                                                    {...register('contactType')}
                                                    onChange={() => handleNotificationTypeChange('email')}
                                                />
                                                <div className="ml-3">
                                                    <div className="flex items-center text-base font-medium text-gray-900">
                                                        <Mail className="w-4 h-4 mr-2 text-[#333366]" />
                                                        Email
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">Instant updates to your inbox</div>
                                                </div>
                                            </label>
                                        </div>
                                        <div>
                                            <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">
                                                {watchContactType === 'sms' ? 'Phone Number' : 'Email Address'}
                                            </label>
                                            <input
                                                id="contactInfo"
                                                type={watchContactType === 'email' ? 'email' : 'tel'}
                                                placeholder={watchContactType === 'email' ? 'email@example.com' : '(555) 123-4567'}
                                                className={`w-full px-3 py-2 border text-gray-900 ${ 
                                                    errors.contactInfo ? 'border-red-500' : 'border-gray-300'
                                                } rounded-md focus:outline-none focus:ring-1 focus:ring-[#333366] focus:border-[#333366]`}
                                                {...register('contactInfo', {
                                                    required: 'This field is required',
                                                    pattern: watchContactType === 'email' 
                                                        ? {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: 'Invalid email address',
                                                        }
                                                        : {
                                                            value: /^[\d\s\-\+\(\)]{10,15}$/,
                                                            message: 'Invalid phone number',
                                                        },
                                                })}
                                            />
                                            {errors.contactInfo && (
                                                <p className="mt-1 text-red-500 text-xs">{errors.contactInfo.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-start">
                                            <Info className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                                            <span>{error}</span>
                                        </div>
                                    )}
                                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-[#292952] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#333366] text-sm flex items-center justify-center min-w-[90px] w-full sm:w-auto"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                                    Checking...
                                                </>
                                            ) : (
                                                'Check'
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#333366] text-sm w-full sm:w-auto"
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                        {showPayPalModal && selectedTier && userData && (
                            <div className="mt-4">
                                <PayPalButtons
                                    key={selectedTier.name}
                                    style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'subscribe', tagline: false }}
                                    createSubscription={async () => {
                                        setError(null);
                                        setProcessing(true);
                                        try {
                                            const response = await fetch('/api/payment/create-reference', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    price: selectedTier.price,
                                                    planType: selectedTier.name, // 'monthly' or 'yearly'
                                                    paypalPlanId: selectedTier.paypalPlanId,
                                                    packageLimit: selectedTier.packageLimit,
                                                    userId: userData.userId,
                                                    trackingNumber: trackingNumber, // Use the prop
                                                    notificationType: userData.contactType, // Use contactType as notificationType
                                                    contactInfo: userData.contactInfo, // Use contactInfo
                                                    cancelPreviousPayPalSubId: currentTierData?.paypalPlanId || null,
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
                                    }}
                                    onApprove={async (data) => {
                                        setError(null);
                                        setProcessing(true);
                                        try {
                                            const response = await fetch('/api/subscription/activate', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    subscriptionId: subscriptionDbId,
                                                    paypalSubscriptionId: data.subscriptionID,
                                                    userId: userData.userId,
                                                }),
                                            });
                                            const responseData = await response.json();
                                            if (!response.ok) throw new Error(responseData.message || 'Failed to activate subscription');
                                            setShowPayPalModal(false);
                                            setCurrentTierData(selectedTier);
                                            setShowSuccessMessage(true);
                                            setTimeout(() => setShowSuccessMessage(false), 3000);
                                        } catch (err) {
                                            setError(err instanceof Error ? err.message : 'Failed to finalize payment.');
                                        } finally {
                                            setProcessing(false);
                                        }
                                    }}
                                    onError={(err) => {
                                        setError('An error occurred with the PayPal payment process. Please try again.');
                                        setProcessing(false);
                                    }}
                                    onCancel={() => {
                                        setError('Payment was cancelled.');
                                        setProcessing(false);
                                    }}
                                />
                                {error && <div className="mt-3 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">{error}</div>}
                            </div>
                        )}
                        {showCancelConfirm && (
                            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40">
                                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                                    <h3 className="text-lg font-semibold mb-2">Cancel Subscription</h3>
                                    <p className="mb-4 text-gray-700">Are you sure you want to cancel your subscription? This action cannot be undone.</p>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                            onClick={() => setShowCancelConfirm(false)}
                                            disabled={processing}
                                        >
                                            No, Keep Plan
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                            onClick={handleCancelPlan}
                                            disabled={processing}
                                        >
                                            Yes, Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {showSuccessMessage && (
                            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40">
                                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
                                    <h3 className="text-lg font-semibold mb-2 text-green-700">Success!</h3>
                                    <p className="text-gray-700">Your subscription has been updated successfully.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
} 