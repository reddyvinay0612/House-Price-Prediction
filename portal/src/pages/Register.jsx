import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  UserPlus,
  Shield,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  User,
  Building,
  MapPin,
  FileCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Captcha from '../components/auth/Captcha';
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter';
import { NON_METRO_STATES, getDistrictsByState } from '../data/indianData';
import { useAuth } from '../context/AuthContext';

// Citizen Registration Zod Validation Schema
const registrationSchema = z
  .object({
    fullName: z
      .string()
      .min(3, 'Full name must contain at least 3 characters')
      .max(60, 'Full name cannot exceed 60 characters')
      .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain alphabets and standard spaces'),
    email: z.string().email('Please enter a valid official email address'),
    mobile: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9'),
    state: z.string().min(1, 'Please select your resident Indian State or Union Territory'),
    district: z.string().min(1, 'Please select your District / Municipal City'),
    userType: z.enum(['Buyer', 'Seller', 'Agent', 'Bank Officer'], {
      required_error: 'Please choose your primary Citizen Profile Type',
    }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter (A-Z)')
      .regex(/[a-z]/, 'Password must include at least one lowercase letter (a-z)')
      .regex(/[0-9]/, 'Password must include at least one numeric digit (0-9)')
      .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    consentTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must acknowledge the portal privacy and disclaimer terms' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match. Please verify both fields.',
    path: ['confirmPassword'],
  });

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { registerCitizen, isLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [registeredUser, setRegisteredUser] = useState(null);

  const [selectedState, setSelectedState] = useState('Karnataka');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      state: 'Karnataka',
      district: 'Mysuru (Mysore)',
      userType: 'Buyer',
      password: '',
      confirmPassword: '',
      consentTerms: false,
    },
    mode: 'onTouched',
  });

  const passwordValue = watch('password') || '';

  // Districts for selected State
  const availableDistricts = useMemo(() => {
    return getDistrictsByState(selectedState);
  }, [selectedState]);

  const handleStateChange = (newState) => {
    setSelectedState(newState);
    setValue('state', newState, { shouldValidate: true });
    const dists = getDistrictsByState(newState);
    if (dists && dists.length > 0) {
      setValue('district', dists[0].name, { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    setSubmitError(null);

    if (!isCaptchaVerified) {
      setSubmitError('Please complete the Security Code (CAPTCHA) verification before submitting.');
      return;
    }

    try {
      const res = await registerCitizen({
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        state: data.state,
        district: data.district,
        userType: data.userType,
        password: data.password,
      });
      setRegisteredUser(res.user);
    } catch (err) {
      setSubmitError(err.message || 'Registration failed. Please try again.');
    }
  };

  // ==========================================
  // Success Confirmation Screen
  // ==========================================
  if (registeredUser) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Card className="border-2 border-indiagreen shadow-lg text-center space-y-6 p-8">
          <div className="w-16 h-16 bg-emerald-50 border-2 border-indiagreen rounded-full flex items-center justify-center mx-auto text-indiagreen">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indiagreen-dark bg-emerald-50 px-3 py-1 rounded border border-emerald-200 inline-block">
              Registration Successful • पंजीकरण सफल
            </span>
            <h2 className="text-2xl font-extrabold text-navy-900 font-sans">
              Welcome, {registeredUser.fullName}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your citizen account has been successfully registered on the <strong>Directorate of Housing Analytics</strong> unified valuation platform.
            </p>
          </div>

          {/* Citizen Account Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs max-w-md mx-auto text-left space-y-2">
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-slate-500">Citizen ID:</span>
              <span className="font-mono font-bold text-navy-900">{registeredUser.id}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-slate-500">Registered Email:</span>
              <span className="font-semibold text-slate-800">{registeredUser.email}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-slate-500">Registered Mobile:</span>
              <span className="font-mono text-slate-800">+91 {registeredUser.mobile}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-slate-500">Resident Location:</span>
              <span className="font-medium text-slate-800">
                {registeredUser.district}, {registeredUser.state}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Citizen Profile Type:</span>
              <span className="font-bold text-navy-700 bg-navy-50 px-2 py-0.5 rounded">
                {registeredUser.userType}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link to="/dashboard">
              <Button
                variant="primary"
                size="md"
                className="bg-indiagreen hover:bg-indiagreen-dark border-indiagreen-dark text-white font-bold px-6 shadow-md"
              >
                Go to Citizen Dashboard &rarr;
              </Button>
            </Link>
            <Link to="/estimate">
              <Button
                variant="outline"
                size="md"
                className="border-navy-700 text-navy-900 hover:bg-slate-100"
              >
                Calculate First Property Estimate
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-navy-700 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-saffron-dark bg-amber-50 border border-amber-200 px-2.5 py-0.5 inline-block rounded mb-1">
          Citizen Registration Portal (नागरिक पंजीकरण)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-sans">
          Create New Citizen Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Register to access personalized property valuation dashboards, save estimates, and monitor real estate micro-market indices.
        </p>
      </div>

      {submitError && (
        <Alert type="error" title="Registration Error">
          {submitError}
        </Alert>
      )}

      {/* Main Registration Form Card */}
      <Card className="border-2 border-slate-300 shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Section 1: Personal & Contact Information */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-navy-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <User className="w-4 h-4 text-saffron" />
              1. Citizen Personal & Contact Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-bold text-navy-900 mb-1">
                  Full Name (पूरा नाम) <span className="text-govred">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  {...register('fullName')}
                  placeholder="e.g. Ramesh Kumar Sharma"
                  className={`w-full px-3 py-2 text-xs text-slate-900 bg-white border rounded shadow-sm focus:outline-none focus:ring-2 ${
                    errors.fullName ? 'border-govred focus:ring-govred' : 'border-slate-300 focus:ring-navy-700'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-govred font-semibold mt-1">⚠️ {errors.fullName.message}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-navy-900 mb-1">
                  Official Email Address (ईमेल) <span className="text-govred">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="e.g. ramesh.sharma@example.com"
                  className={`w-full px-3 py-2 text-xs text-slate-900 bg-white border rounded shadow-sm focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-govred focus:ring-govred' : 'border-slate-300 focus:ring-navy-700'
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-govred font-semibold mt-1">⚠️ {errors.email.message}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobile" className="block text-xs font-bold text-navy-900 mb-1">
                  Mobile Number (10 Digits) <span className="text-govred">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l border border-r-0 border-slate-300 bg-slate-100 text-slate-600 font-mono text-xs font-bold">
                    +91
                  </span>
                  <input
                    id="mobile"
                    type="tel"
                    maxLength={10}
                    {...register('mobile')}
                    placeholder="e.g. 9876543210"
                    className={`flex-1 rounded-r border px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 ${
                      errors.mobile ? 'border-govred focus:ring-govred' : 'border-slate-300 focus:ring-navy-700'
                    }`}
                  />
                </div>
                {errors.mobile ? (
                  <p className="text-[11px] text-govred font-semibold mt-1">⚠️ {errors.mobile.message}</p>
                ) : (
                  <span className="text-[10px] text-slate-500 block mt-1">10-digit number starting with 6, 7, 8, or 9</span>
                )}
              </div>

              {/* User Profile Type */}
              <div>
                <label htmlFor="userType" className="block text-xs font-bold text-navy-900 mb-1">
                  Citizen Profile Type <span className="text-govred">*</span>
                </label>
                <select
                  id="userType"
                  {...register('userType')}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-navy-700 font-medium text-navy-900"
                >
                  <option value="Buyer">Home Buyer / Property Investor</option>
                  <option value="Seller">Property Owner / Individual Seller</option>
                  <option value="Agent">Real Estate Broker / Channel Partner</option>
                  <option value="Bank Officer">Bank Officer / Mortgage Valuer</option>
                </select>
                {errors.userType && (
                  <p className="text-[11px] text-govred font-semibold mt-1">⚠️ {errors.userType.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Geographical Residence (Cascading State & District) */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <h2 className="text-xs font-bold text-navy-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indiagreen" />
              2. Geographical Residence / Jurisdiction
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* State Dropdown */}
              <div>
                <label htmlFor="state" className="block text-xs font-bold text-navy-900 mb-1">
                  Select State / Union Territory (राज्य) <span className="text-govred">*</span>
                </label>
                <select
                  id="state"
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-navy-700 font-semibold text-navy-900"
                >
                  {NON_METRO_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Dropdown (Cascading) */}
              <div>
                <label htmlFor="district" className="block text-xs font-bold text-navy-900 mb-1">
                  Select District / City (ज़िला / शहर) <span className="text-govred">*</span>
                </label>
                <select
                  id="district"
                  {...register('district')}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-navy-700 font-semibold text-navy-900"
                >
                  {availableDistricts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 block mt-1">
                  {availableDistricts.length} official districts loaded for {selectedState}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Security & Password Setup */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <h2 className="text-xs font-bold text-navy-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-navy-700" />
              3. Security Password Setup (सुरक्षा पासवर्ड)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {/* Password */}
              <div>
                <label htmlFor="reg-password" className="block text-xs font-bold text-navy-900 mb-1">
                  Create Account Password <span className="text-govred">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Min 8 chars with upper, lower, digit, special"
                    autoComplete="new-password"
                    className={`w-full pr-10 px-3 py-2 text-xs text-slate-900 bg-white border rounded shadow-sm focus:outline-none focus:ring-2 ${
                      errors.password ? 'border-govred focus:ring-govred' : 'border-slate-300 focus:ring-navy-700'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-navy-700"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-govred font-semibold mt-1">⚠️ {errors.password.message}</p>
                )}

                {/* Password Strength Meter */}
                <PasswordStrengthMeter password={passwordValue} />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-navy-900 mb-1">
                  Confirm Password (पासवर्ड की पुष्टि करें) <span className="text-govred">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className={`w-full pr-10 px-3 py-2 text-xs text-slate-900 bg-white border rounded shadow-sm focus:outline-none focus:ring-2 ${
                      errors.confirmPassword
                        ? 'border-govred focus:ring-govred'
                        : 'border-slate-300 focus:ring-navy-700'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-navy-700"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-govred font-semibold mt-1">⚠️ {errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Security CAPTCHA & Consent */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <Captcha onVerifyStateChange={setIsCaptchaVerified} />

            {/* Statutory Consent Checkbox */}
            <div className="pt-2">
              <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('consentTerms')}
                  className="mt-0.5 rounded border-slate-300 text-navy-700 focus:ring-navy-700 w-4 h-4"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  I solemnly declare that the information submitted above is accurate. I agree to the{' '}
                  <span className="text-navy-700 font-bold underline">Terms of Use</span>,{' '}
                  <span className="text-navy-700 font-bold underline">Privacy Policy</span>, and understand that property valuations are advisory estimates. <span className="text-govred">*</span>
                </span>
              </label>
              {errors.consentTerms && (
                <p className="text-[11px] text-govred font-semibold mt-1">⚠️ {errors.consentTerms.message}</p>
              )}
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-navy-700 hover:underline">
                Citizen Sign In &rarr;
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full sm:w-auto bg-indiagreen hover:bg-indiagreen-dark border-indiagreen-dark text-white font-bold px-8 shadow-md"
            >
              {isLoading ? 'Registering Citizen Profile...' : 'Complete Registration'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
