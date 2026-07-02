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

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase is not configured (common in dev/test), fallback immediately to static
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
      console.warn("Firebase not configured, falling back to static categories.");
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
        // Fallback to static if Firestore is empty
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

  // Update active category based on URL parameter
  useEffect(() => {
    if (!loading && dynamicCategories.length > 0) {
      if (!categoryParam) {
        setActiveCategory('All');
      } else {
        const matchedCategory = dynamicCategories.find(cat => toSlug(cat) === categoryParam);
        if (matchedCategory) {
          setActiveCategory(matchedCategory);
        } else {
          // If no match found for the slug, set to a non-existent state to show empty results
          setActiveCategory(`INVALID_${categoryParam}`);
        }
      }
    }
  }, [categoryParam, dynamicCategories, loading]);

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
    const categoryFiltered = products.filter(product =>
      activeCategory === 'All' || product.category === activeCategory
    );
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
          {loading ? (
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
                {cat} {cat !== 'All' && `(${products.filter(p => p.category === cat).length})`}
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
