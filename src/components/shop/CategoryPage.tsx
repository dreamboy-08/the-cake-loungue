"use client";

import React from 'react';
import { Product } from '@/constants/products';
import ProductCard from '@/components/ProductCard';
import BackButton from '@/components/BackButton';
import { useProducts } from '@/context/ProductsContext';
import { Loader2 } from 'lucide-react';

interface CategoryPageProps {
  category: string;
  title: string;
  description: string;
  subtitle: string;
}

const CategoryPage = ({ category, title, description, subtitle }: CategoryPageProps) => {
  const { products, loading } = useProducts();
  const filteredProducts = products.filter((p) => p.category === category);

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6">
        <BackButton fallbackRoute="/menu" ariaLabel="Go back to menu" />

        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-rose font-bold text-sm uppercase tracking-widest mb-4 block animate-fade-in">
            {subtitle}
          </span>
          <h1 className="section-title text-4xl md:text-5xl lg:text-6xl mb-6">
            {title}
          </h1>
          <p className="text-text-mid text-lg md:text-xl leading-relaxed">
            {description}
          </p>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-rose-deep" size={40} />
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-text-mid font-semibold">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 xl:gap-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
