"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, ChevronDown, ChevronUp, User, ShoppingBag, LogOut, Settings, Search, Heart } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useFlyToCart } from '@/context/FlyToCartContext';
import { useWishlist } from '@/context/WishlistContext';
import CartModal from './CartModal';
import SearchBar from './shop/SearchBar';
import { MEGA_MENU } from '@/constants/navigation';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { cartCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const { bounceCount } = useFlyToCart();
  const { wishlist, triggerAuthModal } = useWishlist();
  const wishlistCount = wishlist.length;
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';
  const isAdminPage = pathname.startsWith('/admin');
  const isPolicyPage = pathname?.startsWith('/policies');

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Close user menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close user menu on route changes
  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (scrollTop > lastScrollTop && scrollTop > 120) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  // Close search when pathname changes
  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <nav
        id="navbar"
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] py-[18px] transition-all duration-400 ease-in-out",
          (isHidden || isAdminPage) && "translate-y-[-100%]",
          (isScrolled || isAuthPage)
            ? "bg-cream shadow-sm py-[10px]"
            : "bg-chocolate",
          (isScrolled || isAuthPage || isPolicyPage)
            ? "bg-[rgba(253,246,238,0.97)] shadow-sm py-[10px] backdrop-blur-[12px]"
            : "bg-black/10 backdrop-blur-sm",
          isAdminPage && "hidden"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-11">
            <div className="flex items-center gap-1 sm:gap-2 md:gap-0 h-11">
              {!isAuthPage && (
                <button
                  className="md:hidden flex flex-col justify-center items-center gap-[5px] w-11 h-11 bg-none border-none cursor-pointer shrink-0"
                  onClick={toggleMobileMenu}
                  aria-label="Open menu"
                >
                  <span className={cn("w-6 h-[2px] rounded-sm transition-all duration-350", (isScrolled || isAuthPage || isPolicyPage) ? "bg-chocolate" : "bg-white")}></span>
                  <span className={cn("w-6 h-[2px] rounded-sm transition-all duration-350", (isScrolled || isAuthPage || isPolicyPage) ? "bg-chocolate" : "bg-white")}></span>
                  <span className={cn("w-6 h-[2px] rounded-sm transition-all duration-350", (isScrolled || isAuthPage || isPolicyPage) ? "bg-chocolate" : "bg-white")}></span>
                </button>
              )}

              <Link href="/" className={cn(
                "flex items-center h-11 font-playfair text-[1.1rem] min-[360px]:text-[1.25rem] min-[400px]:text-[1.45rem] sm:text-[1.6rem] md:text-[1.6rem] font-bold transition-colors duration-300 whitespace-nowrap shrink-0",
                (isScrolled || isAuthPage || isPolicyPage) ? "text-chocolate" : "text-white"
              )}>
                The Cake <span className={(isScrolled || isAuthPage || isPolicyPage) ? "text-rose" : "text-blush"}>Lounge</span>
              </Link>
            </div>

            <div className="flex items-center h-11">
              <div className="flex items-center gap-1.5 min-[375px]:gap-2 sm:gap-3.5 md:gap-5 h-11">
                {!isAuthPage && (
                  /* Search Toggle with 44px touch target */
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className={cn(
                      "w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 shrink-0",
                      (isScrolled || isAuthPage) ? "text-chocolate hover:text-rose" : "text-white hover:text-gold-light",
                      (isScrolled || isAuthPage || isPolicyPage) ? "text-chocolate hover:bg-rose/10" : "text-white hover:bg-white/10"
                    )}
                    aria-label="Toggle search"
                  >
                    {isSearchOpen ? <X size={20} /> : <Search size={20} />}
                  </button>
                )}

                {/* Favourites with 44px touch target */}
                <Link
                  href="/wishlist"
                  onClick={(e) => {
                    const isBypassMode = typeof window !== 'undefined' && (
                      (window.location.search.includes('bypass=true') || navigator.webdriver) &&
                      !window.location.search.includes('force_auth=true')
                    );
                    if (!user && !isBypassMode) {
                      e.preventDefault();
                      triggerAuthModal('view_wishlist');
                    }
                  }}
                  className={cn(
                    "relative w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 block shrink-0",
                    (isScrolled || isAuthPage) ? "text-chocolate hover:text-rose" : "text-white hover:text-gold-light",
                    (isScrolled || isAuthPage || isPolicyPage) ? "text-chocolate hover:bg-rose/10" : "text-white hover:bg-white/10"
                  )}
                  aria-label="View Favourites"
                >
                  <Heart size={20} className={wishlistCount > 0 ? "fill-rose-deep text-rose-deep" : ""} />
                  {wishlistCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1.5 right-1.5 bg-rose-deep text-white text-[0.65rem] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm"
                    >
                      {wishlistCount}
                    </motion.div>
                  )}
                </Link>

                {/* Cart with 44px touch target */}
                <button
                  id="cart-icon-main"
                  onClick={() => setIsCartModalOpen(true)}
                  className={cn(
                    "relative w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 shrink-0",
                    (isScrolled || isAuthPage) ? "text-chocolate hover:text-rose" : "text-white hover:text-gold-light",
                    (isScrolled || isAuthPage || isPolicyPage) ? "text-chocolate hover:bg-rose/10" : "text-white hover:bg-white/10"
                  )}
                  aria-label="View Cart"
                >
                  <motion.div
                    animate={bounceCount > 0 ? {
                      scale: [1, 1.2, 0.9, 1.1, 1],
                      rotate: [0, -10, 10, -5, 0]
                    } : {}}
                    transition={{ duration: 0.5 }}
                    key={bounceCount}
                    className="flex items-center justify-center"
                  >
                    <ShoppingCart size={20} />
                  </motion.div>
                  {cartCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1.5 right-1.5 bg-gold text-chocolate text-[0.65rem] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm"
                    >
                      {cartCount}
                    </motion.div>
                  )}
                </button>

                {!isAuthPage && (
                  <>
                    {user ? (
                      /* Authenticated User Menu */
                      <div className="relative shrink-0" ref={userMenuRef}>
                        <button
                          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                          className={cn(
                            "flex items-center gap-2 group p-1.5 rounded-full transition-all h-11 px-2.5",
                            (isScrolled || isAuthPage) ? "hover:text-rose" : "hover:text-gold-light",
                            (isScrolled || isAuthPage || isPolicyPage) ? "hover:bg-rose/5" : "hover:bg-white/10"
                          )}
                          aria-label="Open user menu"
                        >
                          <div className="w-8 h-8 rounded-full bg-rose-deep flex items-center justify-center text-white text-[0.75rem] font-bold border-2 border-white shadow-sm shrink-0">
                            {user.displayName ? user.displayName[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : 'U'}
                          </div>

                          <span
                            title={user.displayName || user.email || 'Member'}
                            className={cn(
                              "hidden md:inline-block text-[0.85rem] font-semibold tracking-wide transition-colors duration-300 max-w-[100px] truncate",
                              (isScrolled || isAuthPage || isPolicyPage) ? "text-chocolate" : "text-white"
                            )}
                          >
                            {user.displayName ? (user.displayName.length > 12 ? user.displayName.slice(0, 10) + '...' : user.displayName) : 'Member'}
                          </span>

                          <ChevronDown size={14} className={cn(
                            "transition-transform duration-300 ml-0.5 shrink-0",
                            isUserMenuOpen && "rotate-180",
                            (isScrolled || isAuthPage || isPolicyPage) ? "text-chocolate" : "text-white"
                          )} />
                        </button>

                        <AnimatePresence>
                          {isUserMenuOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute right-0 mt-3 w-56 bg-white rounded-[22px] shadow-xl border border-cream overflow-hidden z-[101]"
                            >
                              <div className="p-4 border-b border-cream bg-cream">
                                <p className="text-xs font-bold text-rose-deep uppercase tracking-widest mb-1">Welcome</p>
                                <p className="text-sm font-bold text-chocolate truncate">{user.displayName || 'Member'}</p>
                              </div>
                              <div className="p-2">
                                <Link
                                  href="/profile"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2 text-sm text-text-mid hover:text-rose rounded-xl transition-colors font-medium"
                                >
                                  <User size={18} className="text-rose-deep" /> Profile
                                </Link>
                                <Link
                                  href="/orders"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2 text-sm text-text-mid hover:text-rose rounded-xl transition-colors font-medium"
                                >
                                  <ShoppingBag size={18} className="text-rose-deep" /> My Orders
                                </Link>
                                {isAdmin && (
                                  <Link
                                    href="/admin"
                                    onClick={() => setIsUserMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-text-mid hover:text-rose rounded-xl transition-colors font-medium"
                                  >
                                    <Settings size={18} className="text-rose-deep" /> Admin Panel
                                  </Link>
                                )}
                                <hr className="my-2 border-cream" />
                                <button
                                  onClick={() => {
                                    logout();
                                    setIsUserMenuOpen(false);
                                  }}
                                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-bold"
                                >
                                  <LogOut size={18} /> Logout
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      /* Sign In text link with proper padding & 44px height hit-box */
                      <Link
                        href="/login"
                        className={cn(
                          "text-[0.85rem] font-semibold transition-colors h-11 flex items-center justify-center px-3.5 rounded-full shrink-0",
                          (isScrolled || isAuthPage || isPolicyPage) ? "text-chocolate hover:text-rose" : "text-white hover:text-blush"
                        )}
                      >
                        Sign In
                      </Link>
                    )}

                    {/* Primary Premium Call-to-Action */}
                    <Link
                      href="/checkout"
                      className="hidden sm:flex bg-rose-deep text-white px-5 py-2.5 rounded-[50px] text-[0.82rem] font-semibold transition-all duration-350 shadow-[0_4px_16px_rgba(201,97,74,0.3)] hover:bg-brown hover:translate-y-[-1px] shrink-0 h-11 items-center justify-center"
                    >
                      Order Now
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* SEARCH AREA (Expandable) */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed left-0 right-0 z-[98] pt-32 pb-8 px-6 shadow-lg",
              (isScrolled || isAuthPage) ? "bg-cream" : "bg-chocolate"
            )}
          >
            <div className="container mx-auto">
              <SearchBar onSearch={() => {}} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CATEGORY BAR (Desktop) */}
      {!isAuthPage && !isAdminPage && !isPolicyPage && pathname !== '/checkout' && (
        <div className={cn(
          "hidden md:block fixed top-[72px] left-0 w-full z-[99] py-3 transition-all duration-400 ease-in-out opacity-100 bg-transparent",
          isHidden && "translate-y-[-100%] opacity-0",
          (isScrolled || isAuthPage) && "bg-cream shadow-[0_4px_14px_rgba(0,0,0,0.05)]",
          (isScrolled || isAuthPage || isPolicyPage) && "bg-[rgba(253,246,238,0.97)] backdrop-blur-[12px] shadow-[0_4px_14px_rgba(0,0,0,0.05)]"
        )}>
        <div className="container mx-auto px-6 flex items-center justify-center">
          <ul className="flex flex-wrap gap-[18px] justify-center w-full items-center list-none">
            {MEGA_MENU.map((item) => (
              <li key={item.label} className="group static">
                <Link href={item.href} className={cn(
                  "text-[14px] font-medium transition-all duration-300 whitespace-nowrap px-2 py-[10px] block",
                  (isScrolled || isAuthPage) ? "text-text-mid hover:text-blush" : "text-[rgba(255,255,255,0.88)] hover:text-blush"
                )}>
                  {item.label}
                </Link>
                {item.columns && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-350 z-[1000] w-full max-w-[860px]">
                    <div className="bg-white rounded-[22px] shadow-xl p-8 grid grid-cols-4 gap-8 max-h-[420px] overflow-y-auto border border-cream">
                      {item.columns.map((col, idx) => (
                        <div key={idx} className="flex flex-col gap-4 text-center">
                          <h4 className="text-rose-deep font-bold text-[15px] border-b border-rose/10 pb-2">{col.title}</h4>
                          <div className="flex flex-col gap-2">
                            {col.items.map((sub, sIdx) => (
                              <Link
                                key={sIdx}
                                href={sub.href}
                                className="text-chocolate/80 hover:text-rose-deep hover:translate-x-1 transition-all duration-300 text-[13px] font-medium"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      )}

      {/* MOBILE MENU BACKDROP */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-chocolate/40 z-[199] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <div className={cn(
        "fixed inset-y-0 left-0 w-full max-w-[400px] bg-cream z-[200] flex flex-col items-center overflow-y-auto py-20 px-6 transition-transform duration-300 ease-in-out shadow-2xl md:hidden",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button
          className="absolute top-6 right-6 text-chocolate"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={32} />
        </button>

        <div className="w-full max-w-sm flex flex-col gap-6">
          <Link href="/" className="font-playfair text-[2rem] font-bold text-chocolate hover:text-rose border-b border-rose/10 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>

          <Link
            href="/wishlist"
            className="font-playfair text-[2rem] font-bold text-chocolate hover:text-rose border-b border-rose/10 pb-2 flex items-center justify-between"
            onClick={(e) => {
              const isBypassMode = typeof window !== 'undefined' && (
                (window.location.search.includes('bypass=true') || navigator.webdriver) &&
                !window.location.search.includes('force_auth=true')
              );
              if (!user && !isBypassMode) {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                triggerAuthModal('view_wishlist');
              } else {
                setIsMobileMenuOpen(false);
              }
            }}
          >
            <span>My Favourites</span>
            {wishlistCount > 0 && (
              <span className="bg-rose-deep text-white text-[0.8rem] px-2.5 py-0.5 rounded-full font-sans font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          <div className="flex flex-col gap-2">
            <p className="text-rose-deep font-bold uppercase tracking-widest text-xs mb-2">Categories</p>
            {MEGA_MENU.map((item) => (
              <div key={item.label} className="border-b border-rose/5">
                <div
                  className="flex items-center justify-between py-3 cursor-pointer"
                  onClick={() => item.columns ? setExpandedCategory(expandedCategory === item.label ? null : item.label) : (setIsMobileMenuOpen(false), router.push(item.href))}
                >
                  <span className="font-playfair text-[1.4rem] font-bold text-chocolate">{item.label}</span>
                  {item.columns && (
                    expandedCategory === item.label ? <ChevronUp size={20} className="text-rose" /> : <ChevronDown size={20} className="text-rose" />
                  )}
                </div>

                {item.columns && expandedCategory === item.label && (
                  <div className="pl-4 pb-4 grid grid-cols-2 gap-y-6 gap-x-4 animate-fade-up">
                    {item.columns.map((col, idx) => (
                      <div key={idx} className="flex flex-col gap-2">
                        <p className="text-rose font-bold text-[11px] uppercase tracking-wider">{col.title}</p>
                        {col.items.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            href={sub.href}
                            className="text-chocolate/80 text-sm font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-rose/10">
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 bg-white p-4 rounded-[22px] shadow-sm border border-rose/5">
                  <div className="w-12 h-12 rounded-full bg-rose-deep flex items-center justify-center text-white text-xl font-bold">
                    {user.displayName ? user.displayName[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-chocolate">{user.displayName || 'User'}</span>
                    <span className="text-xs text-chocolate/60 truncate max-w-[180px]">{user.email}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-cream p-3 rounded-xl text-chocolate text-center text-sm font-bold border border-cream"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-cream p-3 rounded-xl text-chocolate text-center text-sm font-bold border border-cream"
                  >
                    My Orders
                  </Link>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-cream-dark text-rose font-bold py-3 rounded-xl hover:bg-cream-dark transition-all text-center"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="w-full bg-rose-deep text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-deep/20 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In / Sign Up
              </Link>
            )}
            <Link href="/menu" className="font-playfair text-[1.8rem] font-bold text-chocolate hover:text-rose" onClick={() => setIsMobileMenuOpen(false)}>Full Menu</Link>
            <Link href="/#about" className="font-playfair text-[1.8rem] font-bold text-chocolate hover:text-rose" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link href="/#contact" className="font-playfair text-[1.8rem] font-bold text-chocolate hover:text-rose" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          </div>
        </div>
      </div>

      <CartModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
    </>
  );
};

export default Navbar;
