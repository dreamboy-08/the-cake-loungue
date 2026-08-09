"use client";

import React from 'react';
import { useCMS } from '@/context/CMSContext';
import { useProducts } from '@/context/ProductsContext';
import ProductCard from '../ProductCard';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';

const FeaturedProducts = () => {
  const { featuredProducts, loading: cmsLoading } = useCMS();
  const { products, loading: productsLoading } = useProducts();

  // If loading, show a premium skeleton or spinner
  if (cmsLoading || productsLoading) {
    return (
      <section id="products" className="py-20 bg-cream-dark">
        <div className="container mx-auto px-6 flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <Loader2 className="animate-spin text-rose-deep" size={32} />
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Syncing Featured Catalog...</p>
        </div>
      </section>
    );
  }

  // If section is explicitly disabled via Admin CMS Panel, hide it completely from storefront
  if (!featuredProducts || featuredProducts.enabled === false) {
    return null;
  }

  const title = featuredProducts.title || 'Featured Cakes';
  const subtitle = featuredProducts.subtitle || 'Our Bestsellers';
  const featuredIds = featuredProducts.productIds || [];

  // Map and sort products exactly following the custom display order, filtering out stale/invalid/deleted references safely
  const featured = featuredIds
    .map(id => products.find(p => p.id.toString() === id.toString()))
    .filter((p): p is typeof products[0] => p !== undefined);

  return (
    <section id="products" className="py-20 bg-cream-dark">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-3 mb-[50px]">
          <div>
            <p className="section-label">{subtitle}</p>
            <h2 className="section-title">{title}</h2>
          </div>
          <Link href="/menu" className="group text-[0.88rem] font-semibold text-rose-deep flex items-center gap-1.5 transition-all">
            View All <ArrowRight size={16} className="transition-all group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {featured.length === 0 && (
          <div className="text-center py-16 text-gray-500 italic text-sm">
            No products currently selected as featured.
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
