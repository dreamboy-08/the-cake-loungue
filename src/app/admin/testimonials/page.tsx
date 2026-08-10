"use client";

import React, { useState } from 'react';
import { useCMS } from '@/context/CMSContext';
import { CMSTestimonial } from '@/types/cms';
import {
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  Star,
  User,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react';
import TestimonialForm from '@/components/admin/TestimonialForm';
import AdminConfirmationModal from '@/components/admin/AdminConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const AdminTestimonials = () => {
  const { testimonials, updateTestimonials, deleteTestimonialFromDB, loading } = useCMS();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CMSTestimonial | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Status and feedback states
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Tabs for moderation: 'all' | 'pending' | 'approved' | 'rejected'
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    try {
      // First delete document from Firestore so it doesn't get synced back
      await deleteTestimonialFromDB(id);
      const updated = testimonials.filter(item => item.id !== id);
      // Re-index remaining display orders sequentially (0-indexed)
      const reindexed = updated.map((item, idx) => ({
        ...item,
        displayOrder: idx
      }));
      await updateTestimonials(reindexed);
      setShowDeleteConfirm(null);
      showToast("Testimonial deleted successfully.");
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      showToast("Failed to delete testimonial.", "error");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setStatusUpdating(id);
    try {
      const updated = testimonials.map(item => {
        if (item.id === id) {
          return { ...item, enabled: !currentStatus };
        }
        return item;
      });
      await updateTestimonials(updated);
      showToast(`Testimonial is now ${!currentStatus ? 'Active' : 'Disabled'}`);
    } catch (error) {
      console.error("Error toggling status:", error);
      showToast("Failed to update status.", "error");
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleSetStatus = async (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    setStatusUpdating(id);
    try {
      const updated = testimonials.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: newStatus,
            enabled: newStatus === 'approved' // Automatically enable if approved, disable if not
          };
        }
        return item;
      });
      await updateTestimonials(updated);
      showToast(`Review marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating review status:", error);
      showToast("Failed to update status.", "error");
    } finally {
      setStatusUpdating(null);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'C';
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  // Sort testimonials by displayOrder
  const sortedTestimonials = [...(testimonials || [])].sort((a, b) => a.displayOrder - b.displayOrder);

  // Filter based on active tab
  const filteredTestimonials = sortedTestimonials.filter(item => {
    const itemStatus = item.status || 'approved'; // Legacy or manual default to approved
    if (activeTab === 'all') return true;
    return itemStatus === activeTab;
  });

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6 sm:space-y-8 animate-fade-up pb-24 max-w-[1600px] mx-auto">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-8 left-1/2 z-[500] px-6 py-3 rounded-[22px] shadow-2xl flex items-center gap-3 font-bold text-sm ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">Testimonials CMS</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and moderate customer reviews and manual testimonials.</p>
        </div>
        <button
          onClick={() => {
            setSelectedItem(null);
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-rose-deep text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown transition-all w-full sm:w-auto h-11 min-h-[44px]"
        >
          <Plus size={20} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 gap-4 overflow-x-auto pb-px">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => {
          const count = sortedTestimonials.filter(item => {
            const itemStatus = item.status || 'approved';
            return tab === 'all' ? true : itemStatus === tab;
          }).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-bold text-sm capitalize transition-all shrink-0 border-b-2 inline-block whitespace-nowrap ${
                activeTab === tab
                  ? 'border-rose-deep text-rose-deep'
                  : 'border-transparent text-gray-400 hover:text-chocolate'
              }`}
            >
              {tab} <span className="text-xs bg-gray-50 px-2 py-0.5 rounded-full font-bold ml-1">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && testimonials.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-rose-deep" size={40} />
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">Loading testimonials...</p>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center gap-4 bg-white rounded-[28px] sm:rounded-[32px] border border-dashed border-gray-200">
            <User className="text-gray-100" size={64} />
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">No reviews found in this tab.</p>
          </div>
        ) : (
          filteredTestimonials.map((item) => {
            const isPending = item.status === 'pending';
            const isRejected = item.status === 'rejected';
            const isApproved = !item.status || item.status === 'approved';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-[28px] sm:rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden flex flex-col ${
                  item.enabled === false ? 'opacity-60' : ''
                }`}
              >
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 bg-rose/10 text-rose-deep text-[9px] font-black rounded-full border border-rose/20">
                          Priority #{item.displayOrder + 1}
                        </span>
                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-full border uppercase tracking-wider ${
                          isPending
                            ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                            : isRejected
                            ? 'bg-red-50 text-red-600 border-red-200'
                            : 'bg-green-50 text-green-600 border-green-200'
                        }`}>
                          {item.status || 'approved'}
                        </span>
                        {item.verified && (
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[9px] font-black rounded-full border border-green-200 uppercase tracking-wider">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <div className="flex items-start gap-4 mt-4">
                        {item.avatar ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden relative border border-gray-200 shrink-0">
                            <Image src={item.avatar} alt={item.name} fill sizes="48px" className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-rose/10 border border-gray-200 flex items-center justify-center text-rose-deep font-bold text-sm shrink-0 uppercase">
                            {getInitials(item.name)}
                          </div>
                        )}
                        <div>
                          <h3 className="text-base font-bold text-chocolate">{item.name}</h3>
                          {item.tag && <p className="text-xs text-gray-400 font-semibold">{item.tag}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0 ml-2">
                      <button
                        title="Edit"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsFormOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-rose-deep hover:bg-cream-dark rounded-xl transition-all focus:outline-none"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => setShowDeleteConfirm(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all focus:outline-none"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-gold text-[0.8rem]">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} fill={j < Math.floor(item.rating) ? "currentColor" : "none"} className={j < Math.floor(item.rating) ? "text-gold" : "text-text-soft/30"} />
                    ))}
                    <span className="text-xs font-bold text-gray-500 ml-1">({item.rating})</span>
                  </div>

                  <p className="text-sm font-medium text-gray-600 leading-relaxed italic line-clamp-4">
                    &quot;{item.text}&quot;
                  </p>

                  <div className="pt-4 border-t border-gray-50 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleActive(item.id, item.enabled !== false);
                        }}
                        disabled={statusUpdating === item.id}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 ${
                          item.enabled === false ? 'bg-black/20 text-white hover:bg-black/40' : 'bg-green-500/80 text-white hover:bg-green-600/90'
                        } ${statusUpdating === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {statusUpdating === item.id ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : (
                          item.enabled === false ? <EyeOff size={10} /> : <Eye size={10} />
                        )}
                        {item.enabled === false ? 'Hidden' : 'Live'}
                      </button>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        ID: {item.id.length > 8 ? `${item.id.substring(0, 8)}...` : item.id}
                      </span>
                    </div>

                    {/* Quick moderation buttons for customer reviews */}
                    <div className="flex gap-2 justify-end">
                      {!isApproved && (
                        <button
                          onClick={() => handleSetStatus(item.id, 'approved')}
                          disabled={statusUpdating === item.id}
                          className="flex items-center gap-1 text-[10px] font-black text-green-600 hover:bg-green-50 px-2 py-1 rounded-lg border border-green-200 transition-all focus:outline-none"
                        >
                          <ThumbsUp size={10} /> Approve
                        </button>
                      )}
                      {!isRejected && (
                        <button
                          onClick={() => handleSetStatus(item.id, 'rejected')}
                          disabled={statusUpdating === item.id}
                          className="flex items-center gap-1 text-[10px] font-black text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg border border-red-200 transition-all focus:outline-none"
                        >
                          <ThumbsDown size={10} /> Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isFormOpen && (
        <TestimonialForm
          item={selectedItem}
          allTestimonials={testimonials}
          onClose={() => setIsFormOpen(false)}
          onSuccess={(message) => showToast(message)}
        />
      )}

      <AdminConfirmationModal
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
        title="Delete Testimonial?"
        message="This action will permanently remove this testimonial from the database. It will immediately stop appearing on the storefront testimonials section."
        confirmText="Confirm Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default AdminTestimonials;
