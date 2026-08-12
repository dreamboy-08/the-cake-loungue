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

  // Memoize recommendation calculations
  const recommendedList = useMemo(() => {
    const baseRecs = getRecommendations(currentProduct, allProducts, { limit: 12 });
    if (activeDecorations.length === 0) return baseRecs;

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
    const sortedDecorationsList = scoredDecorations.map(sd => sd.dec);

    // Mixed pool with interleaving (e.g. 2 cakes, then 2 decorations, etc.)
    const mixedPool: any[] = [];
    let cakeIdx = 0;
    let decorIdx = 0;

    while (cakeIdx < baseRecs.length || decorIdx < sortedDecorationsList.length) {
      // Add up to 2 cakes
      for (let k = 0; k < 2 && cakeIdx < baseRecs.length; k++) {
        mixedPool.push(baseRecs[cakeIdx++]);
      }
      // Add up to 2 decorations
      for (let d = 0; d < 2 && decorIdx < sortedDecorationsList.length; d++) {
        mixedPool.push(sortedDecorationsList[decorIdx++]);
      }
    }

    return mixedPool.slice(0, 12);
  }, [currentProduct, allProducts, activeDecorations]);

  // First 4 products to display in the main PDP section
  const pdpRecommendations = useMemo(() => {
    return recommendedList.slice(0, 4);
  }, [recommendedList]);

  if (recommendedList.length === 0) {
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

      {/* Recommendations Cards Grid */}
      {/*
        Responsive layout requirements:
        - Desktop: 4 recommended products
        - Tablet: 2 products per row
        - Mobile: 1.2 - 1.5 cards with smooth horizontal scrolling
      */}
      <div className="relative overflow-hidden sm:overflow-visible">
        {/* Mobile: horizontal scrollable flex container | Tablet/Desktop: Grid layout */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {pdpRecommendations.map((product) => (
            <div key={product.id} className="animate-fade-up">
              <RecommendationCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile Horizontal Scroll with seamless edge bleeding */}
        <div
          className="flex sm:hidden overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-6 px-6"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {pdpRecommendations.map((product) => (
            <div
              key={product.id}
              className="w-[75vw] min-w-[260px] max-w-[320px] shrink-0 snap-start snap-always"
            >
              <RecommendationCard product={product} />
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
