"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/utils/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
  getCountFromServer,
  where,
  onSnapshot,
  updateDoc
} from 'firebase/firestore';
import {
  Plus,
  Edit2,
  Trash2,
  Tags,
  AlertCircle,
  Loader2,
  Package,
  Eye,
  EyeOff,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import CategoryForm from '@/components/admin/CategoryForm';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Status toggle states
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState<{id: string, name: string, active: boolean} | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'categories'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedCategories = snapshot.docs.map(doc => ({ ...(doc.data() as any), id: doc.id }));
      setCategories(fetchedCategories);

      // Fetch product counts for each category
      const counts: Record<string, number> = {};
      try {
        await Promise.all(fetchedCategories.map(async (cat) => {
          const qCount = query(collection(db, 'products'), where('category', '==', cat.name));
          const countSnapshot = await getCountFromServer(qCount);
          counts[cat.name] = countSnapshot.data().count;
        }));
        setProductCounts(counts);
      } catch (err) {
        console.error("Error fetching product counts:", err);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to categories:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      setShowDeleteConfirm(null);
      showToast("Category deleted successfully.");
    } catch (error) {
      console.error("Error deleting category:", error);
      showToast("Failed to delete category.", "error");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setStatusUpdating(id);
    try {
      await updateDoc(doc(db, 'categories', id), {
        active: !currentStatus,
        updatedAt: new Date().toISOString()
      });
      showToast(`Category is now ${!currentStatus ? 'Live' : 'Hidden'}.`);
    } catch (error) {
      console.error("Error toggling category status:", error);
      showToast("Failed to update status.", "error");
    } finally {
      setStatusUpdating(null);
      setShowStatusConfirm(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-up pb-12">
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-chocolate">Category Management</h1>
          <p className="text-gray-500 mt-1">Organize your products into logical collections.</p>
        </div>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-rose-deep text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown transition-all w-full md:w-auto"
        >
          <Plus size={20} />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading && categories.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-rose-deep" size={40} />
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center gap-4 bg-white rounded-[40px] border border-dashed border-gray-200">
            <Tags className="text-gray-100" size={64} />
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">No categories created yet.</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className={`bg-white rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden flex flex-col ${category.active === false ? 'opacity-60' : ''}`}>
              <div className="relative h-48 bg-gray-50 overflow-hidden">
                {category.image ? (
                  <Image src={category.image} alt={category.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStatusConfirm({ id: category.id, name: category.name, active: category.active !== false });
                    }}
                    disabled={statusUpdating === category.id}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 ${
                      category.active === false ? 'bg-black/20 text-white hover:bg-black/40' : 'bg-green-500/80 text-white hover:bg-green-600/90'
                    } ${statusUpdating === category.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {statusUpdating === category.id ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      category.active === false ? <EyeOff size={10} /> : <Eye size={10} />
                    )}
                    {category.active === false ? 'Hidden' : 'Live'}
                  </button>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-chocolate mb-1">{category.name}</h3>
                    <p className="text-[10px] text-rose-deep font-black uppercase tracking-widest">/{category.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsFormOpen(true);
                      }}
                      className="p-2.5 text-gray-400 hover:text-rose-deep hover:bg-cream-dark rounded-xl transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(category.id)}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1 italic">
                  &quot;{category.description || 'No description provided.'}&quot;
                </p>

                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-gray-400">
                      <Package size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">{productCounts[category.name] || 0} Products</span>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-cream-dark flex items-center justify-center text-rose-deep">
                      <Plus size={14} />
                   </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isFormOpen && (
        <CategoryForm
          category={selectedCategory}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {}}
        />
      )}

      {showStatusConfirm && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-chocolate/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl text-center space-y-6 animate-fade-up">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${showStatusConfirm.active ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-500'}`}>
              {showStatusConfirm.active ? <EyeOff size={40} /> : <Eye size={40} />}
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-chocolate">{showStatusConfirm.active ? 'Hide Category?' : 'Go Live?'}</h3>
              <p className="text-gray-500 text-sm font-medium">
                {showStatusConfirm.active
                  ? `Category "${showStatusConfirm.name}" will be hidden from the shop menu.`
                  : `Category "${showStatusConfirm.name}" will be visible to all customers.`}
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowStatusConfirm(null)}
                className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggleActive(showStatusConfirm.id, showStatusConfirm.active)}
                className={`flex-1 px-6 py-4 text-white rounded-2xl font-bold shadow-xl transition-all text-sm ${
                  showStatusConfirm.active
                    ? 'bg-gray-500 shadow-gray-500/20 hover:bg-gray-600'
                    : 'bg-green-500 shadow-green-500/20 hover:bg-green-600'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-chocolate/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl text-center space-y-6 animate-fade-up">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-chocolate">Delete Category?</h3>
              <p className="text-gray-500 text-sm font-medium">Deleting this category will not delete its products, but they will no longer be associated with it.</p>
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

    </div>
  );
};

export default AdminCategories;
