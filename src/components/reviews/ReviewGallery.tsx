"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import Image from 'next/image';

interface ReviewGalleryProps {
  images: string[];
}

const ReviewGallery: React.FC<ReviewGalleryProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-playfair font-bold text-chocolate">Customer Photo Gallery</h3>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{images.length} Photos</span>
      </div>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="relative break-inside-avoid rounded-[32px] overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all mb-6"
            onClick={() => setSelectedIndex(idx)}
          >
            <img
              src={img}
              alt={`Gallery ${idx}`}
              className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-chocolate/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="text-white" size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIndex(null)}
              className="absolute inset-0 bg-chocolate/95 backdrop-blur-md"
            />

            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 p-3 text-white/50 hover:text-white transition-colors z-[1001]"
            >
              <X size={32} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white transition-colors z-[1001] bg-white/10 rounded-full backdrop-blur-md"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((selectedIndex + 1) % images.length);
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white transition-colors z-[1001] bg-white/10 rounded-full backdrop-blur-md"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-[4/3] md:aspect-auto md:h-[80vh] rounded-[32px] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex]}
                alt="Selected"
                fill
                className="object-contain"
              />
            </motion.div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-bold uppercase tracking-widest z-[1001]">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewGallery;
