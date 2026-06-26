"use client";

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface LivePreviewProps {
  flavor: string;
  photo: string | null;
  message: string;
  theme: string;
}

const flavorImages: Record<string, string> = {
  "Chocolate": "/images/custom-cakes/chocolate.jpg",
  "Vanilla": "/images/custom-cakes/vanilla.jpg",
  "Red Velvet": "/images/custom-cakes/red-velvet.jpg",
  "Butterscotch": "/images/custom-cakes/butterscotch.jpg",
  "Black Forest": "/images/custom-cakes/black-forest.jpg",
};

const LivePreview: React.FC<LivePreviewProps> = ({ flavor, photo, message, theme }) => {
  const cakeImage = flavorImages[flavor] || flavorImages["Chocolate"];

  return (
    <div className="bg-white rounded-[22px] p-6 shadow-xl border border-rose-50 sticky top-32">
      <div className="relative w-full aspect-square max-w-[600px] mx-auto overflow-hidden rounded-xl bg-gray-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={cakeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={cakeImage}
              alt={`${flavor} Cake Base`}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Photo Integration */}
        <AnimatePresence>
          {photo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-[32%] left-1/2 -translate-x-1/2 w-[180px] h-[180px] z-10"
              style={{ perspective: '1200px' }}
            >
              <div
                className="w-full h-full rounded-full border-[6px] border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden relative"
                style={{
                  transform: 'rotateX(12deg) rotateY(-2deg)',
                  maskImage: 'radial-gradient(circle, black 60%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)'
                }}
              >
                <Image src={photo} alt="Custom" fill className="object-cover" />
                {/* Texture overlay to make it look printed */}
                <div className="absolute inset-0 bg-black/5 mix-blend-overlay pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
              </div>
              {/* Decorative topper stick */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-12 bg-gray-200/50 -mt-1" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-[15%] left-0 right-0 text-center z-20 px-4"
          >
            <span className="font-dancing text-3xl md:text-4xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {message}
            </span>
          </motion.div>
        )}

        {/* Theme Effects */}
        <ThemeOverlays theme={theme} />
      </div>

      <div className="mt-6 text-center">
        <h3 className="font-playfair text-2xl text-rose-900">Your Masterpiece</h3>
        <p className="text-sm text-gray-500 italic">Real-time AI Preview</p>
      </div>
    </div>
  );
};

const ThemeOverlays: React.FC<{ theme: string }> = ({ theme }) => {
  const normalizedTheme = theme.toLowerCase();

  return (
    <AnimatePresence>
      {normalizedTheme.includes('princess') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute top-8 left-8 text-5xl drop-shadow-lg">👑</div>
          <div className="absolute top-8 right-8 text-5xl drop-shadow-lg animate-pulse">✨</div>
          <div className="absolute bottom-12 left-12 text-4xl">🪄</div>
          <div className="absolute inset-0 border-[20px] border-pink-300/20 rounded-xl shadow-[inner_0_0_50px_rgba(255,182,193,0.3)]" />
        </motion.div>
      )}

      {normalizedTheme.includes('cars') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute bottom-12 left-8 text-5xl drop-shadow-lg">🏎️</div>
          <div className="absolute bottom-12 right-8 text-5xl drop-shadow-lg">🏁</div>
          <div className="absolute top-12 left-12 text-4xl animate-bounce">🚩</div>
          <div className="absolute inset-0 border-[20px] border-black/5 rounded-xl border-dashed" />
        </motion.div>
      )}

      {normalizedTheme.includes('space') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          <div className="absolute top-12 left-12 text-3xl animate-pulse text-yellow-100">⭐</div>
          <div className="absolute top-24 right-24 text-5xl drop-shadow-xl">🪐</div>
          <div className="absolute bottom-20 left-16 text-4xl animate-float">🚀</div>
          <div className="absolute bottom-12 right-12 text-3xl">☄️</div>
          <div className="absolute inset-0 bg-indigo-950/20 mix-blend-overlay" />
        </motion.div>
      )}

      {normalizedTheme.includes('jungle') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute top-0 left-0 w-40 h-40 text-7xl opacity-80 drop-shadow-md">🌿</div>
          <div className="absolute top-0 right-0 w-40 h-40 text-7xl opacity-80 scale-x-[-1] drop-shadow-md">🌿</div>
          <div className="absolute bottom-8 left-8 text-5xl">🦁</div>
          <div className="absolute bottom-8 right-8 text-5xl">🐒</div>
          <div className="absolute inset-0 bg-green-900/5" />
        </motion.div>
      )}

      {normalizedTheme.includes('marvel') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute top-8 left-8 text-5xl drop-shadow-lg">💥</div>
          <div className="absolute bottom-12 right-8 text-5xl drop-shadow-lg">🛡️</div>
          <div className="absolute top-8 right-8 text-5xl drop-shadow-lg">⚡</div>
          <div className="absolute inset-0 border-4 border-red-600/20 m-4 rounded-lg" />
        </motion.div>
      )}

      {normalizedTheme.includes('frozen') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-6xl drop-shadow-lg animate-spin-slow">❄️</div>
          <div className="absolute bottom-20 left-8 text-5xl">⛄</div>
          <div className="absolute bottom-20 right-8 text-5xl">🏰</div>
          <div className="absolute inset-0 bg-cyan-100/10" />
        </motion.div>
      )}

      {normalizedTheme.includes('boss baby') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute top-8 left-8 text-5xl">💼</div>
          <div className="absolute top-8 right-8 text-5xl">🕶️</div>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-5xl">🍼</div>
          <div className="absolute inset-0 border-[20px] border-blue-900/10 rounded-xl" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LivePreview;
