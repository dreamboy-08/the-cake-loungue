import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = "", loading = false }) => {
  const baseSpacing = "pt-40 md:pt-52 pb-20 bg-cream min-h-screen";

  return (
    <div className={`${baseSpacing} ${loading ? 'flex flex-col items-center justify-center' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default PageWrapper;
