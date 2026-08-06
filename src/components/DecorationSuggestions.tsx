"use client";

import React, { useState, useEffect } from 'react';
import { getDecorationSuggestions } from '@/utils/decorationSuggestionEngine';
import { DecorationProduct } from '@/types/decorations';
import { useCart } from '@/context/CartContext';
import { useFlyToCart } from '@/context/FlyToCartContext';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface DecorationSuggestionsProps {
  placement: 'pdp' | 'cart' | 'checkout';
  currentProductCategory?: string;
  currentProductId?: string;
  title?: string;
}

export const DecorationSuggestions: React.FC<DecorationSuggestionsProps> = ({
  placement,
  currentProductCategory,
  currentProductId,
  title = "Party Essentials & Decorative Add-ons"
}) => {
  const [suggestions, setSuggestions] = useState<DecorationProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart } = useCart();
  const { flyToCart } = useFlyToCart();
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    const loadSuggestions = async () => {
      setLoading(true);
      try {
        const cartCategories = cart.map(item => item.category || '');
        const data = await getDecorationSuggestions({
          placement,
          cartCategories,
          currentProductCategory,
          currentProductId
        });
        setSuggestions(data);
      } catch (err) {
        console.error("Error loading decoration suggestions:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSuggestions();
  }, [placement, currentProductCategory, currentProductId, cart]);

  const handleAddDecoration = async (e: React.MouseEvent, item: DecorationProduct) => {
    e.preventDefault();
    e.stopPropagation();
    if (!item.id) return;
    setAddingId(item.id);

    try {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      if (flyToCart) {
        flyToCart(rect, item.thumbnailImage);
      }

      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        img: item.thumbnailImage,
        weight: 'Standard',
        serves: 'N/A',
        message: '',
        category: 'Party Essentials & Decorations'
      }, 1);

      setTimeout(() => setAddingId(null), 1000);
    } catch (err) {
      console.error("Add decoration failed:", err);
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="animate-spin text-rose-deep" size={24} />
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 py-6 border-t border-cream-dark/60">
      <h4 className="text-sm font-black text-chocolate uppercase tracking-widest">{title}</h4>
      <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar">
        {suggestions.map((item) => {
          const isAdded = cart.some(c => c.id === item.id);
          const isAdding = addingId === item.id;

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-cream-dark/80 min-w-[280px] max-w-[320px] shadow-sm hover:shadow-md transition-shadow shrink-0"
            >
              <div className="relative w-16 h-14 rounded-xl overflow-hidden bg-gray-50 border shrink-0">
                <Image
                  src={item.thumbnailImage}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-chocolate truncate">{item.name}</h5>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">{item.shortDescription}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-black text-rose-deep">₹{item.price}</span>
                  {item.discountPrice && (
                    <span className="text-[10px] text-gray-400 line-through">₹{item.discountPrice}</span>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => handleAddDecoration(e, item)}
                disabled={isAdding}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all border-none cursor-pointer shrink-0 ${
                  isAdded
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-rose-deep text-white hover:bg-brown'
                }`}
                title="Add as Decoration to Cart"
              >
                {isAdding ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : isAdded ? (
                  <Check size={14} />
                ) : (
                  <ShoppingCart size={14} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
