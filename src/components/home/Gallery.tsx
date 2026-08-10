"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCMS } from '@/context/CMSContext';

const Gallery = () => {
  const { galleryItems } = useCMS();

  const galleryImgs = useMemo(() => {
    return (galleryItems || [])
      .filter(item => item.enabled !== false)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(item => ({
        id: item.id,
        src: item.src,
        label: item.label,
        link: item.link || '/menu'
      }));
  }, [galleryItems]);

  if (galleryImgs.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="py-20 bg-chocolate overflow-hidden">
      <div className="container mx-auto px-6">
        <p className="section-label text-center text-gold-light">Our Creations</p>
        <h2 className="section-title text-center text-white">A Feast for the Eyes</h2>
      </div>

      <div className="mt-11 relative">
        <div className="flex gap-[18px] w-max animate-slider hover:[animation-play-state:paused]">
          {[...galleryImgs, ...galleryImgs].map((img, i) => (
            <Link
              key={i}
              href={img.link}
              className="w-[280px] h-[340px] min-w-[280px] rounded-[18px] overflow-hidden relative shadow-[0_8px_32px_rgba(0,0,0,0.4)] group block"
            >
              <Image
                src={img.src}
                alt={img.label}
                fill
                sizes="280px"
                className="object-cover transition-transform duration-500 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(61,31,16,0.7)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="absolute bottom-5 left-0 right-0 text-center text-white text-[0.9rem] font-semibold opacity-0 translate-y-2.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                {img.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
