'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-350 flex flex-col h-full group">
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/3] min-h-[240px] overflow-hidden bg-[#f7efe6]">
        <Image
          src={product.img}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.tag && (
          <div className="absolute top-4 left-[-4px] bg-rose-deep text-white text-[0.68rem] font-bold py-1 px-3 rounded-r-md uppercase tracking-wider before:content-[''] before:absolute before:bottom-[-4px] before:left-0 before:border-[4px] before:border-transparent before:border-r-rose-deep">
            {product.tag}
          </div>
        )}
        <button className="absolute top-3 right-3 w-8.5 h-8.5 bg-white rounded-full flex items-center justify-center text-text-soft hover:text-rose-deep hover:scale-115 transition-all shadow-sm">
          <Heart className="w-4 h-4" />
        </button>
      </Link>

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-base font-semibold text-chocolate leading-tight min-h-[2.6em] line-clamp-2 hover:text-rose-deep transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-[0.78rem] text-text-soft">
          {product.flavor}
        </p>

        <div className="flex items-center gap-1 text-gold text-xs">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
          ))}
          <span className="ml-1 text-text-soft text-[0.75rem]">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between gap-3 mt-auto flex-wrap">
          <div>
            <span className="font-playfair text-lg font-bold text-rose-deep">₹{product.price}</span>
            {product.oldPrice && (
              <span className="text-[0.78rem] text-text-soft line-through ml-1">₹{product.oldPrice}</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="bg-rose-deep text-white border-none rounded-full py-2.5 px-4.5 text-[0.85rem] font-semibold cursor-pointer flex items-center gap-1.5 transition-all hover:bg-brown hover:scale-105 min-h-[44px]"
          >
            <ShoppingCart className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
