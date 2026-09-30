import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';

/**
 * Government Portal Protected Route Guard
 * Redirects unauthenticated citizens to /login, preserving target URL for post-login return
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Spinner size="lg" color="navy" />
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">
          Verifying Citizen Session & Security Credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to /login, preserving target path in location state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
