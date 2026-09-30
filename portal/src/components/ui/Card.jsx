import React from 'react';

/**
 * Standard Government UI Card Component with clean flat border and header accent
 */
export function Card({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  accent = 'navy', // 'navy', 'gold', 'green', 'none'
  className = '',
  bodyClassName = 'p-5 sm:p-6',
  ...props
}) {
  const accents = {
    navy: 'border-t-4 border-t-navy-700',
    gold: 'border-t-4 border-t-gold',
    green: 'border-t-4 border-t-govgreen',
    red: 'border-t-4 border-t-govred',
    none: '',
  };

  return (
    <div
      className={`bg-white rounded border border-slate-200 shadow-gov overflow-hidden ${accents[accent] || ''} ${className}`}
      {...props}
    >
      {(title || Icon || action) && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-govgrey-50/50">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="w-8 h-8 rounded bg-navy-50 text-navy-700 flex items-center justify-center border border-navy-100">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              {title && <h3 className="text-base font-bold text-slate-900 leading-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-govtext-muted mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

export default Card;
