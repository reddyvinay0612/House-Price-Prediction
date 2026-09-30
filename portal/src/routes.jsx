import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Spinner from './components/ui/Spinner';
import ProtectedRoute from './components/auth/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const Estimate = lazy(() => import('./pages/Estimate'));
const WhatIf = lazy(() => import('./pages/WhatIf'));
const IndiaMap = lazy(() => import('./pages/IndiaMap'));
const FinanceCalculator = lazy(() => import('./pages/FinanceCalculator'));
const CompareProperties = lazy(() => import('./pages/CompareProperties'));
const ForecastDashboard = lazy(() => import('./pages/ForecastDashboard'));
const OfficerDashboard = lazy(() => import('./pages/OfficerDashboard'));
const MarketInsights = lazy(() => import('./pages/MarketInsights'));
const CityTrends = lazy(() => import('./pages/CityTrends'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-3">
      <Spinner size="lg" color="navy" />
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">
        Loading Portal Service...
      </p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Authentication Gateways */}
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Navigate to="/register" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Portal Services (Requires Citizen Login First) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estimate"
          element={
            <ProtectedRoute>
              <Estimate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/whatif"
          element={
            <ProtectedRoute>
              <WhatIf />
            </ProtectedRoute>
          }
        />
        <Route
          path="/what-if"
          element={<Navigate to="/whatif" replace />}
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <IndiaMap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/india-map"
          element={<Navigate to="/map" replace />}
        />
        <Route
          path="/finance"
          element={
            <ProtectedRoute>
              <FinanceCalculator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emi"
          element={<Navigate to="/finance" replace />}
        />
        <Route
          path="/compare"
          element={
            <ProtectedRoute>
              <CompareProperties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forecast"
          element={
            <ProtectedRoute>
              <ForecastDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer"
          element={
            <ProtectedRoute>
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insights"
          element={
            <ProtectedRoute>
              <MarketInsights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/market-insights"
          element={
            <ProtectedRoute>
              <MarketInsights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/city-trends"
          element={
            <ProtectedRoute>
              <CityTrends />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faq"
          element={
            <ProtectedRoute>
              <FAQ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />

        {/* Graceful redirects */}
        <Route path="/models" element={<Navigate to="/estimate" replace />} />
        <Route path="/model-performance" element={<Navigate to="/estimate" replace />} />
        <Route path="/how-it-works" element={<Navigate to="/estimate" replace />} />

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
