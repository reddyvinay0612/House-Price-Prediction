import React, { useState } from 'react';
import { Tag, AlertTriangle, CheckCircle, TrendingDown, TrendingUp, Info } from 'lucide-react';

/**
 * M6: Asking-Price Checker Component
 * Evaluates a seller's quoted price against the econometric benchmark.
 * Features a visual gauge (Underpriced, Fair within ±10%, Overpriced),
 * gap in ₹ and %, negotiation tips, and outlier alert (>30% gap = 'Possible mispricing').
 */
export default function AskingPriceChecker({ estimatedPriceLakhs = 75.0 }) {
  const [askingPrice, setAskingPrice] = useState('');
  const [analyzed, setAnalyzed] = useState(false);

  const askingNum = parseFloat(askingPrice);
  const isValid = !isNaN(askingNum) && askingNum > 0;

  // Calculations
  const estNum = estimatedPriceLakhs || 75.0;
  const diffLakhs = isValid ? askingNum - estNum : 0;
  const pctDiff = isValid ? ((diffLakhs / estNum) * 100) : 0;

  // Verdict determination
  let verdict = 'fair';
  let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let verdictTitle = 'Fair Valuation Range (±10%)';
  let negotiationTip = 'The seller’s price aligns closely with econometric benchmarks. Standard negotiation of 3–5% on stamp duty or closing charges is advised.';

  if (isValid) {
    if (pctDiff > 30) {
      verdict = 'extreme_high';
      badgeColor = 'bg-red-100 text-red-800 border-red-300';
      verdictTitle = '⚠️ Severe Overpricing / Possible Mispricing Alert';
      negotiationTip = `The asking price is ₹${diffLakhs.toFixed(2)} Lakh (+${pctDiff.toFixed(1)}%) above benchmark. Highly caution against this listing or demand structural justification before proceeding.`;
    } else if (pctDiff > 10) {
      verdict = 'high';
      badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
      verdictTitle = 'Overpriced Listing (+10% to +30%)';
      negotiationTip = `The property is listed ₹${diffLakhs.toFixed(2)} Lakh (+${pctDiff.toFixed(1)}%) higher than model estimates. Recommend citing circle rates and comparable local sales to negotiate downwards.`;
    } else if (pctDiff < -30) {
      verdict = 'extreme_low';
      badgeColor = 'bg-purple-100 text-purple-800 border-purple-300';
      verdictTitle = '⚠️ Substantial Discount / Due Diligence Alert';
      negotiationTip = `The listing is ₹${Math.abs(diffLakhs).toFixed(2)} Lakh (${Math.abs(pctDiff).toFixed(1)}% below) benchmark. Verify land title clear titles, encumbrance certificates, and RERA registration before transacting.`;
    } else if (pctDiff < -10) {
      verdict = 'low';
      badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
      verdictTitle = 'Underpriced / High Value Deal (-10% to -30%)';
      negotiationTip = `The asking price offers an attractive saving of ₹${Math.abs(diffLakhs).toFixed(2)} Lakh (${Math.abs(pctDiff).toFixed(1)}% below estimate). Fast-track legal scrutiny to secure the property.`;
    }
  }

  // Gauge pointer percentage (scaled from -40% to +40%)
  const gaugePercent = Math.min(100, Math.max(0, ((pctDiff + 40) / 80) * 100));

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-navy-50 text-navy-800">
            <Tag className="w-4 h-4 text-saffron-dark" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-navy-900">
              Seller's Asking-Price Checker • विक्रेता मूल्य सत्यापन (M6)
            </h3>
            <p className="text-xs text-slate-500">
              Compare seller quotes against certified benchmark valuations
            </p>
          </div>
        </div>
      </div>

      {/* Input row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div className="sm:col-span-2 space-y-1">
          <label htmlFor="asking-price-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Enter Quoted Asking Price (₹ in Lakhs)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-xs">
              ₹
            </span>
            <input
              id="asking-price-input"
              type="number"
              step="0.5"
              min="1"
              placeholder={`e.g. ${(estNum * 1.05).toFixed(1)} Lakh`}
              value={askingPrice}
              onChange={(e) => {
                setAskingPrice(e.target.value);
                setAnalyzed(true);
              }}
              className="w-full pl-8 pr-16 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-transparent"
            />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 font-medium text-xs">
              Lakh
            </span>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setAnalyzed(true)}
            disabled={!isValid}
            className="w-full py-2 px-3 bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs rounded transition shadow-sm disabled:opacity-50"
          >
            Verify Quoted Price
          </button>
        </div>
      </div>

      {/* Analysis Result */}
      {analyzed && isValid && (
        <div className="space-y-4 pt-2 border-t border-slate-100 animate-fadeIn">
          {/* Gauge Meter */}
          <div className="space-y-1.5 bg-slate-50 p-3.5 rounded border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-700">Underpriced (-30%)</span>
              <span className="text-navy-900">Fair Value (±10%)</span>
              <span className="text-govred">Overpriced (+30%)</span>
            </div>

            {/* Gauge bar track */}
            <div className="relative h-4 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-300 to-red-500 shadow-inner">
              {/* Benchmark Center Marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-black/60 z-10"
                style={{ left: '50%' }}
                title="Econometric Benchmark (0% delta)"
              />
              {/* Pointer indicator */}
              <div
                className="absolute top-0 bottom-0 w-2.5 bg-navy-950 border border-white rounded-full shadow-md transform -translate-x-1/2 transition-all duration-500"
                style={{ left: `${gaugePercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span>-40%</span>
              <span className="font-bold text-navy-800">
                Benchmark: ₹{estNum.toFixed(2)} Lakh
              </span>
              <span>+40%</span>
            </div>
          </div>

          {/* Verdict Card */}
          <div className={`p-3.5 rounded border ${badgeColor} space-y-2`}>
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5">
                {verdictTitle}
              </span>
              <span className="font-mono font-bold text-xs">
                {pctDiff >= 0 ? '+' : ''}
                {pctDiff.toFixed(1)}% (₹{diffLakhs >= 0 ? '+' : ''}
                {diffLakhs.toFixed(2)} L)
              </span>
            </div>

            <p className="text-xs leading-relaxed font-medium">
              <strong>Negotiation Strategy:</strong> {negotiationTip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
