"use client";

import React, { useState } from 'react';
import { useCMS } from '@/context/CMSContext';
import { NavigationItem } from '@/types/cms';
import {
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  Laptop,
  Smartphone,
  Layers,
  Compass
} from 'lucide-react';
import NavigationForm from '@/components/admin/NavigationForm';
import AdminConfirmationModal from '@/components/admin/AdminConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';

const AdminNavigation = () => {
  const { navigation, updateNavigation, loading } = useCMS();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NavigationItem | null>(null);
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
      const updated = navigation.filter(item => item.id !== id);
      // Re-index remaining display orders sequentially (0-indexed)
      const reindexed = updated.map((item, idx) => ({
        ...item,
        displayOrder: idx
      }));
      await updateNavigation(reindexed);
      setShowDeleteConfirm(null);
      showToast("Navigation link deleted successfully.");
    } catch (error) {
      console.error("Error deleting navigation link:", error);
      showToast("Failed to delete navigation link.", "error");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setStatusUpdating(id);
    try {
      const updated = navigation.map(item => {
        if (item.id === id) {
          return { ...item, enabled: !currentStatus };
        }
        return item;
      });
      await updateNavigation(updated);
      showToast(`Navigation is now ${!currentStatus ? 'Active' : 'Disabled'}`);
    } catch (error) {
      console.error("Error toggling navigation status:", error);
      showToast("Failed to update status.", "error");
    } finally {
      setStatusUpdating(null);
    }
  };

  // Sort navigation items by displayOrder
  const sortedNavigation = [...navigation].sort((a, b) => a.displayOrder - b.displayOrder);

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
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">Navigation Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage storefront navigation links, device visibilities, and dropdown mega menus.</p>
        </div>
        <button
          onClick={() => {
            setSelectedItem(null);
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-rose-deep text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown transition-all w-full sm:w-auto h-11 min-h-[44px]"
        >
          <Plus size={20} />
          <span>Add Navigation Link</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && navigation.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-rose-deep" size={40} />
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">Loading navigation links...</p>
          </div>
        ) : navigation.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center gap-4 bg-white rounded-[28px] sm:rounded-[32px] border border-dashed border-gray-200">
            <Compass className="text-gray-100" size={64} />
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">No navigation links created yet.</p>
          </div>
        ) : (
          sortedNavigation.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-[28px] sm:rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden flex flex-col ${
                item.enabled === false ? 'opacity-60' : ''
              }`}
            >
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-chocolate">{item.label}</h3>
                      <span className="px-2 py-0.5 bg-rose/10 text-rose-deep text-[9px] font-black rounded-full border border-rose/20">
                        #{item.displayOrder + 1}
                      </span>
                    </div>
                    <p className="text-[10px] text-rose-deep font-black uppercase tracking-widest">
                      Type: {item.linkType}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      title="Edit Link"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsFormOpen(true);
                      }}
                      className="p-2.5 text-gray-400 hover:text-rose-deep hover:bg-cream-dark rounded-xl transition-all focus:outline-none"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      title="Delete Link"
                      onClick={() => setShowDeleteConfirm(item.id)}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all focus:outline-none"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Path display box */}
                <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3 flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-gray-500 truncate" title={item.url}>
                    {item.url}
                  </span>
                </div>

                {/* Indicators row */}
                <div className="grid grid-cols-3 gap-2 py-2">
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <Laptop size={14} className={item.showOnDesktop ? "text-chocolate" : "text-gray-300"} />
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mt-1">Desktop</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <Smartphone size={14} className={item.showOnMobile ? "text-chocolate" : "text-gray-300"} />
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mt-1">Mobile</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <Layers size={14} className={item.hasDropdown ? "text-rose-deep" : "text-gray-300"} />
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mt-1">MegaMenu</span>
                  </div>
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
                    {item.hasDropdown ? `${item.dropdownSectionIds?.length || 0} Columns` : 'Single Link'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isFormOpen && (
        <NavigationForm
          item={selectedItem}
          allNavigation={navigation}
          onClose={() => setIsFormOpen(false)}
          onSuccess={(message) => showToast(message)}
        />
      )}

      <AdminConfirmationModal
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
        title="Delete Navigation Link?"
        message="This action will permanently remove this navigation link from both the storefront and mobile navigation. Dropdown configurations will not be deleted, but this link association will be removed."
        confirmText="Confirm Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default AdminNavigation;
