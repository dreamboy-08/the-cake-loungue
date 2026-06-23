"use client";

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { getProducts } from '@/utils/productService';
import { Product } from '@/constants/products';
import { Loader2 } from 'lucide-react';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      const data = await getProducts({ limitCount: 8 });
      setProducts(data as any);
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <section id="products" className="py-20 bg-cream-dark">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-label text-left">Our Creations</p>
            <h2 className="section-title text-left text-4xl md:text-5xl">Featured Masterpieces</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <a href="/menu" className="btn-outline">View Entire Menu</a>
          </motion.div>
        </div>

        {loading ? (
           <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-rose-deep" size={40} />
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
