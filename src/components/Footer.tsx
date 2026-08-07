"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, MessageCircle, Pin as Pinterest, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-chocolate text-[rgba(255,255,255,0.7)] pt-24 pb-12 border-t border-cream-dark/10">
      <div className="container mx-auto px-6">
        {/* Newsletter & Brand Statement (Luxury Experience) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5 items-center">
          <div className="lg:col-span-6 space-y-4">
            <p className="font-playfair text-2xl md:text-3xl font-semibold text-white leading-snug">
              Subscribe to the Cake Lounge <br />
              <span className="text-gold">Privilege Club</span>
            </p>
            <p className="text-[0.88rem] text-white/50 max-w-md leading-relaxed">
              Receive invitations to private tasting events, seasonal luxury flavor previews, and exclusive patisserie updates.
            </p>
          </div>
          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="relative max-w-md lg:ml-auto w-full">
              <div className="flex items-center border-b border-white/25 focus-within:border-gold py-2 transition-all duration-300">
                <Mail size={18} className="text-white/40 mr-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your luxury email address..."
                  required
                  className="bg-transparent border-none outline-none text-sm text-white placeholder-white/30 w-full font-poppins focus:ring-0"
                />
                <button
                  type="submit"
                  className="bg-transparent border-none text-gold hover:text-white transition-colors cursor-pointer p-1"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
              {subscribed && (
                <p className="absolute left-0 bottom-[-24px] text-xs font-semibold text-gold animate-fade-up">
                  Thank you. You have been registered successfully.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Minimal columns with generous whitespace */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 py-16">
          {/* Brand Col */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <div className="font-playfair text-xl font-bold text-white tracking-wide">
              The Cake <span className="text-blush font-normal italic">Lounge</span>
            </div>
            <p className="text-[0.82rem] leading-[1.8] text-white/50 font-poppins">
              Crafting moments of absolute elegance and culinary craftsmanship since 2015. Every cake is an exquisite designer piece custom tailored for your story.
            </p>
            <div className="flex gap-4 pt-2">
              {[
                { icon: <Instagram size={16} />, href: "#" },
                { icon: <Facebook size={16} />, href: "#" },
                { icon: <MessageCircle size={16} />, href: "#" },
                { icon: <Pinterest size={16} />, href: "#" },
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/60 transition-all duration-300 hover:border-gold hover:text-gold hover:-translate-y-0.5"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5 lg:pl-6">
            <h4 className="text-[0.75rem] font-bold text-white uppercase tracking-[0.2em] font-poppins">Quick Links</h4>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              <li><Link href="/" className="text-[0.82rem] text-white/40 hover:text-gold transition-colors font-poppins">Home</Link></li>
              <li><Link href="/menu" className="text-[0.82rem] text-white/40 hover:text-gold transition-colors font-poppins">Our Menu</Link></li>
              <li><Link href="/custom-cake" className="text-[0.82rem] text-white/40 hover:text-gold transition-colors font-poppins">Custom Cake</Link></li>
              <li><Link href="/#about" className="text-[0.82rem] text-white/40 hover:text-gold transition-colors font-poppins">Our Story</Link></li>
              <li><Link href="/#contact" className="text-[0.82rem] text-white/40 hover:text-gold transition-colors font-poppins">Contact</Link></li>
            </ul>
          </div>

          {/* Cake Types */}
          <div className="space-y-5 lg:pl-6">
            <h4 className="text-[0.75rem] font-bold text-white uppercase tracking-[0.2em] font-poppins">Cake Types</h4>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              <li><Link href="/menu?category=birthday-cakes" className="text-[0.82rem] text-white/40 hover:text-gold transition-colors font-poppins">Birthday Cakes</Link></li>
              <li><Link href="/menu?category=wedding-cakes" className="text-[0.82rem] text-white/40 hover:text-gold transition-colors font-poppins">Wedding Cakes</Link></li>
              <li><Link href="/menu?category=anniversary-cakes" className="text-[0.82rem] text-white/40 hover:text-gold transition-colors font-poppins">Anniversary Cakes</Link></li>
              <li><Link href="/menu?category=photo-cakes" className="text-[0.82rem] text-white/40 hover:text-gold transition-colors font-poppins">Photo Cakes</Link></li>
              <li><Link href="/menu?category=eggless-cakes" className="text-[0.82rem] text-white/40 hover:text-gold transition-colors font-poppins">Eggless Cakes</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-5 lg:pl-6">
            <h4 className="text-[0.75rem] font-bold text-white uppercase tracking-[0.2em] font-poppins">Policies</h4>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              <li><Link href="/policies/privacy-policy" className="text-[0.82rem] text-white/40 hover:text-gold transition-colors font-poppins">Privacy Policy</Link></li>
              <li><Link href="/policies/terms-and-conditions" className="text-[0.82rem] text-white/40 hover:text-gold transition-colors font-poppins">Terms & Conditions</Link></li>
              <li><Link href="/policies/cancellation-refund" className="text-[0.82rem] text-white/40 hover:text-gold transition-colors font-poppins">Cancellation & Refund</Link></li>
              <li><Link href="/policies/shipping-delivery" className="text-[0.82rem] text-white/40 hover:text-gold transition-colors font-poppins">Shipping & Delivery</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-5 lg:pl-6">
            <h4 className="text-[0.75rem] font-bold text-white uppercase tracking-[0.2em] font-poppins">Support</h4>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              <li><Link href="/#contact" className="text-[0.82rem] text-white/40 hover:text-gold transition-colors font-poppins">Help Center</Link></li>
              <li><Link href="/orders" className="text-[0.82rem] text-white/40 hover:text-gold transition-colors font-poppins">Track Order</Link></li>
              <li><Link href="/policies" className="text-[0.82rem] text-white/40 hover:text-gold transition-colors font-poppins">Policy Index</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider and bottom section */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-[0.75rem] text-white/30 gap-4">
          <span>© 2025 The Cake Lounge Patisserie. All rights reserved.</span>
          <div className="flex items-center gap-1.5 font-poppins tracking-wider uppercase text-[10px]">
            Made with <span className="text-rose">❤️</span> in India
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
