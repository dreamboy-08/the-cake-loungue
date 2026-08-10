"use client";

import React, { useState } from 'react';
import { useCMS } from '@/context/CMSContext';
import { CMSGalleryItem } from '@/types/cms';
import {
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import GalleryItemForm from '@/components/admin/GalleryItemForm';
import AdminConfirmationModal from '@/components/admin/AdminConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const AdminGallery = () => {
  const { galleryItems, updateGalleryItems, deleteGalleryItemFromDB, loading } = useCMS();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CMSGalleryItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Status and feedback states
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGalleryItemFromDB(id);
      const updated = (galleryItems || []).filter(item => item.id !== id);
      // Re-index remaining display orders sequentially (0-indexed)
      const reindexed = updated.map((item, idx) => ({
        ...item,
        displayOrder: idx
      }));
      await updateGalleryItems(reindexed);
      setShowDeleteConfirm(null);
      showToast("Gallery item deleted successfully.");
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      showToast("Failed to delete gallery item.", "error");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setStatusUpdating(id);
    try {
      const updated = (galleryItems || []).map(item => {
        if (item.id === id) {
          return { ...item, enabled: !currentStatus };
        }
        return item;
      });
      await updateGalleryItems(updated);
      showToast(`Gallery item is now ${!currentStatus ? 'Active' : 'Disabled'}`);
    } catch (error) {
      console.error("Error toggling status:", error);
      showToast("Failed to update status.", "error");
    } finally {
      setStatusUpdating(null);
    }
  };

  // Sort gallery items by displayOrder
  const sortedGallery = [...(galleryItems || [])].sort((a, b) => a.displayOrder - b.displayOrder);

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
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">Gallery CMS</h1>
          <p className="text-gray-500 text-sm mt-1">Manage dynamic portfolio and creation showcase displayed on the storefront.</p>
        </div>
        <button
          onClick={() => {
            setSelectedItem(null);
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-rose-deep text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown transition-all w-full sm:w-auto h-11 min-h-[44px]"
        >
          <Plus size={20} />
          <span>Add Gallery Item</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading && sortedGallery.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-rose-deep" size={40} />
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">Loading gallery...</p>
          </div>
        ) : sortedGallery.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center gap-4 bg-white rounded-[28px] sm:rounded-[32px] border border-dashed border-gray-200">
            <ImageIcon className="text-gray-100" size={64} />
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">No gallery items created yet.</p>
          </div>
        ) : (
          sortedGallery.map((item) => {
            return (
              <div
                key={item.id}
                className={`bg-white rounded-[28px] sm:rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden flex flex-col ${
                  item.enabled === false ? 'opacity-60' : ''
                }`}
              >
                {/* Image Showcase Box */}
                <div className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
                    <span className="px-3 py-1.5 bg-chocolate/85 backdrop-blur-md text-white text-[10px] font-black rounded-full shadow-md pointer-events-auto">
                      Priority #{item.displayOrder + 1}
                    </span>
                    <span className={`px-3 py-1.5 backdrop-blur-md text-[10px] font-black rounded-full shadow-md border pointer-events-auto ${
                      item.enabled === false
                        ? 'bg-gray-100/90 text-gray-500 border-gray-200'
                        : 'bg-green-500/90 text-white border-green-600'
                    }`}>
                      {item.enabled === false ? 'Disabled' : 'Live'}
                    </span>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-chocolate truncate" title={item.label}>
                      {item.label}
                    </h3>
                    {item.link && (
                      <p className="text-[10px] text-gray-400 font-semibold truncate mt-1">
                        Link: <span className="font-mono">{item.link}</span>
                      </p>
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

                    <div className="flex gap-1 shrink-0">
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
                </div>
              </div>
            );
          })
        )}
      </div>

      {isFormOpen && (
        <GalleryItemForm
          item={selectedItem}
          allGalleryItems={galleryItems || []}
          onClose={() => setIsFormOpen(false)}
          onSuccess={(message) => showToast(message)}
        />
      )}

      <AdminConfirmationModal
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
        title="Delete Gallery Item?"
        message="This action will permanently remove this item from your dynamic storefront portfolio."
        confirmText="Confirm Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default AdminGallery;
