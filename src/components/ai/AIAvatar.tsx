"use client";

import React from 'react';
import Image from 'next/image';

interface AIAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  circular?: boolean;
}

const AIAvatar: React.FC<AIAvatarProps> = ({
  size = 'md',
  className = '',
  circular = true
}) => {
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 120,
    '2xl': 200
  };

  const pixelSize = sizeMap[size];
  const src = circular ? '/images/ai-assistant/avatar.svg' : '/images/ai-assistant/mascot.svg';

  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <Image
        src={src}
        alt="Cake Lounge AI Mascot"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
};

export default AIAvatar;
