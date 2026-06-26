import React from 'react';

export interface Flavor {
  id: string;
  name: string;
  image: string;
  basePrice: number;
}

export const FLAVORS: Flavor[] = [
  { id: 'chocolate', name: 'Chocolate', image: '/images/products/Chocolate Crown Birthday Cake.jpg', basePrice: 499 },
  { id: 'vanilla', name: 'Vanilla', image: '/images/products/Eggless Vanilla Bean Cake.jpg', basePrice: 549 },
  { id: 'red-velvet', name: 'Red Velvet', image: '/images/products/Eggless Red Velvet Cake.jpg', basePrice: 599 },
  { id: 'fruit', name: 'Fruit', image: '/images/products/Fruit Burst Heart Cake.jpg', basePrice: 649 },
  { id: 'black-forest', name: 'Black Forest', image: '/images/products/Eggless Black Forest Cake.jpg', basePrice: 549 },
  { id: 'mango', name: 'Mango', image: '/images/products/Eggless Mango Cream Cake.jpg', basePrice: 499 },
];

interface FlavorSelectorProps {
  selectedFlavorId: string;
  onFlavorChange: (flavor: Flavor) => void;
}

const FlavorSelector: React.FC<FlavorSelectorProps> = ({ selectedFlavorId, onFlavorChange }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-text-mid uppercase tracking-wider">
        1. Choose Flavor
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {FLAVORS.map((flavor) => (
          <button
            key={flavor.id}
            onClick={() => onFlavorChange(flavor)}
            className={`
              flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200
              ${selectedFlavorId === flavor.id
                ? 'border-rose-deep bg-rose/5 shadow-sm'
                : 'border-cream-dark hover:border-blush bg-white'}
            `}
          >
            <span className={`text-sm font-medium ${selectedFlavorId === flavor.id ? 'text-rose-deep' : 'text-text-mid'}`}>
              {flavor.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FlavorSelector;
