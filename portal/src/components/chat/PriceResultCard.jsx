import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, ExternalLink, ShieldCheck, TrendingUp, Calculator } from 'lucide-react';
import { formatIndianPrice } from '../../utils/formatters';

export function PriceResultCard({ data, onAction }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!data) return null;

  const priceLakhs = data.predicted_price_lakhs || data.price_in_lakhs || 0;
  const formattedPrice = data.formatted_price || formatIndianPrice(priceLakhs);
  const city = data.city || 'Key Metro';
  const locality = data.locality || 'Prime Locality';
  const sqft = data.total_sqft || 1200;
  const bhk = data.bhk || 2;
  const pricePerSqft = data.price_per_sqft || Math.round((priceLakhs * 100000) / sqft);

  const handleOpenReport = () => {
    if (onAction) onAction();
    navigate('/estimate', {
      state: {
        prefill: {
          city,
          locality,
          total_sqft: sqft,
          bhk,
        },
      },
    });
  };

  return (
    <div className="mt-2.5 bg-gradient-to-br from-slate-50 to-blue-50/40 border border-navy-200 rounded-md p-3.5 shadow-sm space-y-3 font-sans">
      {/* Header with emblem dot & Title */}
      <div className="flex items-center justify-between border-b border-navy-100 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-navy-900">
          <Building2 className="w-3.5 h-3.5 text-saffron" />
          <span>{t('chat.estimateCard.title', 'Indicative Valuation Summary')}</span>
        </div>
        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-saffron/20 text-navy-950 uppercase tracking-wider border border-saffron/30">
          ML Calibrated
        </span>
      </div>

      {/* Property Meta */}
      <div className="text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-1">
        <span className="font-semibold text-slate-800">
          {bhk} BHK • {sqft.toLocaleString('en-IN')} sq. ft.
        </span>
        <span className="text-slate-500">{city}</span>
      </div>

      {/* Highlight Valuation */}
      <div className="bg-white p-2.5 rounded border border-slate-200 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">
            Estimated Price:
          </span>
          <span className="text-lg font-black text-navy-900 leading-none">
            {formattedPrice}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 block">Unit Rate:</span>
          <span className="text-xs font-bold text-slate-700 font-mono">
            ₹{pricePerSqft.toLocaleString('en-IN')}/sq.ft.
          </span>
        </div>
      </div>

      {/* Confidence Range */}
      {data.lower_bound_lakhs && data.upper_bound_lakhs && (
        <div className="text-[10px] text-slate-500 flex items-center justify-between bg-slate-100/70 px-2 py-1 rounded">
          <span>90% Confidence Range:</span>
          <span className="font-bold text-navy-800">
            ₹{data.lower_bound_lakhs.toFixed(1)}L – ₹{data.upper_bound_lakhs.toFixed(1)}L
          </span>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[9px] text-slate-500 italic leading-tight">
        {t('chat.estimateCard.indicativeDisclaimer', 'This is an indicative advisory estimate, not a legal appraisal.')}
      </p>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleOpenReport}
        className="w-full py-1.5 px-3 bg-navy-800 hover:bg-navy-900 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
      >
        <Calculator className="w-3.5 h-3.5 text-saffron" />
        <span>{t('chat.estimateCard.viewReport', 'Open in Estimator')}</span>
        <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
      </button>
    </div>
  );
}

export default PriceResultCard;
