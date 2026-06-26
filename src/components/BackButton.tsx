"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BackButtonProps {
  fallbackRoute?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * Reusable BackButton component with smart fallback routing and Home navigation
 * Uses router.back() when history exists, otherwise navigates to fallback route
 */
const BackButton: React.FC<BackButtonProps> = ({
  fallbackRoute = "/",
  className = "mb-6",
  ariaLabel = "Go back to previous page"
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if browser history exists (simplistic check for client-side)
    if (typeof window !== 'undefined' && window.history.length > 1) {
      setCanGoBack(true);
    }
  }, []);

  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (canGoBack) {
      router.back();
    } else {
      router.push(getSmartFallback());
    }
  };

  const getSmartFallback = () => {
    if (pathname?.includes('/policies/')) return '/policies';
    if (pathname?.includes('/shop/')) return '/menu';
    if (pathname?.includes('/orders/')) return '/orders';
    if (pathname?.includes('/profile')) return '/';
    if (pathname?.includes('/custom-cake')) return '/';
    return fallbackRoute;
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.button
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleBackClick}
        aria-label={ariaLabel}
        className="inline-flex items-center gap-2 px-4 py-2 text-text-soft hover:text-rose-deep transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded-[18px]"
        tabIndex={0}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-chocolate rounded-full shadow-sm border border-cream hover:border-rose/30 hover:shadow-md transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-deep"
      >
        <ArrowLeft
          size={18}
          className="text-rose-deep group-hover:scale-110 transition-transform duration-300"
        />
        <span className="font-semibold text-sm uppercase tracking-wider">Back</span>
      </motion.button>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 text-text-soft hover:text-rose-deep transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded-[18px]"
        aria-label="Go to homepage"
      >
        <Home
          size={18}
          className="group-hover:scale-110 transition-transform duration-200 flex-shrink-0"
          aria-hidden="true"
        />
        <span className="font-medium text-sm md:text-base">Home</span>
      </Link>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center bg-white text-text-soft rounded-full shadow-sm border border-cream hover:text-rose-deep hover:border-rose/30 hover:shadow-md transition-all duration-300 group"
          aria-label="Go to homepage"
        >
          <Home size={18} />
        </Link>
      </motion.div>
    </div>
  );
};

export default BackButton;
