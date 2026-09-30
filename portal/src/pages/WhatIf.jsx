import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sliders,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Building2,
  RefreshCw,
  Home,
  CheckCircle2,
  Layers,
  Info,
  Car,
  Bath,
  Maximize2,
  Award,
} from 'lucide-react';
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
import api from '../services/api';

/**
 * M1: What-If Sensitivity Simulator Page (/whatif)
 * Features base property inputs + live panel of sliders & toggles:
 * - (+1 bathroom, quality 1-10 slider, +1 parking bay, +200 sqft, Ready to Move vs Under Construction)
 * - 300ms debounce calling /whatif
 * - Animated delta badge (green up, red down)
 * - Recharts waterfall breakdown chart
 */
export default function WhatIf() {
  const { t } = useTranslation();

  // Base Property State
  const [baseCity, setBaseCity] = useState('Bengaluru');
  const [baseLocality, setBaseLocality] = useState('Whitefield');
  const [baseSqft, setBaseSqft] = useState(1200);
  const [baseBhk, setBaseBhk] = useState(2);
  const [baseBath, setBaseBath] = useState(2);

  // What-If Modifiers State
  const [deltaSqft, setDeltaSqft] = useState(200);
  const [deltaBath, setDeltaBath] = useState(1);
  const [deltaParking, setDeltaParking] = useState(1);
  const [qualityScore, setQualityScore] = useState(8);
  const [readyToMove, setReadyToMove] = useState(true);

  // Results State
  const [simulationResult, setSimulationResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const debounceTimerRef = useRef(null);

  // 300ms Debounced Simulation Dispatcher
  useEffect(() => {
    setIsCalculating(true);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await api.simulateWhatIf({
          base_city: baseCity,
          base_locality: baseLocality,
          base_sqft: baseSqft,
          base_bhk: baseBhk,
          base_bath: baseBath,
          delta_sqft: deltaSqft,
          delta_bath: deltaBath,
          delta_parking: deltaParking,
          quality_score: qualityScore,
          toggle_ready_to_move: readyToMove,
        });
        setSimulationResult(res);
      } catch (err) {
        console.error('What-If simulation failed', err);
      } finally {
        setIsCalculating(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimerRef.current);
  }, [baseCity, baseLocality, baseSqft, baseBhk, baseBath, deltaSqft, deltaBath, deltaParking, qualityScore, readyToMove]);

  const waterfallData = simulationResult?.waterfall_breakdown || [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-navy-950 text-white p-2.5 rounded shadow-xl border border-white/20 text-xs">
          <p className="font-bold text-saffron">{data.step}</p>
          <p className="text-slate-300">
            Incremental Delta:{' '}
            <span className={data.delta_lakhs >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {data.delta_lakhs >= 0 ? '+' : ''}₹{data.delta_lakhs.toFixed(2)} Lakh
            </span>
          </p>
          <p className="text-slate-300">
            Running Total: <span className="text-white font-bold">₹{data.amount_lakhs.toFixed(2)} Lakh</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white p-5 sm:p-7 rounded-xl shadow-md border-l-4 border-saffron flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-saffron text-navy-950 font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
              Milestone 1 Simulator
            </span>
            <span className="text-xs text-slate-300">Real-Time Sensitivity Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
            What-If Property Value Simulator • क्या-अगर मूल्य सिमुलेटर
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Adjust architectural features, construction specifications, and urban amenities in real time to simulate exact valuation impact with 300ms debounced econometric forecasting.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-navy-950/60 p-3 rounded-lg border border-white/10 backdrop-blur-sm self-start md:self-auto">
          <Sliders className="w-6 h-6 text-saffron" />
          <div className="text-xs">
            <p className="font-bold text-white">Interactive Sliders</p>
            <p className="text-slate-400 text-[11px]">Instant Delta Recalculation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Base Property & Sliders (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Base Property Setup */}
          <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-navy-900 flex items-center gap-2">
                <Home className="w-4 h-4 text-navy-700" />
                <span>1. Base Property Benchmark</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">Baseline</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <select
                  value={baseCity}
                  onChange={(e) => setBaseCity(e.target.value)}
                  className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-navy-700 focus:outline-none"
                >
                  <option value="Bengaluru">Bengaluru (₹6,850/sq.ft)</option>
                  <option value="Mumbai">Mumbai (₹18,500/sq.ft)</option>
                  <option value="Delhi-NCR">Delhi-NCR (₹9,200/sq.ft)</option>
                  <option value="Pune">Pune (₹6,400/sq.ft)</option>
                  <option value="Hyderabad">Hyderabad (₹6,100/sq.ft)</option>
                  <option value="Chennai">Chennai (₹6,200/sq.ft)</option>
                  <option value="Mysuru">Mysuru (₹3,800/sq.ft)</option>
                  <option value="Jaipur">Jaipur (₹3,900/sq.ft)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Locality</label>
                <input
                  type="text"
                  value={baseLocality}
                  onChange={(e) => setBaseLocality(e.target.value)}
                  className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-navy-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Base Built-up Area</label>
                <input
                  type="number"
                  step="50"
                  min="300"
                  max="15000"
                  value={baseSqft}
                  onChange={(e) => setBaseSqft(Number(e.target.value))}
                  className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-navy-700 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Modifiers & Sliders Panel */}
          <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-navy-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-saffron-dark" />
                <span>2. Interactive What-If Adjustments</span>
              </h2>
              <span className="text-[11px] bg-navy-50 text-navy-800 font-bold px-2 py-0.5 rounded">
                Live 300ms Debounce
              </span>
            </div>

            <div className="space-y-4 pt-1">
              {/* Slider 1: Area Delta */}
              <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-navy-700" />
                    Additional Area Expansion
                  </span>
                  <span className="font-mono font-bold text-navy-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {deltaSqft >= 0 ? `+${deltaSqft}` : deltaSqft} sq.ft (Total: {baseSqft + deltaSqft} sq.ft)
                  </span>
                </div>
                <input
                  type="range"
                  min="-400"
                  max="1500"
                  step="50"
                  value={deltaSqft}
                  onChange={(e) => setDeltaSqft(Number(e.target.value))}
                  className="w-full accent-navy-700 h-2 bg-slate-200 rounded cursor-pointer"
                />
              </div>

              {/* Slider 2: Additional Bathrooms */}
              <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Bath className="w-3.5 h-3.5 text-navy-700" />
                    Additional Attached Bathrooms
                  </span>
                  <span className="font-mono font-bold text-navy-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {deltaBath >= 0 ? `+${deltaBath}` : deltaBath} Bath
                  </span>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="3"
                  step="1"
                  value={deltaBath}
                  onChange={(e) => setDeltaBath(Number(e.target.value))}
                  className="w-full accent-navy-700 h-2 bg-slate-200 rounded cursor-pointer"
                />
              </div>

              {/* Slider 3: Covered Parking Bays */}
              <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-navy-700" />
                    Dedicated Covered Parking Bays
                  </span>
                  <span className="font-mono font-bold text-navy-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {deltaParking >= 0 ? `+${deltaParking}` : deltaParking} Bay (~₹3.5L/bay)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={deltaParking}
                  onChange={(e) => setDeltaParking(Number(e.target.value))}
                  className="w-full accent-navy-700 h-2 bg-slate-200 rounded cursor-pointer"
                />
              </div>

              {/* Slider 4: Construction Quality (1-10) */}
              <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-saffron-dark" />
                    Construction & Material Quality Grade
                  </span>
                  <span className="font-mono font-bold text-navy-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Grade {qualityScore} / 10 ({qualityScore >= 8 ? 'Luxury / Grade A+' : qualityScore >= 6 ? 'Standard' : 'Economy'})
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="10"
                  step="1"
                  value={qualityScore}
                  onChange={(e) => setQualityScore(Number(e.target.value))}
                  className="w-full accent-navy-700 h-2 bg-slate-200 rounded cursor-pointer"
                />
              </div>

              {/* Toggle: Ready to Move vs Under Construction */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <p className="text-xs font-bold text-slate-800">Possession & Handover Status</p>
                  <p className="text-[11px] text-slate-500">
                    {readyToMove ? 'Ready To Move (Immediate Occupancy)' : 'Under Construction (-6% RERA timeline discount)'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReadyToMove(!readyToMove)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition shadow-xs ${
                    readyToMove ? 'bg-emerald-700 text-white' : 'bg-amber-600 text-white'
                  }`}
                >
                  {readyToMove ? '✓ Ready To Move' : '⏳ Under Construction'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Valuation Result & Waterfall Chart (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Animated Delta Value Highlight Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Simulated Valuation
              </span>
              {isCalculating && (
                <span className="text-[10px] text-saffron-dark font-semibold flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Recalculating...
                </span>
              )}
            </div>

            {/* Price & Delta Banner */}
            <div className="text-center py-2 space-y-2">
              <p className="text-3xl sm:text-4xl font-black text-navy-950 font-mono tracking-tight">
                {simulationResult?.formatted_new || '₹85.20 Lakh'}
              </p>

              {/* Animated Delta Badge */}
              <div className="flex items-center justify-center gap-2">
                <div
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold shadow-xs ${
                    simulationResult?.is_positive
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  {simulationResult?.is_positive ? (
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span>
                    {simulationResult?.is_positive ? '+' : ''}₹
                    {Math.abs(simulationResult?.delta_lakhs || 0).toFixed(2)} Lakh ({simulationResult?.pct_change}%)
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 pt-1">
                Baseline Estimate: <span className="font-semibold text-slate-800">{simulationResult?.formatted_base}</span>
              </p>
            </div>

            {/* Waterfall Breakdown Chart */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900">
                  Step-by-Step Delta Waterfall
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">₹ in Lakh</span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={waterfallData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
                  >
                    <XAxis
                      dataKey="step"
                      stroke="#64748b"
                      fontSize={9}
                      angle={-25}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={10}
                      tickFormatter={(v) => `₹${v}L`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={simulationResult?.base_price_lakhs || 75} stroke="#0b3d91" strokeDasharray="3 3" />
                    <Bar dataKey="amount_lakhs" radius={[4, 4, 0, 0]}>
                      {waterfallData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.type === 'base'
                              ? '#0b3d91'
                              : entry.type === 'total'
                              ? '#ff9933'
                              : entry.delta_lakhs >= 0
                              ? '#10b981'
                              : '#ef4444'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="pt-2">
              <a
                href="/estimate"
                className="w-full py-2.5 px-4 bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs uppercase tracking-wider rounded text-center block transition shadow-sm"
              >
                Apply to Official Estimate Form →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
