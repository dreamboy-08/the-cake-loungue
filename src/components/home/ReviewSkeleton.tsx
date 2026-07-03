"use client";

import React from 'react';

const ReviewSkeleton = () => {
  return (
    <div className="bg-white rounded-[14px] p-8 shadow-sm relative flex flex-col overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full" />
      </div>

      <div className="flex gap-[3px] mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-cream-dark rounded-full" />
        ))}
      </div>

      <div className="h-5 bg-cream-dark rounded-lg w-3/4 mb-4" />

      <div className="space-y-2 mb-6 flex-1">
        <div className="h-4 bg-cream-dark rounded-lg w-full" />
        <div className="h-4 bg-cream-dark rounded-lg w-full" />
        <div className="h-4 bg-cream-dark rounded-lg w-4/5" />
      </div>

      <div className="flex items-center gap-[14px]">
        <div className="w-[46px] h-[46px] rounded-full bg-cream-dark shrink-0" />
        <div className="space-y-1.5 w-full">
          <div className="h-3.5 bg-cream-dark rounded-lg w-1/3" />
          <div className="h-2.5 bg-cream-dark rounded-lg w-1/4" />
        </div>
      </div>
    </div>
  );
};

export default ReviewSkeleton;
