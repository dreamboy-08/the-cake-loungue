"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MessageSquare } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';

const Testimonials = () => {
  const { testimonials, loading } = useCMS();

  // Sort and filter active testimonials
  const activeTestimonials = (testimonials || [])
    .filter((t) => t.enabled)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const getInitials = (name: string) => {
    if (!name) return 'C';
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  if (loading) {
    return (
      <section id="testimonials" className="py-[100px] bg-cream-dark">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-pulse">
            <p className="section-label">Happy Customers</p>
            <h2 className="section-title">Loading Testimonials...</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-[100px] bg-cream-dark">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <p className="section-label">Happy Customers</p>
          <h2 className="section-title">What People Are Saying</h2>
        </div>

        {activeTestimonials.length === 0 ? (
          <div className="text-center py-12 max-w-md mx-auto">
            <p className="text-text-mid mb-6 font-medium">Be the first to share your sweet experience with us!</p>
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 bg-rose-deep text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown transition-all hover:scale-105 active:scale-95"
            >
              <MessageSquare size={18} />
              <span>Write a Review</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-[50px]">
              {activeTestimonials.map((review) => (
                <div key={review.id} className="bg-white rounded-[14px] p-8 shadow-sm transition-all duration-350 relative hover:translate-y-[-6px] hover:shadow-md before:content-['\201C'] before:font-playfair before:text-[6rem] before:text-cream-dark before:absolute before:top-2.5 before:left-5 before:leading-none flex flex-col justify-between">
                  <div>
                    <div className="flex gap-[3px] text-gold text-[0.9rem] mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={16} fill={j < Math.floor(review.rating) ? "currentColor" : "none"} className={j < Math.floor(review.rating) ? "text-gold" : "text-text-soft/30"} />
                      ))}
                    </div>
                    <p className="text-[0.9rem] text-text-mid leading-[1.75] relative z-10 mb-6 italic">
                      &quot;{review.text}&quot;
                    </p>
                  </div>
                  <div className="flex items-center gap-[14px]">
                    {review.avatar ? (
                      <div className="w-[46px] h-[46px] rounded-full overflow-hidden border-2 border-blush relative shrink-0">
                        <Image src={review.avatar} alt={review.name} fill sizes="46px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-[46px] h-[46px] rounded-full bg-rose/10 border-2 border-blush flex items-center justify-center text-rose-deep font-bold text-sm shrink-0 uppercase">
                        {getInitials(review.name)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <div className="text-[0.9rem] font-semibold text-chocolate">{review.name}</div>
                        {review.verified && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-green-50 text-green-600 border border-green-100">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      {review.tag && <div className="text-[0.75rem] text-text-soft">{review.tag}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 bg-rose-deep text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown transition-all hover:scale-105 active:scale-95"
              >
                <MessageSquare size={18} />
                <span>Write a Review</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
