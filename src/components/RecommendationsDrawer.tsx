"use client";

import React, { useEffect, useRef } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Product } from '@/constants/products';
import { motion, AnimatePresence } from 'framer-motion';
import RecommendationCard from './RecommendationCard';

interface RecommendationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const RecommendationsDrawer: React.FC<RecommendationsDrawerProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Focus trap implementation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!drawerRef.current) return;

    const focusableElements = drawerRef.current.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex="0"]'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab -> Wrap to last element
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab -> Wrap to first element
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  // Automatically focus the first focusable element (like the Back button) when opened
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      setTimeout(() => {
        const firstBtn = drawerRef.current?.querySelector('button, a') as HTMLElement;
        if (firstBtn) firstBtn.focus();
      }, 50);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[99998] cursor-pointer"
            aria-hidden="true"
          />

          {/* Right Sliding Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }} // ease-out cubic-like
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            className="fixed top-0 right-0 h-full bg-cream-light border-l border-cream-dark z-[99999] shadow-2xl flex flex-col w-full sm:w-[60%] lg:w-[45%] transform-gpu overflow-hidden"
          >
            {/* Drawer Header (Sticky) */}
            <header className="sticky top-0 bg-white border-b border-cream-dark p-4 md:px-6 flex items-center justify-between z-30 shadow-sm shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-cream hover:bg-cream-dark flex items-center justify-center text-chocolate hover:text-rose-deep border-none cursor-pointer transition-colors duration-200 outline-none focus:ring-2 focus:ring-rose-deep"
                  aria-label="Back to page"
                >
                  <ArrowLeft size={20} />
                </button>
                <h2
                  id="drawer-title"
                  className="text-lg md:text-xl font-bold font-playfair text-chocolate"
                >
                  You May Also Like
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-cream hover:bg-cream-dark flex items-center justify-center text-chocolate hover:text-rose-deep border-none cursor-pointer transition-colors duration-200 outline-none focus:ring-2 focus:ring-rose-deep"
                aria-label="Close recommendations drawer"
              >
                <X size={20} />
              </button>
            </header>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-8">
              {/* Cakes Section */}
              {products.filter(p => p.tag !== 'Decoration').length > 0 && (
                <div>
                  <h3 className="text-sm font-bold font-playfair text-chocolate mb-4 uppercase tracking-wider border-b border-cream-dark pb-2">
                    Cakes
                  </h3>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.1,
                        }
                      }
                    }}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                  >
                    {products.filter(p => p.tag !== 'Decoration').map((product) => (
                      <motion.div
                        key={product.id}
                        variants={{
                          hidden: { opacity: 0, y: 15 },
                          show: {
                            opacity: 1,
                            y: 0,
                            transition: {
                              type: "spring",
                              stiffness: 100,
                              damping: 15
                            }
                          }
                        }}
                      >
                        <RecommendationCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}

              {/* Decorations Section */}
              {products.filter(p => p.tag === 'Decoration').length > 0 && (
                <div>
                  <h3 className="text-sm font-bold font-playfair text-chocolate mb-4 uppercase tracking-wider border-b border-cream-dark pb-2">
                    Decorations
                  </h3>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.1,
                        }
                      }
                    }}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                  >
                    {products.filter(p => p.tag === 'Decoration').map((product) => (
                      <motion.div
                        key={product.id}
                        variants={{
                          hidden: { opacity: 0, y: 15 },
                          show: {
                            opacity: 1,
                            y: 0,
                            transition: {
                              type: "spring",
                              stiffness: 100,
                              damping: 15
                            }
                          }
                        }}
                      >
                        <RecommendationCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
