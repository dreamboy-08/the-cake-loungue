"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartModal from './CartModal';
import { MEGA_MENU } from '@/constants/navigation';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';

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

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <nav
        id="navbar"
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] py-[18px] transition-all duration-400 ease-in-out",
          isHidden && "translate-y-[-100%]",
          (isScrolled || isAuthPage) && "bg-[rgba(253,246,238,0.97)] shadow-sm py-[10px] backdrop-blur-[12px]"
          isScrolled ? "bg-[rgba(253,246,238,0.97)] shadow-sm py-[10px] backdrop-blur-[12px]" : "bg-black/10 backdrop-blur-sm"
        )}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className={cn(
              "font-playfair text-[1.6rem] font-bold transition-colors duration-300",
              (isScrolled || isAuthPage) ? "text-chocolate" : "text-white"
            )}>
              Cake <span className={(isScrolled || isAuthPage) ? "text-rose" : "text-blush"}>Lounge</span>
            </Link>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex items-center gap-3 md:gap-6">
                {!isAuthPage && (
                  <>
                    {user ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => logout()}
                          className={cn(
                            "text-[0.85rem] font-semibold transition-colors",
                            isScrolled ? "text-chocolate hover:text-rose" : "text-white hover:text-blush"
                          )}
                        >
                          Logout
                        </button>
                        <div className="w-8 h-8 rounded-full bg-rose-deep flex items-center justify-center text-white text-[0.75rem] font-bold border-2 border-white shadow-sm">
                          {user.displayName ? user.displayName[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : 'U'}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href="/login"
                        className={cn(
                          "text-[0.85rem] font-semibold transition-colors",
                          isScrolled ? "text-chocolate hover:text-rose" : "text-white hover:text-blush"
                        )}
                      >
                        Login
                      </Link>
                    )}

                    <Link href="/checkout" className="hidden sm:block bg-rose-deep text-white px-4 md:px-6 py-[8px] md:py-[10px] rounded-[50px] text-[0.75rem] md:text-[0.85rem] font-semibold transition-all duration-350 shadow-[0_4px_16px_rgba(201,97,74,0.3)] hover:bg-brown hover:translate-y-[-1px]">
                      Order Now
                    </Link>
                  </>
                )}

                <button
                  onClick={() => setIsCartModalOpen(true)}
                  className={cn(
                    "relative p-2 rounded-full transition-all duration-300",
                    (isScrolled || isAuthPage) ? "text-chocolate hover:bg-rose/10" : "text-white hover:bg-white/10"
                  )}
                  aria-label="View Cart"
                >
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <div className="absolute top-1 right-1 bg-gold text-chocolate text-[0.65rem] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </div>
                  )}
                </button>
              </div>

              {!isAuthPage && (
                <button
                  className="md:hidden flex flex-col gap-[5px] p-1 bg-none border-none cursor-pointer"
                  onClick={toggleMobileMenu}
                  aria-label="Open menu"
                >
                  <span className={cn("w-6 h-[2px] rounded-sm transition-all duration-350", (isScrolled || isAuthPage) ? "bg-chocolate" : "bg-white")}></span>
                  <span className={cn("w-6 h-[2px] rounded-sm transition-all duration-350", (isScrolled || isAuthPage) ? "bg-chocolate" : "bg-white")}></span>
                  <span className={cn("w-6 h-[2px] rounded-sm transition-all duration-350", (isScrolled || isAuthPage) ? "bg-chocolate" : "bg-white")}></span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* CATEGORY BAR (Desktop) */}
      {!isAuthPage && (
        <div className={cn(
          "hidden md:block fixed top-[72px] left-0 w-full z-[99] py-3 transition-all duration-400 ease-in-out opacity-100 bg-transparent",
          isHidden && "translate-y-[-100%] opacity-0",
          isScrolled && "bg-[rgba(253,246,238,0.97)] backdrop-blur-[12px] shadow-[0_4px_14px_rgba(0,0,0,0.05)]"
        )}>
        <div className="container mx-auto px-6 flex items-center justify-center">
          <ul className="flex flex-wrap gap-[18px] justify-center w-full items-center list-none">
            {MEGA_MENU.map((item) => (
              <li key={item.label} className="group static">
                <Link href={item.href} className={cn(
                  "text-[14px] font-medium transition-all duration-300 whitespace-nowrap px-2 py-[10px] block",
                  isScrolled ? "text-text-mid hover:text-blush" : "text-[rgba(255,255,255,0.88)] hover:text-blush"
                )}>
                  {item.label}
                </Link>
                {item.columns && (
                  <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-350 z-[1000] w-full max-w-[860px] pt-2">
                    <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-4 gap-8 max-h-[420px] overflow-y-auto">
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

      {/* MOBILE MENU */}
      <div className={cn(
        "fixed inset-0 bg-cream z-[200] flex-col items-center overflow-y-auto py-20 px-6 transition-all duration-300",
        isMobileMenuOpen ? "flex" : "hidden"
      )}>
        <button
          className="absolute top-6 right-6 text-chocolate"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={32} />
        </button>

        <div className="w-full max-w-sm flex flex-col gap-6">
          <Link href="/" className="font-playfair text-[2rem] font-bold text-chocolate hover:text-rose border-b border-rose/10 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>

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
                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-rose/5">
                  <div className="w-12 h-12 rounded-full bg-rose-deep flex items-center justify-center text-white text-xl font-bold">
                    {user.displayName ? user.displayName[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-chocolate">{user.displayName || 'User'}</span>
                    <span className="text-xs text-chocolate/60 truncate max-w-[180px]">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-rose/10 text-rose font-bold py-3 rounded-xl hover:bg-rose/20 transition-all text-center"
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
                Login / Sign Up
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
