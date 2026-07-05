"use client";

import React from 'react';
import { motion } from 'framer-motion';

const ReviewSkeleton = () => {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col gap-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-100" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-100 rounded-full" />
            <div className="h-3 w-16 bg-gray-50 rounded-full" />
          </div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-100 rounded-full" />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-5 w-3/4 bg-gray-100 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-50 rounded-full" />
          <div className="h-4 w-5/6 bg-gray-50 rounded-full" />
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
        <div className="h-4 w-20 bg-gray-50 rounded-full" />
        <div className="h-4 w-24 bg-gray-50 rounded-full" />
      </div>
    </div>
  );
};

export default ReviewSkeleton;
