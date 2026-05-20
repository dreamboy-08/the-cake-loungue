'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Ticket, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ContactSection,
  ShippingSection,
  DeliverySchedule,
  SpecialInstructions,
  checkoutSchema,
  type CheckoutFormData
} from '@/components/checkout/CheckoutForm';
import { useState } from 'react';
import { loadRazorpay } from '@/utils/razorpay';
import { useRouter } from 'next/navigation';

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'razorpay'
    }
  });

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    try {
      if (data.paymentMethod === 'cod') {
        // Handle COD - in a real app, this would also call a backend API
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert('Order placed successfully with Cash on Delivery!');
        clearCart();
        router.push('/');
        return;
      }

      // Load Razorpay script
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert('Razorpay SDK failed to load. Are you online?');
        setIsSubmitting(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      // Create order on backend
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalAmount: grandTotal,
          items: cart,
          customerName: data.fullName,
          customerEmail: data.email,
          customerPhone: data.phone,
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const { order, keyId } = orderData;

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'The Cake Lounge',
        description: 'Order Payment',
        order_id: order.id,
        handler: async function (paymentResponse: any) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch(`${apiUrl}/api/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              alert('Payment successful and verified!');
              clearCart();
              router.push('/');
            } else {
              alert('Payment verification failed: ' + verifyData.error);
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('An error occurred during payment verification.');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: data.fullName,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: '#C9614A',
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('Checkout failed: ' + error.message);
      setIsSubmitting(false);
    }
  };

  const gst = Math.round(cartTotal * 0.18);
  const deliveryFee = cartTotal > 1000 ? 0 : 50;
  const grandTotal = cartTotal + gst + deliveryFee;

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
        <h2 className="font-playfair text-3xl font-bold text-chocolate mb-4">Your cart is empty</h2>
        <p className="text-text-soft mb-8 text-center max-w-md">
          Looks like you haven&apos;t added any of our delicious treats yet.
        </p>
        <Link
          href="/menu"
          className="bg-rose-deep text-white px-8 py-3 rounded-full font-semibold hover:bg-brown transition-all"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] pt-24 pb-12">
      <div className="container px-4 md:px-6">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/menu" className="text-rose-deep hover:text-brown flex items-center gap-1 text-sm font-medium transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Menu
          </Link>
        </div>

        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-chocolate mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Checkout Forms */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            <ContactSection register={register} errors={errors} />
            <ShippingSection register={register} errors={errors} />
            <DeliverySchedule register={register} errors={errors} />
            <SpecialInstructions register={register} errors={errors} />

            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-cream/50 mb-8">
              <h2 className="text-xl font-bold text-chocolate mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-rose-deep text-white text-[10px] rounded-full">5</span>
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${watch('paymentMethod') === 'razorpay' ? 'border-rose-deep bg-rose/5' : 'border-cream'}`}>
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="razorpay"
                    className="w-4 h-4 text-rose-deep focus:ring-rose-deep"
                  />
                  <div className="ml-4">
                    <span className="block text-sm font-bold text-chocolate">Razorpay (Cards, UPI, Netbanking)</span>
                    <span className="block text-xs text-text-soft mt-0.5">Secure payment via Razorpay checkout</span>
                  </div>
                </label>
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${watch('paymentMethod') === 'cod' ? 'border-rose-deep bg-rose/5' : 'border-cream'}`}>
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="cod"
                    className="w-4 h-4 text-rose-deep focus:ring-rose-deep"
                  />
                  <div className="ml-4">
                    <span className="block text-sm font-bold text-chocolate">Cash on Delivery</span>
                    <span className="block text-xs text-text-soft mt-0.5">Pay when you receive your order</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28">
            <div className="bg-white rounded-xl p-6 shadow-md border border-cream/50">
              <h2 className="text-xl font-bold text-chocolate mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group relative">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-cream border border-cream relative">
                      <Image src={item.img} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-[0.85rem] font-bold text-chocolate line-clamp-1 pr-4">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-text-soft hover:text-rose-deep p-1 -mt-1"
                          aria-label="Remove item"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-cream rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 bg-cream/30 hover:bg-cream transition-colors text-chocolate text-xs font-bold"
                          >-</button>
                          <span className="px-2 text-xs font-bold text-chocolate min-w-[20px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 bg-cream/30 hover:bg-cream transition-colors text-chocolate text-xs font-bold"
                          >+</button>
                        </div>
                        <span className="text-[0.9rem] font-bold text-rose-deep">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-soft block mb-2 px-1">Apply Coupon</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-soft" />
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-cream focus:outline-none focus:ring-2 focus:ring-rose/20 focus:border-rose transition-all text-sm uppercase font-bold"
                    />
                  </div>
                  <button className="bg-chocolate text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brown transition-all">Apply</button>
                </div>
              </div>

              <div className="border-t border-cream/50 pt-4 space-y-3">
                <div className="flex justify-between text-text-mid font-medium">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-text-soft text-[0.85rem]">
                  <span>GST (18%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between text-text-soft text-[0.85rem]">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-bold">FREE</span>
                  ) : (
                    <span>₹{deliveryFee}</span>
                  )}
                </div>
                <div className="border-t border-cream pt-3 flex justify-between items-center">
                  <span className="text-lg font-bold text-chocolate uppercase tracking-tight">Total</span>
                  <span className="text-2xl font-black text-rose-deep">₹{grandTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-8 bg-rose-deep text-white py-4 rounded-full font-bold text-lg hover:bg-brown transition-all shadow-[0_4px_16px_rgba(201,97,74,0.3)] hover:-translate-y-px flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${grandTotal}`
                )}
              </button>

              <p className="text-[0.7rem] text-center text-text-soft mt-4">
                By placing this order, you agree to our <Link href="/terms" className="underline">Terms of Service</Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CheckoutPage;
