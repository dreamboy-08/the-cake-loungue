"use client";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { products, Product } from '@/constants/products';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft, Loader2 } from 'lucide-react';
import SearchBar from '@/components/shop/SearchBar';
import BackButton from '@/components/BackButton';
import { filterProducts } from '@/utils/filterProducts';
import { db } from '@/utils/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useSearchParams, useRouter } from 'next/navigation';
import { toSlug } from '@/utils/slug';

const MenuContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [searchQuery, setSearchQuery] = useState('');
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load categories for the tabs
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
      setDynamicCategories(Array.from(new Set(products.map(p => p.category))));
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'categories'),
      where('active', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let cats: string[] = [];
      if (snapshot.empty) {
        cats = Array.from(new Set(products.map(p => p.category)));
      } else {
        cats = snapshot.docs.map(doc => doc.data().name);
      }
      setDynamicCategories(cats);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching menu categories:", err);
      const cats = Array.from(new Set(products.map(p => p.category)));
      setDynamicCategories(cats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Derive active category name from the URL parameter for consistent state
  const activeCategory = useMemo(() => {
    if (!categoryParam) return 'All';

    // Find the category name that matches this slug from the products constant
    const matched = products.find(p => toSlug(p.category) === categoryParam);
    if (matched) return matched.category;

    // If not found in static products, check dynamic categories if they are loaded
    const matchedDynamic = dynamicCategories.find(cat => toSlug(cat) === categoryParam);
    if (matchedDynamic) return matchedDynamic;

    return `INVALID_${categoryParam}`;
  }, [categoryParam, dynamicCategories]);

  const handleCategoryChange = (cat: string) => {
    if (cat === 'All') {
      router.push('/menu');
    } else {
      router.push(`/menu?category=${toSlug(cat)}`);
    }
  };

  const categories = ['All', ...dynamicCategories];

  const filteredProducts = useMemo(() => {
    if (activeCategory.startsWith('INVALID_')) {
      return [];
    }

    const categoryFiltered = products.filter(product => {
      if (activeCategory === 'All') return true;
      // Use slug-based comparison for robustness
      return toSlug(product.category) === toSlug(activeCategory);
    });

    return filterProducts(categoryFiltered, searchQuery);
  }, [activeCategory, searchQuery]);

  return (
    <div className="pt-40 md:pt-52 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6">
        <BackButton fallbackRoute="/" />
        <section className="text-center mb-12">
          <p className="section-label">Full Bakery Menu</p>
          <h1 className="section-title text-4xl md:text-5xl mb-5">Explore Our Complete Collection</h1>
          <p className="section-sub mx-auto">Browse every cake, dessert and premium creation from our bakery catalogue — 300+ handcrafted items delivered fresh.</p>
        </section>

        {/* Search Bar */}
        <SearchBar onSearch={setSearchQuery} />

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4 justify-center mb-12 items-center min-h-[50px]">
          {loading && !categoryParam ? (
             <Loader2 className="animate-spin text-rose-deep" size={24} />
          ) : (
            <>
          {activeCategory !== 'All' && (
            <button
              onClick={() => handleCategoryChange('All')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-chocolate text-white hover:bg-brown transition-all duration-300 shadow-md group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Show All Categories
            </button>
          )}
          {categories
            .filter(cat => {
              if (activeCategory === 'All') return true;
              if (activeCategory.startsWith('INVALID_')) return false;
              // Only show the active category button when a category is selected
              return cat === activeCategory;
            })
            .map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border-none cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-rose-deep text-white shadow-md'
                    : 'bg-cream-dark text-brown-dark hover:bg-cream-dark'
                }`}
              >
                {cat} {cat !== 'All' && `(${products.filter(p => toSlug(p.category) === toSlug(cat)).length})`}
              </button>
            ))}
            {activeCategory.startsWith('INVALID_') && (
               <button
               className="inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border-none bg-rose-deep text-white shadow-md"
             >
               Unknown Category: {categoryParam}
             </button>
            )}
            </>
          )}
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 4}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-playfair font-bold text-chocolate mb-2">No cakes found</h3>
            <p className="text-text-soft">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MenuPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-rose-deep" size={48} />
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
};

export default MenuPage;
