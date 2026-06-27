"use client";

import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-[120px] bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-label mb-4">Get In Touch</p>
          <h2 className="section-title mb-6">Let&apos;s Create Something Sweet Together</h2>
          <p className="section-sub mb-16 max-w-2xl mx-auto text-lg">
            Have a special order in mind? Want to know more about our bespoke cakes?
            Reach out to us through any of these channels.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Address */}
            <div className="bg-cream rounded-[22px] p-8 shadow-sm border border-cream-dark transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-deep mx-auto mb-6 shadow-sm">
                <MapPin size={28} />
              </div>
              <h4 className="text-xl font-playfair font-bold text-chocolate mb-3">Find Us</h4>
              <p className="text-[0.95rem] text-text-soft leading-relaxed">
                Cake lounge, U-block, DLF phase-3, sector-24, Gurugram, Haryana
              </p>
            </div>

            {/* Phone */}
            <div className="bg-cream rounded-[22px] p-8 shadow-sm border border-cream-dark transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-deep mx-auto mb-6 shadow-sm">
                <Phone size={28} />
              </div>
              <h4 className="text-xl font-playfair font-bold text-chocolate mb-3">Call Us</h4>
              <p className="text-[0.95rem] text-text-soft leading-relaxed">
                +91 77038 70170<br />
                <span className="text-[0.85rem] font-semibold text-rose-deep">Mon–Sun 8am–10pm</span>
              </p>
            </div>

            {/* Email */}
            <div className="bg-cream rounded-[22px] p-8 shadow-sm border border-cream-dark transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-deep mx-auto mb-6 shadow-sm">
                <Mail size={28} />
              </div>
              <h4 className="text-xl font-playfair font-bold text-chocolate mb-3">Email Us</h4>
              <p className="text-[0.95rem] text-text-soft leading-relaxed">
                thecakeloungegurgaon@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
