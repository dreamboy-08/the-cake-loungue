"use client";

import React, { useState } from 'react';
import { useCMS } from '@/context/CMSContext';
import { MegaMenuSection } from '@/types/cms';
import {
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  Layers,
  Compass,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import MegaMenuForm from '@/components/admin/MegaMenuForm';
import AdminConfirmationModal from '@/components/admin/AdminConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';

const AdminMegaMenu = () => {
  const { megaMenus, updateMegaMenus, loading } = useCMS();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MegaMenuSection | null>(null);
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
      const updated = megaMenus.filter(item => item.id !== id);
      // Re-index remaining display orders sequentially (0-indexed)
      const reindexed = updated.map((item, idx) => ({
        ...item,
        displayOrder: idx
      }));
      await updateMegaMenus(reindexed);
      setShowDeleteConfirm(null);
      showToast("Mega Menu column deleted successfully.");
    } catch (error) {
      console.error("Error deleting Mega Menu column:", error);
      showToast("Failed to delete Mega Menu column.", "error");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setStatusUpdating(id);
    try {
      const updated = megaMenus.map(item => {
        if (item.id === id) {
          return { ...item, enabled: !currentStatus };
        }
        return item;
      });
      await updateMegaMenus(updated);
      showToast(`Mega Menu column is now ${!currentStatus ? 'Active' : 'Disabled'}`);
    } catch (error) {
      console.error("Error toggling Mega Menu status:", error);
      showToast("Failed to update status.", "error");
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const updated = [...megaMenus].sort((a, b) => a.displayOrder - b.displayOrder);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;

    // Swap
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Re-index
    const reindexed = updated.map((item, idx) => ({
      ...item,
      displayOrder: idx
    }));

    try {
      await updateMegaMenus(reindexed);
      showToast("Mega Menu column order updated.");
    } catch (error) {
      console.error("Error reordering Mega Menu:", error);
      showToast("Failed to update order.", "error");
    }
  };

  // Sort mega menu items by displayOrder
  const sortedMegaMenus = [...megaMenus].sort((a, b) => a.displayOrder - b.displayOrder);

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
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">Mega Menu Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage secondary links, categories, and custom columns inside your navigation dropdowns.</p>
        </div>
        <button
          onClick={() => {
            setSelectedItem(null);
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-rose-deep text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown transition-all w-full sm:w-auto h-11 min-h-[44px]"
        >
          <Plus size={20} />
          <span>Add Mega Menu Section</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && megaMenus.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-rose-deep" size={40} />
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">Loading Mega Menu sections...</p>
          </div>
        ) : megaMenus.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center gap-4 bg-white rounded-[28px] sm:rounded-[32px] border border-dashed border-gray-200">
            <Compass className="text-gray-100" size={64} />
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">No Mega Menu sections created yet.</p>
          </div>
        ) : (
          sortedMegaMenus.map((item, idx) => (
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
                      <h3 className="text-xl font-bold text-chocolate">{item.title}</h3>
                      <span className="px-2 py-0.5 bg-rose/10 text-rose-deep text-[9px] font-black rounded-full border border-rose/20">
                        #{item.displayOrder + 1}
                      </span>
                    </div>
                    <p className="text-[10px] text-rose-deep font-black uppercase tracking-widest">
                      Section ID: {item.id}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      title="Move Up"
                      disabled={idx === 0}
                      onClick={() => handleReorder(idx, 'up')}
                      className="p-2 text-gray-400 hover:text-rose-deep hover:bg-cream-dark rounded-xl transition-all focus:outline-none disabled:opacity-30"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      title="Move Down"
                      disabled={idx === sortedMegaMenus.length - 1}
                      onClick={() => handleReorder(idx, 'down')}
                      className="p-2 text-gray-400 hover:text-rose-deep hover:bg-cream-dark rounded-xl transition-all focus:outline-none disabled:opacity-30"
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      title="Edit Section"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsFormOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-rose-deep hover:bg-cream-dark rounded-xl transition-all focus:outline-none"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      title="Delete Section"
                      onClick={() => setShowDeleteConfirm(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all focus:outline-none"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Items preview list */}
                <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4 flex-1">
                  <p className="text-[10px] font-black text-chocolate/40 uppercase tracking-widest mb-3">Links inside column</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {item.items && item.items.length > 0 ? (
                      item.items
                        .sort((a, b) => a.displayOrder - b.displayOrder)
                        .map(sub => (
                          <div key={sub.id} className="flex items-center justify-between text-xs font-semibold bg-white p-2 rounded-xl border border-gray-100/50">
                            <span className="text-chocolate font-bold">{sub.name}</span>
                            <span className="text-[10px] text-gray-400 truncate max-w-[120px]" title={sub.url}>
                              {sub.url}
                            </span>
                          </div>
                        ))
                    ) : (
                      <p className="text-xs italic text-gray-400 py-2">No links created inside this section.</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between shrink-0">
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
                    {item.items?.length || 0} Links
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isFormOpen && (
        <MegaMenuForm
          item={selectedItem}
          allSections={megaMenus}
          onClose={() => setIsFormOpen(false)}
          onSuccess={(message) => showToast(message)}
        />
      )}

      <AdminConfirmationModal
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
        title="Delete Mega Menu Column?"
        message="This action will permanently remove this Mega Menu column from both the storefront and mobile navigation dropdowns. Top-level navigation link associations with this column ID will remain, but the dropdown won't render this column."
        confirmText="Confirm Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default AdminMegaMenu;
