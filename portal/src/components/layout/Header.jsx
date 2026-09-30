import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Search,
  ShieldCheck,
  User,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Official Indian Government Header with Compliant Placeholder Emblem & Bilingual Title
 */
export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/faq?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isRegisterPage = location.pathname === '/register';
  const isForgotPasswordPage = location.pathname === '/forgot-password';

  return (
    <header className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Department & Portal Branding with Placeholder Emblem */}
        <Link
          to={isAuthenticated ? '/' : '/login'}
          className="flex items-center space-x-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 rounded p-1"
        >
          {/* Custom Placeholder Emblem (House + Circular Chakra Ring) */}
          <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-navy-700 flex items-center justify-center text-white border-2 border-saffron shadow-sm flex-shrink-0 group-hover:bg-navy-800 transition">
            {/* Outer chakra tick motif */}
            <div className="absolute inset-0.5 rounded-full border border-dashed border-white/40" />
            <Home className="w-7 h-7 text-saffron" />
          </div>

          <div className="space-y-0.5">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>{t('app.subtitle')}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-semibold text-slate-700 font-sans leading-none">
                भारत आवास मूल्य अनुमानक
              </span>
              <h1 className="text-lg sm:text-2xl font-extrabold text-navy-700 leading-tight">
                {t('app.title')}
              </h1>
            </div>

            <div className="text-[11px] text-slate-500 hidden sm:block">
              {t('app.tagline')}
            </div>
          </div>
        </Link>

        {/* Right Section: Conditional based on Authentication State */}
        {isAuthenticated ? (
          <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-2">
            <div className="w-full flex flex-col sm:flex-row items-center gap-2.5">
              {/* Search Form */}
              <form onSubmit={handleSearch} className="w-full sm:w-72 flex items-center">
                <label htmlFor="portal-search" className="sr-only">
                  Search Indian housing guides, RERA guidelines, and FAQs
                </label>
                <div className="relative w-full">
                  <input
                    id="portal-search"
                    type="search"
                    placeholder="Search RERA, localities, methodology..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-3 pr-10 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="absolute right-0 top-0 bottom-0 px-3 bg-navy-700 hover:bg-navy-800 text-white rounded-r flex items-center justify-center transition"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Citizen Profile Pill */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-md p-1 shadow-sm flex-shrink-0">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-navy-900 hover:bg-white rounded transition"
                >
                  <div className="w-5 h-5 rounded-full bg-navy-800 text-saffron flex items-center justify-center text-[10px] font-bold">
                    {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.fullName?.split(' ')[0] || 'Dashboard'}</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  title="Sign Out"
                  className="p-1 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tagline Badge */}
            <div className="hidden lg:flex items-center gap-1 text-[10px] font-semibold text-indiagreen">
              <ShieldCheck className="w-3 h-3 text-indiagreen" />
              <span>RERA Data Aligned • Open Econometric Architecture</span>
            </div>
          </div>
        ) : (
          /* Unauthenticated Gateway Header Right Side */
          <div className="flex flex-col items-center md:items-end gap-1.5">
            <div className="flex items-center gap-2">
              {isRegisterPage || isForgotPasswordPage ? (
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold bg-navy-800 hover:bg-navy-900 text-white rounded-md flex items-center gap-1.5 shadow-sm transition"
                >
                  <LogIn className="w-3.5 h-3.5 text-saffron" />
                  <span>Citizen Sign In</span>
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-bold bg-saffron hover:bg-saffron-dark text-slate-950 rounded-md flex items-center gap-1.5 shadow-sm transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>New Citizen Registration</span>
                </Link>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-indiagreen">
              <ShieldCheck className="w-3 h-3 text-indiagreen" />
              <span>Official Government Valuation Gateway</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
