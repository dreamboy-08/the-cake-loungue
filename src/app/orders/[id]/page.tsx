"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Package, MapPin, CreditCard, Calendar, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import BackButton from '@/components/BackButton';
import PageWrapper from '@/components/PageWrapper';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'users', user.uid, 'orders', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Fallback to master orders for legacy or admin-placed orders if needed
          const masterDocRef = doc(db, 'orders', id as string);
          const masterDocSnap = await getDoc(masterDocRef);
          if (masterDocSnap.exists() && masterDocSnap.data().userId === user.uid) {
            setOrder({ id: masterDocSnap.id, ...masterDocSnap.data() });
          }
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user, id]);

  const getStatusStep = (status: string) => {
    const steps = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <PageWrapper loading className="gap-4">
        <Loader2 className="animate-spin text-rose-deep" size={40} />
        <p className="text-chocolate font-medium">Loading order details...</p>
      </PageWrapper>
    );
  }

  if (!order) {
    return (
      <PageWrapper loading className="gap-6 px-6 text-center">
        <div className="w-20 h-20 bg-cream-dark rounded-full flex items-center justify-center text-rose-deep">
          <Package size={40} />
        </div>
        <h2 className="text-2xl font-bold text-chocolate">Order Not Found</h2>
        <p className="text-text-soft max-w-xs">The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
        <Link href="/orders" className="bg-rose-deep text-white px-8 py-3 rounded-full font-bold shadow-lg">
          Back to Orders
        </Link>
      </PageWrapper>
    );
  }

  const currentStep = getStatusStep(order.status);

  return (
    <PageWrapper>
      <div className="container mx-auto px-6 max-w-4xl">
        <BackButton fallbackRoute="/orders" ariaLabel="Go back to order history" />

        <div className="bg-white rounded-[40px] shadow-sm border border-cream overflow-hidden">
          {/* Header */}
          <div className="p-8 md:p-12 bg-chocolate text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-blush font-bold uppercase tracking-widest text-xs mb-2">Order Tracking</p>
                <h1 className="text-3xl md:text-4xl font-bold font-playfair">Order #{order.id.slice(-8).toUpperCase()}</h1>
              </div>
              <div className="bg-cream-dark  rounded-[22px] p-4 border border-white/10">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Total Amount</p>
                <p className="text-2xl font-black text-blush">₹{order.totalAmount}</p>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="mt-12 relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-cream-dark -translate-y-1/2" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-blush -translate-y-1/2 transition-all duration-1000"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />

              <div className="relative flex justify-between">
                {['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map((step, idx) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-chocolate z-10 transition-colors duration-500 ${
                      idx <= currentStep ? 'bg-blush text-chocolate' : 'bg-chocolate text-white/30 border-white/10'
                    }`}>
                      <CheckCircle2 size={20} className={idx <= currentStep ? 'opacity-100' : 'opacity-0'} />
                    </div>
                    <span className={`text-[10px] md:text-xs font-bold mt-3 uppercase tracking-wider ${
                      idx <= currentStep ? 'text-blush' : 'text-white/30'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Order Items */}
            <section>
              <h3 className="text-xl font-bold text-chocolate mb-6 flex items-center gap-2">
                <Package size={20} className="text-rose-deep" />
                Items Ordered
              </h3>
              <div className="space-y-4">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-[22px] bg-cream border border-cream/50">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-chocolate line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-text-soft">
                        {item.flavor || 'Standard'} • {item.weight || '0.5 Kg'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-chocolate">₹{item.price * item.quantity}</p>
                      <p className="text-xs text-text-soft">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-cream">
              {/* Delivery Details */}
              <section className="space-y-6">
                <h3 className="text-xl font-bold text-chocolate flex items-center gap-2">
                  <MapPin size={20} className="text-rose-deep" />
                  Delivery Details
                </h3>
                <div className="space-y-4 bg-cream p-6 rounded-3xl border border-cream/50">
                  <div>
                    <p className="text-[10px] font-bold text-text-soft uppercase tracking-widest mb-1">Customer</p>
                    <p className="font-bold text-chocolate">{order.customer.name}</p>
                    <p className="text-sm text-text-mid">{order.customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-soft uppercase tracking-widest mb-1">Address</p>
                    <p className="text-sm text-text-mid leading-relaxed">{order.shippingAddress}</p>
                  </div>
                  {order.deliveryDate && (
                    <div className="pt-4 border-t border-cream/50">
                      <p className="text-[10px] font-bold text-rose-deep uppercase tracking-widest mb-1">Scheduled Delivery</p>
                      <p className="font-bold text-chocolate flex items-center gap-2">
                        <Calendar size={16} className="text-rose-deep" />
                        {new Date(order.deliveryDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </p>
                      {order.deliveryType && (
                        <p className="text-[10px] text-text-soft mt-1 font-medium">Type: {order.deliveryType}</p>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* Order Info */}
              <section className="space-y-6">
                <h3 className="text-xl font-bold text-chocolate flex items-center gap-2">
                  <CreditCard size={20} className="text-rose-deep" />
                  Order Information
                </h3>
                <div className="space-y-4 bg-cream p-6 rounded-3xl border border-cream/50">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-text-soft uppercase tracking-widest mb-1">Placed On</p>
                      <p className="text-sm font-bold text-chocolate">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-text-soft uppercase tracking-widest mb-1">Time</p>
                      <p className="text-sm font-bold text-chocolate">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-cream/50">
                    <p className="text-sm text-text-mid font-medium">Subtotal</p>
                    <p className="font-bold text-chocolate">₹{order.subtotal}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-text-mid font-medium">Delivery Fee</p>
                    <p className="font-bold text-chocolate">₹{order.shippingFee}</p>
                  </div>
                  <div className="flex justify-between pt-2">
                    <p className="text-lg font-bold text-chocolate">Total</p>
                    <p className="text-xl font-black text-rose-deep">₹{order.totalAmount}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default OrderDetailsPage;
