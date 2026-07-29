"use client";

import React, { useState, useEffect } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, ShieldCheck, Truck, RefreshCcw, Check, Loader2, AlertCircle, Plus, Minus } from 'lucide-react';
import { db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Product, products } from '@/constants/products';
import { useCart } from '@/context/CartContext';
import { useFlyToCart } from '@/context/FlyToCartContext';
import { useWishlist } from '@/context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/BackButton';
import PageWrapper from '@/components/PageWrapper';

const ProductDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const { cart, addToCart, updateQuantity, isLoading: cartLoading } = useCart();
  const { flyToCart } = useFlyToCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [localAdded, setLocalAdded] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);
  const isWishlisted = product ? isInWishlist(product.id) : false;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeight, setSelectedWeight] = useState('0.5 Kg');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

  useEffect(() => {
    if (product) {
      if (product.flavours && product.flavours.length > 0) {
        const firstAvailable = product.flavours.find(f => f.available) || product.flavours[0];
        setSelectedFlavor(firstAvailable.name);
      } else if (product.flavor) {
        setSelectedFlavor(product.flavor);
      } else {
        setSelectedFlavor('Standard');
      }
    }
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      const fallbackToStatic = () => {
        console.warn(`Using fallback static constants for product ${id}.`);
        const fallbackProduct = products.find(p => p.id.toString() === id);
        if (fallbackProduct) {
          setProduct(fallbackProduct);
          if (fallbackProduct.weights && fallbackProduct.weights.length > 0) {
            setSelectedWeight(fallbackProduct.weights[0].label);
          }
        } else {
          setError('Product not found in our catalog');
        }
        setLoading(false);
      };

      const { isFirebaseConfigured } = require('@/utils/firebase');
      if (!isFirebaseConfigured()) {
        fallbackToStatic();
        return;
      }

      try {
        // Step 1: Try Firestore
        const docRef = doc(db, 'products', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as any;
          const productData = { ...data, id: docSnap.id } as Product;
          setProduct(productData);
          if (productData.weights && productData.weights.length > 0) {
            setSelectedWeight(productData.weights[0].label);
          }
          setLoading(false);
          return;
        }

        // Step 2: Fallback to static constants if not found in Firestore
        console.warn(`Product ${id} not found in Firestore, falling back to static constants.`);
        fallbackToStatic();
      } catch (err) {
        console.error('Error fetching product from Firestore, trying fallback:', err);
        // Step 3: Try fallback on actual fetch error too
        fallbackToStatic();
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <PageWrapper loading className="gap-4">
        <Loader2 className="animate-spin text-rose-deep" size={48} />
        <p className="text-chocolate font-medium">Loading delicious details...</p>
      </PageWrapper>
    );
  }

  if (error || !product) {
    return (
      <PageWrapper loading className="gap-6 text-center px-6">
        <div className="w-20 h-20 bg-cream-dark rounded-full flex items-center justify-center text-rose-deep">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-chocolate">{error || 'Product Not Found'}</h2>
        <Link href="/menu" className="btn btn-primary px-8 py-3">Back to Menu</Link>
      </PageWrapper>
    );
  }

  const activeWeightOption = product.weights?.find(w => w.label === selectedWeight) || { label: selectedWeight, price: product.price };
  const selectedFlavourObj = product.flavours?.find(f => f.name === selectedFlavor);
  const currentPrice = activeWeightOption.price + (selectedFlavourObj?.priceModifier || 0);
  const activeImage = selectedFlavourObj?.image || product.img;

  const isGloballyAdded = cart.some(item => {
    const isSameProduct = String(item.id) === String(product.id);
    const isSameWeight = item.weight === selectedWeight;
    const defaultFlavorName = product.flavours && product.flavours.length > 0 ? product.flavours[0].name : product.flavor;
    const isSameFlavor = item.flavor
      ? item.flavor === selectedFlavor
      : (!selectedFlavor || selectedFlavor === product.flavor || selectedFlavor === defaultFlavorName);
    return isSameProduct && isSameWeight && isSameFlavor;
  });
  const isAdded = isGloballyAdded || localAdded;

  const handleAddToCart = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    flyToCart(rect, activeImage);

    addToCart({
      id: product.id,
      name: product.name,
      price: currentPrice,
      img: activeImage,
      weight: selectedWeight,
      flavor: selectedFlavor,
    });

    // Update quantity if greater than 1
    if (quantity > 1) {
      const cartItemId = `${product.id}-${selectedFlavor || ''}-${selectedWeight || ''}-`;
      setTimeout(() => updateQuantity(cartItemId, quantity), 100);
    }

    setLocalAdded(true);
    setTimeout(() => setLocalAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: currentPrice,
      img: activeImage,
      weight: selectedWeight,
      flavor: selectedFlavor,
    });

    if (quantity > 1) {
      const cartItemId = `${product.id}-${selectedFlavor || ''}-${selectedWeight || ''}-`;
      updateQuantity(cartItemId, quantity);
    }
    router.push('/checkout');
  };

  const isCustomCake = product ? (product.category === 'Custom Cakes' || product.name.toLowerCase().includes('custom')) : false;
  const earliestDeliveryText = isCustomCake ? "In 2 Days" : "Tomorrow";

  return (
    <PageWrapper>
      <div className="container mx-auto px-6">
        <BackButton fallbackRoute="/menu" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-[24px] shadow-sm border border-cream-dark">
          {/* Image Section */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-cream-dark">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                />
              </motion.div>
            </AnimatePresence>
            {product.tag && (
              <div className="absolute top-6 left-0 bg-rose-deep text-white px-4 py-1.5 rounded-r-lg font-bold text-sm uppercase tracking-widest shadow-md">
                {product.tag}
              </div>
            )}
            <button
              onClick={() => product && toggleWishlist(product)}
              className={`absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md transition-all border-none cursor-pointer hover:scale-105 z-10 ${
                isWishlisted ? "text-rose-deep" : "text-text-soft hover:text-rose-deep"
              }`}
              aria-label={isWishlisted ? "Remove from Favourites" : "Save to Favourites"}
            >
              <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Details Section */}
          <div className="flex flex-col lg:sticky lg:top-28 self-start">
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

            <div className="mb-6">
              <p className="text-text-mid leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mb-8 bg-cream/40 p-4 rounded-2xl border border-cream/50 flex justify-between items-center">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-rose-deep">₹{currentPrice * quantity}</span>
                  {product.oldPrice > 0 && selectedWeight === (product.weights?.[0]?.label || '0.5 Kg') && (
                    <span className="text-lg text-text-soft line-through font-semibold">₹{product.oldPrice * quantity}</span>
                  )}
                </div>
                <span className="text-[10px] text-text-soft font-bold uppercase tracking-wider block mt-1">GST Included & Freshness Guaranteed</span>
              </div>
            </div>

            {/* Weight Selector */}
            {product.weights && product.weights.length > 0 && (
              <div className="mb-8">
                <label className="block text-xs font-bold text-chocolate uppercase tracking-widest mb-4">Select Weight</label>
                <div className="flex flex-wrap gap-3">
                  {product.weights.map((w) => (
                    <button
                      key={w.label}
                      onClick={() => setSelectedWeight(w.label)}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${
                        selectedWeight === w.label
                          ? 'border-rose-deep bg-rose-deep text-white shadow-md'
                          : 'border-cream bg-white text-chocolate hover:border-rose-deep/30'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Flavour Selector */}
            {product.flavours && product.flavours.length > 1 && (
              <div className="mb-8">
                <label className="block text-xs font-bold text-chocolate uppercase tracking-widest mb-4">Choose Flavour</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.flavours.map((f) => {
                    const isSelected = selectedFlavor === f.name;
                    return (
                      <button
                        key={f.id}
                        disabled={!f.available}
                        onClick={() => f.available && setSelectedFlavor(f.name)}
                        className={`relative p-4 rounded-2xl text-left transition-all duration-300 border-2 flex flex-col justify-between min-h-[80px] group focus:outline-none focus:ring-2 focus:ring-rose-deep/40 ${
                          !f.available
                            ? 'opacity-40 cursor-not-allowed bg-cream/10 border-cream-dark'
                            : isSelected
                            ? 'border-rose-deep bg-rose-deep/5 text-chocolate shadow-md scale-[1.02]'
                            : 'border-cream bg-white text-chocolate hover:border-rose-deep/30 hover:shadow-sm'
                        }`}
                        aria-label={`Select flavour ${f.name}${f.priceModifier ? ` (Adds ₹${f.priceModifier})` : ''}`}
                        aria-pressed={isSelected}
                      >
                        <div className="flex justify-between items-start w-full">
                          <span className="font-bold text-sm leading-tight group-hover:text-rose-deep transition-colors">
                            {f.name}
                          </span>
                          {f.available && isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 bg-rose-deep text-white rounded-full flex items-center justify-center shrink-0 shadow-sm"
                            >
                              <Check size={12} strokeWidth={3} />
                            </motion.div>
                          )}
                        </div>
                        {f.priceModifier && f.priceModifier !== 0 ? (
                          <span className={`text-xs font-bold mt-2 ${isSelected ? 'text-rose-deep' : 'text-text-soft'}`}>
                            {f.priceModifier > 0 ? `+ ₹${f.priceModifier}` : `- ₹${Math.abs(f.priceModifier)}`}
                          </span>
                        ) : (
                          <span className="text-[10px] text-text-soft font-semibold uppercase tracking-wider mt-2">Base Price</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-chocolate uppercase tracking-widest mb-2">Quantity</label>
                <div className="flex items-center gap-4 bg-cream rounded-xl p-1.5 border border-cream-dark max-w-[150px]">
                  <button
                    onClick={handleDecrement}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-rose-deep hover:text-white text-chocolate font-bold transition-all shadow-sm active:scale-95"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-base font-black text-chocolate min-w-[2rem] text-center">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-rose-deep hover:text-white text-chocolate font-bold transition-all shadow-sm active:scale-95"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-xs font-bold text-chocolate uppercase tracking-widest mb-2">Earliest Delivery</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-xl text-xs font-bold border border-green-100">
                  <Check size={14} strokeWidth={3} />
                  {earliestDeliveryText}
                </span>
              </div>
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
                <span className="text-sm font-medium">Freshly Baked for Your Selected Date</span>
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
                disabled={cartLoading}
                className={`flex-1 btn py-4 justify-center transition-all duration-300 ${
                  cartLoading ? 'bg-cream text-text-soft cursor-not-allowed' :
                  isAdded ? 'bg-green-600 text-white hover:bg-green-700' : 'btn-primary'
                }`}
              >
                <AnimatePresence mode="wait">
                  {cartLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <Loader2 size={20} className="mr-2 animate-spin" /> Loading...
                    </motion.div>
                  ) : isAdded ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center"
                    >
                      <Check size={20} className="mr-2" /> Added to Cart
                    </motion.div>
                  ) : (
                    <motion.div
                      key="cart"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center"
                    >
                      <ShoppingCart size={20} className="mr-2" /> Add to Cart
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 btn bg-chocolate hover:bg-brown text-white py-4 justify-center rounded-full font-bold transition-all active:scale-95"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Purchase Bar */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[490] bg-white/90 backdrop-blur-md border-t border-cream-dark/80 px-6 py-4 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] flex items-center justify-between gap-4 lg:hidden pb-safe"
        >
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-text-soft font-bold leading-none">{selectedWeight} • {selectedFlavor}</span>
            <span className="text-xl font-black text-rose-deep mt-1">₹{currentPrice * quantity}</span>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center min-h-[44px] ${
                isAdded ? 'bg-green-600 text-white' : 'bg-rose-deep/10 text-rose-deep hover:bg-rose-deep/20'
              }`}
            >
              {isAdded ? 'Added' : 'Add to Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              className="px-5 py-2.5 bg-chocolate hover:bg-brown text-white rounded-full text-xs font-bold transition-all min-h-[44px] active:scale-95"
            >
              Buy Now
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </PageWrapper>
  );
};

export default ProductDetail;
