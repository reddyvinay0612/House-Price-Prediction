import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { History, Trash2, ArrowUpRight, MapPin, Clock, Home, RotateCcw } from 'lucide-react';
import { formatIndianPrice } from '../../utils/formatters';

/**
 * Format location strings cleanly (removes technical slugs like 'ka-shivamogga-shimoga')
 */
function cleanLocation(locality, city) {
  let loc = locality || 'Prime Zone';
  let cit = city || 'Bengaluru';

  // Format city if it contains state prefix (e.g. ka-shivamogga-shimoga)
  if (cit.includes('-')) {
    const parts = cit.split('-');
    if (parts.length >= 2) {
      // Pick the main district name (capitalized)
      cit = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    }
  } else {
    cit = cit.charAt(0).toUpperCase() + cit.slice(1);
  }

  // Clean locality if needed
  if (loc.startsWith('Other Localities')) {
    loc = 'City Center';
  } else if (loc.includes('-')) {
    const parts = loc.split('-');
    if (parts.length >= 2) {
      loc = parts.slice(1).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }
  }

  // Capitalize first letters
  loc = loc.replace(/\b\w/g, (c) => c.toUpperCase());
  cit = cit.replace(/\b\w/g, (c) => c.toUpperCase());

  return { loc, cit };
}

/**
 * Simple, Clean & Easy-to-Understand Recent Estimates List
 * Presents saved estimates as readable cards with location, price, and 1-click restore.
 */
export function RecentEstimates({ onSelectEstimate }) {
  const { recentEstimates, clearEstimates } = useApp();
  const { t } = useTranslation();

  if (!recentEstimates || recentEstimates.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-navy-50 text-navy-800">
            <History className="w-4 h-4 text-saffron-dark" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-navy-900">
                Recent Estimates
              </h3>
              <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700">
                {recentEstimates.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Click any property to load its valuation
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={clearEstimates}
          className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded transition flex items-center gap-1"
          title="Clear all saved estimates"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      {/* Clean Card List (Scrollable if > 4 items) */}
      <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
        {recentEstimates.map((item, idx) => {
          const formattedTime = new Date(item.timestamp || Date.now()).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          });
          const formattedDate = new Date(item.timestamp || Date.now()).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
          });

          const rawCity = item.city || item.inputs?.city || 'Bengaluru';
          const rawLocality = item.locality || item.inputs?.locality || item.Neighborhood || 'Whitefield';
          const { loc, cit } = cleanLocation(rawLocality, rawCity);

          const sqft = item.total_sqft || item.inputs?.total_sqft || 1200;
          const bhk = item.bhk || item.inputs?.bhk || 2;
          const bath = item.bath || item.inputs?.bath || 2;

          const priceLakhs =
            item.predicted_price_lakhs ||
            item.price_in_lakhs ||
            item.price ||
            (item.inputs?.total_sqft ? (item.inputs.total_sqft * 5500) / 100000 : 75.0);

          const priceText = item.formatted_price || formatIndianPrice(priceLakhs);

          return (
            <div
              key={item.id || idx}
              onClick={() => onSelectEstimate && onSelectEstimate(item)}
              className="group p-3 rounded-lg border border-slate-200 hover:border-navy-400 bg-slate-50/70 hover:bg-navy-50/40 transition-all duration-150 cursor-pointer space-y-2 shadow-2xs"
            >
              {/* Top Row: Location & Price */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1 font-bold text-xs text-navy-900 truncate group-hover:text-navy-700">
                    <MapPin className="w-3.5 h-3.5 text-saffron shrink-0" />
                    <span className="truncate">{loc}, {cit}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium pl-4.5">
                    {bhk} BHK • {Number(sqft).toLocaleString('en-IN')} sq.ft • {bath} Bath
                  </div>
                </div>

                {/* Price Badge */}
                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-extrabold text-emerald-800 font-mono block bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {priceText}
                  </span>
                </div>
              </div>

              {/* Bottom Row: Timestamp & Restore Action */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 pl-4.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{formattedDate}, {formattedTime}</span>
                </span>

                <span className="font-bold text-navy-700 group-hover:text-saffron-dark transition flex items-center gap-0.5">
                  <span>View Details</span>
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentEstimates;
