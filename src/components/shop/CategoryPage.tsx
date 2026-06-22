"use client";

import React, { useState, useEffect } from 'react';
import { getProducts } from '@/utils/productService';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { Product } from '@/constants/products';
import { Loader2 } from 'lucide-react';

interface CategoryPageProps {
  category: string;
  title: string;
  description: string;
}

const CategoryPage = ({ category, title, description }: CategoryPageProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProducts({ category });
      setProducts(data as any);
      setLoading(false);
    };
    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 bg-cream min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-rose-deep mb-4" size={48} />
        <p className="text-chocolate font-bold">Discovering {title}...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6">
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="section-label">Category</p>
            <h1 className="section-title text-4xl md:text-5xl lg:text-6xl mb-6">{title}</h1>
            <p className="section-sub mx-auto max-w-2xl">{description}</p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-cream">
            <h3 className="text-2xl font-playfair font-bold text-chocolate mb-2">No {title} available right now</h3>
            <p className="text-text-soft">Please check back soon or explore our other categories.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
