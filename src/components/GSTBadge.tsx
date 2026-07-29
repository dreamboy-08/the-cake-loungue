import React from 'react';

const GSTBadge: React.FC = () => {
  return (
    <span className="inline-flex items-center justify-center px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-[11px] font-semibold text-text-soft bg-cream border border-gold/30 tracking-wider uppercase select-none whitespace-nowrap">
      Inclusive of GST
    </span>
  );
};

export default GSTBadge;
