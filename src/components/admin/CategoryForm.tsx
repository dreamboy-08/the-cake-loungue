"use client";

import React, { useState } from 'react';
import { db, storage } from '@/utils/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { X, Loader2, Upload, Trash2, AlertCircle } from 'lucide-react';
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
    active: category?.active !== undefined ? category?.active : true,
    slug: category?.slug || '',
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
      let finalImageUrl = category?.image || '';

      if (imageFile) {
        const storageRef = ref(storage, `categories/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(uploadResult.ref);
      }

      const categoryData = {
        ...formData,
        image: finalImageUrl,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        updatedAt: new Date().toISOString(),
      };

      if (category?.id) {
        await updateDoc(doc(db, 'categories', category.id), categoryData);
      } else {
        await addDoc(collection(db, 'categories'), {
          ...categoryData,
          createdAt: new Date().toISOString(),
          productCount: 0
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-chocolate/60 ">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-fade-up">
        <div className="p-8 border-b flex items-center justify-between bg-chocolate text-white">
          <div>
            <h2 className="text-2xl font-bold font-playfair">{category ? 'Edit Category' : 'New Category'}</h2>
            <p className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Manage shop collections</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-rose rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
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
};

export default CategoryForm;
