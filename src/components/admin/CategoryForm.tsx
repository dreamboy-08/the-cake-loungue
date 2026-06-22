"use client";

import React, { useState } from 'react';
import { db, storage } from '@/utils/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { X, Loader2, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface CategoryFormProps {
  category?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const CategoryForm = ({ category, onClose, onSuccess }: CategoryFormProps) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(category?.image || '');
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    slug: category?.slug || '',
    isVisible: category?.isVisible ?? true,
    image: category?.image || '',
  });

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
      let imageUrl = formData.image;

      if (imageFile) {
        const storageRef = ref(storage, `categories/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      const categoryData = {
        ...formData,
        image: imageUrl,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        updatedAt: new Date().toISOString(),
      };

      if (category?.id) {
        await updateDoc(doc(db, 'categories', category.id), categoryData);
      } else {
        await addDoc(collection(db, 'categories'), {
          ...categoryData,
          createdAt: new Date().toISOString(),
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-fade-up">
        <div className="p-6 border-b flex items-center justify-between bg-chocolate text-white">
          <h2 className="text-xl font-bold font-playfair">{category ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-chocolate/60 uppercase tracking-widest">Category Image</label>
            <div
              className="relative aspect-video rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-rose-deep/50 transition-all group"
              onClick={() => document.getElementById('category-image')?.click()}
            >
              {imagePreview ? (
                <>
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="text-white" size={24} />
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto text-gray-300 mb-2" size={32} />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Upload Image</span>
                </div>
              )}
              <input
                id="category-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-chocolate/60 uppercase tracking-widest">Category Name</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Birthday Cakes"
              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-chocolate/60 uppercase tracking-widest">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the category..."
              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-chocolate/60 uppercase tracking-widest">Visibility</label>
            <div className="flex items-center h-10">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                <span className="ml-3 text-sm font-medium text-gray-500">{formData.isVisible ? 'Visible on Website' : 'Hidden'}</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-1 py-3 bg-rose-deep text-white rounded-xl font-bold shadow-lg shadow-rose-deep/30 hover:bg-brown hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {category ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
