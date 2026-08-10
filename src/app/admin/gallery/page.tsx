"use client";

import React, { useState, useEffect } from 'react';
import { useCMS } from '@/context/CMSContext';
import { GallerySettings, GalleryItem } from '@/types/cms';
import { uploadToCloudinary } from '@/utils/cloudinary';
import {
  Save,
  Loader2,
  Trash2,
  Plus,
  Upload,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Type,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_GALLERY_SETTINGS } from '@/constants/cmsDefaults';

const AdminGallery = () => {
  const { gallerySettings, updateGallerySettings, loading } = useCMS();
  const [localGallery, setLocalGallery] = useState<GallerySettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (gallerySettings) {
      setLocalGallery(JSON.parse(JSON.stringify(gallerySettings)));
    }
  }, [gallerySettings]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFieldChange = (field: keyof GallerySettings, value: any) => {
    if (!localGallery) return;
    setLocalGallery(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleItemFieldChange = (index: number, field: keyof GalleryItem, value: any) => {
    if (!localGallery) return;
    const updatedItems = [...(localGallery.items || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    handleFieldChange('items', updatedItems);
  };

  const handleAddItem = () => {
    if (!localGallery) return;
    const updatedItems = [...(localGallery.items || [])];
    const newId = `g_new_${Date.now()}`;
    updatedItems.push({
      id: newId,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80",
      caption: "New Creational Masterpiece",
      displayOrder: updatedItems.length
    });
    handleFieldChange('items', updatedItems);
    showToast("Add item slot! Click 'Save All Settings' to apply.");
  };

  const handleRemoveItem = (index: number) => {
    if (!localGallery) return;
    const updatedItems = [...(localGallery.items || [])];
    updatedItems.splice(index, 1);
    // Recalculate display orders
    const normalized = updatedItems.map((item, idx) => ({ ...item, displayOrder: idx }));
    handleFieldChange('items', normalized);
    showToast("Removed gallery item slot.");
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (!localGallery) return;
    const updatedItems = [...(localGallery.items || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updatedItems.length) return;

    // Swap
    const temp = updatedItems[index];
    updatedItems[index] = updatedItems[targetIndex];
    updatedItems[targetIndex] = temp;

    // Normalize display orders
    const normalized = updatedItems.map((item, idx) => ({ ...item, displayOrder: idx }));
    handleFieldChange('items', normalized);
    showToast(`Moved item ${direction}!`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file || !localGallery) return;

    setUploadingIndex(index);
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || cloudName === "your_cloud_name" || !uploadPreset) {
        // Local offline fallback
        const reader = new FileReader();
        reader.onload = () => {
          handleItemFieldChange(index, 'image', reader.result as string);
          showToast("Image loaded locally!");
        };
        reader.readAsDataURL(file);
      } else {
        const uploadedUrl = await uploadToCloudinary(file);
        handleItemFieldChange(index, 'image', uploadedUrl);
        showToast("Image uploaded to Cloudinary!");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      showToast("Failed to upload image.", "error");
    } finally {
      setUploadingIndex(null);
      e.target.value = '';
    }
  };

  const handleSaveSettings = async () => {
    if (!localGallery) return;
    setSaving(true);
    try {
      await updateGallerySettings(localGallery);
      showToast("Gallery settings saved successfully!");
    } catch (err) {
      console.error("Error saving gallery settings:", err);
      showToast("Failed to save gallery settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    setLocalGallery(JSON.parse(JSON.stringify(DEFAULT_GALLERY_SETTINGS)));
    showToast("Reset local inputs to premium system defaults. Click 'Save All Settings' to apply.");
  };

  if (loading || !localGallery) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-rose-deep" size={36} />
        <p className="text-gray-500 font-medium">Synchronizing Homepage Gallery CMS Module...</p>
      </div>
    );
  }

  const items = localGallery.items || [];

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6 sm:space-y-8 animate-fade-up pb-24 max-w-[1600px] mx-auto">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-8 left-1/2 z-[500] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">Homepage Gallery CMS</h1>
          <p className="text-gray-500 mt-1 text-sm">Direct, real-time control over the Homepage slider creations gallery, captions and enabled display order.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 h-11 min-h-[44px]"
          >
            <RefreshCw size={14} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => handleFieldChange('enabled', !localGallery.enabled)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border h-11 min-h-[44px] ${
              localGallery.enabled
                ? 'bg-green-50 text-green-600 border-green-200'
                : 'bg-red-50 text-red-500 border-red-200'
            }`}
          >
            {localGallery.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
            <span>{localGallery.enabled ? 'Section Live' : 'Section Hidden'}</span>
          </button>

          <button
            disabled={saving}
            onClick={handleSaveSettings}
            className="flex items-center gap-2 bg-chocolate text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-brown transition-all disabled:opacity-50 text-xs shrink-0 h-11 min-h-[44px]"
          >
            {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            <span>Save All Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Header Copy Config */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-chocolate flex items-center gap-2 border-b border-gray-50 pb-3 font-playfair">
              <Type size={20} className="text-rose-deep" />
              Gallery Headings
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Subtitle Label</label>
                <input
                  type="text"
                  value={localGallery.subtitle || ''}
                  placeholder="e.g. A Feast for the Eyes"
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-bold text-chocolate"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Main Heading Title</label>
                <input
                  type="text"
                  value={localGallery.title || ''}
                  placeholder="e.g. Our Master Creations"
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-bold text-chocolate font-playfair"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Reorderable Item Slots */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <h2 className="text-lg font-bold text-chocolate flex items-center gap-2 font-playfair">
                <ImageIcon size={18} className="text-rose-deep" />
                Gallery Items List
              </h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-rose-deep hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between relative group">
                  <div className="flex gap-4 items-center w-full sm:w-auto">
                    {/* Thumbnail preview */}
                    <div className="relative aspect-square w-20 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.caption} />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="text-xs font-black uppercase tracking-wider text-rose-deep">Gallery Slot #{idx + 1}</div>
                      <input
                        type="text"
                        value={item.caption}
                        onChange={(e) => handleItemFieldChange(idx, 'caption', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-gray-200 focus:outline-none text-xs font-semibold text-chocolate"
                        placeholder="Caption/Label"
                      />
                      <input
                        type="text"
                        value={item.image}
                        onChange={(e) => handleItemFieldChange(idx, 'image', e.target.value)}
                        className="w-full px-3 py-1 bg-white border border-gray-100 focus:outline-none text-[9px] text-gray-500 font-mono"
                        placeholder="Image URL"
                      />
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center gap-2 justify-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="flex items-center gap-1.5">
                      {/* Move Up */}
                      <button
                        type="button"
                        onClick={() => handleMoveItem(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                      >
                        <ArrowUp size={12} />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        onClick={() => handleMoveItem(idx, 'down')}
                        disabled={idx === items.length - 1}
                        className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                      >
                        <ArrowDown size={12} />
                      </button>

                      {/* File Upload */}
                      <label className="flex items-center justify-center gap-1 bg-white border border-gray-200 p-1.5 rounded-lg text-[10px] font-bold text-chocolate hover:bg-gray-50 transition-all cursor-pointer shadow-sm">
                        {uploadingIndex === idx ? (
                          <Loader2 className="animate-spin text-rose-deep" size={12} />
                        ) : (
                          <Upload size={12} />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingIndex !== null}
                          onChange={(e) => handleFileUpload(e, idx)}
                          className="hidden"
                        />
                      </label>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 rounded-lg bg-white border border-red-100 text-red-500 hover:bg-red-50"
                        title="Remove item"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="text-center py-12 italic text-sm text-gray-400 border border-dashed border-gray-200 rounded-3xl">
                  No gallery items configured. Add slots above.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;
