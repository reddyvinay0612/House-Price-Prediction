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
import { INDIAN_PRICE_HISTOGRAM } from '../../data/indianData';

export function HistogramChart({
  data = INDIAN_PRICE_HISTOGRAM,
  height = 340,
  activeBracket = null,
}) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-navy-950 text-white p-2.5 rounded shadow-lg text-xs border border-navy-800">
          <p className="font-bold text-saffron text-sm mb-1">{item.range}</p>
          <div className="space-y-1 text-slate-200">
            <div>
              <span className="text-slate-400">Transactions:</span>{' '}
              <span className="font-mono font-bold text-white">{item.count.toLocaleString('en-IN')} units</span>
            </div>
            <div>
              <span className="text-slate-400">Market Share:</span>{' '}
              <span className="font-semibold text-indiagreen-light">{item.pct} of transactions</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs text-slate-600">
        <span>Distribution of 13,320+ Registered Indian Housing Transactions</span>
        <span className="font-mono text-slate-400">Brackets: ₹ Lakhs / Crores</span>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 25, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="range"
              stroke="#64748b"
              fontSize={11}
              angle={-15}
              textAnchor="end"
              height={40}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              label={{
                value: 'Number of Properties',
                angle: -90,
                position: 'insideLeft',
                offset: 5,
                fontSize: 11,
                fill: '#475569',
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[3, 3, 0, 0]}>
              <LabelList
                dataKey="pct"
                position="top"
                fill="#475569"
                fontSize={10}
              />
              {data.map((entry, index) => {
                const isMatch = activeBracket && entry.range === activeBracket;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isMatch ? '#ff9933' : '#0b3d91'}
                    stroke={isMatch ? '#b45309' : '#072b6b'}
                    strokeWidth={isMatch ? 2 : 1}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default HistogramChart;
