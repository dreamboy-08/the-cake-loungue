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

  // States to track the dynamic position of the navbar
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const lastScrollTopRef = useRef(0);

  // State to track if any overlay/drawer is open
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.history.length > 1) {
      setCanGoBack(true);
    }
  }, []);

  // Scroll listener for fading and positioning relative to Navbar
  useEffect(() => {
    if (!isFloating || !mounted) return;

    let scrollTimeout: NodeJS.Timeout;
    let ticking = false;

    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      const lastScrollTop = lastScrollTopRef.current;
      const atTop = currentScrollY <= 10;
      setIsAtTop(atTop);

      // Match Navbar scrolled state
      const scrolled = currentScrollY > 50;
      setIsScrolled(scrolled);

      // Match Navbar hidden state
      const navbarHidden = currentScrollY > lastScrollTop && currentScrollY > 120;
      setIsNavbarHidden(navbarHidden);

      lastScrollTopRef.current = currentScrollY <= 0 ? 0 : currentScrollY;

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

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [isFloating, mounted]);

  // Mutation observer to detect active overlays (modals, drawers, search)
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

  // Dynamically compute top position below the navbar
  const getFloatingTopStyle = () => {
    if (isNavbarHidden) {
      return "calc(env(safe-area-inset-top) + 20px)";
    }
    if (isScrolled) {
      return "calc(env(safe-area-inset-top) + 64px + 16px)"; // below scrolled navbar (64px + 16px offset)
    }
    return "calc(env(safe-area-inset-top) + 80px + 16px)"; // below non-scrolled navbar (80px + 16px offset)
  };

  const isVisible = mounted && !isOverlayOpen;

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
            style={{
              top: getFloatingTopStyle(),
            }}
            className={`fixed left-5 z-[9999] flex items-center gap-3 transition-all duration-350 ease-in-out ${
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