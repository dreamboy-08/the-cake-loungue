"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Product, products } from '@/constants/products';
import ProductCard from '@/components/ProductCard';

interface CategoryPageProps {
  category: string;
  title: string;
  description: string;
  subtitle: string;
}

const CategoryPage = ({ category, title, description, subtitle }: CategoryPageProps) => {
  const filteredProducts = products.filter((p) => p.category === category);

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-text-soft hover:text-rose-deep transition-colors mb-8 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
