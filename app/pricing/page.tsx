import { planOptions } from '../_components/pricingPlans';
import Link from 'next/link';
import { DollarSign } from 'lucide-react';
import Header from '../_components/Header';

export default function PricingPage() {
  // Filter out the one-time plan (key: 'onetime')
  const subscriptionPlans = planOptions.filter(plan => plan.key !== 'onetime');
  return (
    <>
      <Header />
      {/* Hero Section */}
      <section className="w-full bg-white py-10 mb-8 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-primary mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-700 mb-2">
            Get real-time package tracking and instant notifications for all your shipments. Choose the plan that fits your needs and never miss a delivery update again.
          </p>
        </div>
      </section>
      <main className="bg-secondary flex flex-col items-center py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl justify-center">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.key}
              className="flex flex-col p-6 border-2 rounded-lg bg-white shadow-sm border-gray-200 hover:border-primary/50 transition-all relative"
            >
              <div className="text-lg font-bold text-primary text-center mb-1">{plan.label}</div>
              {plan.key === 'yearly' && (
                <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded shadow">Best Value</span>
              )}
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-primary mr-2">${plan.price}</span>
                <span className="text-xs text-gray-500 align-top">{plan.priceSuffix}</span>
              </div>
              <ul className="text-sm text-gray-700 mb-4 list-disc pl-5">
                {plan.benefits.map((benefit, index) => {
                  if (plan.key === 'yearly' && benefit.toLowerCase().includes('late delivery cashback')) {
                    return (
                      <li key={index} className="font-bold relative">
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          Late delivery cashback
                        </span>
                      </li>
                    );
                  }
                  if (plan.key === 'yearly' && benefit.toLowerCase().includes('2 months free')) {
                    return <li key={index} className="font-bold text-amber-800"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-semibold">2 months free</span></li>;
                  }
                  return <li key={index} className={plan.key === 'yearly' ? 'ml-1' : ''}>{benefit}</li>;
                })}
              </ul>
              <Link href="/" className="mt-auto w-full">
                <button className="w-full py-2 px-4 rounded-lg font-medium text-white bg-primary hover:bg-primary/90 text-sm transition-colors">
                  Start Tracking
                </button>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
} 