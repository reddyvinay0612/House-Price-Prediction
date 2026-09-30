import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

/**
 * Top Correlated Features Bar Chart
 */
export function CorrelationChart({ data, correlations = [] }) {
  const chartData = data || correlations;
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded shadow text-xs border border-slate-700">
          <div className="font-bold text-slate-100">{item.feature}</div>
          <div className="mt-1 text-sky-400">
            Pearson Correlation: <b>{item.correlation.toFixed(3)}</b>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
        >
          <XAxis
            type="number"
            domain={[0, 1.0]}
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <YAxis
            type="category"
            dataKey="feature"
            tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 600 }}
            width={160}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="correlation" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? '#f59e0b' : '#0b3d91'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CorrelationChart;
