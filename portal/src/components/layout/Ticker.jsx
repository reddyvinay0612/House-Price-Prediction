import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { Pause, Play, AlertCircle } from 'lucide-react';

/**
 * Official Indian Government Notice Ticker with Pause/Resume control
 */
export function Ticker() {
  const { isTickerPaused, setIsTickerPaused } = useApp();
  const { t } = useTranslation();

  const noticeText = t('ticker.text');

  return (
    <div className="ticker-bar bg-govgrey-200 border-b border-slate-300 text-slate-800 text-xs py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <AlertCircle className="w-3.5 h-3.5 text-navy-700" />
          <span className="font-extrabold uppercase tracking-wider text-navy-700 text-[11px]">
            {t('ticker.notice')}
          </span>
        </div>

        {/* Scrolling or Static Text */}
        <div className="flex-1 overflow-hidden relative">
          <div
            className={`whitespace-nowrap ${
              isTickerPaused ? 'overflow-x-auto' : 'animate-marquee'
            }`}
          >
            <span className="inline-block font-medium text-slate-700 text-xs">
              {noticeText} • RERA Helpline: 1800-11-DHA-GOV • State Housing Authorities Aligned
            </span>
          </div>
        </div>

        {/* Pause / Play Accessible Toggle */}
        <button
          type="button"
          onClick={() => setIsTickerPaused((prev) => !prev)}
          className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-semibold flex-shrink-0 transition cursor-pointer"
          aria-label={isTickerPaused ? t('ticker.resume') : t('ticker.pause')}
        >
          {isTickerPaused ? (
            <>
              <Play className="w-3 h-3 text-indiagreen" />
              <span>{t('ticker.resume')}</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3 text-slate-600" />
              <span>{t('ticker.pause')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Ticker;
