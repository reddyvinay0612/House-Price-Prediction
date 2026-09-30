import React from 'react';
import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { INDIAN_SCATTER_SAMPLES } from '../../data/indianData';
import { formatIndianPrice } from '../../utils/formatters';

export function ScatterChart({
  highlightPoint = null,
  data = INDIAN_SCATTER_SAMPLES,
  height = 360,
}) {
  const chartData = React.useMemo(() => {
    return data.map((d) => ({
      ...d,
      isHighlighted: false,
    }));
  }, [data]);

  const combinedData = React.useMemo(() => {
    if (highlightPoint && highlightPoint.sqft && highlightPoint.priceLakhs) {
      return [
        ...chartData,
        {
          sqft: Number(highlightPoint.sqft),
          priceLakhs: Number(highlightPoint.priceLakhs),
          bhk: Number(highlightPoint.bhk || 2),
          isHighlighted: true,
          label: highlightPoint.label || 'Your Property Estimate',
        },
      ];
    }
    return chartData;
  }, [chartData, highlightPoint]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pt = payload[0].payload;
      return (
        <div className="bg-navy-950 text-white p-3 rounded shadow-lg text-xs border border-navy-800">
          <p className="font-bold text-saffron text-sm mb-1">
            {pt.isHighlighted ? '⭐ ' + (pt.label || 'Estimated Property') : 'Registered Transaction'}
          </p>
          <div className="space-y-1 text-slate-200">
            <div>
              <span className="text-slate-400">Total Area:</span>{' '}
              <span className="font-mono font-semibold">{pt.sqft.toLocaleString('en-IN')} sq.ft</span>
            </div>
            <div>
              <span className="text-slate-400">Valuation:</span>{' '}
              <span className="font-mono font-bold text-indiagreen-light">{formatIndianPrice(pt.priceLakhs)}</span>
            </div>
            <div>
              <span className="text-slate-400">Configuration:</span>{' '}
              <span className="font-semibold">{pt.bhk} BHK</span>
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
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-navy-700 inline-block" />
            Historical Transaction Samples (Bengaluru & Metros)
          </span>
          {highlightPoint && (
            <span className="flex items-center gap-1.5 font-bold text-saffron-dark">
              <span className="w-3 h-3 rounded-full bg-saffron inline-block ring-2 ring-saffron-dark" />
              Active Estimate
            </span>
          )}
        </div>
        <span className="text-slate-400 font-mono">Target: Price (₹ Lakhs)</span>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <RechartsScatterChart
            margin={{ top: 20, right: 30, bottom: 20, left: 15 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="sqft"
              name="Total Area"
              unit=" sq.ft"
              domain={['dataMin - 100', 'dataMax + 200']}
              tickFormatter={(v) => `${Number(v).toLocaleString('en-IN')}`}
              stroke="#64748b"
              fontSize={11}
              label={{
                value: 'Total Area in Sq.Ft',
                position: 'insideBottom',
                offset: -10,
                fontSize: 11,
                fill: '#475569',
              }}
            />
            <YAxis
              type="number"
              dataKey="priceLakhs"
              name="Price"
              domain={['dataMin - 10', 'dataMax + 30']}
              tickFormatter={(v) => `₹${v}L`}
              stroke="#64748b"
              fontSize={11}
              label={{
                value: 'Valuation in ₹ Lakhs',
                angle: -90,
                position: 'insideLeft',
                offset: 5,
                fontSize: 11,
                fill: '#475569',
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {highlightPoint && highlightPoint.priceLakhs && (
              <ReferenceLine
                y={Number(highlightPoint.priceLakhs)}
                stroke="#ff9933"
                strokeDasharray="4 4"
                label={{
                  value: formatIndianPrice(highlightPoint.priceLakhs),
                  fill: '#e67300',
                  fontSize: 11,
                  position: 'insideTopRight',
                }}
              />
            )}
            <Scatter name="Properties" data={combinedData} fill="#0b3d91">
              {combinedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isHighlighted ? '#ff9933' : '#0b3d91'}
                  stroke={entry.isHighlighted ? '#b45309' : '#072b6b'}
                  strokeWidth={entry.isHighlighted ? 2.5 : 1}
                  r={entry.isHighlighted ? 8 : 5}
                />
              ))}
            </Scatter>
          </RechartsScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ScatterChart;
