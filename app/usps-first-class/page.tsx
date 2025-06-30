import { Metadata } from 'next';
import USPSServicePage from '../components/USPSServicePage';
import Header from '../_components/Header';

export const metadata: Metadata = {
  title: 'USPS First-Class Mail & Package Service | Notify Track',
  description: 'Send letters, cards, and lightweight packages with USPS First-Class Mail. Affordable shipping with delivery in 1-5 business days.',
  keywords: ['USPS First-Class Mail', 'First-Class Package', 'affordable shipping', 'letter mail', 'lightweight packages'],
  openGraph: {
    title: 'USPS First-Class Mail & Package Service | Notify Track',
    description: 'Send letters, cards, and lightweight packages with USPS First-Class Mail. Affordable shipping with delivery in 1-5 business days.',
    url: 'https://notifytrack.com/usps-first-class',
    type: 'website',
  }
};

export default function USPSFirstClassPage() {
  const features = [
    'Delivery in 1-5 business days',
    'Tracking included for First-Class Package Service',
    'Affordable rates based on weight and distance',
    'Available for packages up to 13 oz',
    'Perfect for letters, cards, and lightweight packages',
    'No minimum volume requirements',
    'Delivery to PO Boxes, military addresses, and every U.S. address',
    'Free package pickup available for First-Class Package Service'
  ];

  const faqs = [
    {
      question: 'What is USPS First-Class Mail?',
      answer: 'USPS First-Class Mail is an affordable way to send standard-sized, single-piece envelopes and small packages weighing up to 13 ounces. It includes letters, postcards, and large envelopes (flats), with delivery typically in 1-5 business days.'
    },
    {
      question: 'What\'s the difference between First-Class Mail and First-Class Package Service?',
      answer: 'First-Class Mail is primarily for letters, cards, and flats, while First-Class Package Service is specifically for small packages. First-Class Package Service includes tracking, while standard First-Class Mail for letters does not automatically include tracking unless you purchase it as an add-on.'
    },
    {
      question: 'Does First-Class Mail include tracking?',
      answer: 'First-Class Mail letters and flats do not automatically include tracking. However, First-Class Package Service does include tracking. For letters and flats, you can add tracking by purchasing additional services like Certified Mail or adding USPS Tracking as an extra service.'
    },
    {
      question: 'How much does First-Class Mail cost?',
      answer: 'First-Class Mail starts at $0.68 for postcards, $0.73 for letters (as of 2023), and $1.53 for large envelopes. First-Class Package Service rates start around $4.75 and vary based on weight and distance. Prices are subject to change with USPS rate adjustments.'
    },
    {
      question: 'Can I ship internationally with First-Class Mail?',
      answer: 'Yes, USPS offers First-Class Mail International and First-Class Package International Service for sending letters, flats, and packages to other countries. Rates vary by destination and weight, with a maximum weight limit of 4 pounds for packages.'
    }
  ];

  return (
    <>
      <Header />
      <USPSServicePage
        title="USPS First-Class Mail"
        description="Send letters, cards, and lightweight packages affordably with USPS First-Class Mail. Get delivery in 1-5 business days nationwide."
        serviceType="First-Class Mail"
        features={features}
        faqs={faqs}
        estimatedDelivery="1-5 business days"
        trackingAvailable={true}
        price="Starting at $0.73 for letters, $4.75 for packages"
        imageUrl="/usps-first-class.png"
        carrier="USPS"
      />
    </>
  );
} 