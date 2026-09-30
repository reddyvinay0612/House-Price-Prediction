import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Volume2, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

/**
 * Government Portal Compliant High-Security CAPTCHA Component
 * Generates an authentic alphanumeric security code with dynamic noise lines,
 * instant verification feedback, audio speech accessibility, and smooth reload animations.
 */
export function Captcha({ onCaptchaChange, onVerifyStateChange, onVerify, hideLabel = false }) {
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [isMatch, setIsMatch] = useState(false);
  const [announcedText, setAnnouncedText] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const notifyVerification = useCallback((matched) => {
    if (onVerifyStateChange) onVerifyStateChange(matched);
    if (onVerify) onVerify(matched);
  }, [onVerifyStateChange, onVerify]);

  // Generate random 6-character uppercase alphanumeric code (excluding ambiguous chars: 0, O, 1, I)
  const generateCode = useCallback(() => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500);

    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
    setIsMatch(false);
    if (onCaptchaChange) onCaptchaChange(code);
    notifyVerification(false);
  }, [onCaptchaChange, notifyVerification]);

  useEffect(() => {
    generateCode();
  }, [generateCode]);

  const handleInputChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/\s/g, '');
    setCaptchaInput(val);
    const match = val.length === 6 && val === captchaCode;
    setIsMatch(match);
    notifyVerification(match);
  };

  const handleAudioSpeak = () => {
    const text = `Security code characters: ${captchaCode.split('').join(' ')}`;
    setAnnouncedText(text);
    setIsSpeaking(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(captchaCode.split('').join(' '));
      utterance.rate = 0.85;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  };

  return (
    <div className="space-y-2">
      {!hideLabel && (
        <div className="flex items-center justify-between">
          <label htmlFor="captcha-input" className="block text-xs font-bold uppercase tracking-wider text-slate-200">
            Security Code (CAPTCHA) <span className="text-red-400" aria-hidden="true">*</span>
          </label>
          <span className="text-[10px] text-slate-400 font-medium">Case-insensitive</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
        {/* Left: Visual Code Box + Action Buttons (Span 7) */}
        <div className="sm:col-span-7 flex items-center gap-1.5">
          {/* Security Canvas Display */}
          <div
            className="relative flex-1 py-2 px-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-amber-400/40 rounded-lg font-mono select-none overflow-hidden shadow-inner flex items-center justify-center tracking-[0.3em] text-base sm:text-lg font-black text-amber-300 ring-1 ring-white/10"
            style={{
              backgroundImage:
                'radial-gradient(#f59e0b 0.75px, transparent 0.75px), radial-gradient(#38bdf8 0.75px, #0f172a 0.75px)',
              backgroundSize: '10px 10px',
            }}
            aria-hidden="true"
          >
            {/* Dynamic Distortion Noise Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="30%" x2="100%" y2="70%" stroke="#ff9933" strokeWidth="1.5" strokeDasharray="5 3" />
                <line x1="0" y1="75%" x2="100%" y2="25%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" />
                <circle cx="20%" cy="50%" r="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <circle cx="80%" cy="40%" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              </svg>
            </div>

            {/* Styled Alphanumeric Characters with subtle individual tilts */}
            <div className="relative z-10 flex items-center justify-center space-x-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {captchaCode.split('').map((ch, i) => {
                const tilts = ['-rotate-3', 'rotate-2', '-rotate-6', 'rotate-3', '-rotate-2', 'rotate-6'];
                const colors = ['text-amber-300', 'text-sky-300', 'text-emerald-300', 'text-amber-200', 'text-rose-300', 'text-cyan-300'];
                return (
                  <span
                    key={i}
                    className={`inline-block transform ${tilts[i % tilts.length]} ${colors[i % colors.length]} font-black tracking-widest`}
                  >
                    {ch}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Action Buttons: Refresh & Audio */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <button
              type="button"
              onClick={generateCode}
              className="p-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-white/20 hover:border-amber-400/50 shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-amber-400"
              title="Generate New CAPTCHA Code"
              aria-label="Refresh Security Code"
            >
              <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleAudioSpeak}
              className={`p-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/20 hover:border-white/40 shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                isSpeaking ? 'ring-2 ring-sky-400 text-sky-400' : ''
              }`}
              title="Listen to Audio CAPTCHA (Accessibility)"
              aria-label="Play Audio CAPTCHA"
            >
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right: Input Box with Live Verification Indicator (Span 5) */}
        <div className="sm:col-span-5 relative">
          <input
            id="captcha-input"
            type="text"
            maxLength={6}
            value={captchaInput}
            onChange={handleInputChange}
            placeholder="6-char code"
            required
            autoComplete="off"
            className={`w-full px-3 py-2 pr-8 text-xs font-mono font-bold tracking-widest uppercase rounded-lg border transition-all focus:outline-none focus:ring-2 ${
              isMatch
                ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 focus:ring-emerald-400/30'
                : captchaInput.length === 6
                ? 'bg-red-950/60 border-red-400 text-red-200 focus:ring-red-400/30'
                : 'bg-black/50 border-white/30 text-white placeholder-slate-400 focus:border-amber-400 focus:ring-amber-400/20'
            }`}
          />
          {/* Status Icon Indicator inside input */}
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            {isMatch ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
            ) : captchaInput.length === 6 ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-slate-500" />
            )}
          </div>
        </div>
      </div>

      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite">
        {announcedText}
      </div>

      {/* Verification Feedback Banner */}
      {isMatch && (
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 pt-0.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Security code verified successfully</span>
        </div>
      )}
      {captchaInput.length >= 6 && !isMatch && (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-400 pt-0.5">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Code does not match. Please re-enter or refresh.</span>
        </div>
      )}
    </div>
  );
}

export default Captcha;
