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

      {/* Overlay layers */}
      <div className="absolute inset-0 flex flex-col items-center pt-[20%]">
        {/* Edible Photo Layer */}
        {photo && (
          <div className="relative w-[45%] aspect-square rounded-full overflow-hidden border-4 border-white/80 shadow-lg mb-6 animate-fade-up">
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
          <div className="px-6 py-2">
            <p
              className="font-dancing text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-center break-words max-w-[280px]"
              style={{
                fontSize: message.length > 15 ? '1.5rem' : '2.2rem',
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
