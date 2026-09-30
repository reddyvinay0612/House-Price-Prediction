import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle,
  HelpCircle,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * M12: 6-Step Guided 'Demo Tour' Walkthrough for Judges & Evaluators
 * Interactive tour through the 6 core pillars of Bharat House Price Estimator:
 * 1. Login & Gateway
 * 2. Econometric Estimator
 * 3. Why This Price (SHAP Explainability)
 * 4. What-If Sensitivity Simulator
 * 5. India Map GIS Dashboard
 * 6. Financial Feasibility & EMI Calculator
 */
const TOUR_STEPS = [
  {
    step: 1,
    title: '1. Government Authentication Gateway',
    route: '/login',
    description:
      'Full-screen citizen gateway featuring automated background slideshow, dual Password/OTP authentication, accessible CAPTCHA, and demo auto-fill.',
  },
  {
    step: 2,
    title: '2. Certified Econometric Estimator',
    route: '/estimate',
    description:
      'Calculates property prices powered by a 5-fold cross-validated Gradient Boosting champion model with 98.94% R² accuracy and ±7% confidence bounds.',
  },
  {
    step: 3,
    title: '3. Explainable AI: "Why This Price?"',
    route: '/estimate',
    description:
      'SHAP decomposition horizontal bar chart showing top 8 value drivers with simple citizen sentences and raw econometric expert views.',
  },
  {
    step: 4,
    title: '4. What-If Sensitivity Simulator',
    route: '/whatif',
    description:
      'Real-time 300ms debounced sliders simulating area expansions, bathrooms, covered parking, and construction quality with step-by-step waterfall charts.',
  },
  {
    step: 5,
    title: '5. India Housing Map GIS Dashboard',
    route: '/map',
    description:
      'Pan-India interactive choropleth map with metric toggles (Rate/sqft, YoY Growth, 0-100 Investment Scores) and state district drill-downs.',
  },
  {
    step: 6,
    title: '6. EMI & Buy-vs-Rent Wealth Engine',
    route: '/finance',
    description:
      'Complete home loan financing breakdown with reducing balance amortization schedules and 10-year equity accumulation crossover charts.',
  },
];

export default function DemoTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const navigate = useNavigate();

  const currentStep = TOUR_STEPS[currentStepIndex];

  const handleStartTour = () => {
    setIsOpen(true);
    setCurrentStepIndex(0);
    navigate(TOUR_STEPS[0].route);
  };

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      navigate(TOUR_STEPS[nextIdx].route);
    } else {
      // Completed Tour
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      setIsOpen(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      navigate(TOUR_STEPS[prevIdx].route);
    }
  };

  return (
    <>
      {/* Floating Demo Tour Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleStartTour}
          className="fixed bottom-20 left-4 z-40 bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black text-xs px-3.5 py-2 rounded-full shadow-xl border border-white/40 flex items-center gap-2 hover:scale-105 transition-all duration-200"
          title="Start 6-Step Guided Judge Tour"
        >
          <Compass className="w-4 h-4 animate-spin text-navy-950" style={{ animationDuration: '6s' }} />
          <span>Judges Demo Tour (M12)</span>
        </button>
      )}

      {/* Tour Modal Overlay */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 max-w-md w-full bg-navy-950 text-white rounded-xl shadow-2xl border-2 border-saffron p-5 space-y-3 animate-slideUp backdrop-blur-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-saffron text-navy-950 font-extrabold uppercase px-2 py-0.5 rounded">
                Step {currentStep.step} of {TOUR_STEPS.length}
              </span>
              <span className="text-xs font-bold text-slate-200">Guided Walkthrough</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded"
              aria-label="Close Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <h4 className="text-base font-extrabold text-white">{currentStep.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{currentStep.description}</p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-3 py-1.5 rounded text-xs font-semibold bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentStepIndex ? 'w-4 bg-saffron' : 'w-1.5 bg-white/30'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-1.5 rounded text-xs font-bold bg-saffron hover:bg-saffron-light text-navy-950 shadow-sm flex items-center gap-1"
            >
              <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour 🎉' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
