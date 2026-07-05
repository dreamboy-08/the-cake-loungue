"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/utils/firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  where
} from 'firebase/firestore';
import {
  Star,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Trash2,
  Reply,
  Loader2,
  MessageSquare,
  AlertCircle,
  Pin,
  TrendingUp,
  Image as ImageIcon,
  User,
  CheckCircle,
  Clock
} from 'lucide-react';
import Image from 'next/image';
import { Review, ReviewStatus } from '@/types/review';
import {
  updateReviewStatus,
  deleteReview,
  addAdminReply,
  toggleFeatureReview,
  togglePinReview
} from '@/utils/reviewService';

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ReviewStatus | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [showReplyInput, setShowReplyInput] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));

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

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchesTab = activeTab === 'all' || r.status === activeTab;
      const matchesSearch =
        r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.productName?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRating = ratingFilter === 'all' || r.rating === ratingFilter;

      return matchesTab && matchesSearch && matchesRating;
    });
  }, [reviews, activeTab, searchTerm, ratingFilter]);

  const handleStatusUpdate = async (id: string, status: ReviewStatus) => {
    const success = await updateReviewStatus(id, status);
    if (!success) alert("Failed to update status.");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const success = await deleteReview(id);
    if (!success) alert("Failed to delete review.");
  };

  const handleReply = async (id: string) => {
    if (!replyText[id]?.trim()) return;
    const success = await addAdminReply(id, replyText[id]);
    if (success) {
      setShowReplyInput(null);
      setReplyText(prev => ({ ...prev, [id]: '' }));
    } else {
      alert("Failed to send reply.");
    }
  };

  const handleToggleFeature = async (id: string, current: boolean) => {
    await toggleFeatureReview(id, !current);
  };

  const handleTogglePin = async (id: string, current: boolean) => {
    await togglePinReview(id, !current);
  };

  return (
    <div className="space-y-8 animate-fade-up pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-chocolate">Customer Reviews</h1>
          <p className="text-gray-500 mt-1">Moderate and respond to customer feedback.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Reviews</p>
          <div className="flex items-center gap-3">
            <MessageSquare className="text-chocolate" size={24} />
            <span className="text-2xl font-black text-chocolate">{reviews.length}</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Pending Approval</p>
          <div className="flex items-center gap-3">
            <Clock className="text-amber-500" size={24} />
            <span className="text-2xl font-black text-chocolate">
              {reviews.filter(r => r.status === 'pending').length}
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2">Approved</p>
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={24} />
            <span className="text-2xl font-black text-chocolate">
              {reviews.filter(r => r.status === 'approved').length}
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-rose-deep uppercase tracking-widest mb-2">Avg. Rating</p>
          <div className="flex items-center gap-3">
            <Star className="text-gold fill-gold" size={24} />
            <span className="text-2xl font-black text-chocolate">
              {(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex bg-gray-50 p-1.5 rounded-2xl">
            {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? 'bg-white text-chocolate shadow-sm'
                    : 'text-gray-400 hover:text-chocolate'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search reviews, users, products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-4 py-2 rounded-xl bg-gray-50 border-none text-xs font-bold text-chocolate outline-none cursor-pointer"
            >
              <option value="all">All Stars</option>
              {[5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s} Stars</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-[40px] p-24 text-center">
            <Loader2 className="animate-spin mx-auto text-rose-deep mb-4" size={40} />
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Loading Reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white rounded-[40px] p-24 text-center border border-gray-100">
            <MessageSquare className="mx-auto text-gray-100 mb-4" size={64} />
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No reviews found</p>
          </div>
        ) : (
          filteredReviews.map((r) => (
            <div key={r.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 transition-all hover:shadow-md">
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-rose/10 flex items-center justify-center border-2 border-white shadow-sm">
                      {r.userAvatar ? (
                        <Image src={r.userAvatar} alt={r.userName} width={48} height={48} className="object-cover" />
                      ) : (
                        <User size={24} className="text-rose-deep" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-chocolate">{r.userName}</span>
                        {r.isVerified && (
                          <span className="flex items-center gap-1 text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                            <CheckCircle2 size={10} /> Verified
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {new Date(r.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        {r.productName && ` • Ordered: ${r.productName}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < r.rating ? "text-gold fill-gold" : "text-gray-100"}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-chocolate">{r.title}</h4>
                  <p className="text-sm text-text-mid leading-relaxed">{r.message}</p>
                </div>

                {r.images && r.images.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {r.images.map((img, idx) => (
                      <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
                        <Image src={img} alt={`Review ${idx}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {r.adminReply && (
                  <div className="bg-cream-dark/50 p-6 rounded-3xl space-y-2 border border-cream">
                    <div className="flex items-center gap-2 text-[10px] font-black text-rose-deep uppercase tracking-widest">
                      <Reply size={12} className="rotate-180" /> Admin Response
                    </div>
                    <p className="text-sm text-chocolate font-medium italic">{r.adminReply}</p>
                  </div>
                )}

                {showReplyInput === r.id && (
                  <div className="space-y-3 animate-fade-up">
                    <textarea
                      placeholder="Write your response..."
                      value={replyText[r.id] || ''}
                      onChange={(e) => setReplyText(prev => ({ ...prev, [r.id]: e.target.value }))}
                      className="w-full px-5 py-4 rounded-3xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm text-chocolate font-medium resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowReplyInput(null)}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReply(r.id)}
                        className="px-6 py-2.5 bg-chocolate text-white rounded-xl text-xs font-bold shadow-lg shadow-chocolate/20 hover:bg-brown transition-all"
                      >
                        Send Response
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex md:flex-col gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                {r.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(r.id, 'approved')}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all"
                    >
                      <CheckCircle2 size={16} /> Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(r.id, 'rejected')}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-default">
                    {r.status === 'approved' ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}
                    {r.status}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-1 gap-2 flex-1 md:flex-none">
                  <button
                    onClick={() => setShowReplyInput(showReplyInput === r.id ? null : r.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black text-chocolate uppercase tracking-widest hover:bg-gray-50 transition-all border border-gray-100"
                  >
                    <Reply size={14} className="rotate-180" /> Reply
                  </button>
                  <button
                    onClick={() => handleToggleFeature(r.id, r.isFeatured)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      r.isFeatured
                        ? 'bg-amber-50 border-amber-200 text-amber-600'
                        : 'text-chocolate hover:bg-gray-50 border-gray-100'
                    }`}
                  >
                    <TrendingUp size={14} /> {r.isFeatured ? 'Featured' : 'Feature'}
                  </button>
                  <button
                    onClick={() => handleTogglePin(r.id, r.isPinned)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      r.isPinned
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                        : 'text-chocolate hover:bg-gray-50 border-gray-100'
                    }`}
                  >
                    <Pin size={14} /> {r.isPinned ? 'Pinned' : 'Pin'}
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 transition-all border border-red-50"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
