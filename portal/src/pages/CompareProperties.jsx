import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Scale,
  Building2,
  TrendingUp,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Info,
  MapPin,
  Landmark,
  Compass,
  Maximize2,
  Home,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import api from '../services/api';
import {
  METRO_CITIES,
  NON_METRO_STATES,
  getDistrictsByState,
  INDIAN_CITIES,
  AREA_TYPES,
  AVAILABILITY_OPTIONS,
} from '../data/indianData';

/**
 * M5: Comprehensive All-India Dual Property Comparison Page (/compare)
 * Enables citizens and analysts to select ANY Indian State, District, and Micro-Market Locality
 * for Property A and Property B to perform deep side-by-side econometric valuations.
 */

// Sub-component for individual property configuration
function PropertyConfigCard({
  letter,
  title,
  themeColor,
  borderColor,
  badgeBg,
  propState,
  setPropState,
  estimate,
}) {
  const [mode, setMode] = useState(propState.category || 'metro'); // 'metro' | 'non-metro'
  const [selectedState, setSelectedState] = useState(propState.state || 'Karnataka');

  // Available districts in selected state
  const stateDistricts = useMemo(() => {
    return getDistrictsByState(selectedState);
  }, [selectedState]);

  // Selected city object
  const activeCityData = useMemo(() => {
    if (mode === 'metro') {
      return METRO_CITIES.find((c) => c.id === propState.cityId) || METRO_CITIES[0];
    } else {
      return stateDistricts.find((d) => d.id === propState.cityId) || stateDistricts[0] || METRO_CITIES[0];
    }
  }, [mode, propState.cityId, stateDistricts]);

  // Available localities
  const availableLocalities = activeCityData?.localities || [
    { name: 'City Center / Prime Market', avgRate: activeCityData?.avgRateSqft || 5000, tier: 'Central' },
    { name: 'Station Road / Transit Node', avgRate: (activeCityData?.avgRateSqft || 5000) * 0.9, tier: 'Transit' },
    { name: 'Civil Lines / Residential', avgRate: (activeCityData?.avgRateSqft || 5000) * 0.85, tier: 'Residential' },
    { name: 'Highway Growth Corridor', avgRate: (activeCityData?.avgRateSqft || 5000) * 0.75, tier: 'Growth' },
  ];

  // Handle Mode Change (Metro vs All-India State/District)
  const handleModeToggle = (newMode) => {
    setMode(newMode);
    if (newMode === 'metro') {
      const defaultMetro = METRO_CITIES[letter === 'A' ? 0 : 1] || METRO_CITIES[0];
      setPropState((prev) => ({
        ...prev,
        category: 'metro',
        city: defaultMetro.name,
        cityId: defaultMetro.id,
        state: defaultMetro.state,
        locality: defaultMetro.localities[0]?.name || 'Whitefield',
      }));
    } else {
      const defaultState = selectedState || 'Karnataka';
      const districts = getDistrictsByState(defaultState);
      const firstDistrict = districts[0] || { id: 'mysuru', name: 'Mysuru', localities: [] };
      setPropState((prev) => ({
        ...prev,
        category: 'non-metro',
        city: firstDistrict.name,
        cityId: firstDistrict.id,
        state: defaultState,
        locality: firstDistrict.localities?.[0]?.name || 'City Center',
      }));
    }
  };

  // Handle State Change
  const handleStateSelect = (stateName) => {
    setSelectedState(stateName);
    const districts = getDistrictsByState(stateName);
    const firstDistrict = districts[0] || { id: 'city', name: stateName, localities: [] };
    setPropState((prev) => ({
      ...prev,
      state: stateName,
      city: firstDistrict.name,
      cityId: firstDistrict.id,
      locality: firstDistrict.localities?.[0]?.name || 'Main City Area',
    }));
  };

  // Handle District Change
  const handleDistrictSelect = (districtId) => {
    const distObj = stateDistricts.find((d) => d.id === districtId);
    if (distObj) {
      setPropState((prev) => ({
        ...prev,
        city: distObj.name,
        cityId: distObj.id,
        locality: distObj.localities?.[0]?.name || 'City Center',
      }));
    }
  };

  // Handle Metro City Change
  const handleMetroSelect = (metroId) => {
    const metroObj = METRO_CITIES.find((m) => m.id === metroId);
    if (metroObj) {
      setPropState((prev) => ({
        ...prev,
        city: metroObj.name,
        cityId: metroObj.id,
        state: metroObj.state,
        locality: metroObj.localities[0]?.name || 'Central Area',
      }));
    }
  };

  return (
    <div className={`bg-white rounded-xl border-2 ${borderColor} shadow-sm p-4 sm:p-5 space-y-4`}>
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full ${badgeBg} text-white font-extrabold flex items-center justify-center text-xs shadow-xs`}>
            {letter}
          </span>
          <div>
            <h2 className="text-sm font-extrabold text-navy-950 uppercase tracking-wide">
              {title}
            </h2>
            <p className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs">
              {propState.locality}, {propState.city} ({propState.state})
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Estimated Price</span>
          <span className={`text-sm sm:text-base font-black font-mono ${themeColor}`}>
            {estimate?.formatted_price || 'Calculating...'}
          </span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-bold">
        <button
          type="button"
          onClick={() => handleModeToggle('metro')}
          className={`flex-1 py-1.5 rounded transition flex items-center justify-center gap-1 ${
            mode === 'metro'
              ? 'bg-navy-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-navy-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Metro Cities ({METRO_CITIES.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeToggle('non-metro')}
          className={`flex-1 py-1.5 rounded transition flex items-center justify-center gap-1 ${
            mode === 'non-metro'
              ? 'bg-navy-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-navy-900'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>All-India State & District</span>
        </button>
      </div>

      {/* Cascading Geographical Selectors */}
      <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-lg border border-slate-200">
        {mode === 'metro' ? (
          /* METRO SELECTION: Metro City -> Locality */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Select Metro City *
              </label>
              <select
                value={propState.cityId || 'bengaluru'}
                onChange={(e) => handleMetroSelect(e.target.value)}
                className="w-full text-xs font-semibold p-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-navy-700 focus:outline-none"
              >
                {METRO_CITIES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.state}) — ₹{m.avgRateSqft.toLocaleString('en-IN')}/sqft
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Locality / Micro-Market *
              </label>
              <select
                value={propState.locality}
                onChange={(e) => setPropState({ ...propState, locality: e.target.value })}
                className="w-full text-xs font-semibold p-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-navy-700 focus:outline-none"
              >
                {availableLocalities.map((l, i) => (
                  <option key={i} value={l.name}>
                    {l.name} — ₹{l.avgRate.toLocaleString('en-IN')}/sqft
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          /* NON-METRO ALL-INDIA CASCADING FLOW: State -> District -> Locality */
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. State Dropdown (All 36 States & UTs) */}
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">
                  1. State / Union Territory *
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateSelect(e.target.value)}
                  className="w-full text-xs font-semibold p-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-navy-700 focus:outline-none"
                >
                  {NON_METRO_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st} ({getDistrictsByState(st).length} Districts)
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. District Dropdown */}
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">
                  2. District / City *
                </label>
                <select
                  value={propState.cityId || stateDistricts[0]?.id}
                  onChange={(e) => handleDistrictSelect(e.target.value)}
                  className="w-full text-xs font-semibold p-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-navy-700 focus:outline-none"
                >
                  {stateDistricts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} (Avg ₹{d.avgRateSqft?.toLocaleString('en-IN')}/sqft)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Locality / Micro-Market Area */}
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                3. Micro-Market / Locality in {propState.city} *
              </label>
              <select
                value={propState.locality}
                onChange={(e) => setPropState({ ...propState, locality: e.target.value })}
                className="w-full text-xs font-semibold p-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-navy-700 focus:outline-none"
              >
                {availableLocalities.map((l, i) => (
                  <option key={i} value={l.name}>
                    {l.name} — ₹{l.avgRate?.toLocaleString('en-IN')}/sqft ({l.tier})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Property Dimensions & Layout Attributes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Area (Sq.Ft)</label>
          <input
            type="number"
            min="300"
            max="15000"
            step="25"
            value={propState.total_sqft}
            onChange={(e) => setPropState({ ...propState, total_sqft: Number(e.target.value) })}
            className="w-full text-xs font-bold p-2 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-navy-700 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">BHK Rooms</label>
          <select
            value={propState.bhk}
            onChange={(e) => setPropState({ ...propState, bhk: Number(e.target.value) })}
            className="w-full text-xs font-bold p-2 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-navy-700 focus:bg-white"
          >
            <option value={1}>1 BHK</option>
            <option value={2}>2 BHK</option>
            <option value={3}>3 BHK</option>
            <option value={4}>4 BHK</option>
            <option value={5}>5+ BHK</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Bathrooms</label>
          <select
            value={propState.bath}
            onChange={(e) => setPropState({ ...propState, bath: Number(e.target.value) })}
            className="w-full text-xs font-bold p-2 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-navy-700 focus:bg-white"
          >
            <option value={1}>1 Bath</option>
            <option value={2}>2 Bath</option>
            <option value={3}>3 Bath</option>
            <option value={4}>4 Bath</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Possession</label>
          <select
            value={propState.availability}
            onChange={(e) => setPropState({ ...propState, availability: e.target.value })}
            className="w-full text-xs font-bold p-2 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-navy-700 focus:bg-white"
          >
            <option value="Ready To Move">Ready To Move</option>
            <option value="Under Construction">Under Construction</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default function CompareProperties() {
  const { t } = useTranslation();

  // Property A State (Defaults to Bengaluru Whitefield)
  const [propA, setPropA] = useState({
    category: 'metro',
    state: 'Karnataka',
    city: 'Bengaluru',
    cityId: 'bengaluru',
    locality: 'Whitefield',
    total_sqft: 1250,
    bhk: 2,
    bath: 2,
    balcony: 1,
    area_type: 'Super built-up  Area',
    availability: 'Ready To Move',
  });

  // Property B State (Defaults to Mumbai Bandra or Any State)
  const [propB, setPropB] = useState({
    category: 'metro',
    state: 'Maharashtra',
    city: 'Mumbai (MMR)',
    cityId: 'mumbai',
    locality: 'Bandra West',
    total_sqft: 1450,
    bhk: 3,
    bath: 3,
    balcony: 2,
    area_type: 'Super built-up  Area',
    availability: 'Ready To Move',
  });

  const [comparisonResult, setComparisonResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Automatic recalculation whenever property specs change
  useEffect(() => {
    let active = true;
    async function evaluate() {
      setIsLoading(true);
      try {
        const res = await api.compareProperties(propA, propB);
        if (active) {
          setComparisonResult(res);
        }
      } catch (err) {
        console.error('Comparison evaluation failed', err);
      } finally {
        if (active) setIsLoading(false);
      }
    }
    evaluate();
    return () => {
      active = false;
    };
  }, [propA, propB]);

  const estA = comparisonResult?.property_a;
  const estB = comparisonResult?.property_b;

  const barChartData = [
    {
      metric: 'Estimated Price (₹ Lakh)',
      [propA.city || 'Property A']: estA?.predicted_price_lakhs || 0,
      [propB.city || 'Property B']: estB?.predicted_price_lakhs || 0,
    },
    {
      metric: 'Rate / 100 Sq.Ft (₹)',
      [propA.city || 'Property A']: Math.round((estA?.price_per_sqft || 0) / 100),
      [propB.city || 'Property B']: Math.round((estB?.price_per_sqft || 0) / 100),
    },
    {
      metric: 'Built-up Area / 10 (sqft)',
      [propA.city || 'Property A']: Math.round((propA.total_sqft || 0) / 10),
      [propB.city || 'Property B']: Math.round((propB.total_sqft || 0) / 10),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn font-sans">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white p-5 sm:p-7 rounded-xl shadow-md border-l-4 border-saffron flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-saffron text-navy-950 font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
              Milestone 5 Comparator
            </span>
            <span className="text-xs text-slate-300">All-India Multi-District Real Estate Benchmarking</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
            Compare Two Properties • दो संपत्तियों की तुलना (M5)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Select any Indian State, District, and Micro-Market Locality for side-by-side econometric comparison with automated difference attribution and live rate matrixing.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {isLoading ? (
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-navy-950/80 rounded border border-white/20 text-xs text-saffron font-bold">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Evaluating Model...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700/90 rounded border border-emerald-400/40 text-xs text-white font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Live Synced</span>
            </div>
          )}
        </div>
      </div>

      {/* Side-by-Side Complete State & District Selectors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* PROPERTY A */}
        <PropertyConfigCard
          letter="A"
          title="Property A Specification"
          themeColor="text-navy-900"
          borderColor="border-navy-700"
          badgeBg="bg-navy-800"
          propState={propA}
          setPropState={setPropA}
          estimate={estA}
        />

        {/* PROPERTY B */}
        <PropertyConfigCard
          letter="B"
          title="Property B Specification"
          themeColor="text-saffron-dark"
          borderColor="border-saffron"
          badgeBg="bg-saffron"
          propState={propB}
          setPropState={setPropB}
          estimate={estB}
        />
      </div>

      {/* Algorithmic Rationale Summary Card */}
      {comparisonResult && (
        <div className="bg-navy-50 border-l-4 border-navy-700 p-4 rounded-r shadow-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-saffron-dark shrink-0" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-navy-900">
              Econometric Comparison Rationale & Variance Analysis
            </h3>
          </div>
          <p className="text-xs text-navy-950 font-semibold leading-relaxed">
            {comparisonResult.rationale_summary}
          </p>
        </div>
      )}

      {/* Comparison Metrics Matrix & Grouped Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Matrix Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>Detailed Differential Matrix</span>
            <span className="text-[10px] text-slate-400 font-mono">Currency: INR (₹)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-800 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Valuation Metric</th>
                  <th className="py-2.5 px-3">Property A ({propA.city})</th>
                  <th className="py-2.5 px-3">Property B ({propB.city})</th>
                  <th className="py-2.5 px-3 text-right">Variance (B - A)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-sans font-bold text-navy-900">Predicted Valuation</td>
                  <td className="py-2.5 px-3 font-bold text-navy-800">{estA?.formatted_price}</td>
                  <td className="py-2.5 px-3 font-bold text-saffron-dark">{estB?.formatted_price}</td>
                  <td
                    className={`py-2.5 px-3 text-right font-bold ${
                      comparisonResult?.price_diff_lakhs >= 0 ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {comparisonResult?.price_diff_lakhs >= 0 ? '+' : ''}
                    ₹{comparisonResult?.price_diff_lakhs} Lakh ({comparisonResult?.pct_diff}%)
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-sans font-bold text-navy-900">Unit Rate (₹/Sq.Ft)</td>
                  <td className="py-2 px-3">₹{estA?.price_per_sqft?.toLocaleString('en-IN')}/sqft</td>
                  <td className="py-2 px-3">₹{estB?.price_per_sqft?.toLocaleString('en-IN')}/sqft</td>
                  <td className="py-2 px-3 text-right text-slate-700">
                    {comparisonResult?.sqft_rate_diff >= 0 ? '+' : ''}
                    ₹{comparisonResult?.sqft_rate_diff?.toLocaleString('en-IN')}/sqft
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-sans font-bold text-navy-900">State / Region</td>
                  <td className="py-2 px-3 font-sans">{propA.state}</td>
                  <td className="py-2 px-3 font-sans">{propB.state}</td>
                  <td className="py-2 px-3 text-right font-sans text-slate-500">Cross-State</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-sans font-bold text-navy-900">District / Micro-Market</td>
                  <td className="py-2 px-3 font-sans">{propA.locality}, {propA.city}</td>
                  <td className="py-2 px-3 font-sans">{propB.locality}, {propB.city}</td>
                  <td className="py-2 px-3 text-right font-sans text-slate-500">Regional</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-sans font-bold text-navy-900">Total Covered Area</td>
                  <td className="py-2 px-3 font-sans">{propA.total_sqft} sq.ft</td>
                  <td className="py-2 px-3 font-sans">{propB.total_sqft} sq.ft</td>
                  <td className="py-2 px-3 text-right font-sans">
                    {propB.total_sqft - propA.total_sqft >= 0 ? '+' : ''}
                    {propB.total_sqft - propA.total_sqft} sq.ft
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-sans font-bold text-navy-900">BHK Layout & Baths</td>
                  <td className="py-2 px-3 font-sans">{propA.bhk} BHK, {propA.bath} Bath</td>
                  <td className="py-2 px-3 font-sans">{propB.bhk} BHK, {propB.bath} Bath</td>
                  <td className="py-2 px-3 text-right font-sans">
                    {propB.bhk - propA.bhk >= 0 ? '+' : ''}
                    {propB.bhk - propA.bhk} BHK
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-sans font-bold text-navy-900">Handover Status</td>
                  <td className="py-2 px-3 font-sans">{propA.availability}</td>
                  <td className="py-2 px-3 font-sans">{propB.availability}</td>
                  <td className="py-2 px-3 text-right font-sans text-slate-500">RERA Sanctioned</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Grouped Bar Chart (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 border-b border-slate-100 pb-2">
            Relative Dimension Comparison Chart
          </h3>

          <div className="h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="metric" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey={propA.city || 'Property A'} fill="#0b3d91" radius={[4, 4, 0, 0]} />
                <Bar dataKey={propB.city || 'Property B'} fill="#ff9933" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100 text-center">
            Valuation calculated with 5-Fold Champion Gradient Boosting Regressor model.
          </div>
        </div>
      </div>
    </div>
  );
}
