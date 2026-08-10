"use client";

import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { DEFAULT_CONTACT_SETTINGS } from '@/constants/cmsDefaults';

const Contact = () => {
  const { contactSettings, loading } = useCMS();

  const settings = (loading || !contactSettings) ? DEFAULT_CONTACT_SETTINGS : contactSettings;

  if (!settings.enabled) {
    return null;
  }

  // Sanitize phone number for link (strip spaces/hyphens)
  const phoneLink = `tel:${settings.phone.replace(/[^+\d]/g, '')}`;
  const emailLink = `mailto:${settings.email}`;

  return (
    <section id="contact" className="py-[120px] bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-label mb-4">Get In Touch</p>
          <h2 className="section-title mb-6">{settings.heading}</h2>
          <p className="section-sub mb-16 max-w-2xl mx-auto text-lg leading-relaxed text-text-soft">
            {settings.subheading}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Address */}
            <div className="bg-cream rounded-[22px] p-8 shadow-sm border border-cream-dark transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] flex flex-col h-full">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-deep mx-auto mb-6 shadow-sm shrink-0">
                <MapPin size={28} />
              </div>
              <h4 className="text-xl font-playfair font-bold text-chocolate mb-3">Find Us</h4>
              <p className="text-[0.95rem] text-text-soft leading-relaxed">
                {settings.address}
              </p>
            </div>

            {/* Phone */}
            <a
              href={phoneLink}
              className="bg-cream rounded-[22px] p-8 shadow-sm border border-cream-dark transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] flex flex-col h-full cursor-pointer group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-deep mx-auto mb-6 shadow-sm shrink-0">
                <Phone size={28} />
              </div>
              <h4 className="text-xl font-playfair font-bold text-chocolate mb-3 group-hover:text-rose-deep transition-colors">Call Us</h4>
              <p className="text-[0.95rem] text-text-soft leading-relaxed">
                {settings.phone}<br />
                <span className="text-[0.85rem] font-semibold text-rose-deep">{settings.hoursMonSun}</span>
              </p>
            </a>

            {/* Email */}
            <a
              href={emailLink}
              className="bg-cream rounded-[22px] p-8 shadow-sm border border-cream-dark transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] flex flex-col h-full overflow-hidden cursor-pointer group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-deep mx-auto mb-6 shadow-sm shrink-0">
                <Mail size={28} />
              </div>
              <h4 className="text-xl font-playfair font-bold text-chocolate mb-3 group-hover:text-rose-deep transition-colors">Email Us</h4>
              <p className="text-[0.95rem] text-text-soft leading-relaxed break-words">
                {settings.email}
              </p>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
