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
  ArrowRight,
  TrendingUp,
  Building2,
  LineChart,
  Bot,
  MapPin,
  Smartphone,
  Sparkles,
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
  userId: z.string().min(1, 'User ID (Email or Mobile) is required'),
  password: z.string().min(6, 'Password is required'),
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

  // OTP Tab State
  const [otpMobile, setOtpMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSending, setOtpSending] = useState(false);

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
  };

  // Password Login Handler
  const onPasswordSubmit = async (data) => {
    setLoginError(null);
    setLoginSuccess(null);

    if (lockoutCountdown > 0) {
      setLoginError(`Account temporarily locked. Please wait ${lockoutCountdown} seconds.`);
      return;
    }

    if (!isCaptchaVerified) {
      setLoginError('Please enter the 6-character Security Code (CAPTCHA) to proceed.');
      return;
    }

    try {
      const res = await loginWithPassword(data.userId, data.password);
      setLoginSuccess(res.message || 'Login successful. Redirecting...');
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
      setLoginError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setOtpSending(true);
    try {
      await sendOtp(otpMobile.trim());
      setOtpSent(true);
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
      setLoginError('Please enter the 6-digit OTP code sent to your mobile.');
      return;
    }

    try {
      await loginWithOtp(otpMobile.trim(), otpCode.trim());
      setLoginSuccess('OTP verified successfully! Redirecting...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 700);
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const trendingChips = [
    { label: 'Estimate Price', to: '/estimate', icon: TrendingUp },
    { label: 'India Map', to: '/india-map', icon: MapPin },
    { label: 'Growth Forecast', to: '/forecast', icon: LineChart },
    { label: 'Compare Districts', to: '/compare', icon: Building2 },
    { label: 'FAQs & Help', to: '/faq', icon: Bot },
  ];

  return (
    <BackgroundSlideshow>
      {/* 1. Top-Right Utility Row */}
      <FullscreenUtilityRow />

      {/* Main Centered Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6 z-10 font-sans">
        {/* 2. Top-Center Portal Branding */}
        <div className="flex flex-col items-center text-center space-y-2 mb-4 sm:mb-5 max-w-xl animate-fadeIn">
          {/* Simple Circle Emblem */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white shadow-lg backdrop-blur-md">
            <Home className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>

          {/* Portal Title */}
          <div className="space-y-0.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-wide drop-shadow-md">
              housing.demo.in
            </h1>

            {/* Saffron & Green Underline */}
            <div className="w-44 sm:w-56 h-1 mx-auto flex rounded-full overflow-hidden mt-1 shadow-sm">
              <div className="w-1/2 bg-saffron" />
              <div className="w-1/2 bg-indiagreen" />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm font-medium text-white/90 drop-shadow-sm">
            House Price Estimation Portal • भारत आवास मूल्य अनुमानक
          </p>
        </div>

        {/* 3. Simple & Transparent Login Card (Max Width 420px) */}
        <div
          id="login-card"
          tabIndex={-1}
          className="w-full max-w-[420px] bg-black/35 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-5 sm:p-7 space-y-4 relative animate-fadeIn focus:outline-none"
        >
          {/* Card Title & Subtitle */}
          <div className="text-center space-y-0.5 border-b border-white/15 pb-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Citizen Login
            </h2>
            <p className="text-xs text-white/70">
              Sign in to access housing analytics and saved records
            </p>
          </div>

          {/* Clean Demo Auto-Fill Bar */}
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/10 border border-white/15 text-xs text-white/90">
            <span className="text-[11px] font-medium text-white/80">
              Demo Login:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleFillDemoCitizen}
                className="px-2.5 py-1 text-[11px] font-semibold bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded transition shadow-2xs"
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={handleFillDemoOfficer}
                className="px-2.5 py-1 text-[11px] font-semibold bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded transition shadow-2xs"
              >
                Officer
              </button>
            </div>
          </div>

          {/* Account Lockout Notice */}
          {lockoutCountdown > 0 && (
            <div className="bg-red-500/30 border border-red-400 text-red-100 p-2.5 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-300 flex-shrink-0" />
              <span>
                Account locked. Please wait <strong>{lockoutCountdown}s</strong>.
              </span>
            </div>
          )}

          {/* Success Alert */}
          {loginSuccess && (
            <div className="bg-emerald-500/30 border border-emerald-400 text-emerald-100 p-2.5 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span className="font-semibold">{loginSuccess}</span>
            </div>
          )}

          {/* Error Alert */}
          {loginError && (
            <div className="bg-red-500/30 border border-red-400 text-red-100 p-2.5 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-300 flex-shrink-0" />
              <span className="font-semibold">{loginError}</span>
            </div>
          )}

          {/* Simple Clean Tabs */}
          <div className="p-1 bg-black/30 rounded-lg border border-white/15 grid grid-cols-2 gap-1" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'password'}
              onClick={() => {
                setActiveTab('password');
                setLoginError(null);
              }}
              className={`py-1.5 px-3 text-xs font-semibold rounded transition flex items-center justify-center gap-1.5 ${
                activeTab === 'password'
                  ? 'bg-white/25 text-white shadow-xs font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
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
              className={`py-1.5 px-3 text-xs font-semibold rounded transition flex items-center justify-center gap-1.5 ${
                activeTab === 'otp'
                  ? 'bg-white/25 text-white shadow-xs font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile OTP</span>
            </button>
          </div>

          {/* TAB 1: Password Login Form */}
          {activeTab === 'password' && (
            <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-3 pt-1">
              {/* User ID */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-white/90">
                  User ID (Email or Mobile) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. demo@portal.in or 9876543210"
                    {...register('userId')}
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-black/30 border rounded-lg text-white placeholder-white/40 focus:bg-black/50 focus:outline-none transition ${
                      errors.userId
                        ? 'border-red-400'
                        : 'border-white/20 focus:border-white/50'
                    }`}
                  />
                </div>
                {errors.userId && (
                  <p className="text-[11px] text-red-300 font-medium">{errors.userId.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-white/90">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-white/80 hover:text-white hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter account password"
                    {...register('password')}
                    className={`w-full pl-9 pr-10 py-2 text-xs bg-black/30 border rounded-lg text-white placeholder-white/40 focus:bg-black/50 focus:outline-none transition ${
                      errors.password
                        ? 'border-red-400'
                        : 'border-white/20 focus:border-white/50'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-300 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Simplified Clean CAPTCHA Box */}
              <div className="border border-white/15 bg-black/20 p-2.5 rounded-lg">
                <Captcha onVerify={setIsCaptchaVerified} />
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  {...register('rememberMe')}
                  className="h-3.5 w-3.5 accent-saffron bg-black/30 border-white/30 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 text-xs text-white/80 cursor-pointer">
                  Remember this device for 30 days
                </label>
              </div>

              {/* Red Primary Button (#e11d2e) */}
              <button
                type="submit"
                disabled={isLoading || lockoutCountdown > 0}
                className="w-full py-2.5 px-4 bg-[#e11d2e] hover:bg-[#c91827] active:bg-[#b01421] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <span>Login • प्रवेश करें</span>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: OTP Login Form */}
          {activeTab === 'otp' && (
            <div className="space-y-3 pt-1">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-white/90">
                      10-Digit Mobile Number <span className="text-red-400">*</span>
                    </label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-white/20 bg-black/40 text-white/80 text-xs font-semibold">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={otpMobile}
                        onChange={(e) => setOtpMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 9876543210"
                        className="w-full pl-3 pr-3 py-2 text-xs bg-black/30 border border-white/20 rounded-r-lg text-white placeholder-white/40 focus:bg-black/50 focus:outline-none focus:border-white/50"
                        required
                      />
                    </div>
                  </div>

                  {/* Send OTP Red Button */}
                  <button
                    type="submit"
                    disabled={otpSending || !otpMobile}
                    className="w-full py-2.5 px-4 bg-[#e11d2e] hover:bg-[#c91827] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition disabled:opacity-50"
                  >
                    {otpSending ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtpLogin} className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-white/90 bg-white/10 px-3 py-2 rounded-lg border border-white/15">
                    <span>
                      OTP sent to <strong>+91 {otpMobile}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-saffron hover:underline font-semibold text-[11px]"
                    >
                      Change Number
                    </button>
                  </div>

                  {/* 6-Digit OTP Box */}
                  <div className="bg-black/30 p-2.5 rounded-lg border border-white/15">
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
                    className="w-full py-2.5 px-4 bg-[#e11d2e] hover:bg-[#c91827] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition disabled:opacity-50"
                  >
                    {isLoading ? 'Verifying OTP...' : 'Verify and Login'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Clean Transparent DigiLocker Button & Registration */}
          <div className="pt-2 border-t border-white/15 space-y-2">
            <button
              type="button"
              disabled
              className="w-full py-2 px-3 rounded-lg border border-white/15 bg-white/5 text-white/70 text-xs font-medium flex items-center justify-center gap-2 cursor-not-allowed"
              title="DigiLocker integration available in live release"
            >
              <Fingerprint className="w-4 h-4 text-white/60" />
              <span>Login with DigiLocker / Aadhaar</span>
            </button>

            {/* Registration Link */}
            <div className="flex items-center justify-between text-xs pt-1 text-white/80">
              <span>New citizen user?</span>
              <Link
                to="/register"
                className="font-bold text-white hover:underline flex items-center gap-1"
              >
                <span>Register here</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-[10px] text-white/50 text-center italic pt-0.5">
              Fictional demonstration portal for hackathon evaluation.
            </p>
          </div>
        </div>

        {/* 4. Trending Services Simple Frosted Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 max-w-xl text-center animate-fadeIn">
          <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wide mr-1">
            Trending:
          </span>
          {trendingChips.map((chip, idx) => {
            const Icon = chip.icon;
            return (
              <Link
                key={idx}
                to={chip.to}
                className="px-3 py-1 rounded-full border border-white/20 bg-black/30 hover:bg-black/50 text-white text-xs font-medium backdrop-blur-md transition shadow-2xs"
              >
                <span className="flex items-center gap-1.5">
                  <Icon className="w-3 h-3 text-white/80" />
                  <span>{chip.label}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </main>

      {/* 5. Right-Edge Floating Icon Dock */}
      <FloatingIconDock />

      {/* 6. Bottom Cookie Banner */}
      <CookieBanner />
    </BackgroundSlideshow>
  );
}
