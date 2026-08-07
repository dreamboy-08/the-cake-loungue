"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '@/utils/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  limit,
  startAfter
} from 'firebase/firestore';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Loader2,
  AlertCircle,
  RefreshCcw,
  Star,
  TrendingUp,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import Image from 'next/image';
import ProductForm from '@/components/admin/ProductForm';
import { products as staticProducts } from '@/constants/products';
import { useProducts } from '@/context/ProductsContext';

const AdminProducts = () => {
  const { refreshProducts } = useProducts();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [allProducts, setAllProducts] = useState<any[] | null>(null);
  const [isSearchingAll, setIsSearchingAll] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Client-side viewport check to dynamically render card/table views and prevent DOM pollution/test flakiness
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProducts = useCallback(async (isNext = false) => {
    setLoading(true);
    if (!isNext) setAllProducts(null);

    // Fallback if Firebase is not configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
      console.warn("Firebase not configured, falling back to static products in Admin Catalog.");
      if (typeof window !== 'undefined') {
        const currentList = (window as any)._adminProducts || staticProducts;
        setProducts(currentList);
        setHasMore(false);
      }
      setLoading(false);
      return;
    }

    try {
      let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));

      if (isNext && lastDoc) {
        q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(PAGE_SIZE));
      }

      const snapshot = await getDocs(q);
      const newProducts = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      if (isNext) {
        setProducts(prev => {
          // Prevent duplicates
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNew = newProducts.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNew];
        });
      } else {
        setProducts(newProducts);
      }

      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      setLastDoc(lastVisible);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching products, falling back to static:", error);
      if (typeof window !== 'undefined') {
        const currentList = (window as any)._adminProducts || staticProducts;
        setProducts(currentList);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [lastDoc]);

  useEffect(() => {
    // Initial fetch only if products is empty to avoid loop if fetchProducts changes
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  useEffect(() => {
    // Fallback if Firebase is not configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
      console.warn("Firebase not configured, falling back to static categories in Admin Products.");
      const staticCats = Array.from(new Set(staticProducts.map(p => p.category)));
      setCategories(staticCats.map((cat, idx) => ({ name: cat, id: (idx + 1).toString() })));
      return;
    }

    const unsubCats = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    }, (error) => {
      console.error("Error listening to categories, falling back to static:", error);
      const staticCats = Array.from(new Set(staticProducts.map(p => p.category)));
      setCategories(staticCats.map((cat, idx) => ({ name: cat, id: (idx + 1).toString() })));
    });

    return () => unsubCats();
  }, []);

  // Search and Filter full catalog logic
  useEffect(() => {
    const fetchAllForFilter = async () => {
      const isFiltering = searchTerm || categoryFilter !== 'All' || statusFilter !== 'All';
      if (isFiltering && !allProducts && hasMore) {
        setIsSearchingAll(true);
        try {
          const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(q);
          const allFetched = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setAllProducts(allFetched);
        } catch (error) {
          console.error("Error fetching all products for filtering:", error);
        } finally {
          setIsSearchingAll(false);
        }
      }
    };

    fetchAllForFilter();
  }, [searchTerm, categoryFilter, statusFilter, allProducts, hasMore]);

  const handleSyncCatalog = async () => {
    if (!confirm("This will restore the entire product catalog from static constants. Continue?")) return;
    setIsSyncing(true);
    setAllProducts(null);
    try {
      const { recoverCatalog } = await import("@/utils/recoverCatalog");
      const success = await recoverCatalog();
      if (success) {
        alert("Catalog restored successfully!");
        await refreshProducts();
        fetchProducts();
      }
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSeedCategories = async () => {
    if (!confirm("This will populate categories from the static products list. Continue?")) return;
    setIsSyncing(true);
    setAllProducts(null);
    try {
      const { seedCategories } = await import("@/utils/seedCategories");
      const success = await seedCategories();
      if (success) alert("Categories seeded successfully!");
    } catch (error) {
      console.error("Seeding error:", error);
      alert("Failed to seed categories.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleMigrateWeights = async () => {
    if (!confirm("This will add MULTIPLE weight options (0.5 Kg, 1 Kg, 2 Kg) to all products in Firestore. Continue?")) return;
    setIsSyncing(true);
    setAllProducts(null);
    try {
      const { migrateWeights } = await import("@/utils/migrateWeights");
      const success = await migrateWeights();
      if (success) {
        alert("Weights migrated successfully!");
        await refreshProducts();
        fetchProducts();
      }
    } catch (error) {
      console.error("Migration error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
      console.warn("Firebase not configured, performing local delete.");
      if (typeof window !== 'undefined') {
        const currentList = (window as any)._adminProducts || Array.from(staticProducts);
        const updatedList = currentList.filter((p: any) => p.id !== id && p.id.toString() !== id);
        (window as any)._adminProducts = updatedList;
        window.dispatchEvent(new Event('admin_products_updated'));
      }
      setShowDeleteConfirm(null);
      await refreshProducts();
      fetchProducts();
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', id));
      setShowDeleteConfirm(null);
      await refreshProducts();
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product, attempting local fallback:", error);
      if (typeof window !== 'undefined') {
        const currentList = (window as any)._adminProducts || Array.from(staticProducts);
        const updatedList = currentList.filter((p: any) => p.id !== id && p.id.toString() !== id);
        (window as any)._adminProducts = updatedList;
        window.dispatchEvent(new Event('admin_products_updated'));
      }
      setShowDeleteConfirm(null);
      await refreshProducts();
      fetchProducts();
    }
  };

  const filteredProducts = useMemo(() => {
    const isFiltering = searchTerm || categoryFilter !== 'All' || statusFilter !== 'All';
    // If we're filtering and have the full catalog, use that; otherwise use paginated list
    const sourceProducts = (isFiltering && allProducts) ? allProducts : products;

    return sourceProducts.filter(p => {
      const name = p.name || '';
      const category = p.category || '';
      const status = p.status || 'active';

      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || category === categoryFilter;
      const matchesStatus = statusFilter === 'All' ||
                           (statusFilter === 'Active' && status !== 'inactive') ||
                           (statusFilter === 'Inactive' && status === 'inactive');

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, allProducts, searchTerm, categoryFilter, statusFilter]);

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6 sm:space-y-8 animate-fade-up pb-24 max-w-7xl mx-auto">
      {/* Header Actions Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">Product Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your bakery inventory and catalog.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Dropdown for More Actions */}
          <div className="relative w-full sm:w-auto z-30">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-chocolate px-4 py-3 rounded-2xl font-bold shadow-sm hover:bg-gray-50 transition-all text-xs h-11 min-h-[44px] w-full sm:w-auto"
            >
              <span>More Actions</span>
              <ChevronDown size={16} className={`transition-transform duration-200 shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleSeedCategories();
                    }}
                    disabled={isSyncing}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-xs font-bold text-chocolate transition-colors disabled:opacity-50 h-11"
                  >
                    <RefreshCcw size={16} className="text-indigo-500 shrink-0" />
                    <span>Set Up Categories</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleMigrateWeights();
                    }}
                    disabled={isSyncing}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-xs font-bold text-chocolate transition-colors disabled:opacity-50 h-11"
                  >
                    <RefreshCcw size={16} className="text-blue-500 shrink-0" />
                    <span>Configure Weight System</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleSyncCatalog();
                    }}
                    disabled={isSyncing}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-xs font-bold text-chocolate transition-colors disabled:opacity-50 h-11"
                  >
                    <Package size={16} className="text-amber-500 shrink-0" />
                    <span>Sync Default Catalog</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Add New Product CTA */}
          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsFormOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-rose-deep text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown transition-all w-full sm:w-auto h-11 min-h-[44px]"
          >
            <Plus size={20} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Search & Filters Section */}
      <div className="bg-white p-4 sm:p-6 rounded-[28px] sm:rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 sm:gap-6">
        {/* Search Input - Full width on mobile/tablet, flexible on desktop */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm h-11 min-h-[44px]"
          />
        </div>

        {/* Filters Group - Full width & vertical stacking on mobile, flex row on tablet/desktop */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex flex-col items-stretch gap-1 w-full sm:w-auto">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none hidden md:inline mb-1">Category</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gray-50 border-none text-xs font-bold text-chocolate outline-none cursor-pointer h-11 min-h-[44px] w-full md:w-48"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col items-stretch gap-1 w-full sm:w-auto">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none hidden md:inline mb-1">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gray-50 border-none text-xs font-bold text-chocolate outline-none cursor-pointer h-11 min-h-[44px] w-full md:w-40"
            >
              <option value="All">All Status</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Product Table (rendered on md screens and larger) */}
      {!isMobile && (
        <div className="hidden md:block bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Product</th>
                  <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-center">Category</th>
                  <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-center">Price</th>
                  <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-center">Badges</th>
                  <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-center">Stock</th>
                  <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(loading && products.length === 0) || ((searchTerm || categoryFilter !== 'All' || statusFilter !== 'All') && isSearchingAll && filteredProducts.length === 0) ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-24 text-center">
                      <Loader2 className="animate-spin mx-auto text-rose-deep mb-4" size={40} />
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                        {(searchTerm || categoryFilter !== 'All' || statusFilter !== 'All') ? 'Fetching filtered results...' : 'Loading Catalog...'}
                      </p>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-24 text-center">
                      <Package className="mx-auto text-gray-100 mb-4" size={64} />
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No products found</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className={`hover:bg-gray-50/50 transition-colors group ${p.status === 'inactive' ? 'opacity-60' : ''}`}>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-5">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
                            <Image src={p.img} alt={p.name} fill className="object-cover" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-chocolate text-sm leading-tight">{p.name}</span>
                            <span className="text-[10px] text-gray-400 mt-1 font-medium">{p.flavor || 'Standard Flavor'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-center">
                        <span className="px-3 py-1 rounded-full bg-cream-dark text-rose-deep text-[10px] font-black uppercase tracking-widest border border-rose/5">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-center">
                        <div className="flex flex-col">
                          <span className="font-black text-chocolate text-sm">₹{p.price}</span>
                          {p.oldPrice && <span className="text-[10px] text-gray-400 line-through">₹{p.oldPrice}</span>}
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {p.isFeatured && <Star size={16} className="text-amber-400 fill-amber-400" />}
                          {p.isBestSeller && <TrendingUp size={16} className="text-rose-deep" />}
                          {p.isNewArrival && <Sparkles size={16} className="text-blue-400" />}
                        </div>
                      </td>
                      <td className="px-8 py-4 text-center">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${p.inStock !== false ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {p.inStock !== false ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${p.status === 'inactive' ? 'bg-gray-300' : 'bg-green-500'}`}></div>
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{p.status === 'inactive' ? 'Hidden' : 'Live'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(p);
                              setIsFormOpen(true);
                            }}
                            className="p-2.5 text-gray-400 hover:text-rose-deep hover:bg-cream-dark rounded-xl transition-all"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(p.id)}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile Product Cards (rendered on screens smaller than md) */}
      {isMobile && (
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {((loading && products.length === 0) || ((searchTerm || categoryFilter !== 'All' || statusFilter !== 'All') && isSearchingAll && filteredProducts.length === 0)) ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-rose-deep mb-4" size={40} />
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                {(searchTerm || categoryFilter !== 'All' || statusFilter !== 'All') ? 'Fetching filtered results...' : 'Loading Catalog...'}
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center">
              <Package className="mx-auto text-gray-200 mb-4" size={64} />
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No products found</p>
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className={`bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between transition-opacity ${p.status === 'inactive' ? 'opacity-70' : ''}`}
              >
                {/* Product Info Section */}
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-gray-100 bg-gray-50 shadow-inner">
                    <Image src={p.img} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-chocolate text-base truncate" title={p.name}>{p.name}</h3>
                      <p className="text-[11px] text-gray-400 mt-0.5 truncate">{p.flavor || 'Standard Flavor'}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cream-dark text-rose-deep text-[9px] font-black uppercase tracking-wider border border-rose/5">
                        {p.category}
                      </span>
                      <div className="flex items-center gap-1">
                        {p.isFeatured && <Star size={13} className="text-amber-400 fill-amber-400 shrink-0" />}
                        {p.isBestSeller && <TrendingUp size={13} className="text-rose-deep shrink-0" />}
                        {p.isNewArrival && <Sparkles size={13} className="text-blue-400 shrink-0" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price, Stock, Live Status Row */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-50 text-xs">
                  <div>
                    <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider mb-0.5">Price</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-black text-chocolate text-sm">₹{p.price}</span>
                      {p.oldPrice && <span className="text-[10px] text-gray-400 line-through">₹{p.oldPrice}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider mb-0.5">Stock & Status</span>
                    <div className="flex items-center justify-end gap-2 mt-0.5">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${p.inStock !== false ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {p.inStock !== false ? 'In Stock' : 'Out'}
                      </span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${p.status === 'inactive' ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                        {p.status === 'inactive' ? 'Draft' : 'Live'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons with 44px min-height */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(p);
                      setIsFormOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-chocolate h-11 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
                  >
                    <Edit2 size={15} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(p.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 h-11 rounded-xl text-xs font-bold transition-all border border-red-100 active:scale-[0.98]"
                  >
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-chocolate/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl text-center space-y-6 animate-fade-up">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-chocolate">Delete Product?</h3>
              <p className="text-gray-500 text-sm font-medium">This action cannot be undone. All data for this product will be permanently removed.</p>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 bg-white border border-gray-200 transition-all text-sm h-11 min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all text-sm h-11 min-h-[44px]"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {hasMore && !searchTerm && categoryFilter === 'All' && statusFilter === 'All' && (
        <div className="flex justify-center mt-8">
          <button
            disabled={loading}
            onClick={() => fetchProducts(true)}
            className="px-8 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-chocolate hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 h-11 min-h-[44px]"
          >
            {loading && products.length > 0 && <Loader2 className="animate-spin" size={16} />}
            {loading && products.length > 0 ? 'Loading...' : 'Load More Products'}
          </button>
        </div>
      )}

      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => fetchProducts()}
        />
      )}
    </div>
  );
};

export default AdminProducts;
