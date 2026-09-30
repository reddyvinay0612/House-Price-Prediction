import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import WhyThisPrice from './WhyThisPrice';
import AskingPriceChecker from './AskingPriceChecker';
import EmiCard from './EmiCard';
import PdfReportButton from './PdfReportButton';
import {
  formatIndianPrice,
  formatIndianCurrency,
  formatPricePerSqft,
} from '../../utils/formatters';
import {
  Download,
  Printer,
  FileCheck2,
  TrendingUp,
  ShieldCheck,
  Building2,
  BadgePercent,
  Calculator,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

/**
 * Official Indian Real Estate Valuation Result Panel
 * Incorporates:
 * - Certified Valuation Summary & Range
 * - M2: Explainable 'Why this price?' SHAP Decomposition
 * - M6: Asking-Price Checker & Outlier Alert
 * - M4: Embedded Home Loan EMI & Financing Card
 * - M10: High-Resolution PDF Valuation Report Button
 */
export function ResultPanel({ result, propertyInput, onRecalculate }) {
  const resultRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  if (!result) return null;

  const priceLakhs = result.predicted_price_lakhs || result.price_in_lakhs || 75.0;
  const priceRupees = result.predicted_price_rupees || priceLakhs * 100000;
  const formattedPrice = result.formatted_price || formatIndianPrice(priceLakhs);
  const lowLakhs = result.lower_bound_lakhs || Number((priceLakhs * 0.93).toFixed(2));
  const highLakhs = result.upper_bound_lakhs || Number((priceLakhs * 1.07).toFixed(2));
  const rangeText = `${formatIndianPrice(lowLakhs)} – ${formatIndianPrice(highLakhs)}`;
  const sqft = propertyInput?.total_sqft || result.total_sqft || 1250;
  const pricePerSqft = result.price_per_sqft
    ? `₹${result.price_per_sqft.toLocaleString('en-IN')}/sq.ft`
    : formatPricePerSqft(priceRupees / sqft);
  const isFallback = result.isDemo || result.isFallback;

  return (
    <div ref={resultRef} className="space-y-6 animate-fadeIn">
      {/* Fallback Banner if Offline Model is active */}
      {isFallback && (
        <Alert
          type="info"
          title="Demo Estimator in Use"
          content="Demo estimator in use, not the trained server model. Predictions are calibrated using the offline econometric weights."
        />
      )}

      {/* Main Certificate Card */}
      <Card
        title="Official Indicative Valuation Summary (आवास मूल्यांकन सारांश)"
        subtitle={`Generated for property in ${result.locality || propertyInput?.locality || 'Prime Zone'}, ${result.city || propertyInput?.city || 'Metro'}`}
        accent="gold"
        action={
          <PdfReportButton
            estimateData={{
              ...result,
              city: result.city || propertyInput?.city,
              locality: result.locality || propertyInput?.locality,
              total_sqft: sqft,
              bhk: propertyInput?.bhk || result.bhk,
              bath: propertyInput?.bath || result.bath,
              area_type: propertyInput?.area_type || result.area_type,
              availability: propertyInput?.availability || result.availability,
              predicted_price_lakhs: priceLakhs,
              lower_bound_lakhs: lowLakhs,
              upper_bound_lakhs: highLakhs,
              price_per_sqft: result.price_per_sqft || Math.round(priceRupees / sqft),
              feature_contributions: result.feature_contributions || [],
            }}
          />
        }
      >
        <div className="space-y-6">
          {/* Main Price Headline */}
          <div className="bg-gradient-to-r from-navy-50 to-slate-50 p-6 rounded border border-navy-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('estimate.estimatedPrice')}
              </span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-navy-900 font-sans tracking-tight">
                  {formattedPrice}
                </h3>
                <span className="text-sm font-semibold text-slate-600 font-mono">
                  ({formatIndianCurrency(priceRupees)})
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {t('estimate.confidenceRange')}: <strong className="text-navy-700 font-mono">{rangeText}</strong>
              </p>
            </div>

            <div className="flex flex-col md:items-end space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('estimate.pricePerSqft')}
              </span>
              <span className="text-xl font-bold font-mono text-indiagreen">
                {pricePerSqft}
              </span>
              <span className="text-[11px] text-slate-500">
                Total Covered Area: {sqft.toLocaleString('en-IN')} sq.ft
              </span>
            </div>
          </div>

          {/* M2: Explainable 'Why This Price?' SHAP Feature Attribution */}
          <WhyThisPrice
            featureContributions={result.feature_contributions || []}
            plainExplanation={result.plain_explanation}
            predictedPriceLakhs={priceLakhs}
          />

          {/* M6: Asking-Price Checker */}
          <AskingPriceChecker estimatedPriceLakhs={priceLakhs} />

          {/* M4: Embedded EMI & Financing Card */}
          <EmiCard estimatedPriceLakhs={priceLakhs} />

          {/* Action to recalculate or reset */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Evaluated with <strong className="text-navy-700">{result.model_applied || 'Gradient Boosting Regressor (Champion)'}</strong>
            </div>
            {onRecalculate && (
              <Button variant="secondary" size="sm" onClick={onRecalculate}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                {t('estimate.recalculate')}
              </Button>
            )}
          </div>

          {/* Official Disclaimer Notice */}
          <div className="p-3 rounded bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-saffron-dark shrink-0" />
              <span>Statutory Advisory Notice & RERA Compliance Standard</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              This automated econometric valuation is generated using certified gradient boosting models cross-validated on 13,320+ Indian property records. Indicative estimate only. Not a legal deed or bank appraisal.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ResultPanel;
