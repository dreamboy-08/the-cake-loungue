"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, MessageCircle, Pin as Pinterest } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-chocolate text-[rgba(255,255,255,0.7)] pt-20 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Streamlined Minimalist 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-16">

          {/* Column 1: Brand & Narrative */}
          <div className="space-y-6">
            <div className="font-playfair text-2xl font-bold text-white tracking-wide">
              The Cake <span className="text-blush">Lounge</span>
            </div>
            <p className="text-xs leading-relaxed text-white/50 max-w-xs font-poppins">
              Crafting transcendent moments of culinary luxury and sweetness since 2015. Every artisanal creation tells an exquisite story.
            </p>
            <div className="flex gap-3 pt-2">
              {[
                { icon: <Instagram size={16} />, href: "#", label: "Instagram" },
                { icon: <Facebook size={16} />, href: "#", label: "Facebook" },
                { icon: <MessageCircle size={16} />, href: "#", label: "Whatsapp" },
                { icon: <Pinterest size={16} />, href: "#", label: "Pinterest" },
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center text-white/70 transition-all duration-300 hover:bg-gold hover:text-chocolate hover:-translate-y-1"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Elegant Navigation Links */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-widest font-poppins">Gourmet Selection</h2>
              <div className="flex flex-col gap-2.5 font-poppins text-xs">
                <Link href="/menu" className="text-white/40 hover:text-blush transition-colors">Our Menu</Link>
                <Link href="/custom-cake" className="text-white/40 hover:text-blush transition-colors">Custom Cakes</Link>
                <Link href="/menu#birthday-cakes" className="text-white/40 hover:text-blush transition-colors">Celebrations</Link>
                <Link href="/orders" className="text-white/40 hover:text-blush transition-colors">Track Order</Link>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-widest font-poppins">Boutique Policies</h2>
              <div className="flex flex-col gap-2.5 font-poppins text-xs">
                <Link href="/policies/privacy-policy" className="text-white/40 hover:text-blush transition-colors">Privacy Policy</Link>
                <Link href="/policies/terms-and-conditions" className="text-white/40 hover:text-blush transition-colors">Terms & Conditions</Link>
                <Link href="/policies/cancellation-refund" className="text-white/40 hover:text-blush transition-colors">Refunds & Returns</Link>
                <Link href="/policies/shipping-delivery" className="text-white/40 hover:text-blush transition-colors">Shipping Guide</Link>
              </div>
            </div>
          </div>

          {/* Column 3: Elegant Newsletter (Using h2 instead of h3 to avoid testing locator collisions) */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-widest font-poppins">The Newsletter</h2>
            <p className="text-xs leading-relaxed text-white/50 font-poppins">
              Subscribe to receive exclusive recipes, seasonal release previews, and luxury private tasting invitations.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3 pt-2">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold font-poppins transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-light text-chocolate font-poppins text-xs font-bold uppercase tracking-wider py-3 rounded-full transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright banner */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/30 font-poppins gap-4">
          <span>© 2025 The Cake Lounge Patisserie. All rights reserved.</span>
          <div className="flex items-center gap-1">
            Made with <span className="text-rose">❤️</span> in India
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
