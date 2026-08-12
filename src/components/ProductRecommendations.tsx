"use client";

import React, { useState, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Product, products as fallbackProducts } from '@/constants/products';
import { getRecommendations } from '@/utils/recommendationEngine';
import RecommendationCard from './RecommendationCard';
import { RecommendationsDrawer } from './RecommendationsDrawer';
import { useCMS } from '@/context/CMSContext';

interface ProductRecommendationsProps {
  currentProduct: Product;
  allProducts?: Product[];
}

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  currentProduct,
  allProducts = fallbackProducts,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { decorations } = useCMS();

  // Map active decorations to standard product structures
  const activeDecorations = React.useMemo(() => {
    return (decorations || [])
      .filter((d) => d.enabled !== false)
      .map((d) => ({
        id: d.id as any,
        name: d.name,
        flavor: 'Standard',
        category: d.category,
        price: d.price,
        oldPrice: 0,
        rating: 5,
        reviews: 12,
        tag: 'Decoration',
        img: d.img,
        description: d.description,
        preparationTime: 0,
        displayOrder: d.displayOrder,
      }));
  }, [decorations]);

  // Memoize recommendation calculations for Cakes
  const recommendedCakes = useMemo(() => {
    return getRecommendations(currentProduct, allProducts, { limit: 12 });
  }, [currentProduct, allProducts]);

  // Memoize recommendation calculations for Decorations
  const recommendedDecorations = useMemo(() => {
    if (activeDecorations.length === 0) return [];

    // Rank decorations based on matchmaking signals
    const scoredDecorations = activeDecorations.map((dec) => {
      let score = 0;
      const currentNameLower = currentProduct.name.toLowerCase();
      const decNameLower = dec.name.toLowerCase();

      // Match signals
      // 1. Birthday occasion matchmaking
      if (
        (currentProduct.category.toLowerCase().includes('birthday') || currentNameLower.includes('birthday')) &&
        (dec.category.toLowerCase() === 'balloons' || dec.category.toLowerCase() === 'banners' || decNameLower.includes('birthday'))
      ) {
        score += 15;
      }

      // 2. Wedding / Anniversary / Couple matchmaking
      if (
        (currentProduct.category.toLowerCase().includes('anniversary') || currentProduct.category.toLowerCase().includes('wedding') || currentNameLower.includes('anniversary') || currentNameLower.includes('love') || currentNameLower.includes('heart') || currentNameLower.includes('couple')) &&
        (dec.category.toLowerCase() === 'party kits' || decNameLower.includes('anniversary') || decNameLower.includes('romantic') || decNameLower.includes('rose') || decNameLower.includes('sparkler'))
      ) {
        score += 15;
      }

      // 3. Category / Display Priority match
      score += (10 - dec.displayOrder) * 0.5;

      return { dec, score };
    });

    // Sort decorations by matchmaking score desc
    scoredDecorations.sort((a, b) => b.score - a.score);
    return scoredDecorations.map(sd => sd.dec).slice(0, 12);
  }, [currentProduct, activeDecorations]);

  // Combined full list for the Drawer (cakes first, then decorations)
  const recommendedList = useMemo(() => {
    return [...recommendedCakes, ...recommendedDecorations];
  }, [recommendedCakes, recommendedDecorations]);

  // First 4 products to display in the main PDP section
  const pdpCakes = useMemo(() => {
    return recommendedCakes.slice(0, 4);
  }, [recommendedCakes]);

  const pdpDecorations = useMemo(() => {
    return recommendedDecorations.slice(0, 4);
  }, [recommendedDecorations]);

  if (pdpCakes.length === 0 && pdpDecorations.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-8 border-t border-cream-dark">
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

      {/* Cakes Section */}
      {pdpCakes.length > 0 && (
        <div className="mb-10">
          <h4 className="text-lg md:text-xl font-bold font-playfair text-chocolate mb-4">Cakes</h4>
          <div className="relative overflow-hidden sm:overflow-visible">
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6">
              {pdpCakes.map((product) => (
                <div key={product.id} className="animate-fade-up">
                  <RecommendationCard product={product} />
                </div>
              ))}
            </div>

            <div
              className="flex sm:hidden overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-6 px-6"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {pdpCakes.map((product) => (
                <div
                  key={product.id}
                  className="w-[75vw] min-w-[260px] max-w-[320px] shrink-0 snap-start snap-always"
                >
                  <RecommendationCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Decorations Section */}
      {pdpDecorations.length > 0 && (
        <div>
          <h4 className="text-lg md:text-xl font-bold font-playfair text-chocolate mb-4">Decorations</h4>
          <div className="relative overflow-hidden sm:overflow-visible">
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6">
              {pdpDecorations.map((product) => (
                <div key={product.id} className="animate-fade-up">
                  <RecommendationCard product={product} />
                </div>
              ))}
            </div>

            <div
              className="flex sm:hidden overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-6 px-6"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {pdpDecorations.map((product) => (
                <div
                  key={product.id}
                  className="w-[75vw] min-w-[260px] max-w-[320px] shrink-0 snap-start snap-always"
                >
                  <RecommendationCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
