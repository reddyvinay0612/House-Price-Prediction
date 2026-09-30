import React from 'react';
import { Check } from 'lucide-react';

/**
 * Government Form Multi-Step Wizard Progress Stepper
 */
export function Stepper({ steps = [], currentStep = 1, onStepClick }) {
  return (
    <nav aria-label="Progress" className="w-full mb-8">
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li
              key={step.title || idx}
              className={`relative flex-1 ${
                idx !== steps.length - 1
                  ? 'after:content-[""] after:w-full after:h-1 after:border-b after:border-2 after:inline-block after:absolute after:top-4 after:left-1/2 after:-z-10 ' +
                    (isCompleted ? 'after:border-navy-700' : 'after:border-slate-200')
                  : ''
              }`}
            >
              <div
                className="flex flex-col items-center group cursor-default"
                onClick={() => isCompleted && onStepClick && onStepClick(stepNumber)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    isCompleted
                      ? 'bg-navy-700 text-white border-2 border-navy-700 cursor-pointer hover:bg-navy-800'
                      : isCurrent
                      ? 'bg-white text-navy-700 border-2 border-navy-700 ring-4 ring-navy-100 font-extrabold'
                      : 'bg-white text-slate-400 border-2 border-slate-300'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? <Check className="w-4 h-4 text-white stroke-[3]" /> : stepNumber}
                </div>
                <span
                  className={`mt-2 text-xs font-semibold text-center hidden sm:block ${
                    isCurrent ? 'text-navy-700 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Stepper;
