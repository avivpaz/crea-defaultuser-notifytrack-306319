import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-white">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: March 2025</p>
      <p className="mb-8 text-gray-700">Welcome to NotifyTracking. By using our service, you agree to these Terms of Service. If you do not agree, please do not use our service.</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Service Overview</h2>
        <p className="mb-4 text-gray-700">NotifyTracking provides package tracking notifications via email or SMS based on tracking updates from third-party carriers, currently including USPS.</p>
        <p className="mb-4 text-gray-700">We do not ship or handle packages ourselves.</p>
        <p className="mb-4 text-gray-700">All tracking information comes from official USPS APIs and may be expanded in the future.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">2. User Responsibilities</h2>
        <p className="mb-4 text-gray-700">Users must provide accurate tracking numbers and valid contact information (email or phone number).</p>
        <p className="mb-4 text-gray-700">Users may only track packages they own or have permission to track.</p>
        <p className="mb-4 text-gray-700">Any attempt to misuse, manipulate, or disrupt the service will result in a ban from future use.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Payment & Pricing</h2>
        <p className="mb-4 text-gray-700">Users pay a one-time fee per tracking request via PayPal or credit card through PayPal's secure payment gateway.</p>
        <p className="mb-4 text-gray-700">Pricing is displayed before purchase and may change based on the level of service selected.</p>
        <p className="mb-4 text-gray-700">NotifyTracking also offers monthly subscription plans that include tracking multiple packages.</p>
        <p className="mb-4 text-gray-700">Taxes may be added where applicable.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Refund Policy</h2>
        <p className="mb-4 text-gray-700">Payments are non-refundable due to the low-cost nature of the service and reliance on third-party data.</p>
        <p className="mb-4 text-gray-700">Users can contact contact@notifytracking.com in case of disputes.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Service Limitations & Third-Party Dependencies</h2>
        <p className="mb-4 text-gray-700">NotifyTracking does not guarantee the accuracy or timeliness of notifications, as they depend on third-party services.</p>
        <p className="mb-4 text-gray-700">NotifyTracking is not affiliated with USPS or any other carrier.</p>
        <p className="mb-4 text-gray-700">The service may experience downtime or interruptions due to maintenance or technical issues.</p>
        <p className="mb-4 text-gray-700">We are not responsible for lost, stolen, or misdelivered packages.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Liability & Indemnification</h2>
        <p className="mb-4 text-gray-700">NotifyTracking is not liable for damages, losses, or issues caused by incorrect or delayed tracking updates.</p>
        <p className="mb-4 text-gray-700">Users agree to indemnify and hold NotifyTracking harmless from any claims arising from misuse of the service.</p>
        <p className="mb-4 text-gray-700">NotifyTracking's maximum liability is limited to the amount paid for the service.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Account Termination & Service Suspension</h2>
        <p className="mb-4 text-gray-700">NotifyTracking may block a user's email/phone number from future use if they violate these Terms.</p>
        <p className="mb-4 text-gray-700">NotifyTracking reserves the right to terminate or suspend service at its discretion, with or without cause.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
        <p className="mb-4 text-gray-700">NotifyTracking owns all rights to its website, branding, and service.</p>
        <p className="mb-4 text-gray-700">Users may not copy, modify, or distribute any part of the service without permission.</p>
        <p className="mb-4 text-gray-700">NotifyTracking does not claim ownership of user-submitted tracking numbers or contact details, but retains the right to use them solely for providing the service.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Data Storage & Security</h2>
        <p className="mb-4 text-gray-700">User data is stored in a secure, encrypted environment with protections against misuse.</p>
        <p className="mb-4 text-gray-700">NotifyTracking does not sell or misuse user data and only uses it for delivering notifications.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
        <p className="mb-4 text-gray-700">NotifyTracking reserves the right to update these Terms at any time.</p>
        <p className="mb-4 text-gray-700">Users will be notified of significant changes through the website or email.</p>
        <p className="mb-4 text-gray-700">Continued use of the service after changes means acceptance of the updated Terms.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Dispute Resolution & Governing Law</h2>
        <p className="mb-4 text-gray-700">Disputes must first be resolved through binding arbitration.</p>
        <p className="mb-4 text-gray-700">If arbitration does not resolve the dispute, the issue will be handled exclusively in the courts of Israel under Israeli law.</p>
        <p className="mb-8 text-gray-700">For questions or support, please contact us at contact@notifytracking.com.</p>
        <p className="mb-4 text-gray-700">NotifyTracking reserves all rights.</p>
      </section>

      <p className="mt-12 text-center text-gray-700">Thank you for using NotifyTracking!</p>
    </div>
  );
} 