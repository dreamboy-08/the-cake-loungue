import React from 'react';
import { products } from '@/constants/products';
import ProductCard from '../ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const FeaturedProducts = () => {
  const featured = products.slice(0, 8);

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
