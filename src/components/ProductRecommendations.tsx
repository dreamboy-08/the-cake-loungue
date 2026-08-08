"use client";

import React, { useState, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Product, products as fallbackProducts } from '@/constants/products';
import { getRecommendations } from '@/utils/recommendationEngine';
import ProductCard from './ProductCard';
import { RecommendationsDrawer } from './RecommendationsDrawer';

interface ProductRecommendationsProps {
  currentProduct: Product;
  allProducts?: Product[];
}

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  currentProduct,
  allProducts = fallbackProducts,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Memoize recommendation calculations
  const recommendedList = useMemo(() => {
    return getRecommendations(currentProduct, allProducts, { limit: 12 });
  }, [currentProduct, allProducts]);

  // First 4 products to display in the main PDP section
  const pdpRecommendations = useMemo(() => {
    return recommendedList.slice(0, 4);
  }, [recommendedList]);

  if (recommendedList.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-8 border-t border-cream-dark/30">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl md:text-2xl font-bold font-playfair text-chocolate">
          You May Also Like
        </h3>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="group flex items-center gap-1.5 text-rose-deep hover:text-brown font-semibold text-sm transition-colors duration-200 border-none bg-transparent cursor-pointer outline-none focus:underline"
          aria-label="View all recommendations"
        >
          View All
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="relative overflow-hidden sm:overflow-visible">
        {/* Tablet/Desktop: Grid layout utilizing identical ProductCard */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {pdpRecommendations.map((product) => (
            <div key={product.id} className="animate-fade-up">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile Horizontal Scroll utilizing identical ProductCard */}
        <div
          className="flex sm:hidden overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-6 px-6"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {pdpRecommendations.map((product) => (
            <div
              key={product.id}
              className="w-[75vw] min-w-[260px] max-w-[320px] shrink-0 snap-start snap-always"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Drawer showing full recommendation pool */}
      <RecommendationsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        products={recommendedList}
      />
    </section>
  );
};

export default React.memo(ProductRecommendations);
