"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart } from 'lucide-react';
import { Product } from '@/constants/products';
import { useWishlist } from '@/context/WishlistContext';
import { getEarliestAvailableDateAndSlot } from '@/utils/deliveryValidation';
import { motion } from 'framer-motion';
import GSTBadge from './GSTBadge';

interface RecommendationCardProps {
  product: Product;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);
  const [earliestDelivery, setEarliestDelivery] = useState<{ date: Date; slot: string } | null>(null);

  useEffect(() => {
    if (product) {
      const prepHours = product.preparationTime || 16;
      const hasCustomCake = product.category === 'Custom Cakes' || product.name.toLowerCase().includes('custom');
      setEarliestDelivery(getEarliestAvailableDateAndSlot(new Date(), prepHours, hasCustomCake));
    }
  }, [product]);

  const defaultPrice = product.weights?.[0]?.price || product.price;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const formattedDelivery = earliestDelivery
    ? `${earliestDelivery.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${earliestDelivery.slot}`
    : 'Calculating...';

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group bg-white rounded-[20px] overflow-hidden shadow-sm border border-cream-dark transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col h-full hover:-translate-y-1 hover:shadow-md transform-gpu"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark m-2.5 rounded-[16px]">
        <Image
          src={product.img}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          loading="lazy"
        />
        {product.tag && (
          <div className="absolute top-3 left-0 bg-rose-deep text-white text-[10px] font-bold py-1 px-2.5 rounded-r-[4px] uppercase tracking-wider shadow-sm z-10">
            {product.tag}
          </div>
        )}
        <button
          className={`absolute top-2 right-2 w-11 h-11 bg-white rounded-full flex items-center justify-center text-sm cursor-pointer shadow-sm border-none z-20 outline-none transition-all duration-200 active:scale-90`}
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? "Remove from Favourites" : "Save to Favourites"}
        >
          <motion.div
            animate={isWishlisted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={isWishlisted ? "text-rose-deep" : "text-text-soft hover:text-rose-deep"}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </motion.div>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 pt-1 flex flex-col flex-1 gap-2">
        {/* Rating if available */}
        <div className="flex items-center gap-1.5 text-xs text-gold">
          {product.rating > 0 ? (
            <>
              <div className="flex items-center text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    fill={i < product.rating ? "currentColor" : "none"}
                    className={i < product.rating ? "text-gold" : "text-text-soft/20"}
                  />
                ))}
              </div>
              <span className="text-text-soft font-medium">({product.reviews})</span>
            </>
          ) : (
            <span className="text-text-soft text-[11px] font-medium">No reviews yet</span>
          )}
        </div>

        {/* Product Name */}
        <h4 className="text-sm font-semibold text-chocolate leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-rose-deep transition-colors duration-200">
          {product.name}
        </h4>

        {/* Price & GST */}
        <div className="flex flex-wrap items-center gap-2 mt-auto">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] text-text-soft font-bold uppercase tracking-wider leading-none">Starting from</span>
            <span className="font-playfair text-base font-bold text-rose-deep">₹{defaultPrice}</span>
          </div>
          <GSTBadge />
        </div>

        {/* Earliest Delivery Info */}
        <div className="mt-1 pt-2 border-t border-cream border-dashed text-[10px] text-text-mid font-medium flex items-center gap-1">
          <span className="text-rose-deep font-semibold">Earliest Delivery:</span>
          <span className="truncate">{formattedDelivery}</span>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(RecommendationCard);
