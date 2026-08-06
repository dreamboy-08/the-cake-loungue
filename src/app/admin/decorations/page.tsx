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
  writeBatch
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
  ChevronDown,
  Filter,
  Eye,
  EyeOff,
  FolderInput,
  Tag,
  DollarSign
} from 'lucide-react';
import Image from 'next/image';
import DecorationProductForm from '@/components/admin/DecorationProductForm';

const defaultDecorationsList = [
  {
    id: 'dec_1',
    name: 'Party Poppers (Premium)',
    category: 'Party Essentials',
    brand: 'Celebrations Co.',
    shortDescription: 'Metallic confetti party popper for birthdays & anniversaries.',
    fullDescription: 'Make your party pop with these safe, premium quality spring-loaded party poppers filled with shiny golden & silver metallic foil confetti.',
    images: [{ url: '/images/products/placeholder.jpg', displayOrder: 1, altText: 'Party Popper' }],
    thumbnailImage: '/images/products/placeholder.jpg',
    price: 99,
    sku: 'PP-PREM',
    stockQuantity: 150,
    reservedStock: 2,
    soldQuantity: 45,
    lowStockWarning: 15,
    status: 'Active',
    sortOrder: 1,
    tags: ['birthday', 'party', 'popper'],
    visibility: { showOnHomepage: true, showInProductPageSuggestions: true, showInCartSuggestions: true, showInCheckoutPage: true },
    recommendations: { recommendWithCakes: true, recommendWithPastries: false },
    upsell: { frequentlyBoughtTogether: true }
  },
  {
    id: 'dec_2',
    name: 'Sparkle Candles (Pack of 5)',
    category: 'Candles',
    brand: 'GlowLight',
    shortDescription: 'Amazing sparkling candles to light up celebrations.',
    fullDescription: 'Premium indoor-safe cold pyro sparkler candles that burn with beautiful silver sparks for up to 30 seconds.',
    images: [{ url: '/images/products/placeholder.jpg', displayOrder: 1, altText: 'Sparkle Candles' }],
    thumbnailImage: '/images/products/placeholder.jpg',
    price: 149,
    sku: 'SPK-CAND',
    stockQuantity: 80,
    reservedStock: 0,
    soldQuantity: 120,
    lowStockWarning: 20,
    status: 'Active',
    sortOrder: 2,
    tags: ['sparkle', 'candles', 'celebration'],
    visibility: { showOnHomepage: true, showInProductPageSuggestions: true, showInCartSuggestions: true, showInCheckoutPage: true },
    recommendations: { recommendWithCakes: true, recommendWithPastries: true },
    upsell: { frequentlyBoughtTogether: true }
  },
  {
    id: 'dec_3',
    name: 'Spiral Candles (Pack of 10)',
    category: 'Candles',
    brand: 'GlowLight',
    shortDescription: 'Colorful spiral birthday candles.',
    fullDescription: 'Premium wax colorful candles in beautiful spiral shapes with matching holders.',
    images: [{ url: '/images/products/placeholder.jpg', displayOrder: 1, altText: 'Spiral Candles' }],
    thumbnailImage: '/images/products/placeholder.jpg',
    price: 49,
    sku: 'SPL-CAND',
    stockQuantity: 200,
    reservedStock: 5,
    soldQuantity: 300,
    lowStockWarning: 30,
    status: 'Active',
    sortOrder: 3,
    tags: ['candles', 'spiral', 'birthday'],
    visibility: { showOnHomepage: false, showInProductPageSuggestions: true, showInCartSuggestions: true, showInCheckoutPage: true },
    recommendations: { recommendWithCakes: true },
    upsell: { frequentlyBoughtTogether: true }
  },
  {
    id: 'dec_4',
    name: 'Birthday Girl Sash',
    category: 'Birthday Accessories',
    brand: 'PartyVibe',
    shortDescription: 'Premium glitter satin sash for birthday girl.',
    fullDescription: 'High quality pink glitter satin sash with bold gold letters "Birthday Girl". Perfect fit with adjustable clip.',
    images: [{ url: '/images/products/placeholder.jpg', displayOrder: 1, altText: 'Birthday Girl Sash' }],
    thumbnailImage: '/images/products/placeholder.jpg',
    price: 199,
    sku: 'SSH-BGIRL',
    stockQuantity: 40,
    reservedStock: 1,
    soldQuantity: 15,
    lowStockWarning: 5,
    status: 'Active',
    sortOrder: 4,
    tags: ['sash', 'birthday', 'girl'],
    visibility: { showOnHomepage: true, showInProductPageSuggestions: true, showInCartSuggestions: false, showInCheckoutPage: false },
    recommendations: { recommendWithCakes: true },
    upsell: { frequentlyBoughtTogether: false }
  },
  {
    id: 'dec_5',
    name: 'Birthday Crown',
    category: 'Birthday Accessories',
    brand: 'PartyVibe',
    shortDescription: 'Elegant golden crown for birthdays.',
    fullDescription: 'Comfortable, shining golden plastic crown decorated with jewels for kids & adults alike.',
    images: [{ url: '/images/products/placeholder.jpg', displayOrder: 1, altText: 'Birthday Crown' }],
    thumbnailImage: '/images/products/placeholder.jpg',
    price: 249,
    sku: 'CRN-BDAY',
    stockQuantity: 25,
    reservedStock: 0,
    soldQuantity: 8,
    lowStockWarning: 6,
    status: 'Active',
    sortOrder: 5,
    tags: ['crown', 'birthday', 'king', 'queen'],
    visibility: { showOnHomepage: true, showInProductPageSuggestions: true, showInCartSuggestions: false, showInCheckoutPage: false },
    recommendations: { recommendWithCakes: true },
    upsell: { frequentlyBoughtTogether: false }
  },
  {
    id: 'dec_6',
    name: 'Birthday Tiara',
    category: 'Birthday Accessories',
    brand: 'PartyVibe',
    shortDescription: 'Shining diamond tiara accessory.',
    fullDescription: 'Beautiful metal rhinestone tiara with comb ends to fit securely on hair. Perfect for birthday girls.',
    images: [{ url: '/images/products/placeholder.jpg', displayOrder: 1, altText: 'Birthday Tiara' }],
    thumbnailImage: '/images/products/placeholder.jpg',
    price: 299,
    sku: 'TRA-BDAY',
    stockQuantity: 5,
    reservedStock: 0,
    soldQuantity: 12,
    lowStockWarning: 3,
    status: 'Active',
    sortOrder: 6,
    tags: ['tiara', 'birthday', 'princess'],
    visibility: { showOnHomepage: true, showInProductPageSuggestions: true, showInCartSuggestions: false, showInCheckoutPage: false },
    recommendations: { recommendWithCakes: true },
    upsell: { frequentlyBoughtTogether: false }
  },
  {
    id: 'dec_7',
    name: 'Snow Spray (Premium)',
    category: 'Celebration Products',
    brand: 'FunBlast',
    shortDescription: 'Celebration artificial snow spray can.',
    fullDescription: 'Non-toxic, premium artificial snow spray can. Perfect for celebrations, weddings, and parties.',
    images: [{ url: '/images/products/placeholder.jpg', displayOrder: 1, altText: 'Snow Spray' }],
    thumbnailImage: '/images/products/placeholder.jpg',
    price: 79,
    sku: 'SNW-SPRY',
    stockQuantity: 120,
    reservedStock: 1,
    soldQuantity: 240,
    lowStockWarning: 20,
    status: 'Active',
    sortOrder: 7,
    tags: ['spray', 'snow', 'party', 'fun'],
    visibility: { showOnHomepage: false, showInProductPageSuggestions: true, showInCartSuggestions: true, showInCheckoutPage: true },
    recommendations: { recommendWithCakes: true },
    upsell: { frequentlyBoughtTogether: true }
  }
];

const AdminDecorations = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [visibilityFilter, setVisibilityFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');

  // Form & Selection
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Bulk Actions State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDropdownOpen, setIsBulkDropdownOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchDecorations = useCallback(async () => {
    setLoading(true);
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
      console.warn("Firebase not configured, loading in-memory fallback decoration products.");
      if (typeof window !== 'undefined') {
        if (!(window as any)._adminDecorations) {
          (window as any)._adminDecorations = defaultDecorationsList;
        }
        setProducts((window as any)._adminDecorations);
      }
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'decorations'));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      if (docs.length === 0) {
        setProducts(defaultDecorationsList);
      } else {
        docs.sort((a: any, b: any) => (a.sortOrder || 99) - (b.sortOrder || 99));
        setProducts(docs);
      }
    } catch (err) {
      console.error("Error loading decorations catalog from Firestore:", err);
      setProducts(defaultDecorationsList);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDecorations();
  }, [fetchDecorations]);

  useEffect(() => {
    const fetchCats = async () => {
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
        return;
      }
      try {
        const snap = await getDocs(collection(db, 'decoration_categories'));
        setCategories(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCats();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
        const currentList = (window as any)._adminDecorations || [];
        const updated = currentList.filter((p: any) => p.id !== id);
        (window as any)._adminDecorations = updated;
      } else {
        await deleteDoc(doc(db, 'decorations', id));
      }
      setShowDeleteConfirm(null);
      setSelectedIds(prev => prev.filter(item => item !== id));
      fetchDecorations();
    } catch (error) {
      console.error("Error deleting decoration item:", error);
    }
  };

  // Bulk Operations Helper
  const handleBulkAction = async (action: string, payload?: any) => {
    if (selectedIds.length === 0) return;
    setLoading(true);

    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
        let currentList = (window as any)._adminDecorations || [];
        if (action === 'delete') {
          currentList = currentList.filter((p: any) => !selectedIds.includes(p.id));
        } else {
          currentList = currentList.map((p: any) => {
            if (!selectedIds.includes(p.id)) return p;
            let updated = { ...p };
            if (action === 'hide') {
              updated.status = 'Draft';
              updated.visibility = { ...p.visibility, hideEverywhere: true };
            } else if (action === 'publish') {
              updated.status = 'Active';
              updated.visibility = { ...p.visibility, hideEverywhere: false };
            } else if (action === 'category' && payload) {
              updated.category = payload;
            } else if (action === 'price' && payload !== undefined) {
              updated.price = Number(payload);
            } else if (action === 'stock' && payload !== undefined) {
              updated.stockQuantity = Number(payload);
            }
            return updated;
          });
        }
        (window as any)._adminDecorations = currentList;
      } else {
        const batch = writeBatch(db);
        selectedIds.forEach(id => {
          const ref = doc(db, 'decorations', id);
          if (action === 'delete') {
            batch.delete(ref);
          } else {
            let updates: any = { updatedAt: new Date().toISOString() };
            if (action === 'hide') {
              updates.status = 'Draft';
              updates['visibility.hideEverywhere'] = true;
            } else if (action === 'publish') {
              updates.status = 'Active';
              updates['visibility.hideEverywhere'] = false;
            } else if (action === 'category' && payload) {
              updates.category = payload;
            } else if (action === 'price' && payload !== undefined) {
              updates.price = Number(payload);
            } else if (action === 'stock' && payload !== undefined) {
              updates.stockQuantity = Number(payload);
            }
            batch.update(ref, updates);
          }
        });
        await batch.commit();
      }

      alert("Bulk action completed successfully.");
      setSelectedIds([]);
      setIsBulkDropdownOpen(false);
      fetchDecorations();
    } catch (err) {
      console.error("Bulk action failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelectId = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const name = p.name || '';
      const category = p.category || '';
      const status = p.status || 'Active';
      const visibility = p.visibility || {};
      const stock = p.stockQuantity || 0;

      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = categoryFilter === 'All' || category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || status === statusFilter;

      let matchesVisibility = true;
      if (visibilityFilter === 'Homepage') matchesVisibility = visibility.showOnHomepage;
      if (visibilityFilter === 'PDP') matchesVisibility = visibility.showInProductPageSuggestions;
      if (visibilityFilter === 'Cart') matchesVisibility = visibility.showInCartSuggestions;
      if (visibilityFilter === 'Checkout') matchesVisibility = visibility.showInCheckoutPage;
      if (visibilityFilter === 'Hidden') matchesVisibility = visibility.hideEverywhere;

      let matchesStock = true;
      if (stockFilter === 'In Stock') matchesStock = stock > 0;
      if (stockFilter === 'Low Stock') matchesStock = stock <= (p.lowStockWarning || 10) && stock > 0;
      if (stockFilter === 'Out of Stock') matchesStock = stock === 0;

      return matchesSearch && matchesCategory && matchesStatus && matchesVisibility && matchesStock;
    });
  }, [products, searchTerm, categoryFilter, statusFilter, visibilityFilter, stockFilter]);

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6 sm:space-y-8 animate-fade-up pb-24 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">Deco & Party Essentials</h1>
          <p className="text-gray-500 text-sm mt-1">Redesigned decorative items CMS module. Add, edit and recommend limitless items.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Bulk Actions Button */}
          {selectedIds.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsBulkDropdownOpen(!isBulkDropdownOpen)}
                className="flex items-center justify-center gap-2 bg-rose-50 text-rose-deep border border-rose-100 px-4 py-3 rounded-2xl font-bold shadow-sm hover:bg-rose-100/50 transition-all text-xs h-11 w-full sm:w-auto"
              >
                <span>Bulk Actions ({selectedIds.length})</span>
                <ChevronDown size={14} />
              </button>
              {isBulkDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsBulkDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-40">
                    <button
                      onClick={() => handleBulkAction('publish')}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Eye size={14} className="text-green-500" /> Bulk Publish
                    </button>
                    <button
                      onClick={() => handleBulkAction('hide')}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <EyeOff size={14} className="text-gray-400" /> Bulk Hide/Draft
                    </button>
                    <div className="border-t my-1" />
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleBulkAction('category', cat.name)}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 truncate"
                      >
                        <FolderInput size={14} className="text-blue-400 shrink-0" /> Move to {cat.name}
                      </button>
                    ))}
                    <div className="border-t my-1" />
                    <button
                      onClick={() => {
                        const price = prompt("Enter new price (₹):");
                        if (price && !isNaN(Number(price))) handleBulkAction('price', price);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <DollarSign size={14} className="text-amber-500" /> Update Price
                    </button>
                    <button
                      onClick={() => {
                        const stock = prompt("Enter new stock quantity:");
                        if (stock && !isNaN(Number(stock))) handleBulkAction('stock', stock);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Package size={14} className="text-cyan-500" /> Update Stock
                    </button>
                    <div className="border-t my-1" />
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to delete these products?")) handleBulkAction('delete');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Bulk Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsFormOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-rose-deep text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-deep/20 hover:bg-brown transition-all w-full sm:w-auto h-11 min-h-[44px]"
          >
            <Plus size={20} />
            <span>Add Decoration</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <div className="bg-white p-6 rounded-[28px] sm:rounded-[32px] shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, category, brand or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm h-11 min-h-[44px]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Select */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gray-50 border-none text-xs font-bold text-chocolate outline-none cursor-pointer h-11 min-h-[44px]"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
            </select>

            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gray-50 border-none text-xs font-bold text-chocolate outline-none cursor-pointer h-11 min-h-[44px]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            {/* Visibility Select */}
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gray-50 border-none text-xs font-bold text-chocolate outline-none cursor-pointer h-11 min-h-[44px]"
            >
              <option value="All">All Placements</option>
              <option value="Homepage">Homepage</option>
              <option value="PDP">PDP Suggestions</option>
              <option value="Cart">Cart Suggestions</option>
              <option value="Checkout">Checkout Add-ons</option>
              <option value="Hidden">Hidden Everywhere</option>
            </select>

            {/* Stock Levels */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gray-50 border-none text-xs font-bold text-chocolate outline-none cursor-pointer h-11 min-h-[44px]"
            >
              <option value="All">All Stock Levels</option>
              <option value="In Stock">In Stock Only</option>
              <option value="Low Stock">Low Stock Warnings</option>
              <option value="Out of Stock">Out of Stock Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      {!isMobile && (
        <div className="hidden md:block bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-5 text-center w-12">
                    <input
                      type="checkbox"
                      checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                      onChange={toggleSelectAll}
                      className="rounded text-rose-deep"
                    />
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Product / Brand</th>
                  <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-center">Category</th>
                  <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-center">Price</th>
                  <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-center">Stock Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-center">Visibility</th>
                  <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-24 text-center">
                      <Loader2 className="animate-spin mx-auto text-rose-deep mb-4" size={40} />
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Loading decorations...</p>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-24 text-center">
                      <Package className="mx-auto text-gray-100 mb-4" size={64} />
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No decoration products found</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isSelected = selectedIds.includes(p.id);
                    const stock = p.stockQuantity || 0;
                    const lowStock = stock <= (p.lowStockWarning || 10);
                    return (
                      <tr key={p.id} className={`hover:bg-gray-50/50 transition-colors group ${p.status === 'Draft' ? 'opacity-60' : ''}`}>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectId(p.id)}
                            className="rounded text-rose-deep"
                          />
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-5">
                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
                              <Image src={p.thumbnailImage || p.images?.[0]?.url || "/images/products/placeholder.jpg"} alt={p.name} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-chocolate text-sm leading-tight">{p.name}</span>
                              <span className="text-[10px] text-gray-400 mt-1 font-medium">{p.brand || 'No Brand'} • SKU: {p.sku}</span>
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
                            {p.discountPrice && <span className="text-[10px] text-gray-400 line-through">₹{p.discountPrice}</span>}
                          </div>
                        </td>
                        <td className="px-8 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${lowStock ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                              {stock} in stock
                            </span>
                            <span className="text-[9px] text-gray-400 mt-1 font-bold">Sold: {p.soldQuantity || 0} • Res: {p.reservedStock || 0}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex flex-wrap justify-center gap-1 max-w-[150px] mx-auto">
                            {p.visibility?.showOnHomepage && <span className="text-[8px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded font-black uppercase">Home</span>}
                            {p.visibility?.showInProductPageSuggestions && <span className="text-[8px] bg-purple-50 text-purple-600 px-1 py-0.5 rounded font-black uppercase">PDP</span>}
                            {p.visibility?.showInCartSuggestions && <span className="text-[8px] bg-amber-50 text-amber-600 px-1 py-0.5 rounded font-black uppercase">Cart</span>}
                            {p.visibility?.showInCheckoutPage && <span className="text-[8px] bg-green-50 text-green-600 px-1 py-0.5 rounded font-black uppercase font-bold">Checkout</span>}
                          </div>
                        </td>
                        <td className="px-8 py-4 text-center">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${p.status === 'Active' ? 'bg-green-100 text-green-700' : p.status === 'Draft' ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-700'}`}>
                            {p.status}
                          </span>
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile View */}
      {isMobile && (
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {loading && products.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-rose-deep mb-4" size={40} />
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Loading decoration items...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center">
              <Package className="mx-auto text-gray-200 mb-4" size={64} />
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No decoration items found</p>
            </div>
          ) : (
            filteredProducts.map((p) => {
              const stock = p.stockQuantity || 0;
              const lowStock = stock <= (p.lowStockWarning || 10);
              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between transition-opacity ${p.status === 'Draft' ? 'opacity-70' : ''}`}
                >
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-gray-100 bg-gray-50 shadow-inner">
                      <Image src={p.thumbnailImage || p.images?.[0]?.url || "/images/products/placeholder.jpg"} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-chocolate text-base truncate" title={p.name}>{p.name}</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">{p.brand || 'No Brand'} • SKU: {p.sku}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-cream-dark text-rose-deep text-[9px] font-black uppercase tracking-wider border border-rose/5">
                          {p.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-50 text-xs">
                    <div>
                      <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider mb-0.5">Price</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-black text-chocolate text-sm">₹{p.price}</span>
                        {p.discountPrice && <span className="text-[10px] text-gray-400 line-through">₹{p.discountPrice}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider mb-0.5">Stock & Status</span>
                      <div className="flex items-center justify-end gap-2 mt-0.5">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${lowStock ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          {stock} Items
                        </span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${p.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  </div>

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
              );
            })
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
              <h3 className="text-2xl font-bold text-chocolate">Delete Decoration?</h3>
              <p className="text-gray-500 text-sm font-medium">This action cannot be undone. This decorative product will be permanently removed.</p>
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

      {isFormOpen && (
        <DecorationProductForm
          product={selectedProduct}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => fetchDecorations()}
        />
      )}
    </div>
  );
};

export default AdminDecorations;
