import { Metadata } from 'next';
import USPSServicePage from '../components/USPSServicePage';
import Header from '../_components/Header';

export const metadata: Metadata = {
  title: 'USPS International Shipping & Tracking | Notify Track',
  description: 'Send packages worldwide with USPS International shipping services. Track your international shipments and get delivery notifications.',
  keywords: ['USPS international', 'international shipping', 'global mail', 'USPS worldwide', 'international package tracking'],
  openGraph: {
    title: 'USPS International Shipping & Tracking | Notify Track',
    description: 'Send packages worldwide with USPS International shipping services. Track your international shipments and get delivery notifications.',
    url: 'https://notifytrack.com/usps-international',
    type: 'website',
  }
};

export default function USPSInternationalPage() {
  const features = [
    'Ship to over 190 countries worldwide',
    'Multiple service options for different speed and budget needs',
    'End-to-end tracking for most international destinations',
    'Customs forms assistance and international shipping regulations guidance',
    'Insurance options for valuable shipments',
    'Delivery confirmation for many destinations',
    'Competitive rates for international shipping',
    'Free package pickup available with certain services'
  ];

  const faqs = [
    {
      question: 'What USPS international shipping options are available?',
      answer: 'USPS offers several international shipping options including Global Express Guaranteed, Priority Mail Express International, Priority Mail International, First-Class Mail International, and USPS Ground Advantage International.'
    },
    {
      question: 'How long does USPS international shipping take?',
      answer: 'Delivery times vary by destination and service. Global Express Guaranteed delivers in 1-3 business days, Priority Mail Express International in 3-5 business days, Priority Mail International in 6-10 business days, and First-Class Mail International in 1-4 weeks.'
    },
    {
      question: 'Can I track my international package?',
      answer: 'Yes, most USPS international services include tracking. However, tracking detail varies by destination country, with some countries providing more limited tracking information than others.'
    },
    {
      question: 'What customs forms do I need for international shipping?',
      answer: 'For most international shipments, you\'ll need to complete customs forms declaring the contents and value. The specific form depends on the value of the contents and the service used. Common forms include the CN22 for items under $400 and the CN23 for items over $400.'
    },
    {
      question: 'Are there restrictions on what I can ship internationally?',
      answer: 'Yes, each country has its own import restrictions and prohibitions. Common restricted items include perishables, liquids, batteries, and flammable items. Additionally, some countries have specific cultural or religious restrictions. Always check the destination country\'s restrictions before shipping.'
    }
  ];

  return (
    <>
      <Header />
      <USPSServicePage
        title="USPS International Mail"
        description="Send packages and documents worldwide with USPS International Mail services. Reliable global shipping with tracking and delivery confirmation."
        serviceType="International Mail"
        features={features}
        faqs={faqs}
        estimatedDelivery="Varies by destination (1-3 weeks typical)"
        trackingAvailable={true}
        price="Starting at $1.40 for postcards, $15.50 for packages"
        imageUrl="/usps-international.png"
        carrier="USPS"
      />
    </>
  );
} 