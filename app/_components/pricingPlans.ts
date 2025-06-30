// Pricing plan definitions for reuse
export const oneTimePlan = {
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

export const monthlyPlan = {
  key: 'monthly',
  label: 'Monthly',
  price: '3.49',
  priceSuffix: '/month',
  benefits: [
    'Unlimited package tracking, any carrier.',
    'Instant SMS/email notifications.',
    'Cancel anytime, no hidden fees.'
  ],
  paypalPlanId: 'P-5XT02841GN163472XMQBCVNI',
  isMonthly: true,
};

export const yearlyPlan = {
  key: 'yearly',
  label: 'Yearly',
  price: (3.49 * 10).toFixed(2),
  priceSuffix: '/year',
  benefits: [
    'Late delivery cashback',
    '2 months free',
    'All monthly benefits included.'
  ],
  paypalPlanId: '',
  isMonthly: false
};

export const planOptions = [
  oneTimePlan,
  monthlyPlan,
  yearlyPlan
]; 