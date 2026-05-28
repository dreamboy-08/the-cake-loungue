"use client";

import React, { useState } from 'react';
import { db } from '@/utils/firebase';
import { collection, setDoc, updateDoc, doc } from 'firebase/firestore';
import { X, Loader2 } from 'lucide-react';

interface CategoryFormProps {
  category?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const CategoryForm = ({ category, onClose, onSuccess }: CategoryFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    slug: category?.slug || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        updatedAt: new Date().toISOString(),
      };

      if (category?.id) {
        await updateDoc(doc(db, 'categories', category.id), categoryData);
      } else {
        const newDocRef = doc(collection(db, 'categories'));
        await setDoc(newDocRef, {
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

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
