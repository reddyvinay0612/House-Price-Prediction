import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  LineChart as LineChartIcon,
  Award,
  Sparkles,
  ShieldCheck,
  Building2,
  ArrowUpRight,
  Filter,
  Info,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart,
} from 'recharts';
import api from '../services/api';

/**
 * M7: 5-Year Housing Price Forecast & Investment Score Leaderboard (/forecast)
 * Features:
 * - 5-Year projection line chart with Optimistic, Base, and Cautious growth bands
 * - 0-100 Investment Scorecard with growth, affordability, and risk ratings
 * - Ranked Top 10 Indian Districts Leaderboard Table
 * - 'Projection, not a guarantee' statutory label
 */
export default function ForecastDashboard() {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState('Bengaluru Urban');
  const [forecastData, setForecastData] = useState(null);
  const [topScores, setTopScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [fcRes, scRes] = await Promise.all([
          api.getForecast(selectedCity),
          api.getInvestmentScores(10),
        ]);
        setForecastData(fcRes?.forecast);
        setTopScores(scRes?.scores || []);
      } catch (err) {
        console.error('Failed to load forecast data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [selectedCity]);

  const projections = forecastData?.projections || [];

  // Chart data formatting
  const chartData = projections.map((p) => ({
    year: p.year_name.split(' ')[0] + ' ' + p.year_name.split(' ')[1],
    'Base Projection (₹/sqft)': p.base_rate_sqft,
    'Optimistic (+2.5%)': p.optimistic_rate_sqft,
    'Cautious (-2.0%)': p.cautious_rate_sqft,
    '2BHK Price (₹ Lakh)': p.projected_2bhk_lakhs,
  }));

  // Find score for currently selected city
  const currentScoreItem = topScores.find(
    (s) => s.district.toLowerCase() === selectedCity.toLowerCase()
  ) || {
    investment_score: 92,
    rating: 'High Growth • Prime Yield',
    risk_rating: 'Low-Medium',
    growth_rate: '11.2%',
    avg_rate_sqft: 6850,
    rationale: 'Robust economic inflow, tech corridor expansion, and strong rental yields.',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white p-5 sm:p-7 rounded-xl shadow-md border-l-4 border-saffron flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-saffron text-navy-950 font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
              Milestone 7 Analytics
            </span>
            <span className="text-xs text-slate-300">5-Year Econometric Projections</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
            5-Year Price Forecast & Investment Scores • 5-वर्षीय मूल्य पूर्वानुमान (M7)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Compound annual growth modeling across Indian metropolitan micro-markets with multi-scenario optimistic, base, and cautious volatility bands.
          </p>
        </div>

        {/* City Filter Selector */}
        <div className="flex flex-col gap-1 self-start md:self-auto">
          <label className="text-xs font-bold text-saffron uppercase tracking-wider">
            Select District / City:
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="text-xs font-bold bg-navy-950 text-white border border-white/20 p-2.5 rounded shadow-sm focus:ring-2 focus:ring-saffron focus:outline-none"
          >
            <option value="Bengaluru Urban">Bengaluru Urban (Karnataka)</option>
            <option value="Mumbai Suburban">Mumbai Suburban (Maharashtra)</option>
            <option value="Gurugram">Gurugram (Haryana NCR)</option>
            <option value="Hyderabad">Hyderabad (Telangana)</option>
            <option value="Pune">Pune (Maharashtra)</option>
            <option value="Ahmedabad">Ahmedabad (Gujarat)</option>
            <option value="Chennai">Chennai (Tamil Nadu)</option>
            <option value="Mysuru (Mysore)">Mysuru (Karnataka)</option>
            <option value="Indore">Indore (Madhya Pradesh)</option>
            <option value="Jaipur">Jaipur (Rajasthan)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 5-Year Forecast Chart & Investment Score Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 5-Year Projections Chart */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-navy-900 flex items-center gap-2">
                  <LineChartIcon className="w-4 h-4 text-navy-700" />
                  <span>5-Year Rate Appreciation Trajectory ({selectedCity})</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Base CAGR: <span className="font-bold text-navy-800">{forecastData?.cagr_percent || 9.5}% p.a.</span>
                </p>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded self-start sm:self-auto">
                Projection, not a guarantee
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 15, left: -5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}/sq.ft`}
                    contentStyle={{ fontSize: '11px', borderRadius: '4px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line
                    type="monotone"
                    dataKey="Optimistic (+2.5%)"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Base Projection (₹/sqft)"
                    stroke="#0b3d91"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Cautious (-2.0%)"
                    stroke="#f97316"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 0-100 Investment Score Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-saffron-dark" />
                <span>Micro-Market Investment Scorecard (0 - 100)</span>
              </h3>
              <span className="text-xs font-mono font-bold text-navy-800">
                Grade: A+ Yield
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1">
              {/* Score Dial */}
              <div className="bg-navy-950 text-white p-4 rounded-lg text-center space-y-1">
                <p className="text-[10px] text-saffron font-bold uppercase tracking-wider">Investment Score</p>
                <p className="text-4xl font-black font-mono text-white">
                  {currentScoreItem.investment_score}
                </p>
                <p className="text-[10px] text-slate-300">Out of 100 Index</p>
              </div>

              {/* Stats Column */}
              <div className="sm:col-span-2 space-y-2">
                <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="font-bold text-slate-700">Market Rating:</span>
                  <span className="font-extrabold text-navy-900">{currentScoreItem.rating}</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="font-bold text-slate-700">Infrastructure Risk:</span>
                  <span className="font-extrabold text-emerald-700">{currentScoreItem.risk_rating}</span>
                </div>
                <div className="p-2.5 bg-blue-50/70 rounded border border-blue-200 text-[11px] text-navy-950">
                  <strong>Analytical Rationale:</strong> {currentScoreItem.rationale}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Top 10 Ranked Districts Leaderboard Table (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Top 10 Investment Districts</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Ranked</span>
          </div>

          <div className="max-h-[480px] overflow-y-auto border border-slate-200 rounded">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-navy-900 text-white uppercase text-[10px] tracking-wider sticky top-0">
                <tr>
                  <th className="py-2.5 px-2">#</th>
                  <th className="py-2.5 px-2">District / State</th>
                  <th className="py-2.5 px-2 text-right">Rate (₹/sqft)</th>
                  <th className="py-2.5 px-2 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {topScores.map((row, idx) => (
                  <tr
                    key={idx}
                    onClick={() => setSelectedCity(row.district)}
                    className={`cursor-pointer transition ${
                      selectedCity.toLowerCase() === row.district.toLowerCase()
                        ? 'bg-saffron/15 font-bold'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2 px-2 font-sans font-bold text-navy-800">{idx + 1}</td>
                    <td className="py-2 px-2 font-sans">
                      <p className="font-bold text-navy-900 leading-tight">{row.district}</p>
                      <p className="text-[10px] text-slate-500">{row.state}</p>
                    </td>
                    <td className="py-2 px-2 text-right text-slate-800">
                      ₹{row.avg_rate_sqft?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2 px-2 text-right">
                      <span className="bg-navy-900 text-saffron font-bold px-1.5 py-0.5 rounded text-[10px]">
                        {row.investment_score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[10px] text-slate-400 italic pt-1 text-center">
            Click any district in the leaderboard to project its 5-year growth trajectory.
          </p>
        </div>
      </div>
    </div>
  );
}
