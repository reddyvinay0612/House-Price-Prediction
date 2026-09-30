import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, Clock, HelpCircle, AlertCircle, Sparkles, Building2 } from 'lucide-react';
import EstimateForm from '../components/estimate/EstimateForm';
import ResultPanel from '../components/estimate/ResultPanel';
import RecentEstimates from '../components/estimate/RecentEstimates';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import { useAppContext } from '../context/AppContext';
import { predictPrice } from '../services/api';

export default function Estimate() {
  const { currentEstimate, addEstimate, restoreEstimate } = useAppContext();
  const { t } = useTranslation();
  const [formInitialValues, setFormInitialValues] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastInputs, setLastInputs] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const formRef = useRef(null);
  const resultRef = useRef(null);

  const handleCalculate = async (formData) => {
    setIsLoading(true);
    setErrorMsg(null);
    setLastInputs(formData);

    try {
      const response = await predictPrice(formData);
      const enrichedEstimate = {
        ...response,
        inputs: formData,
        city: formData.city,
        locality: formData.locality,
        total_sqft: formData.total_sqft,
        bhk: formData.bhk,
        bath: formData.bath,
        balcony: formData.balcony,
        area_type: formData.area_type,
        availability: formData.availability,
        model_name: formData.model_name,
      };

      addEstimate(enrichedEstimate);

      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error('Valuation calculation failed:', err);
      setErrorMsg('An unexpected error occurred during valuation calculation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (item) => {
    restoreEstimate(item);
    if (item.inputs) {
      setFormInitialValues({ ...item.inputs });
    }
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRecalculate = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8" ref={formRef}>
      {/* Page Header */}
      <div className="border-b-2 border-navy-700 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-saffron-dark bg-amber-50 border border-amber-200 px-2.5 py-0.5 inline-block rounded mb-1">
              National Econometric Real Estate Valuation Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 font-sans">
              {t('estimate.title')} (आवास मूल्य अनुमान)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Official Machine Learning Model Inference Service for Indian Residential Properties
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded">
              <span className="w-2 h-2 rounded-full bg-indiagreen mr-1.5 animate-pulse" />
              Model Active (GBR v2.4 India)
            </span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <Alert type="error" title="Estimation Service Alert">
          {errorMsg}
        </Alert>
      )}

      {/* Main Grid: Form / Results on left, History & Guidance on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Result */}
        <div className="lg:col-span-8 space-y-8">
          {/* Estimate Form Wizard */}
          <EstimateForm
            key={formInitialValues ? JSON.stringify(formInitialValues) : 'default-form'}
            initialValues={formInitialValues}
            onSubmit={handleCalculate}
            isLoading={isLoading}
          />

          {/* Results Panel (renders when currentEstimate is available) */}
          {currentEstimate && (
            <div ref={resultRef}>
              <ResultPanel
                result={currentEstimate}
                propertyInput={currentEstimate.inputs || lastInputs}
                onRecalculate={handleRecalculate}
              />
            </div>
          )}
        </div>

        {/* Right Column: History & Information Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Estimates Card */}
          <RecentEstimates onSelectEstimate={handleSelectHistory} />

          {/* Guidance / FAQ Card */}
          <Card
            title="Valuation Guidance & RERA Rules"
            headerAction={
              <HelpCircle className="w-4 h-4 text-navy-700" />
            }
          >
            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <span className="font-semibold text-navy-900">Area Type Standard:</span>
                <p className="text-slate-600 mt-0.5">
                  Under RERA guidelines, Carpet Area is the mandatory consumer standard. Super Built-up area includes loading (usually 20% to 30%).
                </p>
              </div>

              <div className="border-t border-slate-100 pt-2">
                <span className="font-semibold text-navy-900">Possession & Risk:</span>
                <p className="text-slate-600 mt-0.5">
                  Ready to move units trade at a 4-8% premium due to immediate rental yield and zero construction completion risk.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-2">
                <span className="font-semibold text-navy-900">Confidence Intervals:</span>
                <p className="text-slate-600 mt-0.5">
                  The model outputs a 90% confidence range (±6.5%) derived from cross-validation error residuals across 13,320+ registry transactions.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-2 bg-slate-50 p-2.5 rounded">
                <span className="font-semibold text-navy-900">Data Privacy Assurance:</span>
                <p className="text-slate-500 mt-0.5">
                  No personal ownership records or citizen identity information is stored or transmitted to remote servers.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
