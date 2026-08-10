"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useCMS } from '@/context/CMSContext';
import { DEFAULT_GALLERY_SETTINGS } from '@/constants/cmsDefaults';

const Gallery = () => {
  const { gallerySettings, loading } = useCMS();

  const settings = (loading || !gallerySettings) ? DEFAULT_GALLERY_SETTINGS : gallerySettings;

  const sortedItems = useMemo(() => {
    return [...(settings.items || [])].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [settings.items]);

  if (!settings.enabled) {
    return null;
  }

  return (
    <section id="gallery" className="py-20 bg-chocolate overflow-hidden">
      <div className="container mx-auto px-6">
        <p className="section-label text-center text-gold-light">{settings.subtitle || 'Our Creations'}</p>
        <h2 className="section-title text-center text-white">{settings.title || 'A Feast for the Eyes'}</h2>
      </div>

      <div className="mt-11 relative">
        <div className="flex gap-[18px] w-max animate-slider hover:[animation-play-state:paused]">
          {[...sortedItems, ...sortedItems].map((item, i) => (
            <div
              key={i}
              className="w-[280px] h-[340px] min-w-[280px] rounded-[18px] overflow-hidden relative shadow-[0_8px_32px_rgba(0,0,0,0.4)] group block cursor-default"
            >
              <Image
                src={item.image}
                alt={item.caption}
                fill
                sizes="280px"
                className="object-cover transition-transform duration-500 group-hover:scale-108"
                unoptimized={item.image.startsWith('data:')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(61,31,16,0.7)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="absolute bottom-5 left-0 right-0 text-center text-white text-[0.9rem] font-semibold opacity-0 translate-y-2.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                {item.caption}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
