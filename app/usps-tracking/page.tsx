import { Metadata } from 'next';
import USPSServicePage from '../components/USPSServicePage';
import Header from '../_components/Header';

export const metadata: Metadata = {
  title: 'USPS Tracking - Track Your USPS Packages | Notify Track',
  description: 'Get real-time updates on your USPS packages with our tracking service. Know exactly where your mail is and when it will arrive.',
  keywords: ['USPS tracking', 'package tracking', 'mail tracking', 'USPS delivery updates', 'track USPS package'],
  openGraph: {
    title: 'USPS Tracking - Track Your USPS Packages | Notify Track',
    description: 'Get real-time updates on your USPS packages with our tracking service. Know exactly where your mail is and when it will arrive.',
    url: 'https://notifytrack.com/usps-tracking',
    type: 'website',
  }
};

export default function USPSTrackingPage() {
  const features = [
    'Real-time package tracking for all USPS services',
    'Instant notifications for delivery status changes',
    'Comprehensive tracking history with detailed timestamps',
    'Accurate estimated delivery dates based on current status',
    'Immediate alerts for delivery exceptions or delays',
    'Easy tracking information sharing with recipients',
    'Multi-package tracking capabilities',
    '24/7 access to tracking information from any device'
  ];

  const faqs = [
    {
      question: 'How do I track my USPS package?',
      answer: 'Simply enter your USPS tracking number on our homepage to instantly access real-time updates on your package\'s location and status. You can also sign up for automated email or SMS notifications to stay informed.'
    },
    {
      question: 'What information can I see with USPS tracking?',
      answer: 'Our USPS tracking system provides detailed information including acceptance scans, processing updates, transit locations, delivery attempts, and final delivery confirmation. You\'ll see a complete timeline of your package\'s journey.'
    },
    {
      question: 'How long does USPS tracking information remain available?',
      answer: 'USPS tracking information is accessible for up to 120 days for domestic shipments and up to 90 days for international shipments after delivery or attempted delivery. We recommend saving tracking numbers for future reference.'
    },
    {
      question: 'Why isn\'t my tracking information updating?',
      answer: 'Tracking updates occur when your package reaches scanning points in the USPS network. Initial tracking may take 24-48 hours to appear, and during transit between facilities, there might be periods without updates. Rest assured, your package is still moving through the system.'
    },
    {
      question: 'Can I track international packages with USPS tracking?',
      answer: 'Yes, you can track international packages through USPS. While tracking coverage varies by destination country, our system provides the most up-to-date information available for your international shipment.'
    }
  ];

  return (
    <>
      <Header />
      <USPSServicePage
        title="USPS Tracking"
        description="Track your USPS packages and get real-time delivery updates. USPS Tracking provides visibility on your shipments from acceptance to delivery."
        serviceType="Tracking"
        features={features}
        faqs={faqs}
        estimatedDelivery="Depends on mail class"
        trackingAvailable={true}
        price="Included with most shipping services"
        imageUrl="/usps-tracking.png"
        carrier="USPS"
      />
    </>
  );
} 