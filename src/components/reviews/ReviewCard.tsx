"use client";

import React, { useState } from 'react';
import { Star, CheckCircle2, ThumbsUp, User, Reply } from 'lucide-react';
import { Review } from '@/types/review';
import { updateHelpfulCount } from '@/utils/reviewService';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ReviewCardProps {
  review: Review;
  isFeatured?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, isFeatured = false }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpful = async () => {
    if (hasVoted) return;
    setHasVoted(true);
    setHelpfulCount(prev => prev + 1);
    await updateHelpfulCount(review.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col gap-6 relative transition-all duration-300 hover:shadow-md ${isFeatured ? 'scale-105 border-rose/20' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-rose/10 flex items-center justify-center border-2 border-white shadow-sm relative">
            {review.userAvatar && !review.isAnonymous ? (
              <Image src={review.userAvatar} alt={review.userName} fill className="object-cover" />
            ) : (
              <User size={24} className="text-rose-deep" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-chocolate text-sm">{review.userName}</span>
              {review.isVerified && (
                <span className="flex items-center gap-1 text-[8px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full uppercase tracking-widest">
                  <CheckCircle2 size={10} /> Verified
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 font-medium">
              {new Date(review.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < review.rating ? "text-gold fill-gold" : "text-gray-100"}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-bold text-chocolate">{review.title}</h4>
        <p className="text-sm text-text-mid leading-relaxed italic">
          &quot;{review.message}&quot;
        </p>
      </div>

      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.images.map((img, idx) => (
            <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100">
              <Image src={img} alt={`Review ${idx}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {review.adminReply && (
        <div className="bg-cream-dark/30 p-5 rounded-2xl space-y-2 border border-cream/50 mt-2">
          <div className="flex items-center gap-2 text-[9px] font-black text-rose-deep uppercase tracking-widest">
            <Reply size={10} className="rotate-180" /> Response from The Cake Lounge
          </div>
          <p className="text-xs text-chocolate font-medium italic">{review.adminReply}</p>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleHelpful}
            disabled={hasVoted}
            className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${
              hasVoted ? 'text-green-500' : 'text-gray-400 hover:text-chocolate'
            }`}
          >
            <ThumbsUp size={14} className={hasVoted ? 'fill-current' : ''} />
            Helpful {helpfulCount > 0 && `(${helpfulCount})`}
          </button>
        </div>
        {review.productName && (
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Cake: {review.productName}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ReviewCard;
