import { Metadata } from 'next';
import USPSServicePage from '../components/USPSServicePage';
import Header from '../_components/Header';

export const metadata: Metadata = {
  title: 'USPS Media Mail Shipping & Tracking | Notify Track',
  description: 'Ship books, educational materials, and media at discounted rates with USPS Media Mail. Economical shipping for qualifying items.',
  keywords: ['USPS Media Mail', 'book shipping', 'educational materials', 'media shipping', 'affordable book delivery'],
  openGraph: {
    title: 'USPS Media Mail Shipping & Tracking | Notify Track',
    description: 'Ship books, educational materials, and media at discounted rates with USPS Media Mail. Economical shipping for qualifying items.',
    url: 'https://notifytrack.com/usps-media-mail',
    type: 'website',
  }
};

export default function USPSMediaMailPage() {
  const features = [
    'Economical shipping for qualifying media items',
    'Available for books, manuscripts, printed educational materials, and more',
    'No weight limit (up to 70 lbs)',
    'Tracking available for an additional fee',
    'Delivery throughout the United States, including territories and APO/FPO/DPO',
    'Subject to inspection to verify contents qualify for Media Mail rates',
    'Perfect for shipping books, educational materials, and media',
    'Free package pickup available'
  ];

  const faqs = [
    {
      question: 'What items qualify for USPS Media Mail?',
      answer: 'Media Mail is limited to books, sound recordings, recorded video tapes, printed music, recorded computer-readable media, manuscripts, play scripts, printed educational charts, loose-leaf pages and binders consisting of medical information, and 16mm or narrower width films. Items containing advertising do not qualify.'
    },
    {
      question: 'How long does Media Mail take to deliver?',
      answer: 'Media Mail typically takes 2-8 business days for delivery, depending on the distance. It\'s not the fastest shipping method, but it offers significant cost savings for eligible items.'
    },
    {
      question: 'Does Media Mail include tracking?',
      answer: 'Media Mail does not automatically include tracking, but you can add USPS Tracking for an additional fee. Adding tracking allows you to monitor your shipment\'s progress and confirm delivery.'
    },
    {
      question: 'Can Media Mail packages be inspected?',
      answer: 'Yes, Media Mail packages may be inspected by USPS to verify that the contents qualify for Media Mail rates. If non-qualifying items are found, the recipient may be charged the difference between Media Mail and Priority Mail rates.'
    },
    {
      question: 'Can I ship internationally with Media Mail?',
      answer: 'No, Media Mail is a domestic service only, available within the United States and to APO/FPO/DPO addresses. For international shipments of books and media, you\'ll need to use First-Class Mail International, Priority Mail International, or other international shipping services.'
    }
  ];

  return (
    <>
      <Header />
      <USPSServicePage
        title="USPS Media Mail"
        description="Send books, DVDs, CDs, and other educational materials at a discounted rate with USPS Media Mail. An affordable option for shipping media items."
        serviceType="Media Mail"
        features={features}
        faqs={faqs}
        estimatedDelivery="2-8 business days"
        trackingAvailable={false}
        price="Starting at $3.49"
        imageUrl="/usps-media-mail.png"
        carrier="USPS"
      />
    </>
  );
} 