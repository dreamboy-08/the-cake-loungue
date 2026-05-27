"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, Plus } from 'lucide-react';
import { Product } from '@/constants/products';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
    });
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
          className="object-cover transition-transform duration-500 group-hover:scale-105"
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
            <span className="font-playfair text-lg font-bold text-rose-deep">₹{product.price}</span>
            {product.oldPrice > 0 && (
              <span className="text-[0.78rem] text-text-soft line-through ml-1">₹{product.oldPrice}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-rose-deep text-white border-none rounded-[50px] py-[9px] px-[18px] font-poppins text-[0.8rem] font-semibold cursor-pointer flex items-center gap-1.5 transition-all duration-350 hover:bg-brown hover:scale-105 active:scale-95"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
