import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { Globe, Eye, Volume2, Flag } from 'lucide-react';

/**
 * Top Government Utility Bar adhering to GIGW guidelines
 */
export function UtilityBar() {
  const { fontSize, setFontSize, highContrast, toggleHighContrast, language, setLanguage } = useApp();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <aside
      aria-label="Accessibility and Language Settings"
      className="bg-navy-950 text-slate-200 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-navy-800"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left Side: National Demo Portal Indicator */}
        <div className="flex items-center space-x-2 font-medium">
          <div className="w-2.5 h-2.5 rounded-full bg-saffron inline-block ring-1 ring-white/50" />
          <span className="font-bold tracking-wide text-[11px] sm:text-xs">
            {t('utility.govOfIndia')}
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300 text-[11px]">
            {t('utility.officialService')}
          </span>
        </div>

        {/* Right Side: Accessibility Controls & Language */}
        <div className="flex items-center space-x-4 text-xs font-sans">
          {/* Skip Navigation Anchor */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:inline-block px-2 py-0.5 bg-saffron text-slate-950 font-bold rounded"
          >
            {t('utility.skipLink')}
          </a>

          {/* Screen Reader Access */}
          <a
            href="#accessibility"
            className="hidden sm:flex items-center space-x-1 text-slate-300 hover:text-white transition"
            title="Screen Reader Access Information"
          >
            <Volume2 className="w-3.5 h-3.5 text-saffron" />
            <span className="text-[11px]">{t('utility.screenReader')}</span>
          </a>

          {/* Font Resizing Controls (A- A A+) */}
          <div className="flex items-center space-x-1 bg-navy-900 border border-navy-800 rounded px-1 py-0.5" role="group" aria-label="Text Size Controls">
            <button
              type="button"
              onClick={() => setFontSize('small')}
              className={`px-1.5 py-0.5 rounded font-bold text-[11px] transition ${
                fontSize === 'small' ? 'bg-saffron text-slate-950' : 'hover:bg-navy-800 text-slate-300'
              }`}
              title="Decrease text size"
              aria-label="Small text size"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-1.5 py-0.5 rounded font-bold text-[11px] transition ${
                fontSize === 'normal' ? 'bg-saffron text-slate-950' : 'hover:bg-navy-800 text-slate-300'
              }`}
              title="Standard text size"
              aria-label="Standard text size"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`px-1.5 py-0.5 rounded font-bold text-[11px] transition ${
                fontSize === 'large' ? 'bg-saffron text-slate-950' : 'hover:bg-navy-800 text-slate-300'
              }`}
              title="Increase text size"
              aria-label="Large text size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            type="button"
            onClick={toggleHighContrast}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded transition ${
              highContrast ? 'bg-saffron text-slate-950 font-bold' : 'hover:bg-navy-800 text-slate-300'
            }`}
            aria-pressed={highContrast}
            title="Toggle High Contrast View"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">{highContrast ? t('utility.standardView') : t('utility.highContrast')}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center space-x-1">
            <Globe className="w-3.5 h-3.5 text-saffron" />
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-navy-900 text-slate-100 text-xs rounded border border-navy-700 px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-saffron cursor-pointer"
              aria-label="Select portal language"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default UtilityBar;
