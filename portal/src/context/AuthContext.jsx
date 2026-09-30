import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { mockAuthService } from '../services/mockAuthService';

const AuthContext = createContext(null);

const SESSION_TOKEN_KEY = 'bharat_portal_auth_token';
const SESSION_USER_KEY = 'bharat_portal_auth_user';
const LOCKOUT_KEY = 'bharat_portal_lockout_until';
const FAILED_ATTEMPTS_KEY = 'bharat_portal_failed_attempts';

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const WARNING_BEFORE_LOGOUT_MS = 60 * 1000; // 1 minute warning (at minute 14)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_TOKEN_KEY) || null;
    } catch {
      return null;
    }
  });

  const [savedEstimates, setSavedEstimates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Rate Limiter & Lockout (5 failed attempts -> 60s lockout)
  const [failedAttempts, setFailedAttempts] = useState(() => {
    try {
      return parseInt(sessionStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10);
    } catch {
      return 0;
    }
  });

  const [lockoutUntil, setLockoutUntil] = useState(() => {
    try {
      return parseInt(sessionStorage.getItem(LOCKOUT_KEY) || '0', 10);
    } catch {
      return 0;
    }
  });

  // Inactivity Timer State
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [inactivityCountdown, setInactivityCountdown] = useState(60);
  const lastActivityRef = useRef(Date.now());
  const warningTimerRef = useRef(null);
  const logoutTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Load saved estimates when user changes
  useEffect(() => {
    if (user) {
      const list = mockAuthService.getSavedEstimates(user.id);
      setSavedEstimates(list);
    } else {
      setSavedEstimates([]);
    }
  }, [user]);

  // Persist session changes
  const setSession = (userData, tokenString) => {
    setUser(userData);
    setToken(tokenString);
    try {
      if (userData && tokenString) {
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(userData));
        sessionStorage.setItem(SESSION_TOKEN_KEY, tokenString);
      } else {
        sessionStorage.removeItem(SESSION_USER_KEY);
        sessionStorage.removeItem(SESSION_TOKEN_KEY);
      }
    } catch (e) {
      console.warn('SessionStorage unavailable', e);
    }
  };

  const clearFailedAttempts = () => {
    setFailedAttempts(0);
    setLockoutUntil(0);
    try {
      sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
      sessionStorage.removeItem(LOCKOUT_KEY);
    } catch {}
  };

  const registerFailedAttempt = () => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);
    try {
      sessionStorage.setItem(FAILED_ATTEMPTS_KEY, String(nextAttempts));
    } catch {}

    if (nextAttempts >= 5) {
      const lockTime = Date.now() + 60 * 1000; // 60 seconds
      setLockoutUntil(lockTime);
      try {
        sessionStorage.setItem(LOCKOUT_KEY, String(lockTime));
      } catch {}
    }
  };

  const logout = useCallback(() => {
    setSession(null, null);
    setShowInactivityWarning(false);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  }, []);

  // Inactivity Watcher Reset
  const resetInactivityTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowInactivityWarning(false);
    setInactivityCountdown(60);

    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

    if (!user) return;

    // Set 14-minute warning timer
    warningTimerRef.current = setTimeout(() => {
      setShowInactivityWarning(true);
      setInactivityCountdown(60);

      countdownIntervalRef.current = setInterval(() => {
        setInactivityCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            logout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, INACTIVITY_TIMEOUT_MS - WARNING_BEFORE_LOGOUT_MS);

    // Set 15-minute hard auto-logout
    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT_MS);
  }, [user, logout]);

  // Attach DOM interaction listeners for inactivity reset
  useEffect(() => {
    if (!user) return;

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleUserActivity = () => {
      if (!showInactivityWarning) {
        resetInactivityTimer();
      }
    };

    events.forEach((ev) => window.addEventListener(ev, handleUserActivity));
    resetInactivityTimer();

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleUserActivity));
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [user, showInactivityWarning, resetInactivityTimer]);

  // Login with Password
  const loginWithPassword = async (userId, password) => {
    if (lockoutUntil > Date.now()) {
      const remainingSec = Math.ceil((lockoutUntil - Date.now()) / 1000);
      throw new Error(`Account temporarily locked due to 5 consecutive failed attempts. Try again in ${remainingSec} seconds.`);
    }

    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await mockAuthService.loginWithPassword(userId, password);
      setSession(res.user, res.token);
      clearFailedAttempts();
      return res;
    } catch (err) {
      registerFailedAttempt();
      setAuthError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP
  const sendOtp = async (mobile) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      return await mockAuthService.sendOtp(mobile);
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with OTP
  const loginWithOtp = async (mobile, otp) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await mockAuthService.loginWithOtp(mobile, otp);
      setSession(res.user, res.token);
      clearFailedAttempts();
      return res;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register Citizen
  const registerCitizen = async (formData) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await mockAuthService.register(formData);
      setSession(res.user, res.token);
      clearFailedAttempts();
      return res;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password
  const forgotPassword = async (userId, otp, newPassword) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      return await mockAuthService.resetPassword(userId, otp, newPassword);
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Saved Estimates Management
  const saveEstimate = (estimateData) => {
    if (!user) return null;
    const newEst = mockAuthService.saveEstimate(user.id, estimateData);
    if (newEst) {
      setSavedEstimates((prev) => [newEst, ...prev]);
    }
    return newEst;
  };

  const deleteEstimate = (estimateId) => {
    if (!user) return;
    const updated = mockAuthService.deleteEstimate(user.id, estimateId);
    setSavedEstimates(updated);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    authError,
    failedAttempts,
    lockoutUntil,
    showInactivityWarning,
    inactivityCountdown,
    savedEstimates,
    loginWithPassword,
    sendOtp,
    loginWithOtp,
    registerCitizen,
    forgotPassword,
    logout,
    resetInactivityTimer,
    saveEstimate,
    deleteEstimate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
