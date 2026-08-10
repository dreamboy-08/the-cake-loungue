"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCMS } from '@/context/CMSContext';
import { useProducts } from '@/context/ProductsContext';
import ProductCard from '@/components/ProductCard';
import BackButton from '@/components/BackButton';
import PageWrapper from '@/components/PageWrapper';
import { toSlug } from '@/utils/slug';
import { Loader2, Folder } from 'lucide-react';

const CollectionPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const { collections, loading: cmsLoading } = useCMS();
  const { products, loading: productsLoading } = useProducts();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const collection = collections.find((c) => c.slug === slug);

  const loading = !mounted || cmsLoading || productsLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-rose-deep" size={48} />
        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading Collection...</p>
      </div>
    );
  }

  // Handle missing or disabled collection gracefully
  if (!collection || !collection.enabled) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-6 py-24 text-center max-w-xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-cream-dark rounded-full flex items-center justify-center text-rose-deep">
              <Folder size={32} />
            </div>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-chocolate mb-4">Collection Unavailable</h1>
          <p className="text-text-mid mb-8">
            This collection does not exist, has been drafted, or is currently disabled by the administrator.
          </p>
          <button
            onClick={() => router.push('/menu')}
            className="bg-chocolate hover:bg-brown text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-md"
          >
            Explore Our Menu
          </button>
        </div>
      </PageWrapper>
    );
  }

  // Filter products matching this collection's title or slug
  const matchedProducts = products.filter((p) => {
    return (
      p.category.toLowerCase() === collection.title.toLowerCase() ||
      toSlug(p.category) === collection.slug
    );
  });

  return (
    <PageWrapper>
      <div className="container mx-auto px-6 pb-20">
        <div className="mb-6">
          <BackButton fallbackRoute="/collections" ariaLabel="Go back to collections" />
        </div>

        {/* Collection Hero Header */}
        <div className="relative rounded-[28px] overflow-hidden bg-chocolate text-white mb-16 shadow-lg min-h-[320px] flex items-center">
          {collection.bannerImage && (
            <div className="absolute inset-0 z-0">
              <Image
                src={collection.bannerImage}
                alt={collection.title}
                fill
                priority
                className="object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate via-chocolate/60 to-transparent" />
            </div>
          )}

          <div className="relative z-10 max-w-4xl px-8 py-12 md:px-16 md:py-20">
            <span className="text-rose text-xs font-bold uppercase tracking-widest mb-3 block">
              Curated Milestone Collection
            </span>
            <h1 className="font-playfair text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              {collection.title}
            </h1>
            {collection.description && (
              <p className="text-white/80 text-base md:text-lg max-w-2xl leading-relaxed font-light">
                {collection.description}
              </p>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <div className="border-b border-cream-dark pb-4 mb-8 flex justify-between items-end">
            <h2 className="font-playfair text-2xl font-bold text-chocolate">
              Available Creations
            </h2>
            <span className="text-sm text-text-soft font-semibold uppercase tracking-wider">
              {matchedProducts.length} {matchedProducts.length === 1 ? 'Product' : 'Products'}
            </span>
          </div>

          {matchedProducts.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-3xl border border-cream-dark p-8">
              <p className="text-text-mid font-medium mb-4">No products currently available in this collection.</p>
              <button
                onClick={() => router.push('/menu')}
                className="text-rose-deep font-bold hover:underline inline-flex items-center gap-1"
              >
                Browse other cakes <span className="text-lg">→</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {matchedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default CollectionPage;
