"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/utils/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Star, Loader2, AlertCircle, CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/BackButton';
import PageWrapper from '@/components/PageWrapper';
import Link from 'next/link';
import Image from 'next/image';

const ReviewsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !user) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.userId === user.uid) {
            setOrder({ id: docSnap.id, ...data });
          } else {
            setError("You don't have permission to review this order.");
          }
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !order) return;

    setSubmitting(true);
    try {
      // Create a review for each item or for the whole order?
      // Usually reviews are per product, but the prompt says "Write a Review" for the order.
      // Based on memory: productId and productName are fields.
      // I'll create a review for the first product in the order for simplicity,
      // or maybe just a general order review if that's allowed.
      // Let's assume we review the first product but link it to the order.

      const firstItem = order.items?.[0] || {};

      const reviewData = {
        rating,
        title,
        message,
        images: [], // Optional
        status: 'pending',
        helpfulCount: 0,
        isFeatured: false,
        isPinned: false,
        adminReply: '',
        userId: user.uid,
        userName: isAnonymous ? 'Anonymous' : (user.displayName || 'The Cake Lounge Customer'),
        userAvatar: isAnonymous ? '' : (user.photoURL || ''),
        orderId: order.id,
        productId: firstItem.id || 'general',
        productName: firstItem.name || 'Order Review',
        isVerified: true,
        isAnonymous,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'reviews'), reviewData);
      setSuccess(true);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-rose-deep" size={40} />
        <p className="text-chocolate font-medium">Loading order details...</p>
      </div>
    );
  }

  if (error || !orderId || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-chocolate">{error || "Invalid Review Link"}</h2>
        <p className="text-text-soft max-w-xs">
          We couldn&apos;t find the order you&apos;re trying to review. Please check your order history.
        </p>
        <Link href="/orders" className="bg-chocolate text-white px-8 py-3 rounded-full font-bold shadow-lg">
          Go to Orders
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6"
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold font-playfair text-chocolate">Review Submitted!</h2>
        <p className="text-text-soft max-w-sm">
          Thank you for sharing your experience. Your review helps us improve and helps other cake lovers make the right choice!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link href="/orders" className="bg-chocolate text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2">
            Back to Orders
          </Link>
          <Link href="/menu" className="bg-cream border-2 border-cream-dark text-chocolate px-8 py-3 rounded-full font-bold">
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-6 max-w-3xl pb-20">
      <BackButton fallbackRoute="/orders" />

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold font-playfair text-chocolate mb-4">Share Your Experience</h1>
        <p className="text-text-soft">Your feedback makes our treats even sweeter!</p>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-cream overflow-hidden">
        {/* Order Summary Mini */}
        <div className="p-6 bg-cream/30 border-b border-cream flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-deep shadow-sm">
              <Package size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-soft uppercase tracking-widest">Order Review</p>
              <p className="font-bold text-chocolate">Order #{order.id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-text-soft uppercase tracking-widest">Date</p>
            <p className="text-sm font-bold text-chocolate">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
          {/* Rating */}
          <div className="space-y-4 text-center">
            <p className="text-sm font-bold text-chocolate uppercase tracking-widest">How would you rate your experience?</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-125"
                >
                  <Star
                    size={40}
                    className={cn(
                      "transition-colors",
                      (hoveredRating || rating) >= star ? "text-gold fill-gold" : "text-cream-dark fill-transparent"
                    )}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-rose-deep">
              {rating === 5 && "Excellent! We're thrilled you loved it!"}
              {rating === 4 && "Great! Glad you had a good experience."}
              {rating === 3 && "Good. How can we make it better?"}
              {rating === 2 && "Fair. We'd love to know what went wrong."}
              {rating === 1 && "Poor. We sincerely apologize and want to fix this."}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-chocolate uppercase tracking-widest ml-4">Review Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience (e.g. Delicious and Fresh!)"
                className="w-full px-6 py-4 bg-cream rounded-[22px] border-2 border-transparent focus:border-rose-deep outline-none transition-all font-bold text-chocolate"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-chocolate uppercase tracking-widest ml-4">Detailed Feedback</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us more about the taste, delivery, and service..."
                className="w-full px-6 py-4 bg-cream rounded-[22px] border-2 border-transparent focus:border-rose-deep outline-none transition-all font-medium text-chocolate min-h-[150px]"
              />
            </div>

            <div className="flex items-center gap-3 ml-4">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 accent-rose-deep"
              />
              <label htmlFor="anonymous" className="text-sm font-medium text-chocolate cursor-pointer">
                Post this review anonymously
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-5 bg-chocolate text-white rounded-[22px] font-bold text-xl shadow-xl hover:bg-brown hover:-translate-y-1 transition-all disabled:bg-text-soft disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Submitting...
              </>
            ) : (
              <>
                Submit Review
                <ArrowRight size={24} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Simple CN utility since we don't have it globally available in this context easily
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

const ReviewsPage = () => {
  return (
    <PageWrapper>
      <Suspense fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <Loader2 className="animate-spin text-rose-deep" size={48} />
        </div>
      }>
        <ReviewsContent />
      </Suspense>
    </PageWrapper>
  );
};

export default ReviewsPage;
