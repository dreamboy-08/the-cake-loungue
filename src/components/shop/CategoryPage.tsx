"use client";

import React, { useState, useEffect } from 'react';
import { Product } from '@/constants/products';
import ProductCard from '@/components/ProductCard';
import BackButton from '@/components/BackButton';
import { useProducts } from '@/context/ProductsContext';
import { useCMS } from '@/context/CMSContext';
import { Loader2, Folder } from 'lucide-react';
import Image from 'next/image';

interface CategoryPageProps {
  category: string;
  title: string;
  description: string;
  subtitle: string;
}

const CategoryPage = ({ category, title, description, subtitle }: CategoryPageProps) => {
  const { products, loading: productsLoading } = useProducts();
  const { collections, loading: cmsLoading } = useCMS();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Find the matching CMS collection
  const collection = collections.find(
    (c) =>
      c.slug === category.toLowerCase().replace(/\s+/g, '-') ||
      c.title.toLowerCase() === category.toLowerCase()
  );

  const loading = !mounted || productsLoading || cmsLoading;

  // Use CMS values if available, otherwise fall back to props
  const activeTitle = collection ? collection.title : title;
  const activeDescription = collection ? (collection.description || description) : description;

  // Respect visibility/draft state
  if (collection && !collection.enabled) {
    return (
      <div className="pt-32 pb-20 bg-cream min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 text-center max-w-xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-cream-dark rounded-full flex items-center justify-center text-rose-deep">
              <Folder size={32} />
            </div>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-chocolate mb-4">Collection Unavailable</h1>
          <p className="text-text-mid mb-8">
            The collection &ldquo;{activeTitle}&rdquo; is currently set as a draft or has been disabled by the administrator.
          </p>
          <BackButton fallbackRoute="/menu" ariaLabel="Go back to menu" />
        </div>
      </div>
    );
  }

  // Filter products by matching category
  const filteredProducts = products.filter(
    (p) =>
      p.category.toLowerCase() === category.toLowerCase() ||
      (collection && p.category.toLowerCase() === collection.title.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6">
        <BackButton fallbackRoute="/menu" ariaLabel="Go back to menu" />

        {/* Optional banner header if present in CMS */}
        {collection?.bannerImage ? (
          <div className="relative rounded-[28px] overflow-hidden bg-chocolate text-white mb-16 shadow-lg min-h-[260px] flex items-center mt-6">
            <div className="absolute inset-0 z-0">
              <Image
                src={collection.bannerImage}
                alt={activeTitle}
                fill
                priority
                className="object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate via-chocolate/60 to-transparent" />
            </div>
            <div className="relative z-10 max-w-3xl px-8 py-10 md:px-12">
              <span className="text-rose text-xs font-bold uppercase tracking-widest mb-2 block">
                {subtitle}
              </span>
              <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-3 tracking-tight">
                {activeTitle}
              </h1>
              {activeDescription && (
                <p className="text-white/80 text-sm md:text-base max-w-2xl leading-relaxed font-light">
                  {activeDescription}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center max-w-3xl mx-auto mb-16 mt-6">
            <span className="text-rose font-bold text-sm uppercase tracking-widest mb-4 block animate-fade-in">
              {subtitle}
            </span>
            <h1 className="section-title text-4xl md:text-5xl lg:text-6xl mb-6">
              {activeTitle}
            </h1>
            <p className="text-text-mid text-lg md:text-xl leading-relaxed">
              {activeDescription}
            </p>
          </div>
        )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
