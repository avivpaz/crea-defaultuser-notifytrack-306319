// Shared types for subscription tiers

export type TierName = 'single' | 'monthly' | 'yearly' | 'Single Package' | 'Basic Plan' | 'Pro Plan';

export interface TierDetails {
    name: TierName;
    price: string;
    priceSuffix: string;
    paypalPlanId: string | null;
    isMonthly: boolean;
    packageLimit: number;
} 