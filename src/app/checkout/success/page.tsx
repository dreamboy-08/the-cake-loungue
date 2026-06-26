"use client";

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, ShoppingBag, ArrowRight, Calendar, MapPin, Package } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BackButton from '@/components/BackButton';

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');
  const [orderDetails, setOrderDetails] = React.useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const { db } = await import('@/utils/firebase');
        const { doc, getDoc } = await import('firebase/firestore');
        const docRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrderDetails(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching order for success page:", error);
      }
    };
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    // If no orderId, redirect to orders after some time
    if (!orderId) {
      const timer = setTimeout(() => {
        router.push('/orders');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [orderId, router]);

  return (
    <div className="pt-32 md:pt-40 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6 max-w-2xl">
        <BackButton className="mb-8" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border-2 border-green-50 text-center"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 text-green-600">
            <CheckCircle2 className="w-10 h-10 md:w-16 md:h-16" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-playfair text-chocolate mb-4">Order Confirmed!</h1>
          <p className="text-text-soft text-lg mb-8">
            Thank you for choosing Cake Lounge. Your delicious treats are being prepared!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
            <div className="bg-cream/30 p-6 rounded-3xl border border-cream/50">
              <p className="text-[10px] font-bold text-text-soft uppercase tracking-widest mb-1">Order ID</p>
              <p className="font-mono font-bold text-chocolate">#{orderId?.slice(-8).toUpperCase() || 'N/A'}</p>
            </div>
            {orderDetails?.deliveryDate ? (
              <div className="bg-cream/30 p-6 rounded-3xl border border-cream/50">
                <p className="text-[10px] font-bold text-text-soft uppercase tracking-widest mb-1">Delivery Date</p>
                <p className="font-bold text-chocolate flex items-center gap-2">
                  <Calendar size={14} className="text-rose-deep" />
                  {new Date(orderDetails.deliveryDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
              </div>
            ) : (
              <div className="bg-cream/30 p-6 rounded-3xl border border-cream/50">
                <p className="text-[10px] font-bold text-text-soft uppercase tracking-widest mb-1">Payment ID</p>
                <p className="font-mono font-bold text-chocolate text-xs truncate">{paymentId || 'N/A'}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Link
              href="/orders"
              className="flex items-center justify-center gap-3 w-full py-5 bg-chocolate text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-brown transition-all group"
            >
              <ShoppingBag size={24} />
              View Order History
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/menu"
              className="flex items-center justify-center gap-2 w-full py-4 text-chocolate font-bold hover:text-rose-deep transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-deep shadow-sm mb-4">
              <Package size={24} />
            </div>
            <h3 className="font-bold text-chocolate mb-1">Freshly Baked</h3>
            <p className="text-xs text-text-soft">Prepared with love just for you</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-deep shadow-sm mb-4">
              <Calendar size={24} />
            </div>
            <h3 className="font-bold text-chocolate mb-1">On-Time Delivery</h3>
            <p className="text-xs text-text-soft">Scheduled for your convenience</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-deep shadow-sm mb-4">
              <MapPin size={24} />
            </div>
            <h3 className="font-bold text-chocolate mb-1">Real-time Tracking</h3>
            <p className="text-xs text-text-soft">Follow your order status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-deep"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
};

export default SuccessPage;
