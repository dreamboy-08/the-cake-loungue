"use client";

import React, { useState, useEffect } from 'react';
import { useCMS } from '@/context/CMSContext';
import { HomepageSection } from '@/types/cms';
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
  Link as LinkIcon,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_HERO_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80",
  "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=500&q=80",
  "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500&q=80",
  "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&q=80"
];

const AdminHero = () => {
  const { homepageSections, updateHomepageSections, loading } = useCMS();
  const [localHero, setLocalHero] = useState<HomepageSection | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (homepageSections) {
      const hero = homepageSections.find(s => s.id === 'hero');
      if (hero) {
        setLocalHero(JSON.parse(JSON.stringify(hero)));
      }
    }
  }, [homepageSections]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFieldChange = (field: keyof HomepageSection, value: any) => {
    if (!localHero) return;
    setLocalHero(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleImageChange = (index: number, value: string) => {
    if (!localHero) return;
    const currentImages = [...(localHero.images || [])];
    currentImages[index] = value;
    handleFieldChange('images', currentImages);
  };

  const handleAddImage = () => {
    if (!localHero) return;
    const currentImages = [...(localHero.images || [])];
    currentImages.push("https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500&auto=format&fit=crop");
    handleFieldChange('images', currentImages);
    showToast("Added image slot!");
  };

  const handleRemoveImage = (index: number) => {
    if (!localHero) return;
    const currentImages = [...(localHero.images || [])];
    currentImages.splice(index, 1);
    handleFieldChange('images', currentImages);
    showToast("Removed image slot.");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file || !localHero) return;

    setUploadingIndex(index);
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || cloudName === "your_cloud_name" || !uploadPreset) {
        // Fallback offline state: save directly as local data URL
        const reader = new FileReader();
        reader.onload = () => {
          handleImageChange(index, reader.result as string);
          showToast("Image loaded locally!");
        };
        reader.readAsDataURL(file);
      } else {
        const uploadedUrl = await uploadToCloudinary(file);
        handleImageChange(index, uploadedUrl);
        showToast("Image uploaded to Cloudinary successfully!");
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
    if (!localHero || !homepageSections) return;
    setSaving(true);
    try {
      const updatedSections = homepageSections.map(s => s.id === 'hero' ? localHero : s);
      await updateHomepageSections(updatedSections);
      showToast("Homepage Hero configurations saved successfully!");
    } catch (err) {
      console.error("Error saving hero CMS settings:", err);
      showToast("Failed to save Homepage Hero.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (!localHero) return;
    setLocalHero({
      id: 'hero',
      title: 'Exquisite Cakes Delivered Fresh',
      description: 'Handcrafted with love using only the finest premium ingredients.',
      enabled: true,
      order: 0,
      buttonText: 'Order Now',
      buttonLink: '/menu',
      images: [...DEFAULT_HERO_FALLBACK_IMAGES]
    });
    showToast("Reset local inputs to premium system defaults. Click 'Save All Settings' to apply.");
  };

  if (loading || !localHero) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-rose-deep" size={36} />
        <p className="text-gray-500 font-medium">Synchronizing Homepage Hero CMS Module...</p>
      </div>
    );
  }

  const heroImages = localHero.images || [];

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

      {/* Header block following existing styling pattern */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">Homepage Hero CMS</h1>
          <p className="text-gray-500 mt-1 text-sm">Direct, real-time control over the Hero banners, typography headings, CTA buttons, and interactive collage assets.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Reset button */}
          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 h-11 min-h-[44px]"
          >
            <RefreshCw size={14} />
            <span>Reset Defaults</span>
          </button>

          {/* Section Visibility */}
          <button
            onClick={() => handleFieldChange('enabled', !localHero.enabled)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border h-11 min-h-[44px] ${
              localHero.enabled
                ? 'bg-green-50 text-green-600 border-green-200'
                : 'bg-red-50 text-red-500 border-red-200'
            }`}
          >
            {localHero.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
            <span>{localHero.enabled ? 'Section Live' : 'Section Hidden'}</span>
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
        {/* Left 2 columns: Text and button editing */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-chocolate flex items-center gap-2 border-b border-gray-50 pb-3 font-playfair">
              <Type size={20} className="text-rose-deep" />
              Hero Banner Copy
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Hero Heading Title</label>
                <textarea
                  rows={3}
                  value={localHero.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-base font-bold text-chocolate font-playfair"
                  placeholder="Supports line breaks using Enter"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Hero Subheading Description</label>
                <textarea
                  rows={3}
                  value={localHero.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-medium text-gray-600 leading-relaxed"
                  placeholder="Introduce the patisserie..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-chocolate flex items-center gap-2 border-b border-gray-50 pb-3 font-playfair">
              <LinkIcon size={20} className="text-rose-deep" />
              Call To Action Button
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Button Text / Label</label>
                <input
                  type="text"
                  value={localHero.buttonText || ''}
                  onChange={(e) => handleFieldChange('buttonText', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-bold text-chocolate"
                  placeholder="e.g. Order Now"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Button Destination URL Link</label>
                <input
                  type="text"
                  value={localHero.buttonLink || ''}
                  onChange={(e) => handleFieldChange('buttonLink', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-semibold text-gray-600 font-mono"
                  placeholder="e.g. /menu or https://..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Collage Images management */}
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <h2 className="text-lg font-bold text-chocolate flex items-center gap-2 font-playfair">
                <ImageIcon size={18} className="text-rose-deep" />
                Collage Visual Assets
              </h2>
              <button
                type="button"
                onClick={handleAddImage}
                className="text-xs font-bold text-rose-deep hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Add Slot
              </button>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              The premium desktop Hero collage displays up to 4 images. Add or upload high-resolution images to replace them.
            </p>

            <div className="space-y-4">
              {heroImages.map((imgUrl, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-deep">Image Slot #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                      title="Remove Slot"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex gap-3 items-center">
                    {/* Thumbnail preview */}
                    <div className="relative aspect-square w-16 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm shrink-0">
                      <img src={imgUrl} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} />
                    </div>

                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-gray-100 focus:outline-none text-[10px] text-gray-500 font-mono"
                        placeholder="Image URL"
                      />

                      <div className="flex items-center gap-2">
                        <label className="flex-1 flex items-center justify-center gap-1 bg-white border border-gray-200 py-1 rounded-lg text-[9px] font-black text-chocolate hover:bg-gray-50 transition-all cursor-pointer shadow-sm">
                          {uploadingIndex === idx ? (
                            <Loader2 className="animate-spin text-rose-deep" size={10} />
                          ) : (
                            <Upload size={10} />
                          )}
                          <span>{uploadingIndex === idx ? 'Uploading...' : 'Upload'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingIndex !== null}
                            onChange={(e) => handleFileUpload(e, idx)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {heroImages.length === 0 && (
                <div className="text-center py-8 italic text-xs text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                  No images configured. Image collage will fall back to static system defaults.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHero;
