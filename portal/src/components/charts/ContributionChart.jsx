import React from 'react';
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
import { formatIndianCurrency } from '../../utils/formatters';

/**
 * Feature Contribution Bar Chart for Indian Housing Explainability (₹)
 */
export function ContributionChart({ contributions = [] }) {
  if (!contributions || contributions.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
        Contribution breakdown data unavailable
      </div>
    );
  }

  const chartData = contributions.map((c) => ({
    name: c.feature,
    amount: c.positive ? Math.abs(c.amount) : -Math.abs(c.amount),
    description: c.description || '',
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPos = data.amount >= 0;
      return (
        <div className="bg-navy-950 text-white p-2.5 rounded shadow-lg text-xs border border-navy-800 max-w-xs">
          <div className="font-bold text-saffron">{data.name}</div>
          <div className={`mt-1 font-mono font-bold ${isPos ? 'text-indiagreen-light' : 'text-red-400'}`}>
            {isPos ? '+ ' : '- '}{formatIndianCurrency(Math.abs(data.amount))}
          </div>
          {data.description && (
            <div className="text-[11px] text-slate-300 mt-1">{data.description}</div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
        >
          <XAxis
            type="number"
            tickFormatter={(v) => `₹${Math.abs(v / 100000).toFixed(1)}L`}
            tick={{ fontSize: 10, fill: '#64748b' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 600 }}
            width={170}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={0} stroke="#94a3b8" />
          <Bar dataKey="amount" radius={[2, 2, 2, 2]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.amount >= 0 ? '#138808' : '#b91c1c'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ContributionChart;
