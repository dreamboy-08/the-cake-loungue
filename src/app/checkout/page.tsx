"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    address: '',
    specialRequests: '',
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create order on backend
      const orderResponse = await fetch('https://the-cake-loungue.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          totalAmount: cartTotal,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();
      const { order, keyId } = orderData;

      // Step 2: Open Razorpay
      const options = {
        key: keyId || 'rzp_test_SnKyu6FLUmVKUj',
        amount: cartTotal * 100,
        currency: 'INR',
        name: 'Cake Lounge',
        description: `Order for ${cart.length} item(s)`,
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
              alert('🎉 Order placed successfully!');
              clearCart();
              router.push('/');
            } else {
              alert('Payment verification failed!');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Error verifying payment');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#c9614a',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6">
        <Link href="/menu" className="inline-flex items-center gap-2 text-rose-deep font-semibold mb-8 hover:text-chocolate transition-colors">
          <ArrowLeft size={20} /> Back to Menu
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg p-10 shadow-sm">
            <h2 className="text-3xl font-bold text-chocolate mb-8">Place Your Order</h2>
            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-text">Full Name *</label>
                <input type="text" id="name" required value={formData.name} onChange={handleInputChange} className="w-full p-3 border-2 border-cream-dark rounded-sm focus:border-rose-deep outline-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-text">Email *</label>
                  <input type="email" id="email" required value={formData.email} onChange={handleInputChange} className="w-full p-3 border-2 border-cream-dark rounded-sm focus:border-rose-deep outline-none" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-semibold text-text">Phone Number *</label>
                  <input type="tel" id="phone" required pattern="[0-9]{10}" placeholder="10-digit number" value={formData.phone} onChange={handleInputChange} className="w-full p-3 border-2 border-cream-dark rounded-sm focus:border-rose-deep outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="date" className="block text-sm font-semibold text-text">Delivery Date *</label>
                  <input type="date" id="date" required value={formData.date} onChange={handleInputChange} className="w-full p-3 border-2 border-cream-dark rounded-sm focus:border-rose-deep outline-none" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="time" className="block text-sm font-semibold text-text">Delivery Time *</label>
                  <input type="time" id="time" required value={formData.time} onChange={handleInputChange} className="w-full p-3 border-2 border-cream-dark rounded-sm focus:border-rose-deep outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-semibold text-text">Delivery Address *</label>
                <textarea id="address" rows={3} required placeholder="Street, City, Postal Code" value={formData.address} onChange={handleInputChange} className="w-full p-3 border-2 border-cream-dark rounded-sm focus:border-rose-deep outline-none resize-none" />
              </div>

              <div className="space-y-2">
                <label htmlFor="specialRequests" className="block text-sm font-semibold text-text">Special Requests / Dietary Info</label>
                <textarea id="specialRequests" rows={2} placeholder="e.g., Allergies, custom message..." value={formData.specialRequests} onChange={handleInputChange} className="w-full p-3 border-2 border-cream-dark rounded-sm focus:border-rose-deep outline-none resize-none" />
              </div>

              <button type="submit" disabled={loading} className="hidden lg:block w-full py-4 bg-rose-deep text-white rounded-full font-bold text-lg shadow-md hover:bg-brown hover:-translate-y-0.5 transition-all disabled:bg-text-soft disabled:cursor-not-allowed">
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-7 shadow-sm sticky top-32 h-fit">
              <h3 className="text-xl font-bold text-chocolate mb-5 text-center border-b border-cream-dark pb-4">Order Summary</h3>

              <div className="max-h-60 overflow-y-auto mb-5 space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-text-mid flex-1 pr-2 line-clamp-1">{item.name} x {item.quantity}</span>
                    <span className="font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-rose-deep pt-4 mt-4 space-y-4">
                <div className="flex justify-between items-center text-xl font-bold text-rose-deep">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={loading || cart.length === 0}
                  className="w-full py-4 bg-rose-deep text-white rounded-full font-bold text-lg shadow-md hover:bg-brown hover:-translate-y-0.5 transition-all disabled:bg-text-soft disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
