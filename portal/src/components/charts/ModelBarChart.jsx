import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { INDIAN_MODEL_BENCHMARKS } from '../../data/indianData';

export function ModelBarChart({
  benchmarks = INDIAN_MODEL_BENCHMARKS,
  height = 380,
}) {
  const [metric, setMetric] = useState('r2'); // "r2" | "rmseLakhs" | "maeLakhs" | "cvScore" | "trainTimeNum"

  // Augment benchmarks with numeric training time for charting
  const augmentedData = useMemo(() => {
    return benchmarks.map((b) => ({
      ...b,
      trainTimeNum: parseFloat(b.trainTime.replace('s', '')) || 0.01,
      r2Pct: b.r2 * 100,
      cvPct: b.cvScore * 100,
    }));
  }, [benchmarks]);

  const metricConfig = {
    r2: {
      dataKey: 'r2',
      label: 'R² Coefficient of Determination',
      short: 'R² Score',
      description: 'Higher is better. Measures total property price variance explained by the model.',
      format: (v) => `${(Number(v) * 100).toFixed(2)}%`,
      axisFormat: (v) => `${(Number(v) * 100).toFixed(0)}%`,
      domain: [0.75, 1.0],
      isHigherBetter: true,
    },
    rmseLakhs: {
      dataKey: 'rmseLakhs',
      label: 'Root Mean Squared Error (RMSE in ₹ Lakhs)',
      short: 'RMSE (₹ Lakhs)',
      description: 'Lower is better. Penalizes larger residual prediction variances on test data.',
      format: (v) => `₹${Number(v).toFixed(2)} L`,
      axisFormat: (v) => `₹${v}L`,
      domain: [0, 25],
      isHigherBetter: false,
    },
    maeLakhs: {
      dataKey: 'maeLakhs',
      label: 'Mean Absolute Error (MAE in ₹ Lakhs)',
      short: 'MAE (₹ Lakhs)',
      description: 'Lower is better. Average absolute prediction variance on holdout Indian properties.',
      format: (v) => `₹${Number(v).toFixed(2)} L`,
      axisFormat: (v) => `₹${v}L`,
      domain: [0, 16],
      isHigherBetter: false,
    },
    cvScore: {
      dataKey: 'cvScore',
      label: '5-Fold Cross-Validation Score',
      short: '5-Fold CV Score',
      description: 'Higher is better. Cross-validation consistency across 5 stratified folds.',
      format: (v) => `${(Number(v) * 100).toFixed(2)}%`,
      axisFormat: (v) => `${(Number(v) * 100).toFixed(0)}%`,
      domain: [0.8, 1.0],
      isHigherBetter: true,
    },
  };

  const currentCfg = metricConfig[metric] || metricConfig.r2;

  const sortedData = useMemo(() => {
    const list = [...augmentedData];
    if (currentCfg.isHigherBetter) {
      return list.sort((a, b) => b[currentCfg.dataKey] - a[currentCfg.dataKey]);
    }
    return list.sort((a, b) => a[currentCfg.dataKey] - b[currentCfg.dataKey]);
  }, [augmentedData, currentCfg]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-navy-950 text-white p-3.5 rounded-lg shadow-xl text-xs border border-navy-800 z-50">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-bold text-saffron text-sm">{item.model}</span>
            {item.isChampion && (
              <span className="bg-indiagreen text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                CHAMPION
              </span>
            )}
          </div>
          <div className="space-y-1.5 text-slate-200">
            <div>
              <span className="text-slate-400">Model Category:</span>{' '}
              <span className="font-medium text-white">{item.tier}</span>
            </div>
            <div>
              <span className="text-slate-400">{currentCfg.short}:</span>{' '}
              <span className="font-mono font-bold text-saffron">
                {currentCfg.format(item[currentCfg.dataKey])}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-navy-800 text-[11px]">
              <div>
                <span className="text-slate-400">R² Score:</span>{' '}
                <span className="font-mono text-emerald-400">{(item.r2 * 100).toFixed(2)}%</span>
              </div>
              <div>
                <span className="text-slate-400">RMSE:</span>{' '}
                <span className="font-mono text-amber-300">₹{item.rmseLakhs.toFixed(2)} L</span>
              </div>
              <div>
                <span className="text-slate-400">MAE:</span>{' '}
                <span className="font-mono text-slate-200">₹{item.maeLakhs.toFixed(2)} L</span>
              </div>
              <div>
                <span className="text-slate-400">Train Time:</span>{' '}
                <span className="font-mono text-cyan-300">{item.trainTime}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-3">
      {/* Metric Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">
            Evaluation Metric:
          </span>
          <p className="text-xs text-slate-600 mt-0.5">{currentCfg.description}</p>
        </div>

        <div className="inline-flex flex-wrap rounded border border-slate-300 bg-slate-100 p-0.5 gap-0.5">
          <button
            type="button"
            onClick={() => setMetric('r2')}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors rounded ${
              metric === 'r2'
                ? 'bg-navy-700 text-white shadow-sm'
                : 'text-slate-700 hover:text-navy-900 hover:bg-slate-200'
            }`}
          >
            R² Score
          </button>
          <button
            type="button"
            onClick={() => setMetric('rmseLakhs')}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors rounded ${
              metric === 'rmseLakhs'
                ? 'bg-navy-700 text-white shadow-sm'
                : 'text-slate-700 hover:text-navy-900 hover:bg-slate-200'
            }`}
          >
            RMSE (₹ Lakhs)
          </button>
          <button
            type="button"
            onClick={() => setMetric('maeLakhs')}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors rounded ${
              metric === 'maeLakhs'
                ? 'bg-navy-700 text-white shadow-sm'
                : 'text-slate-700 hover:text-navy-900 hover:bg-slate-200'
            }`}
          >
            MAE (₹ Lakhs)
          </button>
          <button
            type="button"
            onClick={() => setMetric('cvScore')}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors rounded ${
              metric === 'cvScore'
                ? 'bg-navy-700 text-white shadow-sm'
                : 'text-slate-700 hover:text-navy-900 hover:bg-slate-200'
            }`}
          >
            5-Fold CV Score
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full relative" style={{ height: `${height}px`, minHeight: '320px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart
            layout="vertical"
            data={sortedData}
            margin={{ top: 10, right: 60, bottom: 10, left: 160 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis
              type="number"
              domain={currentCfg.domain}
              tickFormatter={currentCfg.axisFormat}
              stroke="#64748b"
              fontSize={11}
            />
            <YAxis
              type="category"
              dataKey="model"
              stroke="#64748b"
              fontSize={11}
              tick={{ fill: '#1e293b', fontWeight: 600 }}
              width={150}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={currentCfg.dataKey} radius={[0, 4, 4, 0]}>
              <LabelList
                dataKey={currentCfg.dataKey}
                position="right"
                fill="#334155"
                fontSize={11}
                fontWeight={700}
                formatter={currentCfg.format}
              />
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.model}-${index}`}
                  fill={entry.isChampion ? '#138808' : index % 2 === 0 ? '#0b3d91' : '#1e40af'}
                  stroke={entry.isChampion ? '#0e5f05' : '#072b6b'}
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Guide */}
      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-indiagreen inline-block"></span>
            <strong className="text-slate-700">Green:</strong> Designated Champion Model (GBR)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-navy-700 inline-block"></span>
            <strong className="text-slate-700">Navy:</strong> Evaluated Alternative Architectures
          </span>
        </div>
        <span className="font-mono text-slate-400">Evaluation Dataset: 13,320 Cleaned Records</span>
      </div>
    </div>
  );
}

export default ModelBarChart;
