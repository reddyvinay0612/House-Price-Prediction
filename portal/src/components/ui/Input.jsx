import React, { forwardRef } from 'react';

/**
 * Standard Government Form Input with accessible label, error announcement, and helper text
 */
export const Input = forwardRef(function Input(
  {
    label,
    name,
    type = 'text',
    required = false,
    error,
    helperText,
    prefix,
    suffix,
    className = '',
    id,
    ...props
  },
  ref
) {
  const inputId = id || name;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-slate-800">
          {label} {required && <span className="text-govred font-bold" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative flex rounded border shadow-sm transition-colors border-slate-300 focus-within:border-navy-700 focus-within:ring-1 focus-within:ring-navy-700 bg-white">
        {prefix && (
          <span className="inline-flex items-center px-3 text-slate-500 bg-slate-50 border-r border-slate-300 text-sm font-medium rounded-l">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`w-full px-3 py-2 text-sm text-slate-900 bg-transparent rounded focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed ${
            error ? 'border-govred focus:border-govred' : ''
          } ${className}`}
          {...props}
        />
        {suffix && (
          <span className="inline-flex items-center px-3 text-slate-500 bg-slate-50 border-l border-slate-300 text-sm font-medium rounded-r">
            {suffix}
          </span>
        )}
      </div>

      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-xs text-slate-500">
          {helperText}
        </p>
      )}

      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs font-semibold text-govred flex items-center space-x-1 mt-1">
          <span aria-hidden="true">⚠️</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});

export default Input;
