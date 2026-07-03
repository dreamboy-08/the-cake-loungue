"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Star, MessageSquare, ChevronLeft, ChevronRight, CheckCircle2, MessageCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { db } from '@/utils/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Review } from '@/types/admin';
import ReviewFormModal from './ReviewFormModal';
import ReviewStats from './ReviewStats';
import ReviewSkeleton from './ReviewSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = {
  mobile: 1,
  tablet: 2,
  desktop: 3
};

const Testimonials = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const fetchReviews = useCallback(() => {
    setLoading(true);
    setError(null);

    const q = query(
      collection(db, 'reviews'),
      where('status', '==', 'Approved'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const fetchedReviews = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Review[];
        setReviews(fetchedReviews);
        setLoading(false);
      } catch (err) {
        console.error("Firestore error:", err);
        setError("Unable to load reviews right now.");
        setLoading(false);
      }
    }, (err) => {
      console.error("Snapshot error:", err);
      setError("Unable to load reviews right now.");
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = fetchReviews();
    return () => unsubscribe();
  }, [fetchReviews]);

  // Carousel Logic
  const [visibleItems, setVisibleItems] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setVisibleItems(ITEMS_PER_PAGE.mobile);
      else if (window.innerWidth < 1024) setVisibleItems(ITEMS_PER_PAGE.tablet);
      else setVisibleItems(ITEMS_PER_PAGE.desktop);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.max(0, reviews.length - visibleItems + 1);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1 >= totalPages ? 0 : prev + 1));
  }, [totalPages]);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 < 0 ? Math.max(0, totalPages - 1) : prev - 1));
  };

  useEffect(() => {
    if (isPaused || loading || reviews.length <= visibleItems) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, loading, reviews.length, visibleItems]);

  return (
    <section id="testimonials" className="py-[100px] bg-cream-dark overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-center md:text-left">
            <p className="section-label">Happy Customers</p>
            <h2 className="section-title mb-0">What People Are Saying</h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-chocolate text-white rounded-full font-bold text-sm shadow-xl shadow-chocolate/20 hover:bg-rose-deep hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mx-auto md:mx-0"
          >
            <MessageSquare size={18} />
            Write a Review
          </button>
        </div>

        {loading ? (
          <>
            <div className="h-48 w-full bg-white/50 rounded-[32px] animate-pulse mb-16" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <ReviewSkeleton key={i} />)}
            </div>
          </>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-[32px] border border-red-100 shadow-sm">
            <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
            <p className="text-chocolate font-bold mb-6">{error}</p>
            <button
              onClick={() => fetchReviews()}
              className="px-6 py-3 bg-cream text-chocolate rounded-full font-bold text-sm hover:bg-white transition-all flex items-center gap-2 mx-auto border border-cream"
            >
              <RotateCcw size={16} /> Retry
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[40px] border border-cream shadow-sm max-w-3xl mx-auto px-8">
            <div className="w-24 h-24 bg-cream-dark rounded-full flex items-center justify-center mx-auto mb-8">
              <Star className="text-gold fill-current" size={40} />
            </div>
            <h3 className="text-2xl font-playfair font-bold text-chocolate mb-3">No customer reviews yet</h3>
            <p className="text-text-soft font-medium mb-10 leading-relaxed">
              Be the first customer to share your experience with The Cake Lounge. Your feedback helps us grow and perfect our craft!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-5 bg-rose-deep text-white rounded-full font-bold shadow-lg shadow-rose-deep/20 hover:bg-chocolate transition-all"
            >
              Write a Review
            </button>
          </div>
        ) : (
          <>
            <ReviewStats reviews={reviews} />

            <div
              className="relative group"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="overflow-hidden px-1 py-10 -m-1">
                <motion.div
                  className="flex gap-6"
                  animate={{ x: `calc(-${activeIndex * (100 / visibleItems)}% - ${activeIndex * (24 / visibleItems)}px)` }}
                  transition={{ type: "spring", damping: 30, stiffness: 150 }}
                >
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="min-w-full md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] flex flex-col"
                    >
                      <div className="bg-white rounded-[14px] p-8 shadow-sm transition-all duration-350 relative hover:translate-y-[-6px] hover:shadow-md before:content-['\201C'] before:font-playfair before:text-[6rem] before:text-cream-dark before:absolute before:top-2.5 before:left-5 before:leading-none flex flex-col h-full border border-transparent hover:border-blush/20">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                          <div className="flex gap-[3px] text-gold text-[0.9rem]">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} size={16} fill={j < Math.floor(review.rating) ? "currentColor" : "none"} className={j < Math.floor(review.rating) ? "text-gold" : "text-text-soft/30"} />
                            ))}
                          </div>
                          {review.isVerified && (
                            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter bg-green-50 text-green-600 px-2 py-1 rounded-full border border-green-100">
                              <CheckCircle2 size={10} /> Verified Purchase
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-chocolate mb-2 relative z-10">{review.title}</h4>
                        <p className="text-[0.9rem] text-text-mid leading-[1.75] relative z-10 mb-6 flex-1 italic">
                          &quot;{review.message}&quot;
                        </p>

                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
                            {review.images.map((img, idx) => (
                              <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-cream shrink-0 hover:scale-105 transition-transform">
                                <Image src={img} alt="Review" fill className="object-cover" />
                              </div>
                            ))}
                          </div>
                        )}

                        {review.adminReply && (
                          <div className="mb-6 p-4 bg-cream rounded-2xl border border-rose/5 relative">
                             <div className="flex items-center gap-2 mb-2 text-rose-deep">
                               <MessageCircle size={14} className="fill-current opacity-20" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Bakery Response</span>
                             </div>
                             <p className="text-[0.8rem] text-chocolate font-medium leading-relaxed">
                               {review.adminReply}
                             </p>
                          </div>
                        )}

                        <div className="flex items-center gap-[14px] mt-auto">
                          <div className="w-[46px] h-[46px] rounded-full overflow-hidden border-2 border-blush relative bg-cream flex items-center justify-center text-rose-deep font-bold text-lg shadow-sm">
                            {review.name[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-[0.9rem] font-bold text-chocolate">{review.name}</div>
                            <div className="text-[0.75rem] text-text-soft font-medium">
                              {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Navigation Controls */}
              {totalPages > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-chocolate hover:bg-rose-deep hover:text-white transition-all opacity-0 group-hover:opacity-100 z-20"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-chocolate hover:bg-rose-deep hover:text-white transition-all opacity-0 group-hover:opacity-100 z-20"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Pagination Dots */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`h-1.5 transition-all duration-500 rounded-full ${
                        activeIndex === i ? 'w-8 bg-rose-deep' : 'w-2 bg-rose/20 hover:bg-rose/40'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Testimonials;
