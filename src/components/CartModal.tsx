"use client";

import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, cartTotal } = useCart();
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col shadow-lg">
        <div className="flex justify-between items-center p-5 border-b border-cream">
          <h3 className="m-0 text-chocolate font-bold text-lg">Your Cart</h3>
          <button onClick={onClose} className="bg-none border-none text-xl text-text-mid cursor-pointer p-1">
            <X size={24} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {cart.length === 0 ? (
            <p className="text-center text-text-soft py-10">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center gap-3 py-3 border-b border-cream last:border-b-0">
                <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-white border border-cream relative">
                  <Image src={item.img} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="m-0 text-sm font-semibold text-chocolate line-clamp-1">{item.name}</h4>
                  <div className="text-rose font-bold text-sm">₹{item.price} x {item.quantity}</div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-none border-none text-rose cursor-pointer p-2 hover:bg-cream rounded-full transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t border-cream flex justify-between items-center bg-cream/30">
          <div className="text-lg font-bold text-chocolate">Total: ₹{cartTotal}</div>
          <button
            onClick={() => {
              onClose();
              router.push('/checkout');
            }}
            disabled={cart.length === 0}
            className="btn btn-primary px-8"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
