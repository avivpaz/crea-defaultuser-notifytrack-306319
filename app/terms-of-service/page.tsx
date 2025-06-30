import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | NotifyTracking',
  description: 'Terms of Service for NotifyTracking package tracking notification service.',
};

const TermsOfServicePage = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Effective Date: April 2025</p>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-6 text-gray-700">
              Welcome to NotifyTracking. By using our service, you agree to these Terms of Service. 
              If you do not agree, please do not use our service.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Service Overview</h2>
            <p className="mb-6 text-gray-700">
              The service is provided by Nevotech Innovation Ltd. - a private company incorporated in the state of Israel.
            </p>
            <p className="mb-6 text-gray-700">
              NotifyTracking provides package tracking notifications via email or SMS based on tracking updates 
              from third-party carriers, currently including USPS. We do not ship or handle packages ourselves. 
              All tracking information comes from official USPS APIs and may be expanded in the future.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. User Responsibilities</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Users must provide accurate tracking numbers and valid contact information (email or phone number).</li>
              <li>Users may only track packages they own or have permission to track.</li>
              <li>Any attempt to misuse, manipulate, or disrupt the service will result in a ban from future use.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Payment & Pricing</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Users pay a one-time fee per tracking request via PayPal or credit card through PayPal's secure payment gateway.</li>
              <li>Pricing is displayed before purchase and may change based on the level of service selected.</li>
              <li>NotifyTracking also offers monthly subscription plans that include tracking multiple packages.</li>
              <li>Taxes may be added where applicable.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Refund Policy</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Payments are non-refundable due to the low-cost nature of the service and reliance on third-party data.</li>
              <li>Users can contact contact@notifytracking.com in case of disputes.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Service Limitations & Third-Party Dependencies</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>NotifyTracking does not guarantee the accuracy or timeliness of notifications, as they depend on third-party services.</li>
              <li>NotifyTracking is not affiliated with USPS or any other carrier.</li>
              <li>The service may experience downtime or interruptions due to maintenance or technical issues.</li>
              <li>We are not responsible for lost, stolen, or misdelivered packages.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Liability & Indemnification</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>NotifyTracking is not liable for damages, losses, or issues caused by incorrect or delayed tracking updates.</li>
              <li>Users agree to indemnify and hold NotifyTracking harmless from any claims arising from misuse of the service.</li>
              <li>NotifyTracking's maximum liability is limited to the amount paid for the service.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Account Termination & Service Suspension</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>NotifyTracking may block a user's email/phone number from future use if they violate these Terms.</li>
              <li>NotifyTracking reserves the right to terminate or suspend service at its discretion, with or without cause.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Intellectual Property</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>NotifyTracking owns all rights to its website, branding, and service.</li>
              <li>Users may not copy, modify, or distribute any part of the service without permission.</li>
              <li>NotifyTracking does not claim ownership of user-submitted tracking numbers or contact details, but retains the right to use them solely for providing the service.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. Data Storage & Security</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>User data is stored in a secure, encrypted environment with protections against misuse.</li>
              <li>NotifyTracking does not sell or misuse user data and only uses it for delivering notifications.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. Changes to Terms</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>NotifyTracking reserves the right to update these Terms at any time.</li>
              <li>Users will be notified of significant changes through the website or email.</li>
              <li>Continued use of the service after changes means acceptance of the updated Terms.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">11. Dispute Resolution & Governing Law</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Disputes must first be resolved through binding arbitration.</li>
              <li>If arbitration does not resolve the dispute, the issue will be handled exclusively in the courts of Israel under Israeli law.</li>
              <li>For questions or support, please contact us at contact@notifytracking.com.</li>
            </ul>
            
            <p className="mt-10 mb-2 font-semibold text-gray-700">NotifyTracking reserves all rights.</p>
            <p className="text-lg text-gray-700">Thank you for using NotifyTracking!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage; 