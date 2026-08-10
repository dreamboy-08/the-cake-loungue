"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Upload } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { CMSGalleryItem } from '@/types/cms';
import { uploadToCloudinary } from '@/utils/cloudinary';
import Image from 'next/image';

interface GalleryItemFormProps {
  item?: CMSGalleryItem | null;
  allGalleryItems: CMSGalleryItem[];
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const GalleryItemForm = ({ item, allGalleryItems, onClose, onSuccess }: GalleryItemFormProps) => {
  const { updateGalleryItems } = useCMS();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(item?.src || '/images/products/Royal Raspberry Birthday Cake.jpg');

  const [formData, setFormData] = useState({
    src: item?.src || '/images/products/Royal Raspberry Birthday Cake.jpg',
    label: item?.label || '',
    link: item?.link || '',
    enabled: item?.enabled !== undefined ? item?.enabled : true,
    displayOrder: item !== undefined && item !== null ? item.displayOrder + 1 : (allGalleryItems.length + 1),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, src: URL.createObjectURL(file) }));
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, src: url }));
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.src) return;
    setLoading(true);

    try {
      const isEdit = !!item;
      let finalImageUrl = formData.src;

      if (imageFile) {
        try {
          finalImageUrl = await uploadToCloudinary(imageFile);
        } catch (err) {
          console.warn("Cloudinary upload failed, using local/preview fallback image:", err);
          finalImageUrl = imagePreview || '/images/products/placeholder.jpg';
        }
      }

      let updatedList = [...allGalleryItems];

      if (isEdit) {
        updatedList = updatedList.filter(g => g.id !== item?.id);
      }

      const currentItem: CMSGalleryItem = {
        id: item?.id || 'gal_' + Date.now(),
        src: finalImageUrl,
        label: formData.label,
        link: formData.link || undefined,
        enabled: formData.enabled,
        displayOrder: 0, // Assigned sequentially below
      };

      const targetIdx = Math.max(0, Math.min(formData.displayOrder - 1, updatedList.length));
      updatedList.splice(targetIdx, 0, currentItem);

      // Re-assign displayOrder sequentially 0-indexed for consistency
      const reorderedList = updatedList.map((g, idx) => ({
        ...g,
        displayOrder: idx,
      }));

      await updateGalleryItems(reorderedList);

      onSuccess(isEdit ? 'Gallery item updated successfully' : 'Gallery item created successfully');
      onClose();
    } catch (error) {
      console.error("Error saving gallery item:", error);
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-chocolate/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 border-b flex items-center justify-between bg-chocolate text-white shrink-0">
          <div>
            <h2 className="text-2xl font-bold font-playfair">{item ? 'Edit Gallery Item' : 'New Gallery Item'}</h2>
            <p className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Manage storefront portfolio</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-rose rounded-full transition-colors focus:outline-none">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6 overflow-y-auto">
          <div className="flex flex-col items-center gap-4">
            <div
              className="relative w-32 h-40 rounded-[24px] border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden group cursor-pointer animate-fade-in"
              onClick={() => document.getElementById('gallery-image-upload')?.click()}
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
              id="gallery-image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Image Source / URL</label>
              <input
                type="text"
                required
                placeholder="e.g. /images/products/Royal Raspberry Birthday Cake.jpg"
                value={formData.src}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-xs font-mono font-semibold text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Image Alt Text / Label</label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Raspberry Birthday Cake"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Optional Destination Link</label>
              <input
                type="text"
                placeholder="e.g. /shop/1 or /menu?category=birthday-cakes"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Display Order</label>
              <input
                type="number"
                min="1"
                required
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
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
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Visible in storefront gallery section</span>
              </div>
            </label>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all focus:outline-none"
            >
              Cancel
            </button>
            <button
              disabled={loading || !formData.src}
              type="submit"
              className="flex-[2] py-4 bg-rose-deep text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-deep/20 hover:bg-brown transition-all flex items-center justify-center gap-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[600]" onClick={onClose}>
      {formContent}
    </div>,
    document.body
  );
};

export default GalleryItemForm;
