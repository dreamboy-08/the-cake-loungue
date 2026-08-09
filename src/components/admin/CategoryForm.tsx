"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { db } from '@/utils/firebase';
import { uploadToCloudinary } from '@/utils/cloudinary';
import { getReorderBatch } from '@/utils/categoryOrdering';
import { X, Loader2, Upload, Trash2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useCMS } from '@/context/CMSContext';

interface CategoryFormProps {
  category?: any;
  allCategories: any[];
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const CategoryForm = ({ category, allCategories, onClose, onSuccess }: CategoryFormProps) => {
  const { updateCategories } = useCMS();
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
  const [imagePreview, setImagePreview] = useState<string>(category?.image || '');

  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    active: category?.active !== undefined ? category?.active : true,
    slug: category?.slug || '',
    displayOrder: category?.displayOrder || (allCategories.length + 1),
    link: category?.link || '',
    tag: category?.tag || '',
    designs: category?.designs || '',
  });

  const isFirebaseConfigured =
    typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your_api_key";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = category?.image || '';

      if (imageFile) {
        try {
          finalImageUrl = await uploadToCloudinary(imageFile);
        } catch (err) {
          console.warn("Cloudinary upload failed, using local/preview fallback image:", err);
          finalImageUrl = imagePreview || '/images/categories/placeholder.jpg';
        }
      }

      const categoryData: any = {
        name: formData.name,
        description: formData.description,
        active: formData.active,
        image: finalImageUrl,
        slug: formData.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        displayOrder: formData.displayOrder,
        link: formData.link || `/menu?category=${formData.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
        tag: formData.tag || null,
        designs: formData.designs || null,
      };

      if (!isFirebaseConfigured) {
        let updatedList = [...allCategories];
        const recordId = category?.id || `cat_${Date.now()}`;
        categoryData.id = recordId;

        if (category?.id) {
          // Update case
          const oldOrder = category.displayOrder;
          const occupantIdx = updatedList.findIndex(c => c.displayOrder === formData.displayOrder && c.id !== category.id);
          if (occupantIdx > -1 && formData.displayOrder !== oldOrder) {
            updatedList[occupantIdx] = {
              ...updatedList[occupantIdx],
              displayOrder: oldOrder || updatedList.length
            };
          }
          const targetIdx = updatedList.findIndex(c => c.id === category.id);
          if (targetIdx > -1) {
            updatedList[targetIdx] = {
              ...updatedList[targetIdx],
              ...categoryData
            };
          }
        } else {
          // Create case
          const occupantIdx = updatedList.findIndex(c => c.displayOrder === formData.displayOrder);
          if (occupantIdx > -1) {
            updatedList[occupantIdx] = {
              ...updatedList[occupantIdx],
              displayOrder: updatedList.length + 1
            };
          }
          updatedList.push(categoryData);
        }

        await updateCategories(updatedList);
        onSuccess(category ? 'Category updated successfully' : 'Category created successfully');
        onClose();
        return;
      }

      // Online Firestore flow
      const batch = getReorderBatch(
        db,
        allCategories,
        category?.id || null,
        formData.displayOrder,
        categoryData
      );

      await batch.commit();

      onSuccess(category ? 'Category updated successfully' : 'Category created successfully');
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
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
            <h2 className="text-2xl font-bold font-playfair">{category ? 'Edit Category' : 'New Category'}</h2>
            <p className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Manage shop collections</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-rose rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto">
          <div className="flex flex-col items-center gap-4">
             <div
               className="relative w-32 h-32 rounded-[32px] border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden group cursor-pointer"
               onClick={() => document.getElementById('cat-image')?.click()}
             >
                {imagePreview ? (
                  <>
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-chocolate/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Upload size={24} className="text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Upload size={24} />
                    <span className="text-[10px] font-black uppercase mt-1">Upload</span>
                  </div>
                )}
             </div>
             <input id="cat-image" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Category Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Display Order</label>
              <input
                type="number"
                min="1"
                max={allCategories.length + (category ? 0 : 1)}
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                placeholder="e.g. 1, 2, 3..."
              />
              <p className="text-[9px] text-gray-400 font-medium">Enter a position from 1 to {allCategories.length + (category ? 0 : 1)}. The category currently at that position will swap with this one.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Link / Destination</label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                placeholder="e.g. /menu?category=birthday-cakes"
              />
              <p className="text-[9px] text-gray-400 font-medium">Specify a custom internal route or URL, or leave blank to auto-generate based on category name.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Category Tag (Badge)</label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                placeholder="e.g. Popular, Bestseller (Optional)"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Designs / Subtitle</label>
              <input
                type="text"
                value={formData.designs}
                onChange={(e) => setFormData({ ...formData, designs: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                placeholder="e.g. 80+, Design Your Own"
              />
            </div>

            <label className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-rose-deep focus:ring-rose-deep"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-chocolate">Active Status</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">Visible in shop menu</span>
                </div>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-[2] py-4 bg-rose-deep text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-deep/20 hover:bg-brown transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {category ? 'Update Category' : 'Create Category'}
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

export default CategoryForm;
