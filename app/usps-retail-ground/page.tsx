import { Metadata } from 'next';
import USPSServicePage from '../components/USPSServicePage';
import Header from '../_components/Header';

export const metadata: Metadata = {
  title: 'USPS Retail Ground Shipping & Tracking | Notify Track',
  description: 'Ship packages economically with USPS Retail Ground. Affordable shipping for larger packages with tracking included.',
  keywords: ['USPS Retail Ground', 'ground shipping', 'economical shipping', 'package delivery', 'large package shipping'],
  openGraph: {
    title: 'USPS Retail Ground Shipping & Tracking | Notify Track',
    description: 'Ship packages economically with USPS Retail Ground. Affordable shipping for larger packages with tracking included.',
    url: 'https://notifytrack.com/usps-retail-ground',
    type: 'website',
  }
};

export default function USPSRetailGroundPage() {
  const features = [
    'Economical shipping for packages',
    'Available for packages up to 70 lbs',
    'No size restrictions (up to 130 inches in combined length and girth)',
    'Tracking included at no additional cost',
    'Delivery to all U.S. addresses, including PO Boxes and military addresses',
    'Ideal for shipping larger or heavier items',
    'Prices based on weight and distance',
    'Free package pickup available'
  ];

  const faqs = [
    {
      question: 'What is USPS Retail Ground?',
      answer: 'USPS Retail Ground (formerly Standard Post) is an economical ground shipping service for packages, thick envelopes, and tubes that are not required to be mailed as First-Class Mail. It\'s ideal for larger or heavier packages up to 70 lbs and includes tracking.'
    },
    {
      question: 'How long does USPS Retail Ground take to deliver?',
      answer: 'USPS Retail Ground typically delivers in 2-8 business days, depending on the distance between the origin and destination. It\'s not the fastest shipping method but offers cost savings for packages that aren\'t time-sensitive.'
    },
    {
      question: 'What\'s the difference between USPS Retail Ground and Priority Mail?',
      answer: 'USPS Retail Ground is generally less expensive than Priority Mail but takes longer to deliver (2-8 days vs. 1-3 days for Priority Mail). Priority Mail also includes $100 of insurance, while Retail Ground does not automatically include insurance.'
    },
    {
      question: 'Does USPS Retail Ground include tracking?',
      answer: 'Yes, USPS Retail Ground includes tracking at no additional cost, allowing you to monitor your package\'s progress and confirm delivery.'
    },
    {
      question: 'Can I ship hazardous materials with USPS Retail Ground?',
      answer: 'Some hazardous materials that are not permitted in air transportation may be eligible for shipping via USPS Retail Ground, as it travels by ground transportation. However, strict regulations apply, and many hazardous materials are prohibited. Always check USPS guidelines or consult with a postal employee before shipping potentially hazardous items.'
    }
  ];

  return (
    <>
      <Header />
      <USPSServicePage
        title="USPS Retail Ground"
        description="Affordable shipping for packages that don't need to arrive quickly. USPS Retail Ground is a cost-effective option for heavier packages and oversized items."
        serviceType="Retail Ground"
        features={features}
        faqs={faqs}
        estimatedDelivery="2-8 business days"
        trackingAvailable={true}
        price="Starting at $8.50"
        imageUrl="/usps-retail-ground.png"
        carrier="USPS"
      />
    </>
  );
} 