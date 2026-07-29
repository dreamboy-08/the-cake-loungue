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
import { Calendar, Clock, MessageSquare } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { DELIVERY_SLOTS, MIDNIGHT_SLOT, MIDNIGHT_CHARGE, isServiceableZipCode } from '@/constants/delivery';
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<string>('');
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'verifying' | 'success' | 'error'>('idle');
  const [contactWhatsapp, setContactWhatsapp] = useState<string>('917703870170');

  const desktopCalendarRef = React.useRef<HTMLDivElement>(null);

  // Fetch WhatsApp number dynamically from CMS on mount
  useEffect(() => {
    getContactInfo().then((info) => {
      if (info && info.whatsapp) {
        setContactWhatsapp(info.whatsapp);
      }
    }).catch((err) => {
      console.error("Failed to load contact info:", err);
    });
  }, []);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const verificationStarted = React.useRef(false);

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

  const minSelectableDate = useMemo(() => {
    const today = new Date();
    const minDate = new Date(today);
    if (hasCustomCake) {
      minDate.setDate(today.getDate() + 2);
    } else {
      minDate.setDate(today.getDate() + 1);
    }
    minDate.setHours(0, 0, 0, 0);
    return minDate;
  }, [hasCustomCake]);

  // Get API URL from environment variables with fallback
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://the-cake-loungue.onrender.com').replace(/\/$/, '');

  // Sync selectedDate to deliveryDate state
  useEffect(() => {
    if (selectedDate) {
      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      setDeliveryDate(`${yyyy}-${mm}-${dd}`);
    } else {
      setDeliveryDate('');
    }
  }, [selectedDate]);

  // Load persisted checkout data
  useEffect(() => {
    // Only load if not already set (prevents overwriting defaults if they were just set)
    const savedAddress = sessionStorage.getItem('checkout_address');
    const savedDate = sessionStorage.getItem('checkout_delivery_date');
    const savedSlot = sessionStorage.getItem('checkout_delivery_slot');
    const savedInstructions = sessionStorage.getItem('checkout_delivery_instructions');

    if (savedAddress) setSelectedAddress(JSON.parse(savedAddress));
    if (savedDate) {
      setDeliveryDate(savedDate);
      const parsedDate = new Date(savedDate);
      if (!isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate);
      }
    }
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

  // Handle click outside for desktop calendar popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopCalendarRef.current && !desktopCalendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const isMidnightSlot = useMemo(() => {
    return deliveryTimeSlot === "10:00 PM – 12:00 AM (Midnight Delivery)";
  }, [deliveryTimeSlot]);

  const midnightCharge = useMemo(() => {
    return isMidnightSlot ? 150 : 0;
  }, [isMidnightSlot]);

  const shippingFee = useMemo(() => cartTotal >= 499 ? 0 : 50, [cartTotal]);
  const finalTotal = useMemo(() => cartTotal + shippingFee + midnightCharge, [cartTotal, shippingFee, midnightCharge]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setErrorMessage('Your cart is empty!');
      return;
    }
    if (!selectedAddress) {
      setErrorMessage('Please select or add a delivery address.');
      return;
    }
    if (!isServiceableZipCode(selectedAddress.zipCode)) {
      setErrorMessage('Sorry, we currently deliver only within Gurugram. Please select or add an address with a serviceable Gurugram Zip Code.');
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
          deliveryDate,
          deliveryTimeSlot,
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
              midnightCharge,
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
                  {/* Modern Date Picker Calendar Component */}
                  <div className="relative" ref={desktopCalendarRef}>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-deep pointer-events-none z-10">
                      <Calendar size={18} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className="w-full text-left pl-12 pr-6 py-4 bg-cream rounded-[22px] border-2 border-transparent focus:border-rose-deep outline-none transition-all font-bold text-chocolate"
                    >
                      {selectedDate ? (
                        selectedDate.toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })
                      ) : (
                        <span className="text-text-soft font-normal">Select Delivery Date</span>
                      )}
                    </button>

                    <AnimatePresence>
                      {isCalendarOpen && (
                        <>
                          {/* Desktop Popover Calendar */}
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="hidden md:block absolute left-0 top-full mt-2 bg-white rounded-[28px] p-4 shadow-xl border border-cream z-[500]"
                          >
                            <DatePicker
                              selected={selectedDate}
                              onChange={(date: Date | null) => {
                                setSelectedDate(date);
                                setIsCalendarOpen(false);
                              }}
                              inline
                              minDate={minSelectableDate}
                            />
                          </motion.div>

                          {/* Mobile Bottom Sheet Modal */}
                          <div className="md:hidden">
                            {/* Backdrop */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setIsCalendarOpen(false)}
                              className="fixed inset-0 bg-black/40 z-[550]"
                            />
                            {/* Bottom Sheet */}
                            <motion.div
                              initial={{ y: '100%' }}
                              animate={{ y: 0 }}
                              exit={{ y: '100%' }}
                              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                              className="fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-[40px] p-6 pb-10 shadow-2xl border-t border-cream z-[600] flex flex-col items-center"
                            >
                              <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-6" />
                              <h4 className="text-lg font-bold text-chocolate mb-4 font-playfair">Select Delivery Date</h4>
                              <DatePicker
                                selected={selectedDate}
                                onChange={(date: Date | null) => {
                                  setSelectedDate(date);
                                  setIsCalendarOpen(false);
                                }}
                                inline
                                minDate={minSelectableDate}
                              />
                              <button
                                type="button"
                                onClick={() => setIsCalendarOpen(false)}
                                className="mt-6 w-full py-4 bg-chocolate text-white rounded-[22px] font-bold"
                              >
                                Close
                              </button>
                            </motion.div>
                          </div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Time Slot dropdown */}
                  <div className="relative">
                    <select
                      value={deliveryTimeSlot}
                      onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                      required
                      disabled={!selectedDate}
                      className="w-full px-6 py-4 bg-cream rounded-[22px] border-2 border-transparent focus:border-rose-deep outline-none transition-all font-bold text-chocolate appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {selectedDate ? "Select Time Slot" : "Select delivery date first"}
                      </option>
                      {selectedDate && DELIVERY_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
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
              </div>

              {/* Premium Same-Day Delivery & WhatsApp Layout Card */}
              <div className="bg-green-50/60 rounded-[30px] p-6 border-2 border-green-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-[#25d366] rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
                    <MessageSquare size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-green-800 text-lg flex items-center gap-2">
                      🚨 Need Same-Day Delivery?
                    </h4>
                    <p className="text-sm text-green-700 font-medium">
                      Same-day delivery is not available through online checkout.
                    </p>
                    <p className="text-xs text-green-600 font-bold">
                      Please contact us on WhatsApp. Our team will check availability and assist you manually.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center justify-center">
                  <a
                    href={`https://wa.me/${contactWhatsapp}?text=${encodeURIComponent("Hello, I would like to enquire about Same-Day Delivery.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-4 bg-[#25d366] text-white rounded-[22px] font-bold shadow-md hover:bg-[#128c7e] transition-all hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    <MessageSquare size={18} />
                    Contact WhatsApp
                  </a>
                </div>
              </div>

              {/* Midnight Delivery Notice Card */}
              {isMidnightSlot && (
                <div className={`p-6 rounded-[30px] border-2 transition-all duration-300 ${
                  isMidnightSlot
                    ? "bg-rose-50/80 border-rose-deep shadow-md scale-[1.02]"
                    : "bg-amber-50/50 border-amber-200"
                }`}>
                  <div className="flex gap-4 items-start">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      isMidnightSlot
                        ? "bg-rose-deep text-white animate-pulse"
                        : "bg-amber-500 text-white"
                    }`}>
                      <AlertCircle size={24} />
                    </div>
                    <div className="space-y-1">
                      <h4 className={`font-bold text-lg ${
                        isMidnightSlot
                          ? "text-rose-900"
                          : "text-amber-800"
                      }`}>
                        ⚠ IMPORTANT — Midnight Delivery
                      </h4>
                      <p className={`text-sm font-medium ${
                        isMidnightSlot
                          ? "text-rose-700"
                          : "text-amber-700"
                      }`}>
                        10:00 PM – 12:00 AM is considered a Midnight Delivery.
                      </p>
                      <p className={`text-xs font-bold ${
                        isMidnightSlot
                          ? "text-rose-600"
                          : "text-amber-600"
                      }`}>
                        {isMidnightSlot
                          ? "🎉 Midnight Slot Selected! Additional ₹150 charge has been added to your order summary."
                          : "Additional delivery charges (₹150) will apply if this slot is selected."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                    <div
                      onClick={() => router.push(`/shop/${item.id}`)}
                      className="relative w-20 h-20 rounded-[22px] bg-cream overflow-hidden flex-shrink-0 border border-cream cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div
                      onClick={() => router.push(`/shop/${item.id}`)}
                      className="flex-1 min-w-0 flex flex-col justify-center cursor-pointer group/item"
                    >
                      <h4 className="text-sm font-bold text-chocolate line-clamp-1 group-hover/item:text-rose-deep transition-colors">{item.name}</h4>

                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[10px] text-text-soft font-bold">
                          Weight: {item.weight || '0.5 Kg'}
                        </span>
                        {item.serves && (
                          <span className="text-[10px] text-rose-deep font-bold bg-cream-dark/40 px-1.5 py-0.5 rounded">
                            Serves: {item.serves}
                          </span>
                        )}
                        {item.flavor && (
                          <span className="text-[10px] text-chocolate/60 font-bold bg-cream px-1.5 py-0.5 rounded border border-cream-dark/40">
                            {item.flavor}
                          </span>
                        )}
                      </div>

                      {item.message && (
                        <div className="mt-2 bg-cream-dark/30 border border-cream-dark/50 p-2 rounded-xl text-[11px] self-start">
                          <span className="block text-[8px] font-black text-text-soft uppercase tracking-wider mb-0.5">Cake Message</span>
                          <span className="font-bold text-rose-deep italic">&ldquo;{item.message}&rdquo;</span>
                        </div>
                      )}

                      <p className="text-xs text-text-soft mt-2 font-medium">Quantity: {item.quantity}</p>
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
                {isMidnightSlot && (
                  <div className="flex justify-between text-text-mid bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                    <span className="text-sm font-bold text-rose-deep flex items-center gap-2">
                      <Clock size={14} />
                      Midnight Delivery Charge
                    </span>
                    <span className="font-bold text-rose-deep">₹150</span>
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
                disabled={loading || cart.length === 0 || !selectedAddress || !isServiceableZipCode(selectedAddress.zipCode) || !deliveryDate || !deliveryTimeSlot}
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

              {(!selectedAddress || (selectedAddress && !isServiceableZipCode(selectedAddress.zipCode)) || !deliveryDate || !deliveryTimeSlot) && cart.length > 0 && (
                <p className="mt-4 text-rose-deep text-xs font-bold text-center">
                  * Please select {
                    (!selectedAddress && !deliveryDate && !deliveryTimeSlot)
                    ? 'address, date and time slot'
                    : !selectedAddress
                    ? 'a delivery address'
                    : (selectedAddress && !isServiceableZipCode(selectedAddress.zipCode))
                    ? 'a serviceable Gurugram address'
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
