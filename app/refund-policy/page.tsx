import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | NotifyTracking',
  description: 'Refund Policy for NotifyTracking package tracking notification service.',
};

const RefundPolicyPage = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Refund Policy</h1>
          <p className="text-gray-500 mb-8">Effective Date: May 2025</p>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-6 text-gray-700">
              At NotifyTracking, customer satisfaction is our priority. If you are not satisfied with your purchase, you may request a refund under the following conditions:
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. 14-Day Refund Window</h2>
            <p className="mb-6 text-gray-700">
              We offer a full refund for any purchase made through our platform if requested within 14 days of the transaction date.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Eligibility</h2>
            <p className="mb-4 text-gray-700">
              To be eligible for a refund:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>You must contact us within 14 days of your purchase.</li>
              <li>The refund request must include your order number and the reason for the request.</li>
              <li>The service must not have been fully consumed (i.e., if tracking updates were successfully delivered during this time, a partial refund or denial may apply).</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. How to Request a Refund</h2>
            <p className="mb-6 text-gray-700">
              To request a refund, email us at support@notifytracking.com with your order number and request. We will review and process eligible refunds within 5 business days.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Paddle's Buyer Terms Apply</h2>
            <p className="mb-6 text-gray-700">
              As NotifyTracking uses Paddle as its payment processor, all purchases are additionally subject to Paddle's Buyer Terms, which includes their 14-day refund policy for digital services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Refund Policy (Comprehensive)</h2>
            <p className="text-gray-500 mb-8">Effective Date: May 2025</p>
            <p className="mb-6 text-gray-700">
              At NotifyTracking, we strive to provide a simple, affordable, and helpful service that keeps you informed about your package status in real-time. However, we understand that sometimes things don't go as expected. This Refund Policy explains when and how you can request a refund for your purchase.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Refund Eligibility</h3>
            <p className="mb-4 text-gray-700">
              We offer refunds under the following conditions:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li><strong>Timeframe:</strong> You must request your refund within 14 days of the purchase date.</li>
              <li><strong>Type of Product:</strong> Refunds apply to both one-time notification purchases and subscriptions (monthly or yearly).</li>
              <li><strong>Usage:</strong> If the service has already been fully delivered (e.g., if a package has been fully tracked and delivered, with status updates sent), refund eligibility may be limited or denied. Partial refunds may be considered based on the level of usage.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. How to Request a Refund</h3>
            <p className="mb-4 text-gray-700">
              To request a refund, please contact us at support@notifytracking.com with the following details:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Your full name</li>
              <li>The email address or phone number used for the purchase</li>
              <li>Your Paddle order ID (found in your purchase confirmation)</li>
              <li>A brief explanation of why you are requesting a refund</li>
            </ul>
            <p className="mb-6 text-gray-700">
              Our team will review your request and typically respond within 2â3 business days. Approved refunds are processed via Paddle and may take a few additional days to appear on your payment method.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Subscriptions (Monthly / Yearly Plans)</h3>
            <p className="mb-4 text-gray-700">
              If you're subscribed to a recurring plan:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>You may cancel at any time, and your subscription will remain active until the end of the billing cycle.</li>
              <li>If your request for a refund is made within 14 days of your initial purchase or renewal, and you have not received significant usage of the service, we will honor a full or partial refund.</li>
              <li>Refunds are generally not issued for periods outside the 14-day window.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Payments & Processing</h3>
            <p className="mb-6 text-gray-700">
              All transactions on NotifyTracking are processed through our payment partner, Paddle. Therefore, our refund policy is also subject to Paddle's Buyer Terms. Paddle reserves the right to approve or decline refund requests as outlined in their terms.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Exceptions</h3>
            <p className="mb-4 text-gray-700">
              We reserve the right to deny refund requests in cases of:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Abuse of the service (e.g., repeated use of the service followed by refund claims)</li>
              <li>Fraudulent activity or suspected misuse</li>
              <li>Technical issues that originate from third-party tracking providers (such as USPS), where the issue is outside our control</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Need Help?</h3>
            <p className="mb-6 text-gray-700">
              We're here to support you. If you have any questions about your purchase, subscription, or refund eligibility, please contact us at contact@notifytracking.com.
            </p>
            
            <p className="mt-10 mb-2 font-semibold text-gray-700">NotifyTracking reserves all rights.</p>
            <p className="text-lg text-gray-700">Thank you for using NotifyTracking!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage; 