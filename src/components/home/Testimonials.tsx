"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { DEFAULT_TESTIMONIALS_SETTINGS } from '@/constants/cmsDefaults';

const Testimonials = () => {
  const { testimonialsSettings, loading } = useCMS();

  const settings = (loading || !testimonialsSettings) ? DEFAULT_TESTIMONIALS_SETTINGS : testimonialsSettings;

  const sortedItems = useMemo(() => {
    return [...(settings.items || [])].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [settings.items]);

  if (!settings.enabled) {
    return null;
  }

  return (
    <section id="testimonials" className="py-[100px] bg-cream-dark">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <p className="section-label">{settings.subtitle || 'Happy Customers'}</p>
          <h2 className="section-title">{settings.title || 'What People Are Saying'}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-[50px]">
          {sortedItems.map((review, i) => (
            <div
              key={review.id || i}
              className="bg-white rounded-[14px] p-8 shadow-sm transition-all duration-350 relative hover:translate-y-[-6px] hover:shadow-md before:content-['\201C'] before:font-playfair before:text-[6rem] before:text-cream-dark before:absolute before:top-2.5 before:left-5 before:leading-none"
            >
              <div className="flex gap-[3px] text-gold text-[0.9rem] mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    size={16}
                    fill={j < Math.floor(review.rating) ? "currentColor" : "none"}
                    className={j < Math.floor(review.rating) ? "text-gold" : "text-text-soft/30"}
                  />
                ))}
              </div>
              <p className="text-[0.9rem] text-text-mid leading-[1.75] relative z-10 mb-6 font-medium">
                &quot;{review.text}&quot;
              </p>
              <div className="flex items-center gap-[14px]">
                <div className="w-[46px] h-[46px] rounded-full overflow-hidden border-2 border-blush relative">
                  {review.avatar && (
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      sizes="46px"
                      className="object-cover"
                      unoptimized={review.avatar.startsWith('data:') || review.avatar.startsWith('http')}
                    />
                  )}
                </div>
                <div>
                  <div className="text-[0.9rem] font-semibold text-chocolate">{review.name}</div>
                  <div className="text-[0.75rem] text-text-soft">{review.tag}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
