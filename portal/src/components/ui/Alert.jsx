import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Standard Government Notification / Alert Banner
 */
export function Alert({
  type = 'info', // 'info', 'success', 'warning', 'error'
  title,
  content,
  children,
  className = '',
}) {
  const configs = {
    info: {
      border: 'border-l-4 border-navy-700 bg-navy-50 text-navy-950',
      icon: Info,
      iconColor: 'text-navy-700',
    },
    success: {
      border: 'border-l-4 border-govgreen bg-emerald-50 text-emerald-950',
      icon: CheckCircle,
      iconColor: 'text-govgreen',
    },
    warning: {
      border: 'border-l-4 border-gold bg-amber-50 text-amber-950',
      icon: AlertTriangle,
      iconColor: 'text-gold-dark',
    },
    error: {
      border: 'border-l-4 border-govred bg-red-50 text-red-950',
      icon: AlertCircle,
      iconColor: 'text-govred',
    },
  };

  const current = configs[type] || configs.info;
  const IconComponent = current.icon;

  return (
    <div
      role="alert"
      className={`p-4 rounded-r border border-slate-200/80 ${current.border} ${className}`}
    >
      <div className="flex items-start space-x-3">
        <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${current.iconColor}`} />
        <div className="text-sm">
          {title && <h4 className="font-bold mb-0.5">{title}</h4>}
          <div className="leading-relaxed">{content || children}</div>
        </div>
      </div>
    </div>
  );
}

export default Alert;
