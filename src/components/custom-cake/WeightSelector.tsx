import React from 'react';

export interface WeightOption {
  label: string;
  value: number; // in Kg
  multiplier: number;
}

export const WEIGHT_OPTIONS: WeightOption[] = [
  { label: '0.5 Kg', value: 0.5, multiplier: 1 },
  { label: '1 Kg', value: 1, multiplier: 1.8 },
  { label: '2 Kg', value: 2, multiplier: 3.5 },
];

interface WeightSelectorProps {
  selectedWeight: number;
  onWeightChange: (weight: WeightOption) => void;
}

const WeightSelector: React.FC<WeightSelectorProps> = ({ selectedWeight, onWeightChange }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-text-mid uppercase tracking-wider">
        2. Select Weight
      </label>
      <div className="flex gap-3">
        {WEIGHT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onWeightChange(opt)}
            className={`
              flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all duration-200
              ${selectedWeight === opt.value
                ? 'border-rose-deep bg-rose/5 text-rose-deep shadow-sm'
                : 'border-cream-dark hover:border-blush bg-white text-text-mid'}
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeightSelector;
