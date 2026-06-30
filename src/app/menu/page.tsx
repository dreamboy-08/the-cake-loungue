"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { products, Product } from '@/constants/products';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft, Loader2 } from 'lucide-react';
import SearchBar from '@/components/shop/SearchBar';
import BackButton from '@/components/BackButton';
import { filterProducts } from '@/utils/filterProducts';
import { db } from '@/utils/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'categories'),
      where('active', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // Fallback to static if Firestore is empty
        setDynamicCategories(Array.from(new Set(products.map(p => p.category))));
      } else {
        const cats = snapshot.docs.map(doc => doc.data().name);
        setDynamicCategories(cats);
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching menu categories:", err);
      setDynamicCategories(Array.from(new Set(products.map(p => p.category))));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = ['All', ...dynamicCategories];

  const filteredProducts = useMemo(() => {
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
              onClick={() => setActiveCategory('All')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-chocolate text-white hover:bg-brown transition-all duration-300 shadow-md group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Show All Categories
            </button>
          )}
          {categories
            .filter(cat => activeCategory === 'All' || cat === activeCategory)
            .map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border-none cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-rose-deep text-white shadow-md'
                    : 'bg-cream-dark text-brown-dark hover:bg-cream-dark'
                }`}
              >
                {cat} {cat !== 'All' && `(${products.filter(p => p.category === cat).length})`}
              </button>
            ))}
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

export default MenuPage;
