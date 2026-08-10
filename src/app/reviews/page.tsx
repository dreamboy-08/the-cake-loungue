"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCMS } from '@/context/CMSContext';
import { db } from '@/utils/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useSearchParams, useRouter } from 'next/navigation';
import { Star, Loader2, CheckCircle2, AlertCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import { CMSTestimonial } from '@/types/cms';

const ReviewFormContent = () => {
  const { user, userData } = useAuth();
  const { testimonials, updateTestimonials } = useCMS();
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams?.get('orderId') || null;

  // Form states
  const [name, setName] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Order loading states
  const [order, setOrder] = useState<any>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  // Auto-fill user name when available
  useEffect(() => {
    if (user) {
      setName(user.displayName || userData?.displayName || '');
    }
  }, [user, userData]);

  // Check order eligibility and duplicates
  useEffect(() => {
    const checkOrderAndDuplicate = async () => {
      if (!orderId) return;

      // 1. Check if orderId was already reviewed in the testimonials collection
      const hasReviewed = testimonials.some(t => t.orderId === orderId);
      if (hasReviewed) {
        setAlreadyReviewed(true);
        return;
      }

      // 2. Fetch order details to verify purchase
      setOrderLoading(true);
      try {
        const isFirebaseConfigured =
          typeof process !== 'undefined' &&
          process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
          process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your_api_key";

        if (isFirebaseConfigured && user) {
          // Check master orders collection first
          const masterDocRef = doc(db, 'orders', orderId);
          const masterSnap = await getDoc(masterDocRef);

          if (masterSnap.exists() && masterSnap.data().userId === user.uid) {
            setOrder({ id: masterSnap.id, ...masterSnap.data() });
          } else {
            // Check subcollection
            const userDocRef = doc(db, 'users', user.uid, 'orders', orderId);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
              setOrder({ id: userSnap.id, ...userSnap.data() });
            }
          }
        } else {
          // Offline mock check: search localStorage orders if they exist
          const storedOrders = localStorage.getItem('cakeLounge_orders');
          if (storedOrders) {
            const orders = JSON.parse(storedOrders);
            const foundOrder = orders.find((o: any) => o.id === orderId);
            if (foundOrder) {
              setOrder(foundOrder);
            }
          }
        }
      } catch (err) {
        console.error("Error verifying order:", err);
      } finally {
        setOrderLoading(false);
      }
    };

    checkOrderAndDuplicate();
  }, [orderId, testimonials, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validations
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("Please select a rating of at least 1 star.");
      return;
    }
    if (!text.trim() || text.trim().length < 10) {
      setError("Please write a meaningful review (minimum 10 characters).");
      return;
    }
    if (text.trim().length > 500) {
      setError("Review must be less than 500 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Build review record
      const isVerified = !!order && order.status === 'Delivered';

      const newReview: CMSTestimonial = {
        id: 'rev_' + Date.now() + Math.random().toString(36).substring(2, 6),
        name: name.trim(),
        text: text.trim(),
        rating,
        tag: isVerified ? 'Verified Buyer' : undefined,
        enabled: false, // Moderated by default (pending approval)
        status: 'pending',
        verified: isVerified,
        customerId: user?.uid || undefined,
        orderId: orderId || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        displayOrder: testimonials.length, // Put at the end
      };

      // 3. Save to CMS Context
      const updatedList = [...testimonials, newReview];
      await updateTestimonials(updatedList);

      setIsSuccess(true);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Something went wrong while submitting your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success confirmation screen (checked first to prevent state update re-renders from kicking user out of success view)
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[40px] p-8 md:p-12 text-center shadow-sm border border-cream max-w-xl mx-auto space-y-6"
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-lg shadow-green-100">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-playfair text-chocolate">Review Submitted!</h2>
        <p className="text-text-soft leading-relaxed max-w-md mx-auto">
          Thank you for sharing your experience with The Cake Lounge. Your feedback is extremely valuable to our pastry kitchen.
        </p>
        <p className="text-xs text-rose-deep font-bold bg-cream px-4 py-2.5 rounded-2xl inline-block">
          Your review has been sent for moderation and will appear on the storefront once approved!
        </p>
        <div className="flex justify-center gap-4 pt-6">
          <Link href="/menu" className="bg-rose-deep text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown transition-all hover:scale-105 active:scale-95">
            Explore Menu
          </Link>
          <Link href="/" className="bg-cream border border-cream-dark text-chocolate px-8 py-3.5 rounded-full font-bold hover:bg-cream-dark transition-all">
            Go Home
          </Link>
        </div>
      </motion.div>
    );
  }

  // If already reviewed
  if (alreadyReviewed) {
    return (
      <div className="bg-white rounded-[40px] p-8 md:p-12 text-center shadow-sm border border-cream max-w-xl mx-auto space-y-6">
        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto text-yellow-600">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold font-playfair text-chocolate">Review Already Submitted</h2>
        <p className="text-text-soft leading-relaxed">
          You have already shared your feedback for Order #{orderId?.slice(-8).toUpperCase()}. Thank you so much for your support!
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/orders" className="bg-chocolate text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-brown transition-all">
            Back to Orders
          </Link>
          <Link href="/" className="bg-cream border border-cream-dark text-chocolate px-8 py-3 rounded-full font-bold hover:bg-cream-dark transition-all">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // If loading order details
  if (orderLoading) {
    return (
      <div className="bg-white rounded-[40px] py-16 text-center shadow-sm border border-cream max-w-xl mx-auto flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-rose-deep" size={40} />
        <p className="text-chocolate font-medium">Verifying order details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] shadow-sm border border-cream overflow-hidden max-w-2xl mx-auto">
      {/* Banner */}
      <div className="p-8 md:p-10 bg-chocolate text-white relative">
        <p className="text-blush font-bold uppercase tracking-widest text-xs mb-2">Share Your Voice</p>
        <h1 className="text-3xl font-bold font-playfair">Write a Customer Review</h1>
        <p className="text-white/60 text-sm mt-1 leading-relaxed">
          Your feedback helps us continuously perfect our recipes and curation.
        </p>
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700 text-sm font-semibold">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Info Block (for Verified Purchases) */}
        {order && (
          <div className="p-6 rounded-3xl bg-green-50/50 border border-green-100/60 space-y-3">
            <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase tracking-wider">
              <ShoppingBag size={14} />
              <span>Verified Purchase</span>
            </div>
            <div>
              <p className="text-sm font-bold text-chocolate">Reviewing Order #{order.id.slice(-8).toUpperCase()}</p>
              <p className="text-xs text-text-soft">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 -space-x-1 overflow-hidden pt-1">
              {order.items?.map((item: any, idx: number) => (
                <span key={idx} className="text-xs bg-cream border border-cream-dark px-2.5 py-1 rounded-full text-chocolate font-bold">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Name input */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Your Name</label>
          <input
            type="text"
            required
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!!user} // Keep readonly if user is logged in
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>

        {/* Star Rating Select */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Your Rating</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  size={36}
                  fill={star <= (hoverRating || rating) ? "#d4a45a" : "none"}
                  className={star <= (hoverRating || rating) ? "text-gold" : "text-gray-200"}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="text-sm font-black text-chocolate ml-2">
                {rating} / 5 Stars
              </span>
            )}
          </div>
        </div>

        {/* Review Text */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Your Review</label>
            <span className="text-[10px] font-bold text-gray-400">
              {text.length} / 500 characters
            </span>
          </div>
          <textarea
            required
            rows={5}
            maxLength={500}
            placeholder="Tell us about the flavor, freshness, presentation, and your celebratory moment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-semibold text-gray-700 resize-none leading-relaxed"
          />
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-gray-50">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:flex-1 py-4 bg-rose-deep text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-deep/20 hover:bg-brown transition-all flex items-center justify-center gap-2 focus:outline-none"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            <span>Submit Review</span>
          </button>
        </div>
      </form>
    </div>
  );
};

const ReviewsPage = () => {
  return (
    <PageWrapper>
      <div className="container mx-auto px-6 max-w-4xl py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-rose-deep hover:text-brown font-bold text-sm mb-8 group transition-all">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <Suspense fallback={
          <div className="bg-white rounded-[40px] py-16 text-center shadow-sm border border-cream max-w-xl mx-auto flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-rose-deep" size={40} />
            <p className="text-chocolate font-medium">Loading form...</p>
          </div>
        }>
          <ReviewFormContent />
        </Suspense>
      </div>
    </PageWrapper>
  );
};

export default ReviewsPage;
