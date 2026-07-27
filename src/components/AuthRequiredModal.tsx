"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShieldAlert } from 'lucide-react';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onCreateAccount: () => void;
}

const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  onCreateAccount,
}) => {
  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Support Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-chocolate/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative bg-cream border border-cream-dark w-full max-w-md rounded-[32px] p-8 md:p-10 shadow-2xl z-[601] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
          >
            {/* Elegant Background Accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-light/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold-light/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-white hover:bg-cream-dark text-chocolate hover:text-rose rounded-full flex items-center justify-center transition-all duration-350 shadow-sm border border-cream-dark z-10"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Icon Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-white border border-cream-dark rounded-full flex items-center justify-center text-rose-deep shadow-md mb-4 relative">
                <Heart size={30} className="fill-rose-deep animate-pulse" />
                <div className="absolute -bottom-1 -right-1 bg-gold text-chocolate p-1 rounded-full shadow-sm">
                  <ShieldAlert size={12} />
                </div>
              </div>

              <h2
                id="auth-modal-title"
                className="font-playfair text-2xl md:text-3xl font-bold text-chocolate leading-tight"
              >
                Save Your Favourite Cakes ❤️
              </h2>
            </div>

            {/* Description */}
            <p className="text-text-mid text-sm md:text-base text-center leading-relaxed mb-8">
              Sign in to save your favourite cakes and desserts so you can access them anytime from any device.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={onSignIn}
                className="w-full bg-rose-deep hover:bg-brown text-white font-bold py-3.5 rounded-full shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-350 text-sm md:text-base text-center cursor-pointer"
              >
                Sign In
              </button>

              <button
                onClick={onCreateAccount}
                className="w-full bg-white hover:bg-cream-dark text-chocolate border-2 border-cream-dark hover:border-chocolate/20 font-bold py-3 rounded-full transition-all duration-350 text-sm md:text-base text-center cursor-pointer"
              >
                Create Account
              </button>

              <button
                onClick={onClose}
                className="w-full text-center text-text-soft hover:text-rose font-semibold text-xs md:text-sm py-2 mt-2 transition-colors cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthRequiredModal;
