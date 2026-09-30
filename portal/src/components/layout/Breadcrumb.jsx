import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_KEYS = {
  estimate: 'nav.estimate',
  'how-it-works': 'nav.howItWorks',
  insights: 'nav.insights',
  'market-insights': 'nav.insights',
  'city-trends': 'nav.cityTrends',
  models: 'nav.models',
  'model-performance': 'nav.models',
  faq: 'nav.faq',
  contact: 'nav.contact',
  login: 'nav.login',
  register: 'nav.register',
  'forgot-password': 'nav.forgotPassword',
  dashboard: 'nav.dashboard',
};

/**
 * Standard Indian Government Breadcrumb Navigation
 */
export function Breadcrumb() {
  const location = useLocation();
  const { t } = useTranslation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="bg-govgrey-100 py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-200 text-xs font-medium text-slate-600">
      <div className="max-w-7xl mx-auto flex items-center space-x-1.5">
        <Link to="/" className="hover:text-navy-700 flex items-center space-x-1 focus:outline-none focus:underline">
          <Home className="w-3.5 h-3.5 text-navy-700" />
          <span>{t('nav.home')}</span>
        </Link>
        {pathnames.map((segment, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const translationKey = ROUTE_KEYS[segment];
          const label = translationKey ? t(translationKey) : segment;

          return (
            <React.Fragment key={to}>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              {isLast ? (
                <span className="font-bold text-slate-900" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link to={to} className="hover:text-navy-700 focus:outline-none focus:underline">
                  {label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}

export default Breadcrumb;
