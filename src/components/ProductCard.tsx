"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, Plus, Check } from 'lucide-react';
import { Product } from '@/constants/products';
import { useCart } from '@/context/CartContext';
import { useFlyToCart } from '@/context/FlyToCartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { cart, addToCart } = useCart();
  const { flyToCart } = useFlyToCart();
  const [localAdded, setLocalAdded] = useState(false);

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
      className="group bg-white rounded-md overflow-hidden shadow-sm transition-all duration-350 flex flex-col h-full hover:translate-y-[-6px] hover:shadow-md animate-fade-up"
    >
      <div className="relative aspect-[4/3] min-h-[240px] max-h-[300px] overflow-hidden bg-[#f7efe6]">
        <Image
          src={product.img}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          priority={priority}
        />
        {product.tag && (
          <div className="absolute top-[14px] left-[-4px] bg-rose-deep text-white text-[0.68rem] font-bold py-1 px-3 rounded-r-[4px] uppercase tracking-wider before:content-[''] before:absolute before:bottom-[-4px] before:left-0 before:border-[4px] before:border-transparent before:border-r-rose-deep">
            {product.tag}
          </div>
        )}
        <button
          className="absolute top-3 right-3 w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center text-text-soft text-sm cursor-pointer shadow-sm transition-all duration-350 border-none hover:text-rose-deep hover:scale-110"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart size={16} />
        </button>
      </div>

      <div className="p-[16px_18px_18px] flex flex-col gap-2 flex-1">
        <h3 className="text-base font-semibold text-chocolate leading-[1.3] min-h-[3.4em] line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[0.78rem] text-text-soft m-0">{product.flavor}</p>

        <div className="flex items-center gap-[3px] mb-3 text-[0.8rem] text-gold">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              fill={i < product.rating ? "currentColor" : "none"}
              className={i < product.rating ? "text-gold" : "text-text-soft/30"}
            />
          ))}
          <span className="text-text-soft ml-1 text-[0.75rem]">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between gap-3 mt-auto flex-wrap">
          <div>
            <div className="flex flex-col">
              <span className="text-[10px] text-text-soft font-bold uppercase tracking-wider leading-none mb-1">Starting from</span>
              <span className="font-playfair text-lg font-bold text-rose-deep">₹{product.weights?.[0]?.price || product.price}</span>
            </div>
            {product.oldPrice > 0 && (
              <span className="text-[0.78rem] text-text-soft line-through ml-1">₹{product.oldPrice}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className={`min-w-[90px] border-none rounded-[50px] py-[9px] px-[18px] font-poppins text-[0.8rem] font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-350 ${
              isAdded ? 'bg-green-600 text-white' : 'bg-rose-deep text-white hover:bg-brown hover:scale-105 active:scale-95'
            }`}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Check size={14} /> Added
                </motion.div>
              ) : (
                <motion.div
                  key="plus"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add
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
