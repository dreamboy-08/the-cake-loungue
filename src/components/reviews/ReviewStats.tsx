"use client";

import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { Star, Users, ThumbsUp, ShieldCheck } from 'lucide-react';
import { ReviewStats } from '@/types/review';

interface ReviewStatsDisplayProps {
  stats: ReviewStats;
}

const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span className="tabular-nums">
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
};

const ReviewStatsDisplay: React.FC<ReviewStatsDisplayProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center gap-3 group hover:border-rose/20 transition-all"
      >
        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
          <Star size={32} fill="currentColor" />
        </div>
        <div>
          <div className="text-4xl font-black text-chocolate flex items-baseline justify-center gap-1">
            <span>{stats.averageRating.toFixed(1)}</span>
            <span className="text-xl text-gray-300">/5</span>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Average Rating</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center gap-3 group hover:border-rose/20 transition-all"
      >
        <div className="w-14 h-14 bg-rose/5 rounded-2xl flex items-center justify-center text-rose-deep group-hover:scale-110 transition-transform">
          <Users size={32} />
        </div>
        <div>
          <div className="text-4xl font-black text-chocolate">
            <AnimatedCounter value={stats.totalReviews} suffix="+" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Happy Customers</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center gap-3 group hover:border-rose/20 transition-all"
      >
        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
          <ThumbsUp size={32} />
        </div>
        <div>
          <div className="text-4xl font-black text-chocolate">
            <AnimatedCounter value={stats.recommendedPercentage} suffix="%" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Recommended</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center gap-3 group hover:border-rose/20 transition-all"
      >
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
          <ShieldCheck size={32} />
        </div>
        <div>
          <div className="text-2xl font-black text-chocolate mt-2">100% Secure</div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Verified Reviews</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewStatsDisplay;
