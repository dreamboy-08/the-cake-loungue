"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShieldCheck, Zap, Sparkles, ShoppingBag } from 'lucide-react';

interface AuthReminderPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onCreateAccount: () => void;
}

const AuthReminderPopup: React.FC<AuthReminderPopupProps> = ({
  isOpen,
  onClose,
  onSignIn,
  onCreateAccount,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[500] w-[calc(100vw-32px)] sm:w-96 max-w-sm pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-cream border border-cream-dark rounded-[24px] p-6 shadow-[0_10px_30px_rgba(44,34,30,0.15)] overflow-hidden relative"
          >
            {/* Elegant Top Decorative Banner */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-deep via-rose to-gold" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white hover:bg-cream-dark text-text-soft hover:text-rose rounded-full flex items-center justify-center transition-all duration-350 shadow-sm border border-cream-dark"
              aria-label="Close reminder"
            >
              <X size={14} />
            </button>

            {/* Heading */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white border border-cream-dark rounded-full flex items-center justify-center text-rose shadow-sm">
                <Sparkles size={18} className="text-rose-deep" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-chocolate leading-tight">
                Join The Cake Lounge
              </h3>
            </div>

            {/* Description */}
            <p className="text-text-mid text-xs md:text-sm leading-relaxed mb-4">
              Sign in to unlock a better shopping experience.
            </p>

            {/* Benefits List */}
            <ul className="space-y-2 mb-5">
              <li className="flex items-start gap-2 text-xs font-medium text-text-mid">
                <Heart size={14} className="text-rose fill-rose shrink-0 mt-0.5" />
                <span>Save your favourite cakes</span>
              </li>
              <li className="flex items-start gap-2 text-xs font-medium text-text-mid">
                <Zap size={14} className="text-gold fill-gold shrink-0 mt-0.5" />
                <span>Faster checkout</span>
              </li>
              <li className="flex items-start gap-2 text-xs font-medium text-text-mid">
                <ShoppingBag size={14} className="text-rose-deep shrink-0 mt-0.5" />
                <span>Track your orders</span>
              </li>
              <li className="flex items-start gap-2 text-xs font-medium text-text-mid">
                <ShieldCheck size={14} className="text-green-600 shrink-0 mt-0.5" />
                <span>Access your favourites from any device</span>
              </li>
            </ul>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onSignIn}
                  className="bg-rose-deep hover:bg-brown text-white font-bold py-2.5 px-4 rounded-xl text-xs text-center shadow-sm hover:scale-[1.02] transition-all cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={onCreateAccount}
                  className="bg-white hover:bg-cream-dark text-chocolate border border-cream-dark hover:border-chocolate/20 font-bold py-2.5 px-4 rounded-xl text-xs text-center transition-all cursor-pointer"
                >
                  Create Account
                </button>
              </div>
              <button
                onClick={onClose}
                className="text-center text-text-soft hover:text-rose font-semibold text-[11px] py-1 transition-colors cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthReminderPopup;
