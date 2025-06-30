import { Metadata } from 'next';
import USPSServicePage from '../components/USPSServicePage';
import Header from '../_components/Header';

export const metadata: Metadata = {
  title: 'USPS Certified Mail Service & Tracking | Notify Track',
  description: 'Send important documents securely with USPS Certified Mail. Get proof of mailing and delivery with tracking for legal and official correspondence.',
  keywords: ['USPS Certified Mail', 'proof of delivery', 'legal documents', 'official correspondence', 'mail tracking'],
  openGraph: {
    title: 'USPS Certified Mail Service & Tracking | Notify Track',
    description: 'Send important documents securely with USPS Certified Mail. Get proof of mailing and delivery with tracking for legal and official correspondence.',
    url: 'https://notifytrack.com/usps-certified-mail',
    type: 'website',
  }
};

export default function USPSCertifiedMailPage() {
  const features = [
    'Proof of mailing and delivery',
    'Tracking included from mailing to delivery',
    'Electronic verification of delivery or attempted delivery',
    'Record of delivery maintained by USPS for two years',
    'Perfect for legal documents, tax returns, and important correspondence',
    'Can be combined with Return Receipt for signature proof',
    'Available for First-Class Mail, Priority Mail, and Priority Mail Express',
    'Provides peace of mind for sending important documents'
  ];

  const faqs = [
    {
      question: 'What is USPS Certified Mail?',
      answer: 'USPS Certified Mail is a special service that provides the sender with a mailing receipt and electronic verification that an item was delivered or that a delivery attempt was made. It\'s commonly used for sending important documents like legal papers, tax returns, and official correspondence.'
    },
    {
      question: 'How does Certified Mail differ from regular mail?',
      answer: 'Unlike regular mail, Certified Mail provides proof of mailing at the time of mailing and a record of delivery. The USPS maintains a record of delivery (or attempted delivery) for two years, and you can verify this information electronically. Regular mail doesn\'t provide these tracking and verification features.'
    },
    {
      question: 'Do I need to use a special envelope for Certified Mail?',
      answer: 'No, you don\'t need a special envelope. Certified Mail is an add-on service that can be applied to First-Class Mail, Priority Mail, or Priority Mail Express. You\'ll need to fill out a Certified Mail form (PS Form 3800) or print a label with a tracking barcode.'
    },
    {
      question: 'What\'s the difference between Certified Mail and Registered Mail?',
      answer: 'Certified Mail provides proof of mailing and delivery, while Registered Mail offers maximum security with documented chain of custody and insurance for valuables. Registered Mail is more secure and expensive, providing protection for items with high monetary value, while Certified Mail is typically used for important documents where proof of delivery is needed.'
    },
    {
      question: 'Can I combine Certified Mail with other services?',
      answer: 'Yes, Certified Mail can be combined with other USPS services like Return Receipt (for signature proof of delivery), Restricted Delivery (to ensure only a specific person can receive the mail), or Adult Signature Required. Each additional service has its own fee.'
    }
  ];

  return (
    <>
      <Header />
      <USPSServicePage
        title="USPS Certified Mail"
        description="Proof of mailing and delivery for important documents with USPS Certified Mail. Get a receipt and tracking for your peace of mind."
        serviceType="Certified Mail"
        features={features}
        faqs={faqs}
        estimatedDelivery="2-5 business days"
        trackingAvailable={true}
        price="Starting at $4.15 (includes First-Class postage)"
        imageUrl="/usps-certified-mail.png"
        carrier="USPS"
      />
    </>
  );
} 