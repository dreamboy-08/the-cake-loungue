"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, MessageSquare } from 'lucide-react';
import { db } from '@/utils/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Review } from '@/types/admin';
import ReviewFormModal from './ReviewFormModal';

const Testimonials = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('status', '==', 'Approved'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(fetchedReviews);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="testimonials" className="py-[100px] bg-cream-dark">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-center md:text-left">
            <p className="section-label">Happy Customers</p>
            <h2 className="section-title mb-0">What People Are Saying</h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-chocolate text-white rounded-full font-bold text-sm shadow-xl shadow-chocolate/20 hover:bg-rose-deep hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mx-auto md:mx-0"
          >
            <MessageSquare size={18} />
            Write a Review
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-deep"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[32px] border border-cream shadow-sm">
            <p className="text-text-soft font-medium">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-[14px] p-8 shadow-sm transition-all duration-350 relative hover:translate-y-[-6px] hover:shadow-md before:content-['\201C'] before:font-playfair before:text-[6rem] before:text-cream-dark before:absolute before:top-2.5 before:left-5 before:leading-none flex flex-col">
                <div className="flex gap-[3px] text-gold text-[0.9rem] mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} fill={j < Math.floor(review.rating) ? "currentColor" : "none"} className={j < Math.floor(review.rating) ? "text-gold" : "text-text-soft/30"} />
                  ))}
                </div>
                <h4 className="font-bold text-chocolate mb-2 relative z-10">{review.title}</h4>
                <p className="text-[0.9rem] text-text-mid leading-[1.75] relative z-10 mb-6 flex-1">
                  &quot;{review.message}&quot;
                </p>
                <div className="flex items-center gap-[14px]">
                  <div className="w-[46px] h-[46px] rounded-full overflow-hidden border-2 border-blush relative bg-cream flex items-center justify-center text-rose-deep font-bold text-lg">
                    {review.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-[0.9rem] font-semibold text-chocolate">{review.name}</div>
                      {review.isVerified && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Verified</span>
                      )}
                    </div>
                    <div className="text-[0.75rem] text-text-soft">{new Date(review.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Testimonials;
