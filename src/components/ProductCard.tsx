"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, Plus, Check } from 'lucide-react';
import { Product } from '@/constants/products';
import { useCart } from '@/context/CartContext';
import { useFlyToCart } from '@/context/FlyToCartContext';
import { useWishlist } from '@/context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { cart, addToCart } = useCart();
  const { flyToCart } = useFlyToCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [localAdded, setLocalAdded] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  // Derive global added state from cart
  const isGloballyAdded = cart.some(item => item.id === product.id);
  const isAdded = isGloballyAdded || localAdded;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    flyToCart(rect, product.img);

    const defaultWeight = product.weights?.[0]?.label || '0.5 Kg';
    const defaultPrice = product.weights?.[0]?.price || product.price;

    addToCart({
      id: product.id,
      name: product.name,
      price: defaultPrice,
      img: product.img,
      weight: defaultWeight,
    });

    setLocalAdded(true);
    setTimeout(() => setLocalAdded(false), 2000);
  };

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group relative bg-white rounded-[24px] overflow-hidden transition-all duration-500 flex flex-col h-full shadow-[0_4px_20px_rgba(61,31,16,0.04)] hover:shadow-[0_12px_32px_rgba(61,31,16,0.1)] border border-cream-dark/30 hover:-translate-y-1.5 animate-fade-up"
    >
      {/* Image Container - occupies ~70% of the card height */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#fbf8f5] m-2.5 rounded-[18px]">
        <Image
          src={product.img}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          priority={priority}
        />

        {product.tag && (
          <div className="absolute top-[14px] left-[14px] bg-chocolate/90 text-gold-light text-[0.65rem] font-bold py-1 px-2.5 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-sm">
            {product.tag}
          </div>
        )}

        {/* Favorite Icon with scale animation */}
        <button
          className={`absolute top-3.5 right-3.5 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-sm cursor-pointer shadow-sm transition-all duration-300 border-none hover:scale-110 active:scale-95 z-10 ${
            isWishlisted ? "text-rose-deep" : "text-text-soft hover:text-rose-deep"
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isWishlisted ? "Remove from Favourites" : "Save to Favourites"}
        >
          <Heart
            size={15}
            fill={isWishlisted ? "currentColor" : "none"}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 pt-1 flex flex-col flex-1 gap-2.5 justify-between">
        <div className="space-y-1">
          {/* Flavor tag / Category */}
          <span className="text-[10px] font-bold text-text-soft uppercase tracking-wider block">
            {product.flavor || product.category}
          </span>

          {/* Product Name */}
          <h3 className="text-[0.95rem] font-semibold text-chocolate leading-[1.3] min-h-[2.6em] line-clamp-2 font-poppins">
            {product.name}
          </h3>
        </div>

        {/* Rating Block */}
        <div className="flex items-center gap-[3px] text-gold">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={11}
              fill={i < product.rating ? "currentColor" : "none"}
              className={i < product.rating ? "text-gold" : "text-text-soft/20"}
            />
          ))}
          <span className="text-text-soft/80 ml-1 text-[0.7rem] font-medium">({product.reviews})</span>
        </div>

        {/* Price, Weight and Add Button */}
        <div className="pt-2 border-t border-cream-dark/20 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] text-text-soft font-bold uppercase tracking-wider leading-none mb-1">
              {product.weights && product.weights.length > 0 ? `${product.weights[0].label} / starting` : '0.5 Kg'}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-playfair text-base font-bold text-chocolate">
                ₹{product.weights?.[0]?.price || product.price}
              </span>
              {product.oldPrice > 0 && (
                <span className="text-[0.75rem] text-text-soft/60 line-through">
                  ₹{product.oldPrice}
                </span>
              )}
            </div>
          </div>

          {/* Quick Add CTA with hover fade-in effect on desktop, always visible on mobile */}
          <button
            onClick={handleAddToCart}
            className={`h-9 border-none rounded-full px-4 font-poppins text-[0.75rem] font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-300 md:opacity-0 md:translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 ${
              isAdded ? 'bg-green-600 text-white' : 'bg-rose-deep text-white hover:bg-brown active:scale-95 shadow-sm'
            }`}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1"
                >
                  <Check size={12} /> Added
                </motion.div>
              ) : (
                <motion.div
                  key="plus"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1"
                >
                  <Plus size={12} /> Add
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
