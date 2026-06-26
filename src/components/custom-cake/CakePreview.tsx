import React from 'react';
import Image from 'next/image';
import { Flavor } from './FlavorSelector';

interface CakePreviewProps {
  flavor: Flavor;
  photo: string | null;
  message: string;
}

const CakePreview: React.FC<CakePreviewProps> = ({ flavor, photo, message }) => {
  return (
    <div className="relative w-full aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-cream-dark">
      {/* Base Cake Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={flavor.image}
          alt={flavor.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Overlay layers - Standardized positioning to match Canvas Exporter */}
      <div className="absolute inset-0">
        {/* Edible Photo Layer */}
        {photo && (
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full overflow-hidden border-[4px] md:border-[6px] border-white/80 shadow-lg animate-fade-up"
            style={{
              top: '20%',
              width: '45%',
              aspectRatio: '1/1'
            }}
          >
            <Image
              src={photo}
              alt="Edible Photo"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Message Layer */}
        {message && (
          <div
            className="absolute left-1/2 -translate-x-1/2 w-full px-6 flex justify-center"
            style={{
              top: photo ? '70%' : '45%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <p
              className="font-dancing text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-center break-words max-w-[80%]"
              style={{
                fontSize: message.length > 15 ? 'clamp(1.2rem, 4vw, 1.8rem)' : 'clamp(1.8rem, 6vw, 2.5rem)',
                lineHeight: 1.1
              }}
            >
              {message}
            </p>
          </div>
        )}
      </div>

      {/* Premium Badge */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-widest text-rose-deep">Premium Quality</span>
      </div>
    </div>
  );
};

export default CakePreview;
