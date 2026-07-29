import React, { useState, useEffect } from 'react';

interface CakeMessageInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export const validateCakeMessage = (message: string): { isValid: boolean; error: string | null } => {
  if (message.length > 25) {
    return { isValid: false, error: "Maximum 25 characters allowed." };
  }

  // Allow letters, numbers, spaces, and basic punctuation: . , ! ? - ' " ( ) @ & +
  const allowedRegex = /^[a-zA-Z0-9\s.,!?\-'"()@&+]*$/;
  if (!allowedRegex.test(message)) {
    return { isValid: false, error: "Allowed: letters, numbers, spaces, and basic punctuation (. , ! ? - ' \" ( ) @ & +)." };
  }

  return { isValid: true, error: null };
};

const CakeMessageInput: React.FC<CakeMessageInputProps> = ({ value, onChange }) => {
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    const { isValid, error: validationError } = validateCakeMessage(text);

    setError(validationError);
    onChange(text, isValid);
  };

  return (
    <div className="bg-cream p-5 rounded-2xl border border-cream-dark/60 space-y-3 shadow-sm">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-black text-chocolate uppercase tracking-widest">
          Custom Cake Message <span className="text-[10px] text-text-soft font-medium lowercase tracking-normal">(optional)</span>
        </label>
        <span className={`text-[10px] font-bold ${value.length > 25 ? 'text-rose-deep font-black' : 'text-text-soft'}`}>
          {value.length}/25
        </span>
      </div>

      <div className="relative">
        <input
          type="text"
          maxLength={28} // allow typing a bit more to trigger validation or clamp at 25
          value={value}
          onChange={handleInputChange}
          placeholder="Write your cake message..."
          className={`w-full px-4 py-3 bg-white border rounded-xl outline-none text-sm font-medium transition-all ${
            error
              ? 'border-rose-deep focus:ring-1 focus:ring-rose-deep text-rose-deep'
              : 'border-cream-dark/60 focus:border-rose-deep text-chocolate placeholder:text-text-soft/60'
          }`}
        />
      </div>

      {error && (
        <p className="text-[11px] font-bold text-rose-deep leading-tight animate-fade-in">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

export default CakeMessageInput;
