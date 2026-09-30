import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Home,
  Shield,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Fingerprint,
  FileCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building2,
  LineChart,
  Bot,
  MapPin,
  HelpCircle,
  Check,
  Unlock,
  ShieldCheck,
  Smartphone,
  Award,
} from 'lucide-react';
import Captcha from '../components/auth/Captcha';
import OtpInput from '../components/auth/OtpInput';
import BackgroundSlideshow from '../components/auth/BackgroundSlideshow';
import FullscreenUtilityRow from '../components/auth/FullscreenUtilityRow';
import FloatingIconDock from '../components/auth/FloatingIconDock';
import CookieBanner from '../components/auth/CookieBanner';
import { useAuth } from '../context/AuthContext';

// Password Form Zod Validation Schema
const passwordLoginSchema = z.object({
  userId: z.string().min(1, 'User ID (Email or 10-digit Mobile Number) is required'),
  password: z.string().min(6, 'Password is required (min 6 characters)'),
  rememberMe: z.boolean().optional(),
});

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    loginWithPassword,
    sendOtp,
    loginWithOtp,
    isLoading,
    failedAttempts,
    lockoutUntil,
    isAuthenticated,
  } = useAuth();

  const [activeTab, setActiveTab] = useState('password'); // 'password' | 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(null);
  const [demoFilledToast, setDemoFilledToast] = useState(null);

  // OTP Tab State
  const [otpMobile, setOtpMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');

  // Lockout countdown state
  const [lockoutCountdown, setLockoutCountdown] = useState(0);

  // Redirect target after login (defaults to home page '/')
  const from =
    location.state?.from?.pathname && location.state.from.pathname !== '/login'
      ? location.state.from.pathname
      : '/';

  // If already authenticated, redirect to home page immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // React Hook Form for Password Login
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordLoginSchema),
    defaultValues: {
      userId: '',
      password: '',
      rememberMe: true,
    },
  });

  // Handle Account Lockout Countdown
  useEffect(() => {
    let interval = null;
    const checkLockout = () => {
      const now = Date.now();
      if (lockoutUntil && lockoutUntil > now) {
        setLockoutCountdown(Math.ceil((lockoutUntil - now) / 1000));
      } else {
        setLockoutCountdown(0);
      }
    };

    checkLockout();
    interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // One-click Citizen Demo Credentials Auto-Fill
  const handleFillDemoCitizen = () => {
    if (activeTab === 'password') {
      setValue('userId', 'demo@portal.in');
      setValue('password', 'Demo@1234');
    } else {
      setOtpMobile('9876543210');
    }
    setLoginError(null);
    setDemoFilledToast('Citizen demo credentials filled!');
    setTimeout(() => setDemoFilledToast(null), 2500);
  };

  // One-click Officer Demo Credentials Auto-Fill
  const handleFillDemoOfficer = () => {
    if (activeTab === 'password') {
      setValue('userId', 'officer@portal.in');
      setValue('password', 'Officer@1234');
    } else {
      setOtpMobile('9811223344');
    }
    setLoginError(null);
    setDemoFilledToast('Officer credentials filled!');
    setTimeout(() => setDemoFilledToast(null), 2500);
  };

  // Password Login Handler
  const onPasswordSubmit = async (data) => {
    setLoginError(null);
    setLoginSuccess(null);

    if (lockoutCountdown > 0) {
      setLoginError(`Account temporarily locked due to multiple failed attempts. Please wait ${lockoutCountdown} seconds.`);
      return;
    }

    if (!isCaptchaVerified) {
      setLoginError('Please enter the 6-character Security Code (CAPTCHA) displayed above to proceed.');
      return;
    }

    try {
      const res = await loginWithPassword(data.userId, data.password);
      setLoginSuccess(res.message || 'Authentication successful! Redirecting to National Portal...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 700);
    } catch (err) {
      setLoginError(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  // Send OTP Handler
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoginError(null);
    if (!/^[6-9]\d{9}$/.test(otpMobile.trim())) {
      setLoginError('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    setOtpSending(true);
    try {
      const res = await sendOtp(otpMobile.trim());
      setOtpSent(true);
      setOtpMessage(res.message);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setOtpSending(false);
    }
  };

  // Verify OTP and Login
  const handleVerifyOtpLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);

    if (!otpCode || otpCode.length !== 6) {
      setLoginError('Please enter the full 6-digit OTP code sent to your mobile number.');
      return;
    }

    try {
      const res = await loginWithOtp(otpMobile.trim(), otpCode.trim());
      setLoginSuccess('OTP verified successfully! Redirecting to National Portal...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 700);
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const trendingChips = [
    { label: 'Instant Valuation', to: '/estimate', icon: TrendingUp, tag: 'AI Engine' },
    { label: '36 States Heatmap', to: '/india-map', icon: MapPin, tag: 'Live GIS' },
    { label: '5-Yr Growth Forecast', to: '/forecast', icon: LineChart, tag: 'Econometric' },
    { label: 'Compare Districts', to: '/compare', icon: Building2, tag: 'Multi-City' },
    { label: 'Griha Mitra AI', to: '/faq', icon: Bot, tag: 'Assistant' },
    { label: 'Officer Portal', to: '/officer', icon: ShieldCheck, tag: 'Official' },
  ];

  return (
    <BackgroundSlideshow>
      {/* 1. Top-Right Utility Row */}
      <FullscreenUtilityRow />

      {/* Main Centered Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6 z-10 font-sans">
        {/* 2. Top-Center Prestigious National Emblem Branding */}
        <div className="flex flex-col items-center text-center space-y-2.5 mb-5 max-w-2xl animate-fadeIn">
          {/* Layered Golden Seal Emblem */}
          <div className="relative group cursor-default">
            {/* Ambient Radial Halo */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-saffron via-amber-400 to-indiagreen opacity-75 blur-md group-hover:opacity-100 transition duration-500 animate-pulse-glow" />
            
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-b from-slate-900 via-navy-950 to-slate-950 border-2 border-amber-400/80 flex items-center justify-center shadow-2xl backdrop-blur-md ring-2 ring-white/20 ring-offset-2 ring-offset-slate-950">
              {/* Inner 24-spoke dotted ring */}
              <div className="absolute inset-1 rounded-full border border-dashed border-amber-300/40" />
              <Home className="w-8 h-8 sm:w-9 sm:h-9 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              
              {/* Live Badge Dot */}
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center shadow-md">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </div>
            </div>
          </div>

          {/* Portal Title & Subtitles */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-bold tracking-widest text-amber-300 uppercase shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Directorate of Housing Analytics • Government of India Demo</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              housing.demo.in
            </h1>

            {/* National Tricolour Divider with Central Ashoka Blue Chakra Marker */}
            <div className="w-56 sm:w-72 h-1.5 mx-auto flex items-center justify-center rounded-full overflow-hidden shadow-lg mt-1 relative bg-slate-950">
              <div className="w-1/2 h-full bg-gradient-to-r from-saffron to-amber-400" />
              <div className="absolute z-10 w-3 h-3 rounded-full bg-[#0b3d91] border border-white shadow-md flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-white" />
              </div>
              <div className="w-1/2 h-full bg-gradient-to-r from-emerald-500 to-indiagreen" />
            </div>
          </div>

          {/* Subtitle & Tagline */}
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-bold text-slate-100 tracking-wide drop-shadow-md">
              National Real Estate Intelligence & Econometric Valuation Portal • भारत आवास मूल्य अनुमानक
            </p>
            <p className="text-[11px] sm:text-xs text-amber-300 font-semibold italic tracking-wider drop-shadow-sm">
              "Where Data Meets Decisions • Empowering 1.4 Billion Citizens"
            </p>
          </div>
        </div>

        {/* 3. Centerpiece: Luxury Glassmorphic Citizen Gateway Card (Max Width 460px) */}
        <div
          id="login-card"
          tabIndex={-1}
          className="w-full max-w-[460px] bg-slate-950/75 backdrop-blur-2xl rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_40px_rgba(255,153,51,0.12)] border border-white/20 border-t-4 border-t-amber-400 p-5 sm:p-7 space-y-4 relative animate-fadeIn focus:outline-none ring-1 ring-white/10"
        >
          {/* Card Header with Glowing Shield Icon */}
          <div className="text-center space-y-1 border-b border-white/15 pb-3.5">
            <div className="flex items-center justify-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 shadow-sm">
                <Shield className="w-4 h-4 text-amber-300" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Citizen Authentication Gateway
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
              Sign in to access AI valuations, tax projections & historical records
            </p>
            <div className="flex items-center justify-center gap-2 pt-1 text-[10px] text-slate-400 font-semibold">
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> 256-Bit SSL Encrypted
              </span>
              <span>•</span>
              <span className="text-slate-300">GovCloud Node ID: DEL-IN-09</span>
            </div>
          </div>

          {/* Quick Demo Credentials Bar with 1-Click Fill Pills */}
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/15 border border-amber-400/30 rounded-xl p-2.5 space-y-1.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Quick Demo Auto-Fill:</span>
              </span>
              {demoFilledToast && (
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-400/40 animate-pulse">
                  ✓ {demoFilledToast}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleFillDemoCitizen}
                className="py-1.5 px-2 rounded-lg bg-black/40 hover:bg-black/60 border border-amber-400/40 hover:border-amber-300 text-left transition duration-150 group shadow-sm flex flex-col justify-center"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-300 group-hover:text-amber-200">
                    👤 Citizen Demo
                  </span>
                  <span className="text-[9px] font-bold text-white/80 bg-white/10 px-1 py-0.2 rounded">
                    Fill
                  </span>
                </div>
                <span className="text-[9.5px] font-mono text-slate-300 truncate">
                  demo@portal.in
                </span>
              </button>

              <button
                type="button"
                onClick={handleFillDemoOfficer}
                className="py-1.5 px-2 rounded-lg bg-black/40 hover:bg-black/60 border border-sky-400/40 hover:border-sky-300 text-left transition duration-150 group shadow-sm flex flex-col justify-center"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-sky-300 group-hover:text-sky-200">
                    🛡️ Officer Demo
                  </span>
                  <span className="text-[9px] font-bold text-white/80 bg-white/10 px-1 py-0.2 rounded">
                    Fill
                  </span>
                </div>
                <span className="text-[9.5px] font-mono text-slate-300 truncate">
                  officer@portal.in
                </span>
              </button>
            </div>
          </div>

          {/* Account Lockout Notice */}
          {lockoutCountdown > 0 && (
            <div className="bg-red-500/20 border border-red-400/80 text-red-200 p-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>
                Account locked due to multiple failed attempts. Please wait{' '}
                <strong>{lockoutCountdown}s</strong>.
              </span>
            </div>
          )}

          {/* Success Alert */}
          {loginSuccess && (
            <div className="bg-emerald-500/20 border border-emerald-400/80 text-emerald-200 p-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-bounce" />
              <span className="font-bold">{loginSuccess}</span>
            </div>
          )}

          {/* Error Alert */}
          {loginError && (
            <div className="bg-red-500/20 border border-red-400/80 text-red-200 p-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="font-semibold">{loginError}</span>
            </div>
          )}

          {/* Tabs: Modern Segmented Capsule Switcher */}
          <div className="p-1 bg-black/50 rounded-xl border border-white/15 grid grid-cols-2 gap-1" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'password'}
              onClick={() => {
                setActiveTab('password');
                setLoginError(null);
              }}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'password'
                  ? 'bg-gradient-to-r from-amber-500 via-saffron to-amber-600 text-slate-950 shadow-[0_2px_10px_rgba(255,153,51,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <KeyRound className={`w-3.5 h-3.5 ${activeTab === 'password' ? 'text-slate-950' : 'text-amber-300'}`} />
              <span>Password Login</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'otp'}
              onClick={() => {
                setActiveTab('otp');
                setLoginError(null);
              }}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'otp'
                  ? 'bg-gradient-to-r from-amber-500 via-saffron to-amber-600 text-slate-950 shadow-[0_2px_10px_rgba(255,153,51,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone className={`w-3.5 h-3.5 ${activeTab === 'otp' ? 'text-slate-950' : 'text-emerald-400'}`} />
              <span>Mobile OTP</span>
            </button>
          </div>

          {/* TAB 1: Password Login Form */}
          {activeTab === 'password' && (
            <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-3.5 pt-1">
              {/* User ID */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                  User ID (Email or Mobile) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. demo@portal.in or 9876543210"
                    {...register('userId')}
                    className={`w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900/80 border rounded-xl text-white placeholder-slate-400 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400/30 transition duration-150 ${
                      errors.userId
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-white/20 focus:border-amber-400'
                    }`}
                  />
                </div>
                {errors.userId && (
                  <p className="text-[11px] text-red-400 font-medium">{errors.userId.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-bold text-amber-300 hover:text-amber-200 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-300">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter account password"
                    {...register('password')}
                    className={`w-full pl-9 pr-10 py-2.5 text-xs bg-slate-900/80 border rounded-xl text-white placeholder-slate-400 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400/30 transition duration-150 ${
                      errors.password
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-white/20 focus:border-amber-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-400 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* High-Contrast CAPTCHA Component */}
              <div className="border border-white/20 bg-slate-900/90 p-3 rounded-xl shadow-md ring-1 ring-white/5">
                <Captcha onVerify={setIsCaptchaVerified} />
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  {...register('rememberMe')}
                  className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-white/40 bg-black/40 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 text-xs text-slate-200 cursor-pointer font-medium">
                  Remember this device for 30 days (GovCloud Trust)
                </label>
              </div>

              {/* High-Impact RED / SAFFRON Primary CTA Button */}
              <button
                type="submit"
                disabled={isLoading || lockoutCountdown > 0}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_6px_25px_rgba(225,29,46,0.5)] hover:shadow-[0_8px_35px_rgba(225,29,46,0.7)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating Credentials...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Unlock className="w-4 h-4" />
                    <span>Secure Sign In • प्रवेश करें</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: OTP Login Form */}
          {activeTab === 'otp' && (
            <div className="space-y-3.5 pt-1">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                      10-Digit Indian Mobile Number <span className="text-red-400">*</span>
                    </label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-white/20 bg-black/60 text-amber-300 text-xs font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={otpMobile}
                        onChange={(e) => setOtpMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 9876543210"
                        className="w-full pl-3 pr-3 py-2.5 text-xs bg-slate-900/80 border border-white/20 rounded-r-xl text-white placeholder-slate-400 focus:bg-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 font-mono tracking-wider font-semibold"
                        required
                      />
                    </div>
                  </div>

                  {/* Send OTP Red Button */}
                  <button
                    type="submit"
                    disabled={otpSending || !otpMobile}
                    className="w-full py-3 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_6px_25px_rgba(225,29,46,0.5)] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {otpSending ? 'Dispatching OTP via SMS Gateway...' : 'Send OTP • ओटीपी भेजें'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtpLogin} className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs text-slate-200 bg-white/10 px-3 py-2 rounded-lg border border-white/15">
                    <span>
                      OTP dispatched to <strong>+91 {otpMobile}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-amber-300 hover:underline font-bold text-[11px]"
                    >
                      Change Number
                    </button>
                  </div>

                  {/* 6-Digit OTP Box */}
                  <div className="bg-slate-900/90 p-3 rounded-xl border border-white/20">
                    <OtpInput
                      length={6}
                      value={otpCode}
                      onChange={setOtpCode}
                      onResend={handleSendOtp}
                      resendTimeout={30}
                    />
                  </div>

                  {/* Verify and Login Red Button */}
                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length !== 6}
                    className="w-full py-3 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_6px_25px_rgba(225,29,46,0.5)] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Verifying OTP Code...' : 'Verify and Login • सत्यापित करें'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* MeriPehchaan / DigiLocker National SSO Option */}
          <div className="pt-2 border-t border-white/15 space-y-2">
            <button
              type="button"
              disabled
              className="w-full py-2.5 px-3 rounded-xl border border-white/20 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-blue-900/40 hover:bg-white/10 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-80 shadow-sm"
              title="Aadhaar / DigiLocker integration disabled in demo mode"
            >
              <Fingerprint className="w-4 h-4 text-sky-400" />
              <span>Login with MeriPehchaan / DigiLocker (SSO)</span>
            </button>

            {/* Registration Link & Legal Disclaimer */}
            <div className="flex items-center justify-between text-xs pt-1 text-slate-200">
              <span className="text-slate-300">New citizen user?</span>
              <Link
                to="/register"
                className="font-bold text-amber-300 hover:text-amber-200 hover:underline flex items-center gap-1"
              >
                <span>Register account</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </Link>
            </div>

            <p className="text-[10px] text-slate-400 text-center italic pt-1">
              Fictional demonstration portal for academic & hackathon evaluation.
            </p>
          </div>
        </div>

        {/* 4. Trending Services / Feature Portals Pills (Below Card) */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 max-w-3xl text-center animate-fadeIn">
          <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider mr-1 drop-shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Trending Modules:</span>
          </span>
          {trendingChips.map((chip, idx) => {
            const Icon = chip.icon;
            return (
              <Link
                key={idx}
                to={chip.to}
                className="group px-3 py-1.5 rounded-full border border-white/20 bg-slate-950/60 hover:bg-slate-900/80 text-white text-xs font-semibold backdrop-blur-xl transition duration-200 flex items-center gap-1.5 shadow-md hover:border-amber-400 hover:shadow-[0_0_12px_rgba(255,153,51,0.3)] hover:-translate-y-0.5"
              >
                <Icon className="w-3.5 h-3.5 text-amber-300 group-hover:text-amber-200 transition" />
                <span>{chip.label}</span>
                <span className="text-[9px] font-bold text-slate-400 bg-white/10 px-1.5 py-0.2 rounded-full">
                  {chip.tag}
                </span>
              </Link>
            );
          })}
        </div>

        {/* 5. Live National Portal Stats Micro Ticker */}
        <div className="mt-4 hidden md:flex items-center justify-center gap-6 px-4 py-1.5 rounded-full bg-slate-950/50 backdrop-blur-md border border-white/10 text-[11px] text-slate-300 shadow-lg">
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span><strong>36</strong> States & UTs Covered</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span><strong>98.94%</strong> Champion Model R²</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>GovCloud ISO 27001 Certified</span>
          </div>
        </div>
      </main>

      {/* 6. Right-Edge Floating Icon Dock */}
      <FloatingIconDock />

      {/* 7. Bottom Cookie Banner */}
      <CookieBanner />
    </BackgroundSlideshow>
  );
}
