import React from 'react';
import { Metadata } from 'next';
import PolicyLayout from '@/components/policies/PolicyLayout';

export const metadata: Metadata = {
  title: 'Terms & Conditions — The Cake Lounge',
  description: 'The general rules and guidelines for using The Cake Lounge website and services.',
  alternates: {
    canonical: '/policies/terms-and-conditions',
  },
};

const TermsAndConditions = () => {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      breadcrumbs={[
        { label: 'Policies', href: '/policies' },
        { label: 'Terms & Conditions' },
      ]}
    >
      <p>
        Welcome to The Cake Lounge. By accessing or using our website, you agree to be bound by these
        Terms and Conditions. Please read them carefully before using our services.
      </p>

      <h2>Orders</h2>
      <p>
        All orders placed through our website are subject to acceptance and availability.
        Standard cakes require a minimum of 1-day lead time, while custom cakes require 2 days.
        We reserve the right to refuse any order for any reason.
      </p>

      <h2>Pricing</h2>
      <p>
        Prices for our products are subject to change without notice. All prices are in Indian Rupees (INR).
        The price applicable to your order will be the price at the time you place your order.
      </p>

      <h2>Payments</h2>
      <p>
        Full payment is required at the time of ordering through our secure online payment system.
        We accept various payment methods including credit/debit cards, UPI, and net banking.
        Orders will not be processed until payment is confirmed.
      </p>

      <h2>Product Representation</h2>
      <p>
        We make every effort to display the colors and designs of our products as accurately as possible.
        However, as our cakes are handcrafted, slight variations in color and design may occur.
        The final product may differ slightly from the image shown on the website.
      </p>

      <h2>Delivery</h2>
      <p>
        Delivery will be made to the address specified by you at the time of ordering.
        It is your responsibility to ensure that someone is available to receive the delivery.
        If no one is available, we will attempt to contact you, but we cannot be held responsible
        for failed deliveries due to incorrect information or unavailability.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All content on this website, including text, graphics, logos, images, and software,
        is the property of The Cake Lounge and is protected by copyright and other intellectual
        property laws. You may not use any content without our express written permission.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        The Cake Lounge shall not be liable for any indirect, incidental, special, or consequential
        damages arising out of or in connection with the use of our products or website.
        Our total liability for any claim shall not exceed the amount paid for the product.
      </p>

      <h2>Governing Law</h2>
      <p>
        These Terms and Conditions shall be governed by and construed in accordance with the laws of
        India. Any disputes arising under or in connection with these terms shall be subject to
        the exclusive jurisdiction of the courts in Gurugram, Haryana.
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

export default TermsAndConditions;
