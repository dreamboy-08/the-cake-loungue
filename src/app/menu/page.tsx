"use client";

import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft, Loader2 } from 'lucide-react';
import SearchBar from '@/components/shop/SearchBar';
import { filterProducts } from '@/utils/filterProducts';
import { getProducts, getCategories } from '@/utils/productService';
import { Product } from '@/constants/products';

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsData as any);
        const catNames = ['All', ...categoriesData.map((c: any) => c.name)];
        setCategories(catNames);
      } catch (error) {
        console.error("Error loading menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    const categoryFiltered = products.filter(product =>
      activeCategory === 'All' || product.category === activeCategory
    );
    return filterProducts(categoryFiltered, searchQuery);
  }, [activeCategory, searchQuery, products]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 bg-cream min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-rose-deep mb-4" size={48} />
        <p className="text-chocolate font-bold">Loading Our Menu...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6">
        <section className="text-center mb-12">
          <p className="section-label">Full Bakery Menu</p>
          <h1 className="section-title text-4xl md:text-5xl mb-5">Explore Our Complete Collection</h1>
          <p className="section-sub mx-auto">Browse every cake, dessert and premium creation from our bakery catalogue — handcrafted items delivered fresh.</p>
        </section>

        {/* Search Bar */}
        <SearchBar onSearch={setSearchQuery} />

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4 justify-center mb-12 items-center">
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
                    : 'bg-rose-deep/10 text-brown-dark hover:bg-rose-deep/20'
                }`}
              >
                {cat} {cat !== 'All' && `(${products.filter(p => p.category === cat).length})`}
              </button>
            ))}
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
