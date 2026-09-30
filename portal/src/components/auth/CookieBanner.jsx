import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

const STORAGE_KEY = 'bharat_portal_cookies_accepted';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(STORAGE_KEY);
      if (!accepted) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie Consent Banner"
      className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-300 shadow-2xl p-3 sm:py-3.5 sm:px-6 animate-slideUp font-sans"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-indiagreen flex-shrink-0" />
          <p className="leading-snug">
            This website uses cookies to ensure secure citizen authentication, store session preferences, and analyze anonymized econometric traffic. By continuing, you agree to our Website Policies and Disclaimer Terms.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={handleDecline}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded hover:bg-slate-50 transition"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="px-4 py-1.5 text-xs font-bold bg-navy-800 hover:bg-navy-900 text-white rounded transition shadow-sm"
          >
            Accept All
          </button>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss cookie banner"
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default CookieBanner;
