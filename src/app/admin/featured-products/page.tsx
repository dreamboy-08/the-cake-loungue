"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useCMS } from '@/context/CMSContext';
import { useProducts } from '@/context/ProductsContext';
import { FeaturedProductsSettings } from '@/types/cms';
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Package,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_FEATURED_IDS = ['1', '2', '3', '5', '6', '7', '9', '11', '13', '17', '55', '59', '103', '114', '325', '327'];

const AdminFeaturedProducts = () => {
  const { featuredProducts, updateFeaturedProducts, loading: cmsLoading } = useCMS();
  const { products, loading: productsLoading } = useProducts();

  const [localSettings, setLocalSettings] = useState<FeaturedProductsSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Search/Filter states for the product picker list
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    if (featuredProducts) {
      setLocalSettings(JSON.parse(JSON.stringify(featuredProducts)));
    }
  }, [featuredProducts]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFieldChange = (field: keyof FeaturedProductsSettings, value: any) => {
    if (!localSettings) return;
    setLocalSettings(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  // Reorder actions
  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!localSettings) return;
    const ids = [...(localSettings.productIds || [])];
    if (direction === 'up' && index > 0) {
      const temp = ids[index];
      ids[index] = ids[index - 1];
      ids[index - 1] = temp;
    } else if (direction === 'down' && index < ids.length - 1) {
      const temp = ids[index];
      ids[index] = ids[index + 1];
      ids[index + 1] = temp;
    }
    handleFieldChange('productIds', ids);
    showToast("Display order updated local draft");
  };

  // Add item to selection
  const handleAddProduct = (productId: string) => {
    if (!localSettings) return;
    const ids = [...(localSettings.productIds || [])];
    if (ids.includes(productId)) {
      showToast("Product already in featured list", "error");
      return;
    }
    ids.push(productId);
    handleFieldChange('productIds', ids);
    showToast("Added to featured selection!");
  };

  // Remove item from selection
  const handleRemoveProduct = (productId: string) => {
    if (!localSettings) return;
    const ids = (localSettings.productIds || []).filter(id => id !== productId);
    handleFieldChange('productIds', ids);
    showToast("Removed from featured list");
  };

  // Save configurations
  const handleSaveSettings = async () => {
    if (!localSettings) return;
    setSaving(true);
    try {
      await updateFeaturedProducts(localSettings);
      showToast("Featured Products configurations saved successfully!");
    } catch (err) {
      console.error("Error saving featured products CMS settings:", err);
      showToast("Failed to save settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Reset to static system defaults
  const handleResetToDefaults = () => {
    if (!localSettings) return;
    setLocalSettings({
      id: 'featured_products',
      enabled: true,
      title: 'Featured Cakes',
      subtitle: 'Our Bestsellers',
      productIds: [...DEFAULT_FEATURED_IDS]
    });
    showToast("Reset local inputs to default array. Save to apply.");
  };

  // Get categories from the catalog list to populate search filter
  const categories = useMemo(() => {
    const list = products.map(p => p.category).filter(Boolean);
    return Array.from(new Set(list));
  }, [products]);

  // Filtered list of products for selection panel
  const availableProductsForSelection = useMemo(() => {
    const selectedIds = new Set(localSettings?.productIds || []);
    return products.filter(p => {
      // Must not already be selected
      const isSelected = selectedIds.has(p.id.toString());
      if (isSelected) return false;

      // Filter by search text
      const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                            p.category.toLowerCase().includes(productSearch.toLowerCase());
      // Filter by category
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, localSettings?.productIds, productSearch, categoryFilter]);

  if (cmsLoading || productsLoading || !localSettings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-rose-deep" size={36} />
        <p className="text-gray-500 font-medium">Synchronizing Featured Products CMS Module...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6 sm:space-y-8 animate-fade-up pb-24 max-w-[1600px] mx-auto">
      {/* Toast alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-8 left-1/2 z-[500] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Admin Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">Homepage Featured Products CMS</h1>
          <p className="text-gray-500 mt-1 text-sm">Select, remove, and sort which products show in the homepage Featured section dynamically.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 h-11 min-h-[44px]"
          >
            <RefreshCw size={14} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => handleFieldChange('enabled', !localSettings.enabled)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border h-11 min-h-[44px] ${
              localSettings.enabled
                ? 'bg-green-50 text-green-600 border-green-200'
                : 'bg-red-50 text-red-500 border-red-200'
            }`}
          >
            {localSettings.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
            <span>{localSettings.enabled ? 'Section Live' : 'Section Hidden'}</span>
          </button>

          <button
            disabled={saving}
            onClick={handleSaveSettings}
            className="flex items-center gap-2 bg-chocolate text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-brown transition-all disabled:opacity-50 text-xs shrink-0 h-11 min-h-[44px]"
          >
            {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            <span>Save All Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Side: General Section Config (Heading, Subheading) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-chocolate flex items-center gap-2 border-b border-gray-50 pb-3 font-playfair">
              <Sparkles size={20} className="text-rose-deep" />
              Section Settings
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Section Heading Title</label>
                <input
                  type="text"
                  value={localSettings.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-bold text-chocolate font-playfair"
                  placeholder="e.g. Featured Cakes"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Section Subheading Label</label>
                <input
                  type="text"
                  value={localSettings.subtitle}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-bold text-gray-600"
                  placeholder="e.g. Our Bestsellers"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Curator Workspace & Product Selector */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-chocolate flex items-center gap-2 border-b border-gray-50 pb-3 font-playfair">
              <Package size={20} className="text-rose-deep" />
              Curated Featured List ({localSettings.productIds?.length || 0})
            </h2>

            {/* Display list of featured products */}
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
              {(localSettings.productIds || []).map((id, index) => {
                const product = products.find(p => p.id.toString() === id.toString());
                const isStale = !product;

                return (
                  <div
                    key={id}
                    className={`flex items-center justify-between p-3 rounded-2xl border ${
                      isStale ? 'border-red-200 bg-red-50/30' : 'border-gray-100 bg-gray-50 hover:bg-white'
                    } transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-chocolate/40 w-5 text-center">#{index + 1}</span>
                      {!isStale ? (
                        <>
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm shrink-0 border border-gray-100">
                            <img src={product.img} alt={product.name} className="object-cover w-full h-full" />
                          </div>
                          <div>
                            <p className="font-bold text-chocolate text-xs leading-none">{product.name}</p>
                            <span className="text-[9px] text-gray-400 font-bold uppercase mt-1 inline-block">{product.category}</span>
                          </div>
                        </>
                      ) : (
                        <div>
                          <p className="font-bold text-red-600 text-xs">Stale Product Reference</p>
                          <span className="text-[9px] text-red-400 font-mono">ID: {id}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveItem(index, 'up')}
                        className="p-1.5 text-gray-400 hover:text-chocolate hover:bg-gray-200 rounded-lg disabled:opacity-30 transition-all"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={index === (localSettings.productIds || []).length - 1}
                        onClick={() => moveItem(index, 'down')}
                        className="p-1.5 text-gray-400 hover:text-chocolate hover:bg-gray-200 rounded-lg disabled:opacity-30 transition-all"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {(!localSettings.productIds || localSettings.productIds.length === 0) && (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center space-y-2">
                  <Package className="text-gray-300" size={32} />
                  <p className="text-xs text-gray-400 font-medium">No products currently featured.</p>
                  <p className="text-[10px] text-gray-400 leading-normal">Use the search selection catalog below to feature items.</p>
                </div>
              )}
            </div>

            {/* Selection Selector catalog list */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <h3 className="text-sm font-bold text-chocolate">Select Products from Catalog</h3>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search catalog products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border-none text-xs focus:ring-1 focus:ring-rose-deep outline-none h-10"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-gray-50 border-none text-xs font-bold text-chocolate outline-none cursor-pointer h-10"
                >
                  <option value="All">All Categories</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              {/* Grid or List of available search selection products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                {availableProductsForSelection.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-rose-deep/30 bg-white transition-all group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                        <img src={p.img} alt={p.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-chocolate text-xs truncate leading-none">{p.name}</p>
                        <span className="text-[9px] text-gray-400 font-bold uppercase mt-0.5 inline-block">{p.category}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddProduct(p.id.toString())}
                      className="flex items-center gap-1 bg-cream-dark text-rose-deep hover:bg-rose-deep hover:text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0"
                    >
                      <Plus size={12} />
                      <span>Add</span>
                    </button>
                  </div>
                ))}

                {availableProductsForSelection.length === 0 && (
                  <div className="col-span-full text-center py-6 text-xs text-gray-400 italic">
                    No matching catalog products found.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminFeaturedProducts;
