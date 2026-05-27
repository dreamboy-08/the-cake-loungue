"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

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
          isScrolled && "bg-[rgba(253,246,238,0.97)] shadow-sm py-[10px] backdrop-blur-[12px]"
        )}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className={cn(
              "font-playfair text-[1.6rem] font-bold transition-colors duration-300",
              isScrolled ? "text-chocolate" : "text-white"
            )}>
              Cake <span className={isScrolled ? "text-rose" : "text-blush"}>Lounge</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/custom-cake" className={cn(
                "text-[0.95rem] font-semibold transition-colors duration-250",
                isScrolled ? "text-text-mid" : "text-[rgba(255,255,255,0.95)]"
              )}>
                Custom Cake
              </Link>
              <Link href="/checkout" className="bg-rose-deep text-white px-6 py-[10px] rounded-[50px] text-[0.85rem] font-semibold transition-all duration-350 shadow-[0_4px_16px_rgba(201,97,74,0.3)] hover:bg-brown hover:translate-y-[-1px]">
                Order Now
              </Link>
            </div>

            <button
              className="md:hidden flex flex-col gap-[5px] p-1 bg-none border-none cursor-pointer"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              <span className={cn("w-6 h-[2px] rounded-sm transition-all duration-350", isScrolled ? "bg-chocolate" : "bg-white")}></span>
              <span className={cn("w-6 h-[2px] rounded-sm transition-all duration-350", isScrolled ? "bg-chocolate" : "bg-white")}></span>
              <span className={cn("w-6 h-[2px] rounded-sm transition-all duration-350", isScrolled ? "bg-chocolate" : "bg-white")}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* CATEGORY BAR (Desktop) */}
      <div className={cn(
        "hidden md:block fixed top-[72px] left-0 w-full z-[99] py-3 transition-all duration-400 ease-in-out opacity-100 bg-transparent",
        isHidden && "translate-y-[-100%] opacity-0",
        isScrolled && "bg-[rgba(253,246,238,0.97)] backdrop-blur-[12px] shadow-[0_4px_14px_rgba(0,0,0,0.05)]"
      )}>
        <div className="container mx-auto px-6 flex items-center justify-center gap-6 flex-wrap">
          <ul className="flex flex-wrap gap-[18px] justify-center w-full items-center list-none">
            {['Mother\'s Day', 'Cakes', 'Bento', 'Theme Cakes', 'By Relationship', 'Desserts', 'Birthday', 'Anniversary'].map((cat) => (
              <li key={cat} className="group relative">
                <Link href={`/menu#${cat.toLowerCase().replace(/ /g, '-')}`} className={cn(
                  "text-[14px] font-medium transition-all duration-300 whitespace-nowrap px-2 py-[10px]",
                  isScrolled ? "text-text-mid hover:text-blush" : "text-[rgba(255,255,255,0.88)] hover:text-blush"
                )}>
                  {cat}
                </Link>
                {/* Mega Menu logic can be added here as a dropdown if needed */}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={cn(
        "fixed inset-0 bg-cream z-[200] flex-col items-center justify-center gap-8 transition-all duration-300",
        isMobileMenuOpen ? "flex" : "hidden"
      )}>
        <button
          className="absolute top-6 right-6 text-[1.8rem] bg-none border-none text-chocolate cursor-pointer"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={32} />
        </button>
        <Link href="/" className="font-playfair text-[2rem] font-bold text-chocolate hover:text-rose" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
        <Link href="/menu" className="font-playfair text-[2rem] font-bold text-chocolate hover:text-rose" onClick={() => setIsMobileMenuOpen(false)}>Menu</Link>
        <Link href="/custom-cake" className="font-playfair text-[2rem] font-bold text-chocolate hover:text-rose" onClick={() => setIsMobileMenuOpen(false)}>Custom Cake</Link>
        <Link href="/checkout" className="font-playfair text-[2rem] font-bold text-chocolate hover:text-rose" onClick={() => setIsMobileMenuOpen(false)}>Order</Link>
        <Link href="/#about" className="font-playfair text-[2rem] font-bold text-chocolate hover:text-rose" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
        <Link href="/#contact" className="font-playfair text-[2rem] font-bold text-chocolate hover:text-rose" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
      </div>
    </>
  );
};

export default Navbar;
