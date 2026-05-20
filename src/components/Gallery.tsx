import React from 'react';
import Image from 'next/image';

export const Gallery = () => {
  const images = [
    { src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', label: 'Chocolate Truffle' },
    { src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80', label: 'Strawberry Dream' },
    { src: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400&q=80', label: 'Birthday Special' },
    { src: 'https://images.unsplash.com/photo-1618426703623-c1b334571d97?w=400&q=80', label: 'Wedding Cake' },
    { src: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&q=80', label: 'Vanilla Delight' },
    { src: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&q=80', label: 'Red Velvet' },
    { src: 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=400&q=80', label: 'Custom Creation' },
    { src: 'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=400&q=80', label: 'Lemon Bliss' },
  ];

  // Double for seamless loop
  const allImages = [...images, ...images];

  return (
    <section id="gallery" className="py-20 bg-chocolate overflow-hidden">
      <div className="container px-6 mb-11">
        <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-gold-light text-center mb-2.5">Our Creations</p>
        <h2 className="font-playfair text-[clamp(1.8rem,8vw,3rem)] font-bold text-white text-center">A Feast for the Eyes</h2>
      </div>

      <div className="relative mt-11">
        <div className="flex gap-4.5 w-max animate-gallery-scroll hover:[animation-play-state:paused]">
          {allImages.map((img, i) => (
            <div key={i} className="relative w-[280px] h-[340px] rounded-lg overflow-hidden group shadow-2xl">
              <Image src={img.src} alt={img.label} fill className="object-cover transition-transform duration-500 group-hover:scale-108" />
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-5 left-0 right-0 text-center text-white text-[0.9rem] font-semibold opacity-0 translate-y-2.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                {img.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
