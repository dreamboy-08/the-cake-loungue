"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Star } from 'lucide-react';
import ReviewFormModal from './ReviewFormModal';

interface ReviewRequestModalProps {
  orderId?: string;
  productName?: string;
  productId?: string;
}

const ReviewRequestModal: React.FC<ReviewRequestModalProps> = ({
  orderId,
  productName,
  productId
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen/dismissed this for this order
    const hasDismissed = localStorage.getItem(`review_prompt_dismissed_${orderId}`);

    if (!hasDismissed) {
      // Show after a small delay for elegance
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [orderId]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (orderId) {
      localStorage.setItem(`review_prompt_dismissed_${orderId}`, 'true');
    }
  };

  const handleWriteReview = () => {
    setIsVisible(false);
    setIsReviewFormOpen(true);
    if (orderId) {
      localStorage.setItem(`review_prompt_dismissed_${orderId}`, 'true');
    }
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-6 right-6 z-[500] w-[calc(100%-48px)] max-w-sm"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-cream overflow-hidden">
              <div className="p-6 relative">
                <button
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 text-gray-400 hover:text-chocolate transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-rose/10 rounded-full flex items-center justify-center text-rose-deep">
                    <Heart size={32} fill="currentColor" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-playfair font-bold text-xl text-chocolate">
                      Enjoying your cake? ❤️
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Thank you for choosing The Cake Lounge. Your feedback helps other customers and helps us improve.
                    </p>
                  </div>

                  <div className="flex flex-col w-full gap-2 mt-2">
                    <button
                      onClick={handleWriteReview}
                      className="w-full bg-chocolate text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-chocolate/20 hover:bg-brown transition-all flex items-center justify-center gap-2"
                    >
                      <Star size={16} fill="currentColor" />
                      Write a Review
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="w-full py-3 text-gray-400 hover:text-chocolate font-bold text-sm transition-colors"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReviewFormModal
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
        orderId={orderId}
        productId={productId}
        productName={productName}
      />
    </>
  );
};

export default ReviewRequestModal;
