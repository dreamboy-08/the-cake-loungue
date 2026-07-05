"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIChatWindow from './AIChatWindow';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpen);
    return () => window.removeEventListener('open-ai-chat', handleOpen);
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[998]">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="relative group"
            >
              {/* Tooltip/Greeting */}
              <div className="absolute bottom-full right-0 mb-4 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-chocolate text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-xl border border-white/10 flex items-center gap-2">
                  <Sparkles size={14} className="text-blush" />
                  Ask Cake Lounge AI
                </div>
                <div className="w-3 h-3 bg-chocolate rotate-45 absolute -bottom-1.5 right-6" />
              </div>

              {/* Main Button */}
              <button
                onClick={() => setIsOpen(true)}
                className="w-16 h-16 bg-rose-deep text-white rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95 group"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-chocolate/20 to-transparent" />
                <MessageSquare size={28} className="relative z-10 transition-transform group-hover:rotate-12" />

                {/* Notification Badge */}
                <span className="absolute top-0 right-0 w-4 h-4 bg-gold rounded-full border-2 border-white animate-pulse" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AIChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </>
  );
};

export default AIChatWidget;
