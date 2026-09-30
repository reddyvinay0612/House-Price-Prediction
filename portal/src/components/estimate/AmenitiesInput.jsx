import React, { useState } from 'react';
import { Train, GraduationCap, Hospital, ShoppingBag, Info, HelpCircle } from 'lucide-react';

/**
 * M8: Nearby Amenities Factor Input & Impact Calculator
 * Allows citizens to enter distances to key urban infrastructure or toggle 'Not sure'.
 */
export default function AmenitiesInput({ value = {}, onChange, disabled = false }) {
  const [notSureMetro, setNotSureMetro] = useState(value.metro_km === null || value.metro_km === undefined);
  const [notSureSchool, setNotSureSchool] = useState(value.school_km === null || value.school_km === undefined);
  const [notSureHospital, setNotSureHospital] = useState(value.hospital_km === null || value.hospital_km === undefined);
  const [notSureMarket, setNotSureMarket] = useState(value.market_km === null || value.market_km === undefined);

  const handleUpdate = (field, val) => {
    onChange({
      ...value,
      [field]: val,
    });
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-navy-900">
            Nearby Amenities & Urban Infrastructure (M8)
          </span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
            Value Premium
          </span>
        </div>
        <span className="text-[11px] text-slate-500 italic hidden sm:inline">
          Proximity adds up to +12% valuation premium
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {/* 1. Metro / Railway */}
        <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Train className="w-3.5 h-3.5 text-navy-700" />
              <span>Metro / Train (km)</span>
            </label>
            <label className="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notSureMetro}
                onChange={(e) => {
                  setNotSureMetro(e.target.checked);
                  handleUpdate('metro_km', e.target.checked ? null : 2.0);
                }}
                className="rounded border-slate-300 text-navy-700 focus:ring-navy-700 w-3 h-3"
              />
              <span>Not sure</span>
            </label>
          </div>
          {!notSureMetro ? (
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.5"
                disabled={disabled}
                value={value.metro_km || 2.0}
                onChange={(e) => handleUpdate('metro_km', parseFloat(e.target.value))}
                className="flex-1 accent-navy-700 h-1.5 bg-slate-200 rounded cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-navy-900 w-12 text-right">
                {value.metro_km || 2.0} km
              </span>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">Regional baseline applied (~3.5 km)</p>
          )}
        </div>

        {/* 2. School */}
        <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-saffron-dark" />
              <span>School / College (km)</span>
            </label>
            <label className="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notSureSchool}
                onChange={(e) => {
                  setNotSureSchool(e.target.checked);
                  handleUpdate('school_km', e.target.checked ? null : 1.5);
                }}
                className="rounded border-slate-300 text-navy-700 focus:ring-navy-700 w-3 h-3"
              />
              <span>Not sure</span>
            </label>
          </div>
          {!notSureSchool ? (
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.3"
                max="8.0"
                step="0.2"
                disabled={disabled}
                value={value.school_km || 1.5}
                onChange={(e) => handleUpdate('school_km', parseFloat(e.target.value))}
                className="flex-1 accent-navy-700 h-1.5 bg-slate-200 rounded cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-navy-900 w-12 text-right">
                {value.school_km || 1.5} km
              </span>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">Standard zone baseline applied (~2.0 km)</p>
          )}
        </div>

        {/* 3. Hospital */}
        <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Hospital className="w-3.5 h-3.5 text-govred" />
              <span>Hospital / Healthcare (km)</span>
            </label>
            <label className="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notSureHospital}
                onChange={(e) => {
                  setNotSureHospital(e.target.checked);
                  handleUpdate('hospital_km', e.target.checked ? null : 2.5);
                }}
                className="rounded border-slate-300 text-navy-700 focus:ring-navy-700 w-3 h-3"
              />
              <span>Not sure</span>
            </label>
          </div>
          {!notSureHospital ? (
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.5"
                max="12.0"
                step="0.5"
                disabled={disabled}
                value={value.hospital_km || 2.5}
                onChange={(e) => handleUpdate('hospital_km', parseFloat(e.target.value))}
                className="flex-1 accent-navy-700 h-1.5 bg-slate-200 rounded cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-navy-900 w-12 text-right">
                {value.hospital_km || 2.5} km
              </span>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">District average applied (~3.0 km)</p>
          )}
        </div>

        {/* 4. Retail Market */}
        <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-indiagreen-dark" />
              <span>Market / Commercial (km)</span>
            </label>
            <label className="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notSureMarket}
                onChange={(e) => {
                  setNotSureMarket(e.target.checked);
                  handleUpdate('market_km', e.target.checked ? null : 1.0);
                }}
                className="rounded border-slate-300 text-navy-700 focus:ring-navy-700 w-3 h-3"
              />
              <span>Not sure</span>
            </label>
          </div>
          {!notSureMarket ? (
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.2"
                max="6.0"
                step="0.2"
                disabled={disabled}
                value={value.market_km || 1.0}
                onChange={(e) => handleUpdate('market_km', parseFloat(e.target.value))}
                className="flex-1 accent-navy-700 h-1.5 bg-slate-200 rounded cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-navy-900 w-12 text-right">
                {value.market_km || 1.0} km
              </span>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">Standard municipal access (~1.5 km)</p>
          )}
        </div>
      </div>
    </div>
  );
}
