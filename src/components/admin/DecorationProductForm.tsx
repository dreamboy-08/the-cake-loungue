"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { db } from '@/utils/firebase';
import { uploadToCloudinary } from '@/utils/cloudinary';
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
  X,
  Upload,
  Loader2,
  Plus,
  Image as ImageIcon,
  AlertCircle,
  Trash2,
  CheckCircle2,
  Star,
  Zap,
  Clock,
  Package,
  Eye,
  Sliders,
  Settings,
  TrendingUp,
  Tag
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { DecorationProduct, ImageItem } from '@/types/decorations';

interface DecorationProductFormProps {
  product?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const DecorationProductForm = ({ product, onClose, onSuccess }: DecorationProductFormProps) => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Media gallery items
  const [imageItems, setImageItems] = useState<Array<{ url: string; altText: string; displayOrder: number; file: File | null; isExisting: boolean }>>(() => {
    if (product?.images && product.images.length > 0) {
      return product.images.map((img: any, idx: number) => ({
        url: img.url,
        altText: img.altText || '',
        displayOrder: img.displayOrder || (idx + 1),
        file: null,
        isExisting: true
      }));
    } else if (product?.thumbnailImage) {
      return [{ url: product.thumbnailImage, altText: '', displayOrder: 1, file: null, isExisting: true }];
    }
    return [];
  });

  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    brand: product?.brand || '',
    shortDescription: product?.shortDescription || '',
    fullDescription: product?.fullDescription || '',
    price: product?.price || '',
    discountPrice: product?.discountPrice || '',
    sku: product?.sku || '',
    stockQuantity: product?.stockQuantity !== undefined ? product.stockQuantity : 100,
    reservedStock: product?.reservedStock !== undefined ? product.reservedStock : 0,
    soldQuantity: product?.soldQuantity !== undefined ? product.soldQuantity : 0,
    lowStockWarning: product?.lowStockWarning !== undefined ? product.lowStockWarning : 10,
    status: product?.status || 'Active',
    sortOrder: product?.sortOrder !== undefined ? product.sortOrder : 1,
    tagsString: product?.tags ? product.tags.join(', ') : '',
    autoDisableWhenOutOfStock: product?.autoDisableWhenOutOfStock !== undefined ? product.autoDisableWhenOutOfStock : true,

    // Visibility Controls
    showOnHomepage: product?.visibility?.showOnHomepage !== undefined ? product.visibility.showOnHomepage : true,
    showInProductPageSuggestions: product?.visibility?.showInProductPageSuggestions !== undefined ? product.visibility.showInProductPageSuggestions : true,
    showInCartSuggestions: product?.visibility?.showInCartSuggestions !== undefined ? product.visibility.showInCartSuggestions : true,
    showInCheckoutPage: product?.visibility?.showInCheckoutPage !== undefined ? product.visibility.showInCheckoutPage : true,
    showInRelatedProducts: product?.visibility?.showInRelatedProducts !== undefined ? product.visibility.showInRelatedProducts : true,
    showInBirthdayCollection: product?.visibility?.showInBirthdayCollection !== undefined ? product.visibility.showInBirthdayCollection : true,
    showInSearchResults: product?.visibility?.showInSearchResults !== undefined ? product.visibility.showInSearchResults : true,
    showInFeaturedProducts: product?.visibility?.showInFeaturedProducts !== undefined ? product.visibility.showInFeaturedProducts : true,
    showInNewArrivals: product?.visibility?.showInNewArrivals !== undefined ? product.visibility.showInNewArrivals : true,
    showInFestivalCollection: product?.visibility?.showInFestivalCollection !== undefined ? product.visibility.showInFestivalCollection : true,
    hideEverywhere: product?.visibility?.hideEverywhere !== undefined ? product.visibility.hideEverywhere : false,

    // Recommendation Settings
    recommendWithCakes: product?.recommendations?.recommendWithCakes !== undefined ? product.recommendations.recommendWithCakes : true,
    recommendWithPastries: product?.recommendations?.recommendWithPastries !== undefined ? product.recommendations.recommendWithPastries : true,
    recommendWithCupcakes: product?.recommendations?.recommendWithCupcakes !== undefined ? product.recommendations.recommendWithCupcakes : true,
    recommendWithHampers: product?.recommendations?.recommendWithHampers !== undefined ? product.recommendations.recommendWithHampers : true,
    recommendWithCustomCakes: product?.recommendations?.recommendWithCustomCakes !== undefined ? product.recommendations.recommendWithCustomCakes : true,
    specificProductIdsString: product?.recommendations?.specificProductIds ? product.recommendations.specificProductIds.join(', ') : '',

    // Upsell Options
    frequentlyBoughtTogether: product?.upsell?.frequentlyBoughtTogether !== undefined ? product.upsell.frequentlyBoughtTogether : true,
    customersAlsoBought: product?.upsell?.customersAlsoBought !== undefined ? product.upsell.customersAlsoBought : true,
    recommendedAddons: product?.upsell?.recommendedAddons !== undefined ? product.upsell.recommendedAddons : true,
    popularWithThisCake: product?.upsell?.popularWithThisCake !== undefined ? product.upsell.popularWithThisCake : true
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setMounted(true);
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setCatLoading(true);
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
        const localCats = (window as any)._adminDecorationCategories || [
          { id: 'dc1', name: 'Party Essentials' },
          { id: 'dc2', name: 'Candles' },
          { id: 'dc3', name: 'Birthday Accessories' },
          { id: 'dc4', name: 'Cake Decorations' },
          { id: 'dc5', name: 'Celebration Products' },
          { id: 'dc6', name: 'Gift Accessories' }
        ];
        setCategories(localCats);
        setCatLoading(false);
        return;
      }

      try {
        const snap = await getDocs(collection(db, 'decoration_categories'));
        const cats = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setCategories(cats);
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setCatLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newItems = files.map((file, idx) => ({
        url: URL.createObjectURL(file),
        altText: '',
        displayOrder: imageItems.length + idx + 1,
        file,
        isExisting: false
      }));
      setImageItems(prev => [...prev, ...newItems]);
    }
  };

  const removeImageItem = (index: number) => {
    setImageItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const updateImageMeta = (index: number, field: 'altText' | 'displayOrder', value: any) => {
    setImageItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Decoration product name is required.";
    if (!formData.category) return "Please select a category.";
    if (!formData.price || Number(formData.price) <= 0) return "Valid base price is required.";
    if (imageItems.length === 0) return "Please add at least one product image.";
    if (!formData.shortDescription.trim()) return "Short description is required.";
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
      const finalImages: ImageItem[] = [];

      for (const item of imageItems) {
        if (item.isExisting) {
          finalImages.push({
            url: item.url,
            altText: item.altText,
            displayOrder: Number(item.displayOrder)
          });
        } else if (item.file) {
          try {
            if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME === "your_cloud_name") {
              finalImages.push({
                url: item.url,
                altText: item.altText,
                displayOrder: Number(item.displayOrder)
              });
            } else {
              const url = await uploadToCloudinary(item.file);
              finalImages.push({
                url,
                altText: item.altText,
                displayOrder: Number(item.displayOrder)
              });
            }
          } catch (uploadError) {
            console.error("Cloudinary upload failed:", uploadError);
            showToast("Failed to upload image. Please try again.", "error");
            setLoading(false);
            return;
          }
        }
      }

      // Sort images by displayOrder
      finalImages.sort((a, b) => a.displayOrder - b.displayOrder);
      const thumbnailImage = finalImages[0]?.url || "/images/products/placeholder.jpg";

      const tags = formData.tagsString
        .split(',')
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0);

      const specificProductIds = formData.specificProductIdsString
        .split(',')
        .map((id: string) => id.trim())
        .filter((id: string) => id.length > 0);

      const productData: DecorationProduct = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand || undefined,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        images: finalImages,
        thumbnailImage,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        sku: formData.sku || 'SKU-' + Date.now(),
        stockQuantity: Number(formData.stockQuantity),
        reservedStock: Number(formData.reservedStock),
        soldQuantity: Number(formData.soldQuantity),
        lowStockWarning: Number(formData.lowStockWarning),
        status: formData.status as any,
        sortOrder: Number(formData.sortOrder),
        tags,
        autoDisableWhenOutOfStock: formData.autoDisableWhenOutOfStock,
        visibility: {
          showOnHomepage: formData.showOnHomepage,
          showInProductPageSuggestions: formData.showInProductPageSuggestions,
          showInCartSuggestions: formData.showInCartSuggestions,
          showInCheckoutPage: formData.showInCheckoutPage,
          showInRelatedProducts: formData.showInRelatedProducts,
          showInBirthdayCollection: formData.showInBirthdayCollection,
          showInSearchResults: formData.showInSearchResults,
          showInFeaturedProducts: formData.showInFeaturedProducts,
          showInNewArrivals: formData.showInNewArrivals,
          showInFestivalCollection: formData.showInFestivalCollection,
          hideEverywhere: formData.hideEverywhere
        },
        recommendations: {
          recommendWithCakes: formData.recommendWithCakes,
          recommendWithPastries: formData.recommendWithPastries,
          recommendWithCupcakes: formData.recommendWithCupcakes,
          recommendWithHampers: formData.recommendWithHampers,
          recommendWithCustomCakes: formData.recommendWithCustomCakes,
          specificProductIds
        },
        upsell: {
          frequentlyBoughtTogether: formData.frequentlyBoughtTogether,
          customersAlsoBought: formData.customersAlsoBought,
          recommendedAddons: formData.recommendedAddons,
          popularWithThisCake: formData.popularWithThisCake
        },
        updatedAt: new Date().toISOString()
      };

      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
        console.warn("Firebase not configured, executing local memory decorations CRUD.");
        const currentList = (window as any)._adminDecorations || [];
        if (product?.id) {
          const updated = currentList.map((d: any) => d.id === product.id ? { ...d, ...productData } : d);
          (window as any)._adminDecorations = updated;
        } else {
          const newDoc = { ...productData, id: 'deco_' + Date.now(), createdAt: new Date().toISOString() };
          (window as any)._adminDecorations = [newDoc, ...currentList];
        }
      } else {
        if (product?.id) {
          await updateDoc(doc(db, 'decorations', product.id), productData as any);
        } else {
          await addDoc(collection(db, 'decorations'), {
            ...productData,
            createdAt: new Date().toISOString()
          });
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving decoration item:", err);
      showToast("Failed to save product.", "error");
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-chocolate/60 backdrop-blur-sm animate-in fade-in duration-300">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[700] px-6 py-3 rounded-[22px] shadow-2xl flex items-center gap-3 font-bold text-sm ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 border-b flex items-center justify-between bg-chocolate text-white shrink-0">
          <div>
            <h2 className="text-2xl font-bold font-playfair">{product ? 'Edit Decoration Product' : 'New Decoration Product'}</h2>
            <p className="text-[10px] text-white/60 uppercase tracking-widest mt-1 font-bold">Manage Decorative Accessory & Party Essential</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-rose rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column: Media & Controls */}
            <div className="space-y-6">
              {/* Media Section */}
              <div className="space-y-4">
                <label className="block text-sm font-black text-chocolate uppercase tracking-widest">Image Gallery</label>
                <div className="grid grid-cols-2 gap-4">
                  {imageItems.map((item, idx) => (
                    <div key={idx} className="relative p-3 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col gap-2 group">
                      <div className="relative aspect-video rounded-xl overflow-hidden shadow-inner bg-white">
                        <Image src={item.url} alt="Preview" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImageItem(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                        {idx === 0 && (
                          <div className="absolute bottom-0 inset-x-0 bg-rose-deep/80 text-white text-[8px] font-bold text-center py-1 uppercase tracking-widest">
                            Thumbnail / Main Image
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Alt text (SEO)"
                          value={item.altText}
                          onChange={(e) => updateImageMeta(idx, 'altText', e.target.value)}
                          className="w-full px-2 py-1 border rounded-lg text-xs font-bold"
                        />
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-black uppercase text-gray-400">Order:</span>
                          <input
                            type="number"
                            value={item.displayOrder}
                            onChange={(e) => updateImageMeta(idx, 'displayOrder', parseInt(e.target.value) || 1)}
                            className="w-16 px-1 py-0.5 border rounded text-xs text-center font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => document.getElementById('deco-image-upload')?.click()}
                    className="aspect-video rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:border-rose-deep/50 hover:bg-rose/5 transition-all"
                  >
                    <Plus size={24} />
                    <span className="text-[10px] font-black uppercase mt-1">Add Image</span>
                  </button>
                </div>
                <input id="deco-image-upload" type="file" multiple accept="image/*" onChange={handleImageAdd} className="hidden" />
              </div>

              {/* Status & Basic Controls */}
              <div className="p-5 rounded-3xl bg-gray-50 border border-gray-100 space-y-4">
                <h3 className="text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Inventory Status & Automations</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-gray-100 text-xs font-bold"
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort Order</label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-gray-100 text-xs font-bold"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 cursor-pointer hover:border-rose-deep/30 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.autoDisableWhenOutOfStock}
                    onChange={(e) => setFormData({ ...formData, autoDisableWhenOutOfStock: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-rose-deep focus:ring-rose-deep"
                  />
                  <span className="text-xs font-bold text-chocolate">Auto disable when out of stock</span>
                </label>
              </div>

              {/* Visibility Switches */}
              <div className="p-5 rounded-3xl bg-rose/5 border border-rose/10 space-y-4">
                <h3 className="text-[10px] font-black text-rose-deep/60 uppercase tracking-widest">Placement & Visibility Controls</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Show on Homepage', field: 'showOnHomepage' },
                    { label: 'PDP Suggestions', field: 'showInProductPageSuggestions' },
                    { label: 'Cart Suggestions', field: 'showInCartSuggestions' },
                    { label: 'Checkout Page Add-on', field: 'showInCheckoutPage' },
                    { label: 'Related Products', field: 'showInRelatedProducts' },
                    { label: 'Birthday Collection', field: 'showInBirthdayCollection' },
                    { label: 'Search Results', field: 'showInSearchResults' },
                    { label: 'Featured Products', field: 'showInFeaturedProducts' },
                    { label: 'New Arrivals', field: 'showInNewArrivals' },
                    { label: 'Festival Collection', field: 'showInFestivalCollection' }
                  ].map(item => (
                    <label key={item.field} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData as any)[item.field]}
                        onChange={(e) => setFormData({ ...formData, [item.field]: e.target.checked })}
                        className="w-3.5 h-3.5 rounded text-rose-deep"
                      />
                      <span className="text-[11px] font-bold text-chocolate">{item.label}</span>
                    </label>
                  ))}
                </div>
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-red-50 border border-red-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hideEverywhere}
                    onChange={(e) => setFormData({ ...formData, hideEverywhere: e.target.checked })}
                    className="w-4 h-4 rounded text-red-500"
                  />
                  <span className="text-xs font-black text-red-700 uppercase tracking-widest">Hide Everywhere</span>
                </label>
              </div>
            </div>

            {/* Right Column: Product Details & Suggestions / Upsell */}
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
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                    placeholder="e.g. PP-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border">
                {[
                  { label: 'Stock', field: 'stockQuantity' },
                  { label: 'Reserved', field: 'reservedStock' },
                  { label: 'Sold', field: 'soldQuantity' },
                  { label: 'Low Alert', field: 'lowStockWarning' }
                ].map(item => (
                  <div key={item.field} className="space-y-1">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">{item.label}</label>
                    <input
                      type="number"
                      value={(formData as any)[item.field]}
                      onChange={(e) => setFormData({ ...formData, [item.field]: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 rounded-lg border text-xs font-bold"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Brand (Optional)</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tagsString}
                    onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                    placeholder="birthday, premium, candles"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-rose-deep outline-none text-sm font-bold resize-none"
                />
              </div>

              {/* Recommendation Settings */}
              <div className="p-4 rounded-2xl bg-gray-50 border space-y-4">
                <h4 className="text-[10px] font-black text-chocolate uppercase tracking-widest">Recommendation Settings</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Recommend with Cakes', field: 'recommendWithCakes' },
                    { label: 'Pastries', field: 'recommendWithPastries' },
                    { label: 'Cupcakes', field: 'recommendWithCupcakes' },
                    { label: 'Hampers', field: 'recommendWithHampers' },
                    { label: 'Custom Cakes', field: 'recommendWithCustomCakes' }
                  ].map(item => (
                    <label key={item.field} className="flex items-center gap-2 p-2 bg-white rounded-lg border cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData as any)[item.field]}
                        onChange={(e) => setFormData({ ...formData, [item.field]: e.target.checked })}
                        className="w-3.5 h-3.5 rounded text-rose-deep"
                      />
                      <span className="text-[10px] font-black uppercase text-gray-500">{item.label}</span>
                    </label>
                  ))}
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Specific Product IDs overrides (comma separated)</label>
                  <input
                    type="text"
                    value={formData.specificProductIdsString}
                    onChange={(e) => setFormData({ ...formData, specificProductIdsString: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border text-xs font-bold"
                    placeholder="1, 2, 3, 999"
                  />
                </div>
              </div>

              {/* Upsell Options */}
              <div className="p-4 rounded-2xl bg-gray-50 border space-y-3">
                <h4 className="text-[10px] font-black text-chocolate uppercase tracking-widest">Upsell / Suggestion Strategy</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Frequently Bought Together', field: 'frequentlyBoughtTogether' },
                    { label: 'Customers Also Bought', field: 'customersAlsoBought' },
                    { label: 'Recommended Add-ons', field: 'recommendedAddons' },
                    { label: 'Popular with this Cake', field: 'popularWithThisCake' }
                  ].map(item => (
                    <label key={item.field} className="flex items-center gap-2 p-2 bg-white rounded-xl border cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData as any)[item.field]}
                        onChange={(e) => setFormData({ ...formData, [item.field]: e.target.checked })}
                        className="w-3.5 h-3.5 rounded text-rose-deep"
                      />
                      <span className="text-[10px] font-black text-chocolate uppercase">{item.label}</span>
                    </label>
                  ))}
                </div>
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
                  {product ? 'Update Decoration' : 'Create Decoration'}
                </button>
              </div>
            </div>
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

export default DecorationProductForm;
