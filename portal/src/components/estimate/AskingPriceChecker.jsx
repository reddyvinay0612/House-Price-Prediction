import React, { useState, useEffect } from 'react';
import {
  Tag,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Info,
  Scale,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Calculator,
  FileCheck,
  Percent,
} from 'lucide-react';
import { formatIndianPrice } from '../../utils/formatters';

/**
 * M6: Seller's Asking-Price Checker Component
 * Evaluates a seller's quoted price against the certified econometric benchmark.
 * Features:
 * - Real-time + interactive price evaluation
 * - 4-Zone visual gauge meter (-50% to +50%) with dynamic needle and tooltip
 * - One-click scenario preset pills (-20%, At Benchmark, +15%, +35%)
 * - Actionable negotiation strategy & recommended counter-offer target
 * - Due-diligence legal safety advisory
 */
export default function AskingPriceChecker({ estimatedPriceLakhs = 75.0 }) {
  const estNum = Number(estimatedPriceLakhs) || 75.0;

  // Initial state default to empty or user-input
  const [askingPrice, setAskingPrice] = useState('');
  const [analyzed, setAnalyzed] = useState(false);

  // Set default sample price on mount or when benchmark changes
  useEffect(() => {
    if (!askingPrice && estNum > 0) {
      const defaultQuote = Number((estNum * 1.05).toFixed(1));
      setAskingPrice(defaultQuote.toString());
      setAnalyzed(true);
    }
  }, [estNum]);

  const askingNum = parseFloat(askingPrice);
  const isValid = !isNaN(askingNum) && askingNum > 0;

  // Calculate Variance Metrics
  const diffLakhs = isValid ? askingNum - estNum : 0;
  const pctDiff = isValid && estNum > 0 ? (diffLakhs / estNum) * 100 : 0;

  // Gauge Percentage calculation (mapped to -50% to +50% range)
  // Clamp between 3% and 97% so the needle is always beautifully visible and never cut off
  const gaugePercent = Math.min(97, Math.max(3, ((pctDiff + 50) / 100) * 100));

  // Determine Verdict & Analysis Strategy
  let verdictType = 'fair';
  let badgeTheme = {
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    text: 'text-emerald-900',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: CheckCircle2,
    iconColor: 'text-emerald-600',
  };
  let verdictTitle = 'Fair Valuation Range (±10% of Benchmark)';
  let verdictSubtitle = 'Quoted price matches prevailing econometric market standards.';
  let negotiationAdvice =
    'The seller’s quote is well-aligned with neighborhood circle rates and registry trends. Recommend negotiating a modest 3% to 5% concession on stamp duty, legal transfer, or modular fittings.';
  let counterOffer = estNum;
  let riskLevel = 'Low Risk (Standard Market Trade)';

  if (isValid) {
    if (pctDiff > 30) {
      verdictType = 'extreme_high';
      badgeTheme = {
        bg: 'bg-red-50',
        border: 'border-red-300',
        text: 'text-red-950',
        badge: 'bg-red-100 text-red-800 border-red-300',
        icon: ShieldAlert,
        iconColor: 'text-red-600',
      };
      verdictTitle = '⚠️ Severe Overpricing / High Risk of Capital Loss (>+30%)';
      verdictSubtitle = `The seller is quoting ₹${diffLakhs.toFixed(2)} Lakh (+${pctDiff.toFixed(1)}%) above certified benchmark.`;
      negotiationAdvice =
        'This listing is substantially inflated above local registry rates. Do not accept this quote without formal appraisal justification. Present the certified benchmark and submit a firm counter-offer.';
      counterOffer = Number((estNum * 1.02).toFixed(2));
      riskLevel = 'High Risk (Potential Overpayment)';
    } else if (pctDiff > 10) {
      verdictType = 'high';
      badgeTheme = {
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-950',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: AlertTriangle,
        iconColor: 'text-amber-600',
      };
      verdictTitle = 'Moderately Overpriced (+10% to +30% Premium)';
      verdictSubtitle = `Listing carries a ₹${diffLakhs.toFixed(2)} Lakh (+${pctDiff.toFixed(1)}%) seller markup.`;
      negotiationAdvice =
        'The quoted price includes a seller buffer. Leverage neighborhood comparable registry records to negotiate down towards benchmark value, or request covered car parking / floor rise waiver.';
      counterOffer = Number((estNum * 0.98).toFixed(2));
      riskLevel = 'Moderate Risk (Room for Negotiation)';
    } else if (pctDiff < -30) {
      verdictType = 'extreme_low';
      badgeTheme = {
        bg: 'bg-purple-50',
        border: 'border-purple-300',
        text: 'text-purple-950',
        badge: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: AlertTriangle,
        iconColor: 'text-purple-600',
      };
      verdictTitle = '⚠️ Substantial Discount / Due Diligence Required (<-30%)';
      verdictSubtitle = `Quoted at ₹${Math.abs(diffLakhs).toFixed(2)} Lakh (${Math.abs(pctDiff).toFixed(1)}% below) benchmark.`;
      negotiationAdvice =
        'While financially lucrative, an extreme discount warrants mandatory title scrutiny. Verify clear title deeds, 30-year Encumbrance Certificate (EC), RERA approval, builder NOC, and unpaid municipal taxes before issuing any earnest token.';
      counterOffer = askingNum;
      riskLevel = 'Legal Due Diligence Caution Required';
    } else if (pctDiff < -10) {
      verdictType = 'low';
      badgeTheme = {
        bg: 'bg-blue-50',
        border: 'border-blue-300',
        text: 'text-blue-950',
        badge: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: Sparkles,
        iconColor: 'text-blue-600',
      };
      verdictTitle = 'High-Value Deal / Attractive Bargain (-10% to -30%)';
      verdictSubtitle = `Offers an immediate savings of ₹${Math.abs(diffLakhs).toFixed(2)} Lakh (${Math.abs(pctDiff).toFixed(1)}% savings).`;
      negotiationAdvice =
        'Favorable market entry opportunity below prevailing average prices. Complete standard legal document verification and lock in booking terms promptly.';
      counterOffer = Number((askingNum * 0.98).toFixed(2));
      riskLevel = 'Favorable Buyer Opportunity';
    }
  }

  const handleApplyPreset = (multiplier) => {
    const calculated = (estNum * multiplier).toFixed(1);
    setAskingPrice(calculated);
    setAnalyzed(true);
  };

  const VerdictIcon = badgeTheme.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-navy-50 text-navy-800 border border-navy-100 shadow-2xs">
            <Tag className="w-5 h-5 text-saffron-dark" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-navy-900">
                Seller's Asking-Price Checker • विक्रेता मूल्य सत्यापन
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-navy-100 text-navy-800 border border-navy-200">
                M6 Feature
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Audit seller quotations against the certified econometric model benchmark
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Certified Benchmark
          </span>
          <span className="text-sm font-extrabold text-navy-900 font-mono">
            ₹{estNum.toFixed(2)} Lakh
          </span>
        </div>
      </div>

      {/* Input Section & Scenario Preset Pills */}
      <div className="space-y-3 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-8 space-y-1">
            <label
              htmlFor="asking-price-input"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Enter Quoted Asking Price (₹ in Lakhs) <span className="text-govred">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-sm">
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
                className="w-full pl-8 pr-16 py-2.5 text-sm font-bold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-transparent transition shadow-inner"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 font-bold text-xs">
                Lakh
              </span>
            </div>
          </div>

          <div className="sm:col-span-4">
            <button
              type="button"
              onClick={() => setAnalyzed(true)}
              disabled={!isValid}
              className="w-full py-2.5 px-4 bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5 text-saffron" />
              <span>Verify Quoted Price</span>
            </button>
          </div>
        </div>

        {/* Quick 1-Click Scenario Preset Pills */}
        <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Test Scenarios:</span>
          </span>
          <button
            type="button"
            onClick={() => handleApplyPreset(0.8)}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs transition"
          >
            📉 -20% Bargain (₹{(estNum * 0.8).toFixed(1)}L)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset(1.0)}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs transition"
          >
            ⚖️ At Benchmark (₹{estNum.toFixed(1)}L)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset(1.15)}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs transition"
          >
            📈 +15% Markup (₹{(estNum * 1.15).toFixed(1)}L)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset(1.35)}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white hover:bg-red-50 text-red-700 border border-red-200 shadow-2xs transition"
          >
            ⚠️ +35% Premium (₹{(estNum * 1.35).toFixed(1)}L)
          </button>
        </div>
      </div>

      {/* Analysis Output Results */}
      {analyzed && isValid && (
        <div className="space-y-4 pt-1 animate-fadeIn">
          {/* 3 Comparison KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Seller Quoted Price
              </span>
              <span className="text-base sm:text-lg font-extrabold text-navy-900 font-mono">
                ₹{askingNum.toFixed(2)} Lakh
              </span>
              <span className="text-[11px] text-slate-500 block">
                Quoted by property owner
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Model Fair Benchmark
              </span>
              <span className="text-base sm:text-lg font-extrabold text-navy-900 font-mono">
                ₹{estNum.toFixed(2)} Lakh
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold block">
                AI Econometric Fair Value
              </span>
            </div>

            <div
              className={`p-3 rounded-lg border ${
                diffLakhs > 0
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : diffLakhs < 0
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                Valuation Gap / Delta
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-extrabold font-mono">
                  {diffLakhs > 0 ? '+' : diffLakhs < 0 ? '-' : ''}₹
                  {Math.abs(diffLakhs).toFixed(2)} Lakh
                </span>
                <span className="text-xs font-bold font-mono">
                  ({pctDiff > 0 ? '+' : ''}
                  {pctDiff.toFixed(1)}%)
                </span>
              </div>
              <span className="text-[11px] font-semibold block">
                {diffLakhs > 0
                  ? 'Seller Markup'
                  : diffLakhs < 0
                  ? 'Buyer Discount'
                  : 'Exact Fair Match'}
              </span>
            </div>
          </div>

          {/* Upgraded Visual Gauge Meter */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {/* Zone Labels */}
            <div className="grid grid-cols-4 text-center text-[10px] sm:text-xs font-bold">
              <span className="text-blue-700">Deep Discount (&lt;-15%)</span>
              <span className="text-emerald-700">Fair Value (±10%)</span>
              <span className="text-amber-700">Moderate (+10%–30%)</span>
              <span className="text-govred">Severe Overprice (&gt;+30%)</span>
            </div>

            {/* Segmented Multi-Zone Color Track */}
            <div className="relative h-6 rounded-lg overflow-visible bg-slate-200 shadow-inner p-0.5">
              {/* Color Track Gradient */}
              <div className="w-full h-full rounded-md overflow-hidden flex">
                <div className="w-1/4 h-full bg-gradient-to-r from-blue-500 to-sky-400" title="Deep Discount" />
                <div className="w-1/4 h-full bg-gradient-to-r from-emerald-400 to-emerald-500" title="Fair Value" />
                <div className="w-1/4 h-full bg-gradient-to-r from-amber-400 to-amber-500" title="Moderate Overprice" />
                <div className="w-1/4 h-full bg-gradient-to-r from-rose-500 to-red-600" title="Severe Overprice" />
              </div>

              {/* Benchmark Center Axis (0% mark) */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-slate-900/80 z-10 shadow-sm"
                style={{ left: '50%' }}
                title="Model Benchmark (0% delta)"
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
              </div>

              {/* Dynamic Needle Indicator with Live Tooltip */}
              <div
                className="absolute -top-3 bottom-0 w-4 -ml-2 z-20 transition-all duration-500 pointer-events-none flex flex-col items-center"
                style={{ left: `${gaugePercent}%` }}
              >
                {/* Needle Badge Tooltip */}
                <div className="bg-slate-950 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap mb-0.5 border border-white/40">
                  {pctDiff > 0 ? '+' : ''}
                  {pctDiff.toFixed(1)}%
                </div>
                {/* Needle Pin Marker */}
                <div className="w-2.5 h-6 bg-slate-950 border-2 border-white rounded-full shadow-md" />
              </div>
            </div>

            {/* Scale Ticks */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono font-semibold pt-1 px-1">
              <span>-50%</span>
              <span>-25%</span>
              <span className="font-bold text-navy-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                0% Benchmark (₹{estNum.toFixed(2)}L)
              </span>
              <span>+25%</span>
              <span>+50%</span>
            </div>
          </div>

          {/* Detailed Intelligence Verdict & Negotiation Advice Box */}
          <div className={`p-4 rounded-xl border ${badgeTheme.border} ${badgeTheme.bg} space-y-3`}>
            {/* Verdict Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 pb-2.5">
              <div className="flex items-center gap-2">
                <VerdictIcon className={`w-5 h-5 ${badgeTheme.iconColor} shrink-0`} />
                <div>
                  <h4 className={`text-xs sm:text-sm font-black ${badgeTheme.text}`}>
                    {verdictTitle}
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    {verdictSubtitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeTheme.badge}`}>
                  {riskLevel}
                </span>
              </div>
            </div>

            {/* Strategy & Recommended Counter-Offer */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-8 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Recommended Negotiation Strategy
                </span>
                <p className={`text-xs leading-relaxed font-medium ${badgeTheme.text}`}>
                  {negotiationAdvice}
                </p>
              </div>

              <div className="md:col-span-4 bg-white/80 p-3 rounded-lg border border-slate-200/80 text-right space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Suggested Counter-Offer
                </span>
                <span className="text-base font-black text-navy-900 font-mono block">
                  ₹{counterOffer.toFixed(2)} Lakh
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Target deal closing price
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
