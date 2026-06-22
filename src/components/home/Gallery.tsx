import React from 'react';
import Image from 'next/image';

import { useState, useEffect } from 'react';
import { getHomepageContent } from '@/utils/adminService';

const defaultGalleryImgs = [
  { src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', label: 'Chocolate Truffle' },
  { src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80', label: 'Strawberry Dream' },
  { src: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400&q=80', label: 'Birthday Special' },
  { src: 'https://images.unsplash.com/photo-1618426703623-c1b334571d97?w=400&q=80', label: 'Wedding Cake' },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', label: 'Vanilla Delight' },
  { src: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&q=80', label: 'Red Velvet' },
  { src: 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=400&q=80', label: 'Custom Creation' },
  { src: 'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=400&q=80', label: 'Lemon Bliss' },
];

const Gallery = () => {
  const [galleryImgs, setGalleryImgs] = useState<any[]>([]);

  useEffect(() => {
    const fetchGallery = async () => {
      const content = await getHomepageContent();
      if (content?.gallery && content.gallery.length > 0) {
        setGalleryImgs(content.gallery);
      } else {
        setGalleryImgs(defaultGalleryImgs);
      }
    };
    fetchGallery();
  }, []);

  return (
    <section id="gallery" className="py-20 bg-chocolate overflow-hidden">
      <div className="container mx-auto px-6">
        <p className="section-label text-center text-gold-light">Our Creations</p>
        <h2 className="section-title text-center text-white">A Feast for the Eyes</h2>
      </div>

      <div className="mt-11 relative">
        <div className="flex gap-[18px] w-max animate-slider hover:[animation-play-state:paused]">
          {[...galleryImgs, ...galleryImgs].map((img, i) => (
            <div key={i} className="w-[280px] h-[340px] min-w-[280px] rounded-lg overflow-hidden relative shadow-[0_8px_32px_rgba(0,0,0,0.4)] group">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
