"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useCMS } from '@/context/CMSContext';
import { AboutSectionSettings, AboutFeatureCard } from '@/types/cms';
import { uploadToCloudinary } from '@/utils/cloudinary';
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
  HelpCircle,
  Undo
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

const OurStoryAdmin = () => {
  const { aboutSettings, updateAboutSettings, loading } = useCMS();
  const [localSettings, setLocalSettings] = useState<AboutSectionSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Crop Tool Modal States
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [cropScale, setCropScale] = useState<number>(1);
  const [cropX, setCropX] = useState<number>(0);
  const [cropY, setCropY] = useState<number>(0);
  const [cropRotation, setCropRotation] = useState<number>(0);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  // Image Upload handler (supports instant base64 or Cloudinary upload)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImageSrc(reader.result as string);
      // Reset cropping variables
      setCropScale(1);
      setCropX(0);
      setCropY(0);
      setCropRotation(0);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    // Clear input
    e.target.value = '';
  };

  // Canvas-based image cropping logic
  const handleApplyCrop = async () => {
    if (!originalImageSrc || !canvasRef.current || !imageRef.current || !localSettings) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!ctx) return;

    // Set canvas dimensions to crop resolution (e.g., 800 x 1000 for 4:5 ratio)
    const targetWidth = 800;
    const targetHeight = 1000;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.save();

    // Center canvas context for scale/rotation/translation
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((cropRotation * Math.PI) / 180);
    ctx.scale(cropScale, cropScale);
    ctx.translate(cropX, cropY);

    // Draw image centered in the cropped target dimensions
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const imgRatio = imgWidth / imgHeight;
    const targetRatio = targetWidth / targetHeight;

    let drawWidth = targetWidth;
    let drawHeight = targetHeight;

    if (imgRatio > targetRatio) {
      drawHeight = targetWidth / imgRatio;
    } else {
      drawWidth = targetHeight * imgRatio;
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    // Export cropped image as base64
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.95);

    setCropModalOpen(false);

    // Save/Upload
    setSaving(true);
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || cloudName === "your_cloud_name" || !uploadPreset) {
        // Fallback offline state: save directly as local data URL
        handleFieldChange('leftImageUrl', croppedDataUrl);
        showToast("Cropped image updated locally!");
      } else {
        // Standard high-resolution Cloudinary Upload
        // Convert base64 to File object
        const res = await fetch(croppedDataUrl);
        const blob = await res.blob();
        const file = new File([blob], "our-story-cropped.jpg", { type: "image/jpeg" });
        const uploadedUrl = await uploadToCloudinary(file);
        handleFieldChange('leftImageUrl', uploadedUrl);
        showToast("Cropped image uploaded successfully!");
      }
    } catch (err) {
      console.error("Failed image upload:", err);
      // fallback
      handleFieldChange('leftImageUrl', croppedDataUrl);
      showToast("Uploaded as offline local fallback.", "success");
    } finally {
      setSaving(false);
    }
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

            {/* Thumbnail Preview with responsive actions */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-gray-100 group">
              <img
                src={localSettings.leftImageUrl}
                alt="Story Illustration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-chocolate/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <label className="p-2 bg-white rounded-full text-chocolate hover:bg-rose hover:text-white transition-all cursor-pointer shadow-md">
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
                  onClick={handleDeleteImage}
                  className="p-2 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md"
                  title="Reset Image"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-chocolate px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer">
                <Upload size={14} />
                <span>Upload & Crop...</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
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

      {/* CANVAS IMAGE CROP MODAL */}
      <AnimatePresence>
        {cropModalOpen && originalImageSrc && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-chocolate/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-5 bg-chocolate text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold font-playfair">Crop Illustration Image</h3>
                  <span className="text-[9px] uppercase tracking-wider text-white/60">Target: 4:5 Portrait Ratio</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCropModalOpen(false)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6 flex flex-col items-center">

                {/* Visual Cropper Display Viewport */}
                <div className="relative w-64 h-80 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-dashed border-rose-deep/50 pointer-events-none z-10 m-2 rounded-lg" />

                  {/* The Image inside crop viewport */}
                  <div
                    className="relative transition-transform duration-75 select-none pointer-events-none"
                    style={{
                      transform: `translate(${cropX}px, ${cropY}px) scale(${cropScale}) rotate(${cropRotation}deg)`
                    }}
                  >
                    <img
                      ref={imageRef}
                      src={originalImageSrc}
                      alt="Crop Source"
                      className="max-w-none w-48 h-auto"
                      onLoad={() => {
                        // Init
                        setCropScale(1.2);
                      }}
                    />
                  </div>
                </div>

                {/* Adjustments Controls */}
                <div className="w-full space-y-4 text-xs font-semibold text-gray-600">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span>Image Zoom Scale ({cropScale.toFixed(2)}x)</span>
                      <button
                        type="button"
                        onClick={() => setCropScale(1)}
                        className="text-rose-deep font-bold hover:underline"
                      >
                        Reset
                      </button>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.05"
                      value={cropScale}
                      onChange={(e) => setCropScale(parseFloat(e.target.value))}
                      className="w-full accent-rose-deep h-1.5 bg-gray-100 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span>Rotate Image ({cropRotation}°)</span>
                      <button
                        type="button"
                        onClick={() => setCropRotation(0)}
                        className="text-rose-deep font-bold hover:underline"
                      >
                        Reset
                      </button>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="1"
                      value={cropRotation}
                      onChange={(e) => setCropRotation(parseInt(e.target.value))}
                      className="w-full accent-rose-deep h-1.5 bg-gray-100 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px]">Horizontal Shift (X: {cropX}px)</span>
                      <input
                        type="range"
                        min="-150"
                        max="150"
                        value={cropX}
                        onChange={(e) => setCropX(parseInt(e.target.value))}
                        className="w-full accent-rose-deep h-1.5 bg-gray-100 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px]">Vertical Shift (Y: {cropY}px)</span>
                      <input
                        type="range"
                        min="-150"
                        max="150"
                        value={cropY}
                        onChange={(e) => setCropY(parseInt(e.target.value))}
                        className="w-full accent-rose-deep h-1.5 bg-gray-100 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Hidden canvas to draw the cropped image */}
                <canvas ref={canvasRef} className="hidden" />

              </div>

              <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCropModalOpen(false)}
                  className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-400 font-bold text-xs rounded-xl hover:bg-gray-100 transition-all uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCrop}
                  className="flex-1 py-2.5 bg-rose-deep text-white font-bold text-xs rounded-xl hover:bg-brown transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Scissors size={14} />
                  <span>Apply Crop</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OurStoryAdmin;
