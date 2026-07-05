"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/utils/firebase';
import { collection, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { Star, Filter, Search, ChevronDown, CheckCircle2, MessageSquare, Loader2 } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import ReviewCard from '@/components/reviews/ReviewCard';
import ReviewStatsDisplay from '@/components/reviews/ReviewStats';
import ReviewGallery from '@/components/reviews/ReviewGallery';
import ReviewSkeleton from '@/components/reviews/ReviewSkeleton';
import { Review, ReviewStats } from '@/types/review';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'helpful'>('newest');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'reviews'),
      where('status', '==', 'approved')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Review));
      setReviews(fetchedReviews);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to reviews:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const stats: ReviewStats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        recommendedPercentage: 0
      };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const distribution = reviews.reduce((acc, r) => {
      acc[r.rating] = (acc[r.rating] || 0) + 1;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as { [key: number]: number });

    const recommended = reviews.filter(r => r.rating >= 4).length;

    return {
      averageRating: sum / total,
      totalReviews: total,
      ratingDistribution: distribution,
      recommendedPercentage: (recommended / total) * 100
    };
  }, [reviews]);

  const galleryImages = useMemo(() => {
    return reviews
      .flatMap(r => r.images || [])
      .filter((img, index, self) => self.indexOf(img) === index);
  }, [reviews]);

  const filteredAndSortedReviews = useMemo(() => {
    return reviews
      .filter(r => {
        const matchesSearch =
          r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = ratingFilter === 'all' || r.rating === ratingFilter;
        const matchesVerified = !verifiedOnly || r.isVerified;

        return matchesSearch && matchesRating && matchesVerified;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
        return 0;
      });
  }, [reviews, searchTerm, ratingFilter, verifiedOnly, sortBy]);

  return (
    <PageWrapper>
      <div className="container mx-auto px-6 space-y-16 pb-24">
        {/* Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose/10 rounded-full text-rose-deep text-[10px] font-black uppercase tracking-widest"
          >
            <Star size={14} fill="currentColor" /> Trust & Excellence
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-playfair font-bold text-chocolate"
          >
            Customer Reviews
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg"
          >
            Read honest feedback from our community of cake lovers. Your trust is our most cherished ingredient.
          </motion.p>
        </div>

        {/* Stats */}
        {!loading && reviews.length > 0 && <ReviewStatsDisplay stats={stats} />}

        {/* Photo Gallery */}
        {!loading && galleryImages.length > 0 && <ReviewGallery images={galleryImages} />}

        {/* Action Button for Seeding (Admin/Dev only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="flex justify-center">
            <button
              onClick={async () => {
                const { seedReviews } = await import('@/utils/seedReviews');
                await seedReviews();
                window.location.reload();
              }}
              className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-chocolate transition-colors"
            >
              Seed Initial Reviews
            </button>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8 sticky top-[130px] z-40 backdrop-blur-md bg-white/90">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search reviews by content or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-[22px] bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-chocolate font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rating:</span>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="px-6 py-3 rounded-2xl bg-gray-50 border-none text-xs font-bold text-chocolate outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <option value="all">All Stars</option>
                  {[5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s} Stars</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-6 py-3 rounded-2xl bg-gray-50 border-none text-xs font-bold text-chocolate outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group px-4">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                  />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                </div>
                <span className="text-xs font-bold text-chocolate/60 group-hover:text-chocolate transition-colors flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-green-500" /> Verified Only
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            [...Array(6)].map((_, i) => <ReviewSkeleton key={i} />)
          ) : filteredAndSortedReviews.length === 0 ? (
            <div className="col-span-full py-32 text-center space-y-6">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                <MessageSquare size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-chocolate">No reviews found</h3>
                <p className="text-gray-400">Be the first customer to review The Cake Lounge.</p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredAndSortedReviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Load More (Simplified for now as we use onSnapshot) */}
        {!loading && filteredAndSortedReviews.length > 0 && (
          <div className="text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Showing all {filteredAndSortedReviews.length} reviews
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ReviewsPage;
