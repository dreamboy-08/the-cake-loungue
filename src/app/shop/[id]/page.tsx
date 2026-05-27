"use client";

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, Heart, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { products } from '@/constants/products';
import { useCart } from '@/context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
    });
  };

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6">
        <Link href="/menu" className="inline-flex items-center gap-2 text-text-soft hover:text-rose-deep transition-colors mb-8 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Menu
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-sm">
          {/* Image Section */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-cream-dark">
            <Image
              src={product.img}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.tag && (
              <div className="absolute top-6 left-0 bg-rose-deep text-white px-4 py-1.5 rounded-r-lg font-bold text-sm uppercase tracking-widest shadow-md">
                {product.tag}
              </div>
            )}
            <button className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-text-soft shadow-md hover:text-rose-deep transition-colors border-none cursor-pointer">
              <Heart size={24} />
            </button>
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="text-rose font-bold text-sm uppercase tracking-widest mb-2 block">{product.category}</span>
              <h1 className="section-title text-3xl md:text-4xl mb-3">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < product.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-text-soft text-sm font-medium">({product.reviews} customer reviews)</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-rose-deep">₹{product.price}</span>
                {product.oldPrice > 0 && (
                  <span className="text-xl text-text-soft line-through font-medium">₹{product.oldPrice}</span>
                )}
              </div>
              <p className="text-text-mid leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-text-mid">
                <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-rose">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-sm font-medium">100% Eggless & Fresh Guaranteed</span>
              </div>
              <div className="flex items-center gap-3 text-text-mid">
                <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-rose">
                  <Truck size={18} />
                </div>
                <span className="text-sm font-medium">Same-day Delivery available in 4 hours</span>
              </div>
              <div className="flex items-center gap-3 text-text-mid">
                <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-rose">
                  <RefreshCcw size={18} />
                </div>
                <span className="text-sm font-medium">Easy Cancellation up to 24h before delivery</span>
              </div>
            </div>

            <div className="mt-auto flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn btn-primary py-4 justify-center"
              >
                <ShoppingCart size={20} className="mr-2" /> Add to Cart
              </button>
              <Link
                href="/custom-cake"
                className="flex-1 btn btn-outline border-rose-deep text-rose-deep hover:bg-rose-deep hover:text-white py-4 justify-center"
              >
                Customize this Cake
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
