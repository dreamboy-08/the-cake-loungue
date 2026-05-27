"use client";

import React, { useState } from 'react';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartModal from './CartModal';

const CartBubble = () => {
  const { cartCount } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Shopping Cart Bubble */}
      <div
        id="cart-bubble"
        className="fixed bottom-[28px] right-[28px] z-[999] bg-rose-deep text-white w-[58px] h-[58px] rounded-full flex items-center justify-center text-[1.3rem] shadow-lg cursor-pointer transition-all duration-350 hover:scale-110 hover:bg-brown"
        onClick={() => setIsModalOpen(true)}
      >
        <ShoppingCart size={24} />
        {cartCount > 0 && (
          <div className="absolute top-1 right-1 bg-gold text-chocolate text-[0.65rem] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {cartCount}
          </div>
        )}
      </div>

      {/* WhatsApp Bubble */}
      <a
        href="https://wa.me/919910519242"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[100px] right-[28px] z-[999] bg-[#25d366] text-white w-[58px] h-[58px] rounded-full flex items-center justify-center text-[1.3rem] shadow-lg cursor-pointer transition-all duration-350 hover:scale-110 hover:bg-[#128c7e]"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
      </a>

      <CartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default CartBubble;
