import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Accessible Government Accordion for FAQs
 */
export function Accordion({ items = [], allowMultiple = false, className = '' }) {
  const [openIndexes, setOpenIndexes] = useState([0]);

  const toggleIndex = (index) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={`divide-y divide-slate-200 border border-slate-200 rounded bg-white shadow-gov ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndexes.includes(idx);
        const headerId = `accordion-header-${idx}`;
        const panelId = `accordion-panel-${idx}`;

        return (
          <div key={idx} className="transition-colors">
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen ? 'true' : 'false'}
                aria-controls={panelId}
                onClick={() => toggleIndex(idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between font-bold text-slate-900 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-700"
              >
                <span className="text-sm sm:text-base pr-4">{item.question || item.title}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'transform rotate-180 text-navy-700' : ''
                  }`}
                />
              </button>
            </h3>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className="px-5 pb-5 pt-1 text-sm text-govtext-muted leading-relaxed"
              >
                {item.answer || item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
