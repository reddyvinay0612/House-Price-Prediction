import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { HelpCircle, Sparkles, Sliders, Info, CheckCircle2 } from 'lucide-react';

/**
 * M2: Explainable 'Why this price?' Component
 * Horizontal bar chart of top 8 feature contributions (positive in green, negative in red),
 * plain-language explanatory summary, and Simple vs Expert View toggle.
 */
export default function WhyThisPrice({ featureContributions = [], plainExplanation = '', predictedPriceLakhs = 75 }) {
  const [viewMode, setViewMode] = useState('simple'); // 'simple' | 'expert'

  if (!featureContributions || featureContributions.length === 0) {
    return null;
  }

  // Format data for Recharts horizontal bar chart
  const chartData = featureContributions.slice(0, 8).map((item) => ({
    name: item.feature,
    impact: item.impact_lakhs,
    rawValue: item.raw_value,
    pct: item.pct,
    type: item.type,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPos = data.impact >= 0;
      return (
        <div className="bg-navy-950 text-white p-3 rounded shadow-xl border border-white/20 text-xs max-w-xs space-y-1">
          <p className="font-bold text-saffron">{data.name}</p>
          <p className="text-slate-300">
            Citizen Value: <span className="text-white font-semibold">{data.rawValue}</span>
          </p>
          <p className="text-slate-300">
            Attribution Impact:{' '}
            <span className={`font-bold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPos ? '+' : ''}₹{data.impact.toFixed(2)} Lakh ({data.pct}%)
            </span>
          </p>
          <p className="text-[10px] text-slate-400 italic">
            Calculated via Gradient Boosting Tree SHAP Decomposition
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-navy-50 text-navy-800">
            <Sparkles className="w-4 h-4 text-saffron-dark" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-navy-900 flex items-center gap-1.5">
              <span>Why This Price? • मूल्य निर्धारण व्याख्या</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">
                SHAP Explainer
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Econometric attribution of key property drivers influencing valuation
            </p>
          </div>
        </div>

        {/* Simple vs Expert View Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('simple')}
            className={`px-3 py-1 rounded transition ${
              viewMode === 'simple'
                ? 'bg-navy-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Simple View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('expert')}
            className={`px-3 py-1 rounded transition ${
              viewMode === 'expert'
                ? 'bg-navy-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Expert View (Raw SHAP)
          </button>
        </div>
      </div>

      {/* Plain Language Summary Box */}
      <div className="bg-navy-50/70 border-l-4 border-navy-700 p-3 rounded-r text-xs text-navy-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-navy-700 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold leading-relaxed">
            {plainExplanation ||
              'Built-up area and prime locality benchmark generated the highest valuation premium.'}
          </p>
          <p className="text-[11px] text-navy-700/80 mt-0.5">
            Green bars indicate value drivers adding price premiums; red bars indicate negative
            moderations compared to regional averages.
          </p>
        </div>
      </div>

      {/* Recharts Horizontal Bar Chart */}
      <div className="pt-2">
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <XAxis
                type="number"
                tickFormatter={(v) => `₹${v}L`}
                stroke="#64748b"
                fontSize={11}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={130}
                stroke="#334155"
                fontSize={11}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={0} stroke="#94a3b8" strokeDasharray="3 3" />
              <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.impact >= 0 ? '#10b981' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expert View: Tabular Breakdown */}
      {viewMode === 'expert' && (
        <div className="mt-4 pt-4 border-t border-slate-200 overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-100 text-slate-800 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-2 px-3">Feature Dimension</th>
                <th className="py-2 px-3">Citizen Input</th>
                <th className="py-2 px-3 text-right">SHAP Impact (₹ Lakh)</th>
                <th className="py-2 px-3 text-right">Contribution %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {featureContributions.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-sans font-semibold text-navy-900">{item.feature}</td>
                  <td className="py-2 px-3 text-slate-600 font-sans">{item.raw_value}</td>
                  <td
                    className={`py-2 px-3 text-right font-bold ${
                      item.impact_lakhs >= 0 ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {item.impact_lakhs >= 0 ? '+' : ''}
                    {item.impact_lakhs.toFixed(2)} L
                  </td>
                  <td className="py-2 px-3 text-right text-slate-700">{item.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stat Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Cross-validated with 5-Fold Gradient Boosting Engine
        </span>
        <span className="italic">Indicative Attribution</span>
      </div>
    </div>
  );
}
