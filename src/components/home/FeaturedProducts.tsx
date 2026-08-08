"use client";

import React from 'react';
import { useProducts } from '@/context/ProductsContext';
import ProductCard from '../ProductCard';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';

import { useCMS } from '@/context/CMSContext';

const FeaturedProducts = ({ sectionId = 'bestsellers' }: { sectionId?: 'trending' | 'bestsellers' }) => {
  const { products, loading } = useProducts();
  const { homepageSections } = useCMS();

  const sectionConfig = homepageSections?.find(s => s.id === sectionId);
  const label = sectionConfig?.title || (sectionId === 'trending' ? "Trending Cakes" : "Our Bestsellers");
  const description = sectionConfig?.description || (sectionId === 'trending' ? "The latest and most requested showstoppers loved by our patrons." : "Time-tested flavor combinations that consistently steal the spotlight.");

  const featuredIds = [1, 2, 3, 5, 6, 7, 9, 11, 13, 17, 55, 59, 103, 114, 325, 327];

  // Try finding by numerical/string ID match, or falls back to filtering active items if custom cakes are created
  const featured = featuredIds
    .map(id => products.find(p => p.id.toString() === id.toString()))
    .filter((p): p is typeof products[0] => p !== undefined)
    .slice(0, 8); // Display top 8 featured

  return (
    <section id={sectionId} className="py-20 bg-cream-dark">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-3 mb-[50px]">
          <div>
            <p className="section-label">{label}</p>
            <h2 className="section-title">{description}</h2>
          </div>
          <Link href="/menu" className="group text-[0.88rem] font-semibold text-rose-deep flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0">
            View All <ArrowRight size={16} className="transition-all group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
