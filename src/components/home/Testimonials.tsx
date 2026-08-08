"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Star, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Testimonials = () => {
  const reviews = [
    {
      name: "Priya Sharma",
      tag: "Loyal Customer",
      location: "DLF Phase 5, Gurugram",
      date: "May 12, 2024",
      avatar: "https://i.pravatar.cc/100?img=47",
      text: "Ordered a custom birthday cake for my daughter and I was absolutely blown away. The attention to detail was incredible — it looked exactly like the design I requested, and it tasted even better!",
      rating: 5,
    },
    {
      name: "Rohan Mehta",
      tag: "Verified Buyer",
      location: "Golf Course Road, Gurugram",
      date: "April 28, 2024",
      avatar: "https://i.pravatar.cc/100?img=12",
      text: "The Belgian chocolate truffle cake was an absolute showstopper at our anniversary dinner. Our guests couldn't stop talking about it. Delivery was on time and packaging was beautiful!",
      rating: 5,
    },
    {
      name: "Ananya Kapoor",
      tag: "Premium Member",
      location: "Sohna Road, Gurugram",
      date: "March 15, 2024",
      avatar: "https://i.pravatar.cc/100?img=32",
      text: "I've ordered from La Douceur 5 times now — red velvet, mango mousse, tiramisu — every single one is perfection. This is my go-to bakery for every celebration!",
      rating: 5,
    },
    {
      name: "Kabir Malhotra",
      tag: "Verified Buyer",
      location: "Sector 54, Gurugram",
      date: "February 10, 2024",
      avatar: "https://i.pravatar.cc/100?img=15",
      text: "A truly transcendent gourmet experience. The Lotus Biscoff cake was perfectly balanced, not overly sweet, with incredibly rich textures. The delivery packaging was pure luxury.",
      rating: 5,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Mobile swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (diffX > 50) {
      handleNext();
    } else if (diffX < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-cream border-t border-cream-dark/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

        {/* Section Heading with Luxury Spacing */}
        <div className="text-center space-y-3 mb-12 md:mb-16">
          <p className="text-[10px] md:text-[11px] font-bold text-rose-deep tracking-[0.25em] uppercase font-poppins">Gourmet Stories</p>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-chocolate leading-tight">Client Testimonials</h2>
          <div className="w-12 h-[2px] bg-gold mx-auto mt-4" />
        </div>

        {/* Carousel / Swipe Viewport */}
        <div
          className="relative max-w-4xl mx-auto"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Card Viewport */}
          <div className="relative min-h-[340px] md:min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-white rounded-[32px] p-6 sm:p-10 md:p-12 shadow-luxury-md border border-cream-dark/15 flex flex-col justify-between h-full"
              >
                {/* Rating & Verified badge row */}
                <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                  <div className="flex items-center text-gold gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={15} fill="currentColor" />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-100">
                    <CheckCircle size={12} className="fill-green-700 text-white" />
                    <span>Verified Gourmet Review</span>
                  </div>
                </div>

                {/* Review Text */}
                <blockquote className="font-playfair text-lg sm:text-xl md:text-2xl text-chocolate leading-relaxed italic mb-8 relative">
                  &ldquo;{reviews[activeIndex].text}&rdquo;
                </blockquote>

                {/* Customer Details Row */}
                <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-cream-dark/20">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold shadow-sm">
                      <Image
                        src={reviews[activeIndex].avatar}
                        alt={reviews[activeIndex].name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-[14px] sm:text-base font-bold text-chocolate leading-none mb-1 font-poppins">
                        {reviews[activeIndex].name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-text-soft font-medium font-poppins">
                        <span>{reviews[activeIndex].tag}</span>
                        <span>•</span>
                        <span>{reviews[activeIndex].location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Elegant Date */}
                  <div className="text-[11px] text-text-soft font-semibold tracking-wider font-poppins uppercase">
                    {reviews[activeIndex].date}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Elegant Carousel Navigation Controls */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full border border-cream-dark/60 bg-white text-chocolate hover:bg-chocolate hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Slider Dots */}
            <div className="flex gap-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === idx ? 'w-8 bg-chocolate' : 'w-2 bg-cream-dark hover:bg-text-soft'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full border border-cream-dark/60 bg-white text-chocolate hover:bg-chocolate hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;
