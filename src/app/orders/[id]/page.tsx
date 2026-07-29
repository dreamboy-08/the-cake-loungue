"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/utils/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Package, MapPin, CreditCard, Calendar, Clock, Loader2, CheckCircle2, AlertCircle, RefreshCcw, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/BackButton';
import PageWrapper from '@/components/PageWrapper';
import Toast from '@/components/Toast';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [lastStatus, setLastStatus] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [confetti, setConfetti] = useState<any[]>([]);

  useEffect(() => {
    if (order?.status === 'Delivered') {
      setConfetti([...Array(20)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3
      })));
    }
  }, [order?.status]);

  useEffect(() => {
    if (!user || !id) return;

    setLoading(true);
    setError(null);

    let unsubscribeUser: (() => void) | null = null;

    // Primary source: Master orders collection (Admin updates this)
    const masterDocRef = doc(db, 'orders', id as string);

    const unsubscribeMaster = onSnapshot(masterDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Permission check: Ensure order belongs to current user
        if (data.userId === user.uid) {
          setOrder({ id: docSnap.id, ...data });

          // Status change notification logic
          const storageKey = `last_seen_status_${id}`;
          const lastSeenStatus = localStorage.getItem(storageKey);

          if (lastSeenStatus && lastSeenStatus !== data.status) {
            setToastMessage(`Your order is now ${data.status.toLowerCase()}.`);
            setShowToast(true);
          } else if (lastStatus && lastStatus !== data.status) {
            // Real-time change while page is open
            setToastMessage(`Your order is now ${data.status.toLowerCase()}.`);
            setShowToast(true);
          }

          localStorage.setItem(storageKey, data.status);
          setLastStatus(data.status);
          setLoading(false);

          // Found in master, can stop listening to user subcollection if it was started
          if (unsubscribeUser) {
            unsubscribeUser();
            unsubscribeUser = null;
          }
          return;
        }
      }

      // Fallback: Check user subcollection if not in master or if permission check failed
      if (!unsubscribeUser) {
        const userDocRef = doc(db, 'users', user.uid, 'orders', id as string);
        unsubscribeUser = onSnapshot(userDocRef, (userSnap) => {
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setOrder({ id: userSnap.id, ...userData });

            if (lastStatus && lastStatus !== userData.status) {
              setToastMessage(`Your order is now ${userData.status.toLowerCase()}.`);
              setShowToast(true);
            }
            setLastStatus(userData.status);
            setLoading(false);
          } else if (!docSnap.exists()) {
            setError("Order not found or access denied.");
            setLoading(false);
          }
        }, (err) => {
          console.error("Error fetching user subcollection order:", err);
          setError("Unable to load order details.");
          setLoading(false);
        });
      }
    }, (err) => {
      console.error("Error fetching master order:", err);
      // Even if master fails (e.g. permission), try user subcollection
      if (!unsubscribeUser) {
        const userDocRef = doc(db, 'users', user.uid, 'orders', id as string);
        unsubscribeUser = onSnapshot(userDocRef, (userSnap) => {
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setOrder({ id: userSnap.id, ...userData });
            setLoading(false);
          } else {
            setError("Order not found or access denied.");
            setLoading(false);
          }
        }, (err) => {
          setError("Unable to load order details.");
          setLoading(false);
        });
      }
    });

    return () => {
      unsubscribeMaster();
      if (unsubscribeUser) unsubscribeUser();
    };
  }, [user, id, retryCount, lastStatus]);

  const getStatusStep = (status: string) => {
    const steps = ['Order Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    // Handle status variations
    if (status === 'Pending') return 0;
    if (status === 'Baking') return 2;
    if (status === 'Ready for Dispatch') return 2;
    const index = steps.indexOf(status);
    return index === -1 ? 0 : index;
  };

  if (loading) {
    return (
      <PageWrapper loading className="gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="text-rose-deep" size={40} />
        </motion.div>
        <p className="text-chocolate font-medium">Syncing with kitchen...</p>
      </PageWrapper>
    );
  }

  if (error || !order) {
    return (
      <PageWrapper loading className="gap-6 px-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-chocolate">{error || "Order Not Found"}</h2>
        <p className="text-text-soft max-w-xs">
          {error ? "There was a problem retrieving your order. Please try again." : "The order you're looking for doesn't exist or you don't have permission to view it."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setRetryCount(prev => prev + 1)}
            className="flex items-center justify-center gap-2 bg-chocolate text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-brown transition-colors"
          >
            <RefreshCcw size={18} />
            Retry
          </button>
          <Link href="/orders" className="bg-cream border-2 border-cream-dark text-chocolate px-8 py-3 rounded-full font-bold">
            Back to Orders
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const currentStep = getStatusStep(order.status);

  return (
    <PageWrapper>
      <Toast
        isVisible={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
        type="info"
      />

      {/* Celebration for Delivered Status */}
      {order.status === 'Delivered' && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {confetti.map((dot) => (
            <motion.div
              key={dot.id}
              className="absolute w-2 h-2 rounded-full bg-blush"
              initial={{
                top: "100%",
                left: `${dot.left}%`,
                opacity: 1
              }}
              animate={{
                top: "-10%",
                opacity: 0,
                rotate: 360
              }}
              transition={{
                duration: dot.duration,
                repeat: Infinity,
                delay: dot.delay,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

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
              <div className="absolute top-1/2 left-0 w-full h-1 bg-cream-dark -translate-y-1/2 rounded-full" />
              <motion.div
                className="absolute top-1/2 left-0 h-1 bg-blush -translate-y-1/2 rounded-full z-0"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 4) * 100}%` }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />

              <div className="relative flex justify-between">
                {['Order Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                  const isCompleted = idx < currentStep;
                  const isActive = idx === currentStep;
                  const historyDate = idx === 0 ? order.createdAt : (order.statusHistory?.[step] || (step === 'Preparing' && (order.statusHistory?.['Baking'] || order.statusHistory?.['Ready for Dispatch'])));

                  return (
                    <div key={step} className="flex flex-col items-center">
                      <motion.div
                        initial={false}
                        animate={{
                          scale: isActive ? 1.2 : 1,
                          backgroundColor: (isCompleted || isActive) ? "#f7d7d0" : "#3d2b24",
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-chocolate z-10 relative`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={20} className="text-chocolate" />
                        ) : isActive ? (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Clock size={20} className="text-chocolate" />
                          </motion.div>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-white/20" />
                        )}

                        {isActive && (
                          <motion.div
                            layoutId="activeGlow"
                            className="absolute inset-0 rounded-full bg-blush/30 blur-md -z-10"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </motion.div>

                      <div className="flex flex-col items-center mt-3 gap-1">
                        <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider text-center max-w-[60px] md:max-w-none ${
                          (isCompleted || isActive) ? 'text-blush' : 'text-white/30'
                        }`}>
                          {step}
                        </span>
                        {(isCompleted || isActive) && historyDate && (
                          <span className="text-[8px] font-medium text-white/40 whitespace-nowrap">
                            {new Date(historyDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Delivered Special UI */}
            <AnimatePresence>
              {order.status === 'Delivered' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-100 rounded-[30px] p-8 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white shadow-lg shadow-green-200">
                    <CheckCircle2 size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-chocolate">Order Delivered Successfully!</h2>
                  <p className="text-text-soft">We hope you love your Cake Lounge treats. How was your experience?</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                      href={`/reviews?orderId=${order.id}`}
                      className="bg-chocolate text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-brown transition-all shadow-md"
                    >
                      <Star size={18} className="text-blush" />
                      Write a Review
                    </Link>
                    <div className="flex items-center gap-1 text-rose-deep font-bold">
                      <Sparkles size={18} />
                      <span>Thank you!</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                      <div className="text-xs text-text-soft mt-0.5 space-y-0.5">
                        {item.weight && (
                          <div>
                            <span className="font-semibold text-chocolate/85">Weight:</span> {item.weight}
                          </div>
                        )}
                        {item.flavor && (
                          <div>
                            <span className="font-semibold text-chocolate/85">Flavour:</span> {item.flavor}
                          </div>
                        )}
                      </div>
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
                      <div className="mt-2 space-y-1">
                        {order.deliveryTimeSlot && (
                          <p className="text-sm font-bold text-chocolate flex items-center gap-2">
                            <Clock size={16} className="text-rose-deep" />
                            {order.deliveryTimeSlot}
                          </p>
                        )}
                        {order.deliveryType && (
                          <p className="text-[10px] text-text-soft font-medium uppercase tracking-widest">Type: {order.deliveryType}</p>
                        )}
                      </div>
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
