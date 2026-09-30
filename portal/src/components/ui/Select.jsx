import React, { forwardRef } from 'react';

/**
 * Standard Government Form Select Dropdown
 */
export const Select = forwardRef(function Select(
  {
    label,
    name,
    options = [],
    required = false,
    error,
    helperText,
    className = '',
    id,
    ...props
  },
  ref
) {
  const selectId = id || name;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-semibold text-slate-800">
          {label} {required && <span className="text-govred font-bold" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          name={name}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          className={`w-full px-3 py-2 text-sm text-slate-900 bg-white border rounded shadow-sm transition-colors border-slate-300 focus:outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 disabled:bg-slate-100 disabled:cursor-not-allowed ${
            error ? 'border-govred focus:border-govred' : ''
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {helperText && !error && (
        <p id={`${selectId}-helper`} className="text-xs text-slate-500">
          {helperText}
        </p>
      )}

      {error && (
        <p id={`${selectId}-error`} role="alert" className="text-xs font-semibold text-govred flex items-center space-x-1 mt-1">
          <span aria-hidden="true">⚠️</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});

export default Select;
