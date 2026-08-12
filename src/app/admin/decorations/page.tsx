"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCMS } from '@/context/CMSContext';
import { CMSDecorationItem } from '@/types/cms';
import { uploadToCloudinary } from '@/utils/cloudinary';
import {
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sparkles,
  Upload,
  X
} from 'lucide-react';
import AdminConfirmationModal from '@/components/admin/AdminConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const CATEGORY_OPTIONS = ["Balloons", "Candles", "Banners", "Toppers", "Party Kits", "Sparklers", "Other"];

// Companion form component inside the file to prevent modular resolution bugs
interface DecorationFormProps {
  item?: CMSDecorationItem | null;
  allDecorations: CMSDecorationItem[];
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const DecorationForm = ({ item, allDecorations, onClose, onSuccess }: DecorationFormProps) => {
  const { updateDecorations } = useCMS();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(item?.img || '/images/products/Velvet Pearl Cupcake.jpg');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || 0,
    category: item?.category || CATEGORY_OPTIONS[0],
    enabled: item?.enabled !== undefined ? item?.enabled : true,
    displayOrder: item !== undefined && item !== null ? item.displayOrder + 1 : (allDecorations.length + 1),
  });

  useEffect(() => {
    setMounted(true);
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validation: max 5MB, jpeg/png/webp
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setErrorMsg("Please upload a valid image file (JPEG, PNG, or WEBP).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Image size exceeds the 5MB limit.");
        return;
      }

      setErrorMsg(null);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg("Decoration Name is required.");
      return;
    }
    if (formData.price <= 0) {
      setErrorMsg("Please enter a valid price greater than ₹0.");
      return;
    }
    if (!imagePreview) {
      setErrorMsg("An image is required to publish this decoration.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      let finalImageUrl = item?.img || '/images/products/Velvet Pearl Cupcake.jpg';

      if (imageFile) {
        try {
          finalImageUrl = await uploadToCloudinary(imageFile);
        } catch (err) {
          console.error("Cloudinary upload failed:", err);
          setErrorMsg("We couldn't upload this image. Please try again.");
          setLoading(false);
          return;
        }
      }

      const isEdit = !!item;
      let updatedList = [...allDecorations];

      if (isEdit) {
        updatedList = updatedList.filter(d => d.id !== item?.id);
      }

      const currentItem: CMSDecorationItem = {
        id: item?.id || 'dec_' + Date.now(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        img: finalImageUrl,
        category: formData.category,
        enabled: formData.enabled,
        displayOrder: 0 // Will be sequentially indexed
      };

      const targetIdx = Math.max(0, Math.min(formData.displayOrder - 1, updatedList.length));
      updatedList.splice(targetIdx, 0, currentItem);

      // Re-assign displayOrder sequentially 0-indexed for consistency
      const reorderedList = updatedList.map((g, idx) => ({
        ...g,
        displayOrder: idx,
      }));

      await updateDecorations(reorderedList);

      onSuccess(isEdit ? 'Decorative Item updated successfully.' : 'Decorative Item created successfully.');
      onClose();
    } catch (err) {
      console.error("Error saving decoration item:", err);
      setErrorMsg("Failed to save changes. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-chocolate/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 border-b flex items-center justify-between bg-chocolate text-white shrink-0">
          <div>
            <h2 className="text-2xl font-bold font-playfair">{item ? 'Edit Decorative Item' : 'New Decorative Item'}</h2>
            <p className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Manage shop accessories</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-rose rounded-full transition-colors focus:outline-none">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto">
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-start gap-2 text-xs font-bold border border-red-100">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Photo Upload Container */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative w-32 h-40 rounded-[24px] border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden group cursor-pointer"
              onClick={() => document.getElementById('decor-image-upload')?.click()}
            >
              {imagePreview ? (
                <>
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-chocolate/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload size={24} className="text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4 text-center">
                  <Upload size={24} />
                  <span className="text-[10px] font-black uppercase mt-1">Upload Photo</span>
                </div>
              )}
            </div>
            <input
              id="decor-image-upload"
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => document.getElementById('decor-image-upload')?.click()}
                  className="px-3 py-1 bg-gray-100 text-chocolate rounded-lg text-xs font-bold hover:bg-cream transition-all"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="px-3 py-1 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100 transition-all"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Decoration Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Elegant Golden Sparkler Candles"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold text-chocolate"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Description</label>
              <textarea
                placeholder="Provide a detailed description of the decorative item..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-xs font-medium text-chocolate resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Price (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 149"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold text-chocolate"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold text-chocolate bg-white"
                >
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Display Order / Priority *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold text-chocolate"
              />
            </div>

            {/* Active Status Toggle */}
            <label className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-rose-deep focus:ring-rose-deep"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-chocolate">Active Status</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Visible on shop details and recommendations</span>
              </div>
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all focus:outline-none"
            >
              Cancel
            </button>
            <button
              disabled={loading || !imagePreview}
              type="submit"
              className="flex-[2] py-4 bg-rose-deep text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-deep/20 hover:bg-brown transition-all flex items-center justify-center gap-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {item ? 'Save Item' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

// Main view
const AdminDecorations = () => {
  const {
    decorations,
    updateDecorations,
    deleteDecorationFromDB,
    loading,
    hasUndo,
    undo,
    restoreDefaults
  } = useCMS();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CMSDecorationItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  // Status and feedback states
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDecorationFromDB(id);
      const updated = (decorations || []).filter(item => item.id !== id);
      // Re-index remaining display orders sequentially (0-indexed)
      const reindexed = updated.map((item, idx) => ({
        ...item,
        displayOrder: idx
      }));
      await updateDecorations(reindexed);
      setShowDeleteConfirm(null);
      showToast("Decorative item deleted successfully.");
    } catch (error) {
      console.error("Error deleting decorative item:", error);
      showToast("Failed to delete decorative item.", "error");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setStatusUpdating(id);
    try {
      const updated = (decorations || []).map(item => {
        if (item.id === id) {
          return { ...item, enabled: !currentStatus };
        }
        return item;
      });
      await updateDecorations(updated);
      showToast(`Decorative item is now ${!currentStatus ? 'Active' : 'Disabled'}.`);
    } catch (error) {
      console.error("Error toggling status:", error);
      showToast("Failed to update status.", "error");
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const list = [...(decorations || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    // Swap elements
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // Re-assign displayOrder sequentially
    const reordered = list.map((item, idx) => ({
      ...item,
      displayOrder: idx
    }));

    try {
      await updateDecorations(reordered);
      showToast("Display order updated successfully.");
    } catch (error) {
      console.error("Error updating order:", error);
      showToast("Failed to update display order.", "error");
    }
  };

  const handleUndo = async () => {
    try {
      await undo('decorations');
      showToast("Undone last changes successfully!");
    } catch (error) {
      console.error("Error on undo:", error);
      showToast("Undo failed.", "error");
    }
  };

  const handleRestoreDefaults = async () => {
    try {
      await restoreDefaults('decorations');
      setShowRestoreConfirm(false);
      showToast("Restored decorative items to default configurations!");
    } catch (error) {
      console.error("Error restoring defaults:", error);
      showToast("Restore defaults failed.", "error");
    }
  };

  // Sort by displayOrder
  const sortedDecorations = [...(decorations || [])].sort((a, b) => a.displayOrder - b.displayOrder);

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

      {/* Main Header & Creation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">Decorative Items CMS</h1>
          <p className="text-gray-500 text-sm mt-1">Manage candles, balloons, party props, and other celebration accessories.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Undo Action */}
          {hasUndo('decorations') && (
            <button
              onClick={handleUndo}
              className="flex items-center justify-center gap-2 bg-cream-dark text-chocolate px-5 py-3 rounded-2xl font-bold shadow-md hover:bg-cream transition-all w-full sm:w-auto h-11 min-h-[44px]"
            >
              <RotateCcw size={16} />
              <span>Undo Last Change</span>
            </button>
          )}

          {/* Reset Defaults */}
          <button
            onClick={() => setShowRestoreConfirm(true)}
            className="flex items-center justify-center gap-2 bg-gray-100 text-chocolate px-5 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all w-full sm:w-auto h-11 min-h-[44px]"
          >
            <Sparkles size={16} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => {
              setSelectedItem(null);
              setIsFormOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-rose-deep text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown transition-all w-full sm:w-auto h-11 min-h-[44px]"
          >
            <Plus size={20} />
            <span>Add Decorative Item</span>
          </button>
        </div>
      </div>

      {/* Main Grid View of Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading && sortedDecorations.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-rose-deep" size={40} />
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">Loading decorative items...</p>
          </div>
        ) : sortedDecorations.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center gap-4 bg-white rounded-[28px] sm:rounded-[32px] border border-dashed border-gray-200">
            <Sparkles className="text-gray-100" size={64} />
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">No decorations created yet.</p>
          </div>
        ) : (
          sortedDecorations.map((item, index) => {
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
                    src={item.img}
                    alt={item.name}
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
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-black uppercase text-rose-deep tracking-wider px-2 py-0.5 bg-rose-50 rounded">
                        {item.category}
                      </span>
                      <span className="font-playfair font-bold text-chocolate text-base">₹{item.price}</span>
                    </div>
                    <h3 className="text-sm font-bold text-chocolate truncate mt-2" title={item.name}>
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium line-clamp-2 mt-1 min-h-[2rem]">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleActive(item.id, item.enabled !== false);
                        }}
                        disabled={statusUpdating === item.id}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md flex items-center gap-1 transition-all hover:scale-105 active:scale-95 ${
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

                      {/* Display Order reordering arrows */}
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1.5 rounded-lg bg-gray-50 text-chocolate hover:bg-cream transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === sortedDecorations.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded-lg bg-gray-50 text-chocolate hover:bg-cream transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

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
        <DecorationForm
          item={selectedItem}
          allDecorations={decorations || []}
          onClose={() => setIsFormOpen(false)}
          onSuccess={(message) => showToast(message)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmationModal
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
        title="Delete Decorative Item?"
        message="This action will permanently remove this decoration item from your store database and customer recommendations."
        confirmText="Confirm Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Restore Defaults Confirmation Modal */}
      <AdminConfirmationModal
        isOpen={showRestoreConfirm}
        onClose={() => setShowRestoreConfirm(false)}
        onConfirm={handleRestoreDefaults}
        title="Restore Default Decorative Items?"
        message="This will replace all current decorations with the original defaults (Pastel Balloon Bouquet, Golden Sparkler Candles, Acrylic Birthday Topper, Romantic Rose Petals Kit). This action can be Undone using 'Undo Last Change'!"
        confirmText="Restore Defaults"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};

export default AdminDecorations;
