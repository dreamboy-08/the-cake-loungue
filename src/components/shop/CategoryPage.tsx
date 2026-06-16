"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Product } from '@/constants/products';
import ProductCard from '@/components/ProductCard';
import { db } from '@/utils/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface CategoryPageProps {
  category: string;
  title: string;
  description: string;
  subtitle: string;
}

const CategoryPage = ({ category, title, description, subtitle }: CategoryPageProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), where('category', '==', category));
        const snapshot = await getDocs(q);
        setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as Product[]);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-rose-deep" size={40} />
            <p className="text-text-soft font-medium">Loading {title}...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
