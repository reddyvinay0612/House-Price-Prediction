import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  KeyRound,
  Shield,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Captcha from '../components/auth/Captcha';
import OtpInput from '../components/auth/OtpInput';
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter';
import { useAuth } from '../context/AuthContext';

// Step 1 Validation Schema
const step1Schema = z.object({
  identifier: z
    .string()
    .min(1, 'Please enter your registered Email Address or 10-digit Mobile Number'),
});

// Step 2 Validation Schema
const step2Schema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter (A-Z)')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter (a-z)')
      .regex(/[0-9]/, 'Must contain at least one numeric digit (0-9)')
      .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sendOtp, resetPasswordWithOtp, isLoading } = useAuth();

  // Multi-step workflow state: 1 (Request OTP), 2 (Verify OTP & Reset), 3 (Success)
  const [currentStep, setCurrentStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Step 2 State
  const [otpValue, setOtpValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  // Step 1 Form
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    setValue: setValueStep1,
    formState: { errors: errorsStep1 },
  } = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: { identifier: '' },
  });

  // Step 2 Form
  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    watch: watchStep2,
    formState: { errors: errorsStep2 },
  } = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const newPasswordValue = watchStep2('password', '');

  // Helper: Mask identifier
  const getMaskedIdentifier = (val) => {
    if (!val) return '';
    if (val.includes('@')) {
      const parts = val.split('@');
      const name = parts[0];
      const domain = parts[1];
      const maskedName =
        name.length > 2
          ? name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
          : name[0] + '*';
      return `${maskedName}@${domain}`;
    } else {
      if (val.length === 10) {
        return `${val.slice(0, 2)}******${val.slice(8)}`;
      }
      return val;
    }
  };

  // Step 1 Submit: Request OTP
  const onStep1Submit = async (data) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isCaptchaVerified) {
      setErrorMessage('Please solve and verify the security captcha code before continuing.');
      return;
    }

    try {
      const res = await sendOtp(data.identifier);
      if (res.success) {
        setIdentifier(data.identifier);
        setSuccessMessage(res.message || 'OTP successfully dispatched to your registered address.');
        setCurrentStep(2);
      } else {
        setErrorMessage(res.message || 'Failed to dispatch OTP. Check your details and try again.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error occurred while requesting OTP.');
    }
  };

  // Step 2 Resend OTP
  const handleResendOtp = async () => {
    setIsResendingOtp(true);
    setErrorMessage(null);
    try {
      const res = await sendOtp(identifier);
      if (res.success) {
        setSuccessMessage('A fresh verification OTP has been dispatched.');
      } else {
        setErrorMessage(res.message || 'Could not resend OTP at this time.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error occurred while resending OTP.');
    } finally {
      setIsResendingOtp(false);
    }
  };

  // Step 2 Submit: Reset Password
  const onStep2Submit = async (data) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (otpValue.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP verification code.');
      return;
    }

    try {
      const res = await resetPasswordWithOtp(identifier, otpValue, data.password);
      if (res.success) {
        setCurrentStep(3);
      } else {
        setErrorMessage(res.message || 'Invalid or expired OTP. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Password reset failed.');
    }
  };

  // Auto-fill demo identifier helper
  const handleAutoFillDemo = () => {
    setValueStep1('identifier', 'demo@portal.in');
    setErrorMessage(null);
  };

  return (
    <div className="py-6 sm:py-10 max-w-4xl mx-auto space-y-6">
      {/* Top Banner with Tricolour Accent */}
      <div className="bg-navy-900 text-white rounded-lg p-5 sm:p-6 shadow-md border-t-4 border-saffron relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-saffron/20 border border-saffron/40 text-saffron text-[11px] font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>National Citizen Security Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Citizen Password Recovery & Reset
            </h1>
            <p className="text-xs text-slate-300">
              Recover account credentials securely via Aadhaar/Mobile verified One-Time Password (OTP).
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center space-x-2 bg-navy-950/80 px-3.5 py-2 rounded-md border border-navy-800 text-xs self-start md:self-auto">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep >= 1 ? 'bg-saffron text-slate-950' : 'bg-navy-800 text-slate-400'
              }`}
            >
              1
            </span>
            <span className="text-slate-400 text-xs">→</span>
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep >= 2 ? 'bg-saffron text-slate-950' : 'bg-navy-800 text-slate-400'
              }`}
            >
              2
            </span>
            <span className="text-slate-400 text-xs">→</span>
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep === 3 ? 'bg-indiagreen text-white' : 'bg-navy-800 text-slate-400'
              }`}
            >
              3
            </span>
          </div>
        </div>
      </div>

      {/* Main Form Body */}
      <Card className="p-6 sm:p-8 bg-white border border-slate-300 shadow-md">
        {/* Error Alert */}
        {errorMessage && (
          <Alert variant="danger" className="mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs font-semibold text-red-800">{errorMessage}</div>
            </div>
          </Alert>
        )}

        {/* Success Alert for notifications */}
        {successMessage && currentStep !== 3 && (
          <Alert variant="success" className="mb-6">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs font-semibold text-green-800">{successMessage}</div>
            </div>
          </Alert>
        )}

        {/* STEP 1: Request OTP */}
        {currentStep === 1 && (
          <form onSubmit={handleSubmitStep1(onStep1Submit)} className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-saffron" />
                <span>Step 1: Enter Registered Citizen ID</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Provide the registered Official Email Address or 10-digit Mobile Number associated with your portal account.
              </p>
            </div>

            {/* Quick Demo Pre-Fill Trigger */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-md p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="text-xs text-amber-900">
                <span className="font-bold">Evaluation Sandbox:</span> Use test user{' '}
                <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold text-amber-950">
                  demo@portal.in
                </code>{' '}
                with demo OTP <span className="font-bold font-mono">123456</span>.
              </div>
              <button
                type="button"
                onClick={handleAutoFillDemo}
                className="text-xs font-bold text-navy-800 hover:text-navy-950 bg-white border border-amber-300 px-2.5 py-1 rounded shadow-sm hover:bg-amber-100/50 transition flex-shrink-0 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Fill Demo ID</span>
              </button>
            </div>

            {/* Identifier Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="identifier"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Email Address or 10-Digit Mobile Number <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="identifier"
                  type="text"
                  placeholder="e.g. citizen@nic.in or 9876543210"
                  {...registerStep1('identifier')}
                  className={`w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border rounded-md focus:bg-white focus:outline-none focus:ring-2 transition ${
                    errorsStep1.identifier
                      ? 'border-red-500 focus:ring-red-300'
                      : 'border-slate-300 focus:border-navy-700 focus:ring-navy-200'
                  }`}
                />
              </div>
              {errorsStep1.identifier && (
                <p className="text-xs text-red-600 font-medium">
                  {errorsStep1.identifier.message}
                </p>
              )}
            </div>

            {/* Captcha */}
            <div className="border border-slate-200 bg-slate-50/50 p-4 rounded-md">
              <Captcha onVerify={setIsCaptchaVerified} />
            </div>

            {/* Submit & Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Link
                to="/login"
                className="text-xs font-bold text-navy-800 hover:text-navy-950 flex items-center gap-1.5 focus:outline-none focus:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Citizen Login</span>
              </Link>

              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold bg-navy-800 hover:bg-navy-900 text-white flex items-center justify-center gap-2 shadow-sm"
              >
                {isLoading ? (
                  <span>Generating Secure OTP...</span>
                ) : (
                  <>
                    <span>Generate & Send OTP</span>
                    <ArrowRight className="w-4 h-4 text-saffron" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: Enter OTP & Set New Password */}
        {currentStep === 2 && (
          <form onSubmit={handleSubmitStep2(onStep2Submit)} className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-saffron" />
                  <span>Step 2: Verify OTP & Create New Password</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter the 6-digit code dispatched to{' '}
                  <span className="font-bold text-slate-800">{getMaskedIdentifier(identifier)}</span>{' '}
                  and specify your new strong password.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs text-navy-800 hover:underline font-semibold"
              >
                Change ID
              </button>
            </div>

            {/* Demo Helper Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-navy-700 flex-shrink-0" />
                <span>
                  Demo Sandbox OTP is <strong className="font-mono text-sm bg-blue-100 px-1.5 py-0.5 rounded">123456</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOtpValue('123456')}
                className="text-xs font-bold text-navy-800 bg-white border border-blue-300 px-2.5 py-1 rounded hover:bg-blue-100 transition shadow-sm"
              >
                Autofill 123456
              </button>
            </div>

            {/* 6-Digit OTP Box */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Enter 6-Digit Verification OTP <span className="text-red-600">*</span>
              </label>
              <OtpInput
                length={6}
                value={otpValue}
                onChange={setOtpValue}
                onResend={handleResendOtp}
                resendTimeout={30}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* New Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="new-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  New Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 chars with Aa, 1, #"
                    {...registerStep2('password')}
                    className={`w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border rounded-md focus:bg-white focus:outline-none focus:ring-2 transition ${
                      errorsStep2.password
                        ? 'border-red-500 focus:ring-red-300'
                        : 'border-slate-300 focus:border-navy-700 focus:ring-navy-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errorsStep2.password && (
                  <p className="text-xs text-red-600 font-medium">
                    {errorsStep2.password.message}
                  </p>
                )}

                {/* Password Strength Meter */}
                <PasswordStrengthMeter password={newPasswordValue} />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="confirm-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Confirm New Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    {...registerStep2('confirmPassword')}
                    className={`w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border rounded-md focus:bg-white focus:outline-none focus:ring-2 transition ${
                      errorsStep2.confirmPassword
                        ? 'border-red-500 focus:ring-red-300'
                        : 'border-slate-300 focus:border-navy-700 focus:ring-navy-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errorsStep2.confirmPassword && (
                  <p className="text-xs text-red-600 font-medium">
                    {errorsStep2.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Step 1</span>
              </button>

              <Button
                type="submit"
                variant="primary"
                disabled={isLoading || isResendingOtp}
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold bg-navy-800 hover:bg-navy-900 text-white flex items-center justify-center gap-2 shadow-sm"
              >
                {isLoading ? (
                  <span>Updating Credentials...</span>
                ) : (
                  <>
                    <span>Reset Password & Update Credentials</span>
                    <CheckCircle2 className="w-4 h-4 text-saffron" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3: Success Screen */}
        {currentStep === 3 && (
          <div className="py-8 px-4 text-center space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-indiagreen flex items-center justify-center text-indiagreen mx-auto shadow-sm animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-navy-900">
                Password Successfully Reset!
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your portal account password has been updated securely. You may now sign in using your new credentials to access your citizen dashboard and valuation records.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-navy-900">
                <FileCheck className="w-4 h-4 text-saffron" />
                <span>Security Notice:</span>
              </div>
              <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
                <li>Never share your updated credentials or OTP with any third party.</li>
                <li>All sessions on prior devices have been invalidated for security.</li>
                <li>You can access your saved property valuations once logged in.</li>
              </ul>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                onClick={() => navigate('/login')}
                variant="primary"
                className="w-full py-3 text-sm font-bold bg-navy-800 hover:bg-navy-900 text-white flex items-center justify-center gap-2 shadow-md"
              >
                <span>Proceed to Citizen Sign In</span>
                <ArrowRight className="w-4 h-4 text-saffron" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Footer Advisory Box */}
      <div className="bg-slate-100 rounded-lg p-4 border border-slate-200 text-slate-600 text-xs flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-navy-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-800">
            Need additional assistance with your citizen account?
          </p>
          <p>
            Contact the National Real Estate Informatics Helpdesk at{' '}
            <strong className="text-navy-900">1800-11-DHA-GOV</strong> (Toll-Free, 9:00 AM – 6:00 PM IST, Monday to Saturday) or email{' '}
            <strong className="text-navy-900">support@housinganalytics.demo.gov.in</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
