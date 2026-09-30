import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Building2,
  TrendingUp,
  MapPin,
  Calculator,
  ArrowUpDown,
  BadgePercent,
  CheckCircle2,
  Train,
  Building,
  Layers,
  Filter,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import CityTrendsChart from '../components/charts/CityTrendsChart';
import {
  METRO_CITIES,
  NON_METRO_CITIES,
  INDIAN_CITIES,
  CITY_TRENDS_COMPARISON,
} from '../data/indianData';
import { formatPricePerSqft, formatIndianPrice } from '../utils/formatters';

export default function CityTrends() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'metro' | 'non-metro'
  const [selectedCityId, setSelectedCityId] = useState('bengaluru');

  const filteredComparison = useMemo(() => {
    if (selectedCategory === 'metro') {
      return CITY_TRENDS_COMPARISON.filter((c) => c.category === 'Metro');
    }
    if (selectedCategory === 'non-metro') {
      return CITY_TRENDS_COMPARISON.filter((c) => c.category === 'Non-Metro');
    }
    return CITY_TRENDS_COMPARISON;
  }, [selectedCategory]);

  const selectedCity = useMemo(() => {
    return (
      INDIAN_CITIES.find((c) => c.id === selectedCityId) || INDIAN_CITIES[0]
    );
  }, [selectedCityId]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-2 border-navy-700 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-saffron-dark bg-amber-50 border border-amber-200 px-2.5 py-0.5 inline-block rounded mb-1">
          National Multi-City Real Estate Intelligence & Benchmarks
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 font-sans">
          Indian Metropolitan & Regional Housing Trends (शहर रुझान)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Comprehensive real estate market intelligence across 11 major Metro transit centers (Bengaluru, Mumbai, Delhi-NCR, Chennai, Hyderabad, Pune, Kolkata, etc.) and 42+ Non-Metro regional growth cities.
        </p>
      </div>

      {/* Category Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-navy-900 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-navy-700" />
          Filter Market Data:
        </span>
        <div className="inline-flex rounded-md shadow-sm border border-slate-300 p-1 bg-white">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 text-xs font-semibold rounded transition ${
              selectedCategory === 'all'
                ? 'bg-navy-700 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            All Cities ({CITY_TRENDS_COMPARISON.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('metro')}
            className={`px-3 py-1 text-xs font-semibold rounded transition flex items-center gap-1 ${
              selectedCategory === 'metro'
                ? 'bg-navy-700 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Train className="w-3 h-3" />
            Metro Cities ({METRO_CITIES.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('non-metro')}
            className={`px-3 py-1 text-xs font-semibold rounded transition flex items-center gap-1 ${
              selectedCategory === 'non-metro'
                ? 'bg-navy-700 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Building className="w-3 h-3" />
            Non-Metro Cities ({NON_METRO_CITIES.length})
          </button>
        </div>
      </div>

      {/* Interactive City Comparison Chart */}
      <Card
        title={
          selectedCategory === 'metro'
            ? 'Average Capital Values (₹ / Sq.Ft) in 11 Metro Rail Markets'
            : selectedCategory === 'non-metro'
            ? 'Average Capital Values (₹ / Sq.Ft) in Non-Metro Regional Hubs'
            : 'Average Capital Values (₹ / Sq.Ft) Across Indian Cities'
        }
        subtitle="Calibrated on primary market launches and secondary residential registry transfers"
      >
        <CityTrendsChart data={filteredComparison.slice(0, 16)} height={380} />
      </Card>

      {/* Multi-City Comparison Table */}
      <Card
        title="Real Estate Market Indicators Summary Table"
        subtitle={`Showing ${filteredComparison.length} cities ranked by average price density per square foot`}
      >
        <div className="overflow-x-auto">
          <table className="gov-table w-full text-xs">
            <thead>
              <tr>
                <th>City / Region</th>
                <th>Classification</th>
                <th className="text-right">Average Rate (₹ / sq.ft)</th>
                <th className="text-right">Typical 2BHK (1000 sq.ft)</th>
                <th className="text-right">Typical 3BHK (1600 sq.ft)</th>
                <th className="text-right">Annual Appreciation (YoY)</th>
                <th className="text-left">State / Region</th>
              </tr>
            </thead>
            <tbody>
              {filteredComparison.map((item, idx) => {
                const est3BhkLakhs = Math.round((item.avgRateSqft * 1600) / 100000);
                return (
                  <tr
                    key={item.city}
                    className={
                      item.city === 'Bengaluru'
                        ? 'bg-amber-50/60 font-semibold'
                        : idx % 2 === 0
                        ? 'bg-white'
                        : 'bg-slate-50/40'
                    }
                  >
                    <td>
                      <div className="font-bold text-navy-900 flex items-center gap-1.5">
                        {item.category === 'Metro' ? (
                          <Train className="w-3.5 h-3.5 text-navy-700 shrink-0" />
                        ) : (
                          <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        )}
                        <span>{item.city}</span>
                        {item.city === 'Bengaluru' && (
                          <span className="text-[10px] bg-navy-700 text-white px-1.5 py-0.2 rounded font-bold">
                            Base Data
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          item.category === 'Metro'
                            ? 'bg-navy-100 text-navy-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.category === 'Metro' ? '🚇 Metro Rail' : '🏙️ Non-Metro'}
                      </span>
                    </td>
                    <td className="text-right font-mono font-bold text-navy-900">
                      {formatPricePerSqft(item.avgRateSqft)}
                    </td>
                    <td className="text-right font-mono text-slate-800">
                      {formatIndianPrice(item.avg2BhkLakhs)}
                    </td>
                    <td className="text-right font-mono text-slate-800">
                      {formatIndianPrice(est3BhkLakhs)}
                    </td>
                    <td className="text-right font-mono font-bold text-indiagreen">
                      +{item.yoyGrowth}%
                    </td>
                    <td className="text-left text-slate-600">
                      {item.state || 'India'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* City Specific Deep-Dive Selector */}
      <Card
        title={`Micro-Market Breakdown for ${selectedCity.name} (${selectedCity.state})`}
        subtitle="Select any Metro or Non-Metro city to inspect localized micro-market pricing tiers"
        headerAction={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Select City:</span>
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="text-xs border border-slate-300 rounded px-2.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-navy-700"
            >
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
          </div>
        }
      >
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span
            className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
              selectedCity.hasMetro
                ? 'bg-navy-100 text-navy-900 border border-navy-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {selectedCity.hasMetro ? '🚇 Metro Rail Active' : '🏙️ Non-Metro Regional Hub (No Metro Rail)'}
          </span>
          <span className="text-slate-500">
            Average Rate: <b className="text-navy-900 font-mono">₹{selectedCity.avgRateSqft.toLocaleString('en-IN')}/sq.ft</b>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {selectedCity.localities.map((loc, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1 hover:border-navy-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-navy-900 text-xs">{loc.name}</span>
                <span className="text-[10px] text-slate-500 bg-slate-200 px-1.5 py-0.2 rounded">
                  {loc.tier}
                </span>
              </div>
              <div className="text-sm font-mono font-bold text-indiagreen">
                {formatPricePerSqft(loc.avgRate)}
              </div>
              <div className="text-[10px] text-slate-500">
                Typical 2BHK (1200 sq.ft): {formatIndianPrice((loc.avgRate * 1200) / 100000)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            Want to calculate property price for a specific apartment in {selectedCity.name}?
          </div>
          <Link to="/estimate">
            <Button variant="primary" size="sm" className="bg-indiagreen hover:bg-indiagreen-dark border-indiagreen-dark text-white font-bold">
              <Calculator className="w-3.5 h-3.5 mr-1" />
              Estimate Price in {selectedCity.name}
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
