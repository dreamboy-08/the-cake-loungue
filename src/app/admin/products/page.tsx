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
  Filter,
  Package,
  Loader2,
  AlertCircle,
  RefreshCcw,
  Star,
  TrendingUp,
  Sparkles,
  EyeOff
} from 'lucide-react';
import Image from 'next/image';
import ProductForm from '@/components/admin/ProductForm';

const AdminProducts = () => {
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

  const fetchProducts = useCallback(async (isNext = false) => {
    setLoading(true);
    try {
      let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));

      if (isNext && lastDoc) {
        q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(PAGE_SIZE));
      }

      const snapshot = await getDocs(q);
      const newProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [lastDoc]);

  useEffect(() => {
    // Initial fetch only if products is empty to avoid loop if fetchProducts changes
    if (products.length === 0) {
      fetchProducts();
    }

    const unsubCats = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Error listening to categories:", error);
    });

    return () => unsubCats();
  }, [fetchProducts, products.length]);

  const handleSyncCatalog = async () => {
    if (!confirm("This will restore the entire product catalog from static constants. Continue?")) return;
    setIsSyncing(true);
    try {
      const { recoverCatalog } = await import("@/utils/recoverCatalog");
      const success = await recoverCatalog();
      if (success) alert("Catalog restored successfully!");
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleMigrateWeights = async () => {
    if (!confirm("This will add MULTIPLE weight options (0.5 Kg, 1 Kg, 2 Kg) to all products in Firestore. Continue?")) return;
    setIsSyncing(true);
    try {
      const { migrateWeights } = await import("@/utils/migrateWeights");
      const success = await migrateWeights();
      if (success) alert("Weights migrated successfully!");
    } catch (error) {
      console.error("Migration error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setShowDeleteConfirm(null);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
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
  }, [products, searchTerm, categoryFilter, statusFilter]);

  return (
    <div className="space-y-8 animate-fade-up pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-chocolate">Product Management</h1>
          <p className="text-gray-500 mt-1">Manage your bakery inventory and catalog.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleMigrateWeights}
            disabled={isSyncing}
            className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all text-xs disabled:opacity-50"
          >
            {isSyncing ? <Loader2 className="animate-spin" size={16} /> : <RefreshCcw size={16} />}
            <span>Migrate Weights</span>
          </button>
          <button
            onClick={handleSyncCatalog}
            disabled={isSyncing}
            className="flex items-center justify-center gap-2 bg-amber-500 text-white px-4 py-2.5 rounded-2xl font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all text-xs disabled:opacity-50"
          >
            {isSyncing ? <Loader2 className="animate-spin" size={16} /> : <Package size={16} />}
            <span>Sync Catalog</span>
          </button>
          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsFormOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-rose-deep text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown transition-all w-full md:w-auto"
          >
            <Plus size={20} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-gray-50 border-none text-xs font-bold text-chocolate outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-gray-50 border-none text-xs font-bold text-chocolate outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
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
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-24 text-center">
                    <Loader2 className="animate-spin mx-auto text-rose-deep mb-4" size={40} />
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Loading Catalog...</p>
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
                className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all text-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            disabled={loading}
            onClick={() => fetchProducts(true)}
            className="px-8 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-chocolate hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
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
