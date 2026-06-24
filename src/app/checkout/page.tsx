"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth, Address } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { CreditCard, ShoppingBag, MapPin, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { doc, collection, setDoc, getDoc } from 'firebase/firestore';
import BackButton from '@/components/BackButton';

const AddressManager = dynamic(() => import('@/components/shop/AddressManager'), {
  ssr: false,
  loading: () => (
    <div className="h-40 flex items-center justify-center">
      <Loader2 className="animate-spin text-rose-deep" size={32} />
    </div>
  )
});
import { db } from '@/utils/firebase';
import { motion, AnimatePresence } from 'framer-motion';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, userData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get API URL from environment variables with fallback
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://the-cake-loungue.onrender.com').replace(/\/$/, '');

  // Set default address if available and ensure selectedAddress is valid
  useEffect(() => {
    if (userData?.addresses) {
      if (!selectedAddress) {
        const defaultAddr = userData.addresses.find((a: Address) => a.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr);
      } else {
        const stillExists = userData.addresses.find((a: Address) => a.id === selectedAddress.id);
        if (!stillExists) {
          const defaultAddr = userData.addresses.find((a: Address) => a.isDefault);
          setSelectedAddress(defaultAddr || null);
        } else {
          // Sync with the latest address data from profile
          if (JSON.stringify(stillExists) !== JSON.stringify(selectedAddress)) {
            setSelectedAddress(stillExists);
          }
        }
      }
    }
  }, [userData?.addresses, selectedAddress]);

  useEffect(() => {
    // Dynamically load Razorpay script
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Warm up the backend to handle Render cold starts
  useEffect(() => {
    fetch(API_URL).catch(() => {});
  }, [API_URL]);

  const shippingFee = useMemo(() => cartTotal > 1000 ? 0 : 50, [cartTotal]);
  const finalTotal = useMemo(() => cartTotal + shippingFee, [cartTotal, shippingFee]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setErrorMessage('Your cart is empty!');
      return;
    }
    if (!selectedAddress) {
      setErrorMessage('Please select or add a delivery address.');
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');
    setErrorMessage(null);

    try {
      console.log('Initiating checkout for amount:', finalTotal);
      // Step 1: Create order on backend
      const orderResponse = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalAmount: finalTotal,
          items: cart,
          customerName: selectedAddress.name,
          customerEmail: user?.email || 'guest@example.com',
          customerPhone: selectedAddress.phone,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to initialize payment');
      }

      const { order, keyId } = orderData;
      console.log('Backend order created:', order.id);

      // Step 2: Open Razorpay
      const options = {
        key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Cake Lounge',
        description: `Order for ${cart.length} item${cart.length > 1 ? 's' : ''}`,
        order_id: order.id,
        handler: async (response: any) => {
          setPaymentStatus('verifying');
          try {
            console.log('Razorpay payment successful, verifying...', response.razorpay_payment_id);

            const orderDetails = {
              userId: user?.uid || 'guest',
              customer: {
                name: selectedAddress.name,
                email: user?.email || 'guest@example.com',
                phone: selectedAddress.phone,
              },
              shippingAddress: `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.zipCode}`,
              items: cart,
              totalAmount: finalTotal,
              shippingFee,
              subtotal: cartTotal,
              status: 'Confirmed',
              createdAt: new Date().toISOString(),
            };

            const verifyResponse = await fetch(`${API_URL}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              console.log('Payment verified and order stored successfully');
              const orderId = response.razorpay_order_id;

              setPaymentStatus('success');
              clearCart();
              router.push(`/checkout/success?orderId=${orderId}&paymentId=${response.razorpay_payment_id}`);
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (error: any) {
            console.error('Verification error:', error);
            setPaymentStatus('error');
            setErrorMessage(error.message || 'Payment verification failed. Please contact support.');
            router.push(`/checkout/failure?error=${encodeURIComponent(error.message || 'Verification failed')}`);
          }
        },
        prefill: {
          name: selectedAddress.name,
          email: user?.email || '',
          contact: selectedAddress.phone,
        },
        theme: {
          color: '#c9614a',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setPaymentStatus('idle');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setPaymentStatus('error');
        setErrorMessage(response.error.description);
        router.push(`/checkout/failure?error=${encodeURIComponent(response.error.description)}`);
      });
      rzp.open();
    } catch (error: any) {
      console.error('Checkout error:', error);
      setErrorMessage(error.message || 'Checkout failed. Please try again.');
      setPaymentStatus('error');
      setLoading(false);
    }
  };

  if (paymentStatus === 'verifying' || paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-[40px] shadow-xl text-center max-w-md w-full border-2 border-rose-100"
        >
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-deep">
            <Loader2 className="animate-spin" size={48} />
          </div>
          <h2 className="text-3xl font-bold font-playfair text-chocolate mb-2">
            {paymentStatus === 'verifying' ? 'Verifying Payment' : 'Order Successful!'}
          </h2>
          <p className="text-text-soft mb-8">
            {paymentStatus === 'verifying'
              ? "Please don't refresh or close the page while we verify your transaction."
              : "Hang tight, we're redirecting you to your order confirmation."}
          </p>
          <div className="flex items-center justify-center gap-2 text-rose-deep font-bold">
            <ShieldCheck size={20} />
            Secure Transaction
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <div>
              <BackButton fallbackRoute="/shop/birthday-cakes" />
              <h1 className="text-4xl font-bold font-playfair text-chocolate">Secure Checkout</h1>
            </div>

            {/* Address Selection */}
            <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-cream">
              <AddressManager onSelect={(addr) => setSelectedAddress(addr)} />
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-cream">
              <h3 className="text-xl font-bold text-chocolate flex items-center gap-2 mb-6">
                <CreditCard size={20} className="text-rose-deep" />
                Payment Method
              </h3>
              <div className="p-6 rounded-[30px] border-2 border-rose-deep bg-rose/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-deep rounded-full flex items-center justify-center text-white shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="font-bold text-chocolate">Secure Online Payment</p>
                  <p className="text-sm text-text-soft">UPI, Cards, NetBanking via Razorpay</p>
                </div>
                <div className="ml-auto hidden sm:block">
                  <ShieldCheck className="text-rose-deep/30" size={32} />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:w-[450px]">
            <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl border border-cream sticky top-32">
              <h3 className="text-xl font-bold font-playfair text-chocolate mb-6 flex items-center gap-2">
                <ShoppingBag size={20} className="text-rose-deep" />
                Order Summary
              </h3>

              <div className="max-h-[300px] overflow-y-auto mb-6 space-y-4 pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-2 hover:bg-cream/20 rounded-2xl transition-colors">
                    <div className="relative w-20 h-20 rounded-2xl bg-cream overflow-hidden flex-shrink-0 border border-cream">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-chocolate line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-text-soft mt-0.5">
                        {item.flavor || 'Standard'} • {item.weight || '0.5 Kg'}
                      </p>
                      <p className="text-xs text-text-soft mt-1">Quantity: {item.quantity}</p>
                      <p className="text-sm font-bold text-rose-deep mt-1">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-cream pt-6">
                <div className="flex justify-between text-text-mid">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-bold text-chocolate">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-text-mid">
                  <span className="text-sm">Delivery Fee</span>
                  <span className="font-bold">{shippingFee === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingFee}`}</span>
                </div>
                {shippingFee > 0 && (
                  <div className="bg-rose/5 p-3 rounded-xl">
                    <p className="text-[10px] text-rose-deep font-bold italic text-center">Add ₹{1000 - cartTotal} more for FREE delivery!</p>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t-2 border-chocolate mt-4">
                  <span className="text-lg font-bold text-chocolate uppercase tracking-wider">Total Amount</span>
                  <div className="text-right">
                    <span className="text-4xl font-black text-rose-deep">₹{finalTotal}</span>
                    <p className="text-[10px] text-text-soft font-bold uppercase tracking-widest mt-1">Inclusive of all taxes</p>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100"
                  >
                    <AlertCircle size={16} className="shrink-0" />
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleCheckout}
                disabled={loading || cart.length === 0 || !selectedAddress}
                className="w-full mt-8 py-5 bg-chocolate text-white rounded-2xl font-bold text-xl shadow-xl hover:bg-brown hover:-translate-y-1 transition-all disabled:bg-text-soft disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={24} />
                    Pay Now
                  </>
                )}
              </button>

              {!selectedAddress && cart.length > 0 && (
                <p className="mt-4 text-rose-deep text-xs font-bold text-center">
                  * Please select a delivery address to proceed
                </p>
              )}

              <div className="mt-8 pt-8 border-t border-cream flex items-center justify-center gap-6 grayscale opacity-50">
                <div className="relative h-4 w-16">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" fill className="object-contain" />
                </div>
                <div className="relative h-6 w-12">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" fill className="object-contain" />
                </div>
                <div className="relative h-4 w-12">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" fill className="object-contain" />
                </div>
              </div>
              <p className="text-[10px] text-center text-text-soft mt-4 uppercase tracking-widest font-bold">
                100% Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
