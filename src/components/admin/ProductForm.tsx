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
import { X, Upload, Loader2, Plus, Image as ImageIcon, Link as LinkIcon, AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductFormProps {
  product?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductForm = ({ product, onClose, onSuccess }: ProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(product?.images || (product?.img ? [product?.img] : []));
  const [categories, setCategories] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    discountPrice: product?.discountPrice || '',
    oldPrice: product?.oldPrice || '',
    category: product?.category || '',
    flavor: product?.flavor || '',
    tags: product?.tags || product?.tag || '',
    inStock: product?.inStock ?? true,
    rating: product?.rating || 5,
    reviews: product?.reviews || 0,
    imageUrls: product?.images || (product?.img ? [product?.img] : []),
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const q = query(collection(db, 'categories'), orderBy('name'));
      const snapshot = await getDocs(q);
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
      setUploadError(null);
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);

    // If it was a newly added file
    const totalExistingUrls = formData.imageUrls.length;
    if (index >= totalExistingUrls) {
      const newFiles = [...imageFiles];
      newFiles.splice(index - totalExistingUrls, 1);
      setImageFiles(newFiles);
    } else {
      // It was an existing URL
      const newUrls = [...formData.imageUrls];
      newUrls.splice(index, 1);
      setFormData(prev => ({ ...prev, imageUrls: newUrls }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrls = [...formData.imageUrls];

      // Upload new files
      if (imageFiles.length > 0) {
        try {
          setUploadError(null);
          const uploadPromises = imageFiles.map(async (file) => {
            const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
            const uploadResult = await uploadBytes(storageRef, file);
            return await getDownloadURL(uploadResult.ref);
          });
          const uploadedUrls = await Promise.all(uploadPromises);
          finalImageUrls = [...finalImageUrls, ...uploadedUrls];
        } catch (storageError: any) {
          console.error("Storage upload failed:", storageError);
          const errorMsg = "Image upload failed. Some images might not have been saved.";
          setUploadError(errorMsg);
          showToast(errorMsg, "error");
          setLoading(false);
          return;
        }
      }

      if (finalImageUrls.length === 0) {
        showToast("Please upload at least one image.", "error");
        setLoading(false);
        return;
      }

      const productData = {
        ...formData,
        price: Number(formData.price),
        oldPrice: Number(formData.oldPrice),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        img: finalImageUrls[0], // Main image
        images: finalImageUrls, // All images
        updatedAt: new Date().toISOString(),
        createdAt: product?.createdAt || new Date().toISOString()
      };

      if (product?.id) {
        await updateDoc(doc(db, 'products', product.id), productData);
      } else {
        await addDoc(collection(db, 'products'), productData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      showToast("Failed to save product. Check console for details.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

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
                <label className="block text-sm font-bold text-chocolate uppercase tracking-wider">Product Images</label>
                <div className="flex items-center gap-1 text-[10px] font-bold text-rose-deep bg-rose/5 px-2 py-0.5 rounded uppercase">
                  <AlertCircle size={10} />
                  <span>Bulk Upload Supported</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-2xl border border-gray-100 overflow-hidden group">
                    <Image
                      src={preview}
                      alt={`Preview ${index}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center hover:border-rose-deep/50 hover:bg-rose/5 transition-all"
                >
                  <Plus className="text-gray-300" size={32} />
                  <span className="text-[10px] font-bold text-gray-400 uppercase mt-2">Add Image</span>
                </button>
              </div>

              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {uploadError && (
                <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100 animate-shake">
                  <AlertCircle size={14} />
                  <span>{uploadError}</span>
                </div>
              )}
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

              <div className="grid grid-cols-3 gap-4">
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
                  <label className="block text-xs font-bold text-chocolate/60 uppercase tracking-widest">Disc. Price</label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="399"
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-chocolate/60 uppercase tracking-widest">Old Price</label>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-chocolate/60 uppercase tracking-widest">Tags (Comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g. Bestseller, New, Trending"
                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-chocolate/60 uppercase tracking-widest">Availability</label>
              <div className="flex items-center h-12">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  <span className="ml-3 text-sm font-medium text-gray-500">{formData.inStock ? 'In Stock' : 'Out of Stock'}</span>
                </label>
              </div>
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
