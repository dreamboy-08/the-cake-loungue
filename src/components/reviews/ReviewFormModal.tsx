"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Upload, Camera, Loader2, CheckCircle2 } from 'lucide-react';
import { uploadToCloudinary } from '@/utils/cloudinary';
import { addReview } from '@/utils/reviewService';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  productId?: string;
  productName?: string;
}

const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  isOpen,
  onClose,
  orderId,
  productId,
  productName
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 4) {
      alert("You can only upload up to 4 images.");
      return;
    }

    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await Promise.all(images.map(img => uploadToCloudinary(img)));
      }

      await addReview({
        rating,
        title,
        message,
        images: imageUrls,
        userId: user?.uid || 'anonymous',
        userName: isAnonymous ? 'Anonymous' : (user?.displayName || 'Guest'),
        userAvatar: isAnonymous ? undefined : (user?.photoURL || undefined),
        orderId,
        productId,
        productName,
        isVerified: !!orderId,
        isAnonymous,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        // Reset form
        setRating(0);
        setTitle('');
        setMessage('');
        setImages([]);
        setPreviews([]);
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen && !isSuccess) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-chocolate/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-chocolate transition-colors z-10"
        >
          <X size={24} />
        </button>

        {isSuccess ? (
          <div className="p-12 text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-playfair font-bold text-chocolate">Review Submitted!</h2>
            <p className="text-gray-500">
              Thank you for your feedback. Your review will be visible once approved by our team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-playfair font-bold text-chocolate">Write a Review</h2>
              <p className="text-sm text-gray-500">How was your experience with The Cake Lounge?</p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    size={32}
                    className={cn(
                      "transition-colors",
                      (hoverRating || rating) >= star ? "text-gold fill-gold" : "text-gray-200"
                    )}
                  />
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Review Title</label>
                <input
                  type="text"
                  required
                  placeholder="Summarize your experience"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-chocolate font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Your Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what you liked (or didn't like)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-chocolate font-medium resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Add Photos (Optional)</label>
                <div className="flex flex-wrap gap-3">
                  {previews.map((preview, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100 group">
                      <Image src={preview} alt="Preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {previews.length < 4 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-rose/30 transition-all gap-1"
                    >
                      <Camera size={20} />
                      <span className="text-[9px] font-bold">Add Photo</span>
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Anonymous Toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-rose-deep transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                </div>
                <span className="text-xs font-bold text-chocolate/60 group-hover:text-chocolate transition-colors">Submit anonymously</span>
              </label>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full bg-chocolate text-white py-5 rounded-[22px] font-bold text-lg shadow-xl shadow-chocolate/20 hover:bg-brown transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Review"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

// Helper for class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default ReviewFormModal;
