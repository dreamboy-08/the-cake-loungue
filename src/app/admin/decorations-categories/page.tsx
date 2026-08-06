"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/utils/firebase';
import {
  collection,
  getDocs,
  doc,
  query,
  onSnapshot,
  updateDoc,
  deleteDoc
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
import DecorationCategoryForm from '@/components/admin/DecorationCategoryForm';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const defaultDecoCategories = [
  { id: 'dc1', name: 'Party Essentials', description: 'Banners, balloons, party poppers, and sprays', active: true, slug: 'party-essentials', displayOrder: 1 },
  { id: 'dc2', name: 'Candles', description: 'Spiral, sparkle, LED, and themed birthday candles', active: true, slug: 'candles', displayOrder: 2 },
  { id: 'dc3', name: 'Birthday Accessories', description: 'Sashes, crowns, tiaras, and caps', active: true, slug: 'birthday-accessories', displayOrder: 3 },
  { id: 'dc4', name: 'Cake Decorations', description: 'Toppers, knife sets, and decorative sprinkles', active: true, slug: 'cake-decorations', displayOrder: 4 },
  { id: 'dc5', name: 'Celebration Products', description: 'Foil balloons, snow sprays, and confetti', active: true, slug: 'celebration-products', displayOrder: 5 },
  { id: 'dc6', name: 'Gift Accessories', description: 'Ribbons, gift wrap, and custom message cards', active: true, slug: 'gift-accessories', displayOrder: 6 }
];

const AdminDecorationCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setLoading(true);
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
      console.warn("Firebase not configured, using default decoration categories in memory.");
      if (typeof window !== 'undefined') {
        if (!(window as any)._adminDecorationCategories) {
          (window as any)._adminDecorationCategories = defaultDecoCategories;
        }
        setCategories((window as any)._adminDecorationCategories);
      }
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'decoration_categories'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.docs.length === 0) {
        setCategories(defaultDecoCategories);
      } else {
        const fetched = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        fetched.sort((a: any, b: any) => (a.displayOrder || 99) - (b.displayOrder || 99));
        setCategories(fetched);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to decoration categories, falling back:", error);
      setCategories(defaultDecoCategories);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
        const currentList = (window as any)._adminDecorationCategories || [];
        const updated = currentList.filter((c: any) => c.id !== id);
        (window as any)._adminDecorationCategories = updated;
        setCategories(updated);
      } else {
        await deleteDoc(doc(db, 'decoration_categories', id));
      }
      setShowDeleteConfirm(null);
      showToast("Decoration Category deleted successfully.");
    } catch (error) {
      console.error("Error deleting category:", error);
      showToast("Failed to delete category.", "error");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setStatusUpdating(id);
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
        const currentList = (window as any)._adminDecorationCategories || [];
        const updated = currentList.map((c: any) => c.id === id ? { ...c, active: !currentStatus } : c);
        (window as any)._adminDecorationCategories = updated;
        setCategories(updated);
      } else {
        await updateDoc(doc(db, 'decoration_categories', id), {
          active: !currentStatus,
          updatedAt: new Date().toISOString()
        });
      }
      showToast(`Category is now ${!currentStatus ? 'Live' : 'Hidden'}`);
    } catch (error) {
      console.error("Error toggling category status:", error);
      showToast("Failed to update status.", "error");
    } finally {
      setStatusUpdating(null);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6 sm:space-y-8 animate-fade-up pb-24 max-w-7xl mx-auto">
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
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">Deco Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Organize candles, balloons, party props and essential cake decorative collections.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setIsFormOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-rose-deep text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown transition-all w-full sm:w-auto h-11 min-h-[44px]"
          >
            <Plus size={20} />
            <span>Add Deco Category</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && categories.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-rose-deep" size={40} />
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">Loading decoration categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center gap-4 bg-white rounded-[28px] sm:rounded-[32px] border border-dashed border-gray-200">
            <Tags className="text-gray-100" size={64} />
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest">No decoration categories created yet.</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className={`bg-white rounded-[28px] sm:rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden flex flex-col ${category.active === false ? 'opacity-60' : ''}`}>
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
                      handleToggleActive(category.id, category.active !== false);
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

              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <h3 className="text-xl font-bold text-chocolate">{category.name}</h3>
                       {category.displayOrder > 0 && (
                         <span className="px-2 py-0.5 bg-rose/10 text-rose-deep text-[9px] font-black rounded-full border border-rose/20">
                           #{category.displayOrder}
                         </span>
                       )}
                    </div>
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
              </div>
            </div>
          ))
        )}
      </div>

      {isFormOpen && (
        <DecorationCategoryForm
          category={selectedCategory}
          allCategories={categories}
          onClose={() => setIsFormOpen(false)}
          onSuccess={(message) => {
            showToast(message);
            if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
              setCategories((window as any)._adminDecorationCategories || []);
            }
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-chocolate/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] sm:rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center space-y-6 animate-fade-up">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-chocolate">Delete Deco Category?</h3>
              <p className="text-gray-500 text-sm font-medium">Are you sure you want to delete this decorative product category?</p>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all text-sm h-11 min-h-[44px] bg-white border border-gray-200"
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

    </div>
  );
};

export default AdminDecorationCategories;
