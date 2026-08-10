"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';

const CartBubble = () => {
  const { websiteSettings } = useCMS();

  const rawWhatsapp = websiteSettings?.whatsapp || "+91 77038 70170";
  const whatsappNumber = rawWhatsapp.replace(/[^0-9]/g, '');

  return (
    <>
      {/* WhatsApp Bubble */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[28px] right-[28px] z-[999] bg-[#25d366] text-white w-[58px] h-[58px] rounded-full flex items-center justify-center text-[1.3rem] shadow-lg cursor-pointer transition-all duration-350 hover:scale-110 hover:bg-[#128c7e]"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
    </>
  );
};

export default CartBubble;
