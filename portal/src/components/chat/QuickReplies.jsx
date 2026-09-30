import React from 'react';
import { Sparkles } from 'lucide-react';

export function QuickReplies({ suggestions = [], onSelect, disabled = false }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="py-1.5 px-3 bg-slate-50 border-t border-slate-200 overflow-x-auto no-scrollbar flex items-center gap-1.5 flex-nowrap sm:flex-wrap">
      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
        <Sparkles className="w-3 h-3 text-saffron" />
        <span>Suggestions:</span>
      </div>
      {suggestions.map((suggestion, idx) => (
        <button
          key={idx}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(suggestion)}
          className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-slate-300 text-navy-900 hover:bg-navy-50 hover:border-navy-400 active:bg-navy-100 transition whitespace-nowrap shadow-2xs flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-navy-600"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

export default QuickReplies;
