"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, ShieldCheck, Truck, RefreshCcw, Check, Loader2, AlertCircle, Clock, Plus, Minus, ChevronDown, ChevronUp, Award, UserCheck, MessageSquare } from 'lucide-react';
import { Product } from '@/constants/products';
import { useProducts } from '@/context/ProductsContext';
import { useCart } from '@/context/CartContext';
import { getEarliestAvailableDateAndSlot } from '@/utils/deliveryValidation';
import { useFlyToCart } from '@/context/FlyToCartContext';
import { useWishlist } from '@/context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/BackButton';
import PageWrapper from '@/components/PageWrapper';
import GSTBadge from '@/components/GSTBadge';
import ProductRecommendations from '@/components/ProductRecommendations';
import CakeMessageInput from '@/components/shop/CakeMessageInput';
import { getServingsForWeight } from '@/utils/servingHelper';

const ProductDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const { cart, addToCart, isLoading: cartLoading } = useCart();
  const { flyToCart } = useFlyToCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [localAdded, setLocalAdded] = useState(false);

  const { products, loading: productsLoading } = useProducts();

  const [product, setProduct] = useState<Product | null>(null);
  const isWishlisted = product ? isInWishlist(product.id) : false;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeight, setSelectedWeight] = useState('0.5 Kg');
  const [quantity, setQuantity] = useState(1);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [cakeMessage, setCakeMessage] = useState('');
  const [isMessageValid, setIsMessageValid] = useState(true);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // Accordion state
  const [expandedSection, setExpandedExpandedSection] = useState<string | null>('description');

  const prepHours = product?.preparationTime || 16;
  const hasCustomCake = product ? (product.category === 'Custom Cakes' || product.name.toLowerCase().includes('custom')) : false;

  const [earliestDelivery, setEarliestDelivery] = useState<{ date: Date; slot: string } | null>(null);

  useEffect(() => {
    if (product) {
      setEarliestDelivery(getEarliestAvailableDateAndSlot(new Date(), prepHours, hasCustomCake));
    }
  }, [product, prepHours, hasCustomCake]);

  useEffect(() => {
    if (productsLoading) return;
    if (!id) return;
    setLoading(true);
    setError(null);

    const foundProduct = products.find(p => p.id.toString() === id.toString());
    if (foundProduct) {
      setProduct(foundProduct);
      if (foundProduct.weights && foundProduct.weights.length > 0) {
        const currentOptionExists = foundProduct.weights.some(w => w.label === selectedWeight);
        if (!currentOptionExists) {
          setSelectedWeight(foundProduct.weights[0].label);
        }
      }
    } else {
      setError('Product not found in our catalog');
    }
    setLoading(false);
  }, [id, products, productsLoading]);

  // Gallery images list (1 main, 3 themed luxury placeholders for detail zoom experience)
  const galleryImages = React.useMemo(() => product ? [
    product.img,
    "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80", // close-up fine ingredients
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80", // luxury delivery box
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80"  // elegant gold-dusted chocolate decoration
  ] : [], [product]);

  // Keyboard navigation support for image gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!product) return;
      if (e.key === 'ArrowRight') {
        setActiveImageIndex(prev => (prev + 1) % galleryImages.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, galleryImages]);

  // Image zoom handler on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  if (loading) {
    return (
      <PageWrapper loading className="gap-4 bg-[#fdf6ee]">
        <Loader2 className="animate-spin text-rose-deep" size={48} />
        <p className="text-chocolate font-medium">Loading delicious details...</p>
      </PageWrapper>
    );
  }

  if (error || !product) {
    return (
      <PageWrapper loading className="gap-6 text-center px-6 bg-[#fdf6ee]">
        <div className="w-20 h-20 bg-cream-dark rounded-full flex items-center justify-center text-rose-deep">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-chocolate">{error || 'Product Not Found'}</h2>
        <Link href="/menu" className="btn btn-primary px-8 py-3">Back to Menu</Link>
      </PageWrapper>
    );
  }

  const activeWeightOption = (product.weights?.find(w => w.label === selectedWeight) || { label: selectedWeight, price: product.price, serves: getServingsForWeight(selectedWeight) }) as any;
  const currentPrice = activeWeightOption.price;
  const activeServes = activeWeightOption.serves || getServingsForWeight(selectedWeight);

  const isGloballyAdded = cart.some(item => item.id === product.id && item.weight === selectedWeight && (item.message || '') === (cakeMessage || ''));
  const isAdded = isGloballyAdded || localAdded;

  const handleAddToCart = (e: React.MouseEvent) => {
    if (!isMessageValid) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    flyToCart(rect, product.img);

    addToCart({
      id: product.id,
      name: product.name,
      price: currentPrice,
      img: product.img,
      weight: selectedWeight,
      serves: activeServes,
      message: cakeMessage,
    }, quantity);
    setLocalAdded(true);
    setTimeout(() => setLocalAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (!isMessageValid) return;

    if (product.weights && product.weights.length > 0 && !selectedWeight) {
      alert("Please select a weight.");
      return;
    }

    setBuyNowLoading(true);

    try {
      const buyNowItem = {
        id: product.id,
        name: product.name,
        price: currentPrice,
        img: product.img,
        weight: selectedWeight,
        serves: activeServes,
        message: cakeMessage,
        quantity: quantity,
        flavor: product.flavor || 'Standard',
        preparationTime: product.preparationTime || 16,
        category: product.category,
      };

      sessionStorage.setItem('cakeLounge_buyNowItem', JSON.stringify(buyNowItem));
      router.push('/checkout');
    } catch (err) {
      console.error("Buy Now failed:", err);
    } finally {
      setBuyNowLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedExpandedSection(expandedSection === section ? null : section);
  };

  // Luxury Customer Reviews mock data
  const luxuryReviews = [
    {
      name: "Aishwarya Sen",
      verified: true,
      rating: 5,
      comment: "Absolutely breathtaking presentation. The texture is incredibly delicate, and the mixed berry ganache tastes fresh and premium. Will order again!",
      location: "DLF Phase 5, Gurugram",
      date: "August 2, 2025",
      avatar: "A"
    },
    {
      name: "Kabir Malhotra",
      verified: true,
      rating: 5,
      comment: "The Cake Lounge is in a class of its own. Fast scheduled white-glove delivery, flawless finish. It was the centerpiece of our dinner party.",
      location: "Golf Course Road, Gurugram",
      date: "July 28, 2025",
      avatar: "K"
    },
    {
      name: "Meera Oberoi",
      verified: true,
      rating: 4,
      comment: "Outstanding flavor balance, not overly sweet. Every element feels handcrafted. Pure gourmet delight.",
      location: "Sohna Road, Gurugram",
      date: "July 15, 2025",
      avatar: "M"
    }
  ];

  return (
    <PageWrapper>
      <div className="bg-[#fdf6ee] min-h-screen pt-28 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <BackButton fallbackRoute="/menu" />

          {/* Master PDP Grid Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* LEFT COLUMN: Large Sticky Image Gallery */}
            <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">

              {/* Main Interactive Hero Image */}
              <div
                className="relative aspect-square rounded-[28px] overflow-hidden bg-cream-dark shadow-sm border border-cream-dark/40 cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="w-full h-full relative"
                  >
                    <Image
                      src={galleryImages[activeImageIndex]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-200"
                      style={
                        isZoomed
                          ? {
                              transform: "scale(1.8)",
                              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                            }
                          : { transform: "scale(1)" }
                      }
                      priority
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                    />
                  </motion.div>
                </AnimatePresence>

                {product.tag && (
                  <div className="absolute top-6 left-0 bg-chocolate text-gold-light px-4 py-1.5 rounded-r-lg font-bold text-xs uppercase tracking-widest shadow-md">
                    {product.tag}
                  </div>
                )}

                {/* Wishlist Button with smooth anims */}
                <button
                  onClick={() => product && toggleWishlist(product)}
                  className={`absolute top-6 right-6 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition-all border-none cursor-pointer hover:scale-105 active:scale-95 z-10 ${
                    isWishlisted ? "text-rose-deep" : "text-text-soft hover:text-rose-deep"
                  }`}
                  aria-label={isWishlisted ? "Remove from Favourites" : "Save to Favourites"}
                >
                  <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} className="transition-transform duration-300" />
                </button>
              </div>

              {/* Thumbnails Row */}
              <div className="flex gap-3 justify-center items-center">
                {galleryImages.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImageIndex === index ? 'border-rose-deep scale-105 shadow-sm' : 'border-cream-dark/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Interactive Gallery Navigation Instruction */}
              <p className="text-[11px] text-text-soft text-center tracking-wide font-medium">
                Use your <span className="font-bold">←</span> and <span className="font-bold">→</span> keys on desktop to cycle gallery showcases
              </p>
            </div>

            {/* RIGHT COLUMN: Sticky Purchase Details Panel */}
            <div className="lg:col-span-5 bg-white p-8 rounded-[28px] shadow-[0_4px_24px_rgba(61,31,16,0.03)] border border-cream-dark/40 space-y-6">

              {/* Header Info */}
              <div>
                <span className="text-rose font-bold text-[10px] uppercase tracking-[0.2em] block mb-2">{product.category}</span>
                <h1 className="font-playfair text-3xl md:text-4xl font-bold text-chocolate leading-tight">{product.name}</h1>
                <p className="text-text-soft text-xs font-semibold tracking-wide mt-1 uppercase italic">{product.flavor}</p>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center text-gold gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill={i < product.rating ? "currentColor" : "none"} className={i < product.rating ? "text-gold" : "text-text-soft/20"} />
                    ))}
                  </div>
                  <span className="text-text-soft text-[11px] font-bold uppercase tracking-wider">({product.reviews} verified reviews)</span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="pt-4 border-t border-cream-dark/20 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-rose-deep font-playfair">₹{currentPrice}</span>
                  {product.oldPrice > 0 && selectedWeight === (product.weights?.[0]?.label || '0.5 Kg') && (
                    <span className="text-lg text-text-soft line-through font-semibold">₹{product.oldPrice}</span>
                  )}
                  <GSTBadge />
                </div>
              </div>

              {/* Dynamic Delivery Time slot helper */}
              {earliestDelivery && (
                <div className="p-4 bg-rose-50/40 rounded-2xl border border-rose-100/50 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <Clock className="text-rose-deep mt-0.5 shrink-0" size={15} />
                    <div className="space-y-1">
                      <h4 className="font-bold text-[10px] uppercase tracking-wider text-rose-deep">Dynamic Preparation Time Rule</h4>
                      <p className="text-[11px] text-text-soft leading-normal font-medium">
                        This designer masterpiece requires a minimum of <span className="font-bold">{prepHours} hours</span> of artisan preparation.
                      </p>
                      <div className="inline-flex items-center gap-1.5 pt-1 text-[11px] font-bold text-chocolate">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Earliest Delivery: {earliestDelivery.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, {earliestDelivery.slot}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Weight Selector */}
              {product.weights && product.weights.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-chocolate uppercase tracking-[0.15em]">Select Weight Option</label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.weights.map((w) => (
                      <button
                        key={w.label}
                        onClick={() => setSelectedWeight(w.label)}
                        className={`px-5 py-2 rounded-xl font-bold text-xs transition-all duration-300 border-2 cursor-pointer ${
                          selectedWeight === w.label
                            ? 'border-rose-deep bg-rose-deep text-white shadow-sm'
                            : 'border-cream bg-[#faf6f3] text-chocolate hover:border-rose-deep/30'
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Serves Guide Indicator */}
              <div className="p-3 bg-cream/30 rounded-xl border border-cream-dark/40 flex items-center justify-between text-xs">
                <span className="font-bold text-text-soft uppercase tracking-wider text-[9px]">Serving Yield Guide</span>
                <span className="font-bold text-chocolate">Serves {activeServes} elegantly</span>
              </div>

              {/* Cake message input */}
              <CakeMessageInput
                value={cakeMessage}
                onChange={(msg, isValid) => {
                  setCakeMessage(msg);
                  setIsMessageValid(isValid);
                }}
              />

              {/* Quantity selector */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <span className="text-[10px] font-bold text-chocolate uppercase tracking-[0.15em]">Quantity</span>
                <div className="flex items-center gap-4 bg-cream rounded-full px-4 py-1.5 border border-cream-dark/60">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white hover:bg-rose-deep hover:text-white text-chocolate transition-all active:scale-95 border-none cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold text-chocolate min-w-[1.5rem] text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white hover:bg-rose-deep hover:text-white text-chocolate transition-all active:scale-95 border-none cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Checkout / Add CTAs */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row gap-3">

                  {/* Add To Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={cartLoading || !isMessageValid}
                    className={`flex-1 btn py-3.5 justify-center transition-all duration-300 border-none cursor-pointer rounded-full font-semibold text-sm ${
                      (cartLoading || !isMessageValid) ? 'bg-cream text-text-soft cursor-not-allowed' :
                      isAdded ? 'bg-green-600 text-white hover:bg-green-700' : 'btn-primary'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {cartLoading ? (
                        <motion.div key="loading" className="flex items-center">
                          <Loader2 size={18} className="mr-2 animate-spin" /> Loading...
                        </motion.div>
                      ) : isAdded ? (
                        <motion.div key="check" className="flex items-center">
                          <Check size={18} className="mr-2" /> Added to Cart
                        </motion.div>
                      ) : (
                        <motion.div key="cart" className="flex items-center">
                          <ShoppingCart size={18} className="mr-2" /> Add to Cart
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>

                  {/* Buy Now (Direct serialized checkout bypass) */}
                  <button
                    onClick={handleBuyNow}
                    disabled={buyNowLoading || !isMessageValid}
                    className="flex-1 btn border-2 border-chocolate text-chocolate hover:bg-cream/40 py-3.5 justify-center font-bold rounded-full transition-all duration-300 active:scale-[0.98] disabled:bg-cream disabled:text-text-soft disabled:cursor-not-allowed flex items-center cursor-pointer bg-transparent"
                    aria-label={`Buy ${product.name} Now`}
                  >
                    {buyNowLoading ? (
                      <Loader2 size={18} className="mr-2 animate-spin" />
                    ) : (
                      "Buy Now"
                    )}
                  </button>
                </div>

                <Link
                  href="/custom-cake"
                  className="w-full btn btn-outline border-rose-deep text-rose-deep hover:bg-rose-deep hover:text-white py-3.5 justify-center block text-center rounded-full text-xs font-bold"
                >
                  Custom Design Inquiry
                </Link>
              </div>

            </div>
          </div>

          {/* LOWER SECTION: Collapsible Accordion Tabs & Reviews with generous breathing whitespace */}
          <div className="mt-20 pt-12 border-t border-cream-dark/50 max-w-4xl mx-auto space-y-16">

            {/* Elegant Info Accordion List */}
            <div className="space-y-4">
              <h3 className="font-playfair text-xl font-bold text-chocolate tracking-wide mb-6 text-center uppercase">Product Details & Craftsmanship</h3>

              {[
                {
                  id: "description",
                  label: "Artisan Description & Flavor Profile",
                  content: (
                    <p className="text-text-mid text-sm leading-relaxed font-poppins">
                      {product.description}. Lovingly constructed layer-by-layer with moist sponge, flavored ganache infusions, and finished with flawless luxury patisserie techniques to ensure a luxurious cake centerpiece.
                    </p>
                  )
                },
                {
                  id: "ingredients",
                  label: "Pure Organic Ingredients (100% Eggless)",
                  content: (
                    <p className="text-text-mid text-sm leading-relaxed font-poppins">
                      Organic refined wheat flour, rich Belgian cocoa butter, pure farm-fresh dairy milk cream, unrefined sugar, organic madagascar vanilla bean pods, and select handpicked toppings. Completely vegetarian, eggless, and free from any chemical preservation additives.
                    </p>
                  )
                },
                {
                  id: "serving",
                  label: "Serving, Yield & Storage Guide",
                  content: (
                    <p className="text-text-mid text-sm leading-relaxed font-poppins">
                      The selected {selectedWeight} cake configuration is custom designed to yield {activeServes} luxury portions. For maximum texture and flavor, keep refrigerated at 4°C to 8°C. Best served chilled or within 20 minutes of removing from the refrigerator.
                    </p>
                  )
                },
                {
                  id: "promise",
                  label: "The Cake Lounge White-Glove Promise",
                  content: (
                    <p className="text-text-mid text-sm leading-relaxed font-poppins">
                      We promise absolute perfection. Your cake is baked entirely fresh to order (never pre-frozen) and hand-delivered directly to your address in DLF or wider Gurugram in customized cooling vehicles to guarantee zero damage or melting.
                    </p>
                  )
                },
                {
                  id: "care",
                  label: "Cake Care, Slicing & Preservation advice",
                  content: (
                    <p className="text-text-mid text-sm leading-relaxed font-poppins">
                      Use a warm, dry metal knife to achieve beautiful clean cuts. Slices should be served immediately. Leftovers can be stored in an airtight container inside the refrigerator for up to 3 days to preserve texture and cream hydration.
                    </p>
                  )
                }
              ].map((section) => (
                <div key={section.id} className="border-b border-cream-dark/30 pb-3">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex justify-between items-center text-left py-3 cursor-pointer group bg-transparent border-none outline-none"
                  >
                    <span className="font-playfair text-[0.95rem] font-bold text-chocolate group-hover:text-rose-deep transition-colors">
                      {section.label}
                    </span>
                    {expandedSection === section.id ? (
                      <ChevronUp size={16} className="text-rose-deep" />
                    ) : (
                      <ChevronDown size={16} className="text-text-soft" />
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedSection === section.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 pb-4 pr-4">
                          {section.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* PREMIUM LUXURY CUSTOMER REVIEWS */}
            <div className="space-y-8 pt-4">
              <div className="text-center space-y-2">
                <span className="text-rose font-bold text-[10px] uppercase tracking-[0.2em]">Customer Reviews</span>
                <h3 className="font-playfair text-2xl font-bold text-chocolate tracking-wide">Testimonials of Excellence</h3>
              </div>

              {/* Review cards feed (Desktop columns / mobile stack) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {luxuryReviews.map((rev, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl border border-cream-dark/30 shadow-[0_4px_16px_rgba(61,31,16,0.02)] space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-gold">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} size={11} fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-[10px] text-text-soft/60 font-semibold">{rev.date}</span>
                      </div>
                      <p className="text-text-mid text-xs leading-relaxed italic">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-cream/50">
                      <div className="w-8 h-8 rounded-full bg-cream-dark text-chocolate text-xs font-bold flex items-center justify-center shrink-0">
                        {rev.avatar}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-chocolate truncate">{rev.name}</span>
                          <span title="Verified luxury purchaser">
                            <UserCheck size={11} className="text-green-600 shrink-0" />
                          </span>
                        </div>
                        <span className="text-[9px] text-text-soft truncate">{rev.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Related products recommendation pool */}
          <div className="mt-16">
            <ProductRecommendations currentProduct={product} allProducts={products} />
          </div>

        </div>
      </div>
    </PageWrapper>
  );
};

export default ProductDetail;
