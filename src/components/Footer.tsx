"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, MessageCircle, Pin as Pinterest } from 'lucide-react';
import { getSiteSettings, getContactInfo } from '@/utils/adminService';

const Footer = () => {
  const [settings, setSettings] = useState<any>(null);
  const [contact, setContact] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [s, c] = await Promise.all([getSiteSettings(), getContactInfo()]);
      setSettings(s);
      setContact(c);
    };
    fetchData();
  }, []);

  return (
    <footer className="bg-chocolate text-[rgba(255,255,255,0.7)] pt-[70px] pb-[30px]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-[50px]">
          <div className="footer-brand">
            <div className="font-playfair text-[1.6rem] font-bold text-white mb-[14px]">
              Cake <span className="text-blush">Lounge</span>
            </div>
            <p className="text-[0.85rem] leading-[1.7] text-[rgba(255,255,255,0.55)] mb-6">
              Crafting moments of sweetness since 2015. Every cake tells a story — let us tell yours.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Instagram size={18} />, href: contact?.socialLinks?.instagram || "#" },
                { icon: <Facebook size={18} />, href: contact?.socialLinks?.facebook || "#" },
                { icon: <MessageCircle size={18} />, href: contact?.whatsapp ? `https://wa.me/${contact.whatsapp}` : "#" },
                { icon: <Pinterest size={18} />, href: "#" },
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : '_self'}
                  className="w-[38px] h-[38px] bg-[rgba(255,255,255,0.08)] rounded-full flex items-center justify-center text-[rgba(255,255,255,0.7)] transition-all duration-350 hover:bg-rose-deep hover:text-white hover:translate-y-[-3px]"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4 className="text-[0.92rem] font-semibold text-white mb-[18px] font-poppins">Quick Links</h4>
            <div className="flex flex-col gap-[10px]">
              <Link href="/" className="text-[0.83rem] text-[rgba(255,255,255,0.5)] hover:text-blush transition-colors">Home</Link>
              <Link href="/menu" className="text-[0.83rem] text-[rgba(255,255,255,0.5)] hover:text-blush transition-colors">Our Menu</Link>
              <Link href="/custom-cake" className="text-[0.83rem] text-[rgba(255,255,255,0.5)] hover:text-blush transition-colors">Custom Cake</Link>
              <Link href="/#about" className="text-[0.83rem] text-[rgba(255,255,255,0.5)] hover:text-blush transition-colors">Our Story</Link>
              <Link href="/#contact" className="text-[0.83rem] text-[rgba(255,255,255,0.5)] hover:text-blush transition-colors">Contact</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="text-[0.92rem] font-semibold text-white mb-[18px] font-poppins">Cake Types</h4>
            <div className="flex flex-col gap-[10px]">
              <Link href="/menu#birthday" className="text-[0.83rem] text-[rgba(255,255,255,0.5)] hover:text-blush transition-colors">Birthday Cakes</Link>
              <Link href="/menu#wedding" className="text-[0.83rem] text-[rgba(255,255,255,0.5)] hover:text-blush transition-colors">Wedding Cakes</Link>
              <Link href="/menu#anniversary" className="text-[0.83rem] text-[rgba(255,255,255,0.5)] hover:text-blush transition-colors">Anniversary</Link>
              <Link href="/menu#photo-cakes" className="text-[0.83rem] text-[rgba(255,255,255,0.5)] hover:text-blush transition-colors">Photo Cakes</Link>
              <Link href="/menu#eggless" className="text-[0.83rem] text-[rgba(255,255,255,0.5)] hover:text-blush transition-colors">Eggless Cakes</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="text-[0.92rem] font-semibold text-white mb-[18px] font-poppins">Support</h4>
            <div className="flex flex-col gap-[10px]">
              <Link href="#" className="text-[0.83rem] text-[rgba(255,255,255,0.5)] hover:text-blush transition-colors">FAQs</Link>
              <Link href="#" className="text-[0.83rem] text-[rgba(255,255,255,0.5)] hover:text-blush transition-colors">Track Order</Link>
              <Link href="#" className="text-[0.83rem] text-[rgba(255,255,255,0.5)] hover:text-blush transition-colors">Return Policy</Link>
              <Link href="#" className="text-[0.83rem] text-[rgba(255,255,255,0.5)] hover:text-blush transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-[0.83rem] text-[rgba(255,255,255,0.5)] hover:text-blush transition-colors">Terms of Use</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.08)] pt-6 flex flex-col md:flex-row items-center justify-between text-[0.8rem] text-[rgba(255,255,255,0.35)] gap-[10px]">
          <span>{settings?.copyrightText || '© 2025 Cake Lounge Patisserie. All rights reserved.'}</span>
          <div className="flex items-center gap-1">
            Made with <span className="text-rose">❤️</span> in India
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
