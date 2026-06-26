import React from 'react';
import { Metadata } from 'next';
import PolicyLayout from '@/components/policies/PolicyLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy — The Cake Lounge',
  description: 'Learn how The Cake Lounge collects, uses, and protects your personal information.',
  alternates: {
    canonical: '/policies/privacy-policy',
  },
};

const PrivacyPolicy = () => {
  return (
    <PolicyLayout
      title="Privacy Policy"
      breadcrumbs={[
        { label: 'Policies', href: '/policies' },
        { label: 'Privacy Policy' },
      ]}
    >
      <p>
        At The Cake Lounge, we value the trust you place in us when you share your personal information.
        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
        visit our website and use our services.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We collect information that you provide directly to us when you:
      </p>
      <ul>
        <li>Create an account or place an order</li>
        <li>Sign up for our newsletter</li>
        <li>Contact our customer support team</li>
        <li>Participate in surveys or promotions</li>
      </ul>
      <p>
        This information may include your name, email address, phone number, billing and shipping address,
        and payment information.
      </p>

      <h2>How We Use Information</h2>
      <p>
        We use the information we collect to:
      </p>
      <ul>
        <li>Process and fulfill your orders</li>
        <li>Send you order confirmations and shipping updates</li>
        <li>Communicate with you about products, services, and promotions</li>
        <li>Improve our website and customer service</li>
        <li>Prevent fraudulent transactions and enhance security</li>
      </ul>

      <h2>Payment Security</h2>
      <p>
        Your security is our priority. All payment transactions are processed through secure, encrypted
        payment gateways. We do not store your full credit card or debit card information on our servers.
        We comply with Payment Card Industry (PCI) standards to ensure your data is handled securely.
      </p>

      <h2>Data Protection</h2>
      <p>
        We implement a variety of security measures to maintain the safety of your personal information.
        We use administrative, technical, and physical security measures to help protect your personal
        information from unauthorized access, use, or disclosure.
      </p>

      <h2>Third Party Sharing</h2>
      <p>
        We do not sell, trade, or otherwise transfer your personally identifiable information to outside
        parties except in the following circumstances:
      </p>
      <ul>
        <li>To trusted third parties who assist us in operating our website, conducting our business,
        or servicing you (such as delivery partners and payment processors).</li>
        <li>When we believe release is appropriate to comply with the law or protect our rights.</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We use cookies to enhance your browsing experience, analyze site traffic, and understand where
        our visitors are coming from. You can choose to disable cookies through your individual browser
        options, but this may affect how you interact with our website.
      </p>

      <h2>Policy Updates</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect changes in our practices or for
        other operational, legal, or regulatory reasons. We will notify you of any significant changes
        by posting the new policy on this page.
      </p>

      <h2>Contact Information</h2>
      <p>
        If you have questions or comments about this Privacy Policy, please contact us at:
      </p>
      <p>
        <strong>The Cake Lounge</strong><br />
        Phone: 77038 70170<br />
        Email: thecakeloungegurgaon@gmail.com
      </p>
    </PolicyLayout>
  );
};

export default PrivacyPolicy;
