import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

/**
 * 6-Digit Auto-Focusing OTP Input Matrix with Resend Countdown Timer
 */
export function OtpInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  onResend,
  isLoading = false,
}) {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);

  // Synchronize internal array if parent passes initial value
  useEffect(() => {
    if (value && value.length === length) {
      setOtp(value.split(''));
    }
  }, [value, length]);

  // 30-Second Countdown Timer
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return; // Only allow numbers

    const newOtp = [...otp];
    // Take the last character entered
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    const fullOtp = newOtp.join('');
    if (onChange) onChange(fullOtp);

    // Auto-focus next input box
    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (fullOtp.length === length) {
      if (onComplete) onComplete(fullOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.slice(0, length).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      const full = newOtp.join('');
      if (onChange) onChange(full);
      if (digits.length === length && onComplete) {
        onComplete(full);
      }
      // Focus on last entered box
      const targetIdx = Math.min(digits.length, length - 1);
      inputsRef.current[targetIdx]?.focus();
    }
  };

  const handleResendClick = () => {
    if (!canResend || isLoading) return;
    setResendTimer(30);
    setCanResend(false);
    setOtp(new Array(length).fill(''));
    if (onChange) onChange('');
    inputsRef.current[0]?.focus();
    if (onResend) onResend();
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-navy-900">
        Enter 6-Digit One-Time Password (OTP) <span className="text-govred">*</span>
      </label>

      {/* 6 Box Inputs */}
      <div className="flex items-center justify-between gap-2 max-w-sm" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            aria-label={`OTP Digit ${index + 1} of ${length}`}
            className="w-11 h-12 text-center text-lg font-mono font-bold text-navy-900 bg-white border-2 rounded shadow-sm focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700 transition"
          />
        ))}
      </div>

      {/* Resend OTP & Helper Info */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-1">
        <div>
          {canResend ? (
            <button
              type="button"
              onClick={handleResendClick}
              disabled={isLoading}
              className="text-navy-700 font-bold hover:underline inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-navy-700 rounded"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Resend OTP via SMS
            </button>
          ) : (
            <span className="text-slate-500 font-mono">
              Resend OTP in <strong className="text-navy-900">{resendTimer}s</strong>
            </span>
          )}
        </div>

        <span className="text-[11px] text-slate-500">
          Demo Default OTP: <strong className="font-mono text-navy-900">123456</strong>
        </span>
      </div>
    </div>
  );
}

export default OtpInput;
