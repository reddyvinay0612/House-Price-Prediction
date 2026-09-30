import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Calculator,
  BarChart3,
  TrendingUp,
  Building2,
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  MapPin,
  Sparkles,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

import {
  METRO_CITIES,
  NON_METRO_CITIES,
  INDIAN_CITIES,
} from '../data/indianData';

export default function Home() {
  const { t } = useTranslation();

  const keyStats = [
    {
      label: 'Cities Covered',
      value: `${INDIAN_CITIES.length} Cities`,
      detail: `${METRO_CITIES.length} Metros + ${NON_METRO_CITIES.length} Non-Metro Hubs`,
      icon: Building2,
    },
    {
      label: t('home.statLocalities'),
      value: '350+',
      detail: 'Verified residential micro-markets',
      icon: MapPin,
    },
    {
      label: t('home.statModels'),
      value: '5 Models',
      detail: 'GBR, XGBoost, RF, Ridge, Linear',
      icon: Database,
    },
    {
      label: t('home.statAccuracy'),
      value: '97.13%',
      detail: 'Champion Gradient Boosting Regressor',
      icon: Award,
    },
  ];

  const serviceCards = [
    {
      title: 'Automated Property Price Estimator',
      badge: 'Public Service',
      description:
        'Input property parameters (City, Locality, Area in sq.ft, BHK, Bathrooms, Possession Status) to generate an instant econometric price estimate in ₹ Lakhs & Crores with a 90% confidence interval.',
      icon: Calculator,
      linkText: 'Launch Estimator',
      linkTo: '/estimate',
      primary: true,
    },
    {
      title: 'Indian Metro City Trends',
      badge: 'Market Analytics',
      description:
        'Compare average price per square foot and annual capital appreciation across 7 major Indian metropolitan housing markets.',
      icon: Building2,
      linkText: 'Explore City Trends',
      linkTo: '/city-trends',
      primary: false,
    },
    {
      title: 'National Market Insights & Benchmarks',
      badge: 'Locality Registry',
      description:
        'Search across 780+ Indian revenue districts and 4,500+ verified residential micro-markets with historical average price per sq.ft and annual growth rates.',
      icon: TrendingUp,
      linkText: 'Explore Market Insights',
      linkTo: '/insights',
      primary: false,
    },
  ];

  const pipelineSteps = [
    {
      step: '01',
      title: 'Property Specifications',
      desc: 'Citizen inputs city, micro-market locality, covered area (sq.ft), BHK layout, and possession status.',
    },
    {
      step: '02',
      title: 'RERA-Aligned Pipeline',
      desc: 'Automatic square footage range averaging, outlier filtration (<300 sq.ft/BHK), and spatial rate indexing.',
    },
    {
      step: '03',
      title: 'Ensemble ML Inference',
      desc: 'Champion Gradient Boosted Regressor (1,200 estimators) computes the log-price valuation in Indian Rupees.',
    },
    {
      step: '04',
      title: 'Valuation & PDF Certificate',
      desc: 'Produces ₹ Lakh/Crore valuation, stamp duty range, 20-year EMI breakdown, and downloadable PDF certificate.',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Official Indian Government Hero Banner */}
      <section className="relative bg-gradient-to-r from-navy-800 to-navy-950 text-white border-b-4 border-saffron -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 lg:py-16 shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-1 uppercase tracking-wider rounded">
              <ShieldCheck className="w-4 h-4 text-saffron" />
              {t('home.heroBadge')}
            </div>

            <div className="space-y-1">
              <span className="text-sm sm:text-base font-semibold text-saffron block">
                भारत आवास मूल्य अनुमानक
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-sans">
                {t('home.heroTitle')}
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
              {t('home.heroSubtitle')}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/estimate">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-indiagreen hover:bg-indiagreen-dark border-indiagreen-dark text-white font-bold shadow-lg"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  {t('home.ctaEstimate')}
                </Button>
              </Link>
              <Link to="/city-trends">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                >
                  <Building2 className="w-4 h-4 mr-2 text-saffron" />
                  Metro City Trends
                </Button>
              </Link>
            </div>
          </div>

          {/* Model Status Badge Card */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-sm p-5 sm:p-6 border border-white/20 text-white space-y-3.5 rounded shadow-xl">
            <div className="flex items-center gap-2 text-saffron font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Active Valuation Engine
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between pb-1.5 border-b border-white/15">
                <span className="text-slate-300">Base Dataset:</span>
                <span className="font-semibold text-white">Bengaluru & 7 Metros</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-white/15">
                <span className="text-slate-300">Champion Model:</span>
                <span className="font-semibold text-white">Gradient Boosting (GBR)</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-white/15">
                <span className="text-slate-300">Peak R² Accuracy:</span>
                <span className="font-mono font-bold text-saffron">0.9382 (93.8%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Target Standard:</span>
                <span className="font-semibold text-indiagreen-light">Indian Rupees (₹ Lakhs)</span>
              </div>
            </div>
            <div className="pt-1 border-t border-white/10">
              <Link
                to="/estimate"
                className="text-xs text-saffron hover:underline font-semibold flex items-center gap-1"
              >
                Estimate your property value now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 KPI Stats Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border-t-4 border-t-navy-700 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-extrabold font-mono text-navy-900 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">{stat.detail}</p>
                </div>
                <div className="p-2 bg-slate-100 text-navy-700 rounded">
                  <Icon className="w-5 h-5 text-navy-700" />
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Core Services Section */}
      <section className="space-y-4">
        <div className="border-b-2 border-navy-700 pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-900">
              {t('home.coreServicesTitle')}
            </h2>
            <p className="text-xs text-slate-600">
              Official econometric property valuation and market transparency tools
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">Service Suite v2.6 (India)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {serviceCards.map((service, idx) => {
            const Icon = service.icon;
            return (
              <Card
                key={idx}
                className={`flex flex-col justify-between border-2 transition-all duration-200 hover:-translate-y-0.5 ${
                  service.primary
                    ? 'border-navy-700 bg-slate-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-navy-700/50'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                      {service.badge}
                    </span>
                    <div className="p-2 bg-navy-700 text-white rounded">
                      <Icon className="w-5 h-5 text-saffron" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-navy-900">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-200">
                  <Link to={service.linkTo} className="block">
                    <Button
                      variant={service.primary ? 'primary' : 'outline'}
                      className={`w-full justify-between text-xs ${
                        service.primary
                          ? 'bg-navy-700 hover:bg-navy-800 text-white'
                          : 'border-navy-700 text-navy-700'
                      }`}
                      size="sm"
                    >
                      <span>{service.linkText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="bg-slate-100 border border-slate-300 p-6 sm:p-8 space-y-6 rounded">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-navy-700 bg-white border border-slate-300 px-3 py-1 inline-block rounded">
            Standard Valuation Procedure (मानक प्रक्रिया)
          </span>
          <h2 className="text-2xl font-bold text-navy-900">
            {t('home.processTitle')}
          </h2>
          <p className="text-xs text-slate-600">
            From raw real estate parameters to an econometric market estimate in four validated stages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pipelineSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-5 border border-slate-300 space-y-2 relative rounded shadow-sm"
            >
              <div className="text-2xl font-bold font-mono text-saffron-dark">
                {step.step}
              </div>
              <h4 className="text-sm font-bold text-navy-900">
                {step.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link to="/estimate">
            <Button
              variant="primary"
              size="md"
              className="bg-indiagreen hover:bg-indiagreen-dark border-indiagreen-dark text-white font-bold"
            >
              <Calculator className="w-4 h-4 mr-2" />
              {t('home.ctaEstimate')}
            </Button>
          </Link>
        </div>
      </section>

      {/* RERA Compliance Advisory Notice */}
      <section>
        <Alert
          type="warning"
          title={t('home.reraNoticeTitle')}
          content="This portal is a demonstration system calibrated against Indian real estate transaction data (Bengaluru 13,320 records + Multi-City metros). Estimates are indicative and do not constitute a legal valuation. Always verify developer RERA registration on your state RERA portal (e.g., K-RERA, MahaRERA, UP-RERA) before buying."
        />
      </section>
    </div>
  );
}
