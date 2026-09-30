import React from 'react';

/**
 * Official Indian Government Portal Tricolour Ribbon
 * Saffron (#ff9933) / White (#ffffff) / India Green (#138808)
 */
export function TricolourBar({ height = 'h-1.5', className = '' }) {
  return (
    <div className={`w-full flex ${height} ${className} shadow-sm`} aria-hidden="true">
      <div className="flex-1 bg-saffron" />
      <div className="flex-1 bg-white" />
      <div className="flex-1 bg-indiagreen" />
    </div>
  );
}

export default TricolourBar;
