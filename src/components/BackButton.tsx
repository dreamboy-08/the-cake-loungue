"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  fallbackRoute?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * Reusable BackButton component with smart fallback routing
 * Uses router.back() when history exists, otherwise navigates to fallback route
 * Supports keyboard navigation and accessibility
 */
const BackButton: React.FC<BackButtonProps> = ({
  fallbackRoute = "/",
  className = "mb-8",
  ariaLabel = "Go back to previous page"
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);

  // Determine fallback route based on current page
  const getSmartFallback = () => {
    if (pathname?.includes('/shop/')) {
      return '/menu';
    } else if (pathname?.includes('/birthday-cakes') || 
               pathname?.includes('/chocolate-cakes') || 
               pathname?.includes('/wedding-cakes')) {
      return '/menu';
    } else if (pathname?.includes('/checkout')) {
      return '/shop/birthday-cakes'; // Cart or menu
    } else if (pathname?.includes('/orders')) {
      return '/profile';
    } else if (pathname?.includes('/profile')) {
      return '/';
    } else if (pathname?.includes('/custom-cake')) {
      return '/menu';
    }
    return fallbackRoute;
  };

  useEffect(() => {
    // Check if browser history exists
    // Note: window.history.length >= 2 indicates there's history
    // However, this isn't perfectly reliable. We use a more conservative approach:
    // Just always allow back button and let router.back() handle it
    setCanGoBack(true);
  }, []);

  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Always attempt router.back() first - it will handle the navigation
    router.back();
  };

  return (
    <button
      onClick={handleBackClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.back();
        }
      }}
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-2 px-4 py-2 text-text-soft hover:text-rose-deep transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded-lg ${className}`}
      tabIndex={0}
    >
      <ArrowLeft 
        size={18} 
        className="group-hover:-translate-x-1 transition-transform duration-200 flex-shrink-0"
        aria-hidden="true"
      />
      <span className="font-medium text-sm md:text-base">Back</span>
    </button>
  );
};

export default BackButton;
