'use client';

import React, { createContext, useContext, useState, useCallback, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

interface FlyAnimation {
  id: number;
  startRect: DOMRect;
  image: string;
}

interface FlyToCartContextType {
  flyToCart: (rect: DOMRect, image: string) => void;
  bounceCount: number;
}

const FlyToCartContext = createContext<FlyToCartContextType | undefined>(undefined);

export const FlyToCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [animations, setAnimations] = useState<FlyAnimation[]>([]);
  const [bounceCount, setBounceCount] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const handleAnimationComplete = useCallback((id: number) => {
    setBounceCount(prev => prev + 1);
    setAnimations(prev => prev.filter(anim => anim.id !== id));
  }, []);

  const flyToCart = useCallback((rect: DOMRect, image: string) => {
    if (shouldReduceMotion) {
      setBounceCount(prev => prev + 1);
      return;
    }

    const id = Date.now() + Math.random();
    setAnimations(prev => [...prev, { id, startRect: rect, image }]);
  }, [shouldReduceMotion]);

  return (
    <FlyToCartContext.Provider value={{ flyToCart, bounceCount }}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden">
        <AnimatePresence>
          {animations.map((anim) => (
            <FlyingThumbnail
              key={anim.id}
              animation={anim}
              onComplete={() => handleAnimationComplete(anim.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </FlyToCartContext.Provider>
  );
};

const FlyingThumbnail = ({
  animation,
  onComplete
}: {
  animation: FlyAnimation;
  onComplete: () => void;
}) => {
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    const cartIcon = document.getElementById('cart-icon-main');
    const cartRect = cartIcon?.getBoundingClientRect();

    if (cartRect) {
      const endX = cartRect.left + cartRect.width / 2 - 24;
      const endY = cartRect.top + cartRect.height / 2 - 24;
      setTargetPos({ x: endX, y: endY });
    } else {
      // Fallback or cleanup if cart not found
      onComplete();
    }
  }, [onComplete]);

  if (!targetPos) return null;

  const startX = animation.startRect.left + animation.startRect.width / 2 - 24;
  const startY = animation.startRect.top + animation.startRect.height / 2 - 24;

  return (
    <motion.div
      initial={{
        x: startX,
        y: startY,
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        x: targetPos.x,
        y: targetPos.y,
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.2, 1, 0.2],
      }}
      transition={{
        x: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
        y: { duration: 0.7, ease: [0.1, 0.7, 0.1, 1] },
        opacity: { times: [0, 0.2, 0.8, 1], duration: 0.7 },
        scale: { times: [0, 0.2, 0.8, 1], duration: 0.7 },
      }}
      onAnimationComplete={onComplete}
      className="fixed top-0 left-0 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-2xl z-[10000]"
    >
      <Image
        src={animation.image}
        alt=""
        fill
        unoptimized
        className="object-cover"
      />
    </motion.div>
  );
};

export const useFlyToCart = () => {
  const context = useContext(FlyToCartContext);
  if (!context) {
    throw new Error('useFlyToCart must be used within a FlyToCartProvider');
  }
  return context;
};
