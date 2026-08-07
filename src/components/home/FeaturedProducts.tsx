"use client";

import React from 'react';
import { useProducts } from '@/context/ProductsContext';
import ProductCard from '../ProductCard';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';

const FeaturedProducts = () => {
  const { products, loading } = useProducts();
  const featuredIds = [1, 2, 3, 5, 6, 7, 9, 11, 13, 17, 55, 59, 103, 114, 325, 327];

  // Try finding by numerical/string ID match, or falls back to filtering active items if custom cakes are created
  const featured = featuredIds
    .map(id => products.find(p => p.id.toString() === id.toString()))
    .filter((p): p is typeof products[0] => p !== undefined);

  return (
    <section id="products" className="py-20 bg-cream-dark">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-3 mb-[50px]">
          <div>
            <p className="section-label">Our Bestsellers</p>
            <h2 className="section-title">Featured Cakes</h2>
          </div>
          <Link href="/menu" className="group text-[0.88rem] font-semibold text-rose-deep flex items-center gap-1.5 transition-all">
            View All <ArrowRight size={16} className="transition-all group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 md:gap-10 xl:gap-12">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
