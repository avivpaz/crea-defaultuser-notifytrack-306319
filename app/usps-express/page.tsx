import { Metadata } from 'next';
import USPSServicePage from '../components/USPSServicePage';
import Header from '../_components/Header';

export const metadata: Metadata = {
  title: 'USPS Priority Mail Express Shipping & Tracking | Notify Track',
  description: 'Get overnight delivery with USPS Priority Mail Express. The fastest USPS shipping option with guaranteed delivery times and tracking.',
  keywords: ['USPS Express Mail', 'overnight shipping', 'fastest USPS delivery', 'guaranteed delivery', 'Priority Mail Express'],
  openGraph: {
    title: 'USPS Priority Mail Express Shipping & Tracking | Notify Track',
    description: 'Get overnight delivery with USPS Priority Mail Express. The fastest USPS shipping option with guaranteed delivery times and tracking.',
    url: 'https://notifytrack.com/usps-express',
    type: 'website',
  }
};

export default function USPSExpressPage() {
  const features = [
    'Overnight delivery to most U.S. addresses',
    'Money-back guarantee for delayed shipments',
    'Delivery 365 days a year (including Sundays and holidays for an additional fee)',
    'Free tracking included',
    'Up to $100 of insurance included',
    'Signature confirmation available',
    'Available for packages up to 70 lbs',
    'Free package pickup available'
  ];

  const faqs = [
    {
      question: 'What is USPS Priority Mail Express?',
      answer: 'USPS Priority Mail Express is the fastest mail service offered by USPS, providing overnight delivery to most U.S. addresses. It includes tracking, insurance up to $100, and comes with a money-back guarantee if the package isn\'t delivered by the guaranteed time.'
    },
    {
      question: 'Is Priority Mail Express guaranteed?',
      answer: 'Yes, Priority Mail Express comes with a money-back guarantee if your shipment isn\'t delivered by the guaranteed time (typically 6:00 PM the next day). Some restrictions apply during peak seasons and for certain destinations.'
    },
    {
      question: 'Does Priority Mail Express deliver on weekends and holidays?',
      answer: 'Priority Mail Express delivers 365 days a year. Delivery on Sundays and holidays is available for an additional fee. Saturday delivery is included at no additional cost.'
    },
    {
      question: 'What\'s the difference between Priority Mail and Priority Mail Express?',
      answer: 'Priority Mail Express is faster, offering overnight to 2-day delivery with a money-back guarantee, while standard Priority Mail delivers in 1-3 business days without a guarantee. Express is more expensive but provides the fastest USPS delivery option.'
    },
    {
      question: 'Can I ship internationally with Priority Mail Express?',
      answer: 'For international shipments, USPS offers Priority Mail Express International, which provides expedited delivery to over 190 countries with tracking and insurance included. Delivery times vary by destination but typically range from 3-5 business days.'
    }
  ];

  return (
    <>
      <Header />
      <USPSServicePage
        title="USPS Express Mail"
        description="USPS Express Mail is the fastest mail service with overnight delivery to most destinations. Get your urgent documents and packages delivered quickly."
        serviceType="Express Mail"
        features={features}
        faqs={faqs}
        estimatedDelivery="Overnight to 2-Day"
        trackingAvailable={true}
        price="Starting at $28.75"
        imageUrl="/usps-express.png"
        carrier="USPS"
      />
    </>
  );
} 