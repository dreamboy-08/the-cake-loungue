"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BackButtonProps {
  fallbackRoute?: string;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
  isFloating?: boolean;
}

/**
 * Reusable BackButton component with smart fallback routing and Home navigation
 * Converts to a floating, fixed navigation component when isFloating is true.
 * Dynamically repositions below any visible sticky/fixed headers on the page.
 */
const BackButton: React.FC<BackButtonProps> = ({
  fallbackRoute = "/",
  className = "mb-6",
  ariaLabel = "Go back to previous page",
  onClick,
  isFloating = true
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  // State to track the dynamically computed floating top position
  const [floatingTop, setFloatingTop] = useState(20);

  // State to track if any overlay/drawer is open
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // State to track if first layout positioning check is complete
  const [isCalibrated, setIsCalibrated] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.history.length > 1) {
      setCanGoBack(true);
    }
  }, []);

  // Dynamic sticky header offset scanner
  const updateFloatingTop = () => {
    if (typeof window === 'undefined') return;

    let maxBottom = 0;
    const candidates = document.querySelectorAll(
      'header, nav, [class*="sticky"], [class*="fixed"], [id*="navbar"], [id*="header"]'
    );
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    candidates.forEach((el) => {
      // Skip if it is our container
      if (el.closest('#floating-navigation-container')) return;

      const rect = el.getBoundingClientRect();

      // Check if the element is visible
      if (rect.width === 0 || rect.height === 0) return;

      // Check height is reasonable for a sticky header/bar (under 40% of viewport)
      if (rect.height > viewportHeight * 0.4) return;

      // Must overlap with the left half of the screen
      if (rect.left >= viewportWidth * 0.5) return;

      // Must be in contact with or near the top of the viewport
      if (rect.top > 200 || rect.bottom <= 10) return;

      // Verify computed style position
      const style = window.getComputedStyle(el);
      if (style.position === 'fixed' || style.position === 'sticky') {
        if (rect.bottom > maxBottom) {
          maxBottom = rect.bottom;
        }
      }
    });

    const newTop = maxBottom > 0 ? maxBottom + 16 : 20;
    setFloatingTop(newTop);
    setIsCalibrated(true);
  };

  // Scroll listener for fading and dynamic positioning calculation
  useEffect(() => {
    if (!isFloating || !mounted) return;

    let scrollTimeout: NodeJS.Timeout;
    let ticking = false;

    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      const atTop = currentScrollY <= 10;
      setIsAtTop(atTop);

      if (atTop) {
        setIsScrolling(false);
      } else {
        setIsScrolling(true);
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
          setIsScrolling(false);
        }, 200); // 200ms threshold for scrolling stop detection
      }

      // Compute dynamic top offset
      updateFloatingTop();

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollState();
        });
        ticking = true;
      }
    };

    updateScrollState();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateFloatingTop, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateFloatingTop);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [isFloating, mounted]);

  // Mutation observer to detect active overlays and recalculate position
  useEffect(() => {
    if (!isFloating || !mounted) return;

    const checkOverlays = () => {
      const bodyOverflowHidden = document.body.style.overflow === 'hidden';
      const searchActive = !!document.querySelector('.z-\\[98\\]');
      const cartActive = !!document.getElementById('cart-drawer-overlay');
      const mobileMenuActive = !!document.getElementById('mobile-menu-overlay');
      const modalActive = !!document.querySelector('[role="dialog"], [aria-modal="true"]');

      setIsOverlayOpen(bodyOverflowHidden || searchActive || cartActive || mobileMenuActive || modalActive);
    };

    checkOverlays();

    const observer = new MutationObserver(() => {
      checkOverlays();
      updateFloatingTop();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => {
      observer.disconnect();
    };
  }, [isFloating, mounted]);

  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onClick) onClick();
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

  const isVisible = mounted && !isOverlayOpen && isCalibrated;

  if (isFloating) {
    return (
      <>
        {/* Invisible Placeholder to prevent layout shifts */}
        <div
          className={`invisible pointer-events-none select-none flex items-center gap-3 ${className}`}
          aria-hidden="true"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-cream">
            <ArrowLeft size={18} />
            <span className="font-semibold text-sm uppercase tracking-wider">Back</span>
          </div>
          <div className="w-10 h-10 rounded-full border border-cream" />
        </div>

        {/* Real Fixed / Floating BackButton */}
        {mounted && (
          <div
            id="floating-navigation-container"
            style={{
              top: floatingTop > 20 ? `${floatingTop}px` : "calc(env(safe-area-inset-top) + 20px)",
            }}
            className={`fixed left-5 z-[9999] flex items-center gap-3 transition-[opacity,transform] duration-300 ease-out ${
              !isVisible
                ? 'opacity-0 pointer-events-none scale-95'
                : (isAtTop || !isScrolling)
                ? 'opacity-100 pointer-events-auto scale-100'
                : 'opacity-40 pointer-events-auto scale-100'
            } hover:opacity-100`}
          >
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackClick}
              aria-label={ariaLabel}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-white text-chocolate rounded-full shadow-sm border border-cream hover:border-rose/30 hover:shadow-md transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-deep before:absolute before:-inset-1 before:content-['']"
            >
              <ArrowLeft
                size={18}
                className="text-rose-deep group-hover:scale-110 transition-transform duration-300"
              />
              <span className="font-semibold text-sm uppercase tracking-wider">Back</span>
            </motion.button>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                onClick={() => {
                  if (onClick) onClick();
                }}
                className="relative w-10 h-10 flex items-center justify-center bg-white text-text-soft rounded-full shadow-sm border border-cream hover:text-rose-deep hover:border-rose/30 hover:shadow-md transition-all duration-300 group before:absolute before:-inset-1 before:content-['']"
                aria-label="Go to homepage"
              >
                <Home size={18} />
              </Link>
            </motion.div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.button
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleBackClick}
        aria-label={ariaLabel}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-chocolate rounded-full shadow-sm border border-cream hover:border-rose/30 hover:shadow-md transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-deep"
      >
        <ArrowLeft
          size={18}
          className="text-rose-deep group-hover:scale-110 transition-transform duration-300"
        />
        <span className="font-semibold text-sm uppercase tracking-wider">Back</span>
      </motion.button>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href="/"
          onClick={() => {
            if (onClick) onClick();
          }}
          className="w-10 h-10 flex items-center justify-center bg-white text-text-soft rounded-full shadow-sm border border-cream hover:text-rose-deep hover:border-rose/30 hover:shadow-md transition-all duration-300 group"
          aria-label="Go to homepage"
          style={{ cursor: 'pointer' }}
        >
          <Home size={18} />
        </Link>
      </motion.div>
    </div>
  );
};

export default BackButton;