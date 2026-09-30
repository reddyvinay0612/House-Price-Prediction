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
import { CITY_TRENDS_COMPARISON } from '../../data/indianData';
import { formatPricePerSqft, formatIndianPrice } from '../../utils/formatters';

export function CityTrendsChart({ data = CITY_TRENDS_COMPARISON, height = 360 }) {
  const sortedData = [...data].sort((a, b) => b.avgRateSqft - a.avgRateSqft);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-navy-950 text-white p-3 rounded shadow-lg text-xs border border-navy-800">
          <div className="font-bold text-saffron text-sm">{item.city}</div>
          <div className="mt-1 space-y-1 text-slate-200">
            <div>
              <span className="text-slate-400">Average Rate:</span>{' '}
              <span className="font-mono font-bold text-white">{formatPricePerSqft(item.avgRateSqft)}</span>
            </div>
            <div>
              <span className="text-slate-400">Typical 2BHK:</span>{' '}
              <span className="font-mono font-bold text-indiagreen-light">{formatIndianPrice(item.avg2BhkLakhs)}</span>
            </div>
            <div>
              <span className="text-slate-400">Annual Growth:</span>{' '}
              <span className="font-semibold text-saffron">+{item.yoyGrowth}% YoY</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs text-slate-600">
        <span>Average Residential Price per Sq.Ft Across Indian Metro Markets</span>
        <span className="font-mono text-slate-400">Unit: ₹ / sq.ft</span>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart
            data={sortedData}
            margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="city"
              stroke="#64748b"
              fontSize={11}
              fontWeight={600}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              label={{
                value: 'Average Rate (₹ / sq.ft)',
                angle: -90,
                position: 'insideLeft',
                offset: 0,
                fontSize: 11,
                fill: '#475569',
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgRateSqft" radius={[3, 3, 0, 0]}>
              <LabelList
                dataKey="avgRateSqft"
                position="top"
                fill="#1e293b"
                fontSize={10}
                formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`}
              />
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.city === 'Bengaluru' ? '#0b3d91' : entry.city === 'Mumbai' ? '#d97706' : '#138808'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 mt-2">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-navy-700 inline-block rounded-sm" />
          Primary Base Dataset (Bengaluru)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-gold-dark inline-block rounded-sm" />
          Ultra-High Density Metro (Mumbai)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-indiagreen inline-block rounded-sm" />
          Regional Growth Metros
        </span>
      </div>
    </div>
  );
}

export default CityTrendsChart;
