"use client";

import React, { useState, useEffect } from 'react';
import { db, storage } from '@/utils/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { X, Upload, Loader2, Plus, Image as ImageIcon, Link as LinkIcon, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface ProductFormProps {
  product?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductForm = ({ product, onClose, onSuccess }: ProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.img || '');
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    oldPrice: product?.oldPrice || '',
    category: product?.category || '',
    flavor: product?.flavor || '',
    tag: product?.tag || '',
    rating: product?.rating || 5,
    reviews: product?.reviews || 0,
    imageUrl: product?.img || '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const q = query(collection(db, 'categories'), orderBy('name'));
      const snapshot = await getDocs(q);
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.imageUrl || product?.img || '';

      if (imageFile) {
        try {
          const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
          const uploadResult = await uploadBytes(storageRef, imageFile);
          finalImageUrl = await getDownloadURL(uploadResult.ref);
        } catch (storageError: any) {
          console.error("Storage upload failed:", storageError);
          if (storageError.code === 'storage/unauthorized' || storageError.code === 'storage/retry-limit-exceeded') {
            alert("Firebase Storage is unavailable or restricted. Please provide a direct Image URL instead.");
            setLoading(false);
            return;
          }
          throw storageError;
        }
      }

      if (!finalImageUrl) {
        alert("Please upload an image or provide an image URL.");
        setLoading(false);
        return;
      }

      const { imageUrl, ...restData } = formData;
      const productData = {
        ...restData,
        price: Number(formData.price),
        oldPrice: Number(formData.oldPrice),
        img: finalImageUrl,
        updatedAt: new Date().toISOString(),
      };

      if (product?.id) {
        await updateDoc(doc(db, 'products', product.id), productData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date().toISOString(),
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-up">
        <div className="p-6 border-b flex items-center justify-between bg-chocolate text-white">
          <h2 className="text-xl font-bold font-playfair">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-chocolate uppercase tracking-wider">Product Image</label>
                <div className="flex items-center gap-1 text-[10px] font-bold text-rose-deep bg-rose/5 px-2 py-0.5 rounded uppercase">
                  <AlertCircle size={10} />
                  <span>Storage Fallback Active</span>
                </div>
              </div>

              <div
                className="relative aspect-square rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-rose-deep/50 group cursor-pointer"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                {(imagePreview || formData.imageUrl) ? (
                  <>
                    <Image
                      src={imagePreview || formData.imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="text-white" size={32} />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-sm text-gray-500 font-medium">Click to upload image</p>
                    <p className="text-xs text-gray-400 mt-1">or provide URL below</p>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest">
                  <LinkIcon size={12} />
                  <span>Image URL (Fallback)</span>
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value });
                    setImagePreview('');
                    setImageFile(null);
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-100 focus:border-rose-deep focus:ring-2 focus:ring-rose/20 outline-none transition-all text-xs"
                />
                <p className="text-[10px] text-gray-400 italic">Use this if image upload fails or is unavailable.</p>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-chocolate/60 uppercase tracking-widest">Product Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal Raspberry Birthday Cake"
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-chocolate/60 uppercase tracking-widest">Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="499"
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-chocolate/60 uppercase tracking-widest">Old Price (₹)</label>
                  <input
                    type="number"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    placeholder="619"
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-chocolate/60 uppercase tracking-widest">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm appearance-none bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                  <option value="Birthday Cakes">Birthday Cakes</option>
                  <option value="Wedding Cakes">Wedding Cakes</option>
                  <option value="Anniversary Cakes">Anniversary Cakes</option>
                  <option value="Chocolate Cakes">Chocolate Cakes</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-chocolate/60 uppercase tracking-widest">Flavor</label>
                <input
                  type="text"
                  value={formData.flavor}
                  onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                  placeholder="e.g. Mixed Berry Ganache"
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-chocolate/60 uppercase tracking-widest">Tag</label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="e.g. Bestseller, New, Trending"
                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-chocolate/60 uppercase tracking-widest">Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed product description..."
                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="px-8 py-3 bg-rose-deep text-white rounded-xl font-bold shadow-lg shadow-rose-deep/30 hover:bg-brown hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {product ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
