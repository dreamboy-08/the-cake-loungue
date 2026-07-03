"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/utils/firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  where
} from 'firebase/firestore';
import {
  MessageSquare,
  Search,
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  Edit2,
  Filter,
  Loader2,
  X,
  User,
  Mail,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Review, ReviewStatus } from '@/types/admin';
import Toast from '@/components/Toast';

const STATUS_OPTIONS: (ReviewStatus | 'All')[] = ['All', 'Pending', 'Approved', 'Rejected'];
const RATING_OPTIONS = ['All', '5', '4', '3', '2', '1'];

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'All'>('All');
  const [ratingFilter, setRatingFilter] = useState<string>('All');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Review>>({});

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
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

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const matchesSearch =
        review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || review.status === statusFilter;
      const matchesRating = ratingFilter === 'All' || review.rating.toString() === ratingFilter;

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, searchTerm, statusFilter, ratingFilter]);

  const handleStatusUpdate = async (id: string, newStatus: ReviewStatus) => {
    setActionLoading(id);
    try {
      const reviewRef = doc(db, 'reviews', id);
      await updateDoc(reviewRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      setToastMessage(`Review ${newStatus.toLowerCase()} successfully`);
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error updating review status:", error);
      setToastMessage("Failed to update review status");
      setToastType('error');
      setShowToast(true);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this review permanently?")) return;

    setActionLoading(id);
    try {
      await deleteDoc(doc(db, 'reviews', id));
      setToastMessage("Review deleted successfully");
      setToastType('success');
      setShowToast(true);
      if (selectedReview?.id === id) setSelectedReview(null);
    } catch (error) {
      console.error("Error deleting review:", error);
      setToastMessage("Failed to delete review");
      setToastType('error');
      setShowToast(true);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview) return;

    setActionLoading(selectedReview.id);
    try {
      const reviewRef = doc(db, 'reviews', selectedReview.id);
      await updateDoc(reviewRef, {
        ...editData,
        updatedAt: new Date().toISOString()
      });
      setToastMessage("Review updated successfully");
      setToastType('success');
      setShowToast(true);
      setIsEditing(false);
      setSelectedReview(null);
    } catch (error) {
      console.error("Error updating review:", error);
      setToastMessage("Failed to update review");
      setToastType('error');
      setShowToast(true);
    } finally {
      setActionLoading(null);
    }
  };

  const openEdit = (review: Review) => {
    setSelectedReview(review);
    setEditData({
      title: review.title,
      message: review.message,
      rating: review.rating,
      name: review.name,
      status: review.status
    });
    setIsEditing(true);
  };

  const getStatusColor = (status: ReviewStatus) => {
    switch (status) {
      case 'Approved': return 'bg-green-50 text-green-600 border-green-100';
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
      case 'Pending': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-8 animate-fade-up pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-chocolate">Review Management</h1>
          <p className="text-gray-500 mt-1">Moderate and manage customer testimonials.</p>
        </div>
        <div className="flex items-center justify-center gap-2 bg-white text-chocolate px-6 py-3 rounded-2xl font-bold shadow-sm border border-gray-100">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
          <span>{loading ? 'Syncing...' : 'Live Reviews'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
            />
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <Filter className="text-gray-400 shrink-0" size={20} />
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  statusFilter === status
                    ? 'bg-rose-deep text-white border-rose-deep shadow-md shadow-rose-deep/20'
                    : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <Star className="text-gray-400 shrink-0" size={20} />
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full">
            {RATING_OPTIONS.map((rating) => (
              <button
                key={rating}
                onClick={() => setRatingFilter(rating)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  ratingFilter === rating
                    ? 'bg-gold text-white border-gold shadow-md shadow-gold/20'
                    : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                }`}
              >
                {rating === 'All' ? 'All' : `${rating} ★`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Rating & Title</th>
                <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Review</th>
                <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-rose-deep" size={32} />
                      <p className="text-sm text-gray-400 font-medium">Loading reviews...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <MessageSquare className="text-gray-200" size={48} />
                      <p className="text-sm text-gray-400 font-medium">No reviews found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-chocolate text-sm">{review.name}</span>
                          {review.userId && (
                            <span className="bg-blue-50 text-blue-600 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">User</span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400">{review.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-0.5 text-gold">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <span className="font-bold text-chocolate text-[11px] line-clamp-1">{review.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-[11px] text-gray-500 line-clamp-2 italic">&quot;{review.message}&quot;</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-lg text-[9px] font-bold border uppercase tracking-wider ${getStatusColor(review.status)}`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {review.status !== 'Approved' && (
                          <button
                            onClick={() => handleStatusUpdate(review.id, 'Approved')}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        )}
                        {review.status !== 'Rejected' && (
                          <button
                            onClick={() => handleStatusUpdate(review.id, 'Rejected')}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedReview(review)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => openEdit(review)}
                          className="p-1.5 text-gray-400 hover:text-chocolate hover:bg-cream rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Details / Preview Modal */}
      {selectedReview && !isEditing && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-chocolate/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-playfair font-bold text-chocolate">Review Details</h2>
              <button onClick={() => setSelectedReview(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4 bg-cream p-6 rounded-3xl border border-rose/10">
                <div className="w-14 h-14 rounded-full bg-rose-deep flex items-center justify-center text-white text-xl font-bold">
                  {selectedReview.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-chocolate text-lg">{selectedReview.name}</h3>
                  <p className="text-sm text-text-soft flex items-center gap-1.5">
                    <Mail size={14} /> {selectedReview.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${getStatusColor(selectedReview.status)}`}>
                    {selectedReview.status}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Submitted On</p>
                  <p className="text-sm font-bold text-chocolate">{new Date(selectedReview.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating & Title</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} fill={i < selectedReview.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="font-black text-chocolate text-lg">— {selectedReview.title}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message</p>
                <div className="bg-cream-dark p-6 rounded-3xl text-chocolate italic leading-relaxed text-sm relative">
                  <span className="absolute top-2 left-4 text-4xl text-rose/20 font-serif">&ldquo;</span>
                  {selectedReview.message}
                  <span className="absolute bottom-0 right-4 text-4xl text-rose/20 font-serif">&rdquo;</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {selectedReview.status !== 'Approved' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedReview.id, 'Approved')}
                    className="flex-1 py-3 bg-green-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} /> Approve
                  </button>
                )}
                {selectedReview.status !== 'Rejected' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedReview.id, 'Rejected')}
                    className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedReview.id)}
                  className="p-3 bg-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && selectedReview && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-chocolate/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-playfair font-bold text-chocolate">Edit Review</h2>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-chocolate text-sm font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value as ReviewStatus })}
                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-chocolate text-sm font-bold appearance-none"
                  >
                    {STATUS_OPTIONS.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Rating</label>
                <div className="flex gap-2 bg-gray-50 p-3 rounded-2xl w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditData({ ...editData, rating: star })}
                      className="transition-transform active:scale-90"
                    >
                      <Star
                        size={24}
                        fill={star <= (editData.rating || 0) ? "#D4AF37" : "none"}
                        className={star <= (editData.rating || 0) ? "text-gold" : "text-gray-200"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Review Title</label>
                <input
                  type="text"
                  required
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-chocolate text-sm font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Review Message</label>
                <textarea
                  required
                  rows={4}
                  value={editData.message}
                  onChange={(e) => setEditData({ ...editData, message: e.target.value })}
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-chocolate text-sm font-medium resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!actionLoading}
                  className="flex-1 py-4 bg-chocolate text-white rounded-2xl font-bold text-sm shadow-lg shadow-chocolate/20 hover:bg-rose-deep hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  {actionLoading === selectedReview.id ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast
        isVisible={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default AdminReviews;
