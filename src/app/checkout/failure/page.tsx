"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, AlertCircle, RefreshCcw, ArrowLeft, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BackButton from '@/components/BackButton';
import PageWrapper from '@/components/PageWrapper';

const FailureContent = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'The payment was unsuccessful or cancelled.';

  return (
    <PageWrapper>
      <div className="container mx-auto px-6 max-w-2xl">
        <BackButton className="mb-8" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border-2 border-red-50 text-center"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 text-red-600">
            <XCircle className="w-10 h-10 md:w-16 md:h-16" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-playfair text-chocolate mb-4">Payment Failed</h1>
          <p className="text-text-soft text-lg mb-8">
            We couldn&apos;t process your payment at this time.
          </p>

          <div className="bg-red-50/50 p-6 rounded-3xl border border-red-100 text-left mb-10">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 shrink-0 mt-1" size={20} />
              <div>
                <p className="text-sm font-bold text-red-900 uppercase tracking-widest mb-1">Error Message</p>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/checkout"
              className="flex items-center justify-center gap-3 w-full py-5 bg-chocolate text-white rounded-[22px] font-bold text-lg shadow-xl hover:bg-brown transition-all group"
            >
              <RefreshCcw size={24} className="group-hover:rotate-180 transition-transform duration-500" />
              Try Checkout Again
            </Link>

            <Link
              href="/menu"
              className="flex items-center justify-center gap-2 w-full py-4 text-chocolate font-bold hover:text-rose-deep transition-colors"
            >
              <ArrowLeft size={20} />
              Return to Menu
            </Link>
          </div>
        </motion.div>

        <div className="mt-12 bg-white  rounded-[30px] p-8 border border-white/50">
          <h3 className="text-xl font-bold text-chocolate mb-6 flex items-center gap-2">
            <HelpCircle className="text-rose-deep" size={24} />
            Common Payment Issues
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <p className="font-bold text-chocolate">Insufficient Funds</p>
              <p className="text-text-soft">Check your account balance or credit limit before trying again.</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-chocolate">Incorrect Details</p>
              <p className="text-text-soft">Ensure your card number, CVV, and expiry date are entered correctly.</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-chocolate">Bank Decline</p>
              <p className="text-text-soft">Sometimes banks block online transactions for security. Contact your bank.</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-chocolate">Network Error</p>
              <p className="text-text-soft">A weak internet connection can interrupt the payment process.</p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const FailurePage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-deep"></div>
      </div>
    }>
      <FailureContent />
    </Suspense>
  );
};

export default FailurePage;
