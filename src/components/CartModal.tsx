"use client";

import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from './BackButton';
import { useProducts } from '@/context/ProductsContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, isLoading, addToCart } = useCart();
  const router = useRouter();
  const { products } = useProducts();

  const recommendations = React.useMemo(() => {
    const cartItemIds = cart.map((item) => item.id.toString());

    if (cart.length === 0) {
      return products
        .filter(p => p.tag === 'Bestseller' || p.tag === 'Trending' || p.rating >= 4)
        .filter(p => !cartItemIds.includes(p.id.toString()))
        .slice(0, 4);
    }

    const cartCategories = Array.from(new Set(cart.map((item) => {
      const matchingProduct = products.find(p => p.id.toString() === item.id.toString());
      return matchingProduct ? matchingProduct.category : null;
    }).filter(Boolean)));

    const eligibleProducts = products.filter((p) => !cartItemIds.includes(p.id.toString()));

    const scoredCakes = eligibleProducts.map((product) => {
      let score = 0;
      if (cartCategories.includes(product.category)) {
        score += 100;
      }
      if (product.tag === 'Bestseller' || product.tag === 'Trending') {
        score += 20;
      }
      score += product.rating * 5 + (product.reviews / 5);

      return { product, score };
    });

    scoredCakes.sort((a, b) => b.score - a.score);
    return scoredCakes.map((s) => s.product).slice(0, 4);
  }, [cart, products]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="cart-drawer-overlay" className="fixed inset-0 z-[1000] flex items-center justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-chocolate/60"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative z-10 bg-white h-full w-full max-w-[450px] flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center p-6 border-b border-cream bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-rose-deep" size={24} />
                <h3 className="m-0 text-chocolate font-bold text-xl font-playfair">Your Cart ({cartCount})</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-cream rounded-full transition-colors text-text-soft"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-cream bg-white">
              <BackButton
                className="mb-0"
                ariaLabel="Go back"
                onClick={onClose}
                isFloating={false}
              />
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-cream">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <Loader2 className="animate-spin text-rose-deep" size={40} />
                  <p className="text-chocolate font-medium">Loading your cart...</p>
                </div>
              ) : cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center text-rose/30">
                    <ShoppingBag size={40} />
                  </div>
                  <p className="text-chocolate font-medium">Your cart is feeling light...</p>
                  <button
                    onClick={onClose}
                    className="text-rose-deep font-bold text-sm hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {cart.map((item) => (
                        <motion.div
                          key={item.cartItemId}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-white rounded-[22px] p-4 flex gap-4 shadow-sm border border-cream/50 group"
                        >
                          <div
                            onClick={() => {
                              onClose();
                              router.push(`/shop/${item.id}`);
                            }}
                            className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-[#f7efe6] relative border border-cream cursor-pointer hover:opacity-90 transition-opacity"
                          >
                            <Image src={item.img} alt={item.name} fill className="object-cover" />
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div
                              onClick={() => {
                                onClose();
                                router.push(`/shop/${item.id}`);
                              }}
                              className="cursor-pointer group/details"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="m-0 text-[0.95rem] font-bold text-chocolate group-hover/details:text-rose-deep line-clamp-1 leading-tight transition-colors">{item.name}</h4>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromCart(item.cartItemId);
                                  }}
                                  className="text-text-soft hover:text-rose-deep transition-colors shrink-0"
                                  aria-label={`Remove ${item.name} from cart`}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <p className="text-xs text-text-soft mt-1">
                                {[
                                  item.flavor,
                                  item.weight,
                                  item.serves ? `Serves ${item.serves}` : null
                                ].filter(Boolean).join(' • ') || 'Standard Weight'}
                              </p>
                              {item.message && (
                                <p className="text-[11px] font-bold text-rose-deep mt-1 bg-cream-dark/30 px-2 py-0.5 rounded-md inline-block">
                                  Message: &ldquo;{item.message}&rdquo;
                                </p>
                              )}
                            </div>

                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex justify-between items-center mt-2"
                            >
                              <div className="text-rose-deep font-bold">₹{item.price * item.quantity}</div>

                              <div className="flex items-center gap-3 bg-cream rounded-full px-2 py-1 border border-cream">
                                <button
                                  onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white text-chocolate transition-colors"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-sm font-bold text-chocolate min-w-[1.2rem] text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white text-chocolate transition-colors"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Recommendations Section */}
                  {recommendations.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-cream/80">
                      <h4 className="text-chocolate font-bold text-base font-playfair mb-4 flex items-center gap-2">
                        <span>✨</span> You May Also Like
                      </h4>

                      <div className="grid grid-cols-1 gap-4">
                        {recommendations.map((prod) => (
                          <div
                            key={prod.id}
                            className="bg-white rounded-[20px] p-3 flex gap-3 shadow-sm border border-cream/50 hover:shadow-md transition-all"
                          >
                            <div
                              onClick={() => {
                                onClose();
                                router.push(`/shop/${prod.id}`);
                              }}
                              className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-[#f7efe6] relative border border-cream cursor-pointer hover:opacity-90 transition-opacity"
                            >
                              <Image src={prod.img} alt={prod.name} fill className="object-cover" />
                            </div>

                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div
                                onClick={() => {
                                  onClose();
                                  router.push(`/shop/${prod.id}`);
                                }}
                                className="cursor-pointer group/rec min-w-0"
                              >
                                <h5 className="m-0 text-xs font-bold text-chocolate truncate group-hover/rec:text-rose-deep transition-colors leading-snug">{prod.name}</h5>
                                <p className="text-[10px] text-text-soft mt-0.5 truncate">{prod.category}</p>
                              </div>

                              <div className="flex justify-between items-center mt-1">
                                <span className="text-sm font-bold text-rose-deep">₹{prod.price}</span>
                                <button
                                  onClick={() => {
                                    addToCart({
                                      id: prod.id,
                                      name: prod.name,
                                      price: prod.price,
                                      img: prod.img,
                                      weight: prod.weights?.[0]?.label || '0.5 Kg',
                                    });
                                  }}
                                  className="px-3 py-1 bg-rose-deep hover:bg-brown text-white rounded-full text-[10px] font-bold transition-all hover:scale-105 active:scale-95"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-8 border-t border-cream bg-white space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-soft font-medium">Subtotal</span>
                <span className="text-2xl font-bold text-chocolate">₹{cartTotal}</span>
              </div>

              <button
                onClick={() => {
                  sessionStorage.removeItem('cakeLounge_buyNowItem');
                  onClose();
                  router.push('/checkout');
                }}
                disabled={cart.length === 0}
                className="w-full py-4 bg-rose-deep text-white rounded-full font-bold text-lg shadow-lg shadow-rose-deep/20 hover:bg-brown hover:-translate-y-0.5 transition-all disabled:bg-text-soft disabled:cursor-not-allowed disabled:transform-none"
              >
                Checkout Now
              </button>

              <p className="text-[0.7rem] text-center text-text-soft">
                Shipping and taxes calculated at checkout
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
