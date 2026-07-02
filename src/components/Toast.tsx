"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast = ({ message, isVisible, onClose }: ToastProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-md"
        >
          <div className="bg-chocolate text-white px-6 py-4 rounded-[22px] shadow-2xl border border-white/10 flex items-center justify-between gap-4 backdrop-blur-md bg-opacity-95">
            <div className="flex items-center gap-3">
              <div className="bg-rose-deep p-2 rounded-full shadow-lg shadow-rose-deep/30">
                <Sparkles size={18} className="text-white" />
              </div>
              <p className="font-bold text-sm leading-relaxed tracking-wide">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
