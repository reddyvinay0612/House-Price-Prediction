import React from 'react';
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
import { TOP_LOCALITIES_INDIA } from '../../data/indianData';
import { formatPricePerSqft } from '../../utils/formatters';

export function TopLocalitiesChart({ data = TOP_LOCALITIES_INDIA, height = 360 }) {
  const sortedData = [...data].sort((a, b) => a.rate - b.rate);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-navy-950 text-white p-2.5 rounded shadow-lg text-xs border border-navy-800">
          <div className="font-bold text-saffron">{item.locality}</div>
          <div className="mt-1">
            <span className="text-slate-300">City:</span>{' '}
            <span className="font-semibold">{item.city}</span>
          </div>
          <div>
            <span className="text-slate-300">Rate:</span>{' '}
            <span className="font-mono font-bold text-indiagreen-light">{formatPricePerSqft(item.rate)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs text-slate-600">
        <span>Top 10 Prime Micro-Markets in India by ₹/sq.ft</span>
        <span className="font-mono text-slate-400">Registry Benchmarks</span>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart
            layout="vertical"
            data={sortedData}
            margin={{ top: 10, right: 70, bottom: 10, left: 130 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis
              type="number"
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              stroke="#64748b"
              fontSize={11}
            />
            <YAxis
              type="category"
              dataKey="locality"
              stroke="#64748b"
              fontSize={10}
              tick={{ fill: '#1e293b', fontWeight: 600 }}
              width={125}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rate" radius={[0, 2, 2, 0]}>
              <LabelList
                dataKey="rate"
                position="right"
                fill="#475569"
                fontSize={10}
                formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`}
              />
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.rate >= 30000 ? '#b91c1c' : entry.rate >= 15000 ? '#d97706' : '#0b3d91'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TopLocalitiesChart;
