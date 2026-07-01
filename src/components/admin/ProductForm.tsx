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
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import {
  X,
  Upload,
  Loader2,
  Plus,
  Image as ImageIcon,
  Link as LinkIcon,
  AlertCircle,
  Trash2,
  CheckCircle2,
  Star,
  Zap,
  Clock,
  Package
} from 'lucide-react';
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
  const [imagePreviews, setImagePreviews] = useState<string[]>(product?.images || product?.img ? [product?.img, ...(product?.images || [])].filter(Boolean) : []);
  const [categories, setCategories] = useState<any[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    oldPrice: product?.oldPrice || '',
    weights: product?.weights || [{ label: '0.5 Kg', price: product?.price || '' }],
    category: product?.category || '',
    flavor: product?.flavor || '',
    tag: product?.tag || '',
    isFeatured: product?.isFeatured || false,
    isBestSeller: product?.isBestSeller || false,
    isNewArrival: product?.isNewArrival || false,
    inStock: product?.inStock !== undefined ? product?.inStock : true,
    active: product?.active !== undefined ? product?.active : true,
    imageUrl: product?.img || '',
  });

  const supportedWeights = ['0.5 Kg', '1 Kg', '1.5 Kg', '2 Kg', '3 Kg', '4 Kg', '5 Kg'];

  const handleAddWeight = () => {
    setFormData(prev => ({
      ...prev,
      weights: [...prev.weights, { label: '1 Kg', price: '' }]
    }));
  };

  const handleRemoveWeight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      weights: prev.weights.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleWeightChange = (index: number, field: string, value: string | number) => {
    const newWeights = [...formData.weights];
    newWeights[index] = { ...newWeights[index], [field]: value };

    if (index === 0 && field === 'price') {
      setFormData(prev => ({ ...prev, price: value, weights: newWeights }));
    } else {
      setFormData(prev => ({ ...prev, weights: newWeights }));
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setCatLoading(true);
    console.log("Firestore Path: categories");
    const q = query(collection(db, 'categories'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty && !catLoading) {
        console.log("Categories collection empty, triggering auto-seed from ProductForm...");
        const { seedCategories } = await import('@/utils/seedCategories');
        await seedCategories();
        return;
      }
      console.log(`Categories returned: ${snapshot.docs.length}`);
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setCatLoading(false);
    }, (error) => {
      console.error("Error listening to categories:", error);
      setCatLoading(false);
    });
    return () => unsubscribe();
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

  const removePreview = (index: number) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);

    // Also remove from imageFiles if it's a new upload
    // This is a bit simplified, ideally we track which preview belongs to which file/existing URL
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Product name is required.";
    if (!formData.category) return "Please select a category.";
    if (!formData.price || Number(formData.price) <= 0) return "Base price must be greater than zero.";
    if (imagePreviews.length === 0 && !formData.imageUrl) return "At least one product image is required.";
    if (formData.weights.length === 0) return "At least one weight variant is required.";
    if (formData.weights.some((w: any) => !w.price || Number(w.price) <= 0)) return "All variants must have a valid price.";
    if (!formData.description.trim()) return "Product description is required.";
    if (!formData.flavor.trim()) return "Flavor information is required.";
    // inStock and active are booleans, usually have defaults
    // Promotional badges (isFeatured, etc.) are optional by nature, but we check if at least one variant is present
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      showToast(validationError, "error");
      return;
    }

    setLoading(true);

    try {
      let finalImages = [...imagePreviews.filter(p => p.startsWith('http'))];

      // Upload new files
      for (const file of imageFiles) {
        try {
          const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
          const uploadResult = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(uploadResult.ref);
          finalImages.push(url);
        } catch (storageError) {
          console.error("Storage upload failed:", storageError);
        }
      }

      if (finalImages.length === 0 && formData.imageUrl) {
        finalImages.push(formData.imageUrl);
      }

      if (finalImages.length === 0) {
        showToast("Please upload at least one image.", "error");
        setLoading(false);
        return;
      }

      const { imageUrl, ...restData } = formData;
      const productData = {
        ...restData,
        price: Number(formData.price),
        oldPrice: Number(formData.oldPrice),
        weights: formData.weights.map((w: any) => ({
          label: w.label,
          price: Number(w.price)
        })),
        img: finalImages[0],
        images: finalImages.slice(1),
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
      showToast("Failed to save product.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-chocolate/60 ">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[500] px-6 py-3 rounded-[22px] shadow-2xl flex items-center gap-3 font-bold text-sm ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-up">
        <div className="p-6 border-b flex items-center justify-between bg-chocolate text-white">
          <h2 className="text-xl font-bold font-playfair">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-rose rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image Gallery Section */}
            <div className="space-y-6">
              <label className="block text-sm font-black text-chocolate uppercase tracking-widest">Product Gallery</label>

              <div className="grid grid-cols-3 gap-4">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removePreview(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-0 inset-x-0 bg-rose-deep/80 text-white text-[8px] font-bold text-center py-1 uppercase tracking-widest">
                        Main Image
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => document.getElementById('multi-image-upload')?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:border-rose-deep/50 hover:bg-rose/5 transition-all"
                >
                  <Plus size={24} />
                  <span className="text-[10px] font-bold mt-1 uppercase">Add Image</span>
                </button>
              </div>
              <input
                id="multi-image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="p-5 rounded-3xl bg-gray-50 border border-gray-100 space-y-4">
                <h3 className="text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Visibility & Status</h3>
                <div className="grid grid-cols-2 gap-4">
                   <label className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 cursor-pointer hover:border-rose-deep/30 transition-all">
                      <input
                        type="checkbox"
                        checked={formData.inStock}
                        onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                        className="w-4 h-4 rounded border-gray-300 text-rose-deep focus:ring-rose-deep"
                      />
                      <span className="text-sm font-bold text-chocolate flex items-center gap-2">
                        <Package size={14} className="text-blue-500" />
                        In Stock
                      </span>
                   </label>
                   <label className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 cursor-pointer hover:border-rose-deep/30 transition-all">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({...formData, active: e.target.checked})}
                        className="w-4 h-4 rounded border-gray-300 text-rose-deep focus:ring-rose-deep"
                      />
                      <span className="text-sm font-bold text-chocolate flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-500" />
                        Active
                      </span>
                   </label>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-rose/5 border border-rose/10 space-y-4">
                <h3 className="text-[10px] font-black text-rose-deep/60 uppercase tracking-widest">Promotion Badges</h3>
                <div className="grid grid-cols-3 gap-3">
                   <label className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${formData.isFeatured ? 'bg-rose-deep text-white border-rose-deep shadow-lg' : 'bg-white text-chocolate border-gray-100'}`}>
                      <input type="checkbox" className="hidden" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} />
                      <Star size={18} />
                      <span className="text-[10px] font-black uppercase">Featured</span>
                   </label>
                   <label className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${formData.isBestSeller ? 'bg-orange-500 text-white border-orange-500 shadow-lg' : 'bg-white text-chocolate border-gray-100'}`}>
                      <input type="checkbox" className="hidden" checked={formData.isBestSeller} onChange={(e) => setFormData({...formData, isBestSeller: e.target.checked})} />
                      <Zap size={18} />
                      <span className="text-[10px] font-black uppercase">Bestseller</span>
                   </label>
                   <label className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${formData.isNewArrival ? 'bg-blue-500 text-white border-blue-500 shadow-lg' : 'bg-white text-chocolate border-gray-100'}`}>
                      <input type="checkbox" className="hidden" checked={formData.isNewArrival} onChange={(e) => setFormData({...formData, isNewArrival: e.target.checked})} />
                      <Clock size={18} />
                      <span className="text-[10px] font-black uppercase">New</span>
                   </label>
                </div>
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Product Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Category</label>
                  <select
                    required
                    value={categories.find(cat => cat.name === formData.category)?.id || ''}
                    onChange={(e) => {
                      const selectedCat = categories.find(cat => cat.id === e.target.value);
                      setFormData({ ...formData, category: selectedCat ? selectedCat.name : '' });
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold bg-white"
                  >
                    {catLoading ? (
                      <option value="" disabled>Loading categories...</option>
                    ) : categories.length === 0 ? (
                      <option value="" disabled>No categories found (Please create one first)</option>
                    ) : (
                      <>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Base Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Weights & Variants</label>
                  <button type="button" onClick={handleAddWeight} className="text-[10px] font-black text-rose-deep uppercase flex items-center gap-1">
                    <Plus size={12} /> Add Variant
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.weights.map((w: any, idx: number) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <select
                        value={w.label}
                        onChange={(e) => handleWeightChange(idx, 'label', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-100 text-xs font-bold bg-white"
                      >
                        {supportedWeights.map(sw => <option key={sw} value={sw}>{sw}</option>)}
                      </select>
                      <input
                        type="number"
                        value={w.price}
                        onChange={(e) => handleWeightChange(idx, 'price', e.target.value)}
                        placeholder="Price"
                        className="w-24 px-3 py-2 rounded-xl border border-gray-100 text-xs font-bold"
                      />
                      <button type="button" onClick={() => handleRemoveWeight(idx)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Flavor</label>
                <input
                  required
                  type="text"
                  value={formData.flavor}
                  onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                  placeholder="e.g. Vanilla, Chocolate, Red Velvet"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold resize-none"
                />
              </div>

              <div className="flex gap-4 pt-6">
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
                  className="flex-[2] py-4 bg-chocolate text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-chocolate/20 hover:bg-rose-deep transition-all flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {product ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
