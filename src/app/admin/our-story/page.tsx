"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useCMS } from '@/context/CMSContext';
import { AboutSectionSettings, AboutFeatureCard } from '@/types/cms';
import { uploadToCloudinary } from '@/utils/cloudinary';
import getCroppedImg from '@/utils/cropImage';
import Cropper from 'react-easy-crop';
import AdminConfirmationModal from '@/components/admin/AdminConfirmationModal';
import {
  Save,
  Loader2,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Upload,
  Eye,
  EyeOff,
  Scissors,
  Check,
  X,
  Type,
  Layout as LayoutIcon,
  Palette,
  Sparkles,
  Award,
  Sprout,
  Hand,
  Truck,
  Heart,
  Cake,
  Gift,
  ShoppingBag,
  Star,
  Smile,
  Coffee,
  Clock,
  Flame,
  Shield,
  RotateCw,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Available Lucide Icons Map for Visual Selection
const AVAILABLE_ICONS = [
  { name: 'Sprout', icon: <Sprout size={18} /> },
  { name: 'Hand', icon: <Hand size={18} /> },
  { name: 'Truck', icon: <Truck size={18} /> },
  { name: 'Heart', icon: <Heart size={18} /> },
  { name: 'Sparkles', icon: <Sparkles size={18} /> },
  { name: 'Cake', icon: <Cake size={18} /> },
  { name: 'Gift', icon: <Gift size={18} /> },
  { name: 'ShoppingBag', icon: <ShoppingBag size={18} /> },
  { name: 'Award', icon: <Award size={18} /> },
  { name: 'Star', icon: <Star size={18} /> },
  { name: 'Smile', icon: <Smile size={18} /> },
  { name: 'Coffee', icon: <Coffee size={18} /> },
  { name: 'Clock', icon: <Clock size={18} /> },
  { name: 'Flame', icon: <Flame size={18} /> },
  { name: 'Shield', icon: <Shield size={18} /> }
];

// Helper to render dynamically chosen icons
const renderCmsIcon = (iconName: string, size = 18) => {
  switch (iconName) {
    case 'Sprout': return <Sprout size={size} />;
    case 'Hand': return <Hand size={size} />;
    case 'Truck': return <Truck size={size} />;
    case 'Heart': return <Heart size={size} />;
    case 'Sparkles': return <Sparkles size={size} />;
    case 'Cake': return <Cake size={size} />;
    case 'Gift': return <Gift size={size} />;
    case 'ShoppingBag': return <ShoppingBag size={size} />;
    case 'Award': return <Award size={size} />;
    case 'Star': return <Star size={size} />;
    case 'Smile': return <Smile size={size} />;
    case 'Coffee': return <Coffee size={size} />;
    case 'Clock': return <Clock size={size} />;
    case 'Flame': return <Flame size={size} />;
    case 'Shield': return <Shield size={size} />;
    default: return <Award size={size} />;
  }
};

/**
 * OurStoryAdmin Component - Direct editorial management of the storefront 'About Us' section
 * Supports rich HTML text, visual image replacement with real-time visual cropping (aspect 4:5),
 * floating statistic badges, and entrance transitions.
 */
const OurStoryAdmin = () => {
  const { aboutSettings, updateAboutSettings, loading } = useCMS();
  const [localSettings, setLocalSettings] = useState<AboutSectionSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Crop Tool Modal States
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);

  // react-easy-crop states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Drag and Drop State
  const [isDragging, setIsDragging] = useState(false);

  // Rich Text Textarea Helper Ref
  const storyTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Active Icon Picker Card state
  const [activeIconPickerCardId, setActiveIconPickerCardId] = useState<string | null>(null);

  useEffect(() => {
    if (aboutSettings) {
      setLocalSettings(JSON.parse(JSON.stringify(aboutSettings)));
    }
  }, [aboutSettings]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFieldChange = (field: keyof AboutSectionSettings, value: any) => {
    if (!localSettings) return;
    setLocalSettings(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  // HTML Inserting Tool (Rich Text Editor Helper)
  const insertHtmlTag = (tagOpen: string, tagClose: string) => {
    const textarea = storyTextareaRef.current;
    if (!textarea || !localSettings) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = tagOpen + selected + tagClose;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    handleFieldChange('storyContent', newContent);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selected.length);
    }, 50);
  };

  // Process uploaded/selected image source
  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImageSrc(reader.result as string);
      // Reset cropping variables
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setPreviewUrl(null);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Image Upload handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
    e.target.value = '';
  };

  // Drag & Drop callbacks
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    } else {
      showToast("Please drop a valid image file.", "error");
    }
  };

  // Trigger Re-crop for existing image
  const handleReCropExisting = () => {
    if (!localSettings?.leftImageUrl) return;
    setOriginalImageSrc(localSettings.leftImageUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setPreviewUrl(null);
    setCropModalOpen(true);
  };

  // EasyCrop callback
  const onCropComplete = useCallback(async (_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
    if (!originalImageSrc) return;
    try {
      const croppedImg = await getCroppedImg(
        originalImageSrc,
        croppedAreaPixels,
        rotation
      );
      setPreviewUrl(croppedImg);
    } catch (e) {
      console.error("Live preview crop generation failed:", e);
    }
  }, [originalImageSrc, rotation]);

  // Apply Crop and Save/Upload
  const handleApplyCrop = async () => {
    if (!originalImageSrc || !croppedAreaPixels || !localSettings) return;

    setCropModalOpen(false);
    setSaving(true);
    try {
      const croppedDataUrl = await getCroppedImg(
        originalImageSrc,
        croppedAreaPixels,
        rotation
      );

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || cloudName === "your_cloud_name" || !uploadPreset) {
        // Fallback offline state: save directly as local data URL
        handleFieldChange('leftImageUrl', croppedDataUrl);
        showToast("Cropped image updated locally!");
      } else {
        // Standard high-resolution Cloudinary Upload
        const res = await fetch(croppedDataUrl);
        const blob = await res.blob();
        const file = new File([blob], "our-story-cropped.jpg", { type: "image/jpeg" });
        const uploadedUrl = await uploadToCloudinary(file);
        handleFieldChange('leftImageUrl', uploadedUrl);
        showToast("Cropped image uploaded successfully!");
      }
    } catch (err) {
      console.error("Failed image upload:", err);
      showToast("Failed to save cropped image.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Reset Cropping adjustments
  const handleResetCrop = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  // Nudge Position controls
  const handleNudge = (direction: 'up' | 'down' | 'left' | 'right') => {
    const step = 10;
    setCrop(prev => {
      switch (direction) {
        case 'up': return { ...prev, y: prev.y - step };
        case 'down': return { ...prev, y: prev.y + step };
        case 'left': return { ...prev, x: prev.x - step };
        case 'right': return { ...prev, x: prev.x + step };
      }
    });
  };

  // Delete image
  const handleDeleteImage = () => {
    handleFieldChange('leftImageUrl', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80');
    showToast("Left image reset to default.");
  };

  // Feature Card List management
  const handleAddFeature = () => {
    if (!localSettings) return;
    const newFeature: AboutFeatureCard = {
      id: 'f_' + Date.now(),
      icon: 'Award',
      title: 'New Dynamic Feature',
      desc: 'Introduce another core value or secret recipe attribute.',
      displayOrder: localSettings.features.length,
      enabled: true
    };
    handleFieldChange('features', [...localSettings.features, newFeature]);
    showToast("Feature card added!");
  };

  const handleEditFeature = (id: string, key: keyof AboutFeatureCard, value: any) => {
    if (!localSettings) return;
    const updatedFeatures = localSettings.features.map(feat =>
      feat.id === id ? { ...feat, [key]: value } : feat
    );
    handleFieldChange('features', updatedFeatures);
  };

  const handleDeleteFeature = (id: string) => {
    if (!localSettings) return;
    const updatedFeatures = localSettings.features
      .filter(feat => feat.id !== id)
      .map((feat, idx) => ({ ...feat, displayOrder: idx }));
    handleFieldChange('features', updatedFeatures);
    showToast("Feature card deleted.");
  };

  const handleReorderFeature = (index: number, direction: 'up' | 'down') => {
    if (!localSettings) return;
    const features = [...localSettings.features].sort((a, b) => a.displayOrder - b.displayOrder);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= features.length) return;

    // Swap
    const temp = features[index];
    features[index] = features[targetIndex];
    features[targetIndex] = temp;

    const updated = features.map((feat, idx) => ({ ...feat, displayOrder: idx }));
    handleFieldChange('features', updated);
  };

  // Save changes to CMS Provider/Firestore
  const handleSaveSettings = async () => {
    if (!localSettings) return;
    setSaving(true);
    try {
      await updateAboutSettings(localSettings);
      showToast("Our Story settings saved in real-time!");
    } catch (err) {
      showToast("Failed to save settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !localSettings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-rose-deep" size={36} />
        <p className="text-gray-500 font-medium">Synchronizing Our Story CMS Module...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up pb-24">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[500] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            <Check size={18} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Block */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-chocolate">About Us & Our Story CMS</h1>
          <p className="text-gray-500 mt-1">Direct control over the storytelling block on the primary storefront homepage.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Section Visibility */}
          <button
            onClick={() => handleFieldChange('enabled', !localSettings.enabled)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              localSettings.enabled
                ? 'bg-green-50 text-green-600 border-green-200'
                : 'bg-red-50 text-red-500 border-red-200'
            }`}
          >
            {localSettings.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
            <span>{localSettings.enabled ? 'Section Enabled' : 'Section Hidden'}</span>
          </button>

          <button
            disabled={saving}
            onClick={handleSaveSettings}
            className="flex items-center gap-2 bg-chocolate text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-brown transition-all disabled:opacity-50 text-xs shrink-0"
          >
            {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            <span>Save All Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Narrative & Copy Editing */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-chocolate flex items-center gap-2 border-b border-gray-50 pb-3">
              <Type size={20} className="text-rose-deep" />
              Main Narrative Copy
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Section Badge</label>
                <input
                  type="text"
                  value={localSettings.sectionBadge}
                  onChange={(e) => handleFieldChange('sectionBadge', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Main Heading Title</label>
                <textarea
                  rows={2}
                  value={localSettings.heading}
                  onChange={(e) => handleFieldChange('heading', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-semibold resize-none"
                  placeholder="Supports line breaks using Enter"
                />
              </div>
            </div>

            {/* Rich Text Editor Simulation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Story Editorial Content (HTML Rich Text)</label>

                {/* HTML tags quick insert toolbar */}
                <div className="flex flex-wrap gap-1.5 bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => insertHtmlTag('<strong>', '</strong>')}
                    className="px-2 py-1 text-[10px] font-bold bg-white rounded shadow-sm hover:bg-rose-deep hover:text-white transition-colors"
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => insertHtmlTag('<em>', '</em>')}
                    className="px-2 py-1 text-[10px] font-bold bg-white rounded shadow-sm hover:bg-rose-deep hover:text-white transition-colors italic"
                    title="Italic"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => insertHtmlTag('<ul>\n  <li>', '</li>\n</ul>')}
                    className="px-2 py-1 text-[10px] font-bold bg-white rounded shadow-sm hover:bg-rose-deep hover:text-white transition-colors"
                    title="Bullet List"
                  >
                    • List
                  </button>
                  <button
                    type="button"
                    onClick={() => insertHtmlTag('<p>', '</p>')}
                    className="px-2 py-1 text-[10px] font-bold bg-white rounded shadow-sm hover:bg-rose-deep hover:text-white transition-colors"
                    title="Paragraph Tag"
                  >
                    P
                  </button>
                  <button
                    type="button"
                    onClick={() => insertHtmlTag('<br />', '')}
                    className="px-2 py-1 text-[10px] font-bold bg-white rounded shadow-sm hover:bg-rose-deep hover:text-white transition-colors"
                    title="Line break"
                  >
                    Line break
                  </button>
                </div>
              </div>

              <textarea
                ref={storyTextareaRef}
                rows={6}
                value={localSettings.storyContent}
                onChange={(e) => handleFieldChange('storyContent', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-medium font-mono"
                placeholder="Enter rich paragraph content, or select text and click styling buttons above."
              />

              {/* Instant Render HTML Live Preview */}
              <div className="p-4 rounded-xl bg-cream border border-gray-100 mt-2">
                <span className="text-[8px] font-bold text-rose-deep uppercase tracking-wider block mb-2">Live Content Preview</span>
                <div
                  className="text-xs text-text-soft leading-[1.6]"
                  dangerouslySetInnerHTML={{ __html: localSettings.storyContent }}
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC FEATURE LIST MODULE */}
          <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <h2 className="text-lg font-bold text-chocolate flex items-center gap-2">
                <Sparkles size={20} className="text-rose-deep" />
                Dynamic Brand Features list ({localSettings.features.length})
              </h2>
              <button
                type="button"
                onClick={handleAddFeature}
                className="flex items-center gap-1 bg-rose-deep text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brown transition-all shadow-sm"
              >
                <Plus size={14} /> Add Feature
              </button>
            </div>

            <div className="space-y-4">
              {localSettings.features
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((feat, idx) => (
                  <div
                    key={feat.id}
                    className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4 relative group"
                  >
                    {/* Controls Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-400 bg-white border border-gray-100 px-2 py-0.5 rounded-md">
                          Order #{feat.displayOrder}
                        </span>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleReorderFeature(idx, 'up')}
                          className="p-1 text-gray-400 hover:text-chocolate disabled:opacity-30 transition-colors"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === localSettings.features.length - 1}
                          onClick={() => handleReorderFeature(idx, 'down')}
                          className="p-1 text-gray-400 hover:text-chocolate disabled:opacity-30 transition-colors"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Enabled/Disabled toggle */}
                        <button
                          type="button"
                          onClick={() => handleEditFeature(feat.id, 'enabled', !feat.enabled)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all border ${
                            feat.enabled
                              ? 'bg-green-50 text-green-600 border-green-100'
                              : 'bg-gray-100 text-gray-400 border-gray-200'
                          }`}
                        >
                          {feat.enabled ? <Eye size={10} /> : <EyeOff size={10} />}
                          <span>{feat.enabled ? 'Enabled' : 'Disabled'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteFeature(feat.id)}
                          className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                          title="Delete Feature"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Icon Selector Button */}
                      <div className="space-y-1.5 relative">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Icon</label>
                        <button
                          type="button"
                          onClick={() => setActiveIconPickerCardId(activeIconPickerCardId === feat.id ? null : feat.id)}
                          className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-chocolate hover:border-rose-deep/40 transition-all text-left"
                        >
                          <span className="flex items-center gap-2">
                            {renderCmsIcon(feat.icon)}
                            {feat.icon}
                          </span>
                          <span className="text-[9px] text-rose-deep font-bold">Pick</span>
                        </button>

                        {/* Dropdown Icon Selector */}
                        <AnimatePresence>
                          {activeIconPickerCardId === feat.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute left-0 right-0 mt-1 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 grid grid-cols-5 gap-2 z-50 max-h-40 overflow-y-auto"
                            >
                              {AVAILABLE_ICONS.map(item => (
                                <button
                                  key={item.name}
                                  type="button"
                                  onClick={() => {
                                    handleEditFeature(feat.id, 'icon', item.name);
                                    setActiveIconPickerCardId(null);
                                  }}
                                  className={`p-2 flex items-center justify-center rounded-lg hover:bg-rose/10 hover:text-rose-deep transition-all ${
                                    feat.icon === item.name ? 'bg-rose-deep text-white' : 'text-gray-500 bg-gray-50'
                                  }`}
                                  title={item.name}
                                >
                                  {item.icon}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Feature Title</label>
                        <input
                          type="text"
                          value={feat.title}
                          onChange={(e) => handleEditFeature(feat.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-xs font-semibold text-chocolate"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Feature Description</label>
                        <input
                          type="text"
                          value={feat.desc}
                          onChange={(e) => handleEditFeature(feat.id, 'desc', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-xs font-semibold text-text-soft"
                        />
                      </div>
                    </div>
                  </div>
                ))}

              {localSettings.features.length === 0 && (
                <div className="text-center py-8 italic text-xs text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                  No features configured. Click &apos;Add Feature&apos; above to begin.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Images, Experiences & Style Controls */}
        <div className="space-y-6">

          {/* IMAGE CONTROLS */}
          <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-sm border border-gray-100 space-y-5">
            <h2 className="text-lg font-bold text-chocolate flex items-center gap-2 border-b border-gray-50 pb-3">
              <Upload size={18} className="text-rose-deep" />
              Left Side Visual Image
            </h2>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-2xl overflow-hidden aspect-[4/5] border-2 transition-all group flex flex-col items-center justify-center cursor-pointer p-4 ${
                isDragging
                  ? 'border-rose-deep bg-rose-50/50 scale-[0.98]'
                  : 'border-dashed border-gray-200 hover:border-rose-deep/40 bg-gray-50/50'
              }`}
            >
              {localSettings.leftImageUrl ? (
                <>
                  <img
                    src={localSettings.leftImageUrl}
                    alt="Story Illustration"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Luxury hovering actions overlay */}
                  <div className="absolute inset-0 bg-chocolate/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4 text-center">
                    <span className="text-white text-[11px] font-semibold mb-2">Drag and drop or choose actions:</span>
                    <div className="flex gap-2.5">
                      <label className="p-2.5 bg-white rounded-full text-chocolate hover:bg-rose-deep hover:text-white transition-all cursor-pointer shadow-md" title="Replace Image">
                        <Upload size={16} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleReCropExisting}
                        className="p-2.5 bg-white rounded-full text-chocolate hover:bg-rose-deep hover:text-white transition-all shadow-md"
                        title="Re-crop Existing Image"
                      >
                        <Scissors size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="p-2.5 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md"
                        title="Reset Image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-4 bg-white rounded-full shadow-sm text-rose-deep">
                    <Upload size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-chocolate block">Drag & Drop Image here</span>
                    <span className="text-[10px] text-gray-400 block mt-1">Supports PNG, JPG, WEBP formats</span>
                  </div>
                  <label className="bg-chocolate hover:bg-brown text-white text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer shadow-sm transition-all">
                    Browse File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Drag overlay text hint */}
              {isDragging && (
                <div className="absolute inset-0 bg-rose-deep/90 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 z-20 animate-fade-in">
                  <Upload size={32} className="animate-bounce mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Drop to Crop Image</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-chocolate px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">
                <Upload size={14} />
                <span>Replace Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
              {localSettings.leftImageUrl && (
                <button
                  type="button"
                  onClick={handleReCropExisting}
                  className="flex items-center justify-center gap-1.5 bg-cream hover:bg-rose/10 text-chocolate px-3 py-2.5 rounded-xl text-xs font-bold transition-all border border-gray-100"
                >
                  <Scissors size={14} />
                  <span>Re-crop</span>
                </button>
              )}
            </div>
          </div>

          {/* EXPERIENCE STAT CARD */}
          <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-chocolate flex items-center gap-2 border-b border-gray-50 pb-3">
              <Award size={18} className="text-rose-deep" />
              Floating Experience Badge
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Statistic Number</label>
                <input
                  type="text"
                  value={localSettings.experienceNumber}
                  onChange={(e) => handleFieldChange('experienceNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-rose-deep focus:outline-none"
                  placeholder="e.g. 10+"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Short Title</label>
                <input
                  type="text"
                  value={localSettings.experienceTitle}
                  onChange={(e) => handleFieldChange('experienceTitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-chocolate focus:outline-none"
                  placeholder="e.g. Years"
                />
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Sub-description</label>
                <input
                  type="text"
                  value={localSettings.experienceDesc}
                  onChange={(e) => handleFieldChange('experienceDesc', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-text-soft focus:outline-none"
                  placeholder="Describe your achievement..."
                />
              </div>
            </div>
          </div>

          {/* IMAGE LAYOUT CONTROLS */}
          <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-chocolate flex items-center gap-2 border-b border-gray-50 pb-3">
              <LayoutIcon size={18} className="text-rose-deep" />
              Image Layout Controls
            </h2>

            <div className="space-y-4 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Image Alignment</span>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleFieldChange('imageLayout', 'left')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      localSettings.imageLayout === 'left' ? 'bg-white text-chocolate shadow-sm' : 'text-gray-400'
                    }`}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('imageLayout', 'right')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      localSettings.imageLayout === 'right' ? 'bg-white text-chocolate shadow-sm' : 'text-gray-400'
                    }`}
                  >
                    Right
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-gray-500">Image Border Radius preset</span>
                <select
                  value={localSettings.imageBorderRadius}
                  onChange={(e) => handleFieldChange('imageBorderRadius', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                >
                  <option value="rounded-none">Square / Sharp</option>
                  <option value="rounded-md">Small (rounded-md)</option>
                  <option value="rounded-xl">Medium (rounded-xl)</option>
                  <option value="rounded-3xl">Large (rounded-3xl)</option>
                  <option value="rounded-full">Fully Oval (rounded-full)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <span className="text-gray-500">Image Shadow depth</span>
                <select
                  value={localSettings.imageShadow}
                  onChange={(e) => handleFieldChange('imageShadow', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                >
                  <option value="shadow-none">No Shadow</option>
                  <option value="shadow-sm">Soft shadow-sm</option>
                  <option value="shadow-md">Medium shadow-md</option>
                  <option value="shadow-lg">Deep shadow-lg</option>
                  <option value="shadow-2xl">Extreme shadow-2xl</option>
                </select>
              </div>
            </div>
          </div>

          {/* STYLE CONTROLS */}
          <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-chocolate flex items-center gap-2 border-b border-gray-50 pb-3">
              <Palette size={18} className="text-rose-deep" />
              Luxury Style Controls
            </h2>

            <div className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="text-gray-500">Background Color</span>
                  <div className="flex gap-1.5">
                    <input
                      type="color"
                      value={localSettings.backgroundColor}
                      onChange={(e) => handleFieldChange('backgroundColor', e.target.value)}
                      className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={localSettings.backgroundColor}
                      onChange={(e) => handleFieldChange('backgroundColor', e.target.value)}
                      className="flex-1 w-full text-[10px] font-mono px-2 py-1 bg-gray-50 border border-gray-200 rounded focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-gray-500">Heading Color</span>
                  <div className="flex gap-1.5">
                    <input
                      type="color"
                      value={localSettings.headingColor}
                      onChange={(e) => handleFieldChange('headingColor', e.target.value)}
                      className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={localSettings.headingColor}
                      onChange={(e) => handleFieldChange('headingColor', e.target.value)}
                      className="flex-1 w-full text-[10px] font-mono px-2 py-1 bg-gray-50 border border-gray-200 rounded focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-gray-500">Body text Color</span>
                  <div className="flex gap-1.5">
                    <input
                      type="color"
                      value={localSettings.textColor}
                      onChange={(e) => handleFieldChange('textColor', e.target.value)}
                      className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={localSettings.textColor}
                      onChange={(e) => handleFieldChange('textColor', e.target.value)}
                      className="flex-1 w-full text-[10px] font-mono px-2 py-1 bg-gray-50 border border-gray-200 rounded focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-gray-500">Accent Theme Color</span>
                  <div className="flex gap-1.5">
                    <input
                      type="color"
                      value={localSettings.accentColor}
                      onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                      className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={localSettings.accentColor}
                      onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                      className="flex-1 w-full text-[10px] font-mono px-2 py-1 bg-gray-50 border border-gray-200 rounded focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-gray-500">Premium Gradient Cover overlay</span>
                <input
                  type="text"
                  value={localSettings.gradient}
                  onChange={(e) => handleFieldChange('gradient', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none text-[11px] font-mono"
                  placeholder="e.g. none or tailwind background gradients"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-gray-500">Section Top/Bottom Padding</span>
                <input
                  type="text"
                  value={localSettings.sectionPadding}
                  onChange={(e) => handleFieldChange('sectionPadding', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none text-[11px] font-mono"
                  placeholder="e.g. py-[100px]"
                />
              </div>
            </div>
          </div>

          {/* ANIMATION CONTROLS */}
          <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-chocolate flex items-center gap-2 border-b border-gray-50 pb-3">
              <Sparkles size={18} className="text-rose-deep" />
              Motion Animations
            </h2>

            <div className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <span className="text-gray-500">Entrance Animation Preset</span>
                <select
                  value={localSettings.animationType}
                  onChange={(e) => handleFieldChange('animationType', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                >
                  <option value="fade">Fade in</option>
                  <option value="slide-up">Slide Up</option>
                  <option value="slide-left">Slide Left</option>
                  <option value="zoom">Zoom inside</option>
                  <option value="none">None / Instant render</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="text-gray-500">Duration (seconds)</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={localSettings.animationDuration}
                    onChange={(e) => handleFieldChange('animationDuration', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-gray-500">Delay (seconds)</span>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    value={localSettings.animationDelay}
                    onChange={(e) => handleFieldChange('animationDelay', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* REACT EASY CROP IMAGE CROP MODAL */}
      <AdminConfirmationModal
        isOpen={cropModalOpen && !!originalImageSrc}
        onClose={() => setCropModalOpen(false)}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[90vh] text-left relative z-10 animate-none"
      >
        {/* Modal Header */}
        <div className="p-5 bg-chocolate text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-bold font-playfair text-lg">Crop Illustration Image</h3>
            <span className="text-[10px] uppercase tracking-wider text-white/60">Target: Exact 4:5 Portrait Ratio (Luxury Fit)</span>
          </div>
          <button
            type="button"
            onClick={() => setCropModalOpen(false)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body with 2 columns on desktop (Cropper left, Live Preview right) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Side: Professional Cropper Workspace (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <span className="text-xs font-bold text-chocolate uppercase tracking-wider">Cropping Workspace</span>

            {/* Cropper Container */}
            <div className="relative w-full h-[320px] sm:h-[400px] max-h-[40vh] min-h-[200px] bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
              <Cropper
                image={originalImageSrc || ''}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={4 / 5}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
            </div>

                  {/* Manual Adjustment controls */}
                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                      <span>Position Controls (Nudge Pixel Shift)</span>
                      <button
                        type="button"
                        onClick={handleResetCrop}
                        className="text-rose-deep font-bold hover:underline flex items-center gap-1"
                      >
                        <RefreshCw size={12} />
                        Reset Crop Adjustments
                      </button>
                    </div>

                    {/* D-Pad Nudge Buttons & Reset */}
                    <div className="flex items-center justify-center gap-2 py-1">
                      <div className="grid grid-cols-3 gap-1.5 w-32 shrink-0">
                        <div />
                        <button
                          type="button"
                          onClick={() => handleNudge('up')}
                          className="p-1.5 bg-white border border-gray-200 rounded-lg text-chocolate hover:bg-rose-deep hover:text-white hover:border-rose-deep transition-all flex items-center justify-center"
                          title="Nudge Up"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <div />
                        <button
                          type="button"
                          onClick={() => handleNudge('left')}
                          className="p-1.5 bg-white border border-gray-200 rounded-lg text-chocolate hover:bg-rose-deep hover:text-white hover:border-rose-deep transition-all flex items-center justify-center"
                          title="Nudge Left"
                        >
                          <ArrowLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={handleResetCrop}
                          className="p-1.5 bg-gray-100 border border-gray-200 rounded-lg text-chocolate hover:bg-chocolate hover:text-white transition-all flex items-center justify-center text-[10px] font-bold"
                          title="Reset"
                        >
                          R
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNudge('right')}
                          className="p-1.5 bg-white border border-gray-200 rounded-lg text-chocolate hover:bg-rose-deep hover:text-white hover:border-rose-deep transition-all flex items-center justify-center"
                          title="Nudge Right"
                        >
                          <ArrowRight size={16} />
                        </button>
                        <div />
                        <button
                          type="button"
                          onClick={() => handleNudge('down')}
                          className="p-1.5 bg-white border border-gray-200 rounded-lg text-chocolate hover:bg-rose-deep hover:text-white hover:border-rose-deep transition-all flex items-center justify-center"
                          title="Nudge Down"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <div />
                      </div>
                      <p className="text-[11px] text-gray-400 italic font-medium leading-relaxed max-w-xs pl-2">
                        You can drag and scroll to position, or use the nudge controls for fine alignment adjustments.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Live Premium Preview & Adjustments Sliders (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col space-y-6">

                  {/* Adjustment sliders */}
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-chocolate uppercase tracking-wider block">Cropper Adjustments</span>

                    {/* Zoom Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-gray-600">
                        <span>Image Zoom Scale ({zoom.toFixed(2)}x)</span>
                        <button
                          type="button"
                          onClick={() => setZoom(1)}
                          className="text-rose-deep font-bold hover:underline"
                        >
                          Reset
                        </button>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full accent-rose-deep h-1.5 bg-gray-100 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Rotation Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-gray-600">
                        <span>Rotate Image ({rotation}°)</span>
                        <button
                          type="button"
                          onClick={() => setRotation(0)}
                          className="text-rose-deep font-bold hover:underline"
                        >
                          Reset
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          step="1"
                          value={rotation}
                          onChange={(e) => setRotation(parseInt(e.target.value))}
                          className="flex-1 w-full accent-rose-deep h-1.5 bg-gray-100 rounded-lg cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={() => setRotation(prev => (prev + 90) % 360)}
                          className="p-1 text-rose-deep hover:bg-rose/10 rounded"
                          title="Rotate 90 degrees"
                        >
                          <RotateCw size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Crop Preview (Exactly fits aspect ratios, blends with page background) */}
                  <div className="flex-1 flex flex-col space-y-3">
                    <span className="text-xs font-bold text-chocolate uppercase tracking-wider block">Live Storefront Preview</span>

                    <div className="flex-1 bg-cream rounded-2xl p-4 border border-rose/10 flex items-center justify-center relative shadow-sm min-h-[220px]">
                      {previewUrl ? (
                        <div className="w-[160px] h-[200px] relative rounded-xl overflow-hidden shadow-lg border border-white flex flex-col items-stretch">
                          <img
                            src={previewUrl}
                            alt="Live cropped preview"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-chocolate/80 text-[8px] text-white rounded font-mono uppercase tracking-wider backdrop-blur-sm z-10">
                            Fits 4:5 Cover
                          </span>
                        </div>
                      ) : (
                        <div className="text-center p-4 space-y-2 text-gray-400">
                          <Loader2 className="animate-spin text-rose-deep mx-auto" size={24} />
                          <p className="text-[11px] font-semibold">Generating Live Preview...</p>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed text-center">
                      The live preview is perfectly aligned to the luxury 4:5 aspect ratio and uses standard storefront &ldquo;cover&rdquo; rendering rules.
                    </p>
                  </div>
                </div>

              </div>

              {/* Modal Footer Controls */}
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setCropModalOpen(false)}
                  className="flex-1 py-3 bg-white border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-100 transition-all uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCrop}
                  className="flex-1 py-3 bg-rose-deep text-white font-bold text-xs rounded-xl hover:bg-brown transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Scissors size={14} />
                  <span>Apply Crop & Save</span>
                </button>
              </div>
      </AdminConfirmationModal>
    </div>
  );
};

export default OurStoryAdmin;
