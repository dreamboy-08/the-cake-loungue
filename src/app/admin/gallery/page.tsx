"use client";

import React, { useState, useMemo } from 'react';
import { useCMS } from '@/context/CMSContext';
import { useProducts } from '@/context/ProductsContext';
import { CMSGalleryItem } from '@/types/cms';
import {
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  Package
} from 'lucide-react';
import AdminConfirmationModal from '@/components/admin/AdminConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const AdminGallery = () => {
  const { galleryItems, updateGalleryItems, deleteGalleryItemFromDB, loading: cmsLoading } = useCMS();
  const { products, loading: productsLoading } = useProducts();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Confirmation & Feedback states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Get unique categories for selection filter dropdown
  const categories = useMemo(() => {
    const list = products.map(p => p.category).filter(Boolean);
    return Array.from(new Set(list));
  }, [products]);

  // Set of product IDs currently in gallery
  const currentGalleryProductIds = useMemo(() => {
    return new Set(
      (galleryItems || [])
        .map(item => item.productId)
        .filter(Boolean) as string[]
    );
  }, [galleryItems]);

  // Available products for modal selection
  const availableProducts = useMemo(() => {
    return products.filter(p => {
      const pId = p.id.toString();
      // Must not already be in gallery
      if (currentGalleryProductIds.has(pId)) return false;

      // Filter search
      const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                            p.category.toLowerCase().includes(productSearch.toLowerCase());

      // Filter category
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, currentGalleryProductIds, productSearch, categoryFilter]);

  // Handle Multi-select checkbox toggle
  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Handle Add Selected Products
  const handleAddSelectedProducts = async () => {
    if (selectedProductIds.length === 0) return;
    setActionLoading(true);

    try {
      const current = [...(galleryItems || [])];
      let maxOrder = current.reduce((max, item) => Math.max(max, item.displayOrder ?? 0), -1);

      const newItems: CMSGalleryItem[] = selectedProductIds.map(pId => {
        maxOrder += 1;
        return {
          id: `gal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          productId: pId,
          displayOrder: maxOrder,
          enabled: true
        };
      });

      const updated = [...current, ...newItems];
      await updateGalleryItems(updated);

      showToast(`Added ${selectedProductIds.length} product(s) to Our Creations!`);
      setSelectedProductIds([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding products to gallery:", error);
      showToast("Failed to add selected products.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Remove Product from Gallery list
  const handleRemoveGalleryItem = async (id: string) => {
    try {
      await deleteGalleryItemFromDB(id);
      const updated = (galleryItems || []).filter(item => item.id !== id);
      // Re-index display orders
      const reindexed = updated.map((item, idx) => ({
        ...item,
        displayOrder: idx
      }));
      await updateGalleryItems(reindexed);
      setShowDeleteConfirm(null);
      showToast("Product removed from Our Creations.");
    } catch (error) {
      console.error("Error removing gallery item:", error);
      showToast("Failed to remove product from Our Creations.", "error");
    }
  };

  // Handle Toggle Active
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setStatusUpdating(id);
    try {
      const updated = (galleryItems || []).map(item => {
        if (item.id === id) {
          return { ...item, enabled: !currentStatus };
        }
        return item;
      });
      await updateGalleryItems(updated);
      showToast(`Showcase item is now ${!currentStatus ? 'Active' : 'Disabled'}`);
    } catch (error) {
      console.error("Error toggling status:", error);
      showToast("Failed to update status.", "error");
    } finally {
      setStatusUpdating(null);
    }
  };

  // Handle Reorder Up / Down
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const sorted = [...(galleryItems || [])].sort((a, b) => a.displayOrder - b.displayOrder);
    if (direction === 'up' && index > 0) {
      const temp = sorted[index];
      sorted[index] = sorted[index - 1];
      sorted[index - 1] = temp;
    } else if (direction === 'down' && index < sorted.length - 1) {
      const temp = sorted[index];
      sorted[index] = sorted[index + 1];
      sorted[index + 1] = temp;
    }

    const reindexed = sorted.map((item, idx) => ({
      ...item,
      displayOrder: idx
    }));

    try {
      await updateGalleryItems(reindexed);
      showToast("Display order updated.");
    } catch (error) {
      console.error("Error updating order:", error);
      showToast("Failed to update order.", "error");
    }
  };

  // Sort gallery items by displayOrder
  const sortedGallery = [...(galleryItems || [])].sort((a, b) => a.displayOrder - b.displayOrder);

  if (cmsLoading || productsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-rose-deep" size={36} />
        <p className="text-gray-500 font-medium">Synchronizing Our Creations CMS Module...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6 sm:space-y-8 animate-fade-up pb-24 max-w-[1600px] mx-auto">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-8 left-1/2 z-[500] px-6 py-3 rounded-[22px] shadow-2xl flex items-center gap-3 font-bold text-sm ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">Gallery / Our Creations</h1>
          <p className="text-gray-500 text-sm mt-1">Select existing products from Products CMS to showcase in the storefront Our Creations section.</p>
        </div>
        <button
          onClick={() => {
            setSelectedProductIds([]);
            setProductSearch('');
            setCategoryFilter('All');
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-rose-deep text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown transition-all w-full sm:w-auto h-11 min-h-[44px]"
        >
          <Plus size={20} />
          <span>+ Add Products</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedGallery.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center gap-4 bg-white rounded-[28px] sm:rounded-[32px] border border-dashed border-gray-200">
            <Package className="text-gray-200" size={64} />
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">No products featured in Our Creations yet.</p>
            <p className="text-xs text-gray-400">Click "+ Add Products" above to select existing products from your catalog.</p>
          </div>
        ) : (
          sortedGallery.map((item, index) => {
            const product = item.productId
              ? products.find(p => p.id.toString() === item.productId?.toString())
              : null;

            const imgSrc = product ? product.img : item.src || '/images/placeholder.jpg';
            const title = product ? product.name : item.label || 'Featured Product';
            const category = product ? product.category : 'General';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-[28px] sm:rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden flex flex-col ${
                  item.enabled === false ? 'opacity-60' : ''
                }`}
              >
                {/* Image Box */}
                <div className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
                    <span className="px-3 py-1.5 bg-chocolate/85 backdrop-blur-md text-white text-[10px] font-black rounded-full shadow-md pointer-events-auto">
                      Priority #{index + 1}
                    </span>
                    <span className={`px-3 py-1.5 backdrop-blur-md text-[10px] font-black rounded-full shadow-md border pointer-events-auto ${
                      item.enabled === false
                        ? 'bg-gray-100/90 text-gray-500 border-gray-200'
                        : 'bg-green-500/90 text-white border-green-600'
                    }`}>
                      {item.enabled === false ? 'Disabled' : 'Live'}
                    </span>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-chocolate truncate" title={title}>
                      {title}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                      {category}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(item.id, item.enabled !== false);
                      }}
                      disabled={statusUpdating === item.id}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 ${
                        item.enabled === false ? 'bg-black/20 text-white hover:bg-black/40' : 'bg-green-500/80 text-white hover:bg-green-600/90'
                      } ${statusUpdating === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {statusUpdating === item.id ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        item.enabled === false ? <EyeOff size={10} /> : <Eye size={10} />
                      )}
                      {item.enabled === false ? 'Hidden' : 'Live'}
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        title="Move Up"
                        disabled={index === 0}
                        onClick={() => handleMoveOrder(index, 'up')}
                        className="p-2 text-gray-400 hover:text-chocolate hover:bg-gray-100 rounded-xl disabled:opacity-30 transition-all focus:outline-none"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        title="Move Down"
                        disabled={index === sortedGallery.length - 1}
                        onClick={() => handleMoveOrder(index, 'down')}
                        className="p-2 text-gray-400 hover:text-chocolate hover:bg-gray-100 rounded-xl disabled:opacity-30 transition-all focus:outline-none"
                      >
                        <ArrowDown size={16} />
                      </button>
                      <button
                        title="Remove from Our Creations"
                        onClick={() => setShowDeleteConfirm(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all focus:outline-none"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add Products to Our Creations */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 sm:p-6 bg-chocolate/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[28px] sm:rounded-[36px] shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">

            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-playfair font-bold text-chocolate">
                  Add Products to Our Creations
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Select existing products from the Products CMS to feature.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-chocolate hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search and Category Filters */}
            <div className="p-6 sm:p-8 pb-4 space-y-4 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-rose-deep/20 focus:border-rose-deep outline-none"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-chocolate outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product List with Multi-Select Checkboxes */}
            <div className="p-6 sm:p-8 pt-2 overflow-y-auto flex-1 space-y-2">
              {availableProducts.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs italic">
                  No available products found matching your search.
                </div>
              ) : (
                availableProducts.map(p => {
                  const pId = p.id.toString();
                  const isChecked = selectedProductIds.includes(pId);

                  return (
                    <label
                      key={pId}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'border-rose-deep bg-cream-dark/50'
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectProduct(pId)}
                          className="w-4 h-4 rounded text-rose-deep focus:ring-rose-deep cursor-pointer"
                        />
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                          <img src={p.img} alt={p.name} className="object-cover w-full h-full" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-chocolate text-xs truncate leading-snug">{p.name}</p>
                          <span className="text-[10px] text-gray-400 font-semibold uppercase">{p.category}</span>
                        </div>
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-6 sm:p-8 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-xs font-bold text-chocolate">
                {selectedProductIds.length} product(s) selected
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold text-gray-500 hover:bg-gray-200/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={selectedProductIds.length === 0 || actionLoading}
                  onClick={handleAddSelectedProducts}
                  className="flex items-center gap-2 bg-rose-deep text-white px-6 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-rose-deep/20 hover:bg-brown transition-all disabled:opacity-50"
                >
                  {actionLoading && <Loader2 size={14} className="animate-spin" />}
                  <span>Add Selected</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <AdminConfirmationModal
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && handleRemoveGalleryItem(showDeleteConfirm)}
        title="Remove Product from Our Creations?"
        message="This action will remove the product from the Our Creations section. The product will NOT be deleted from the Products CMS."
        confirmText="Remove Product"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default AdminGallery;
