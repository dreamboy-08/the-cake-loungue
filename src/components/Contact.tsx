"use client";

import React from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

export const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✉️ Message sent! We'll be in touch soon.");
  };

  return (
    <section id="contact" className="py-24 md:py-[100px]">
      <div className="container px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="flex flex-col">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-rose mb-2.5">Get In Touch</p>
            <h2 className="font-playfair text-[clamp(1.8rem,8vw,3rem)] font-bold text-chocolate leading-[1.2] mb-4">
              Let&apos;s Create Something Sweet Together
            </h2>
            <p className="text-[clamp(0.85rem,2vw,0.95rem)] text-text-soft leading-[1.7]">
              Have a special order in mind? Want to know more about our bespoke cakes? We&apos;d love to hear from you.
            </p>

            <div className="mt-9 flex flex-col gap-5">
              {[
                { icon: <MapPin size={18} />, title: "Find Us", detail: "12, Rose Garden Lane, Connaught Place, New Delhi – 110001" },
                { icon: <Phone size={18} />, title: "Call Us", detail: "+91 99105 19242 · Mon–Sun 8am–10pm" },
                { icon: <Mail size={18} />, title: "Email Us", detail: "hello@cakelounge.in" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cream-dark rounded-sm flex items-center justify-center text-rose-deep shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-[0.88rem] font-semibold text-chocolate">{item.title}</h4>
                    <p className="text-[0.82rem] text-text-soft mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-[clamp(24px,5vw,44px)] shadow-md">
            <h3 className="mb-6 text-[1.4rem] text-chocolate font-playfair font-bold">Send a Message</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5.5">
              <div className="flex flex-col gap-2">
                <label className="text-[0.82rem] font-semibold text-text-mid">Your Name</label>
                <input type="text" placeholder="e.g. Priya Sharma" className="w-full py-3.5 px-4.5 border-2 border-cream-dark rounded-sm text-[0.88rem] bg-cream outline-none focus:border-rose focus:ring-[3px] focus:ring-rose/15 transition-all" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.82rem] font-semibold text-text-mid">Email Address</label>
                <input type="email" placeholder="you@example.com" className="w-full py-3.5 px-4.5 border-2 border-cream-dark rounded-sm text-[0.88rem] bg-cream outline-none focus:border-rose focus:ring-[3px] focus:ring-rose/15 transition-all" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.82rem] font-semibold text-text-mid">Phone (optional)</label>
                <input type="tel" placeholder="+91 98765 43210" className="w-full py-3.5 px-4.5 border-2 border-cream-dark rounded-sm text-[0.88rem] bg-cream outline-none focus:border-rose focus:ring-[3px] focus:ring-rose/15 transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.82rem] font-semibold text-text-mid">Your Message</label>
                <textarea placeholder="Tell us about your dream cake..." className="w-full h-[120px] py-3.5 px-4.5 border-2 border-cream-dark rounded-sm text-[0.88rem] bg-cream outline-none focus:border-rose focus:ring-[3px] focus:ring-rose/15 transition-all resize-none" required></textarea>
              </div>
              <button type="submit" className="w-full py-3.5 bg-rose-deep text-white rounded-full text-[0.95rem] font-semibold flex items-center justify-center gap-2 hover:bg-brown hover:-translate-y-0.5 transition-all shadow-[0_6px_20px_rgba(107,58,42,0.3)]">
                <Send size={18} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
