import { Metadata } from 'next';
import PoliciesContent from './PoliciesContent';

export const metadata: Metadata = {
  title: 'Our Policies | The Cake Lounge Gurgaon',
  description: 'View our Privacy Policy, Terms & Conditions, Cancellation & Refund, and Shipping policies. We believe in transparency and providing the best experience.',
  alternates: {
    canonical: 'https://thecakelounge.in/policies',
  },
  openGraph: {
    title: 'Our Policies | The Cake Lounge Gurgaon',
    description: 'View our Privacy Policy, Terms & Conditions, Cancellation & Refund, and Shipping policies.',
    url: 'https://thecakelounge.in/policies',
    siteName: 'The Cake Lounge',
    type: 'website',
  },
};

export default function PoliciesPage() {
  return <PoliciesContent />;
}
