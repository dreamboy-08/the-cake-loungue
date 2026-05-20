"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      setScrolled(scrollTop > 50);

      if (scrollTop > lastScrollTop && scrollTop > 120) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] py-[18px] transition-all duration-400 ease-in-out",
          scrolled && "bg-cream/97 shadow-sm py-[10px] backdrop-blur-md",
          hidden && "-translate-y-full"
        )}
      >
        <div className="container px-6 flex items-center justify-between">
          <Link href="/" className={cn(
            "font-playfair text-[1.6rem] font-bold transition-colors duration-300 whitespace-nowrap",
            scrolled ? "text-chocolate" : "text-white"
          )}>
            Cake <span className={cn(scrolled ? "text-rose" : "text-blush")}>Lounge</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/custom-cake" className={cn(
              "text-[0.95rem] font-semibold transition-colors duration-250",
              scrolled ? "text-text-mid" : "text-white/95",
              "hover:text-rose"
            )}>
              Custom Cake
            </Link>
            <Link href="/checkout" className="relative flex items-center justify-center p-2 text-rose-deep transition-all hover:scale-110">
              <ShoppingBag className={cn("w-6 h-6", scrolled ? "text-chocolate" : "text-white")} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-deep text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-cream">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/checkout" className="bg-rose-deep text-white py-2.5 px-6 rounded-full text-[0.85rem] font-semibold transition-all hover:bg-brown hover:-translate-y-px shadow-[0_4px_16px_rgba(201,97,74,0.3)]">
              Order Now
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-4">
            <Link href="/checkout" className="relative flex items-center justify-center p-2 text-rose-deep">
              <ShoppingBag className={cn("w-6 h-6", scrolled ? "text-chocolate" : "text-white")} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-deep text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-cream">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="flex flex-col gap-1.25 p-2.5 -mr-2.5 cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              {[1, 2, 3].map((i) => (
                <span key={i} className={cn("w-6 h-[2px] rounded-sm transition-all duration-350", scrolled ? "bg-chocolate" : "bg-white")} />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 bg-cream z-[200] flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden",
        mobileMenuOpen ? "flex opacity-100" : "hidden opacity-0"
      )}>
        <button
          className="absolute top-6 right-6 text-[1.8rem] text-chocolate cursor-pointer"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X />
        </button>
        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="font-playfair text-[2rem] font-bold text-chocolate hover:text-rose">Home</Link>
        <Link href="/menu" onClick={() => setMobileMenuOpen(false)} className="font-playfair text-[2rem] font-bold text-chocolate hover:text-rose">Menu</Link>
        <Link href="/custom-cake" onClick={() => setMobileMenuOpen(false)} className="font-playfair text-[2rem] font-bold text-chocolate hover:text-rose">Custom Cake</Link>
        <Link href="/checkout" onClick={() => setMobileMenuOpen(false)} className="font-playfair text-[2rem] font-bold text-chocolate hover:text-rose">Order</Link>
      </div>
    </>
  );
};
