"use client";

import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '@/types/admin';

interface ReviewStatsProps {
  reviews: Review[];
}

const ReviewStats: React.FC<ReviewStatsProps> = ({ reviews }) => {
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.floor(r.rating) === star).length
  }));

  return (
    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-cream mb-16 animate-fade-up">
      <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
        {/* Left: Big Score */}
        <div className="text-center lg:text-left lg:border-r border-cream lg:pr-12">
          <div className="text-[5rem] font-playfair font-black text-chocolate leading-none mb-2">
            {avgRating}
          </div>
          <div className="flex justify-center lg:justify-start gap-1 text-gold mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                fill={i < Math.floor(Number(avgRating)) ? "currentColor" : "none"}
                className={i < Math.floor(Number(avgRating)) ? "text-gold" : "text-cream-dark"}
              />
            ))}
          </div>
          <p className="text-text-soft font-bold uppercase tracking-widest text-xs">
            Based on {totalReviews} verified reviews
          </p>
        </div>

        {/* Right: Distribution Bars */}
        <div className="flex-1 space-y-3">
          {ratingCounts.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-4 group">
              <div className="flex items-center gap-1 w-12 shrink-0">
                <span className="text-sm font-bold text-chocolate">{star}</span>
                <Star size={14} className="text-gold fill-current" />
              </div>
              <div className="flex-1 h-3 bg-cream-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                  style={{ width: `${totalReviews > 0 ? (count / totalReviews) * 100 : 0}%` }}
                />
              </div>
              <div className="w-12 text-right">
                <span className="text-xs font-bold text-text-soft">{count}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Far Right: Badge */}
        <div className="hidden xl:flex flex-col items-center justify-center bg-cream-dark/30 rounded-[20px] p-6 border border-cream border-dashed">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm">
            <Star size={32} className="text-gold fill-current" />
          </div>
          <p className="text-chocolate font-bold text-center text-sm">100% Verified<br/>Customers</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;
