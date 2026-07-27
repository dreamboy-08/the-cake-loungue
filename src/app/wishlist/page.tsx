'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, ArrowRight, Star, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useFlyToCart } from '@/context/FlyToCartContext';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import BackButton from '@/components/BackButton';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { flyToCart } = useFlyToCart();

  React.useEffect(() => {
    document.title = "My Favourites | The Cake Lounge";
  }, []);

  const handleMoveToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();

    // Trigger fly-to-cart animation
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    flyToCart(rect, product.img);

    const defaultWeight = product.weights?.[0]?.label || '0.5 Kg';
    const defaultPrice = product.weights?.[0]?.price || product.price;

    // Add to cart
    addToCart({
      id: product.id,
      name: product.name,
      price: defaultPrice,
      img: product.img,
      weight: defaultWeight,
    });
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <BackButton fallbackRoute="/menu" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-chocolate mb-2">
              My Favourites
            </h1>
            <p className="text-text-soft text-sm md:text-base">
              Your handpicked artisan cakes and delicious desserts, saved for your next celebration.
            </p>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-sm font-semibold text-rose hover:text-rose-deep border border-rose/20 hover:border-rose/50 px-4 py-2 rounded-full transition-all"
            >
              Clear All Favourites
            </button>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white border border-cream-dark rounded-[24px] shadow-sm max-w-2xl mx-auto my-8"
            >
              <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center text-rose mb-6 animate-pulse">
                <Heart size={40} className="fill-rose" />
              </div>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-chocolate mb-3">
                ❤️ No Favourites Yet
              </h2>
              <p className="text-text-mid max-w-md mb-8 leading-relaxed">
                Save your favourite cakes and desserts here so you can easily find them whenever you&apos;re ready to order.
              </p>
              <Link
                href="/menu"
                className="btn btn-primary px-8 py-3.5 rounded-full flex items-center gap-2 group transition-all"
              >
                <span>Continue Shopping</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {wishlist.map((product) => {
                const startingPrice = product.weights?.[0]?.price || product.price;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white rounded-[22px] overflow-hidden shadow-sm border border-cream-dark hover:shadow-md transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image Area with Actions */}
                    <div className="relative aspect-[4/3] bg-cream-dark m-2 rounded-[18px] overflow-hidden">
                      <Image
                        src={product.img}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {product.tag && (
                        <div className="absolute top-[14px] left-[-4px] bg-rose-deep text-white text-[0.68rem] font-bold py-1 px-3 rounded-r-[4px] uppercase tracking-wider before:content-[''] before:absolute before:bottom-[-4px] before:left-0 before:border-[4px] before:border-transparent before:border-r-rose-deep">
                          {product.tag}
                        </div>
                      )}
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="absolute top-3 right-3 w-9 h-9 bg-white hover:bg-red-50 text-text-soft hover:text-red-500 rounded-full flex items-center justify-center shadow-sm border-none cursor-pointer transition-colors"
                        aria-label="Remove from Favourites"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Info Area */}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="mb-3">
                        <span className="text-[11px] font-bold text-rose uppercase tracking-widest block mb-1">
                          {product.category}
                        </span>
                        <Link href={`/shop/${product.id}`} className="hover:underline">
                          <h3 className="font-semibold text-chocolate text-base leading-snug line-clamp-2 min-h-[2.8em]">
                            {product.name}
                          </h3>
                        </Link>
                      </div>

                      {/* Availability & Rating */}
                      <div className="flex items-center justify-between gap-4 mb-4 text-xs">
                        <div className="flex items-center gap-1.5 text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          <span>Freshly Baked</span>
                        </div>
                        <div className="flex items-center gap-1 text-gold">
                          <Star size={12} fill="currentColor" />
                          <span className="text-text-mid font-semibold">{product.rating}</span>
                          <span className="text-text-soft">({product.reviews})</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-cream">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-text-soft font-bold uppercase tracking-wider leading-none mb-1">
                            Price
                          </span>
                          <span className="font-playfair text-xl font-bold text-rose-deep">
                            ₹{startingPrice}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            href={`/shop/${product.id}`}
                            className="w-10 h-10 bg-cream text-chocolate hover:bg-cream-dark rounded-full flex items-center justify-center transition-colors"
                            title="View Details"
                          >
                            <ShoppingBag size={16} />
                          </Link>
                          <button
                            onClick={(e) => handleMoveToCart(e, product)}
                            className="bg-rose-deep text-white hover:bg-brown hover:scale-105 active:scale-95 px-4 rounded-full font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                          >
                            <ShoppingCart size={14} />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default WishlistPage;
