"use client";

import React, { useState, useEffect } from 'react';
import { Product } from '@/constants/products';
import ProductCard from '../ProductCard';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { db } from '@/utils/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';

const FeaturedProducts = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('tag', 'in', ['Bestseller', 'Trending', 'New', 'Luxury']),
          limit(8)
        );
        const snapshot = await getDocs(q);
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as unknown as Product[];
        setFeatured(productsData);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <Loader2 className="animate-spin text-rose-deep" size={32} />
            <p className="text-text-soft font-medium">Fetching bestsellers...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
