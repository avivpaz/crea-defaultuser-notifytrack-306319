'use client';

import React, { useState } from 'react';
import { Subscription } from '../lib/db';
import { getTierDetailsByName } from './TrackingModal';

// Inline TierDetails and availableTiers

type TierName = 'Single Package' | 'monthly' | 'yearly';

interface TierDetails {
    name: TierName;
    price: string;
    priceSuffix: string;
    paypalPlanId: string | null;
    isMonthly: boolean;
    packageLimit: number;
}

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

interface ManagePlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialSubscription: Subscription | null;
    userId: number | null;
    trackingNumber: string;
    notificationType: 'email' | 'sms';
    contactInfo: string;
}

export default function ManagePlanModal({ isOpen, onClose, initialSubscription, userId }: ManagePlanModalProps) {
    const [currentTierData, setCurrentTierData] = useState<TierDetails | null>(
        initialSubscription ? availableTiers.find(t => t.name === initialSubscription.tier_name) || null : null
    );
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSwitchPlan = async (targetTier: TierDetails) => {
        if (!userId) return;
        setProcessing(true);
        setError(null);
        try {
            const response = await fetch('/api/user/switch-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, newTier: targetTier.name }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to switch plan');
            setCurrentTierData(targetTier);
        } catch (err: any) {
            setError(err.message || 'Failed to switch plan.');
        } finally {
            setProcessing(false);
        }
    };

    const handleCancelPlan = async () => {
        if (!userId) return;
        setProcessing(true);
        setError(null);
        try {
            const response = await fetch('/api/user/cancel-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to cancel subscription');
            setCurrentTierData(null);
        } catch (err: any) {
            setError(err.message || 'Failed to cancel subscription.');
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md min-w-[280px] sm:min-w-[380px] overflow-hidden">
                <div className="bg-primary text-white px-4 sm:px-6 py-4 flex justify-between items-center">
                    <h2 className="text-lg sm:text-xl font-semibold">Manage Plan</h2>
                    <button 
                        onClick={onClose} 
                        className="text-white/80 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        Ã
                    </button>
                </div>
                <div className="p-4 sm:p-6">
                    {currentTierData ? (
                        <div className="space-y-6">
                            <div className="border rounded-lg p-4 bg-primary/5">
                                <h3 className="text-lg font-semibold text-primary mb-2">Your Current Plan</h3>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-base font-bold text-primary">
                                        {currentTierData.name === 'monthly' ? 'Monthly Plan' : 'Yearly Plan'}
                                    </span>
                                    <span className="text-sm text-gray-600">{currentTierData.priceSuffix}</span>
                                </div>
                                <div className="text-sm text-gray-700 mb-1">
                                    Price: <span className="font-medium">${currentTierData.price}{currentTierData.priceSuffix}</span>
                                </div>
                                <div className="text-xs text-gray-500">You can change or cancel your plan below.</div>
                            </div>
                            <div className="flex flex-col gap-3">
                                {availableTiers.filter(t => t.name !== currentTierData.name).map(tier => (
                                    <button
                                        key={tier.name}
                                        className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-[#292952] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#333366] text-sm font-medium"
                                        onClick={() => handleSwitchPlan(tier)}
                                        disabled={processing}
                                    >
                                        Switch to {tier.name === 'monthly' ? 'Monthly' : 'Yearly'} Plan (${tier.price}{tier.priceSuffix})
                                    </button>
                                ))}
                                <button
                                    className="w-full px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-sm font-medium"
                                    onClick={handleCancelPlan}
                                    disabled={processing}
                                >
                                    {processing ? 'Cancelling...' : 'Cancel Plan'}
                                </button>
                            </div>
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-start">
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {availableTiers.map(tier => (
                                <button
                                    key={tier.name}
                                    className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-[#292952] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#333366] text-sm font-medium"
                                    onClick={() => handleSwitchPlan(tier)}
                                    disabled={processing}
                                >
                                    Subscribe to {tier.name === 'monthly' ? 'Monthly' : 'Yearly'} Plan (${tier.price}{tier.priceSuffix})
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 