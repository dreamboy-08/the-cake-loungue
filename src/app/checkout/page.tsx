"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth, Address } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { CreditCard, ShoppingBag, MapPin, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import BackButton from '@/components/BackButton';
import PageWrapper from '@/components/PageWrapper';
import { Calendar, Clock } from 'lucide-react';
import { getContactInfo } from '@/utils/adminService';

const AddressManager = dynamic(() => import('@/components/shop/AddressManager'), {
  ssr: false,
  loading: () => (
    <div className="h-40 flex items-center justify-center">
      <Loader2 className="animate-spin text-rose-deep" size={32} />
    </div>
  )
});
import { motion, AnimatePresence } from 'framer-motion';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, userData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<string>('');
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const verificationStarted = React.useRef(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);

  // Fetch configured WhatsApp number
  useEffect(() => {
    const fetchWhatsAppNumber = async () => {
      try {
        const contact = await getContactInfo();
        let num = '';
        if (contact && contact.whatsapp) {
          num = contact.whatsapp;
        }

        if (!num) {
          num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_WHATSAPP || '';
        }

        // Default fallback to the website's active number
        if (!num) {
          num = '917703870170';
        }

        // Normalize number: keep digits only
        let cleaned = num.replace(/\D/g, '');
        if (cleaned.length === 10) {
          cleaned = '91' + cleaned;
        } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
          cleaned = '91' + cleaned.substring(1);
        }

        if (cleaned) {
          setWhatsappNumber(cleaned);
        } else {
          setWhatsappNumber(null);
        }
      } catch (error) {
        console.error('Error fetching WhatsApp contact info:', error);
        setWhatsappNumber('917703870170');
      }
    };

    fetchWhatsAppNumber();
  }, []);

  // Delivery Date Logic
  const hasCustomCake = useMemo(() => {
    return cart.some(item => {
      // Check if 'Custom' is in category info if available in cart item
      // ProductDetail addToCart doesn't include category currently, so we check name for 'Custom'
      // or rely on a more robust check if we decide to include category in CartItem.
      // For now, let's look at common indicators in our catalog.
      const category = (item as any).category;
      return category === 'Custom Cakes' || item.name.toLowerCase().includes('custom');
    });
  }, [cart]);

  const deliveryType = hasCustomCake ? 'Custom' : 'Standard';

  const earliestDate = useMemo(() => {
    const today = new Date();
    const date = new Date(today);
    if (hasCustomCake) {
      date.setDate(today.getDate() + 2);
    } else {
      date.setDate(today.getDate() + 1);
    }
    return date.toISOString().split('T')[0];
  }, [hasCustomCake]);

  // Get API URL from environment variables with fallback
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://the-cake-loungue.onrender.com').replace(/\/$/, '');

  // Load persisted checkout data
  useEffect(() => {
    // Only load if not already set (prevents overwriting defaults if they were just set)
    const savedAddress = sessionStorage.getItem('checkout_address');
    const savedDate = sessionStorage.getItem('checkout_delivery_date');
    const savedSlot = sessionStorage.getItem('checkout_delivery_slot');
    const savedInstructions = sessionStorage.getItem('checkout_delivery_instructions');

    if (savedAddress) setSelectedAddress(JSON.parse(savedAddress));
    if (savedDate) setDeliveryDate(savedDate);
    if (savedSlot) setDeliveryTimeSlot(savedSlot);
    if (savedInstructions) setDeliveryInstructions(savedInstructions);
  }, []);

  // Persist checkout data
  useEffect(() => {
    if (selectedAddress) sessionStorage.setItem('checkout_address', JSON.stringify(selectedAddress));
    if (deliveryDate) sessionStorage.setItem('checkout_delivery_date', deliveryDate);
    if (deliveryTimeSlot) sessionStorage.setItem('checkout_delivery_slot', deliveryTimeSlot);
    if (deliveryInstructions) sessionStorage.setItem('checkout_delivery_instructions', deliveryInstructions);
  }, [selectedAddress, deliveryDate, deliveryTimeSlot, deliveryInstructions]);

  // Set default address if available and no address is selected (for logged in users)
  useEffect(() => {
    if (user && userData?.addresses && !selectedAddress) {
      const defaultAddr = userData.addresses.find((a: Address) => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr);
    }
  }, [user, userData?.addresses, selectedAddress]);

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

  const shippingFee = useMemo(() => cartTotal >= 499 ? 0 : 50, [cartTotal]);
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
    if (!deliveryDate) {
      setErrorMessage('Please select a delivery date.');
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
        name: 'The Cake Lounge',
        description: `Order for ${cart.length} item${cart.length > 1 ? 's' : ''}`,
        order_id: order.id,
        handler: async (response: any) => {
          if (verificationStarted.current) {
            console.log('Verification already in progress, skipping...');
            return;
          }
          verificationStarted.current = true;
          setPaymentStatus('verifying');

          try {
            console.log('Razorpay payment successful, verifying...', response.razorpay_payment_id);

            const orderDetails = {
              userId: user?.uid || 'guest',
              isGuest: !user,
              customer: {
                name: selectedAddress.name,
                email: user?.email || 'guest@example.com',
                phone: selectedAddress.phone,
              },
              address: {
                houseNumber: selectedAddress.houseNumber,
                street: selectedAddress.street,
                landmark: selectedAddress.landmark || 'None',
                area: selectedAddress.area,
                city: selectedAddress.city,
                state: selectedAddress.state,
                pincode: selectedAddress.zipCode,
                zipCode: selectedAddress.zipCode, // Keep for legacy
              },
              // For legacy support and easy display
              shippingAddress: `${selectedAddress.houseNumber}, ${selectedAddress.street}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.zipCode}`,
              items: cart.map(item => ({
                ...item,
                unitPrice: item.price,
                totalPrice: item.price * item.quantity
              })),
              totalAmount: finalTotal,
              shippingFee,
              subtotal: cartTotal,
              discount: 0,
              taxes: 0,
              coupon: null,
              paymentMethod: 'Online',
              status: 'Confirmed',
              createdAt: new Date().toISOString(),
              deliveryDate,
              deliveryTimeSlot,
              deliveryInstructions,
              deliveryType,
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
              // Clear persisted checkout data
              sessionStorage.removeItem('checkout_address');
              sessionStorage.removeItem('checkout_delivery_date');
              sessionStorage.removeItem('checkout_delivery_slot');
              sessionStorage.removeItem('checkout_delivery_instructions');

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
    <PageWrapper>
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
              <AddressManager onSelect={(addr) => setSelectedAddress(addr)} selectedAddress={selectedAddress} />
            </div>

            {/* Delivery Details */}
            <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-cream space-y-8">
              <div>
                <h3 className="text-xl font-bold text-chocolate mb-6">
                  Delivery Date & Time
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-deep pointer-events-none">
                      <Calendar size={18} />
                    </div>
                    <input
                      type="date"
                      required
                      min={earliestDate}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-cream rounded-[22px] border-2 border-transparent focus:border-rose-deep outline-none transition-all font-bold text-chocolate [appearance:none] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={deliveryTimeSlot}
                      onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                      required
                      className="w-full px-6 py-4 bg-cream rounded-[22px] border-2 border-transparent focus:border-rose-deep outline-none transition-all font-bold text-chocolate appearance-none"
                    >
                      <option value="">Select Time Slot</option>
                      <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM</option>
                      <option value="01:00 PM - 04:00 PM">01:00 PM - 04:00 PM</option>
                      <option value="04:00 PM - 07:00 PM">04:00 PM - 07:00 PM</option>
                      <option value="07:00 PM - 10:00 PM">07:00 PM - 10:00 PM</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-deep pointer-events-none">
                      <Clock size={18} />
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-text-soft flex items-center gap-2">
                  <AlertCircle size={14} className="text-rose-deep" />
                  {hasCustomCake
                    ? "Custom Cakes require at least 2 days preparation."
                    : "Standard Cakes can be delivered as early as tomorrow."}
                </p>

                {whatsappNumber && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-6 bg-green-50/70 border border-green-200/60 rounded-[28px] flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <span className="text-2xl mt-0.5 select-none" role="img" aria-label="alarm">🚨</span>
                      <div className="space-y-1">
                        <h4 className="font-bold text-chocolate text-[0.95rem] leading-snug">
                          <strong>Need Same-Day Delivery?</strong> Contact us on WhatsApp.
                        </h4>
                        <p className="text-xs text-text-soft leading-relaxed font-medium">
                          Same-day delivery requests are handled manually and are subject to availability. Please contact our team on WhatsApp before placing your order.
                        </p>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello, I would like to enquire about Same-Day Delivery.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#25d366] text-white rounded-[20px] font-bold text-sm shadow-md hover:bg-[#128c7e] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shrink-0 select-none cursor-pointer w-full sm:w-auto text-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="w-4 h-4 fill-current shrink-0"
                      >
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L32 503l138.2-36.2c32.5 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-117zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-82.1 21.5 21.9-80-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                      </svg>
                      <span>💬 Chat on WhatsApp</span>
                    </a>
                  </motion.div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-chocolate mb-4">
                  Delivery Instructions (Optional)
                </h3>
                <textarea
                  placeholder="e.g. Please leave at the gate, call upon arrival, etc."
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  className="w-full p-6 bg-cream rounded-[22px] border-2 border-transparent focus:border-rose-deep outline-none transition-all font-medium text-chocolate min-h-[100px]"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-cream">
              <h3 className="text-xl font-bold text-chocolate flex items-center gap-2 mb-6">
                <CreditCard size={20} className="text-rose-deep" />
                Payment Method
              </h3>
              <div className="p-6 rounded-[30px] border-2 border-rose-deep bg-cream-dark flex items-center gap-4">
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
                  <div key={item.id} className="flex gap-4 p-2 hover:bg-cream rounded-[22px] transition-colors">
                    <div className="relative w-20 h-20 rounded-[22px] bg-cream overflow-hidden flex-shrink-0 border border-cream">
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
                {deliveryDate && (
                  <div className="flex justify-between text-text-mid bg-cream-dark p-3 rounded-xl border border-rose-100">
                    <span className="text-xs font-bold flex items-center gap-2 text-rose-deep">
                      <Calendar size={14} />
                      Delivery Date
                    </span>
                    <span className="text-xs font-bold text-chocolate">
                      {new Date(deliveryDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-text-mid">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-bold text-chocolate">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-text-mid">
                  <span className="text-sm">Delivery Fee</span>
                  <span className="font-bold">{shippingFee === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingFee}`}</span>
                </div>
                {shippingFee === 0 ? (
                  <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                    <p className="text-[10px] text-green-600 font-bold italic text-center">🎉 Congratulations! You unlocked FREE Delivery.</p>
                  </div>
                ) : (
                  <div className="bg-cream-dark p-3 rounded-xl">
                    <p className="text-[10px] text-rose-deep font-bold italic text-center">Add ₹{499 - cartTotal} more to unlock FREE Delivery.</p>
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
                    className="mt-6 p-4 bg-red-50 text-red-600 rounded-[22px] text-xs font-bold flex items-center gap-2 border border-red-100"
                  >
                    <AlertCircle size={16} className="shrink-0" />
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleCheckout}
                disabled={loading || cart.length === 0 || !selectedAddress || !deliveryDate || !deliveryTimeSlot}
                className="w-full mt-8 py-5 bg-chocolate text-white rounded-[22px] font-bold text-xl shadow-xl hover:bg-brown hover:-translate-y-1 transition-all disabled:bg-text-soft disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
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

              {(!selectedAddress || !deliveryDate || !deliveryTimeSlot) && cart.length > 0 && (
                <p className="mt-4 text-rose-deep text-xs font-bold text-center">
                  * Please select {
                    (!selectedAddress && !deliveryDate && !deliveryTimeSlot)
                    ? 'address, date and time slot'
                    : !selectedAddress
                    ? 'a delivery address'
                    : !deliveryDate
                    ? 'a delivery date'
                    : 'a delivery time slot'
                  } to proceed
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
    </PageWrapper>
  );
};

export default CheckoutPage;
