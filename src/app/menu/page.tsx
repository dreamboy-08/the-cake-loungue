'use client';

import { useState, useMemo } from 'react';
import { bakeryMenu } from '@/constants/bakery-menu';
import { categories } from '@/constants';
import ProductCard from '@/components/ProductCard';
import { Search, Filter, X } from 'lucide-react';
import Image from 'next/image';

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    return bakeryMenu.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.flavor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categoryNames = ['All', ...categories.map(c => c.name)];

  return (
    <main className="min-h-screen bg-[#FDFCFB] pt-24 pb-16">
      <section className="container mx-auto px-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#4A2C2A] mb-2">Our Exquisite Menu</h1>
            <p className="text-[#8C7462]">Discover our handcrafted delicacies for every occasion</p>
          </div>

          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search for cakes, flavors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-[#E5D5C8] focus:outline-none focus:ring-2 focus:ring-[#C17E61] bg-white text-[#4A2C2A]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A68B77] w-5 h-5" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-6">
              <div>
                <h3 className="text-lg font-serif text-[#4A2C2A] mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5" /> Categories
                </h3>
                <div className="flex flex-col gap-1">
                  {categoryNames.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`text-left px-4 py-2 rounded-lg transition-all ${
                        selectedCategory === category
                          ? 'bg-[#C17E61] text-white shadow-md'
                          : 'text-[#8C7462] hover:bg-[#F5EDE7]'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            {categoryNames.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full border transition-all ${
                  selectedCategory === category
                    ? 'bg-[#C17E61] border-[#C17E61] text-white'
                    : 'bg-white border-[#E5D5C8] text-[#8C7462]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#8C7462]">
                Showing <span className="font-semibold text-[#4A2C2A]">{filteredProducts.length}</span> products
              </p>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="text-sm text-[#C17E61] hover:underline flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="bg-[#F5EDE7] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-[#A68B77]" />
                </div>
                <h3 className="text-xl font-serif text-[#4A2C2A] mb-2">No products found</h3>
                <p className="text-[#8C7462]">Try adjusting your search or filters to find what you&apos;re looking for.</p>
                <button
                  onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
                  className="mt-6 text-[#C17E61] font-semibold hover:underline"
                >
                  View all products
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
