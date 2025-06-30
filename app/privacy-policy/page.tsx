import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | NotifyTracking',
  description: 'Privacy Policy for NotifyTracking package tracking notification service.',
};

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Effective Date: March 2025</p>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-6 text-gray-700">
              NotifyTracking ("NotifyTracking," "we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, store, and protect your information when you use NotifyTracking.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Information We Collect</h2>
            <p className="mb-4 text-gray-700">
              We only collect the necessary information to provide our tracking notification service:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Tracking number (to track package status)</li>
              <li>Email or phone number (to send tracking updates)</li>
              <li>Payment status (we do not store payment details, only whether a tracking request has been paid for)</li>
            </ul>
            <p className="mb-6 text-gray-700">
              We do not collect or store payment details, IP addresses, or device information. We use third-party services, 
              such as PayPal for payments and Google Analytics and Clarity to improve user experience.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="mb-4 text-gray-700">
              We use the collected information strictly for the following purposes:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Sending package tracking notifications via email or SMS.</li>
              <li>Processing payments and confirming successful transactions.</li>
              <li>Improving user experience through Google Analytics and Clarity.</li>
              <li>Providing customer support and responding to inquiries.</li>
            </ul>
            <p className="mb-6 text-gray-700">
              NotifyTracking does not sell, rent, or trade user data to third parties. Your data is used only for delivering our services.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Data Sharing & Third-Party Services</h2>
            <p className="mb-4 text-gray-700">
              We may share your data only when necessary with:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Payment processors (PayPal) to handle transactions securely.</li>
              <li>Google Analytics and Clarity to track and analyze user experience.</li>
            </ul>
            <p className="mb-6 text-gray-700">
              We do not share tracking data with third parties beyond what is required for service functionality.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Data Storage & Security</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>All user data is encrypted at rest and in transit to prevent unauthorized access.</li>
              <li>Data is stored in a secure, encrypted environment and protected against misuse.</li>
              <li>Users can request data deletion by emailing contact@notifytracking.com.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Cookies & Tracking Technologies</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>NotifyTracking uses Google Analytics and Clarity to analyze user behavior and improve our service.</li>
              <li>We may use cookies and similar technologies for tracking purposes.</li>
              <li>Users can disable cookies through their browser settings.</li>
              <li>For more details, refer to Google Analytics' and Clarity's privacy policies.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Children's Privacy</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>NotifyTracking is not intended for children under 13.</li>
              <li>We do not knowingly collect information from minors.</li>
              <li>If a parent or guardian believes their child's data was submitted, they may request deletion via contact@notifytracking.com.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Changes to This Privacy Policy</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>NotifyTracking reserves the right to modify this Privacy Policy at any time.</li>
              <li>Updates will be posted on this page, and significant changes may be communicated via email.</li>
              <li>Continued use of the service after updates means acceptance of the revised Privacy Policy.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Contact Us</h2>
            <p className="mb-6 text-gray-700">
              For any privacy-related questions or requests, please contact us at contact@notifytracking.com.
            </p>
            
            <p className="mt-10 mb-2 font-semibold text-gray-700">NotifyTracking reserves all rights.</p>
            <p className="text-lg text-gray-700">Thank you for using NotifyTracking!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 