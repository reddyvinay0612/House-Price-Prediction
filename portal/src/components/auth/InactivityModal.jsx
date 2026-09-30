import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Clock, LogOut, ShieldAlert } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Accessible Inactivity Warning Modal (Appears 1 minute before 15-min auto-logout)
 */
export function InactivityModal({
  isOpen,
  remainingSeconds = 60,
  onStayLoggedIn,
  onLogout,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="inactivity-title"
      aria-describedby="inactivity-desc"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white rounded-lg border-2 border-saffron shadow-2xl max-w-md w-full p-6 space-y-4 text-slate-800 focus:outline-none"
      >
        {/* Header Icon */}
        <div className="flex items-center space-x-3 text-saffron-dark">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-full">
            <Clock className="w-7 h-7 text-saffron" />
          </div>
          <div>
            <h3 id="inactivity-title" className="text-lg font-extrabold text-navy-900 font-sans">
              Session Inactivity Alert
            </h3>
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Directorate of Housing Analytics Security
            </span>
          </div>
        </div>

        {/* Message */}
        <div id="inactivity-desc" className="text-xs text-slate-700 space-y-2 leading-relaxed">
          <p>
            For your security and to safeguard citizen property queries, your active session will expire automatically due to <strong>15 minutes of inactivity</strong>.
          </p>
          <div className="bg-amber-50 border border-amber-200 p-3 rounded text-center">
            <span className="text-xs text-slate-600 block">Automatic Logout in:</span>
            <span
              className="text-2xl font-mono font-extrabold text-govred block mt-0.5"
              aria-live="assertive"
            >
              00:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={onStayLoggedIn}
            className="flex-1 bg-indiagreen hover:bg-indiagreen-dark border-indiagreen-dark text-white font-bold"
          >
            Stay Logged In
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={onLogout}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Logout Now
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InactivityModal;
