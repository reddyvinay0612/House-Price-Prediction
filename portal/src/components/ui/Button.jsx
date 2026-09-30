import React from 'react';

/**
 * Standard Government UI Button Component
 */
export function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-tight transition-all rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary: 'bg-navy-700 hover:bg-navy-800 active:bg-navy-900 text-white border border-navy-800 shadow-gov',
    secondary: 'bg-govgrey-200 hover:bg-govgrey-300 active:bg-govgrey-400 text-govtext border border-govgrey-300',
    outline: 'bg-transparent hover:bg-navy-50 text-navy-700 border-2 border-navy-700',
    danger: 'bg-govred hover:bg-govred-dark active:bg-red-900 text-white border border-govred-dark shadow-gov',
    gold: 'bg-gold hover:bg-gold-dark text-slate-900 font-extrabold border border-gold-dark shadow-gov',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 space-x-1.5',
    md: 'text-sm px-4 py-2 space-x-2',
    lg: 'text-base px-6 py-3 space-x-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      <span>{children}</span>
    </button>
  );
}

export default Button;
