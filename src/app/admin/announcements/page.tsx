"use client";

import React, { useState } from 'react';
import { useCMS } from '@/context/CMSContext';
import { Announcement } from '@/types/cms';
import {
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  Megaphone,
  Calendar,
  Link as LinkIcon,
  Clock,
  RefreshCw,
  RotateCcw
} from 'lucide-react';
import AnnouncementForm from '@/components/admin/AnnouncementForm';
import AdminConfirmationModal from '@/components/admin/AdminConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';

const AdminAnnouncements = () => {
  const { announcements, updateAnnouncements, loading, hasUndo, undo, restoreDefaults } = useCMS();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Announcement | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  // Status and feedback states
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [undoing, setUndoing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    try {
      const updated = announcements.filter(item => item.id !== id);
      // Re-index remaining display orders sequentially (0-indexed)
      const reindexed = updated.map((item, idx) => ({
        ...item,
        displayOrder: idx
      }));
      await updateAnnouncements(reindexed);
      setShowDeleteConfirm(null);
      showToast("Announcement deleted successfully.");
    } catch (error) {
      console.error("Error deleting announcement:", error);
      showToast("Failed to delete announcement.", "error");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setStatusUpdating(id);
    try {
      const updated = announcements.map(item => {
        if (item.id === id) {
          return { ...item, enabled: !currentStatus };
        }
        return item;
      });
      await updateAnnouncements(updated);
      showToast(`Announcement is now ${!currentStatus ? 'Active' : 'Disabled'}`);
    } catch (error) {
      console.error("Error toggling status:", error);
      showToast("Failed to update status.", "error");
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleUndo = async () => {
    setUndoing(true);
    try {
      await undo('announcements');
      showToast("Previous state restored successfully.");
    } catch (err) {
      console.error(err);
      showToast("Failed to restore previous state.", "error");
    } finally {
      setUndoing(false);
    }
  };

  const handleRestoreDefaults = async () => {
    setRestoring(true);
    try {
      await restoreDefaults('announcements');
      setShowRestoreConfirm(false);
      showToast("Default content restored successfully.");
    } catch (err) {
      console.error(err);
      showToast("Failed to restore default content.", "error");
    } finally {
      setRestoring(false);
    }
  };

  // Helper to determine the status badge (Live, Scheduled, Expired, Disabled)
  const getAnnouncementStatus = (item: Announcement) => {
    if (!item.enabled) return { label: 'Disabled', color: 'bg-gray-100 text-gray-500 border-gray-200' };

    const now = new Date();
    if (item.startDate) {
      const start = new Date(item.startDate);
      if (now < start) return { label: 'Scheduled', color: 'bg-blue-50 text-blue-600 border-blue-200' };
    }
    if (item.endDate) {
      const end = new Date(item.endDate);
      if (now > end) return { label: 'Expired', color: 'bg-red-50 text-red-600 border-red-200' };
    }

    return { label: 'Live', color: 'bg-green-50 text-green-600 border-green-200' };
  };

  // Sort announcements by displayOrder
  const sortedAnnouncements = [...announcements].sort((a, b) => a.displayOrder - b.displayOrder);

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
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">Announcement & Marquee</h1>
          <p className="text-gray-500 text-sm mt-1">Manage promotion banners and alert marquees running on the storefront.</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto justify-end">
          {hasUndo('announcements') && (
            <button
              onClick={handleUndo}
              disabled={undoing}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-rose-deep/20 bg-rose-deep/5 hover:bg-rose-deep/10 text-rose-deep h-11 min-h-[44px] disabled:opacity-50"
            >
              <RefreshCw size={14} className={undoing ? "animate-spin" : ""} />
              <span>Undo Last Change</span>
            </button>
          )}

          <button
            onClick={() => setShowRestoreConfirm(true)}
            disabled={restoring}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 h-11 min-h-[44px]"
          >
            <RotateCcw size={14} />
            <span>Restore Defaults</span>
          </button>

          <button
            onClick={() => {
              setSelectedItem(null);
              setIsFormOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-rose-deep text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown transition-all w-full sm:w-auto h-11 min-h-[44px]"
          >
            <Plus size={20} />
            <span>Add Announcement</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && announcements.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-rose-deep" size={40} />
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center gap-4 bg-white rounded-[28px] sm:rounded-[32px] border border-dashed border-gray-200">
            <Megaphone className="text-gray-100" size={64} />
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">No announcements created yet.</p>
          </div>
        ) : (
          sortedAnnouncements.map((item) => {
            const status = getAnnouncementStatus(item);
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
                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-full border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 mt-2">
                        {item.icon && <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>}
                        <h3 className="text-base font-bold text-chocolate line-clamp-3">{item.text}</h3>
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

                  {/* Destination link display */}
                  {item.link ? (
                    <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3 flex items-center gap-2">
                      <LinkIcon size={12} className="text-gray-400 shrink-0" />
                      <span className="text-[10px] font-mono font-bold text-gray-500 truncate" title={item.link}>
                        {item.link}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-gray-50/40 border border-dashed border-gray-100 rounded-xl p-3 flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 italic">No link destination configured</span>
                    </div>
                  )}

                  {/* Date Schedule display */}
                  <div className="text-[10px] text-gray-400 space-y-1 bg-gray-50/30 p-3 rounded-xl border border-gray-100/50">
                    {item.startDate || item.endDate ? (
                      <>
                        {item.startDate && (
                          <div className="flex items-center gap-1.5">
                            <Clock size={11} className="text-chocolate/60" />
                            <span>Start: {new Date(item.startDate).toLocaleString()}</span>
                          </div>
                        )}
                        {item.endDate && (
                          <div className="flex items-center gap-1.5">
                            <Clock size={11} className="text-chocolate/60" />
                            <span>End: {new Date(item.endDate).toLocaleString()}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Calendar size={11} />
                        <span>Always eligible while enabled</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
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
                </div>
              </div>
            );
          })
        )}
      </div>

      {isFormOpen && (
        <AnnouncementForm
          item={selectedItem}
          allAnnouncements={announcements}
          onClose={() => setIsFormOpen(false)}
          onSuccess={(message) => showToast(message)}
        />
      )}

      <AdminConfirmationModal
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
        title="Delete Announcement?"
        message="This action will permanently remove this announcement/offer from the database. It will immediately stop appearing on the storefront marquee."
        confirmText="Confirm Delete"
        cancelText="Cancel"
        type="danger"
      />

      <AdminConfirmationModal
        isOpen={showRestoreConfirm}
        onClose={() => setShowRestoreConfirm(false)}
        onConfirm={handleRestoreDefaults}
        title="Restore Default Content?"
        message="This will replace the current content in this section with the original default content. Your current changes can be recovered using Undo."
        confirmText="Restore Defaults"
        cancelText="Cancel"
        type="danger"
        isLoading={restoring}
      />
    </div>
  );
};

export default AdminAnnouncements;
