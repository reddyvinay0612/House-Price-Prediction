import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { Stepper } from '../ui/Stepper';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Slider } from '../ui/Slider';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { Spinner } from '../ui/Spinner';
import {
  METRO_CITIES,
  NON_METRO_CITIES,
  NON_METRO_STATES,
  getDistrictsByState,
  INDIAN_CITIES,
  AREA_TYPES,
  AVAILABILITY_OPTIONS,
  INDIAN_MODEL_BENCHMARKS,
} from '../../data/indianData';
import AmenitiesInput from './AmenitiesInput';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Calculator,
  CheckCircle2,
  Building2,
  MapPin,
  Sparkles,
  Train,
  Building,
  Navigation,
  Compass,
  Landmark,
} from 'lucide-react';

// Zod validation schema tailored for Indian housing parameters
const indianEstimateSchema = z.object({
  // Step 1: City & Locality
  city: z.string().min(1, 'Please select a city/district'),
  locality: z.string().min(1, 'Please select a locality/area'),
  area_type: z.string().min(1, 'Please select area type'),
  availability: z.string().min(1, 'Please select construction availability'),

  // Step 2: Dimensions & Configuration
  total_sqft: z
    .number({ invalid_type_error: 'Total area must be a number' })
    .min(300, 'Minimum total area is 300 sq.ft')
    .max(12000, 'Maximum area is 12,000 sq.ft'),
  bhk: z
    .number({ invalid_type_error: 'BHK must be selected' })
    .min(1, 'At least 1 BHK')
    .max(8, 'Maximum 8 BHK'),
  bath: z
    .number({ invalid_type_error: 'Bathrooms must be selected' })
    .min(1, 'At least 1 bathroom')
    .max(8, 'Maximum 8 bathrooms'),
  balcony: z
    .number({ invalid_type_error: 'Balcony count must be a number' })
    .min(0, 'Cannot be negative')
    .max(6, 'Maximum 6 balconies'),

  // Step 3: Model Selection
  model_name: z.string().min(1, 'Please select a machine learning model'),
});

const DEFAULT_VALUES = {
  city: 'bengaluru',
  locality: 'Whitefield',
  area_type: 'Super built-up  Area',
  availability: 'Ready To Move',
  total_sqft: 1250,
  bhk: 2,
  bath: 2,
  balcony: 1,
  model_name: 'Gradient Boosting Regressor',
};

const STEPS = [
  { title: '1. City & Locality' },
  { title: '2. Dimensions & Rooms' },
  { title: '3. Model & Review' },
];

export function EstimateForm({ onSubmit, isLoading, initialValues }) {
  const [currentStep, setCurrentStep] = useState(1);
  const { t } = useTranslation();

  // Determine initial city category and state
  const initialCityId = initialValues?.city || DEFAULT_VALUES.city;
  const initialCityObj = INDIAN_CITIES.find((c) => c.id === initialCityId) || INDIAN_CITIES[0];
  const isInitialNonMetro = NON_METRO_CITIES.some((c) => c.id === initialCityId);

  const [cityCategory, setCityCategory] = useState(isInitialNonMetro ? 'non-metro' : 'metro');
  const [selectedNonMetroState, setSelectedNonMetroState] = useState(
    isInitialNonMetro && initialCityObj ? initialCityObj.state : 'Karnataka'
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(indianEstimateSchema),
    defaultValues: initialValues || DEFAULT_VALUES,
    mode: 'onTouched',
  });

  const formValues = watch();
  const selectedCityId = formValues.city || (cityCategory === 'metro' ? 'bengaluru' : 'mysuru');

  // Selected city object from unified dataset
  const selectedCityData =
    INDIAN_CITIES.find((c) => c.id === selectedCityId) ||
    (cityCategory === 'metro' ? METRO_CITIES[0] : NON_METRO_CITIES[0]);

  // Available districts in the currently selected Non-Metro state
  const districtsInState = useMemo(() => {
    return getDistrictsByState(selectedNonMetroState);
  }, [selectedNonMetroState]);

  // Handle Category Switching between Metro and Non-Metro
  const handleCategorySwitch = (category) => {
    setCityCategory(category);
    if (category === 'metro') {
      const isCurrentInMetro = METRO_CITIES.some((c) => c.id === formValues.city);
      if (!isCurrentInMetro) {
        const defaultMetro = METRO_CITIES[0];
        setValue('city', defaultMetro.id);
        if (defaultMetro.localities && defaultMetro.localities.length > 0) {
          setValue('locality', defaultMetro.localities[0].name);
        }
      }
    } else {
      // Switched to Non-Metro: pick current non-metro state districts
      const stateDistricts = getDistrictsByState(selectedNonMetroState);
      if (stateDistricts.length > 0) {
        const firstDistrict = stateDistricts[0];
        setValue('city', firstDistrict.id);
        if (firstDistrict.localities && firstDistrict.localities.length > 0) {
          setValue('locality', firstDistrict.localities[0].name);
        }
      }
    }
  };

  // Handle State Change in Non-Metro Mode
  const handleStateChange = (stateName) => {
    setSelectedNonMetroState(stateName);
    const districts = getDistrictsByState(stateName);
    if (districts.length > 0) {
      const firstDistrict = districts[0];
      setValue('city', firstDistrict.id);
      if (firstDistrict.localities && firstDistrict.localities.length > 0) {
        setValue('locality', firstDistrict.localities[0].name);
      }
    }
  };

  // Handle District Change in Non-Metro Mode
  const handleDistrictChange = (districtId) => {
    setValue('city', districtId);
    const districtObj = NON_METRO_CITIES.find((c) => c.id === districtId);
    if (districtObj && districtObj.localities && districtObj.localities.length > 0) {
      setValue('locality', districtObj.localities[0].name);
    }
  };

  // If city changes, ensure locality is set to a valid locality of that city
  useEffect(() => {
    if (selectedCityData && selectedCityData.localities && selectedCityData.localities.length > 0) {
      const exists = selectedCityData.localities.some(
        (l) => l.name === formValues.locality
      );
      if (!exists) {
        setValue('locality', selectedCityData.localities[0].name);
      }
    }
  }, [selectedCityId, selectedCityData, setValue, formValues.locality]);

  const [amenities, setAmenities] = useState({
    metro_km: initialValues?.metro_km || null,
    school_km: initialValues?.school_km || null,
    hospital_km: initialValues?.hospital_km || null,
    market_km: initialValues?.market_km || null,
  });

  const handleNext = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = ['city', 'locality', 'area_type', 'availability'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['total_sqft', 'bhk', 'bath', 'balcony'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    setCityCategory('metro');
    setSelectedNonMetroState('Karnataka');
    reset(DEFAULT_VALUES);
    setAmenities({ metro_km: null, school_km: null, hospital_km: null, market_km: null });
    setCurrentStep(1);
  };

  const handleFinalSubmit = (data) => {
    onSubmit({ ...data, ...amenities });
  };

  // Metro City Options (11 Metros)
  const metroCityOptions = METRO_CITIES.map((c) => ({
    value: c.id,
    label: `${c.name} (${c.state}) — Avg ₹${c.avgRateSqft.toLocaleString('en-IN')}/sq.ft`,
  }));

  // Non-Metro State Options
  const stateOptions = NON_METRO_STATES.map((s) => ({
    value: s,
    label: `${s} (${getDistrictsByState(s).length} Districts/Hubs)`,
  }));

  // Non-Metro District Options in the selected State
  const districtOptions = districtsInState.map((d) => ({
    value: d.id,
    label: `${d.name} — Avg ₹${d.avgRateSqft.toLocaleString('en-IN')}/sq.ft`,
  }));

  // Locality Options for Selected City/District
  const localityOptions = (selectedCityData.localities || []).map((l) => ({
    value: l.name,
    label: `${l.name} — ₹${l.avgRate.toLocaleString('en-IN')}/sq.ft (${l.tier})`,
  }));

  const modelOptions = INDIAN_MODEL_BENCHMARKS.map((m) => ({
    value: m.model,
    label: `${m.model} (R² = ${(m.r2 * 100).toFixed(1)}%, RMSE = ₹${m.rmseLakhs} L)${
      m.isChampion ? ' ⭐ [Primary Champion]' : ''
    }`,
  }));

  return (
    <Card
      title="Indian Property Valuation Form (भारतीय आवास मूल्यांकन)"
      subtitle="Enter property parameters according to RERA registration guidelines for an indicative econometric estimate."
      accent="navy"
      className="max-w-4xl mx-auto shadow-sm"
    >
      {/* Stepper Navigation */}
      <Stepper steps={STEPS} currentStep={currentStep} onStepClick={(s) => setCurrentStep(s)} />

      <form onSubmit={handleSubmit(handleFinalSubmit)} className="space-y-6">
        {/* ================= STEP 1: City & Locality ================= */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h4 className="text-xs font-bold text-navy-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-saffron" />
                Step 1: Geographical Location & Property Typology
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">
                {cityCategory === 'metro'
                  ? `${METRO_CITIES.length} Metros Active`
                  : `${NON_METRO_STATES.length} States | ${NON_METRO_CITIES.length} Non-Metro Districts`}
              </span>
            </div>

            {/* 2-Option City Selection Category Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-navy-900">
                Select City Category (शहर श्रेणी चयन करें) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Metro Cities */}
                <button
                  type="button"
                  onClick={() => handleCategorySwitch('metro')}
                  className={`relative p-3.5 rounded-lg border-2 text-left transition flex items-start gap-3 cursor-pointer ${
                    cityCategory === 'metro'
                      ? 'border-navy-700 bg-navy-50/60 ring-1 ring-navy-700 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      cityCategory === 'metro'
                        ? 'bg-navy-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Train className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-navy-900 flex items-center gap-1">
                        🚇 Metro Cities
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          cityCategory === 'metro'
                            ? 'bg-navy-700 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {METRO_CITIES.length} Metros
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                      Cities with active Metro Rail transit systems (Bengaluru, Mumbai MMR, Delhi-NCR, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, etc.)
                    </p>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-indiagreen">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span>Operational Metro Rail Infrastructure</span>
                    </div>
                  </div>
                </button>

                {/* Option 2: Non-Metro Cities */}
                <button
                  type="button"
                  onClick={() => handleCategorySwitch('non-metro')}
                  className={`relative p-3.5 rounded-lg border-2 text-left transition flex items-start gap-3 cursor-pointer ${
                    cityCategory === 'non-metro'
                      ? 'border-navy-700 bg-navy-50/60 ring-1 ring-navy-700 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      cityCategory === 'non-metro'
                        ? 'bg-navy-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Building className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-navy-900 flex items-center gap-1">
                        🏙️ Non-Metro Cities
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          cityCategory === 'non-metro'
                            ? 'bg-navy-700 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {NON_METRO_STATES.length} States / {NON_METRO_CITIES.length} Districts
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                      State-wise Tier-2 & Tier-3 regional districts without metro rail (Mysuru, Coimbatore, Indore, Dehradun, Surat, Patna, Vizag, etc.)
                    </p>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-saffron-dark">
                      <Compass className="w-3 h-3 shrink-0" />
                      <span>Select State &rarr; District &rarr; Locality</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Dynamic Geographical Selection Workflow */}
            {cityCategory === 'metro' ? (
              /* ===== METRO FLOW: City -> Locality ===== */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Metro City Region *"
                  name="city"
                  options={metroCityOptions}
                  error={errors.city?.message}
                  helperText={`Choose from ${METRO_CITIES.length} major Indian metropolitan centers`}
                  {...register('city')}
                />

                <Select
                  label={`Locality / Sector in ${selectedCityData.name} *`}
                  name="locality"
                  options={localityOptions}
                  error={errors.locality?.message}
                  helperText={`Showing all ${localityOptions.length} micro-markets in ${selectedCityData.name}`}
                  {...register('locality')}
                />
              </div>
            ) : (
              /* ===== NON-METRO FLOW: State -> District -> Locality ===== */
              <div className="space-y-4 bg-slate-50/70 p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between text-xs font-semibold text-navy-900 border-b border-slate-200 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-saffron" />
                    Non-Metro Regional Hierarchy (राज्य &rarr; ज़िला &rarr; इलाका)
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Step-by-step cascading geographical filter
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Step A: State Selection */}
                  <div>
                    <label className="block text-xs font-bold text-navy-900 mb-1">
                      1. Select State (राज्य) *
                    </label>
                    <select
                      value={selectedNonMetroState}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-navy-700"
                    >
                      {stateOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Select Indian State / UT
                    </span>
                  </div>

                  {/* Step B: District / City Selection */}
                  <div>
                    <label className="block text-xs font-bold text-navy-900 mb-1">
                      2. Select District / City (ज़िला / शहर) *
                    </label>
                    <select
                      value={selectedCityId}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-navy-700 font-medium text-navy-900"
                    >
                      {districtOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      {districtOptions.length} Districts in {selectedNonMetroState}
                    </span>
                  </div>

                  {/* Step C: Locality / Area Selection */}
                  <div>
                    <label className="block text-xs font-bold text-navy-900 mb-1">
                      3. Select Area / Locality (इलाका) *
                    </label>
                    <select
                      value={formValues.locality || ''}
                      onChange={(e) => setValue('locality', e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-navy-700"
                    >
                      {localityOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      {localityOptions.length} Micro-markets in {selectedCityData.name}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Area Type & Construction Availability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Area Type Specification *"
                name="area_type"
                options={AREA_TYPES}
                error={errors.area_type?.message}
                helperText="Carpet area provides the highest valuation density under RERA"
                {...register('area_type')}
              />

              <Select
                label="Construction & Possession Status *"
                name="availability"
                options={AVAILABILITY_OPTIONS}
                error={errors.availability?.message}
                helperText="Ready properties carry zero construction delay execution risk"
                {...register('availability')}
              />
            </div>

            {/* Selected Micro-Market Benchmark Card */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-navy-100 text-navy-800 rounded">
                  {selectedCityData.hasMetro ? (
                    <Train className="w-4 h-4" />
                  ) : (
                    <Building2 className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-navy-900 text-xs">
                    {selectedCityData.name}, {selectedCityData.state}
                    <span
                      className={`ml-2 text-[10px] px-2 py-0.2 rounded font-semibold ${
                        selectedCityData.hasMetro
                          ? 'bg-indiagreen-light/20 text-indiagreen-dark border border-indiagreen/30'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {selectedCityData.hasMetro ? '🚇 Metro Rail Active' : '🏙️ Non-Metro Regional Hub (No Metro)'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Micro-Market Benchmark: <strong className="text-navy-900 font-mono">₹{selectedCityData.avgRateSqft.toLocaleString('en-IN')}/sq.ft</strong> | Annual Growth: <span className="text-indiagreen font-semibold">{selectedCityData.baseGrowth}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Localities Loaded</span>
                <span className="text-xs font-mono font-bold text-navy-900">
                  {selectedCityData.localities.length} Verified Micro-Markets
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: Dimensions & Configuration ================= */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h4 className="text-xs font-bold text-navy-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-saffron" />
                Step 2: Area Dimensions, Rooms & Sanity Specifications
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">Sq.Ft & Room Matrix</span>
            </div>

            <div className="space-y-4">
              <Controller
                name="total_sqft"
                control={control}
                render={({ field }) => (
                  <Slider
                    label="Total Area (Square Feet) *"
                    min={400}
                    max={6000}
                    step={25}
                    unit="sq.ft"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.total_sqft?.message}
                    helperText="Total covered spatial area. Typical 2BHK: 950-1350 sq.ft, 3BHK: 1400-2200 sq.ft."
                    displayFormat={(v) => `${Number(v).toLocaleString('en-IN')} sq.ft`}
                  />
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Controller
                  name="bhk"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Bedrooms (BHK) *"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      options={[
                        { value: 1, label: '1 BHK' },
                        { value: 2, label: '2 BHK' },
                        { value: 3, label: '3 BHK' },
                        { value: 4, label: '4 BHK' },
                        { value: 5, label: '5+ BHK' },
                      ]}
                      error={errors.bhk?.message}
                      helperText="Apartment configuration"
                    />
                  )}
                />

                <Controller
                  name="bath"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Bathrooms *"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      options={[
                        { value: 1, label: '1 Bathroom' },
                        { value: 2, label: '2 Bathrooms' },
                        { value: 3, label: '3 Bathrooms' },
                        { value: 4, label: '4 Bathrooms' },
                        { value: 5, label: '5+ Bathrooms' },
                      ]}
                      error={errors.bath?.message}
                      helperText="En-suite & common bathrooms"
                    />
                  )}
                />

                <Controller
                  name="balcony"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Balconies *"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      options={[
                        { value: 0, label: 'No Balcony' },
                        { value: 1, label: '1 Balcony' },
                        { value: 2, label: '2 Balconies' },
                        { value: 3, label: '3 Balconies' },
                        { value: 4, label: '4+ Balconies' },
                      ]}
                      error={errors.balcony?.message}
                      helperText="Attached outdoor sit-out space"
                    />
                  )}
                />
              </div>
            </div>

            {/* M8: Nearby Amenities Factor */}
            <AmenitiesInput value={amenities} onChange={setAmenities} />

            <Alert type="info" title="RERA Area Sanity Rule">
              Under Indian housing data validation rules, properties with less than 300 sq.ft per BHK or bathroom count exceeding BHK + 2 are automatically flagged during econometric training.
            </Alert>
          </div>
        )}

        {/* ================= STEP 3: Model Selection & Review ================= */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h4 className="text-xs font-bold text-navy-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-saffron" />
                Step 3: Model Selection & Submission Review
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">Review & Confirm</span>
            </div>

            <Select
              label="Select Machine Learning Inference Engine *"
              name="model_name"
              options={modelOptions}
              error={errors.model_name?.message}
              helperText="Gradient Boosting Regressor is the primary champion model (R² = 97.13%, RMSE = ₹10.74 Lakhs)"
              {...register('model_name')}
            />

            {/* Verification Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <h5 className="font-bold text-slate-800 text-sm border-b pb-1">
                  Location & Typology Summary
                </h5>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">City Classification:</span>
                  <span
                    className={`font-semibold px-2 py-0.2 rounded text-[11px] ${
                      selectedCityData.hasMetro
                        ? 'bg-navy-100 text-navy-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {selectedCityData.hasMetro ? '🚇 Metro City (Metro Rail)' : '🏙️ Non-Metro City (No Metro)'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">State / Region:</span>
                  <b className="text-slate-900">{selectedCityData.state}</b>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">District / City:</span>
                  <b className="text-slate-900">{selectedCityData.name}</b>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Locality / Area:</span>
                  <b className="text-slate-900">{formValues.locality}</b>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Area Type:</span>
                  <b className="text-slate-900">{formValues.area_type?.split(' ')[0]} Area</b>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Possession:</span>
                  <b className="text-slate-900">{formValues.availability}</b>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <h5 className="font-bold text-slate-800 text-sm border-b pb-1">
                  Dimensions & Configuration
                </h5>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Total Area:</span>
                  <b className="text-slate-900">{Number(formValues.total_sqft).toLocaleString('en-IN')} sq.ft</b>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">BHK / Bedrooms:</span>
                  <b className="text-slate-900">{formValues.bhk} BHK</b>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Bathrooms & Balconies:</span>
                  <b className="text-slate-900">{formValues.bath} Bath / {formValues.balcony} Balcony</b>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Target Currency:</span>
                  <b className="text-indiagreen">Indian Rupees (₹ Lakhs/Crores)</b>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Action Controls */}
        <div className="pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            {currentStep > 1 && (
              <Button type="button" variant="secondary" size="sm" onClick={handlePrev}>
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back
              </Button>
            )}
            <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Form
            </Button>
          </div>

          <div>
            {currentStep < 3 ? (
              <Button type="button" variant="primary" size="md" onClick={handleNext}>
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="bg-indiagreen hover:bg-indiagreen-dark border-indiagreen-dark text-white font-bold"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <Spinner size="sm" className="border-white" />
                    <span>Calculating Indian Housing Valuation...</span>
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Calculator className="w-4 h-4 mr-2" />
                    Execute Property Price Estimation (₹)
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Card>
  );
}

export default EstimateForm;
