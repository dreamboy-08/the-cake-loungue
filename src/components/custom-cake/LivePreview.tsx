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
    <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-rose-100/50 sticky top-32">
      <div className="relative w-full aspect-square bg-[#fdfaf8]">
        <AnimatePresence mode="wait">
          <motion.div
            key={cakeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={cakeImage}
              alt={`${flavor} Cake Base`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            {/* Subtle vignetting for focus */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Realistic Edible Photo Integration */}
        <AnimatePresence>
          {photo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[220px] h-[220px] z-10"
              style={{ perspective: '1000px' }}
            >
              <div
                className="w-full h-full relative"
                style={{
                  transform: 'rotateX(25deg) rotateY(-5deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Edible Print Shadow */}
                <div className="absolute inset-0 bg-black/40 blur-md translate-y-2 translate-x-1 rounded-full opacity-60" />

                {/* The Edible Print */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    clipPath: 'circle(48%)',
                    background: 'white'
                  }}
                >
                  <Image src={photo} alt="Custom" fill className="object-cover opacity-95" />

                  {/* Edible Texture Overlay (Wafer Paper / Sugar Sheet texture) */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] mix-blend-multiply" />

                  {/* Subtle highlight */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                </div>

                {/* Realistic Frosting Border (Simulated with multiple shadows and borders) */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    clipPath: 'circle(50%)',
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.8), 0 0 0 4px rgba(255,255,255,0.9)',
                  }}
                />

                {/* Piped Icing Effect around the photo */}
                <div className="absolute inset-0 rounded-full border-[6px] border-white/40 blur-[1px] opacity-60" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real-time Icing Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-[15%] left-0 w-full text-center z-20 pointer-events-none px-12"
            style={{
              transform: 'rotateX(25deg)',
              perspective: '1000px'
            }}
          >
            <span
              className="font-dancing text-2xl md:text-4xl inline-block text-white leading-tight"
              style={{
                textShadow: `
                  1px 1px 0px rgba(0,0,0,0.3),
                  2px 2px 5px rgba(0,0,0,0.6),
                  -1px -1px 2px rgba(255,255,255,0.2)
                `,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
              }}
            >
              {message}
            </span>
          </motion.div>
        )}

        {/* Theme Effects - Integrated more naturally */}
        <ThemeOverlays theme={theme} />
      </div>

      {/* Visual Indicator of focus */}
      <div className="bg-rose-50/50 py-4 border-t border-rose-100 flex items-center justify-center gap-3">
        <div className="h-px w-12 bg-rose-200" />
        <span className="font-playfair text-rose-900 tracking-widest text-sm uppercase">Live Cake Preview</span>
        <div className="h-px w-12 bg-rose-200" />
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
          {/* Using higher quality looking placements */}
          <div className="absolute top-[10%] left-[10%] text-6xl drop-shadow-2xl grayscale-[0.2] contrast-125">👑</div>
          <div className="absolute top-[15%] right-[12%] text-4xl drop-shadow-2xl animate-pulse">✨</div>
          <div className="absolute bottom-[20%] left-[15%] text-5xl drop-shadow-2xl">🪄</div>
          {/* Subtle color grading for theme */}
          <div className="absolute inset-0 bg-pink-400/5 mix-blend-soft-light" />
        </motion.div>
      )}

      {normalizedTheme.includes('cars') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute bottom-[25%] left-[5%] text-6xl drop-shadow-2xl">🏎️</div>
          <div className="absolute bottom-[15%] right-[8%] text-6xl drop-shadow-2xl">🏁</div>
          <div className="absolute top-[20%] left-[10%] text-5xl drop-shadow-2xl animate-bounce">🚩</div>
          <div className="absolute inset-0 bg-red-900/5 mix-blend-overlay" />
        </motion.div>
      )}

      {normalizedTheme.includes('space') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          <div className="absolute top-[15%] left-[15%] text-3xl animate-pulse text-yellow-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">⭐</div>
          <div className="absolute top-[20%] right-[20%] text-6xl drop-shadow-2xl">🪐</div>
          <div className="absolute bottom-[30%] left-[10%] text-5xl drop-shadow-2xl animate-float">🚀</div>
          <div className="absolute inset-0 bg-indigo-900/10 mix-blend-color-burn" />
        </motion.div>
      )}

      {normalizedTheme.includes('jungle') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute top-[-5%] left-[-5%] text-8xl opacity-90 drop-shadow-2xl">🌿</div>
          <div className="absolute top-[-5%] right-[-5%] text-8xl opacity-90 scale-x-[-1] drop-shadow-2xl">🌿</div>
          <div className="absolute bottom-[20%] left-[10%] text-6xl drop-shadow-2xl">🦁</div>
          <div className="absolute bottom-[15%] right-[10%] text-6xl drop-shadow-2xl">🐒</div>
          <div className="absolute inset-0 bg-green-900/10 mix-blend-soft-light" />
        </motion.div>
      )}

      {normalizedTheme.includes('marvel') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute top-[10%] left-[10%] text-6xl drop-shadow-2xl">💥</div>
          <div className="absolute bottom-[25%] right-[10%] text-6xl drop-shadow-2xl">🛡️</div>
          <div className="absolute top-[15%] right-[15%] text-6xl drop-shadow-2xl">⚡</div>
          <div className="absolute inset-0 bg-red-600/5 mix-blend-overlay" />
        </motion.div>
      )}

      {normalizedTheme.includes('frozen') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 text-7xl drop-shadow-2xl animate-spin-slow">❄️</div>
          <div className="absolute bottom-[30%] left-[12%] text-6xl drop-shadow-2xl">⛄</div>
          <div className="absolute bottom-[20%] right-[12%] text-6xl drop-shadow-2xl">🏰</div>
          <div className="absolute inset-0 bg-blue-100/10 mix-blend-screen" />
        </motion.div>
      )}

      {normalizedTheme.includes('boss baby') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute top-[15%] left-[12%] text-6xl drop-shadow-2xl">💼</div>
          <div className="absolute top-[10%] right-[15%] text-6xl drop-shadow-2xl">🕶️</div>
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-6xl drop-shadow-2xl">🍼</div>
          <div className="absolute inset-0 bg-blue-900/5 mix-blend-overlay" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LivePreview;
