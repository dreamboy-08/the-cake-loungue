import React from 'react';
import { Metadata } from 'next';
import PolicyLayout from '@/components/policies/PolicyLayout';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy — The Cake Lounge',
  description: 'Delivery areas, charges, and timelines for The Cake Lounge.',
  alternates: {
    canonical: '/policies/shipping-delivery',
  },
};

const ShippingDelivery = () => {
  return (
    <PolicyLayout
      title="Shipping & Delivery"
      lastUpdated="January 15, 2024"
      breadcrumbs={[
        { label: 'Policies', href: '/policies' },
        { label: 'Shipping & Delivery' },
      ]}
    >
      <p>
        We take great care in delivering our freshly baked creations to your doorstep.
        Please review our shipping and delivery practices below.
      </p>

      <h2>Delivery Areas</h2>
      <p>
        We currently deliver across Gurugram, Haryana. Specific areas covered include:
      </p>
      <ul>
        <li>DLF Phases 1–5</li>
        <li>Sectors 24, 25, 43, 56, and surroundings</li>
        <li>Golf Course Road & Extension</li>
        <li>Sohna Road</li>
      </ul>
      <p>
        If you are unsure whether we deliver to your location, please contact us before placing your order.
      </p>

      <h2>Delivery Charges</h2>
      <p>
        We offer free delivery on all orders above ₹499. For orders below this threshold,
        a standard delivery fee will be applied based on your location, which will be
        calculated at checkout.
      </p>

      <h2>Delivery Time</h2>
      <p>
        We deliver between 8:00 AM and 10:00 PM, 7 days a week. You can select your preferred
        delivery date during the checkout process. While we strive to meet requested time slots,
        exact delivery times cannot be guaranteed due to traffic and weather conditions.
      </p>

      <h2>Delivery Delays</h2>
      <p>
        In rare cases of extreme weather, heavy traffic, or unforeseen circumstances,
        delivery might be delayed. We will keep you informed of any significant delays.
        The Cake Lounge is not liable for delays beyond our reasonable control.
      </p>

      <h2>Delivery Instructions</h2>
      <p>
        Please provide accurate delivery instructions (apartment number, gate code, landmarks)
        during checkout. If the delivery is for a surprise, ensure the recipient is available
        or there is a secure place to leave the order.
      </p>

      <h2>Product Handling</h2>
      <p>
        Our cakes are delicate. Upon delivery, please check the product immediately.
        Once accepted, we recommend storing the cake in a cool, dry place or refrigerating it
        as advised on the packaging. We are not responsible for damage caused by improper
        handling after delivery.
      </p>

      <h2>Contact Information</h2>
      <p>
        <strong>The Cake Lounge</strong><br />
        Phone: 77038 70170<br />
        Email: thecakeloungegurgaon@gmail.com
      </p>
    </PolicyLayout>
  );
};

export default ShippingDelivery;
