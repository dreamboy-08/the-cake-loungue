"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Loader2, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/utils/firebase';
import { uploadToCloudinary } from '@/utils/cloudinary';
import { collection, addDoc, serverTimestamp, query, limit, getDocs } from 'firebase/firestore';
import Toast from '@/components/Toast';
import Image from 'next/image';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewFormModal: React.FC<ReviewFormModalProps> = ({ isOpen, onClose }) => {
  const { user, userData } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    title: '',
    message: ''
  });
  const [selectedImages, setSelectedImages] = useState<Array<{ file: File; preview: string }>>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || userData?.displayName || '',
        email: user.email || ''
      }));
    }
  }, [user, userData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setSelectedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) {
      setToastMessage('Please select a rating');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      let isVerified = false;
      if (user) {
        // Check if user has at least one completed order
        const ordersRef = collection(db, 'users', user.uid, 'orders');
        const q = query(ordersRef, limit(1));
        const orderSnap = await getDocs(q);
        isVerified = !orderSnap.empty;
      }

      // Upload images to Cloudinary
      const imageUrls: string[] = [];
      for (const img of selectedImages) {
        const url = await uploadToCloudinary(img.file);
        imageUrls.push(url);
      }

      await addDoc(collection(db, 'reviews'), {
        ...formData,
        userId: user?.uid || null,
        isVerified,
        images: imageUrls,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setToastMessage('Thank you! Your review has been submitted for approval.');
      setToastType('success');
      setShowToast(true);

      // Reset form (except name/email if logged in)
      setFormData(prev => ({
        ...prev,
        rating: 5,
        title: '',
        message: ''
      }));
      setSelectedImages([]);

      // Close modal after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setToastMessage('Failed to submit review. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-chocolate/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 bg-cream w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-rose/10 flex justify-between items-center bg-white">
                <div>
                  <h3 className="text-2xl font-playfair font-bold text-chocolate">Write a Review</h3>
                  <p className="text-sm text-text-soft">Share your experience with us</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-cream rounded-full transition-colors text-text-soft"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-chocolate uppercase tracking-widest ml-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-5 py-3 rounded-2xl bg-white border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-chocolate font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-chocolate uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-5 py-3 rounded-2xl bg-white border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-chocolate font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-chocolate uppercase tracking-widest ml-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="transition-transform active:scale-90"
                      >
                        <Star
                          size={32}
                          fill={star <= formData.rating ? "#D4AF37" : "none"}
                          className={star <= formData.rating ? "text-gold" : "text-text-soft/20"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-chocolate uppercase tracking-widest ml-1">Review Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="E.g., Simply Delicious!"
                    className="w-full px-5 py-3 rounded-2xl bg-white border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-chocolate font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-chocolate uppercase tracking-widest ml-1">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you loved about our cakes..."
                    className="w-full px-5 py-3 rounded-2xl bg-white border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-chocolate font-medium resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-chocolate uppercase tracking-widest ml-1">Upload Photos (Optional)</label>
                  <div className="grid grid-cols-4 gap-3">
                    {selectedImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-cream shadow-sm group">
                        <Image src={img.preview} alt="Review" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    {selectedImages.length < 4 && (
                      <button
                        type="button"
                        onClick={() => document.getElementById('review-images')?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-chocolate/10 bg-white flex flex-col items-center justify-center text-chocolate/40 hover:border-rose-deep/30 hover:bg-rose/5 transition-all"
                      >
                        <Upload size={20} />
                        <span className="text-[10px] font-bold mt-1 uppercase">Add Photo</span>
                      </button>
                    )}
                  </div>
                  <input
                    id="review-images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-rose-deep text-white rounded-full font-bold text-lg shadow-lg shadow-rose-deep/20 hover:bg-chocolate hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toast
        isVisible={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default ReviewFormModal;
