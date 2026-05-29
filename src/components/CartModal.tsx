"use client";

import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, isLoading } = useCart();
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
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

            <div className="p-6 overflow-y-auto flex-1 bg-cream/10">
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
                <div className="space-y-4">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-cream/50 group"
                      >
                        <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-[#f7efe6] relative border border-cream">
                          <Image src={item.img} alt={item.name} fill className="object-cover" />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="m-0 text-[0.95rem] font-bold text-chocolate line-clamp-1 leading-tight">{item.name}</h4>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-text-soft hover:text-rose-deep transition-colors shrink-0"
                                aria-label={`Remove ${item.name} from cart`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <p className="text-xs text-text-soft mt-1">{item.flavor || 'Standard'}</p>
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            <div className="text-rose-deep font-bold">₹{item.price * item.quantity}</div>

                            <div className="flex items-center gap-3 bg-cream/50 rounded-full px-2 py-1 border border-cream">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white text-chocolate transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-sm font-bold text-chocolate min-w-[1.2rem] text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
              )}
            </div>

            <div className="p-8 border-t border-cream bg-white space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-soft font-medium">Subtotal</span>
                <span className="text-2xl font-bold text-chocolate">₹{cartTotal}</span>
              </div>

              <button
                onClick={() => {
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
