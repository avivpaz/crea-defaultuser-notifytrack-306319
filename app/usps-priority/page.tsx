import { Metadata } from 'next';
import CarrierServicePage from '../components/CarrierServicePage';
import Header from '../_components/Header';

export const metadata: Metadata = {
  title: 'USPS Priority Mail Shipping & Tracking | Notify Track',
  description: 'Send packages quickly with USPS Priority Mail. Get delivery in 1-3 business days with tracking and insurance included.',
  keywords: ['USPS Priority Mail', 'fast shipping', 'package delivery', 'USPS 1-3 day shipping', 'Priority Mail tracking'],
  openGraph: {
    title: 'USPS Priority Mail Shipping & Tracking | Notify Track',
    description: 'Send packages quickly with USPS Priority Mail. Get delivery in 1-3 business days with tracking and insurance included.',
    url: 'https://notifytrack.com/usps-priority',
    type: 'website',
  }
};

export default function USPSPriorityPage() {
  const features = [
    'Delivery in 1-3 business days (including Saturdays)',
    'Free tracking included',
    'Up to $100 of insurance included with most shipments',
    'Free flat-rate boxes and envelopes available',
    'No additional charge for residential delivery',
    'Available for packages up to 70 lbs',
    'Free package pickup available',
    'Delivery to PO Boxes, APO, FPO, and DPO destinations'
  ];

  const faqs = [
    {
      question: 'What is USPS Priority Mail?',
      answer: 'USPS Priority Mail is a fast domestic shipping service that delivers packages in 1-3 business days. It includes tracking, insurance up to $100, and offers flat-rate shipping options for predictable pricing regardless of weight (up to 70 lbs).'
    },
    {
      question: 'What are Priority Mail Flat Rate options?',
      answer: 'Priority Mail Flat Rate allows you to ship items in specially designated USPS-provided boxes and envelopes for a flat rate regardless of weight or domestic destination. Options include small, medium, and large boxes, as well as envelopes and padded envelopes.'
    },
    {
      question: 'Is insurance included with Priority Mail?',
      answer: 'Yes, most Priority Mail shipments include up to $100 of insurance against loss or damage at no additional charge. Additional insurance can be purchased for valuable items.'
    },
    {
      question: 'Can I ship internationally with Priority Mail?',
      answer: 'Priority Mail is a domestic service, but USPS offers Priority Mail International for global shipments. For international shipping, you\'ll need to use the appropriate international service and complete customs forms.'
    },
    {
      question: 'How do I get free Priority Mail supplies?',
      answer: 'USPS provides free Priority Mail packaging supplies, including boxes, envelopes, and labels. You can order these supplies online at the USPS website, pick them up at your local Post Office, or have them delivered to your address at no charge.'
    }
  ];

  const relatedServices = [
    {
      name: 'USPS Express Mail',
      path: '/usps-express'
    },
    {
      name: 'USPS First Class',
      path: '/usps-first-class'
    },
    {
      name: 'USPS International',
      path: '/usps-international'
    },
    {
      name: 'USPS Retail Ground',
      path: '/usps-retail-ground'
    }
  ];

  return (
    <>
      <Header />
      <CarrierServicePage
        title="USPS Priority Mail"
        description="Ship packages quickly and affordably with USPS Priority Mail. Get delivery in 1-3 business days with tracking and insurance included."
        serviceType="Priority Mail"
        features={features}
        faqs={faqs}
        estimatedDelivery="1-3 business days"
        trackingAvailable={true}
        price="Starting at $9.35"
        imageUrl="/usps-priority.png"
        carrier="USPS"
        relatedServices={relatedServices}
      />
    </>
  );
} 