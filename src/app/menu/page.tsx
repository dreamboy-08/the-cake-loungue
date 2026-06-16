"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '@/constants/products';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft, Loader2 } from 'lucide-react';
import SearchBar from '@/components/shop/SearchBar';
import { filterProducts } from '@/utils/filterProducts';
import { db } from '@/utils/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const MenuPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as unknown as Product[];
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() =>
    ['All', ...Array.from(new Set(products.map(p => p.category)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const categoryFiltered = products.filter(product =>
      activeCategory === 'All' || product.category === activeCategory
    );
    return filterProducts(categoryFiltered, searchQuery);
  }, [activeCategory, searchQuery, products]);

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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-rose-deep" size={40} />
            <p className="text-text-soft font-medium">Loading our bakery collection...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 4}
              />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
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
