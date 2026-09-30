import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Volume2, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

/**
 * Clean & Transparent CAPTCHA Component
 * Simplified, high-legibility security code verification without rainbow noise clutter.
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

  // Generate random 6-character uppercase alphanumeric code (clean, unambiguous characters)
  const generateCode = useCallback(() => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 400);

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
    <div className="space-y-1.5">
      {!hideLabel && (
        <div className="flex items-center justify-between">
          <label htmlFor="captcha-input" className="block text-xs font-semibold text-white/90">
            Security Code (CAPTCHA) <span className="text-red-400">*</span>
          </label>
          <span className="text-[10px] text-white/60">Case-insensitive</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Clean Security Code Box */}
        <div
          className="relative px-3.5 py-2 bg-black/40 border border-white/20 rounded-lg font-mono select-none overflow-hidden flex items-center justify-center tracking-[0.25em] text-base font-bold text-white shadow-inner"
          aria-hidden="true"
        >
          {/* Subtle noise line */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="30%" x2="100%" y2="70%" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 3" />
            </svg>
          </div>
          <span className="relative z-10 tracking-widest text-white drop-shadow-sm">
            {captchaCode}
          </span>
        </div>

        {/* Reload & Speech Buttons */}
        <button
          type="button"
          onClick={generateCode}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 transition focus:outline-none"
          title="Refresh Code"
          aria-label="Refresh Security Code"
        >
          <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
        </button>

        <button
          type="button"
          onClick={handleAudioSpeak}
          className={`p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 transition focus:outline-none ${
            isSpeaking ? 'ring-1 ring-white text-white' : ''
          }`}
          title="Audio code"
          aria-label="Play Audio CAPTCHA"
        >
          <Volume2 className="w-4 h-4" />
        </button>

        {/* Input Box */}
        <div className="flex-1 relative">
          <input
            id="captcha-input"
            type="text"
            maxLength={6}
            value={captchaInput}
            onChange={handleInputChange}
            placeholder="Enter code"
            required
            autoComplete="off"
            className={`w-full px-3 py-2 text-xs font-mono font-bold tracking-wider uppercase bg-black/30 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:bg-black/50 transition ${
              isMatch
                ? 'border-emerald-400 text-emerald-200'
                : captchaInput.length === 6
                ? 'border-red-400 text-red-200'
                : 'border-white/20 focus:border-white/50'
            }`}
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            {isMatch && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          </div>
        </div>
      </div>

      {/* Screen reader live region */}
      <div className="sr-only" aria-live="polite">
        {announcedText}
      </div>
    </div>
  );
}

export default Captcha;
