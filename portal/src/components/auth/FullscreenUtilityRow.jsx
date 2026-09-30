import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  Eye,
  Globe,
  X,
  Home,
  Calculator,
  LineChart,
  Building2,
  FileText,
  Phone,
  UserPlus,
  Shield,
  Sparkles,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function FullscreenUtilityRow() {
  const { fontSize, setFontSize, highContrast, toggleHighContrast, language, setLanguage } = useApp();
  const { t, i18n } = useTranslation();

  const [showA11yMenu, setShowA11yMenu] = useState(false);
  const [showSlideMenu, setShowSlideMenu] = useState(false);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const currentDateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const menuLinks = [
    { to: '/', label: t('nav.home', 'Portal Home'), icon: Home },
    { to: '/estimate', label: t('nav.estimate', 'AI Price Estimator'), icon: Calculator },
    { to: '/india-map', label: '36 States Heatmap', icon: MapPin },
    { to: '/forecast', label: '5-Year Forecast', icon: TrendingUp },
    { to: '/compare', label: 'All-India Compare', icon: Building2 },
    { to: '/insights', label: t('nav.insights', 'Market Analytics'), icon: LineChart },
    { to: '/faq', label: t('nav.faq', 'FAQs & Griha Mitra'), icon: FileText },
    { to: '/officer', label: 'Officer Dashboard', icon: Shield },
    { to: '/contact', label: t('nav.contact', 'Official Contact'), icon: Phone },
    { to: '/register', label: 'New Citizen Registration', icon: UserPlus, highlight: true },
  ];

  return (
    <>
      <header className="w-full px-4 sm:px-8 py-3 flex items-center justify-between text-white/90 text-xs z-30 font-sans backdrop-blur-xs">
        {/* Left: National Identification Indicator */}
        <div className="flex items-center space-x-2.5 font-medium drop-shadow-sm">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/60 border border-amber-400/30 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-saffron inline-block ring-2 ring-amber-400/40 animate-pulse" />
            <span className="font-bold tracking-wider text-[10px] sm:text-[11px] text-amber-300 uppercase">
              GOVERNMENT OF INDIA • DEMO PORTAL
            </span>
          </div>
        </div>

        {/* Right: Utility Icons Row */}
        <div className="flex items-center space-x-2 sm:space-x-3.5">
          {/* Skip Link */}
          <a
            href="#login-card"
            className="sr-only focus:not-sr-only focus:inline-block px-2.5 py-1 bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-lg z-50 ring-2 ring-white"
          >
            Skip to main content
          </a>

          {/* Calendar Display */}
          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-950/50 border border-white/10 backdrop-blur-md text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[11px] font-semibold">{currentDateStr}</span>
          </div>

          <span className="text-white/20 hidden sm:inline">|</span>

          {/* Accessibility Controls Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowA11yMenu(!showA11yMenu)}
              title="Accessibility Options (Text Size & High Contrast)"
              aria-label="Accessibility Options"
              className="px-2.5 py-1 rounded-full bg-slate-950/50 hover:bg-slate-900 border border-white/15 text-slate-200 hover:text-white transition flex items-center gap-1.5 backdrop-blur-md shadow-xs"
            >
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[11px] hidden sm:inline font-bold">A11y</span>
            </button>

            {showA11yMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-950/95 text-white border border-amber-400/30 rounded-xl p-3.5 shadow-2xl backdrop-blur-xl space-y-3 z-40 animate-fadeIn ring-1 ring-white/10">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-amber-300" />
                    <span>Accessibility (A11y)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowA11yMenu(false)}
                    className="text-slate-400 hover:text-white p-0.5 rounded transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Font Size Scaling */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider font-bold block">
                    Text Scaling
                  </span>
                  <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-lg border border-white/10">
                    <button
                      type="button"
                      onClick={() => setFontSize('small')}
                      className={`flex-1 py-1 rounded text-xs font-bold transition ${
                        fontSize === 'small' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      A-
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize('normal')}
                      className={`flex-1 py-1 rounded text-xs font-bold transition ${
                        fontSize === 'normal' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      A
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize('large')}
                      className={`flex-1 py-1 rounded text-xs font-bold transition ${
                        fontSize === 'large' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      A+
                    </button>
                  </div>
                </div>

                {/* High Contrast */}
                <button
                  type="button"
                  onClick={toggleHighContrast}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-left flex items-center justify-between transition"
                >
                  <span>High Contrast Mode</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${highContrast ? 'bg-amber-400 text-slate-950' : 'bg-white/20 text-slate-300'}`}>
                    {highContrast ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Language Selector Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-950/50 border border-white/15 rounded-full px-2.5 py-1 backdrop-blur-md">
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <select
              value={language}
              onChange={handleLanguageChange}
              aria-label="Select Language"
              className="bg-transparent text-white text-[11px] font-bold border-none focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className="text-slate-900 bg-white">English</option>
              <option value="hi" className="text-slate-900 bg-white">हिन्दी (Hindi)</option>
              <option value="kn" className="text-slate-900 bg-white">ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>

          <span className="text-white/20">|</span>

          {/* Tricolour Hamburger Button */}
          <button
            type="button"
            onClick={() => setShowSlideMenu(true)}
            aria-label="Open portal navigation menu"
            title="Open portal navigation menu"
            className="p-2 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-white/20 transition flex flex-col justify-center items-center gap-[3.5px] w-8 h-8 shadow-sm group"
          >
            {/* 3 distinct colored lines */}
            <span className="w-4 h-[2.5px] bg-[#ff9933] rounded-full group-hover:w-4.5 transition-all" />
            <span className="w-4 h-[2.5px] bg-[#ffffff] rounded-full group-hover:w-4.5 transition-all" />
            <span className="w-4 h-[2.5px] bg-[#138808] rounded-full group-hover:w-4.5 transition-all" />
          </button>
        </div>
      </header>

      {/* Slide-In Navigation Drawer */}
      {showSlideMenu && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-80 max-w-full h-full bg-slate-950 text-white border-l border-white/20 shadow-2xl p-5 flex flex-col justify-between animate-slideLeft backdrop-blur-2xl">
            <div className="space-y-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-navy-950 border border-amber-400 flex items-center justify-center text-amber-300 shadow-sm">
                    <Shield className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <span className="font-black text-xs uppercase tracking-wider text-amber-300 block">
                      Portal Directory
                    </span>
                    <span className="text-[10px] text-slate-400">housing.demo.in</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSlideMenu(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1 overflow-y-auto max-h-[70vh] pr-1">
                {menuLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setShowSlideMenu(false)}
                      className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition duration-150 ${
                        item.highlight
                          ? 'bg-gradient-to-r from-amber-500 to-saffron text-slate-950 shadow-md hover:from-amber-400 hover:to-amber-500'
                          : 'hover:bg-white/10 text-slate-200 hover:text-white border border-transparent hover:border-white/10'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${item.highlight ? 'text-slate-950' : 'text-amber-300'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-white/10 pt-3 text-[10px] text-slate-400 space-y-0.5">
              <p className="font-bold text-amber-300">Directorate of Housing Analytics</p>
              <p>Ministry of Housing & Urban Affairs (Demo Service)</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FullscreenUtilityRow;
