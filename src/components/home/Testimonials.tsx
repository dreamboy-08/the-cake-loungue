"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageSquare, Star } from 'lucide-react';
import ReviewCard from '@/components/reviews/ReviewCard';
import { Review } from '@/types/review';
import { db } from '@/utils/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';

const Testimonials = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('status', '==', 'approved'),
      where('isFeatured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Review));
      setReviews(fetchedReviews);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching featured reviews:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading || reviews.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [loading, reviews.length, isHovered]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (loading) {
    return (
      <section className="py-24 bg-cream-dark/30">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-64 bg-gray-200 mx-auto rounded-full" />
            <div className="h-12 w-96 bg-gray-200 mx-auto rounded-full" />
            <div className="max-w-4xl mx-auto h-[400px] bg-white rounded-[40px]" />
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-cream-dark/30 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose/10 rounded-full text-rose-deep text-[10px] font-black uppercase tracking-widest">
            <MessageSquare size={14} /> Happy Customers
          </div>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-chocolate">
            Voices of Delight
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover why thousands of customers trust The Cake Lounge for their most precious celebrations.
          </p>
        </div>

        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Carousel Area */}
          <div className="relative overflow-visible px-4 py-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50) handleNext();
                  if (info.offset.x > 50) handlePrev();
                }}
                className="w-full cursor-grab active:cursor-grabbing"
              >
                <ReviewCard review={reviews[currentIndex]} isFeatured={true} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={handlePrev}
              className="p-4 bg-white rounded-2xl text-chocolate shadow-sm border border-gray-100 hover:bg-rose-deep hover:text-white hover:-translate-x-1 transition-all group"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex gap-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'w-8 bg-rose-deep' : 'w-2 bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-4 bg-white rounded-2xl text-chocolate shadow-sm border border-gray-100 hover:bg-rose-deep hover:text-white hover:translate-x-1 transition-all group"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-3 px-10 py-5 bg-chocolate text-white rounded-[24px] font-bold text-lg shadow-xl shadow-chocolate/20 hover:bg-brown transition-all hover:translate-y-[-2px]"
          >
            Read All Reviews
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
