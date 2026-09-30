import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  BarChart3,
  MapPin,
  Search,
  ArrowUpDown,
  Building2,
  PieChart,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import ScatterChart from '../components/charts/ScatterChart';
import HistogramChart from '../components/charts/HistogramChart';
import TopLocalitiesChart from '../components/charts/TopLocalitiesChart';
import {
  METRO_CITIES,
  NON_METRO_CITIES,
  INDIAN_CITIES,
  BHK_DISTRIBUTION,
  TOP_LOCALITIES_INDIA,
} from '../data/indianData';
import { formatPricePerSqft, formatIndianPrice } from '../utils/formatters';

export default function MarketInsights() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('all');

  // Flatten all localities across Indian cities for the master table
  const allLocalities = useMemo(() => {
    const list = [];
    INDIAN_CITIES.forEach((c) => {
      c.localities.forEach((l) => {
        list.push({
          city: c.name,
          cityId: c.id,
          state: c.state,
          locality: l.name,
          avgRate: l.avgRate,
          tier: l.tier,
          typical2Bhk: Math.round((l.avgRate * 1100) / 100000),
        });
      });
    });
    return list;
  }, []);

  const filteredLocalities = useMemo(() => {
    return allLocalities.filter((item) => {
      const matchCity = filterCity === 'all' || item.cityId === filterCity;
      const matchSearch =
        item.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tier.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCity && matchSearch;
    });
  }, [allLocalities, filterCity, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-2 border-navy-700 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-saffron-dark bg-amber-50 border border-amber-200 px-2.5 py-0.5 inline-block rounded mb-1">
          Market Intelligence & Statistical Diagnostics
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 font-sans">
          Indian Housing Market Insights (बाजार अंतर्दृष्टि)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Exploratory analysis of 13,320+ verified real estate property transactions, spatial pricing distributions, bedroom configurations, and prime micro-markets.
        </p>
      </div>

      {/* Row 1: Prime Micro-Markets & Price Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <Card
            title="Top 10 Prime Micro-Markets in India"
            subtitle="Ranked by average price density per square foot (₹/sq.ft)"
          >
            <TopLocalitiesChart height={340} />
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Card
            title="Transaction Price Distribution (₹ Lakhs / Crores)"
            subtitle="Categorized into market brackets from verified property records"
          >
            <HistogramChart height={340} />
          </Card>
        </div>
      </div>

      {/* Row 2: Scatter Plot of Total Area vs Price */}
      <Card
        title="Valuation vs. Covered Floor Area (Total Sq.Ft)"
        subtitle="Scatter regression distribution demonstrating the relationship between square footage and market valuation"
      >
        <ScatterChart height={360} />
      </Card>

      {/* Row 3: BHK Configuration Summary */}
      <Card
        title="Bedroom Layout (BHK) Transaction Volume & Pricing"
        subtitle="Distribution of property inventory across 1BHK, 2BHK, 3BHK, 4BHK, and 5+ BHK units"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {BHK_DISTRIBUTION.map((b, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded text-center space-y-1">
              <span className="text-xs font-bold text-navy-900 block">{b.bhk}</span>
              <span className="text-base font-extrabold font-mono text-indiagreen block">
                {formatIndianPrice(b.avgPriceLakhs)}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {b.count.toLocaleString('en-IN')} units
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Row 4: Searchable National Locality Registry Table */}
      <Card
        title="National Locality & Micro-Market Rate Registry"
        subtitle={`Searchable directory of micro-market pricing tiers across ${INDIAN_CITIES.length} Indian cities (${METRO_CITIES.length} Metros & ${NON_METRO_CITIES.length} Non-Metros)`}
        headerAction={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-navy-700"
            >
              <option value="all">All Cities ({INDIAN_CITIES.length})</option>
              <optgroup label={`🚇 Metro Cities (${METRO_CITIES.length})`}>
                {METRO_CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </optgroup>
              <optgroup label={`🏙️ Non-Metro Cities (${NON_METRO_CITIES.length})`}>
                {NON_METRO_CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </optgroup>
            </select>

            <div className="w-56">
              <Input
                placeholder="Search locality or tier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-1 text-xs"
              />
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto max-h-96">
          <table className="gov-table w-full text-xs">
            <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm">
              <tr>
                <th>Locality / Sector</th>
                <th>City & State</th>
                <th>Classification Tier</th>
                <th className="text-right">Average Rate (₹ / sq.ft)</th>
                <th className="text-right">Typical 2BHK (1100 sq.ft)</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocalities.map((item, idx) => (
                <tr key={`${item.city}-${item.locality}-${idx}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="font-bold text-navy-900">{item.locality}</td>
                  <td className="text-slate-700">{item.city}, {item.state}</td>
                  <td>
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {item.tier}
                    </span>
                  </td>
                  <td className="font-mono font-bold text-right text-navy-900">
                    {formatPricePerSqft(item.avgRate)}
                  </td>
                  <td className="font-mono font-semibold text-right text-indiagreen">
                    {formatIndianPrice(item.typical2Bhk)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
