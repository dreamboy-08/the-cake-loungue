"use client";

import React from 'react';
import { Shield, FileText, RefreshCcw, Truck } from 'lucide-react';
import PolicyCard from '@/components/policies/PolicyCard';
import { motion } from 'framer-motion';
import BackButton from '@/components/BackButton';
import { CONTACT_INFO } from '@/constants/contact';

const PoliciesContent = () => {
  const policies = [
    {
      title: "Privacy Policy",
      description: "Learn how we collect, use, and protect your personal information and data.",
      href: "/policies/privacy-policy",
      icon: Shield
    },
    {
      title: "Terms & Conditions",
      description: "Our general rules and guidelines for using our website and purchasing our products.",
      href: "/policies/terms-and-conditions",
      icon: FileText
    },
    {
      title: "Cancellation & Refund",
      description: "Information about how to cancel orders and our policies regarding refunds.",
      href: "/policies/cancellation-refund",
      icon: RefreshCcw
    },
    {
      title: "Shipping & Delivery",
      description: "Details about delivery areas, charges, timelines, and how we handle shipping.",
      href: "/policies/shipping-delivery",
      icon: Truck
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto mb-8">
          <BackButton />
        </div>
        <header className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-label"
          >
            Legal & Information
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-title mb-6"
          >
            Our Policies
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-soft text-lg"
          >
            We believe in transparency and want to ensure you have the best experience with Cake Lounge.
            Please review our policies below.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {policies.map((policy, index) => (
            <PolicyCard
              key={policy.href}
              title={policy.title}
              description={policy.description}
              href={policy.href}
              icon={policy.icon}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 p-10 bg-white rounded-2xl shadow-sm border border-cream text-center max-w-3xl mx-auto"
        >
          <h2 className="font-playfair text-2xl font-bold text-chocolate mb-4">Need help understanding our policies?</h2>
          <p className="text-text-mid mb-8">
            Our team is here to answer any questions you might have about our terms, shipping, or privacy practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${CONTACT_INFO.whatsapp}`}
              className="btn btn-primary"
            >
              Call Support
            </a>
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="btn btn-outline border-rose-deep text-rose-deep hover:bg-rose-deep hover:text-white"
            >
              Email Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PoliciesContent;
