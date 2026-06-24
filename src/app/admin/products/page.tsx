"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/utils/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  MoreVertical,
  Filter,
  Package,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import ProductForm from '@/components/admin/ProductForm';

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncCatalog = async () => {
    if (!confirm("This will restore the entire product catalog from static constants. Continue?")) return;
    setIsSyncing(true);
    try {
      const { recoverCatalog } = await import("@/utils/recoverCatalog");
      const success = await recoverCatalog();
      if (success) {
        alert("Catalog restored successfully!");
        fetchProducts();
      } else {
        alert("Failed to restore catalog.");
      }
    } catch (error) {
      console.error("Sync error:", error);
      alert("An error occurred during sync.");
    } finally {
      setIsSyncing(false);
    }
  };


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-chocolate">Product Management</h1>
          <p className="text-gray-500 mt-1">Manage your bakery inventory and catalog.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSyncCatalog}
            disabled={isSyncing}
            className="flex items-center justify-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-600 hover:-translate-y-0.5 transition-all w-full md:w-auto disabled:opacity-50"
          >
            {isSyncing ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Package size={20} />
            )}
            <span>Sync Catalog</span>
          </button>
          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsFormOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-rose-deep text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown hover:-translate-y-0.5 transition-all w-full md:w-auto"
          >
            <Plus size={20} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
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
        <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gray-50 text-gray-500 font-medium hover:bg-gray-100 transition-all">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-deep"></div>
                      <p className="text-sm text-gray-400 font-medium">Loading products...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Package className="text-gray-200" size={48} />
                      <p className="text-sm text-gray-400 font-medium">No products found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm bg-gray-50">
                          <Image
                            src={p.img}
                            alt={p.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-bold text-chocolate text-sm truncate max-w-[200px]">{p.name}</span>
                          <span className="text-xs text-gray-400 truncate">{p.flavor}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-rose/5 text-rose-deep text-[11px] font-bold uppercase tracking-wider border border-rose/10">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-chocolate text-sm">₹{p.price}</span>
                        {p.oldPrice && <span className="text-xs text-gray-400 line-through">₹{p.oldPrice}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs font-medium text-gray-500">{p.tag || 'In Stock'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setIsFormOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-rose-deep hover:bg-rose/10 rounded-lg transition-all"
                          title="Edit Product"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(p.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Product"
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-6 animate-fade-up">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-chocolate">Delete Product?</h3>
              <p className="text-gray-500 text-sm">This action cannot be undone. All data for this product will be permanently removed.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          onClose={() => setIsFormOpen(false)}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
};

export default AdminProducts;
