"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Search, Check, AlertCircle } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { useProducts } from '@/context/ProductsContext';
import { CMSGalleryItem } from '@/types/cms';
import Image from 'next/image';

interface GalleryItemFormProps {
  item?: CMSGalleryItem | null;
  allGalleryItems: CMSGalleryItem[];
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const GalleryItemForm = ({ item, allGalleryItems, onClose, onSuccess }: GalleryItemFormProps) => {
  const { updateGalleryItems, categories } = useCMS();
  const { products } = useProducts();
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

  // Compute available categories from CMS + Products Context
  const availableCategories = useMemo(() => {
    const listFromCMS = (categories || []).map(c => c.name).filter(Boolean);
    const listFromProducts = products.map(p => p.category).filter(Boolean);
    const unique = Array.from(new Set([...listFromCMS, ...listFromProducts]));
    return unique;
  }, [categories, products]);

  // Determine initial selected product if editing
  const initialSelectedProduct = useMemo(() => {
    if (!item?.productId) return null;
    return products.find(p => p.id.toString() === item.productId?.toString()) || null;
  }, [item, products]);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialSelectedProduct?.category || availableCategories[0] || 'Birthday Cakes'
  );

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    item?.productId ? item.productId.toString() : null
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [enabled, setEnabled] = useState<boolean>(item?.enabled !== undefined ? item.enabled : true);
  const [displayOrder, setDisplayOrder] = useState<number>(
    item !== undefined && item !== null ? item.displayOrder + 1 : allGalleryItems.length + 1
  );

  // Filter products by selected category and search query
  const categoryProducts = useMemo(() => {
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return categoryProducts;
    return categoryProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categoryProducts, searchQuery]);

  // Selected product object
  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return products.find(p => p.id.toString() === selectedProductId.toString()) || null;
  }, [products, selectedProductId]);

  // Check if chosen product is already in gallery (excluding current editing item)
  const isDuplicate = useMemo(() => {
    if (!selectedProductId) return false;
    return allGalleryItems.some(
      g => g.productId?.toString() === selectedProductId.toString() && g.id !== item?.id
    );
  }, [allGalleryItems, selectedProductId, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !selectedProduct) return;
    setLoading(true);

    try {
      const isEdit = !!item;
      let updatedList = [...allGalleryItems];

      if (isEdit) {
        updatedList = updatedList.filter(g => g.id !== item?.id);
      }

      // Dynamic routing link based on selected product ID
      const productLink = `/shop/${selectedProduct.id}`;

      const currentItem: CMSGalleryItem = {
        id: item?.id || 'gal_' + Date.now(),
        productId: selectedProduct.id.toString(),
        categoryId: selectedProduct.category,
        src: selectedProduct.img,
        label: selectedProduct.name,
        link: productLink,
        enabled,
        displayOrder: 0, // Assigned sequentially below
      };

      const targetIdx = Math.max(0, Math.min(displayOrder - 1, updatedList.length));
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
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b flex items-center justify-between bg-chocolate text-white shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-playfair">{item ? 'Edit Gallery Item' : 'Add to Gallery'}</h2>
            <p className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Select catalog product to showcase</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-rose rounded-full transition-colors focus:outline-none">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* STEP 1: Category Selector */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSearchQuery('');
              }}
              className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-rose-deep outline-none text-sm font-bold text-chocolate cursor-pointer transition-all"
            >
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* STEP 2: Product Selector Grid */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">
                Products in {selectedCategory} ({categoryProducts.length})
              </label>

              {/* Search Bar within Category */}
              {categoryProducts.length > 4 && (
                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-semibold focus:outline-none focus:border-rose-deep"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[220px] overflow-y-auto p-1 bg-gray-50 rounded-2xl border border-gray-100">
              {filteredProducts.map((p) => {
                const isSelected = selectedProductId === p.id.toString();
                const isAlreadyInGallery = allGalleryItems.some(
                  g => g.productId?.toString() === p.id.toString() && g.id !== item?.id
                );

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProductId(p.id.toString())}
                    className={`relative flex flex-col items-center p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-rose-deep bg-rose-deep/5 shadow-md ring-2 ring-rose-deep/30'
                        : isAlreadyInGallery
                        ? 'border-gray-200 bg-gray-100/60 opacity-60 hover:opacity-100'
                        : 'border-gray-200 bg-white hover:border-chocolate/30 hover:shadow-sm'
                    }`}
                  >
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 mb-2">
                      <Image
                        src={p.img}
                        alt={p.name}
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-rose-deep text-white p-1 rounded-full shadow-md">
                          <Check size={12} />
                        </div>
                      )}
                      {isAlreadyInGallery && !isSelected && (
                        <div className="absolute inset-0 bg-chocolate/40 flex items-center justify-center">
                          <span className="text-[8px] font-black uppercase text-white bg-black/60 px-1.5 py-0.5 rounded">In Gallery</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-bold text-chocolate line-clamp-1 w-full text-center">
                      {p.name}
                    </p>
                    <span className="text-[9px] text-gray-400 font-medium">
                      {p.category}
                    </span>
                  </button>
                );
              })}

              {filteredProducts.length === 0 && (
                <div className="col-span-full py-8 text-center text-gray-400 font-semibold text-xs">
                  No products available in this category.
                </div>
              )}
            </div>
          </div>

          {/* Duplicate Warning */}
          {isDuplicate && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs font-bold">
              <AlertCircle size={16} className="shrink-0 text-amber-600" />
              <span>This product is already present in your gallery portfolio.</span>
            </div>
          )}

          {/* STEP 3: Selected Product Details Summary */}
          {selectedProduct && (
            <div className="p-4 rounded-2xl bg-cream/40 border border-gold/20 flex items-center gap-4 animate-fade-in">
              <div className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0 border border-gold/30">
                <Image
                  src={selectedProduct.img}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black uppercase text-gold-dark tracking-widest block">Selected Product</span>
                <h4 className="text-sm font-bold text-chocolate truncate mt-0.5">{selectedProduct.name}</h4>
                <p className="text-xs text-gray-500 font-medium">{selectedProduct.category} · ₹{selectedProduct.price}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-1 truncate">
                  Auto Route: /shop/{selectedProduct.id}
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Display Order & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">
                Display Order
              </label>
              <input
                type="number"
                min="1"
                required
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-rose-deep outline-none text-sm font-bold"
              />
            </div>

            {/* Active Status Toggle */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-chocolate/40 uppercase tracking-widest">
                Status
              </label>
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer group hover:bg-gray-100/80 transition-all h-[50px]">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-rose-deep focus:ring-rose-deep"
                />
                <span className="text-xs font-bold text-chocolate">Visible in Storefront</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all focus:outline-none"
            >
              Cancel
            </button>
            <button
              disabled={loading || !selectedProductId || !selectedProduct}
              type="submit"
              className="flex-[2] py-4 bg-rose-deep text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-deep/20 hover:bg-brown transition-all flex items-center justify-center gap-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {item ? 'Update Gallery Item' : 'Add to Gallery'}
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
