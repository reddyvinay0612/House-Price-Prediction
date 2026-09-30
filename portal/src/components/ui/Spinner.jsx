import React from 'react';

/**
 * Accessible Loading Spinner
 */
export function Spinner({ size = 'md', className = '', label = 'Processing...' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div role="status" className="inline-flex items-center space-x-2">
      <div
        className={`rounded-full border-navy-700 border-t-transparent animate-spin ${
          sizes[size] || sizes.md
        } ${className}`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default Spinner;
