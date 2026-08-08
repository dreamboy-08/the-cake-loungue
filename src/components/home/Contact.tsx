"use client";

import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';

const Contact = () => {
  const { websiteSettings, homepageSections } = useCMS();

  const contactSection = homepageSections?.find(s => s.id === 'contact');
  const label = contactSection?.title || "Get In Touch";
  const title = contactSection?.description?.substring(0, 50) || "Let's Create Something Sweet Together";
  const subtitle = contactSection?.description || "Have a special order in mind? Want to know more about our bespoke cakes? Reach out to us through any of these channels.";

  const address = websiteSettings?.address || "The Cake Lounge, Galleria Market, DLF Phase 4, Gurugram, Haryana, 122009";
  const phone = websiteSettings?.phone || "+91 98765 43210";
  const email = websiteSettings?.email || "hello@thecakelounge.com";
  const monFriHours = websiteSettings?.businessHoursMonFri || "10:00 AM - 10:00 PM";

  return (
    <section id="contact" className="py-[120px] bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-label mb-4">{label}</p>
          <h2 className="section-title mb-6">{title === subtitle ? "Let's Create Something Sweet Together" : title}</h2>
          <p className="section-sub mb-16 max-w-2xl mx-auto text-lg">
            {subtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Address */}
            <div className="bg-cream rounded-[22px] p-8 shadow-sm border border-cream-dark transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] flex flex-col h-full">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-deep mx-auto mb-6 shadow-sm shrink-0">
                <MapPin size={28} />
              </div>
              <h4 className="text-xl font-playfair font-bold text-chocolate mb-3">Find Us</h4>
              <p className="text-[0.95rem] text-text-soft leading-relaxed">
                {address}
              </p>
            </div>

            {/* Phone */}
            <div className="bg-cream rounded-[22px] p-8 shadow-sm border border-cream-dark transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] flex flex-col h-full">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-deep mx-auto mb-6 shadow-sm shrink-0">
                <Phone size={28} />
              </div>
              <h4 className="text-xl font-playfair font-bold text-chocolate mb-3">Call Us</h4>
              <p className="text-[0.95rem] text-text-soft leading-relaxed">
                {phone}<br />
                <span className="text-[0.85rem] font-semibold text-rose-deep">{monFriHours}</span>
              </p>
            </div>

            {/* Email */}
            <div className="bg-cream rounded-[22px] p-8 shadow-sm border border-cream-dark transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] flex flex-col h-full overflow-hidden">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-deep mx-auto mb-6 shadow-sm shrink-0">
                <Mail size={28} />
              </div>
              <h4 className="text-xl font-playfair font-bold text-chocolate mb-3">Email Us</h4>
              <p className="text-[0.95rem] text-text-soft leading-relaxed break-words">
                {email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
