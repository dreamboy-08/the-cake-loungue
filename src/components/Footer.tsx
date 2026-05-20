import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, MessageCircle, Pin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-chocolate text-white/70 pt-[70px] pb-[30px]">
      <div className="container px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-[50px]">
          <div className="text-center md:text-left">
            <div className="font-playfair text-[1.6rem] font-bold text-white mb-3.5">
              Cake <span className="text-blush">Lounge</span>
            </div>
            <p className="text-[0.85rem] leading-[1.7] text-white/55 mb-6">
              Crafting moments of sweetness since 2015. Every cake tells a story — let us tell yours.
            </p>
            <div className="flex justify-center md:justify-start gap-3">
              {[
                { icon: <Instagram size={18} />, href: "#" },
                { icon: <Facebook size={18} />, href: "#" },
                { icon: <MessageCircle size={18} />, href: "#" },
                { icon: <Pin size={18} />, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-white/70 transition-all hover:bg-rose-deep hover:text-white hover:-translate-y-[3px]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4.5">
            <h4 className="text-[0.92rem] font-semibold text-white font-poppins">Quick Links</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/" className="text-[0.83rem] text-white/50 hover:text-blush transition-colors">Home</Link>
              <Link href="/menu" className="text-[0.83rem] text-white/50 hover:text-blush transition-colors">Categories</Link>
              <Link href="/menu" className="text-[0.83rem] text-white/50 hover:text-blush transition-colors">Our Menu</Link>
              <Link href="/about" className="text-[0.83rem] text-white/50 hover:text-blush transition-colors">Our Story</Link>
              <Link href="/contact" className="text-[0.83rem] text-white/50 hover:text-blush transition-colors">Contact</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4.5">
            <h4 className="text-[0.92rem] font-semibold text-white font-poppins">Cake Types</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="#" className="text-[0.83rem] text-white/50 hover:text-blush transition-colors">Birthday Cakes</Link>
              <Link href="#" className="text-[0.83rem] text-white/50 hover:text-blush transition-colors">Wedding Cakes</Link>
              <Link href="#" className="text-[0.83rem] text-white/50 hover:text-blush transition-colors">Anniversary</Link>
              <Link href="#" className="text-[0.83rem] text-white/50 hover:text-blush transition-colors">Photo Cakes</Link>
              <Link href="#" className="text-[0.83rem] text-white/50 hover:text-blush transition-colors">Eggless Cakes</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4.5">
            <h4 className="text-[0.92rem] font-semibold text-white font-poppins">Support</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="#" className="text-[0.83rem] text-white/50 hover:text-blush transition-colors">FAQs</Link>
              <Link href="#" className="text-[0.83rem] text-white/50 hover:text-blush transition-colors">Track Order</Link>
              <Link href="#" className="text-[0.83rem] text-white/50 hover:text-blush transition-colors">Return Policy</Link>
              <Link href="#" className="text-[0.83rem] text-white/50 hover:text-blush transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-[0.83rem] text-white/50 hover:text-blush transition-colors">Terms of Use</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2.5 text-[0.8rem] text-white/35">
          <span>© 2025 La Douceur Patisserie. All rights reserved.</span>
          <span className="flex items-center gap-1.5">Made with <span className="text-rose">❤</span> in India</span>
        </div>
      </div>
    </footer>
  );
};
