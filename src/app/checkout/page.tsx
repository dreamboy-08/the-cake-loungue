"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth, Address } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, ShoppingBag, MapPin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import AddressManager from '@/components/shop/AddressManager';
import { doc, collection, addDoc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { motion, AnimatePresence } from 'framer-motion';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, userData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  // Set default address if available
  useEffect(() => {
    if (userData?.addresses && !selectedAddress) {
      const defaultAddr = userData.addresses.find((a: Address) => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr);
    }
  }, [userData, selectedAddress]);

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

  const shippingFee = cartTotal > 1000 ? 0 : 50;
  const finalTotal = cartTotal + shippingFee;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    if (!selectedAddress) {
      alert('Please select or add a delivery address.');
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');

    try {
      // Step 1: Create order on backend (simulated for now or using Render API)
      const orderResponse = await fetch('https://the-cake-loungue.onrender.com/api/orders', {
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

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();
      const { order, keyId } = orderData;

      // Step 2: Open Razorpay
      const options = {
        key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SnKyu6FLUmVKUj',
        amount: finalTotal * 100,
        currency: 'INR',
        name: 'Cake Lounge',
        description: `Order for ${cartCountText(cart.length)}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch('https://the-cake-loungue.onrender.com/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.ok) {
              // Step 3: Save order to Firestore
              const orderDoc = {
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
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                createdAt: new Date().toISOString(),
              };

              await addDoc(collection(db, 'orders'), orderDoc);

              setPaymentStatus('success');
              setTimeout(() => {
                clearCart();
                router.push('/orders');
              }, 2000);
            } else {
              setPaymentStatus('error');
              alert('Payment verification failed!');
            }
          } catch (error) {
            console.error('Verification error:', error);
            setPaymentStatus('error');
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
      rzp.open();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
      setPaymentStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const cartCountText = (count: number) => `${count} item${count > 1 ? 's' : ''}`;

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full border-2 border-green-100"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold font-playfair text-chocolate mb-2">Order Confirmed!</h2>
          <p className="text-text-soft mb-8">Thank you for your order. We're getting your cakes ready!</p>
          <div className="animate-pulse flex items-center justify-center gap-2 text-rose-deep font-bold">
            <Loader2 className="animate-spin" size={20} />
            Redirecting to your orders...
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
              <Link href="/menu" className="inline-flex items-center gap-2 text-rose-deep font-bold mb-4 hover:text-chocolate transition-colors group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Menu
              </Link>
              <h1 className="text-4xl font-bold font-playfair text-chocolate">Secure Checkout</h1>
            </div>

            {/* Address Selection */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream">
              <AddressManager onSelect={(addr) => setSelectedAddress(addr)} />
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream">
              <h3 className="text-xl font-bold text-chocolate flex items-center gap-2 mb-6">
                <CreditCard size={20} className="text-rose-deep" />
                Payment Method
              </h3>
              <div className="p-4 rounded-2xl border-2 border-rose-deep bg-rose/5 flex items-center gap-4">
                <div className="w-10 h-10 bg-rose-deep rounded-full flex items-center justify-center text-white">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="font-bold text-chocolate">Secure Online Payment</p>
                  <p className="text-xs text-text-soft">UPI, Cards, NetBanking via Razorpay</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-cream sticky top-32">
              <h3 className="text-xl font-bold font-playfair text-chocolate mb-6 flex items-center gap-2">
                <ShoppingBag size={20} className="text-rose-deep" />
                Order Summary
              </h3>

              <div className="max-h-[300px] overflow-y-auto mb-6 space-y-4 pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-cream overflow-hidden flex-shrink-0">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-chocolate line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-text-soft">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-rose-deep mt-1">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-cream pt-6">
                <div className="flex justify-between text-text-mid">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-text-mid">
                  <span>Delivery Fee</span>
                  <span className="font-bold">{shippingFee === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingFee}`}</span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-[10px] text-rose-deep font-medium italic">Add ₹{1000 - cartTotal} more for free delivery!</p>
                )}
                <div className="flex justify-between items-center pt-3 border-t-2 border-chocolate mt-3">
                  <span className="text-lg font-bold text-chocolate">Total Amount</span>
                  <span className="text-3xl font-black text-rose-deep">₹{finalTotal}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || cart.length === 0 || !selectedAddress}
                className="w-full mt-8 py-5 bg-chocolate text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-brown hover:-translate-y-1 transition-all disabled:bg-text-soft disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={24} />
                    Place Order
                  </>
                )}
              </button>

              {!selectedAddress && cart.length > 0 && (
                <div className="mt-4 flex items-center gap-2 text-rose-deep text-xs font-bold justify-center bg-rose/5 p-2 rounded-lg">
                  <AlertCircle size={14} />
                  Please select a delivery address
                </div>
              )}

              <p className="text-[10px] text-center text-text-soft mt-6 uppercase tracking-widest font-bold">
                100% Secure Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
