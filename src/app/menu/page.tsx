"use client";

import React, { useState, useMemo } from 'react';
import { products, Product } from '@/constants/products';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/shop/SearchBar';
import { filterProducts } from '@/utils/filterProducts';

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    const categoryFiltered = products.filter(product =>
      activeCategory === 'All' || product.category === activeCategory
    );
    return filterProducts(categoryFiltered, searchQuery);
  }, [activeCategory, searchQuery]);

  const categoryMap = products.reduce((acc, product) => {
    const category = product.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6">
        <section className="text-center mb-12">
          <p className="section-label">Full Bakery Menu</p>
          <h1 className="section-title text-4xl md:text-5xl mb-5">Explore Our Complete Collection</h1>
          <p className="section-sub mx-auto">Browse every cake, dessert and premium creation from our bakery catalogue — 300+ handcrafted items delivered fresh.</p>
        </section>

        {/* Search Bar */}
        <SearchBar onSearch={setSearchQuery} />

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border-none cursor-pointer ${
                activeCategory === cat
                  ? 'bg-rose-deep text-white shadow-md'
                  : 'bg-rose-deep/10 text-brown-dark hover:bg-rose-deep/20'
              }`}
            >
              {cat} {cat !== 'All' && `(${products.filter(p => p.category === cat).length})`}
            </button>
          ))}
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
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
