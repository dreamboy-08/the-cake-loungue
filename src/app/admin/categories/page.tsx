"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/utils/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import {
  Plus,
  Edit2,
  Trash2,
  Tags,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown
} from 'lucide-react';
import CategoryForm from '@/components/admin/CategoryForm';
import Image from 'next/image';

const AdminCategories = () => {
  const [categories, setCategories] = useState<(any & { displayOrder?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // First try to fetch by displayOrder
      const q = query(collection(db, 'categories'), orderBy('displayOrder', 'asc'));
      const snapshot = await getDocs(q);
      let results: any[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // If none have displayOrder, fallback to name and initialize displayOrder
      if (results.length > 0 && results.every((cat: any) => cat.displayOrder === undefined)) {
        const qName = query(collection(db, 'categories'), orderBy('name'));
        const snapName = await getDocs(qName);
        results = snapName.docs.map((doc, index) => ({
          id: doc.id,
          ...doc.data(),
          displayOrder: index
        }));
      }

      setCategories(results);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      setShowDeleteConfirm(null);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories];
    const otherIndex = direction === 'up' ? index - 1 : index + 1;

    if (otherIndex < 0 || otherIndex >= newCategories.length) return;

    // Swap
    const temp = newCategories[index];
    newCategories[index] = newCategories[otherIndex];
    newCategories[otherIndex] = temp;

    // Update displayOrder
    newCategories.forEach((cat, idx) => {
      cat.displayOrder = idx;
    });

    setCategories(newCategories);

    try {
      const batch = writeBatch(db);
      newCategories.forEach((cat) => {
        const ref = doc(db, 'categories', cat.id);
        batch.update(ref, { displayOrder: cat.displayOrder });
      });
      await batch.commit();
    } catch (error) {
      console.error("Error updating category order:", error);
      fetchCategories(); // Revert
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
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
          className="flex items-center justify-center gap-2 bg-rose-deep text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown hover:-translate-y-0.5 transition-all w-full md:w-auto"
        >
          <Plus size={20} />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-rose-deep" size={32} />
            <p className="text-sm text-gray-400 font-medium">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-3">
            <Tags className="text-gray-200" size={48} />
            <p className="text-sm text-gray-400 font-medium">No categories created yet.</p>
          </div>
        ) : (
          categories.map((category, index) => (
            <div key={category.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group overflow-hidden">
              <div className="relative aspect-video w-full bg-gray-100">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <Tags size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className={`p-2 rounded-full backdrop-blur-md shadow-lg ${category.isVisible !== false ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                    {category.isVisible !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-chocolate">{category.name}</h3>
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-1 mr-2">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-chocolate disabled:opacity-20 transition-all"
                      >
                        <MoveUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === categories.length - 1}
                        className="p-1 text-gray-400 hover:text-chocolate disabled:opacity-20 transition-all"
                      >
                        <MoveDown size={14} />
                      </button>
                    </div>
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsFormOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-rose-deep hover:bg-rose/10 rounded-lg transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(category.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{category.description || 'No description provided.'}</p>
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Order: {category.displayOrder ?? index}</span>
                  <span className="text-xs font-mono text-rose-deep bg-rose/5 px-2 py-0.5 rounded">{category.slug}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-6 animate-fade-up">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-chocolate">Delete Category?</h3>
              <p className="text-gray-500 text-sm">Deleting this category will not delete its products, but they will no longer be associated with it.</p>
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
        <CategoryForm
          category={selectedCategory}
          onClose={() => setIsFormOpen(false)}
          onSuccess={fetchCategories}
        />
      )}
    </div>
  );
};

export default AdminCategories;
