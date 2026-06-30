"use client";

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, ShieldCheck, Truck, RefreshCcw, Check, Loader2, AlertCircle } from 'lucide-react';
import { db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Product, products } from '@/constants/products';
import { useCart } from '@/context/CartContext';
import { useFlyToCart } from '@/context/FlyToCartContext';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/BackButton';

const ProductDetail = () => {
  const { id } = useParams();
  const { cart, addToCart, isLoading: cartLoading } = useCart();
  const { flyToCart } = useFlyToCart();
  const [localAdded, setLocalAdded] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeight, setSelectedWeight] = useState('0.5 Kg');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        // Step 1: Try Firestore
        const docRef = doc(db, 'products', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as any;
          const productData = { id: docSnap.id, ...data } as Product;
          setProduct(productData);
          if (productData.weights && productData.weights.length > 0) {
            setSelectedWeight(productData.weights[0].label);
          }
          setLoading(false);
          return;
        }

        // Step 2: Fallback to static constants if not found in Firestore
        console.warn(`Product ${id} not found in Firestore, falling back to static constants.`);
        const fallbackProduct = products.find(p => p.id.toString() === id);

        if (fallbackProduct) {
          setProduct(fallbackProduct);
          if (fallbackProduct.weights && fallbackProduct.weights.length > 0) {
            setSelectedWeight(fallbackProduct.weights[0].label);
          }
        } else {
          setError('Product not found in our catalog');
        }
      } catch (err) {
        console.error('Error fetching product from Firestore, trying fallback:', err);
        // Step 3: Try fallback on actual fetch error too
        const fallbackProduct = products.find(p => p.id.toString() === id);
        if (fallbackProduct) {
          setProduct(fallbackProduct);
          if (fallbackProduct.weights && fallbackProduct.weights.length > 0) {
            setSelectedWeight(fallbackProduct.weights[0].label);
          }
        } else {
          setError('Failed to load product details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 bg-cream min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-rose-deep" size={48} />
        <p className="text-chocolate font-medium">Loading delicious details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 pb-20 bg-cream min-h-screen flex flex-col items-center justify-center gap-6 text-center px-6">
        <div className="w-20 h-20 bg-cream-dark rounded-full flex items-center justify-center text-rose-deep">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-chocolate">{error || 'Product Not Found'}</h2>
        <Link href="/menu" className="btn btn-primary px-8 py-3">Back to Menu</Link>
      </div>
    );
  }

  const activeWeightOption = product.weights?.find(w => w.label === selectedWeight) || { label: selectedWeight, price: product.price };
  const currentPrice = activeWeightOption.price;

  const isGloballyAdded = cart.some(item => item.id === product.id && item.weight === selectedWeight);
  const isAdded = isGloballyAdded || localAdded;

  const handleAddToCart = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    flyToCart(rect, product.img);

    addToCart({
      id: product.id,
      name: product.name,
      price: currentPrice,
      img: product.img,
      weight: selectedWeight,
    });
    setLocalAdded(true);
    setTimeout(() => setLocalAdded(false), 2000);
  };

  return (
    <div className="pt-40 md:pt-52 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6">
        <BackButton fallbackRoute="/menu" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-[24px] shadow-sm border border-cream-dark">
          {/* Image Section */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-cream-dark">
            <Image
              src={product.img}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
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
                <span className="text-3xl font-bold text-rose-deep">₹{currentPrice}</span>
                {product.oldPrice > 0 && selectedWeight === (product.weights?.[0]?.label || '0.5 Kg') && (
                  <span className="text-xl text-text-soft line-through font-medium">₹{product.oldPrice}</span>
                )}
              </div>
              <p className="text-text-mid leading-relaxed">
                {product.description}
              </p>
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
