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
      className="group bg-white rounded-3xl overflow-hidden shadow-luxury-sm transition-all duration-500 flex flex-col h-full hover:-translate-y-1.5 hover:shadow-luxury-lg border border-cream-dark/20 animate-fade-up"
    >
      {/* Premium Tall Aspect Ratio Container (~70% of Card Height in Desktop Visuals) */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-cream-dark">
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
          <div className="absolute top-4 left-4 bg-chocolate text-white text-[9px] font-bold py-1 px-3 rounded-full uppercase tracking-widest shadow-sm z-10">
            {product.tag}
          </div>
        )}

        {/* Premium Wishlist heart button with smooth scale & transition */}
        <button
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer shadow-sm transition-all duration-300 z-10 bg-white/90 backdrop-blur-sm border border-cream-dark/20 ${
            isWishlisted ? "text-rose-deep scale-105" : "text-text-soft hover:text-rose-deep hover:scale-110"
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isWishlisted ? "Remove from Favourites" : "Save to Favourites"}
        >
          <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} className="transition-transform duration-300 group-hover:scale-110" />
        </button>
      </div>

      {/* Content Section below image */}
      <div className="p-5 flex flex-col flex-1 bg-white">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] text-text-soft font-bold uppercase tracking-wider">
            {product.weights?.[0]?.label || '0.5 Kg'}
          </span>

          {/* Star rating */}
          <div className="flex items-center gap-[2px] text-gold">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                fill={i < product.rating ? "currentColor" : "none"}
                className={i < product.rating ? "text-gold" : "text-text-soft/20"}
              />
            ))}
            <span className="text-text-soft text-[10px] ml-1 font-semibold">({product.reviews})</span>
          </div>
        </div>

        {/* Product Name in luxury Serif */}
        <h3 className="font-playfair text-base font-semibold text-chocolate leading-snug line-clamp-2 mb-1.5 min-h-[2.8em] group-hover:text-gold transition-colors duration-300">
          {product.name}
        </h3>

        {/* Premium subtle description / flavor detail */}
        <p className="text-[11px] text-text-soft/90 italic mb-4 truncate">
          {product.flavor || 'Signature Luxury Bake'}
        </p>

        {/* Price Row and Elegant Add CTA Button */}
        <div className="flex items-center justify-between mt-auto pt-3.5 border-t border-cream-dark/20 gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] text-text-soft font-bold uppercase tracking-widest leading-none mb-1">
              Starting from
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-playfair text-[1.1rem] font-bold text-chocolate">
                ₹{product.weights?.[0]?.price || product.price}
              </span>
              {product.oldPrice > 0 && (
                <span className="text-xs text-text-soft line-through">
                  ₹{product.oldPrice}
                </span>
              )}
            </div>
          </div>

          {/* Luxury Add Button - Always visible for superb conversion & 100% E2E test alignment */}
          <button
            onClick={handleAddToCart}
            className={`min-w-[85px] rounded-full py-2 px-4 font-poppins text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm border ${
              isAdded
                ? 'bg-green-600 border-green-600 text-white'
                : 'bg-chocolate border-chocolate text-white hover:bg-gold hover:border-gold hover:text-chocolate active:scale-95'
            }`}
          >
            {isAdded ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
