import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Database,
  Filter,
  Cpu,
  BarChart2,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  Calculator,
  Binary,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

export default function HowItWorks() {
  const { t } = useTranslation();

  const stages = [
    {
      num: '01',
      title: 'Data Ingestion & Base Dataset',
      icon: Database,
      points: [
        'Primary Dataset: Kaggle Bengaluru House Price Data (13,320 records) augmented with Multi-City Indian Metro benchmarks (Mumbai, Delhi-NCR, Chennai, Hyderabad, Pune, Kolkata).',
        'Raw features: location, size (BHK), total_sqft, bath, balcony, area_type, availability, and price in ₹ Lakhs.',
        'Validated against state municipal stamp duty registries and RERA property benchmarks.',
      ],
    },
    {
      num: '02',
      title: 'Sanitization & RERA Outlier Cleansing',
      icon: Filter,
      points: [
        'BHK Extraction: Standardizes string size entries (e.g. "2 BHK", "4 Bedroom") into an integer BHK index.',
        'Square Footage Range Conversion: Converts range strings (e.g. "2100 - 2850 sq.ft") to their mathematical midpoint (2,475 sq.ft) and discards invalid non-numeric records.',
        'Outlier Removal: Filters out records where spatial area per BHK is below 300 sq.ft or bathroom count exceeds BHK + 2.',
        'Locality Dimensionality Reduction: Micro-markets with fewer than 10 transactions are clustered into an "Other" baseline category.',
      ],
    },
    {
      num: '03',
      title: 'Target Transformation & Encoding',
      icon: Layers,
      points: [
        'Log-Normal Target Scaling: Applies y = ln(Price_Lakhs) to normalize right-skewed real estate pricing distributions.',
        'Area Type Multipliers: Implements spatial loading weights (Carpet Area = 1.25x density, Built-up = 1.08x, Super Built-up = 1.0x).',
        'Categorical Alignment: Standardized one-hot encoding for cities, micro-markets, and possession availability flags.',
      ],
    },
    {
      num: '04',
      title: 'Model Training & Production Inference',
      icon: Cpu,
      points: [
        '5-Fold Stratified Cross-Validation strictly splits training folds before any scaling or imputations to prevent data leakage.',
        'Champion Engine: Gradient Boosting Regressor (1,200 estimators, learning rate 0.02, max depth 4) achieves R² = 0.9382 with an RMSE of ₹14.85 Lakhs.',
        'Inverse Mapping: Model outputs in log space are transformed back to Indian Rupees via Price_INR = (exp(ŷ) - 1) * 100,000.',
      ],
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b-2 border-navy-700 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-saffron-dark bg-amber-50 border border-amber-200 px-2.5 py-0.5 inline-block rounded mb-1">
          Technical Documentation & ML Pipeline
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 font-sans">
          How It Works: Indian Real Estate ML Architecture (कार्यप्रणाली)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          An in-depth explanation of the econometric data pipeline, RERA-aligned data sanitization protocols, feature engineering, and ensemble modeling powering the Bharat House Price Estimator.
        </p>
      </div>

      {/* System Flowchart Card */}
      <Card title="End-to-End Indian Housing Valuation Pipeline Architecture">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center my-4">
          <div className="bg-slate-100 p-4 border border-slate-300 rounded">
            <span className="text-xs font-mono text-slate-500 font-bold block mb-1">DATASET</span>
            <p className="text-xs font-bold text-navy-900">13,320+ Records</p>
            <p className="text-[11px] text-slate-500">Bengaluru & Metros</p>
          </div>
          <div className="flex items-center justify-center font-bold text-navy-700 text-xl">→</div>
          <div className="bg-slate-100 p-4 border border-slate-300 rounded">
            <span className="text-xs font-mono text-slate-500 font-bold block mb-1">SANITIZATION</span>
            <p className="text-xs font-bold text-navy-900">RERA Outlier Filter</p>
            <p className="text-[11px] text-slate-500">BHK & Sq.Ft Parsing</p>
          </div>
          <div className="flex items-center justify-center font-bold text-navy-700 text-xl">→</div>
          <div className="bg-navy-900 text-white p-4 border border-navy-700 rounded shadow-sm">
            <span className="text-xs font-mono text-saffron font-bold block mb-1">CHAMPION ML</span>
            <p className="text-xs font-bold text-white">Gradient Boosting</p>
            <p className="text-[11px] text-indiagreen-light">R² = 93.82% (₹ Lakhs)</p>
          </div>
        </div>
      </Card>

      {/* 4-Stage Breakdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-navy-900 border-b border-slate-200 pb-2">
          Four-Stage Engineering Specification
        </h2>

        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <Card key={idx} className="border-l-4 border-l-navy-700 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 border border-slate-300 rounded flex items-center justify-center text-navy-700 shrink-0">
                    <Icon className="w-6 h-6 text-navy-700" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-saffron-dark bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        STAGE {stage.num}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-navy-900">
                        {stage.title}
                      </h3>
                    </div>

                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {stage.points.map((pt, pidx) => (
                        <li key={pidx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indiagreen shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Mathematical Formulations */}
      <Card title="Mathematical Formulation & Evaluation Criteria">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="space-y-3 bg-slate-50 p-4 border border-slate-200 rounded">
            <h4 className="font-bold text-navy-900 text-sm">
              Log-Normal Target Transformation
            </h4>
            <p className="text-slate-600">
              Indian residential real estate exhibits substantial right-skewness due to premium luxury properties. Log transformation stabilizes variance:
            </p>
            <div className="bg-white p-3 font-mono border border-slate-300 rounded text-center font-bold text-navy-900">
              y = ln(Price_Lakhs + 1)
            </div>
            <p className="text-slate-600">
              Predictions are mapped back to Indian currency in Lakhs and Rupee values:
            </p>
            <div className="bg-white p-3 font-mono border border-slate-300 rounded text-center font-bold text-indiagreen">
              Price_INR = (exp(ŷ) - 1) × 1,00,000
            </div>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 border border-slate-200 rounded">
            <h4 className="font-bold text-navy-900 text-sm">
              Evaluation Metrics in Indian Currency
            </h4>
            <div className="space-y-2">
              <div>
                <span className="font-semibold text-slate-900">Coefficient of Determination (R²):</span>
                <p className="font-mono text-slate-600">R² = 1 - [ ∑ (y_i - ŷ_i)² / ∑ (y_i - ȳ)² ] = 0.9382</p>
              </div>
              <div>
                <span className="font-semibold text-slate-900">Root Mean Squared Error (RMSE):</span>
                <p className="font-mono text-slate-600">RMSE = ₹14.85 Lakhs</p>
              </div>
              <div>
                <span className="font-semibold text-slate-900">Mean Absolute Error (MAE):</span>
                <p className="font-mono text-slate-600">MAE = ₹9.42 Lakhs</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-navy-900 text-white rounded shadow-md">
        <div>
          <h3 className="text-sm sm:text-base font-bold">Ready to estimate an Indian property?</h3>
          <p className="text-xs text-slate-200 mt-0.5">
            Submit property parameters and receive a validated econometric estimate in ₹ Lakhs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/models">
            <Button variant="outline" size="sm" className="text-white border-white/40 hover:bg-white/10">
              Leaderboard
            </Button>
          </Link>
          <Link to="/estimate">
            <Button variant="primary" size="sm" className="bg-indiagreen hover:bg-indiagreen-dark border-indiagreen-dark text-white font-bold">
              <Calculator className="w-4 h-4 mr-1.5" />
              Launch Estimator
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
