import React from 'react';
import { Check, X } from 'lucide-react';

/**
 * Live Government Password Security & Strength Evaluator
 */
export function PasswordStrengthMeter({ password = '' }) {
  const criteria = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { label: 'One number (0-9)', met: /[0-9]/.test(password) },
    { label: 'One special character (!@#$%^&*)', met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
  ];

  const metCount = criteria.filter((c) => c.met).length;

  let strengthLabel = 'Very Weak';
  let strengthColor = 'bg-slate-200';
  let barWidth = 'w-0';

  if (password.length > 0) {
    if (metCount <= 2) {
      strengthLabel = 'Weak';
      strengthColor = 'bg-govred';
      barWidth = 'w-1/4';
    } else if (metCount === 3 || metCount === 4) {
      strengthLabel = 'Moderate';
      strengthColor = 'bg-saffron';
      barWidth = 'w-3/4';
    } else if (metCount === 5) {
      strengthLabel = 'Strong (Compliant)';
      strengthColor = 'bg-indiagreen';
      barWidth = 'w-full';
    }
  }

  return (
    <div className="space-y-2 mt-1.5" aria-live="polite">
      {/* Visual Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-500 font-medium">Password Strength:</span>
          <span
            className={`font-bold font-mono ${
              metCount === 5
                ? 'text-indiagreen-dark'
                : metCount >= 3
                ? 'text-saffron-dark'
                : 'text-govred'
            }`}
          >
            {password.length > 0 ? strengthLabel : 'Not entered'}
          </span>
        </div>

        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strengthColor} ${barWidth}`}
            role="progressbar"
            aria-valuenow={metCount * 20}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Password strength is ${strengthLabel}`}
          />
        </div>
      </div>

      {/* Criteria Checklist (Shown when typing) */}
      {password.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 bg-slate-50 p-2 rounded border border-slate-200 text-[10px]">
          {criteria.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center space-x-1 ${
                item.met ? 'text-indiagreen-dark font-medium' : 'text-slate-500'
              }`}
            >
              {item.met ? (
                <Check className="w-3 h-3 text-indiagreen flex-shrink-0" />
              ) : (
                <X className="w-3 h-3 text-slate-400 flex-shrink-0" />
              )}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PasswordStrengthMeter;
