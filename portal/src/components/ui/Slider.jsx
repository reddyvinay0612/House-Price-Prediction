import React from 'react';

/**
 * Accessible Government Range Slider with display badge
 */
export function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange,
  required = false,
  error,
  helperText,
  displayFormat,
  id,
  name,
  className = '',
}) {
  const sliderId = id || name;
  const formattedDisplay = displayFormat ? displayFormat(value) : `${Number(value).toLocaleString()}${unit ? ` ${unit}` : ''}`;

  return (
    <div className={`w-full space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        {label && (
          <label htmlFor={sliderId} className="block text-sm font-semibold text-slate-800">
            {label} {required && <span className="text-govred font-bold">*</span>}
          </label>
        )}
        <span className="text-xs font-bold text-navy-700 bg-navy-50 px-2.5 py-1 rounded border border-navy-200">
          {formattedDisplay}
        </span>
      </div>

      <input
        id={sliderId}
        name={name}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded appearance-none cursor-pointer accent-navy-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-700"
      />

      <div className="flex justify-between text-[11px] text-slate-500 font-medium">
        <span>{min.toLocaleString()}{unit ? ` ${unit}` : ''}</span>
        <span>{Math.round((min + max) / 2).toLocaleString()}{unit ? ` ${unit}` : ''}</span>
        <span>{max.toLocaleString()}{unit ? ` ${unit}` : ''}</span>
      </div>

      {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
      {error && (
        <p role="alert" className="text-xs font-semibold text-govred flex items-center space-x-1">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export default Slider;
