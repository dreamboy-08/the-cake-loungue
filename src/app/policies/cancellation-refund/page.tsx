import React from 'react';
import { Metadata } from 'next';
import PolicyLayout from '@/components/policies/PolicyLayout';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy — The Cake Lounge',
  description: 'Understand the cancellation and refund process at The Cake Lounge.',
  alternates: {
    canonical: '/policies/cancellation-refund',
  },
};

const CancellationRefund = () => {
  return (
    <PolicyLayout
      title="Cancellation & Refund"
      lastUpdated="January 15, 2024"
      breadcrumbs={[
        { label: 'Policies', href: '/policies' },
        { label: 'Cancellation & Refund' },
      ]}
    >
      <p>
        At The Cake Lounge, we strive to ensure every customer is delighted with their order.
        However, we understand that plans can change. Here is our policy regarding cancellations
        and refunds.
      </p>

      <h2>Order Cancellation</h2>
      <p>
        Cancellations are accepted based on the following timeline:
      </p>
      <ul>
        <li><strong>Standard Cakes:</strong> Cancellation requests must be made at least 24 hours before the scheduled delivery time.</li>
        <li><strong>Custom Cakes:</strong> Cancellation requests must be made at least 48 hours before the scheduled delivery time.</li>
      </ul>
      <p>
        To cancel an order, please contact us immediately at 77038 70170 with your order number.
      </p>

      <h2>Custom Cake Orders</h2>
      <p>
        Because custom cakes involve specialized ingredients, designs, and labor, cancellations made
        less than 48 hours before delivery may not be eligible for a full refund. A cancellation
        fee of 50% of the total order value may apply to cover costs already incurred.
      </p>

      <h2>Refund Eligibility</h2>
      <p>
        Refunds are issued under the following conditions:
      </p>
      <ul>
        <li>Orders cancelled within the permitted timeline.</li>
        <li>Delivery of the wrong product.</li>
        <li>Significant damage to the product during delivery (reported at the time of delivery).</li>
      </ul>

      <h2>Non-refundable Situations</h2>
      <p>
        We cannot offer refunds in the following situations:
      </p>
      <ul>
        <li>Incorrect delivery address provided by the customer.</li>
        <li>Unavailability of the recipient at the time of delivery.</li>
        <li>Cancellations made after the permitted timeline.</li>
        <li>Minor variations in design or color as each cake is handcrafted.</li>
        <li>Dissatisfaction with taste (as taste is subjective).</li>
      </ul>

      <h2>Refund Timeline</h2>
      <p>
        Once a refund is approved, it will be processed within 5-7 business days.
        The amount will be credited back to the original payment method used during the purchase.
        Please note that it may take additional time for your bank or card issuer to reflect the
        transaction in your account.
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

export default CancellationRefund;
