"use client";

import React, { useState, useEffect } from 'react';
import { useCMS } from '@/context/CMSContext';
import { TestimonialsSettings, TestimonialItem } from '@/types/cms';
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
  User,
  Star,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_TESTIMONIALS_SETTINGS } from '@/constants/cmsDefaults';

const AdminTestimonials = () => {
  const { testimonialsSettings, updateTestimonialsSettings, loading } = useCMS();
  const [localTestimonials, setLocalTestimonials] = useState<TestimonialsSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (testimonialsSettings) {
      setLocalTestimonials(JSON.parse(JSON.stringify(testimonialsSettings)));
    }
  }, [testimonialsSettings]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFieldChange = (field: keyof TestimonialsSettings, value: any) => {
    if (!localTestimonials) return;
    setLocalTestimonials(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleItemFieldChange = (index: number, field: keyof TestimonialItem, value: any) => {
    if (!localTestimonials) return;
    const updatedItems = [...(localTestimonials.items || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    handleFieldChange('items', updatedItems);
  };

  const handleAddItem = () => {
    if (!localTestimonials) return;
    const updatedItems = [...(localTestimonials.items || [])];
    const newId = `t_new_${Date.now()}`;
    updatedItems.push({
      id: newId,
      name: "New Guest Critic",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      tag: "Verified Customer",
      rating: 5,
      text: "Absolutely stunning cake creation!",
      displayOrder: updatedItems.length
    });
    handleFieldChange('items', updatedItems);
    showToast("Added testimonial slot! Click 'Save All Settings' to apply.");
  };

  const handleRemoveItem = (index: number) => {
    if (!localTestimonials) return;
    const updatedItems = [...(localTestimonials.items || [])];
    updatedItems.splice(index, 1);
    const normalized = updatedItems.map((item, idx) => ({ ...item, displayOrder: idx }));
    handleFieldChange('items', normalized);
    showToast("Removed testimonial slot.");
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (!localTestimonials) return;
    const updatedItems = [...(localTestimonials.items || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updatedItems.length) return;

    // Swap
    const temp = updatedItems[index];
    updatedItems[index] = updatedItems[targetIndex];
    updatedItems[targetIndex] = temp;

    const normalized = updatedItems.map((item, idx) => ({ ...item, displayOrder: idx }));
    handleFieldChange('items', normalized);
    showToast(`Moved testimonial ${direction}!`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file || !localTestimonials) return;

    setUploadingIndex(index);
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || cloudName === "your_cloud_name" || !uploadPreset) {
        // Local offline fallback
        const reader = new FileReader();
        reader.onload = () => {
          handleItemFieldChange(index, 'avatar', reader.result as string);
          showToast("Avatar image loaded locally!");
        };
        reader.readAsDataURL(file);
      } else {
        const uploadedUrl = await uploadToCloudinary(file);
        handleItemFieldChange(index, 'avatar', uploadedUrl);
        showToast("Avatar uploaded to Cloudinary!");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      showToast("Failed to upload avatar.", "error");
    } finally {
      setUploadingIndex(null);
      e.target.value = '';
    }
  };

  const handleSaveSettings = async () => {
    if (!localTestimonials) return;
    setSaving(true);
    try {
      await updateTestimonialsSettings(localTestimonials);
      showToast("Testimonial settings saved successfully!");
    } catch (err) {
      console.error("Error saving testimonials settings:", err);
      showToast("Failed to save testimonial settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    setLocalTestimonials(JSON.parse(JSON.stringify(DEFAULT_TESTIMONIALS_SETTINGS)));
    showToast("Reset local inputs to premium system defaults. Click 'Save All Settings' to apply.");
  };

  if (loading || !localTestimonials) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-rose-deep" size={36} />
        <p className="text-gray-500 font-medium">Synchronizing Homepage Testimonials CMS Module...</p>
      </div>
    );
  }

  const items = localTestimonials.items || [];

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
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">Homepage Testimonials CMS</h1>
          <p className="text-gray-500 mt-1 text-sm">Direct, real-time control over client reviews, ratings, stars, avatar photography assets, and active ordering.</p>
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
            onClick={() => handleFieldChange('enabled', !localTestimonials.enabled)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border h-11 min-h-[44px] ${
              localTestimonials.enabled
                ? 'bg-green-50 text-green-600 border-green-200'
                : 'bg-red-50 text-red-500 border-red-200'
            }`}
          >
            {localTestimonials.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
            <span>{localTestimonials.enabled ? 'Section Live' : 'Section Hidden'}</span>
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
        {/* Left column: Headings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-chocolate flex items-center gap-2 border-b border-gray-50 pb-3 font-playfair">
              <Type size={20} className="text-rose-deep" />
              Testimonials Headings
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Subtitle Label</label>
                <input
                  type="text"
                  value={localTestimonials.subtitle || ''}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-bold text-chocolate"
                  placeholder="e.g. What People Are Saying"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Main Heading Title</label>
                <input
                  type="text"
                  value={localTestimonials.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-bold text-chocolate font-playfair"
                  placeholder="e.g. Love Letters from Foodies"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Review slots */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <h2 className="text-lg font-bold text-chocolate flex items-center gap-2 font-playfair">
                <User size={18} className="text-rose-deep" />
                Review Cards List
              </h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-rose-deep hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Add Testimonial
              </button>
            </div>

            <div className="space-y-6">
              {items.map((item, idx) => (
                <div key={item.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col md:flex-row gap-5 items-stretch justify-between relative group">
                  <div className="flex gap-4 items-start flex-1">
                    {/* Avatar Preview */}
                    <div className="relative aspect-square w-16 h-16 rounded-full overflow-hidden bg-white border-2 border-blush shadow-sm shrink-0">
                      <img src={item.avatar} className="w-full h-full object-cover" alt={item.name} />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap gap-4 items-center">
                        <div className="text-xs font-black uppercase tracking-wider text-rose-deep">Card Slot #{idx + 1}</div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, rIdx) => (
                            <button
                              key={rIdx}
                              type="button"
                              onClick={() => handleItemFieldChange(idx, 'rating', rIdx + 1)}
                              className="text-gold"
                            >
                              <Star size={14} fill={rIdx < item.rating ? "currentColor" : "none"} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Author Name</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemFieldChange(idx, 'name', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-gray-200 focus:outline-none text-xs font-bold text-chocolate"
                            placeholder="e.g. Priya Sharma"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">User Tag metadata</label>
                          <input
                            type="text"
                            value={item.tag}
                            onChange={(e) => handleItemFieldChange(idx, 'tag', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-gray-200 focus:outline-none text-xs font-medium text-gray-500"
                            placeholder="e.g. Verified Client"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Review Text Statement</label>
                        <textarea
                          rows={2}
                          value={item.text}
                          onChange={(e) => handleItemFieldChange(idx, 'text', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-gray-200 focus:outline-none text-xs font-medium text-gray-600 leading-relaxed"
                          placeholder="Testimonial text copy..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Avatar Image URL</label>
                        <input
                          type="text"
                          value={item.avatar}
                          onChange={(e) => handleItemFieldChange(idx, 'avatar', e.target.value)}
                          className="w-full px-3 py-1 rounded-lg bg-white border border-gray-100 focus:outline-none text-[9px] font-mono text-gray-500"
                          placeholder="Image URL"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center gap-2 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleMoveItem(idx, 'up')}
                        disabled={idx === 0}
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                      >
                        <ArrowUp size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveItem(idx, 'down')}
                        disabled={idx === items.length - 1}
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                      >
                        <ArrowDown size={14} />
                      </button>

                      <label className="flex items-center justify-center gap-1 bg-white border border-gray-200 p-2 rounded-xl text-xs font-bold text-chocolate hover:bg-gray-50 transition-all cursor-pointer shadow-sm">
                        {uploadingIndex === idx ? (
                          <Loader2 className="animate-spin text-rose-deep" size={14} />
                        ) : (
                          <Upload size={14} />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingIndex !== null}
                          onChange={(e) => handleFileUpload(e, idx)}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-2 rounded-xl bg-white border border-red-100 text-red-500 hover:bg-red-50"
                        title="Remove review"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="text-center py-12 italic text-sm text-gray-400 border border-dashed border-gray-200 rounded-3xl">
                  No testimonials configured. Add cards above.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTestimonials;
